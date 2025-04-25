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
import storage "canister:storage";

actor Lumora {
    public type Result<T, E> = { #Ok : T; #Err : E };


    // Project Types
    public type EvidenceId = Nat32;
    public type Evidence = {
        id: EvidenceId;
        projectId: ProjectId;
        participantId: Principal;
        description: Text;
        imageUrl: [Text];
        timestamp: Time.Time;
        status: Text; // "Pending", "Approved", "Rejected"
    };

    public type ProjectId = Nat32;
    public type ProjectCategory = {
        #energy;
        #water;
        #waste;
        #transportation;
        #agriculture;
        #forestry;
        #biodiversity;
    };
    public type Project = { 
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
        status: Nat; // 0: inactive, 1: active, 2: upcoming, 3: closed
        maxParticipants: Nat;
        participants: [Participant];
        address: Text;
        impact: Text;
        evidence: [Evidence];
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
    private stable var nextProjectId : ProjectId = 0;
    private stable var nextEvidenceId : EvidenceId = 0;
    stable var projectStorage : [(Principal, [Project])] = [];
    var projectStore = Map.HashMap<Principal, [Project]>(0, Principal.equal, Principal.hash);

    // Community Storage
    stable var communityStorage : [(Principal, Community)] = [];
    var communityStore = Map.HashMap<Principal, Community>(0, Principal.equal, Principal.hash);

    // Participant Storage
    stable var participantStorage : [(Principal, Participant)] = [];
    var participantStore = Map.HashMap<Principal, Participant>(0, Principal.equal, Principal.hash);

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

    // ===== PUBLIC FUNCTIONS =====
    // Authentication Functions
    type RegisterParams = {
        name: Text;
        registerAs: Text;
        initialToken: ?Nat;
    };

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

                communityStore.put(caller, community);
                return #Ok("Successfully registered as community");
            };
            case _ {
                return #Err("Invalid role. Must be either 'participant' or 'community'");
            };
        };
    };

    public shared func getAllUsers() : async ?[(Text, Text)] {
        let allUsers = Buffer.Buffer<(Text, Text)>(0);

        for ((id, participant) in participantStore.entries()) {
            allUsers.add(("Participant", participant.name));
        };
        
        for ((id, community) in communityStore.entries()) {
            allUsers.add(("Community", community.name));
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
    private func calculateProjectStatus(startDate: Time.Time, expiredAt: Time.Time, currentStatus: Nat) : Nat {
        let now = Time.now();
        
        if (currentStatus == 0) {
            return 0;
        };

        if (now < startDate) {
            return 2;
        };

        if (now > expiredAt) {
            return 3;
        };

        return 1;
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

    public type GetProjectsResult = Project and {
        imageData: ?Blob;
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

    public type GetProjectEvidenceResult = Evidence and {
        imageData: [Blob];
    };

    public type GetProjectResult = GetProjectsResult and {
        evidence: [GetProjectEvidenceResult];
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

    

    private func uploadToStorage(imageData: Blob, key: Text, contentType: Text) : async Text {
        try {
            let _ = await storage.store({
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

    public shared func getImage(key: Text) : async ?Blob {
        try {
            let result = await storage.get({
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

    public type SubmitEvidenceParams = {
        projectId: ProjectId;
        description: Text;
        imageData: [Blob];
    };

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
                                status = "Pending";
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

    public shared ({ caller }) func getParticipantProjects() : async Result<[Project], Text> {
        if(Principal.isAnonymous(caller)) {
            return #Err("Anonymous cannot get participant projects");
        };

        switch (participantStore.get(caller)) {
            case null { return #Err("Participant not found"); };
            case (?participant) {
                var participantProjects : [Project] = [];
                
                for ((communityId, projects) in projectStore.entries()) {
                    for (project in projects.vals()) {
                        for (p in project.participants.vals()) {
                            if (p.id == caller) {
                                participantProjects := Array.append(participantProjects, [project]);
                            };
                        };
                    };
                };
                
                return #Ok(participantProjects);
            };
        };
    };

    public shared ({ caller }) func getCommunityProjects() : async Result<[Project], Text> {
        if(Principal.isAnonymous(caller)) {
            return #Err("Anonymous cannot get community projects");
        };

        switch (communityStore.get(caller)) {
            case null { return #Err("Community not found"); };
            case (?community) {
                var communityProjects : [Project] = [];
                
                for ((communityId, projects) in projectStore.entries()) {
                    if (communityId == caller) {
                        communityProjects := Array.append(communityProjects, projects);
                    };
                };
                
                return #Ok(communityProjects);
            };
        };
    };
};
