import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Blob "mo:base/Blob";
import Result "mo:base/Result";
import Option "mo:base/Option";
import Map "mo:base/HashMap";
import Nat32 "mo:base/Nat32";
import Nat64 "mo:base/Nat64";
import Iter "mo:base/Iter";
import Int "mo:base/Int";
import Buffer "mo:base/Buffer";
import Array "mo:base/Array";

actor Lumora {
    // Token Types
    public type Timestamp = Nat64;
    public type Duration = Nat64;
    public type Subaccount = Blob;
    public type Account = { owner : Principal; subaccount : ?Subaccount };
    public type Tokens = Nat;
    public type Memo = Blob;
    public type TxIndex = Nat;
    public type TxLog = Buffer.Buffer<Transaction>;
    public type Value = { #Nat : Nat; #Int : Int; #Blob : Blob; #Text : Text };

    public type Operation = {
        #Approve : Approve;
        #Transfer : Transfer;
        #Burn : Transfer;
        #Mint : Transfer;
    };

    public type CommonFields = {
        memo : ?Memo;
        fee : ?Tokens;
        created_at_time : ?Timestamp;
    };

    public type Approve = CommonFields and {
        from : Account;
        spender : Account;
        amount : Nat;
        expires_at : ?Nat64;
    };

    public type TransferSource = {
        #Init;
        #Icrc1Transfer;
        #Icrc2TransferFrom;
    };

    public type Transfer = CommonFields and {
        spender : Account;
        source : TransferSource;
        to : Account;
        from : Account;
        amount : Tokens;
    };

    public type Transaction = {
        operation : Operation;
        fee : Tokens;
        timestamp : Timestamp;
    };

    public type TransferError = {
        #TooOld;
        #Duplicate : { duplicate_of : TxIndex };
        #CreatedInFuture : { ledger_time : Timestamp };
        #InsufficientFunds : { balance : Tokens };
        #BadFee : { expected_fee : Tokens };
        #TemporarilyUnavailable;
        #GenericError : { error_code : Nat; message : Text };
        #BadBurn : { min_burn_amount : Tokens };
    };

    public type Result<T, E> = { #Ok : T; #Err : E };

    // Event Types
    public type EventId = Nat32;
    public type Event = { 
        id: EventId; 
        title: Text; 
        description: Text;
        createdAt: Time.Time; 
        expiredAt: Time.Time; 
        reward: Nat; 
        image: Blob;
        organizerId: Principal; 
        status: Nat;
        participants: [Participant];
    };

    // Organizer Types
    type Organizer = {
        id: Principal;
        name: Text;
    };

    // Participant Types
    type Participant = {
        id: Principal;
        name: Text;
    };

    // ===== STATE VARIABLES =====
    // Admin
    stable var persistedLog : [Transaction] = [];

    // Transaction Log
    private var log : Buffer.Buffer<Transaction> = Buffer.Buffer<Transaction>(0);
    private stable var isInitialized : Bool = false;

    // Constants
    private let platformFeePercentage: Nat = 10;
    private let platformAccount: Account = { owner = Principal.fromActor(Lumora); subaccount = null };
    private let defaultSubaccount : Subaccount = Blob.fromArrayMut(Array.init(32, 0 : Nat8));
    private let maxMemoSize = 32;
    private let permittedDriftNanos : Duration = 60_000_000_000;
    private let transactionWindowNanos : Duration = 24 * 60 * 60 * 1_000_000_000;

    // Token Configuration
    stable var tokenConfig : {
        initial_mints : [{
            account : { owner : Principal; subaccount : ?Blob };
            amount : Nat;
        }];
        minting_account : { owner : Principal; subaccount : ?Blob };
        token_name : Text;
        token_symbol : Text;
        decimals : Nat8;
        transfer_fee : Nat;
    } = {
        initial_mints = [];
        minting_account = platformAccount;
        token_name = "Lumora";
        token_symbol = "LUM";
        decimals = 0;
        transfer_fee = 0;
    };

    // Organizer Storage
    stable var organizerStorage : [(Principal, Organizer)] = [];
    var organizerStore = Map.HashMap<Principal, Organizer>(0, Principal.equal, Principal.hash);

    // Participant Storage
    stable var participantStorage : [(Principal, Participant)] = [];
    var participantStore = Map.HashMap<Principal, Participant>(0, Principal.equal, Principal.hash);

    // Event Storage
    private stable var nextEventId : EventId = 0;
    stable var eventStorage : [(Principal, [Event])] = [];
    var eventStore = Map.HashMap<Principal, [Event]>(0, Principal.equal, Principal.hash);

    // ===== SYSTEM FUNCTIONS =====
    system func preupgrade() {
        organizerStorage := Iter.toArray(organizerStore.entries());
        eventStorage := Iter.toArray(eventStore.entries());
        participantStorage := Iter.toArray(participantStore.entries());
        persistedLog := log.toArray();
    };

    system func postupgrade() {
        organizerStore := Map.HashMap<Principal, Organizer>(organizerStorage.size(), Principal.equal, Principal.hash);
        for ((key, value) in organizerStorage.vals()) {
            organizerStore.put(key, value);
        };

        eventStore := Map.HashMap<Principal, [Event]>(eventStorage.size(), Principal.equal, Principal.hash);
        for ((key, value) in eventStorage.vals()) {
            eventStore.put(key, value);
        };

        participantStore := Map.HashMap<Principal, Participant>(participantStorage.size(), Principal.equal, Principal.hash);
        for ((key, value) in participantStorage.vals()) {
            participantStore.put(key, value);
        };

        if (not isInitialized) {
            log := makeGenesisChain();
            isInitialized := true;
        } else {
            log := Buffer.Buffer<Transaction>(persistedLog.size());
            for (tx in Array.vals(persistedLog)) { log.add(tx); };
        };
    };

    // ===== TOKEN MANAGEMENT FUNCTIONS =====
    public shared ({ caller }) func icrc1_transfer({
        from_subaccount : ?Subaccount;
        to : Account;
        amount : Tokens;
        fee : ?Tokens;
        memo : ?Memo;
        created_at_time : ?Timestamp;
    }) : async Result<TxIndex, TransferError> {
        let from = { owner = caller; subaccount = from_subaccount };
        applyTransfer({
            spender = from;
            source = #Icrc1Transfer;
            from = from;
            to = to;
            amount = amount;
            fee = fee;
            memo = memo;
            created_at_time = created_at_time;
        });
    };

    public query func icrc1_balance_of(account : Account) : async Tokens {
        balance(account, log);
    };

    public query func icrc1_name() : async Text { tokenConfig.token_name; };
    public query func icrc1_symbol() : async Text { tokenConfig.token_symbol; };
    public query func icrc1_decimals() : async Nat8 { tokenConfig.decimals; };
    public query func icrc1_fee() : async Tokens { tokenConfig.transfer_fee; };
    public query func icrc1_minting_account() : async Account { tokenConfig.minting_account; };
    public query func icrc1_total_supply() : async Tokens {
        balance(tokenConfig.minting_account, log);
    };

    // ===== HELPERS FUNCTIONS =====
    private func accountsEqual(lhs : Account, rhs : Account) : Bool {
        let lhsSubaccount = Option.get(lhs.subaccount, defaultSubaccount);
        let rhsSubaccount = Option.get(rhs.subaccount, defaultSubaccount);
        Principal.equal(lhs.owner, rhs.owner) and Blob.equal(lhsSubaccount, rhsSubaccount);
    };

    private func balance(account : Account, log : TxLog) : Nat {
        var sum = 0;
        for (tx in log.vals()) {
            switch (tx.operation) {
                case (#Burn(args)) { if (accountsEqual(args.from, account)) { sum -= args.amount }; };
                case (#Mint(args)) { if (accountsEqual(args.to, account)) { sum += args.amount }; };
                case (#Transfer(args)) {
                    if (accountsEqual(args.from, account)) { sum -= args.amount + tx.fee; };
                    if (accountsEqual(args.to, account)) { sum += args.amount };
                };
                case (#Approve(args)) { if (accountsEqual(args.from, account)) { sum -= tx.fee }; };
            };
        };
        sum;
    };

    private func validateSubaccount(s : ?Subaccount) {
        let subaccount = Option.get(s, defaultSubaccount);
        assert (subaccount.size() == 32);
    };

    private func validateMemo(m : ?Memo) {
        switch (m) { 
            case (null) {}; 
            case (?memo) { 
                assert (memo.size() <= maxMemoSize) 
            }; 
        };
    };

    private func checkTxTime(created_at_time : ?Timestamp, now : Timestamp) : Result<(), TransferError> {
        let txTime : Timestamp = Option.get(created_at_time, now);
        if ((txTime > now) and (txTime - now > permittedDriftNanos)) {
            return #Err(#CreatedInFuture { ledger_time = now });
        };

        if ((txTime < now) and (now - txTime > transactionWindowNanos + permittedDriftNanos)) {
            return #Err(#TooOld);
        };

        #Ok(());
    };

    private func makeGenesisChain() : TxLog {
        validateSubaccount(tokenConfig.minting_account.subaccount);
        let now = Nat64.fromNat(Int.abs(Time.now()));
        let log = Buffer.Buffer<Transaction>(100);

        for ({ account; amount } in Array.vals(tokenConfig.initial_mints)) {
            validateSubaccount(account.subaccount);
            let tx : Transaction = {
                operation = #Mint({
                    spender = tokenConfig.minting_account;
                    source = #Init;
                    from = tokenConfig.minting_account;
                    to = account;
                    amount = amount;
                    fee = null;
                    memo = null;
                    created_at_time = ?now;
                });
                fee = 0;
                timestamp = now;
            };
            log.add(tx);
        };
        log;
    };

    private func classifyTransfer(log : TxLog, transfer : Transfer) : Result<(Operation, Tokens), TransferError> {
        let minter = tokenConfig.minting_account;

        if (Option.isSome(transfer.created_at_time)) {
            switch (findTransfer(transfer, log)) {
                case (?txid) { return #Err(#Duplicate { duplicate_of = txid }) };
                case null {};
            };
        };

        let result = if (accountsEqual(transfer.from, minter) and transfer.source == #Init) {
            if (Option.get(transfer.fee, 0) != 0) { return #Err(#BadFee { expected_fee = 0 }); };
            (#Mint(transfer), 0);
        } else if (accountsEqual(transfer.to, minter) and transfer.source != #Icrc1Transfer) {
            if (Option.get(transfer.fee, 0) != 0) { return #Err(#BadFee { expected_fee = 0 }); };
            if (transfer.amount < tokenConfig.transfer_fee) { return #Err(#BadBurn { min_burn_amount = tokenConfig.transfer_fee }); };
            let debitBalance = balance(transfer.from, log);
            if (debitBalance < transfer.amount) { return #Err(#InsufficientFunds { balance = debitBalance }); };
            (#Burn(transfer), 0);
        } else {
            let effectiveFee = tokenConfig.transfer_fee;
            if (Option.get(transfer.fee, effectiveFee) != effectiveFee) { return #Err(#BadFee { expected_fee = tokenConfig.transfer_fee }); };
            let debitBalance = balance(transfer.from, log);
            if (debitBalance < transfer.amount + effectiveFee) { return #Err(#InsufficientFunds { balance = debitBalance }); };
            (#Transfer(transfer), effectiveFee);
        };

        #Ok(result);
    };

    private func findTransfer(transfer : Transfer, log : TxLog) : ?TxIndex {
        var i = 0;
        for (tx in log.vals()) {
            switch (tx.operation) {
                case (#Burn(args)) { if (args == transfer) { return ?i }; };
                case (#Mint(args)) { if (args == transfer) { return ?i }; };
                case (#Transfer(args)) { if (args == transfer) { return ?i }; };
                case (_) {};
            };
            i += 1;
        };
        null;
    };

    private func recordTransaction(tx : Transaction) : TxIndex {
        let idx = log.size();
        log.add(tx);
        idx;
    };

    private func applyTransfer(args : Transfer) : Result<TxIndex, TransferError> {
        validateSubaccount(args.from.subaccount);
        validateSubaccount(args.to.subaccount);
        validateMemo(args.memo);
        let now = Nat64.fromNat(Int.abs(Time.now()));
        switch (checkTxTime(args.created_at_time, now)) {
            case (#Ok(_)) {};
            case (#Err(e)) { 
                return #Err(e); 
            };
        };

        switch (classifyTransfer(log, args)) {
            case (#Ok((operation, effectiveFee))) {
                #Ok(recordTransaction({ 
                    operation; 
                    fee = effectiveFee; 
                    timestamp = now 
                }));
            };
            case (#Err(e)) { 
                #Err(e); 
            };
        };
    };

    private func isAdmin(caller: Principal) : Bool {
        return caller == platformAccount.owner;
    };
    

    // ===== PUBLIC FUNCTIONS =====
    // Token Functions
    public func getMintingAccountPrincipal() : async Text {
        return Principal.toText(tokenConfig.minting_account.owner);
    };

    private func getBalance(account: Account) : async Nat {
        var balance : Nat = 0;
        
        for (transaction in log.vals()) {
            switch (transaction.operation) {
                case (#Mint(mint)) {
                    if (mint.to == account) {
                        balance += mint.amount;
                    };
                };
                case (#Transfer(transfer)) {
                    if (transfer.to == account) {
                        balance += transfer.amount;
                    };
                    if (transfer.from == account) {
                        balance -= transfer.amount;
                    };
                };
                case (#Burn(burn)) {
                    if (burn.from == account) {
                        balance -= burn.amount;
                    };
                };
            };
        };
        return balance;
    };

    public shared ({ caller }) func getParticipantBalance() : async Result<Nat, Text> {
        if (Principal.isAnonymous(caller)) {
            return #Err("Anonymous participants cannot get balance");
        };

        if (Option.isNull(participantStore.get(caller))) {
            return #Err("Participant not found");
        };

        return #Ok(await getBalance({ owner = caller; subaccount = null }));
    };

    public shared ({ caller }) func getOrganizerBalance() : async Result<Nat, Text> {
        if (Principal.isAnonymous(caller)) {
            return #Err("Anonymous participants cannot get balance");
        };

        if (Option.isNull(organizerStore.get(caller))) {
            return #Err("Organizer not found");
        };

        return #Ok(await getBalance({ owner = caller; subaccount = null }));
    };

    public shared ({ caller }) func mintToOrganizer(organizerId: Principal, amount: Nat) : async Result<Text, Text> {
        if (not isAdmin(caller)) {
            return #Err("Only admin can mint tokens");
        };

        switch (organizerStore.get(organizerId)) {
            case null { return #Err("Organizer not found"); };
            case (?organizer) {
                let now = Nat64.fromNat(Int.abs(Time.now()));
                
                let mintOp : Transaction = {
                    operation = #Mint({
                        from = tokenConfig.minting_account;
                        to = { owner = organizerId; subaccount = null };
                        amount = amount;
                        memo = ?"Mint to organizer";
                        created_at_time = ?now;
                        fee = null;
                        source = #Icrc1Transfer;
                        spender = tokenConfig.minting_account;
                    });
                    fee = 0;
                    timestamp = now;
                };

                log.add(mintOp);
                return #Ok("Tokens minted successfully");
            };
        };
    };
    
    // Authentication Functions
    type RegisterParams = {
        name: Text;
        registerAs: Text;
    };

    public shared ({ caller }) func register(params: RegisterParams) : async Result<Text, Text> {
        if (Principal.isAnonymous(caller)) {
            return #Err("Anonymous users cannot register");
        };

        if (Option.isSome(participantStore.get(caller)) or Option.isSome(organizerStore.get(caller)) or isAdmin(caller)) {
            return #Err("You are already registered");
        };

        switch (params.registerAs) {
            case "participant" {
                let participant : Participant = {
                    id = caller;
                    name = params.name;
                };

                participantStore.put(caller, participant);
                return #Ok("Successfully registered as participant");
            };
            case "organizer" {
                let organizer : Organizer = {
                    id = caller;
                    name = params.name;
                };

                // set initial balance
                let _ = await icrc1_transfer({
                    from_subaccount = null;
                    to = { owner = caller; subaccount = null };
                    amount = 100;
                    fee = null;
                    memo = null;
                    created_at_time = null;
                });
                organizerStore.put(caller, organizer);
                return #Ok("Successfully registered as organizer");
            };
            case _ {
                return #Err("Invalid role. Must be either 'participant' or 'organizer'");
            };
        };
    };

    // Participant Functions
    public shared ({ caller }) func getParticipant() : async Result<Participant, Text> {
        switch (participantStore.get(caller)) {
            case null { return #Err("Participant not found"); };
            case (?participant) { return #Ok(participant); };
        };
    };

    // Organizer Functions
    type CreateOrganizerParams = {
        name: Text;
    };
    
    public shared ({ caller }) func getOrganizer() : async Result<Organizer, Text> {
        switch (organizerStore.get(caller)) {
            case null { return #Err("Organizer not found"); };
            case (?organizer) { return #Ok(organizer); };
        };
    };

    // Event Functions
    type CreateEventParams = {
        title: Text;
        description: Text;
        expiredAt: Time.Time;
        reward: Nat;
        image: Blob;
    };

    public shared ({ caller }) func createEvent(params: CreateEventParams) : async Result<EventId, Text> {
        if (Option.isNull(organizerStore.get(caller))) { 
            return #Err("Only organizers can create events");
        };
        
        let event : Event = {
            id = nextEventId;
            title = params.title;
            description = params.description;
            createdAt = Time.now(); 
            expiredAt = params.expiredAt;
            reward = params.reward;
            image = params.image;
            organizerId = caller;
            status = 0;
            participants = [];
        }; 

        nextEventId += 1;
        
        eventStore.put(caller, [event]);
        return #Ok(event.id);
    };

    public shared ({ caller }) func getEvents() : async Result<[Event], Text> {
        if (Option.isNull(organizerStore.get(caller))) {
            return #Err("Only organizers can get events");
        };
        switch (eventStore.get(caller)) {
            case null { return #Ok([]); };
            case (?events) { return #Ok(events); };
        };
    };

    public shared ({ caller }) func getEvent(id: EventId) : async Result<Event, Text> {
        if (Option.isNull(organizerStore.get(caller))) {
            return #Err("Only organizers can get events");
        };
        switch (eventStore.get(caller)) {
            case null { return #Err("No events found"); };
            case (?events) {
                for (event in events.vals()) {
                    if (event.id == id) {
                        return #Ok(event);
                    };
                };
            };
        };
        return #Err("Event not found");
    };

    public shared ({ caller }) func deleteEvent(eventId: EventId) : async Result<Text, Text> {
        if (Option.isNull(organizerStore.get(caller))) {
            return #Err("Only organizers can delete events");
        };

        switch (eventStore.get(caller)) {
            case null { return #Err("No events found") };
            case (?events) {
                let filteredEvents = Array.filter<Event>(events, func(event) = event.id != eventId);
                
                if (filteredEvents.size() == events.size()) {
                    return #Err("Event not found or you don't have permission to delete this event");
                };

                eventStore.put(caller, filteredEvents);
                return #Ok("Event deleted successfully");
            };
        };
    };

    public shared ({ caller }) func joinEvent(eventId: EventId) : async Result<Text, Text> {
        if (Principal.isAnonymous(caller)) {
            return #Err("Anonymous participants cannot join events");
        };

        let participantResult = participantStore.get(caller);
        switch (participantResult) {
            case null { return #Err("Participant not found") };
            case (?participant) {
                switch (eventStore.get(caller)) {
                    case (?events) {
                        for (event in events.vals()) {
                            if (event.id == eventId) {
                                return #Err("You have already joined this event");
                            };
                        };
                    };
                    case null {};
                };

                let eventResult = await getEvent(eventId);
                switch (eventResult) {
                    case (#Err(msg)) { return #Err(msg) };
                    case (#Ok(event)) {
                        if (event.status == 0) {
                            return #Err("Event is not active");
                        };
                        if (event.expiredAt < Time.now()) {
                            return #Err("Event has expired");
                        };

                        let updatedEvent : Event = {
                            id = event.id;
                            title = event.title;
                            description = event.description;
                            createdAt = event.createdAt;
                            expiredAt = event.expiredAt;
                            reward = event.reward;
                            image = event.image;
                            organizerId = event.organizerId;
                            status = event.status;
                            participants = Array.append(event.participants, [participant]);
                        };

                        eventStore.put(event.organizerId, [updatedEvent]);
                        return #Ok("Successfully joined the event");
                    };
                };
            };
        };
    };

    public shared ({ caller }) func getParticipantEvents(participantId: Principal) : async [Event] {
        var participantEvents : [Event] = [];
        
        for ((organizerId, events) in eventStore.entries()) {
            for (event in events.vals()) {
                for (participant in event.participants.vals()) {
                    if (participant.id == participantId) {
                        participantEvents := Array.append(participantEvents, [event]);
                    };
                };
            };
        };
        
        return participantEvents;
    };

    public shared ({ caller }) func rewardParticipant(eventId: EventId, participantId: Principal) : async Result<Text, Text> {
        if (Option.isNull(organizerStore.get(caller))) {
            return #Err("Only organizers can reward participants");
        };

        switch (participantStore.get(participantId)) {
            case null { return #Err("Participant not found"); };
            case (?participant) {
                let eventResult = await getEvent(eventId);
                switch (eventResult) {
                    case (#Err(msg)) { return #Err(msg) };
                    case (#Ok(event)) {
                        if (event.organizerId != caller) {
                            return #Err("Event not owned by this organizer");
                        };

                        if (event.status != 1) { 
                            return #Err("Event is not active");
                        };

                        if (event.expiredAt < Time.now()) {
                            return #Err("Event has expired");
                        };

                        var isParticipantJoined = false;
                        for (p in event.participants.vals()) {
                            if (p.id == participantId) {
                                isParticipantJoined := true;
                            };
                        };

                        if (not isParticipantJoined) {
                            return #Err("Participant has not joined this event");
                        };

                        let participantEvents = await getParticipantEvents(participantId);
                        for (participantEvent in participantEvents.vals()) {
                            if (participantEvent.id == eventId) {
                                return #Err("Participant has already received reward for this event");
                            };
                        };

                        let organizerBalance = await getOrganizerBalance();
                        switch (organizerBalance) {
                            case (#Err(msg)) { return #Err(msg) };
                            case (#Ok(balance)) {
                                if (balance < event.reward) {
                                    return #Err("Organizer does not have enough balance to reward participant");
                                };
                            };
                        };

                        let now = Nat64.fromNat(Int.abs(Time.now()));
                        let memoText = "Reward for event: " # Nat32.toText(event.id);
                        let transferOp : Transaction = {
                            operation = #Transfer({
                                from = { owner = caller; subaccount = null };
                                to = { owner = participantId; subaccount = null };
                                amount = event.reward;
                                memo = ?Text.encodeUtf8(memoText);
                                created_at_time = ?now;
                                fee = null;
                                source = #Icrc1Transfer;
                                spender = { owner = caller; subaccount = null };
                            });
                            fee = 0;
                            timestamp = now;
                        };

                        let updatedEvent : Event = {
                            id = event.id;
                            title = event.title;
                            description = event.description;
                            createdAt = event.createdAt;
                            expiredAt = event.expiredAt;
                            reward = event.reward;
                            image = event.image;
                            organizerId = event.organizerId;
                            status = event.status;
                            participants = event.participants;
                        };

                        log.add(transferOp);
                        eventStore.put(caller, [updatedEvent]);

                        return #Ok("Participant rewarded successfully");
                    };
                };
            };
        };
    };

    // Utility Functions
    public query func getInitializationStatus() : async Bool {
        return isInitialized;
    };

    public query func getGenesisTransaction() : async ?Transaction {
        if (log.size() > 0) {
            return ?log.get(0);
        };
        return null;
    };
};
