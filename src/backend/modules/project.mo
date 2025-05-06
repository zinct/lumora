import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Option "mo:base/Option";
import Map "mo:base/HashMap";
import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Blob "mo:base/Blob";
import Int "mo:base/Int";
import Nat32 "mo:base/Nat32";
import Nat8 "mo:base/Nat8";
import Error "mo:base/Error";
import Types "../types";
import TokenCanister "canister:token";
import CommunityModule "../modules/community";
import Debug "mo:base/Debug";
module {
    type Result<T, E> = Types.Result<T, E>;
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
    type Participant = Types.Participant;
    type FeedbackEvidenceParams = Types.FeedbackEvidenceParams;

    public class ProjectModule(
        projectStore: Map.HashMap<Principal, [Project]>,
        communityStore: Map.HashMap<Principal, Community>,
        participantStore: Map.HashMap<Principal, Participant>,
        nextProjectId: Nat32,
        nextEvidenceId: Nat32,
        getImage: (Text) -> async ?Blob,
        uploadToStorage: (Blob, Text, Text) -> async Text,
        communityModule: CommunityModule.CommunityModule,
        mainActor: Principal
    ) {
        private var currentProjectId = nextProjectId;
        private var currentEvidenceId = nextEvidenceId;

        public func getCurrentProjectId() : Nat32 {
            currentProjectId
        };

        public func getCurrentEvidenceId() : Nat32 {
            currentEvidenceId
        };

        public func calculateProjectStatus(startDate: Time.Time, expiredAt: Time.Time, currentStatus: Nat) : Nat {
            communityModule.calculateProjectStatus(startDate, expiredAt, currentStatus)
        };

        public func createProject(caller: Principal, params: CreateProjectParams) : async Result<ProjectId, Text> {
            Debug.print(debug_show(params.imageData));
            if (Option.isNull(communityStore.get(caller))) { 
                return #Err("Only communities can create projects");
            };
            
            if (params.startDate >= params.expiredAt) {
                return #Err("Start date must be before end date");
            };

            // Get community level
            let communityLevelResult = await communityModule.getCommunityLevel(caller);
            let projectLevel = switch (communityLevelResult) {
                case (#Ok(level)) { level };
                case (#Err(_)) { #bronze };
            };

            // Upload image to storage if imageData exists
            let imageUrl = switch (params.imageData) {
                case (?imageData) {
                    try {
                        let timestamp = Int.toText(Time.now());
                        let key = "project_" # Nat32.toText(currentProjectId) # "_" # timestamp;
                        let imageKey = await uploadToStorage(imageData, key, "image/jpeg");
                        ?("/" # imageKey);
                    } catch (e) {
                        return #Err("Failed to upload project image: " # Error.message(e));
                    };
                };
                case null { null };
            };
            
            let project : Project = {
                id = currentProjectId;
                title = params.title;
                description = params.description;
                createdAt = Time.now();
                startDate = params.startDate;
                expiredAt = params.expiredAt;
                reward = params.reward;
                imageUrl = imageUrl;
                communityId = caller;
                status = 1;
                participants = [];
                category = params.category;
                maxParticipants = params.maxParticipants;
                address = params.address;
                impact = params.impact;
                evidence = [];
                projectLevel = projectLevel;
            };

            let existingProjects = switch (projectStore.get(caller)) {
                case null { [] };
                case (?projects) { projects };
            };
            
            let updatedProjects = Array.append(existingProjects, [project]);
            projectStore.put(caller, updatedProjects);
            
            // Increment the project ID after successful creation
            currentProjectId += 1;
            
            return #Ok(project.id);
        };

        public func getProjects() : async Result<[GetProjectsResult], Text> {
            var allProjects : [GetProjectsResult] = [];
            for ((communityId, projects) in projectStore.entries()) {
                for (project in projects.vals()) {
                    let _ = switch (communityStore.get(communityId)) {
                        case null { return #Err("Community not found") };
                        case (?c) { c };
                    };

                    let currentStatus = calculateProjectStatus(project.startDate, project.expiredAt, project.status);

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

                    let projectResult : GetProjectsResult = {
                        id = project.id;
                        title = project.title;
                        description = project.description;
                        startDate = project.startDate;
                        expiredAt = project.expiredAt;
                        reward = project.reward;
                        imageUrl = project.imageUrl;
                        imageData = imageData;
                        status = currentStatus;
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

        public func getProject(id: ProjectId) : async Result<GetProjectResult, Text> {
            for ((communityId, projects) in projectStore.entries()) {
                for (project in projects.vals()) {
                    if (project.id == id) {
                        let community = switch (communityStore.get(communityId)) {
                            case null { return #Err("Community not found") };
                            case (?c) { c };
                        };

                        let currentStatus = calculateProjectStatus(project.startDate, project.expiredAt, project.status);

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

                        // Fetch image data for each evidence
                        let evidenceWithImages = Buffer.Buffer<GetProjectEvidenceResult>(0);
                        for (evidence in project.evidence.vals()) {
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

                            let evidenceResult : GetProjectEvidenceResult = {
                                id = evidence.id;
                                projectId = evidence.projectId;
                                participantId = evidence.participantId;
                                description = evidence.description;
                                feedback = evidence.feedback;
                                imageUrl = evidence.imageUrl;
                                timestamp = evidence.timestamp;
                                status = evidence.status;
                                imageData = Buffer.toArray(imageData);
                            };
                            evidenceWithImages.add(evidenceResult);
                        };

                        return #Ok({
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
                            status = currentStatus;
                            maxParticipants = project.maxParticipants;
                            participants = project.participants;
                            communityId = communityId;
                            communityName = community.name;
                            address = project.address;
                            impact = project.impact;
                            evidence = Buffer.toArray(evidenceWithImages);
                            projectLevel = project.projectLevel;
                        });
                    };
                };
            };
            return #Err("Project not found");
        };

        public func deleteProject(caller: Principal, projectId: ProjectId) : async Result<Text, Text> {
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

        public func joinProject(caller: Principal, projectId: ProjectId) : async Result<Text, Text> {
            if (Principal.isAnonymous(caller)) {
                return #Err("Anonymous cannot join projects");
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
                            if (project.status == 0 or project.status == 3) {
                                return #Err("Project is not active");
                            };
                            if (project.participants.size() >= project.maxParticipants) {
                                return #Err("Project has reached maximum participants");
                            };

                            let updatedProject : Project = {
                                id = project.id;
                                title = project.title;
                                description = project.description;
                                createdAt = project.createdAt;
                                startDate = project.startDate;
                                expiredAt = project.expiredAt;
                                reward = project.reward;
                                imageUrl = project.imageUrl;
                                communityId = project.communityId;
                                status = project.status;
                                participants = Array.append(project.participants, [participant]);
                                category = project.category;
                                maxParticipants = project.maxParticipants;
                                address = project.address;
                                impact = project.impact;
                                evidence = project.evidence;
                                projectLevel = project.projectLevel;
                            };

                            // Get existing projects for the community
                            let existingProjects = switch (projectStore.get(project.communityId)) {
                                case null { [] };
                                case (?projects) { projects };
                            };

                            // Update the specific project in the array
                            let updatedProjects = Array.map<Project, Project>(
                                existingProjects,
                                func(p) {
                                    if (p.id == project.id) {
                                        updatedProject;
                                    } else {
                                        p;
                                    };
                                }
                            );

                            projectStore.put(project.communityId, updatedProjects);
                            return #Ok("Successfully joined the project");
                        };
                    };
                };
            };
        };

        public func submitEvidence(caller: Principal, params: SubmitEvidenceParams) : async Result<Text, Text> {
            if (Principal.isAnonymous(caller)) {
                return #Err("Anonymous cannot submit evidence");
            };

            // Check if participant exists
            let participantResult = participantStore.get(caller);
            switch (participantResult) {
                case null { return #Err("Participant not found") };
                case (_) {
                    // Find the project
                    for ((communityId, projects) in projectStore.entries()) {
                        for (project in projects.vals()) {
                            if (project.id == params.projectId) {
                                // Check if project is active
                                if (project.status != 1) {
                                    return #Err("Project is not active");
                                };

                                // Check if participant has joined the project
                                let isParticipantJoined = Array.find<Participant>(project.participants, func(p) = p.id == caller);
                                if (Option.isNull(isParticipantJoined)) {
                                    return #Err("You have not joined this project");
                                };

                                // Upload all images to storage
                                let imageUrls = Buffer.Buffer<Text>(0);
                                for (imageData in params.imageData.vals()) {
                                    try {
                                        let timestamp = Int.toText(Time.now());
                                        let key = "evidence_" # Nat32.toText(currentEvidenceId) # "_" # Nat32.toText(Nat32.fromNat(imageUrls.size())) # "_" # timestamp;
                                        let imageKey = await uploadToStorage(imageData, key, "image/jpeg");
                                        let imageUrl = "/" # imageKey;
                                        imageUrls.add(imageUrl);
                                    } catch (e) {
                                        return #Err("Failed to upload image: " # Error.message(e));
                                    };
                                };

                                // Create evidence
                                let evidence : Evidence = {
                                    id = currentEvidenceId;
                                    projectId = params.projectId;
                                    participantId = caller;
                                    description = params.description;
                                    imageUrl = Buffer.toArray(imageUrls);
                                    timestamp = Time.now();
                                    status = #pending;
                                    feedback = null;
                                };

                                currentEvidenceId += 1;

                                // Update project with new evidence
                                let updatedProject : Project = {
                                    id = project.id;
                                    title = project.title;
                                    description = project.description;
                                    createdAt = project.createdAt;
                                    startDate = project.startDate;
                                    expiredAt = project.expiredAt;
                                    reward = project.reward;
                                    imageUrl = project.imageUrl;
                                    communityId = project.communityId;
                                    status = project.status;
                                    participants = project.participants;
                                    category = project.category;
                                    maxParticipants = project.maxParticipants;
                                    address = project.address;
                                    impact = project.impact;
                                    evidence = Array.append(project.evidence, [evidence]);
                                    projectLevel = project.projectLevel;
                                };

                                // Get existing projects and update the specific one
                                let updatedProjects = Array.map<Project, Project>(
                                    projects,
                                    func(p) {
                                        if (p.id == params.projectId) {
                                            updatedProject;
                                        } else {
                                            p;
                                        };
                                    }
                                );

                                projectStore.put(communityId, updatedProjects);
                                return #Ok("Evidence submitted successfully");
                            };
                        };
                    };
                    return #Err("Project not found");
                };
            };
        };

        public func feedbackEvidence(caller: Principal, params: FeedbackEvidenceParams) : Result<Text, Text> {
            if (Principal.isAnonymous(caller)) {
                return #Err("Anonymous cannot update evidence feedback");
            };

            switch (communityStore.get(caller)) {
                case null { return #Err("Only communities can provide feedback"); };
                case (?community) {
                    for ((communityId, projects) in projectStore.entries()) {
                        if (communityId == caller) {
                            for (project in projects.vals()) {
                                for (evidence in project.evidence.vals()) {
                                    if (evidence.id == params.evidenceId) {
                                        if (evidence.status != #pending) {
                                            return #Err("Can only provide feedback for pending evidence");
                                        };

                                        let updatedEvidence : Evidence = {
                                            id = evidence.id;
                                            projectId = evidence.projectId;
                                            participantId = evidence.participantId;
                                            description = evidence.description;
                                            feedback = ?params.feedback;
                                            imageUrl = evidence.imageUrl;
                                            timestamp = evidence.timestamp;
                                            status = params.status;
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
                                                            func(e) = if (e.id == params.evidenceId) updatedEvidence else e
                                                        );
                                                        projectLevel = p.projectLevel;
                                                    };
                                                } else {
                                                    p;
                                                };
                                            }
                                        );

                                        projectStore.put(communityId, updatedProjects);
                                        return #Ok("Feedback added successfully");
                                    };
                                };
                            };
                        };
                    };
                    return #Err("Evidence not found or you don't have permission to provide feedback");
                };
            };
        };

        public func distributeRewards(caller: Principal, projectId: Types.ProjectId) : async Result<Text, Text> {
            if(Principal.isAnonymous(caller)) {
                return #Err("Anonymous cannot distribute rewards");
            };

            switch (communityStore.get(caller)) {
                case null { return #Err("Only communities can distribute rewards"); };
                case (?community) {
                    // Find the project
                    for ((communityId, projects) in projectStore.entries()) {
                        if (communityId == caller) {
                            for (project in projects.vals()) {
                                if (project.id == projectId) {

                                    // Check if rewards are already distributed
                                    if (project.status == 4) {
                                        return #Err("Rewards already distributed");
                                    };

                                    // Check if project is in pending status
                                    var hasPendingEvidence = false;
                                    var allEvidenceApproved = true;
                                    
                                    for (evidence in project.evidence.vals()) {
                                        if (evidence.status == #pending) {
                                            hasPendingEvidence := true;
                                            allEvidenceApproved := false;
                                        };
                                    };

                                    if (hasPendingEvidence or not allEvidenceApproved) {
                                        return #Err("Project has pending or rejected evidence");
                                    };

                                    // Count approved evidence and calculate total reward
                                    var totalReward = 0;
                                    var approvedParticipants = Buffer.Buffer<Principal>(0);
                                    
                                    for (evidence in project.evidence.vals()) {
                                        if (evidence.status == #approved) {
                                            totalReward += project.reward;
                                            approvedParticipants.add(evidence.participantId);
                                        };
                                    };

                                    if (approvedParticipants.size() == 0) {
                                        return #Err("No approved evidence found");
                                    };

                                    let communityFee = getRewardFee(project.projectLevel);
                                    let communityReward = totalReward * communityFee / 100;
                                    totalReward += communityReward;

                                    // Check pool reward balance using main actor
                                    let poolRewardBalance = await TokenCanister.icrc1_balance_of({ 
                                        owner = mainActor; 
                                        subaccount = null 
                                    });
                                    if (poolRewardBalance < totalReward) {
                                        return #Err("Insufficient balance to distribute rewards");
                                    };

                                    // Transfer rewards to each approved participant
                                    for (participantId in approvedParticipants.vals()) {
                                        let transferArgs = {
                                            from_subaccount = null;
                                            to = { owner = participantId; subaccount = null };
                                            amount = project.reward * (10 ** Nat8.toNat(await TokenCanister.getDecimals()));
                                            fee = null;
                                            memo = ?Text.encodeUtf8("Reward from " # community.name);
                                            created_at_time = null;
                                        };

                                        let transferResult = await TokenCanister.icrc1_transfer(transferArgs);
                                        switch (transferResult) {
                                            case (#Err(err)) {
                                                return #Err("Failed to transfer reward: " # debug_show(err));
                                            };
                                            case (#Ok(_)) {};
                                        };
                                    };

                                    // Transfer pool reward to community
                                    let poolRewardTransferArgs = {
                                        from_subaccount = null;
                                        to = { owner = caller; subaccount = null };
                                        amount = communityReward * (10 ** Nat8.toNat(await TokenCanister.getDecimals()));
                                        fee = null;
                                        memo = ?Text.encodeUtf8("Pool reward");
                                        created_at_time = null;
                                    };

                                    let poolRewardTransferResult = await TokenCanister.icrc1_transfer(poolRewardTransferArgs);
                                    switch (poolRewardTransferResult) {
                                        case (#Err(err)) {
                                            return #Err("Failed to transfer pool reward: " # debug_show(err));
                                        };
                                        case (#Ok(_)) {};
                                    };

                                    // Update project status to distributed
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
                                        status = 4; // distributed
                                        maxParticipants = project.maxParticipants;
                                        participants = project.participants;
                                        address = project.address;
                                        impact = project.impact;
                                        evidence = project.evidence;
                                        projectLevel = project.projectLevel;
                                    };

                                    // Update project in store
                                    let updatedProjects = Array.map<Project, Project>(
                                        projects,
                                        func(p) = if (p.id == projectId) updatedProject else p
                                    );
                                    projectStore.put(communityId, updatedProjects);

                                    return #Ok("Rewards distributed successfully");
                                };
                            };
                        };
                    };
                    return #Err("Project not found");
                };
            };
        };

        private func getRewardFee(projectLevel: ProjectLevel) : Nat {
            switch (projectLevel) {
                case (#bronze) { 5 };
                case (#silver) { 10 };
                case (#gold) { 15 };
                case (#diamond) { 20 };
            };
        };
    };
}; 