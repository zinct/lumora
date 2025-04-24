import { useState, useEffect } from "react";
import { Button } from "@/core/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Badge } from "@/core/components/ui/badge";
import { AssetManager } from "@dfinity/assets";
import { canisterId as assetsCanisterId } from "declarations/assets";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/core/components/ui/tabs";
import { Avatar, AvatarImage } from "@/core/components/ui/avatar";
import { SubmitEvidenceForm } from "@/core/components/community/submit-evidence-form";
import { SubmissionStatus } from "@/core/components/community/submission-status";
import { useToast } from "@/core/hooks/use-toast";
import { ArrowLeft, Calendar, FileText, Leaf, MapPin, Share2, Users, Award, Ban, CalendarClock, Clock, HelpCircle, CircleGauge } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { backend } from "declarations/backend";
import { useAuth } from "@/core/providers/auth-provider";
import { Actor } from "@dfinity/agent";
import { getAssetManagerNetwork } from "@/core/lib/canisterUtils";

export default function ProjectDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const { user, isAuthenticated, login, identity } = useAuth();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [isSubmittingEvidence, setIsSubmittingEvidence] = useState(false);
  const [userSubmission, setUserSubmission] = useState(null);
  const [hasJoined, setHasJoined] = useState(false);

  const assetManager = new AssetManager({
    canisterId: assetsCanisterId,
    agent: Actor.agentOf(backend),
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        const projectId = parseInt(id);
        const response = await backend.getProject(projectId);

        if ("Ok" in response) {
          const projectData = response.Ok;
          setProject({
            id: projectData.id,
            title: projectData.title,
            description: projectData.description,
            category: projectData.category,
            createdAt: new Date(Number(projectData.createdAt) / 1000000),
            expiredAt: new Date(Number(projectData.expiredAt) / 1000000),
            reward: projectData.reward,
            imageUrl: projectData.imageUrl,
            communityId: projectData.communityId,
            communityName: projectData.communityName,
            status: projectData.status,
            maxParticipants: projectData.maxParticipants,
            participants: projectData.participants,
            address: projectData.address,
            impact: projectData.impact,
          });

          const userEvidence = projectData.evidence.find((evidence) => evidence.participantId.toString() === user.id);
          console.log("projectData", userEvidence);

          // console.log(object);

          if (userEvidence) {
            setUserSubmission({
              id: userEvidence.id,
              status: userEvidence.status,
              submittedAt: new Date(Number(userEvidence.timestamp) / 1000000).toISOString(),
              evidence: userEvidence.description,
              files: userEvidence.imageUrl.map((url, index) => ({
                name: `Evidence ${index + 1}`,
                url: url,
              })),
              feedback: userEvidence.feedback,
            });
          }

          // Check if user has joined the project
          if (isAuthenticated && user) {
            const hasJoinedProject = projectData.participants.some((participant) => participant.id.toString() === user.id);
            setHasJoined(hasJoinedProject);
          }
        } else {
          toast({
            title: "Error",
            description: response.Err,
            variant: "destructive",
          });
          navigate("/projects");
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        toast({
          title: "Error",
          description: "Failed to fetch project details",
          variant: "destructive",
        });
        navigate("/projects");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id, isAuthenticated, user, navigate, toast]);

  // Update handleSubmitEvidence to refresh project data after submission
  const handleSubmitEvidence = async (data) => {
    // console.log(identity.getPrincipal().toText());

    try {
      setIsSubmittingEvidence(true);

      if (!identity) {
        toast({
          title: "Error",
          description: "Please login first",
          variant: "destructive",
        });
        return;
      }

      const batch = assetManager.batch();
      const uploadedImageUrls = [];

      // Process each file
      for (const file of data.files) {
        try {
          console.log("Processing file:", file);

          const fileName = crypto.randomUUID();
          console.log("file", fileName);

          const key = await batch.store(file, {
            path: "/evidence",
            fileName,
            contentType: file.type,
          });

          uploadedImageUrls.push(key);
        } catch (fileError) {
          console.error("Error processing file:", fileError);
          toast({
            title: "Error",
            description: `Failed to process file ${file.name}: ${fileError.message}`,
            variant: "destructive",
          });
          continue;
        }
      }

      if (uploadedImageUrls.length === 0) {
        toast({
          title: "Error",
          description: "No valid files were processed",
          variant: "destructive",
        });
        return;
      }

      // Commit the batch upload
      await batch.commit();

      // Submit evidence to backend
      const response = await backend.submitEvidence({
        projectId: parseInt(id),
        description: data.description,
        imageUrl: uploadedImageUrls,
      });

      if ("Ok" in response) {
        // Refresh project data to get updated evidence
        const updatedProject = await backend.getProject(parseInt(id));
        if ("Ok" in updatedProject) {
          setProject(updatedProject.Ok);
        }

        toast({
          title: "Success",
          description: "Evidence submitted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: response.Err,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting evidence:", error);
      if (error.message.includes("Caller does not have Prepare permission")) {
        toast({
          title: "Error",
          description: "You are not authorized to upload files. Please contact the administrator.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to submit evidence",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmittingEvidence(false);
    }
  };

  const handleJoinProject = async () => {
    setIsJoining(true);
    if (!isAuthenticated) {
      login();
      return;
    }

    try {
      const projectId = parseInt(id);
      const response = await backend.joinProject(projectId);
      setIsJoining(false);

      console.log("response", response);

      if ("Ok" in response) {
        setHasJoined(true);
        toast({
          title: "Success",
          description: "You have successfully joined the project",
        });
      } else {
        toast({
          title: "Error",
          description: response.Err,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error joining project:", error);
      toast({
        title: "Error",
        description: "Failed to join project",
        variant: "destructive",
      });
    }
  };

  const renderProjectStatus = (status) => {
    status = parseInt(status);
    switch (status) {
      case 0: // inactive
        return (
          <Badge variant="secondary" className="bg-red-500/20 text-red-400">
            <Ban className="h-3 w-3 mr-1" />
            Inactive
          </Badge>
        );
      case 1: // active
        return (
          <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400">
            <Leaf className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case 2: // upcoming
        return (
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
            <CalendarClock className="h-3 w-3 mr-1" />
            Upcoming
          </Badge>
        );
      case 3: // closed
        return (
          <Badge variant="secondary" className="bg-gray-500/20 text-gray-400">
            <Clock className="h-3 w-3 mr-1" />
            Closed
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="bg-gray-500/20 text-gray-400">
            <HelpCircle className="h-3 w-3 mr-1" />
            Unknown
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 container py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-8 w-64 bg-muted rounded mb-4"></div>
              <div className="h-4 w-48 bg-muted rounded"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 container py-8">
          <div className="flex flex-col items-center justify-center h-64">
            <h1 className="text-2xl font-bold mb-2">Project Not Found</h1>
            <p className="text-muted-foreground mb-4">The project you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate("/projects")}>View All Projects</Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <main className="flex-1">
      {/* Hero Banner */}
      <section className="relative h-64 md:h-80 lg:h-96 overflow-hidden border-b border-border/40">
        <img
          src={project.imageUrl ? project.imageUrl : `https://api.dicebear.com/7.x/shapes/svg?seed=${project.title}&backgroundColor=c7d2fe,ddd6fe,fae8ff,dbeafe,bfdbfe,e0e7ff&shape1Color=4f46e5,6d28d9,7c3aed,2563eb,3b82f6,4f46e5`}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://api.dicebear.com/7.x/shapes/svg?seed=${project.title}&backgroundColor=c7d2fe,ddd6fe,fae8ff,dbeafe,bfdbfe,e0e7ff&shape1Color=4f46e5,6d28d9,7c3aed,2563eb,3b82f6,4f46e5`;
          }}
          alt={project.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="container">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="bg-black text-white border-black/20">
                    {project.category}
                  </Badge>
                  {renderProjectStatus(project.status)}
                </div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">{project.title}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{project.address}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (navigator.share) {
                      navigator
                        .share({
                          title: project.title,
                          text: project.description,
                          url: window.location.href,
                        })
                        .catch((error) => console.log("Error sharing:", error));
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      toast({
                        title: "Link copied",
                        description: "Project link has been copied to clipboard",
                      });
                    }
                  }}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Content */}
      <section className="py-8">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1">
              <div className="mb-6">
                <a href="/projects" className="text-sm text-muted-foreground hover:underline flex items-center">
                  <ArrowLeft className="h-3 w-3 mr-1" />
                  Back to Projects
                </a>
              </div>

              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  {isAuthenticated && hasJoined && <TabsTrigger value="submit">Submit Evidence</TabsTrigger>}
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <p>{project.description}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Project Impact</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                          <Leaf className="h-8 w-8 text-emerald-500 mb-2" />
                          <h3 className="font-medium text-lg">{project.impact}</h3>
                          <p className="text-sm text-muted-foreground text-center">Environmental Impact</p>
                        </div>
                        <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                          <Users className="h-8 w-8 text-blue-500 mb-2" />
                          <h3 className="font-medium text-lg">
                            {project.participants.length} / {project.maxParticipants} participants
                          </h3>
                          <p className="text-sm text-muted-foreground text-center">Community Engagement</p>
                        </div>
                        <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                          <Award className="h-8 w-8 text-amber-500 mb-2" />
                          <h3 className="font-medium text-lg">{project.reward} LUM</h3>
                          <p className="text-sm text-muted-foreground text-center">Total Rewards</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {isAuthenticated && hasJoined && (
                  <TabsContent value="submit" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Submit Evidence</CardTitle>
                        <CardDescription>Provide evidence of your participation in this project</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {userSubmission ? (
                          <div className="space-y-4">
                            <SubmissionStatus submission={userSubmission} />

                            <div className="border rounded-lg p-4">
                              <h3 className="font-medium mb-2">Your Submission</h3>
                              <div className="text-sm text-muted-foreground mb-4">Submitted on {new Date(userSubmission.submittedAt).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}</div>

                              <div className="space-y-4">
                                <div>
                                  <h4 className="text-sm font-medium mb-1">Description</h4>
                                  <p className="text-sm">{userSubmission.evidence}</p>
                                </div>

                                {userSubmission.files && userSubmission.files.length > 0 && (
                                  <div>
                                    <h4 className="text-sm font-medium mb-2">Attached Files</h4>
                                    <div className="space-y-2">
                                      {userSubmission.files.map((file, index) => {
                                        console.log(file);
                                        return (
                                          <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                            <div className="flex-1">
                                              <div className="text-sm font-medium">{file.name}</div>
                                            </div>
                                            <Button variant="ghost" size="sm" onClick={() => window.open(getAssetManagerNetwork() + file.url, "_blank")}>
                                              View
                                            </Button>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}

                                {userSubmission.feedback && (
                                  <div className="p-3 bg-muted rounded-md">
                                    <h4 className="text-sm font-medium mb-1">Admin Feedback</h4>
                                    <p className="text-sm">{userSubmission.feedback}</p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {userSubmission.status === "Rejected" && (
                              <div className="mt-4">
                                <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setUserSubmission(null)}>
                                  Submit New Evidence
                                </Button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <SubmitEvidenceForm onSubmit={handleSubmitEvidence} />
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                )}
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="lg:w-80 space-y-6">
              {isAuthenticated && !hasJoined && (
                <Card className="border-emerald-500/50 bg-emerald-500/5">
                  <CardHeader>
                    <CardTitle className="text-emerald-500">Join This Project</CardTitle>
                    <CardDescription>Participate and earn rewards</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">Join this project to participate in activities, submit evidence, and earn LUM tokens as rewards.</p>
                    <div className="flex items-center gap-2 text-sm mb-2">
                      <Award className="h-4 w-4 text-amber-500" />
                      <span>Earn up to {project.reward} LUM tokens</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span>
                        {project.participants.length} / {project.maxParticipants || "∞"} participants
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={handleJoinProject} disabled={isJoining}>
                      {isJoining ? "Joining..." : "Join Project"}
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {isAuthenticated && hasJoined && !userSubmission && (
                <Card className="border-blue-500/50 bg-blue-500/5">
                  <CardHeader>
                    <CardTitle className="text-blue-500">Submit Your Evidence</CardTitle>
                    <CardDescription>Complete project requirements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">You've joined this project! Complete the requirements and submit evidence of your participation to earn rewards.</p>
                    <div className="flex items-center gap-2 text-sm">
                      <Award className="h-4 w-4 text-amber-500" />
                      <span>Earn {project.individualReward} LUM tokens upon approval</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => document.querySelector('[data-value="submit"]').click()}>
                      {isSubmittingEvidence ? "Submitting..." : "Submit Evidence"}
                    </Button>
                  </CardFooter>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Community</div>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={`https://api.dicebear.com/7.x/identicon/svg?seed=${project.communityName}`} />
                      </Avatar>
                      <span className="font-medium">{project.communityName}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Timeline</div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {project.createdAt.toLocaleDateString()} - {project.expiredAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Reward per Participant</div>
                    <div className="flex items-center gap-2">
                      <Leaf className="h-4 w-4 text-emerald-500" />
                      <span>{project.reward} LUM</span>
                    </div>
                  </div>
                </CardContent>
                {!isAuthenticated && (
                  <CardFooter>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={login}>
                      Login to Join
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
