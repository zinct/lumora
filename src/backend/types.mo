import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Text "mo:base/Text";
import Blob "mo:base/Blob";

module {
    // Project Types
    public type EvidenceId = Nat32;
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
    public type ProjectLevel = {
        #bronze;
        #silver;
        #gold;
        #diamond;
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
        status: Nat; // 0: inactive, 1: active, 2: upcoming, 3: closed, 4: distributed
        maxParticipants: Nat;
        participants: [Participant];
        address: Text;
        impact: Text;
        projectLevel: ProjectLevel;
        evidence: [Evidence];
    };
    public type EvidenceStatus = {
        #pending;
        #approved;
        #rejected;
    };
    public type Evidence = {
        id: EvidenceId;
        projectId: ProjectId;
        participantId: Principal;
        description: Text;
        feedback: ?Text;
        imageUrl: [Text];
        timestamp: Time.Time;
        status: EvidenceStatus;
    };
    public type CreateProjectParams = {
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
    public type GetProjectsResult = Project and {
        imageData: ?Blob;
    };
    public type GetProjectEvidenceResult = Evidence and {
        imageData: [Blob];
    };
    public type GetProjectResult = GetProjectsResult and {
        evidence: [GetProjectEvidenceResult];
        communityName: Text;
    };
    public type SubmitEvidenceParams = {
        projectId: ProjectId;
        description: Text;
        imageData: [Blob];
    };
    public type GetCommunitySubmissionsResult = GetProjectEvidenceResult and {
        communityName: Text;
        communityImpact: Text;
        participant: Participant;
        projectName: Text;
    };
    public type CommmunityRewadStatus = Nat; // 0: closed, 1: pending, 2: distributed
    public type GetCommunityRewardsResult = GetProjectsResult and {
        status: CommmunityRewadStatus;
    };

    // Community Types
    public type Community = {
        id: Principal;
        name: Text;
    };
    public type CreateCommunityParams = {
        name: Text;
    };

    // Participant Types
    public type Participant = {
        id: Principal;
        name: Text;
    };

    // Authentication Types
    public type RegisterParams = {
        name: Text;
        registerAs: Text;
    };

    // Feedback Types
    public type FeedbackEvidenceParams = {
        evidenceId: EvidenceId;
        feedback: Text;
        status: EvidenceStatus;
    };

    // Common types
    public type Result<T, E> = { #Ok : T; #Err : E };
};
