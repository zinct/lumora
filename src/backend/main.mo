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

    // Project Types
    public type ProjectId = Nat32;
    public type Project = { 
        id: ProjectId; 
        title: Text; 
        description: Text;
        category: Text;
        createdAt: Time.Time; 
        expiredAt: Time.Time; 
        reward: Nat; 
        image: ?Blob;
        communityId: Principal; 
        status: Nat;
        maxParticipants: Nat;
        participants: [Participant];
    };

    // Community Types
    type Community = {
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

    // Community Storage
    stable var communityStorage : [(Principal, Community)] = [];
    var communityStore = Map.HashMap<Principal, Community>(0, Principal.equal, Principal.hash);

    // Participant Storage
    stable var participantStorage : [(Principal, Participant)] = [];
    var participantStore = Map.HashMap<Principal, Participant>(0, Principal.equal, Principal.hash);

    // Project Storage
    private stable var nextProjectId : ProjectId = 0;
    stable var projectStorage : [(Principal, [Project])] = [];
    var projectStore = Map.HashMap<Principal, [Project]>(0, Principal.equal, Principal.hash);

    // ===== SYSTEM FUNCTIONS =====
    system func preupgrade() {
        communityStorage := Iter.toArray(communityStore.entries());
        projectStorage := Iter.toArray(projectStore.entries());
        participantStorage := Iter.toArray(participantStore.entries());
        persistedLog := log.toArray();
    };

    system func postupgrade() {
        communityStore := Map.HashMap<Principal, Community>(communityStorage.size(), Principal.equal, Principal.hash);
        for ((key, value) in communityStorage.vals()) {
            communityStore.put(key, value);
        };

        projectStore := Map.HashMap<Principal, [Project]>(projectStorage.size(), Principal.equal, Principal.hash);
        for ((key, value) in projectStorage.vals()) {
            projectStore.put(key, value);
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
                case (#Approve(args)) {
                    if (accountsEqual(args.from, account)) { balance -= transaction.fee };
                };
            };
        };
        return balance;
    };

    public shared ({ caller }) func getCommunityBalance() : async Result<Nat, Text> {
        if (Principal.isAnonymous(caller)) {
            return #Err("Anonymous participants cannot get balance");
        };

        if (Option.isNull(communityStore.get(caller))) {
            return #Err("Community not found");
        };

        return #Ok(await getBalance({ owner = caller; subaccount = null }));
    };

    public shared ({ caller }) func mintToCommunity(communityId: Principal, amount: Nat) : async Result<Text, Text> {
        if (not isAdmin(caller)) {
            return #Err("Only admin can mint tokens");
        };

        switch (communityStore.get(communityId)) {
            case null { return #Err("Community not found"); };
            case (?community) {
                let now = Nat64.fromNat(Int.abs(Time.now()));
                
                let mintOp : Transaction = {
                    operation = #Mint({
                        from = tokenConfig.minting_account;
                        to = { owner = communityId; subaccount = null };
                        amount = amount;
                        memo = ?"Mint to community";
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

        if (Option.isSome(participantStore.get(caller)) or Option.isSome(communityStore.get(caller)) or isAdmin(caller)) {
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
            case "community" {
                let community : Community = {
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
                communityStore.put(caller, community);
                return #Ok("Successfully registered as community");
            };
            case _ {
                return #Err("Invalid role. Must be either 'participant' or 'community'");
            };
        };
    };

    public shared func getAllUsers() : async ?[(Text, Text, Nat)] {
        let allUsers = Buffer.Buffer<(Text, Text, Nat)>(0);

        for ((id, participant) in participantStore.entries()) {
            let balance = await getBalance({ owner = id; subaccount = null });
            allUsers.add(("Participant", participant.name, balance));
        };
        
        for ((id, community) in communityStore.entries()) {
            let balance = await getBalance({ owner = id; subaccount = null });
            allUsers.add(("Community", community.name, balance));
        };

        ?Buffer.toArray(allUsers)
    };

    public shared ({ caller }) func getProfile() : async Result<Text, Text> {
        if (Principal.isAnonymous(caller)) { 
            return #Err("Anonymous users cannot login"); 
        };

        if (Option.isSome(participantStore.get(caller))) {
            switch (participantStore.get(caller)) { 
                case (?participant) {
                    let profile = {
                        id = participant.id;
                        name = participant.name;
                        role = "participant";
                    };
                    return #Ok(debug_show(profile));
                };
                case null {
                    return #Err("Participant not found");
                };
            };
        };
        if (Option.isSome(communityStore.get(caller))) {
            switch (communityStore.get(caller)) {
                case (?community) {
                    let profile = {
                        id = community.id;
                        name = community.name;
                        role = "community"; 
                    };
                    return #Ok(debug_show(profile));
                };
                case null {
                    return #Err("Community not found");
                };
            };
        };

        return #Err("User not registered");
    };

    // Participant Functions
    public shared ({ caller }) func getParticipant() : async Result<Participant, Text> {
        switch (participantStore.get(caller)) {
            case null { return #Err("Participant not found"); };
            case (?participant) { return #Ok(participant); };
        };
    };

    // Community Functions
    type CreateCommunityParams = {
        name: Text;
    };
    
    public shared ({ caller }) func getCommunity() : async Result<Community, Text> {
        switch (communityStore.get(caller)) {
            case null { return #Err("Community not found"); };
            case (?community) { return #Ok(community); };
        };
    };

    // Project Functions
    type CreateProjectParams = {
        title: Text;
        description: Text;
        expiredAt: Time.Time;
        reward: Nat;
        image: ?Blob;
        category: Text;
        maxParticipants: Nat;
    };

    public shared ({ caller }) func createProject(params: CreateProjectParams) : async Result<ProjectId, Text> {
        if (Option.isNull(communityStore.get(caller))) { 
            return #Err("Only communities can create projects");
        };
        
        let project : Project = {
            id = nextProjectId;
            title = params.title;
            description = params.description;
            createdAt = Time.now(); 
            expiredAt = params.expiredAt;
            reward = params.reward;
            image = params.image;
            communityId = caller;
            status = 1; // Set status to active by default
            participants = [];
            category = params.category;
            maxParticipants = params.maxParticipants;
        }; 

        nextProjectId += 1;

        // Get existing projects for this community
        let existingProjects = switch (projectStore.get(caller)) {
            case null { [] };
            case (?projects) { projects };
        };
        
        // Append new project to existing projects
        let updatedProjects = Array.append(existingProjects, [project]);
        projectStore.put(caller, updatedProjects);
        
        return #Ok(project.id);
    };

    public query func getProjects() : async Result<[Project], Text> {
        var allProjects : [Project] = [];
        for ((_, projects) in projectStore.entries()) {
            allProjects := Array.append(allProjects, projects);
        };
        return #Ok(allProjects);
    };

    type GetProjectResult = {
        id: ProjectId; 
        title: Text; 
        description: Text;
        category: Text;
        createdAt: Time.Time; 
        expiredAt: Time.Time; 
        reward: Nat; 
        image: ?Blob;
        status: Nat;
        maxParticipants: Nat;
        participants: [Participant];
        communityId: Principal; 
        communityName: Text;
    };

    public func getProject(id: ProjectId) : async Result<GetProjectResult, Text> {
        for ((communityId, projects) in projectStore.entries()) {
            for (project in projects.vals()) {
                if (project.id == id) {
                    let community = switch (communityStore.get(communityId)) {
                        case null { return #Err("Community not found") };
                        case (?c) { c };
                    };
                    return #Ok({
                        id = project.id;
                        title = project.title;
                        description = project.description;
                        category = project.category;
                        createdAt = project.createdAt;
                        expiredAt = project.expiredAt;
                        reward = project.reward;
                        image = project.image;
                        status = project.status;
                        maxParticipants = project.maxParticipants;
                        participants = project.participants;
                        communityId = communityId;
                        communityName = community.name;
                    });
                };
            };
        };
        return #Err("Project not found");
    };

    public shared ({ caller }) func deleteProject(projectId: ProjectId) : async Result<Text, Text> {
        if (Option.isNull(communityStore.get(caller))) {
            return #Err("Only communities can delete projects");
        };

        switch (projectStore.get(caller)) {
            case null { return #Err("No projects found") };
            case (?projects) {
                let filteredProjects = Array.filter<Project>(projects, func(project) = project.id != projectId);
                
                if (filteredProjects.size() == projects.size()) {
                    return #Err("Project not found or you don't have permission to delete this project");
                };

                projectStore.put(caller, filteredProjects);
                return #Ok("Project deleted successfully");
            };
        };
    };

    public shared ({ caller }) func joinProject(projectId: ProjectId) : async Result<Text, Text> {
        if (Principal.isAnonymous(caller)) {
            return #Err("Anonymous participants cannot join projects");
        };

        let participantResult = participantStore.get(caller);
        switch (participantResult) {
            case null { return #Err("Participant not found") };
            case (?participant) {
                switch (projectStore.get(caller)) {
                    case (?projects) {
                        for (project in projects.vals()) {
                            if (project.id == projectId) {
                                return #Err("You have already joined this project");
                            };
                        };
                    };
                    case null {};
                };

                let projectResult = await getProject(projectId);
                switch (projectResult) {
                    case (#Err(msg)) { return #Err(msg) };
                    case (#Ok(project)) {
                        if (project.status == 0) {
                            return #Err("Project is not active");
                        };
                        if (project.expiredAt < Time.now()) {
                            return #Err("Project has expired");
                        };
                        if (project.participants.size() >= project.maxParticipants) {
                            return #Err("Project has reached maximum participants");
                        };

                        let updatedProject : Project = {
                            id = project.id;
                            title = project.title;
                            description = project.description;
                            createdAt = project.createdAt;
                            expiredAt = project.expiredAt;
                            reward = project.reward;
                            image = project.image;
                            communityId = project.communityId;
                            status = project.status;
                            participants = Array.append(project.participants, [participant]);
                            category = project.category;
                            maxParticipants = project.maxParticipants;
                        };

                        projectStore.put(project.communityId, [updatedProject]);
                        return #Ok("Successfully joined the project");
                    };
                };
            };
        };
    };

    public shared ({ caller }) func getParticipantProjects(participantId: Principal) : async [Project] {
        var participantProjects : [Project] = [];
        
        for ((communityId, projects) in projectStore.entries()) {
            for (project in projects.vals()) {
                for (participant in project.participants.vals()) {
                    if (participant.id == participantId) {
                        participantProjects := Array.append(participantProjects, [project]);
                    };
                };
            };
        };
        
        return participantProjects;
    };

    public shared ({ caller }) func rewardParticipant(projectId: ProjectId, participantId: Principal) : async Result<Text, Text> {
        if (Option.isNull(communityStore.get(caller))) {
            return #Err("Only communities can reward participants");
        };

        switch (participantStore.get(participantId)) {
            case null { return #Err("Participant not found"); };
            case (?participant) {
                let projectResult = await getProject(projectId);
                switch (projectResult) {
                    case (#Err(msg)) { return #Err(msg) };
                    case (#Ok(project)) {
                        if (project.communityId != caller) {
                            return #Err("Project not owned by this community");
                        };

                        if (project.status != 1) { 
                            return #Err("Project is not active");
                        };

                        if (project.expiredAt < Time.now()) {
                            return #Err("Project has expired");
                        };

                        var isParticipantJoined = false;
                        for (p in project.participants.vals()) {
                            if (p.id == participantId) {
                                isParticipantJoined := true;
                            };
                        };

                        if (not isParticipantJoined) {
                            return #Err("Participant has not joined this project");
                        };

                        let participantProjects = await getParticipantProjects(participantId);
                        for (participantProject in participantProjects.vals()) {
                            if (participantProject.id == projectId) {
                                return #Err("Participant has already received reward for this project");
                            };
                        };

                        let communityBalance = await getCommunityBalance();
                        switch (communityBalance) {
                            case (#Err(msg)) { return #Err(msg) };
                            case (#Ok(balance)) {
                                if (balance < project.reward) {
                                    return #Err("Community does not have enough balance to reward participant");
                                };
                            };
                        };

                        let now = Nat64.fromNat(Int.abs(Time.now()));
                        let memoText = "Reward for project: " # Nat32.toText(project.id);
                        let transferOp : Transaction = {
                            operation = #Transfer({
                                from = { owner = caller; subaccount = null };
                                to = { owner = participantId; subaccount = null };
                                amount = project.reward;
                                memo = ?Text.encodeUtf8(memoText);
                                created_at_time = ?now;
                                fee = null;
                                source = #Icrc1Transfer;
                                spender = { owner = caller; subaccount = null };
                            });
                            fee = 0;
                            timestamp = now;
                        };

                        let updatedProject : Project = {
                            id = project.id;
                            title = project.title;
                            description = project.description;
                            createdAt = project.createdAt;
                            expiredAt = project.expiredAt;
                            reward = project.reward;
                            image = project.image;
                            communityId = project.communityId;
                            status = project.status;
                            participants = project.participants;
                            category = project.category;
                            maxParticipants = project.maxParticipants;
                        };

                        log.add(transferOp);
                        projectStore.put(caller, [updatedProject]);

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
