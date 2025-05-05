import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Option "mo:base/Option";
import Map "mo:base/HashMap";
import Types "../types";
import TokenCanister "canister:token";

module {
    type Result<T, E> = Types.Result<T, E>;
    type Community = Types.Community;
    type Participant = Types.Participant;
    type RegisterParams = Types.RegisterParams;

    public class AuthModule(
        participantStore: Map.HashMap<Principal, Participant>,
        communityStore: Map.HashMap<Principal, Community>
    ) {
        public func register(caller: Principal, params: RegisterParams) : Result<Text, Text> {
            if (Principal.isAnonymous(caller)) {
                return #Err("Anonymous users cannot register");
            };

            if (Option.isSome(participantStore.get(caller)) or Option.isSome(communityStore.get(caller))) {
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
                    
                    communityStore.put(caller, community);
                    return #Ok("Successfully registered as community");
                };
                case _ {
                    return #Err("Invalid role. Must be either 'participant' or 'community'");
                };
            };
        };

        public func getProfile(caller: Principal) : async Result<Text, Text> {
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
                            balance = await TokenCanister.icrc1_balance_of({ owner = participant.id; subaccount = null });
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
                            balance = await TokenCanister.icrc1_balance_of({ owner = community.id; subaccount = null });
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
    };
}; 