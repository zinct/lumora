import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Option "mo:base/Option";
import Map "mo:base/HashMap";
import Array "mo:base/Array";
import Types "../types";

module {
    type Result<T, E> = Types.Result<T, E>;
    type Project = Types.Project;
    type Participant = Types.Participant;

    public class ParticipantModule(
        participantStore: Map.HashMap<Principal, Participant>,
        projectStore: Map.HashMap<Principal, [Project]>,
        calculateProjectStatus: (Time.Time, Time.Time, Nat) -> Nat
    ) {
        public func getParticipant(caller: Principal) : Result<Participant, Text> {
            switch (participantStore.get(caller)) {
                case null { return #Err("Participant not found"); };
                case (?participant) { return #Ok(participant); };
            };
        };

        public func getParticipantProjects(caller: Principal) : Result<[Project], Text> {
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
                                        projectLevel = project.projectLevel;
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
    };
}; 