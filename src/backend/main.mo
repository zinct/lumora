import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Map "mo:base/HashMap";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Buffer "mo:base/Buffer";
import Nat8 "mo:base/Nat8";
import Nat32 "mo:base/Nat32";
import Debug "mo:base/Debug";
import TokenCanister "canister:token";
import Types "types";
import ProjectModule "modules/project";
import CommunityModule "modules/community";
import ParticipantModule "modules/participant";
import AuthModule "modules/auth";
import StorageModule "modules/storage";

actor Lumora {
    // ===== TYPE DEFINITIONS =====
    type Result<T, E> = { #Ok : T; #Err : E };

    // Import types from types.mo
    type EvidenceId = Types.EvidenceId;
    type ProjectId = Types.ProjectId;
    type ProjectCategory = Types.ProjectCategory;
    type ProjectLevel = Types.ProjectLevel;
    type Project = Types.Project;
    type EvidenceStatus = Types.EvidenceStatus;
    type Evidence = Types.Evidence;
    type CreateProjectParams = Types.CreateProjectParams;
    type GetProjectsResult = Types.GetProjectsResult;
    type GetProjectEvidenceResult = Types.GetProjectEvidenceResult;
    type GetProjectResult = Types.GetProjectResult;
    type SubmitEvidenceParams = Types.SubmitEvidenceParams;
    type GetCommunitySubmissionsResult = Types.GetCommunitySubmissionsResult;
    type CommmunityRewadStatus = Types.CommmunityRewadStatus;
    type GetCommunityRewardsResult = Types.GetCommunityRewardsResult;
    type Community = Types.Community;
    type CreateCommunityParams = Types.CreateCommunityParams;
    type Participant = Types.Participant;
    type RegisterParams = Types.RegisterParams;
    type FeedbackEvidenceParams = Types.FeedbackEvidenceParams;

    // ===== STATE VARIABLES =====
    private stable var nextProjectId : ProjectId = 0;
    private stable var nextEvidenceId : EvidenceId = 0;
    stable var projectStorage : [(Principal, [Project])] = [];
    stable var communityStorage : [(Principal, Community)] = [];
    stable var participantStorage : [(Principal, Participant)] = [];
    var projectStore = Map.HashMap<Principal, [Project]>(0, Principal.equal, Principal.hash);
    var communityStore = Map.HashMap<Principal, Community>(0, Principal.equal, Principal.hash);
    var participantStore = Map.HashMap<Principal, Participant>(0, Principal.equal, Principal.hash);

    // Initialize modules
    private let storageModule = StorageModule.StorageModule();
    private var authModule = AuthModule.AuthModule(participantStore, communityStore);
    private var communityModule = CommunityModule.CommunityModule(
        communityStore,
        projectStore,
        participantStore,
        storageModule.getImage
    );
    private var projectModule = ProjectModule.ProjectModule(
        projectStore,
        communityStore,
        participantStore,
        nextProjectId,
        nextEvidenceId,
        storageModule.getImage,
        storageModule.uploadToStorage,
        communityModule,
        Principal.fromActor(Lumora)
    );
    private var participantModule = ParticipantModule.ParticipantModule(
        participantStore,
        projectStore,
        communityModule.calculateProjectStatus
    );

    // ===== SYSTEM FUNCTIONS =====
    system func preupgrade() {
        // Save all data to stable storage
        communityStorage := Iter.toArray(communityStore.entries());
        projectStorage := Iter.toArray(projectStore.entries());
        participantStorage := Iter.toArray(participantStore.entries());
        
        // Save current IDs from modules
        nextProjectId := projectModule.getCurrentProjectId();
        nextEvidenceId := projectModule.getCurrentEvidenceId();
    };

    system func postupgrade() {
        // Restore data from stable storage
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

        authModule := AuthModule.AuthModule(participantStore, communityStore);
        communityModule := CommunityModule.CommunityModule(
            communityStore,
            projectStore,
            participantStore,
            storageModule.getImage
        );
        projectModule := ProjectModule.ProjectModule(
            projectStore,
            communityStore,
            participantStore,
            nextProjectId,
            nextEvidenceId,
            storageModule.getImage,
            storageModule.uploadToStorage,
            communityModule,
            Principal.fromActor(Lumora)
        );
        participantModule := ParticipantModule.ParticipantModule(
            participantStore,
            projectStore,
            communityModule.calculateProjectStatus
        );
    };

    // ===== AUTHENTICATION FUNCTIONS =====
    public shared ({ caller }) func register(params: RegisterParams) : async Result<Text, Text> {
        authModule.register(caller, params);
    };

    public shared ({ caller }) func getProfile() : async Result<Text, Text> {
        await authModule.getProfile(caller);
    };

    // ===== COMMUNITY FUNCTIONS =====
    public query ({ caller }) func getCommunity() : async Result<Community, Text> {
        communityModule.getCommunity(caller);
    };

    public query ({ caller }) func getCommunityProjects() : async Result<[Project], Text> {
        communityModule.getCommunityProjects(caller);
    };

    public shared ({ caller }) func getCommunitySubmissions() : async Result<[GetCommunitySubmissionsResult], Text> {
        await communityModule.getCommunitySubmissions(caller);
    };

    public shared ({ caller }) func getCommunityRewards() : async Result<[GetCommunityRewardsResult], Text> {
        await communityModule.getCommunityRewards(caller);
    };

    public func getCommunityLevel(caller: Principal) : async Result<ProjectLevel, Text> {
        await communityModule.getCommunityLevel(caller);
    };

    // ===== PARTICIPANT FUNCTIONS =====
    public shared query ({ caller }) func getParticipant() : async Result<Participant, Text> {
        participantModule.getParticipant(caller);
    };

    public query ({ caller }) func getParticipantProjects() : async Result<[Project], Text> {
        participantModule.getParticipantProjects(caller);
    };

    // ===== PROJECT FUNCTIONS =====
    public shared ({ caller }) func createProject(params: CreateProjectParams) : async Result<ProjectId, Text> {
        await projectModule.createProject(caller, params);
    };

    public func getProjects() : async Result<[GetProjectsResult], Text> {
        await projectModule.getProjects();
    };  

    public func getProject(id: ProjectId) : async Result<GetProjectResult, Text> {
        await projectModule.getProject(id);
    };

    public shared ({ caller }) func distributeRewards(projectId: ProjectId) : async Result<Text, Text> {
        await projectModule.distributeRewards(caller, projectId);
    };

    public shared ({ caller }) func deleteProject(projectId: ProjectId) : async Result<Text, Text> {
        await projectModule.deleteProject(caller, projectId);
    };

    public shared ({ caller }) func joinProject(projectId: ProjectId) : async Result<Text, Text> {
        await projectModule.joinProject(caller, projectId);
                    };

    public shared ({ caller }) func submitEvidence(params: SubmitEvidenceParams) : async Result<Text, Text> {
        await projectModule.submitEvidence(caller, params);
    };

    public shared ({ caller }) func feedbackEvidence(params: FeedbackEvidenceParams) : async Result<Text, Text> {
        projectModule.feedbackEvidence(caller, params);
    };

    // ===== ADMIN FUNCTIONS =====
    public func adminChangeSubmissionStatus(evidenceId: EvidenceId, status: EvidenceStatus) : async Result<Text, Text> {
        // Iterate through all projects to find the evidence
        for ((communityId, projects) in projectStore.entries()) {
            for (project in projects.vals()) {
                for (evidence in project.evidence.vals()) {
                    // Convert both IDs to Nat32 for comparison
                    if (Nat32.toNat(evidence.id) == Nat32.toNat(evidenceId)) {
                        // Create updated evidence with new status
                        let updatedEvidence : Evidence = {
                            id = evidence.id;
                            projectId = evidence.projectId;
                            participantId = evidence.participantId;
                            description = evidence.description;
                            feedback = evidence.feedback;
                            imageUrl = evidence.imageUrl;
                            timestamp = evidence.timestamp;
                            status = status;
                        };

                        // Get existing projects for the community
                        let existingProjects = switch (projectStore.get(communityId)) {
                            case null { [] };
                            case (?projects) { projects };
                        };

                        // Update the specific project in the array
                        let updatedProjects = Array.map<Project, Project>(
                            existingProjects,
                            func(p) {
                                if (p.id == project.id) {
                                    {
                                        id = p.id;
                                        title = p.title;
                                        description = p.description;
                                        category = p.category;
                                        createdAt = p.createdAt;
                                        startDate = p.startDate;
                                        expiredAt = p.expiredAt;
                                        reward = p.reward;
                                        imageUrl = p.imageUrl;
                                        communityId = p.communityId;
                                        status = p.status;
                                        maxParticipants = p.maxParticipants;
                                        participants = p.participants;
                                        address = p.address;
                                        impact = p.impact;
                                        evidence = Array.map<Evidence, Evidence>(
                                            p.evidence,
                                            func(e) = if (Nat32.toNat(e.id) == Nat32.toNat(evidenceId)) updatedEvidence else e
                                        );
                                        projectLevel = p.projectLevel;
                                    };
                                } else {
                                    p;
                                };
                            }
                        );

                        projectStore.put(communityId, updatedProjects);
                        return #Ok("Submission status updated successfully");
                    };
                };
            };
        };
        return #Err("Evidence not found");
    };

    public func adminGetAllProjects() : async Result<[GetProjectsResult], Text> {
            var allProjects : [GetProjectsResult] = [];
            for ((communityId, projects) in projectStore.entries()) {
                for (project in projects.vals()) {
                    let _ = switch (communityStore.get(communityId)) {
                        case null { return #Err("Community not found") };
                        case (?c) { c };
                    };

                    let projectResult : GetProjectsResult = {
                        id = project.id;
                        title = project.title;
                        description = project.description;
                        startDate = project.startDate;
                        expiredAt = project.expiredAt;
                        reward = project.reward;
                        imageUrl = project.imageUrl;
                        imageData = null;
                        status = project.status;
                        maxParticipants = project.maxParticipants;
                        participants = project.participants;
                        communityId = communityId;
                        address = project.address;
                        impact = project.impact;
                        evidence = project.evidence;
                        category = project.category;
                        createdAt = project.createdAt;
                        projectLevel = project.projectLevel;
                    };
                    allProjects := Array.append(allProjects, [projectResult]);
                };
            };
            return #Ok(allProjects);
        };

    
    public func adminChangeProjectStatus(projectId: ProjectId, status: Nat) : async Result<Text, Text> {
        // Iterate through all projects to find the one with matching ID
        for ((communityId, projects) in projectStore.entries()) {
            for (project in projects.vals()) {
                if (project.id == projectId) {
                    // Create updated project with new status
                    let updatedProject : Project = {
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
                        status = status;
                        maxParticipants = project.maxParticipants;
                        participants = project.participants;
                        address = project.address;
                        impact = project.impact;
                        evidence = project.evidence;
                        projectLevel = project.projectLevel;
                    };

                    // Get existing projects for the community
                    let existingProjects = switch (projectStore.get(communityId)) {
                        case null { [] };
                        case (?projects) { projects };
                    };

                    // Update the specific project in the array
                    let updatedProjects = Array.map<Project, Project>(
                        existingProjects,
                        func(p) {
                            if (p.id == projectId) {
                                updatedProject;
                            } else {
                                p;
                            };
                        }
                    );

                    // Update the project store
                    projectStore.put(communityId, updatedProjects);
                    return #Ok("Project status updated successfully");
                };
            };
        };
        return #Err("Project not found");
    };

    public func adminChangeExpiredAt(projectId: ProjectId, expiredAt: Time.Time) : async Result<Text, Text> {
        // Iterate through all projects to find the one with matching ID
        for ((communityId, projects) in projectStore.entries()) {
            for (project in projects.vals()) {
                if (project.id == projectId) {
                    // Create updated project with new expiredAt
                    let updatedProject : Project = {
                        id = project.id;
                        title = project.title;
                        description = project.description;
                        category = project.category;
                        createdAt = project.createdAt;
                        startDate = project.startDate;
                        expiredAt = expiredAt;
                        reward = project.reward;
                        imageUrl = project.imageUrl;
                        communityId = project.communityId;
                        status = project.status;
                        maxParticipants = project.maxParticipants;
                        participants = project.participants;
                        address = project.address;
                        impact = project.impact;
                        evidence = project.evidence;
                        projectLevel = project.projectLevel;
                    };

                    // Get existing projects for the community
                    let existingProjects = switch (projectStore.get(communityId)) {
                        case null { [] };
                        case (?projects) { projects };
                    };

                    // Update the specific project in the array
                    let updatedProjects = Array.map<Project, Project>(
                        existingProjects,
                        func(p) {
                            if (p.id == projectId) {
                                updatedProject;
                            } else {
                                p;
                            };
                        }
                    );

                    // Update the project store
                    projectStore.put(communityId, updatedProjects);
                    return #Ok("Project expiration date updated successfully");
                };
            };
        };
        return #Err("Project not found");
    };

    public func adminGetBalance() : async Nat {
        let balance = await TokenCanister.icrc1_balance_of({ owner = Principal.fromActor(Lumora); subaccount = null });
        balance / (10 ** Nat8.toNat(await TokenCanister.getDecimals()))
    };

    public func adminTransferTo(to: Principal, amount: Nat) : async Result<Text, Text> {
        let transferArgs = {
            from_subaccount = null;
            to = { owner = to; subaccount = null };
            amount = amount * (10 ** Nat8.toNat(await TokenCanister.getDecimals()));
            fee = null;
            memo = ?Text.encodeUtf8("Transfer from Admin");
            created_at_time = null;
        };

        let transferResult = await TokenCanister.icrc1_transfer(transferArgs);
        switch (transferResult) {
            case (#Err(err)) {
                return #Err("Failed to transfer tokens: " # debug_show(err));
            };
            case (#Ok(_)) {
                return #Ok("Tokens transferred successfully");
            };
        };
    };

    public func adminChangeMaxParticipants(projectId: ProjectId, maxParticipants: Nat) : async Result<Text, Text> {
        // Iterate through all projects to find the one with matching ID
        Debug.print("Project ID: " # debug_show(projectId));
        for ((communityId, projects) in projectStore.entries()) {
            Debug.print("Community ID: " # debug_show(communityId));
            Debug.print("Projects: " # debug_show(projects));
            for (project in projects.vals()) {
                if (project.id == projectId) {
                    // Create updated project with new maxParticipants
                    let updatedProject : Project = {
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
                        status = project.status;
                        maxParticipants = maxParticipants; // Update only maxParticipants
                        participants = project.participants; // Keep existing participants
                        address = project.address;
                        impact = project.impact;
                        evidence = project.evidence;
                        projectLevel = project.projectLevel;
                    };

                    // Get existing projects for the community
                    let existingProjects = switch (projectStore.get(communityId)) {
                        case null { [] };
                        case (?projects) { projects };
                    };

                    // Update the specific project in the array while preserving others
                    let updatedProjects = Array.map<Project, Project>(
                        existingProjects,
                        func(p) {
                            if (p.id == projectId) {
                                updatedProject;
                            } else {
                                p;
                            };
                        }
                    );

                    // Update the project store
                    projectStore.put(communityId, updatedProjects);
                    return #Ok("Project max participants updated successfully");
                };
            };
        };
        return #Err("Project not found");
    };

    public func adminGetAllUsers() : async ?[(Text, Text, Nat)] {
        let allUsers = Buffer.Buffer<(Text, Text, Nat)>(0);

        for ((id, participant) in participantStore.entries()) {
            let balance = await TokenCanister.icrc1_balance_of({ owner = id; subaccount = null });
            allUsers.add(("Participant", participant.name, balance));
        };
        
        for ((id, community) in communityStore.entries()) {
            let balance = await TokenCanister.icrc1_balance_of({ owner = id; subaccount = null });
            allUsers.add(("Community", community.name, balance));
        };

        ?Buffer.toArray(allUsers)
    };

    public func adminDeleteAllProjects() : async Result<Text, Text> {
        // Clear project store
        projectStore := Map.HashMap<Principal, [Project]>(0, Principal.equal, Principal.hash);
        
        // Update modules with cleared store
        authModule := AuthModule.AuthModule(participantStore, communityStore);
        communityModule := CommunityModule.CommunityModule(
            communityStore,
            projectStore,
            participantStore,
            storageModule.getImage
        );
        projectModule := ProjectModule.ProjectModule(
            projectStore,
            communityStore,
            participantStore,
            nextProjectId,
            nextEvidenceId,
            storageModule.getImage,
            storageModule.uploadToStorage,
            communityModule,
            Principal.fromActor(Lumora)
        );
        participantModule := ParticipantModule.ParticipantModule(
            participantStore,
            projectStore,
            communityModule.calculateProjectStatus
        );

        // Update stable storage
        projectStorage := [];
        
        return #Ok("All projects deleted successfully");
    };

    public func adminGetAllEvidence() : async Result<[Evidence], Text> {
        let allEvidence = Buffer.Buffer<Evidence>(0);

        // Iterate through all projects to collect evidence
        for ((communityId, projects) in projectStore.entries()) {
            for (project in projects.vals()) {
                for (evidence in project.evidence.vals()) {
                    allEvidence.add(evidence);
                };
            };
        };

        #Ok(Buffer.toArray(allEvidence))
    };

    // Add helper functions
    private func calculateCommunityFee(totalReward: Nat, level: ProjectLevel) : Nat {
        let feePercentage = switch (level) {
            case (#bronze) { 5 };
            case (#silver) { 10 };
            case (#gold) { 15 };
            case (#diamond) { 20 };
        };
        (totalReward * feePercentage) / 100;
    };

    private func getMaxRewardForLevel(level: ProjectLevel) : Nat {
        switch (level) {
            case (#bronze) { 100 };
            case (#silver) { 500 };
            case (#gold) { 2000 };
            case (#diamond) { 5000 };
        };
    };
};