import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Map "mo:base/HashMap";
import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Blob "mo:base/Blob";
import Nat8 "mo:base/Nat8";
import Types "../types";
import TokenCanister "canister:token";

module {
    type Result<T, E> = Types.Result<T, E>;
    type ProjectLevel = Types.ProjectLevel;
    type Project = Types.Project;
    type Community = Types.Community;
    type GetCommunitySubmissionsResult = Types.GetCommunitySubmissionsResult;
    type GetCommunityRewardsResult = Types.GetCommunityRewardsResult;
    type Participant = Types.Participant;

    public class CommunityModule(
        communityStore: Map.HashMap<Principal, Community>,
        projectStore: Map.HashMap<Principal, [Project]>,
        participantStore: Map.HashMap<Principal, Participant>,
        getImage: (Text) -> async ?Blob
    ) {
        public func calculateProjectStatus(startDate: Time.Time, expiredAt: Time.Time, currentStatus: Nat) : Nat {
            let now = Time.now();
            
            if (currentStatus == 0 or currentStatus == 4) {
                return currentStatus;
            };

            if (now < startDate) {
                return 2;
            };

            if (now > expiredAt) {
                return 3;
            };

            return 1;
        };

        public func getCommunity(caller: Principal) : Result<Community, Text> {
            switch (communityStore.get(caller)) {
                case null { return #Err("Community not found"); };
                case (?community) { return #Ok(community); };
            };
        };

        public func getCommunityProjects(caller: Principal) : Result<[Project], Text> {
            if(Principal.isAnonymous(caller)) {
                return #Err("Anonymous cannot get community projects");
            };

            switch (communityStore.get(caller)) {
                case null { return #Err("Community not found"); };
                case (?community) {
                    var communityProjects : [Project] = [];
                    
                    for ((communityId, projects) in projectStore.entries()) {
                        if (communityId == caller) {
                            for (project in projects.vals()) {
                                let currentStatus = calculateProjectStatus(project.startDate, project.expiredAt, project.status);
                                let updatedProject = {
                                    id = project.id;
                                    title = project.title;
                                    description = project.description;
                                    category = project.category;
                                    createdAt = project.createdAt;
                                    startDate = project.startDate;
                                    expiredAt = project.expiredAt;
                                    reward = project.reward;
                                    imageUrl = project.imageUrl;
                                    communityId = project.communityId;
                                    status = currentStatus;
                                    maxParticipants = project.maxParticipants;
                                    participants = project.participants;
                                    address = project.address;
                                    impact = project.impact;
                                    evidence = project.evidence;
                                    projectLevel = project.projectLevel;
                                };
                                communityProjects := Array.append(communityProjects, [updatedProject]);
                            };
                        };
                    };
                    
                    return #Ok(communityProjects);
                };
            };
        };

        public func getCommunitySubmissions(caller: Principal) : async Result<[GetCommunitySubmissionsResult], Text> {
            if(Principal.isAnonymous(caller)) {
                return #Err("Anonymous cannot get community submissions");
            };

            switch (communityStore.get(caller)) {
                case null { return #Err("Community not found"); };
                case (?community) {
                    var communitySubmissions : [GetCommunitySubmissionsResult] = [];

                    for ((communityId, projects) in projectStore.entries()) {
                        if (communityId == caller) {
                            for (project in projects.vals()) {
                                for (evidence in project.evidence.vals()) {
                                    switch (participantStore.get(evidence.participantId)) {
                                        case null {};
                                        case (?participant) {
                                            let imageData = Buffer.Buffer<Blob>(0);
                                            for (imageUrl in evidence.imageUrl.vals()) {
                                                let key = switch (Text.stripStart(imageUrl, #char('/'))) {
                                                    case (?k) { k };
                                                    case null { imageUrl };
                                                };
                                                let image = await getImage(key);
                                                switch (image) {
                                                    case (?blob) { imageData.add(blob) };
                                                    case null {};
                                                };
                                            };

                                            let submission : GetCommunitySubmissionsResult = {
                                                id = evidence.id;
                                                projectId = evidence.projectId;
                                                participantId = evidence.participantId;
                                                description = evidence.description;
                                                imageUrl = evidence.imageUrl;
                                                timestamp = evidence.timestamp;
                                                status = evidence.status;
                                                imageData = Buffer.toArray(imageData);
                                                communityName = community.name;
                                                participant = participant;
                                                projectName = project.title;
                                                communityImpact = project.impact;
                                                feedback = evidence.feedback;
                                            };
                                            communitySubmissions := Array.append(communitySubmissions, [submission]);
                                        };
                                    };
                                };
                            };
                        };
                    };

                    return #Ok(communitySubmissions);
                };
            };
        };

        public func getCommunityRewards(caller: Principal) : async Result<[GetCommunityRewardsResult], Text> {
            if(Principal.isAnonymous(caller)) {
                return #Err("Anonymous cannot get community rewards");
            };

            switch (communityStore.get(caller)) {
                case null { return #Err("Community not found"); };
                case (?_) {
                    var communityRewards : [GetCommunityRewardsResult] = [];
                    
                    for ((communityId, projects) in projectStore.entries()) {
                        if (communityId == caller) {
                            for (project in projects.vals()) {
                                let currentStatus = calculateProjectStatus(project.startDate, project.expiredAt, project.status);
                                
                                // Check if all evidence is approved and project is expired
                                var hasPendingEvidence = false;
                                var allEvidenceApproved = true;
                                let now = Time.now();
                                
                                for (evidence in project.evidence.vals()) {
                                    if (evidence.status == #pending) {
                                        hasPendingEvidence := true;
                                        allEvidenceApproved := false;
                                    };
                                };

                                // Determine reward status
                                let rewardStatus = if (currentStatus == 4) {
                                    2 // distributed
                                } else if (now > project.expiredAt and allEvidenceApproved) {
                                    1 // pending
                                } else {
                                    0 // closed
                                };

                                // Fetch image data if imageUrl exists
                                let imageData = switch (project.imageUrl) {
                                    case (?url) {
                                        let key = switch (Text.stripStart(url, #char('/'))) {
                                            case (?k) { k };
                                            case null { url };
                                        };
                                        await getImage(key);
                                    };
                                    case null { null };
                                };

                                let rewardResult : GetCommunityRewardsResult = {
                                    id = project.id;
                                    title = project.title;
                                    description = project.description;
                                    category = project.category;
                                    createdAt = project.createdAt;
                                    startDate = project.startDate;
                                    expiredAt = project.expiredAt;
                                    reward = project.reward;
                                    imageUrl = project.imageUrl;
                                    imageData = imageData;
                                    status = rewardStatus;
                                    maxParticipants = project.maxParticipants;
                                    participants = project.participants;
                                    communityId = communityId;
                                    address = project.address;
                                    impact = project.impact;
                                    evidence = project.evidence;
                                    projectLevel = project.projectLevel;
                                };
                                
                                communityRewards := Array.append(communityRewards, [rewardResult]);
                            };
                        };
                    };
                    
                    return #Ok(communityRewards);
                };
            };
        };

        public func getCommunityLevel(caller: Principal) : async Result<ProjectLevel, Text> {
            switch (communityStore.get(caller)) {
                case null { return #Err("Community not found"); };
                case (?_) {
                    let balance = await TokenCanister.icrc1_balance_of({ owner = caller; subaccount = null });
                    let balanceInLum = balance / (10 ** Nat8.toNat(await TokenCanister.getDecimals()));

                    if (balanceInLum >= 2000) {
                        return #Ok(#diamond);
                    } else if (balanceInLum >= 500) {
                        return #Ok(#gold);
                    } else if (balanceInLum >= 100) {
                        return #Ok(#silver);
                    } else {
                        return #Ok(#bronze);
                    };
                };
            };
        };
    };
}; 