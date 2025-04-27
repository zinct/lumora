import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Option "mo:base/Option";
import Map "mo:base/HashMap";
import Nat32 "mo:base/Nat32";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Buffer "mo:base/Buffer";
import Blob "mo:base/Blob";
import Int "mo:base/Int";
import Error "mo:base/Error";
import StorageCanister "canister:storage";
import TokenCanister "canister:token";

actor Lumora {
    // ===== TYPE DEFINITIONS =====
    type Result<T, E> = { #Ok : T; #Err : E };

    // Project Types
    type EvidenceId = Nat32;
    type ProjectId = Nat32;
    type ProjectCategory = {
        #energy;
        #water;
        #waste;
        #transportation;
        #agriculture;
        #forestry;
        #biodiversity;
    };
    type Project = { 
        id: ProjectId; 
        title: Text; 
        description: Text;
        category: ProjectCategory;
        createdAt: Time.Time;
        startDate: Time.Time;
        expiredAt: Time.Time; 
        reward: Nat; 
        imageUrl: ?Text;
        communityId: Principal; 
        status: Nat; // 0: inactive, 1: active, 2: upcoming, 3: closed, 4: distributed
        maxParticipants: Nat;
        participants: [Participant];
        address: Text;
        impact: Text;
        evidence: [Evidence];
    };
    type EvidenceStatus = {
        #pending;
        #approved;
        #rejected;
    };
    type Evidence = {
        id: EvidenceId;
        projectId: ProjectId;
        participantId: Principal;
        description: Text;
        feedback: ?Text;
        imageUrl: [Text];
        timestamp: Time.Time;
        status: EvidenceStatus;
    };
    type CreateProjectParams = {
        title: Text;
        description: Text;
        startDate: Time.Time;
        expiredAt: Time.Time;
        reward: Nat;
        imageData: ?Blob;
        category: ProjectCategory;
        maxParticipants: Nat;
        address: Text;
        impact: Text;
    };
    type GetProjectsResult = Project and {
        imageData: ?Blob;
    };
    type GetProjectEvidenceResult = Evidence and {
        imageData: [Blob];
    };
    type GetProjectResult = GetProjectsResult and {
        evidence: [GetProjectEvidenceResult];
        communityName: Text;
    };
    type SubmitEvidenceParams = {
        projectId: ProjectId;
        description: Text;
        imageData: [Blob];
    };
    type GetCommunitySubmissionsResult = GetProjectEvidenceResult and {
        communityName: Text;
        communityImpact: Text;
        participant: Participant;
        projectName: Text;
    };
    type CommmunityRewadStatus = Nat; // 0: closed, 1: pending, 2: distributed
    type GetCommunityRewardsResult = GetProjectsResult and {
        status: CommmunityRewadStatus;
    };

    // Community Types
    type Community = {
        id: Principal;
        name: Text;
    };
    type CreateCommunityParams = {
        name: Text;
    };

    // Participant Types
    type Participant = {
        id: Principal;
        name: Text;
    };

    // Authentication Types
    type RegisterParams = {
        name: Text;
        registerAs: Text;
        initialToken: ?Nat;
    };

    // ===== STATE VARIABLES =====
    private stable var nextProjectId : ProjectId = 0;
    private stable var nextEvidenceId : EvidenceId = 0;
    stable var projectStorage : [(Principal, [Project])] = [];
    var projectStore = Map.HashMap<Principal, [Project]>(0, Principal.equal, Principal.hash);
    stable var communityStorage : [(Principal, Community)] = [];
    var communityStore = Map.HashMap<Principal, Community>(0, Principal.equal, Principal.hash);
    stable var participantStorage : [(Principal, Participant)] = [];
    var participantStore = Map.HashMap<Principal, Participant>(0, Principal.equal, Principal.hash);

    stable var isInitialized : Bool = false;

    // ===== SYSTEM FUNCTIONS =====
    system func preupgrade() {
        communityStorage := Iter.toArray(communityStore.entries());
        projectStorage := Iter.toArray(projectStore.entries());
        participantStorage := Iter.toArray(participantStore.entries());
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
    };

    // ===== AUTHENTICATION FUNCTIONS =====
    public shared ({ caller }) func register(params: RegisterParams) : async Result<Text, Text> {
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

                let userAccount = { owner = caller; subaccount = null };

                let transferArgs = {
                    from_subaccount = null;
                    to = userAccount;
                    amount = Option.get(params.initialToken, 0);
                    fee = null;
                    memo = null;
                    created_at_time = null;
                };

                // set initial balance
                let transferResult = await TokenCanister.icrc1_transfer(transferArgs);

                switch (transferResult) {
                    case (#Ok(_)) {
                        communityStore.put(caller, community);
                        return #Ok("Successfully registered as community");
                    };
                    case (#Err(err)) {
                        return #Err("Failed to transfer initial token: " # debug_show(err));
                    };
                };
            };
            case _ {
                return #Err("Invalid role. Must be either 'participant' or 'community'");
            };
        };
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

    // ===== COMMUNITY FUNCTIONS =====
    public shared query ({ caller }) func getCommunity() : async Result<Community, Text> {
        switch (communityStore.get(caller)) {
            case null { return #Err("Community not found"); };
            case (?community) { return #Ok(community); };
        };
    };

    public shared query ({ caller }) func getCommunityProjects() : async Result<[Project], Text> {
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
                            };
                            communityProjects := Array.append(communityProjects, [updatedProject]);
                        };
                    };
                };
                
                return #Ok(communityProjects);
            };
        };
    };

    public shared ({ caller }) func getCommunitySubmissions() : async Result<[GetCommunitySubmissionsResult], Text> {
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

    public shared ({ caller }) func getCommunityRewards() : async Result<[GetCommunityRewardsResult], Text> {
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
                            };
                            
                            communityRewards := Array.append(communityRewards, [rewardResult]);
                        };
                    };
                };
                
                return #Ok(communityRewards);
            };
        };
    };

    public shared ({ caller }) func distributeRewards(projectId: ProjectId) : async Result<Text, Text> {
        if(Principal.isAnonymous(caller)) {
            return #Err("Anonymous cannot distribute rewards");
        };

        switch (communityStore.get(caller)) {
            case null { return #Err("Only communities can distribute rewards"); };
            case (?_) {
                // Find the project
                for ((communityId, projects) in projectStore.entries()) {
                    if (communityId == caller) {
                        for (project in projects.vals()) {
                            if (project.id == projectId) {
                                // Check if project is expired and all evidence is approved
                                let now = Time.now();
                                if (now <= project.expiredAt) {
                                    return #Err("Project is not expired yet");
                                };

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

                                // Check community balance
                                let communityBalance = await TokenCanister.icrc1_balance_of({ owner = caller; subaccount = null });
                                if (communityBalance < totalReward) {
                                    return #Err("Insufficient balance to distribute rewards");
                                };

                                // Transfer rewards to each approved participant
                                for (participantId in approvedParticipants.vals()) {
                                    let transferArgs = {
                                        from_subaccount = null;
                                        to = { owner = participantId; subaccount = null };
                                        amount = project.reward;
                                        fee = null;
                                        memo = null;
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

    // ===== PARTICIPANT FUNCTIONS =====
    public shared query ({ caller }) func getParticipant() : async Result<Participant, Text> {
        switch (participantStore.get(caller)) {
            case null { return #Err("Participant not found"); };
            case (?participant) { return #Ok(participant); };
        };
    };

    public shared query ({ caller }) func getParticipantProjects() : async Result<[Project], Text> {
        if(Principal.isAnonymous(caller)) {
            return #Err("Anonymous cannot get participant projects");
        };

        switch (participantStore.get(caller)) {
            case null { return #Err("Participant not found"); };
            case (?_) {
                var participantProjects : [Project] = [];
                
                for ((communityId, projects) in projectStore.entries()) {
                    for (project in projects.vals()) {
                        for (p in project.participants.vals()) {
                            if (p.id == caller) {
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
                                };
                                participantProjects := Array.append(participantProjects, [updatedProject]);
                            };
                        };
                    };
                };
                
                return #Ok(participantProjects);
            };
        };
    };

    // ===== PROJECT FUNCTIONS =====
    private func calculateProjectStatus(startDate: Time.Time, expiredAt: Time.Time, currentStatus: Nat) :  Nat {
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

    public shared ({ caller }) func createProject(params: CreateProjectParams) : async Result<ProjectId, Text> {
        if (Option.isNull(communityStore.get(caller))) { 
            return #Err("Only communities can create projects");
        };
        
        if (params.startDate >= params.expiredAt) {
            return #Err("Start date must be before end date");
        };

        // Upload image to storage if imageData exists
        let imageUrl = switch (params.imageData) {
            case (?imageData) {
                try {
                    let timestamp = Int.toText(Time.now());
                    let key = "project_" # Nat32.toText(nextProjectId) # "_" # timestamp;
                    let imageKey = await uploadToStorage(imageData, key, "image/jpeg");
                    ?("/" # imageKey);
                } catch (e) {
                    return #Err("Failed to upload project image: " # Error.message(e));
                };
            };
            case null { null };
        };
        
        let project : Project = {
            id = nextProjectId;
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
        }; 

        nextProjectId += 1;

        let existingProjects = switch (projectStore.get(caller)) {
            case null { [] };
            case (?projects) { projects };
        };
        
        let updatedProjects = Array.append(existingProjects, [project]);
        projectStore.put(caller, updatedProjects);
        
        return #Ok(project.id);
    };

    public func getProjects() : async Result<[GetProjectsResult], Text> {
        var allProjects : [GetProjectsResult] = [];
        for ((communityId, projects) in projectStore.entries()) {
            for (project in projects.vals()) {
                let community = switch (communityStore.get(communityId)) {
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

    // ===== EVIDENCE FUNCTIONS =====
    public shared ({ caller }) func submitEvidence(params: SubmitEvidenceParams) : async Result<Text, Text> {
        if (Principal.isAnonymous(caller)) {
            return #Err("Anonymous cannot submit evidence");
        };

        // Check if participant exists
        let participantResult = participantStore.get(caller);
        switch (participantResult) {
            case null { return #Err("Participant not found") };
            case (?participant) {
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
                                    let key = "evidence_" # Nat32.toText(nextEvidenceId) # "_" # Nat32.toText(Nat32.fromNat(imageUrls.size())) # "_" # timestamp;
                                    let imageKey = await uploadToStorage(imageData, key, "image/jpeg");
                                    let imageUrl = "/" # imageKey;
                                    imageUrls.add(imageUrl);
                                } catch (e) {
                                    return #Err("Failed to upload image: " # Error.message(e));
                                };
                            };

                            // Create evidence
                            let evidence : Evidence = {
                                id = nextEvidenceId;
                                projectId = params.projectId;
                                participantId = caller;
                                description = params.description;
                                imageUrl = Buffer.toArray(imageUrls);
                                timestamp = Time.now();
                                status = #pending;
                                feedback = null;
                            };

                            nextEvidenceId += 1;

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

    type FeedbackEvidenceParams = {
        evidenceId: EvidenceId;
        feedback: Text;
        status: EvidenceStatus;
    };

    public shared ({ caller }) func feedbackEvidence(params: FeedbackEvidenceParams) : async Result<Text, Text> {
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

    // ===== TOKEN FUNCTIONS =====
    public type InitializeLumoraParams = {
        tokenName: Text;
        tokenSymbol: Text;
        initialSupply: Nat;
        tokenLogo: Text;
    };

    public func initializeLumora(params: InitializeLumoraParams) : async Result<Text, Text> {
        if (isInitialized) {
            return #Err("Lumora already initialized");
        };

        let tokenResult = await TokenCanister.initializeToken({
            tokenName = params.tokenName;
            tokenSymbol = params.tokenSymbol;
            initialSupply = params.initialSupply;
            tokenLogo = params.tokenLogo;
        });

        switch (tokenResult) {
            case (#Ok(result)) {
                isInitialized := true;
                return #Ok(result);
            };
            case (#Err(err)) {
                return #Err("Failed to initialize token: " # err);
            };
        };
    };

    // ===== STORAGE FUNCTIONS =====
    private func uploadToStorage(imageData: Blob, key: Text, contentType: Text) : async Text {
        try {
            let _ = await StorageCanister.store({
                content = imageData;
                content_encoding = "identity";
                content_type = contentType;
                key = key;
                sha256 = null;
            });
            return key;
        } catch (e) {
            throw Error.reject("Storage canister error: " # Error.message(e));
        };
    };

    private func getImage(key: Text) : async ?Blob {
        try {
            let result = await StorageCanister.get({
                key = key;
                accept_encodings = ["identity"];
            });
            switch (result) {
                case (content) {
                    if (content.content_encoding == "identity") {
                        ?content.content;
                    } else {
                        null;
                    };
                };
            };
        } catch (e) {
            null;
        };
    };

    // ===== ADMIN FUNCTIONS =====
    public func adminChangeSubmissionStatus(evidenceId: EvidenceId, status: EvidenceStatus) : async Result<Text, Text> {
        // Iterate through all projects to find the evidence
        for ((communityId, projects) in projectStore.entries()) {
            for (project in projects.vals()) {
                for (evidence in project.evidence.vals()) {
                    if (evidence.id == evidenceId) {
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
                                            func(e) = if (e.id == evidenceId) updatedEvidence else e
                                        );
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

    public func adminGetAllUsers() : async ?[(Text, Text)] {
        let allUsers = Buffer.Buffer<(Text, Text)>(0);

        for ((id, participant) in participantStore.entries()) {
            allUsers.add(("Participant", participant.name));
        };
        
        for ((id, community) in communityStore.entries()) {
            allUsers.add(("Community", community.name));
        };

        ?Buffer.toArray(allUsers)
    };
};