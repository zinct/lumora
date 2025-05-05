import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import HashMap "mo:base/HashMap";
import Hash "mo:base/Hash";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Bool "mo:base/Bool";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Nat64 "mo:base/Nat64";
import TokenCanister "canister:token";
import Blob "mo:base/Blob";
import Debug "mo:base/Debug";

actor NFT {
    type Result<T, E> = { #Ok : T; #Err : E };

    stable var isInitialized : Bool = false;
    stable var nftConfig : {
        nftName : Text;
        nftSymbol : Text;
    } = {
        nftName = "";
        nftSymbol = "";
    };

    // ICRC-7 Types
    type TokenId = Nat;
    type TokenMetadata = {
        name : Text;
        description : Text;
        image : Text;
        attributes : [Attribute];
    };
    type Attribute = {
        trait_type : Text;
        value : Text;
    };
    type TokenInfo = {
        owner : Principal;
        metadata : TokenMetadata;
        createdAt : Time.Time;
        maxRedemptions : ?Nat; 
        currentRedemptions : Nat;
        redemptionPrice : Nat;
        redeemedBy : [Principal];
    };

    // Custom hash function for Nat
    private func natHash(n : Nat) : Hash.Hash {
        let bytes = Nat.toText(n);
        Text.hash(bytes)
    };

    private stable var nextTokenId : TokenId = 0;
    private var tokens = HashMap.HashMap<TokenId, TokenInfo>(0, Nat.equal, natHash);
    private var ownerTokens = HashMap.HashMap<Principal, [TokenId]>(0, Principal.equal, Principal.hash);

    type TransferEvent = {
        from : Principal;
        to : Principal;
        tokenId : TokenId;
    };

    type RedeemEvent = {
        tokenId : TokenId;
        redeemedBy : Principal;
        redeemedAt : Time.Time;
        price : Nat;
        redemptionNumber : Nat; 
    };

    private var transferEvents = Buffer.Buffer<TransferEvent>(0);
    private var redeemEvents = Buffer.Buffer<RedeemEvent>(0);

    // Access Control
    stable var admin : Principal = Principal.fromActor(NFT);

    private func isAdmin(caller : Principal) : Bool {
        Principal.equal(caller, admin)
    };


    public type InitializeParams = {
        nftName : Text;
        nftSymbol : Text;
    };

    public shared({ caller }) func initialize(params : InitializeParams) : async Result<Text, Text> {
        if (isInitialized) {
            return #Err("NFT already initialized");
        };

        if (Principal.isAnonymous(caller)) {
            return #Err("Cannot initialize NFT with anonymous principal");
        };

        admin := caller;
        isInitialized := true;
        nftConfig := {
            nftName = params.nftName;
            nftSymbol = params.nftSymbol;
        };

        #Ok("NFT initialized successfully")
    };

    // ICRC-7 Standard Interface
    public query func icrc7_name() : async Text {
        nftConfig.nftName
    };

    public query func icrc7_symbol() : async Text {
        nftConfig.nftSymbol
    };

    public query func icrc7_token_metadata(tokenId: Text) : async ?[(Text, Text)] {
        let id = Nat.fromText(tokenId);
        switch (id) {
            case (null) { null };
            case (?natId) {
                switch (tokens.get(natId)) {
                    case (null) { null };
                    case (?tokenInfo) {
                        let metadata = tokenInfo.metadata;
                        let metadataArray = Buffer.Buffer<(Text, Text)>(0);
                        
                        // Add basic metadata
                        metadataArray.add(("name", metadata.name));
                        metadataArray.add(("description", metadata.description));
                        metadataArray.add(("image", metadata.image));
                        
                        // Add attributes
                        for (attr in metadata.attributes.vals()) {
                            metadataArray.add((attr.trait_type, attr.value));
                        };
                        
                        // Add additional metadata
                        metadataArray.add(("created_at", Int.toText(tokenInfo.createdAt)));
                        metadataArray.add(("max_redemptions", switch(tokenInfo.maxRedemptions) {
                            case (null) { "infinite" };
                            case (?max) { Nat.toText(max) };
                        }));
                        metadataArray.add(("current_redemptions", Nat.toText(tokenInfo.currentRedemptions)));
                        metadataArray.add(("redemption_price", Nat.toText(tokenInfo.redemptionPrice)));
                        
                        ?Buffer.toArray(metadataArray)
                    };
                }
            };
        }
    };

    public query func icrc7_owner_of(tokenId: Text) : async ?Text {
        let id = Nat.fromText(tokenId);
        switch (id) {
            case (null) { null };
            case (?natId) {
                switch (tokens.get(natId)) {
                    case (null) { null };
                    case (?tokenInfo) { ?Principal.toText(tokenInfo.owner) };
                }
            };
        }
    };

    public query func icrc7_balance_of(owner: Principal) : async Nat {
        switch (ownerTokens.get(owner)) {
            case (null) { 0 };
            case (?tokens) { tokens.size() };
        }
    };

    public query func icrc7_tokens_of(owner: Principal) : async [Text] {
        switch (ownerTokens.get(owner)) {
            case (null) { [] };
            case (?tokens) {
                Array.map<Nat, Text>(tokens, func(tokenId) = Nat.toText(tokenId))
            };
        }
    };

    public query func icrc7_supported_standards() : async [{ name: Text; url: Text }] {
        [
            { 
                name = "ICRC-7"; 
                url = "https://github.com/dfinity/ICRC-1/tree/main/standards/ICRC-7" 
            }
        ]
    };

    public shared(msg) func mint(
        metadata : TokenMetadata, 
        price : Nat,
        maxRedemptions : ?Nat // Optional Nat, null means infinite
    ) : async Result<TokenId, Text> {
        if (not isAdmin(msg.caller)) {
            return #Err("Only admin can mint tokens");
        };

        let tokenId = nextTokenId;
        nextTokenId += 1;

        let tokenInfo : TokenInfo = {
            owner = msg.caller;
            metadata = metadata;
            createdAt = Time.now();
            maxRedemptions = maxRedemptions;
            currentRedemptions = 0;
            redemptionPrice = price;
            redeemedBy = [];
        };

        tokens.put(tokenId, tokenInfo);
        
        let ownerTokenList = switch (ownerTokens.get(msg.caller)) {
            case (null) { [] };
            case (?list) { list };
        };
        ownerTokens.put(msg.caller, Array.append(ownerTokenList, [tokenId]));

        #Ok(tokenId)
    };

    public shared(msg) func transfer(to : Principal, tokenId : TokenId) : async Result<(), Text> {
        switch (tokens.get(tokenId)) {
            case (null) { 
                #Err("Token does not exist")
            };
            case (?tokenInfo) {
                if (tokenInfo.owner != msg.caller) {
                    return #Err("Not authorized to transfer this token");
                };

                let updatedTokenInfo : TokenInfo = {
                    owner = to;
                    metadata = tokenInfo.metadata;
                    createdAt = tokenInfo.createdAt;
                    maxRedemptions = tokenInfo.maxRedemptions;
                    currentRedemptions = tokenInfo.currentRedemptions;
                    redemptionPrice = tokenInfo.redemptionPrice;
                    redeemedBy = tokenInfo.redeemedBy;
                };
                tokens.put(tokenId, updatedTokenInfo);

                let oldOwnerTokens = switch (ownerTokens.get(msg.caller)) {
                    case (null) { [] };
                    case (?list) { list };
                };
                let newOwnerTokens = switch (ownerTokens.get(to)) {
                    case (null) { [] };
                    case (?list) { list };
                };

                let filteredOldTokens = Array.filter(oldOwnerTokens, func(t : TokenId) : Bool { t != tokenId });
                ownerTokens.put(msg.caller, filteredOldTokens);
                ownerTokens.put(to, Array.append(newOwnerTokens, [tokenId]));

                transferEvents.add({
                    from = msg.caller;
                    to = to;
                    tokenId = tokenId;
                });

                #Ok()
            };
        }
    };

    public shared({ caller }) func redeem(tokenId : TokenId) : async Result<Text, Text> {
        switch (tokens.get(tokenId)) {
            case (null) { 
                #Err("Token does not exist")
            };
            case (?tokenInfo) {
                let hasRedeemed = Array.find<Principal>(
                    tokenInfo.redeemedBy,
                    func(p) { Principal.equal(p, caller) }
                );
                
                if (Option.isSome(hasRedeemed)) {
                    return #Err("You have already redeemed this token");
                };

                switch (tokenInfo.maxRedemptions) {
                    case (null) { };
                    case (?max) {
                        if (tokenInfo.currentRedemptions >= max) {
                            return #Err("Maximum redemptions reached for this token");
                        };
                    };
                };

                // Transfer tokens using ICRC-2
                Debug.print("Caller: " # Principal.toText(caller));
                let transferResult = await TokenCanister.icrc2_transfer_from({
                    spender_subaccount = null;
                    from = {
                        owner = caller; 
                        subaccount = null;
                    };
                    to = {
                        owner = Principal.fromActor(NFT); 
                        subaccount = null;
                    };
                    amount = tokenInfo.redemptionPrice;
                    fee = null;
                    memo = ?Blob.toArray(Text.encodeUtf8("Redemption of NFT " # Nat.toText(tokenId)));
                    created_at_time = ?Nat64.fromNat(Int.abs(Time.now()));
                });

                switch (transferResult) {
                    case (#Err(err)) {
                        return #Err("Failed to transfer tokens: " # debug_show(err));
                    };
                    case (#Ok(_)) {};
                };

                // Update token info after successful transfer
                let updatedTokenInfo : TokenInfo = {
                    owner = tokenInfo.owner;
                    metadata = tokenInfo.metadata;
                    createdAt = tokenInfo.createdAt;
                    maxRedemptions = tokenInfo.maxRedemptions;
                    currentRedemptions = tokenInfo.currentRedemptions + 1;
                    redemptionPrice = tokenInfo.redemptionPrice;
                    redeemedBy = Array.append(tokenInfo.redeemedBy, [caller]);
                };
                tokens.put(tokenId, updatedTokenInfo);

                redeemEvents.add({
                    tokenId = tokenId;
                    redeemedBy = caller;
                    redeemedAt = Time.now();
                    price = tokenInfo.redemptionPrice;
                    redemptionNumber = tokenInfo.currentRedemptions + 1;
                });

                #Ok("NFT redeemed successfully")
            };
        }
    };

    // Query Functions
    public query func getTokenInfo(tokenId : TokenId) : async Result<?TokenInfo, Text> {
        switch (tokens.get(tokenId)) {
            case (null) { #Ok(null) };
            case (?tokenInfo) { #Ok(?tokenInfo) };
        }
    };

    public shared query({ caller }) func getRedeemedTokens() : async Result<[(TokenId, TokenMetadata, Nat, ?Nat, Nat)], Text> {
        let redeemedTokens = Buffer.Buffer<(TokenId, TokenMetadata, Nat, ?Nat, Nat)>(0);
        
        for ((tokenId, tokenInfo) in tokens.entries()) {
            let hasRedeemed = Array.find<Principal>(
                tokenInfo.redeemedBy,
                func(p) { Principal.equal(p, caller) }
            );
            
            if (Option.isSome(hasRedeemed)) {
                redeemedTokens.add((
                    tokenId, 
                    tokenInfo.metadata, 
                    tokenInfo.redemptionPrice,
                    tokenInfo.maxRedemptions,
                    tokenInfo.currentRedemptions
                ));
            };
        };
        
        #Ok(Buffer.toArray(redeemedTokens))
    };

    public func getOwnerTokens({ caller: Principal }) : async Result<[TokenId], Text> {
        Debug.print("Caller: " # Principal.toText(caller));
        switch (ownerTokens.get(caller)) {
            case (null) { #Ok([]) };
            case (?tokens) { #Ok(tokens) };
        }
    };

    public query func getTransferEvents() : async Result<[TransferEvent], Text> {
        #Ok(Buffer.toArray(transferEvents))
    };

    public query func getRedeemEvents() : async Result<[RedeemEvent], Text> {
        #Ok(Buffer.toArray(redeemEvents))
    };

    public query func getRedemptionStatus(tokenId : TokenId, caller : Principal) : async Result<?{
        maxRedemptions : ?Nat;
        currentRedemptions : Nat;
        available : Bool;
        hasUserRedeemed : Bool;
    }, Text> {
        switch (tokens.get(tokenId)) {
            case (null) { #Ok(null) };
            case (?tokenInfo) {
                #Ok(?{
                    maxRedemptions = tokenInfo.maxRedemptions;
                    currentRedemptions = tokenInfo.currentRedemptions;
                    available = switch (tokenInfo.maxRedemptions) {
                        case (null) { true }; // Always available for infinite
                        case (?max) { tokenInfo.currentRedemptions < max };
                    };
                    hasUserRedeemed = Option.isSome(
                        Array.find<Principal>(
                            tokenInfo.redeemedBy,
                            func(p) { Principal.equal(p, caller) }
                        )
                    );
                })
            };
        }
    };

    public shared query({ caller }) func getAvailableNFTs() : async Result<[(TokenId, TokenMetadata, Nat, ?Nat, Nat, Bool)], Text> {
        let available = Buffer.Buffer<(TokenId, TokenMetadata, Nat, ?Nat, Nat, Bool)>(0);
        for ((tokenId, tokenInfo) in tokens.entries()) {
            let isAvailable = switch (tokenInfo.maxRedemptions) {
                case (null) { true };
                case (?max) { tokenInfo.currentRedemptions < max };
            };
            if (isAvailable) {
                let hasRedeemed = Array.find<Principal>(
                    tokenInfo.redeemedBy,
                    func(p) { Principal.equal(p, caller) }
                );

                available.add((
                    tokenId, 
                    tokenInfo.metadata, 
                    tokenInfo.redemptionPrice,
                    tokenInfo.maxRedemptions,
                    tokenInfo.currentRedemptions,
                    Option.isSome(hasRedeemed)
                ));
            };
        };
        #Ok(Buffer.toArray(available))
    };


    stable var stableTokens : [(TokenId, TokenInfo)] = [];
    stable var stableOwnerTokens : [(Principal, [TokenId])] = [];
    stable var stableTransferEvents : [TransferEvent] = [];
    stable var stableRedeemEvents : [RedeemEvent] = [];

    system func preupgrade() {
        stableTokens := Iter.toArray(tokens.entries());
        stableOwnerTokens := Iter.toArray(ownerTokens.entries());
        stableTransferEvents := Buffer.toArray(transferEvents);
        stableRedeemEvents := Buffer.toArray(redeemEvents);
    };

    system func postupgrade() {
        tokens := HashMap.fromIter<TokenId, TokenInfo>(
            stableTokens.vals(),
            0,
            Nat.equal,
            natHash
        );
        ownerTokens := HashMap.fromIter<Principal, [TokenId]>(
            stableOwnerTokens.vals(),
            0,
            Principal.equal,
            Principal.hash
        );
        transferEvents := Buffer.Buffer<TransferEvent>(stableTransferEvents.size());
        for (event in stableTransferEvents.vals()) {
            transferEvents.add(event);
        };
        redeemEvents := Buffer.Buffer<RedeemEvent>(stableRedeemEvents.size());
        for (event in stableRedeemEvents.vals()) {
            redeemEvents.add(event);
        };

        stableTokens := [];
        stableOwnerTokens := [];
        stableTransferEvents := [];
        stableRedeemEvents := [];
    };
};
