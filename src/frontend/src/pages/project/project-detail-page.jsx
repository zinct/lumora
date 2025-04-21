import { useState, useEffect } from "react";
import { Button } from "@/core/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Badge } from "@/core/components/ui/badge";
import { Progress } from "@/core/components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/core/components/ui/tabs";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/core/components/ui/avatar";
import { SubmitEvidenceForm } from "@/core/components/community/submit-evidence-form";
import { SubmissionStatus } from "@/core/components/community/submission-status";
import { useToast } from "@/core/hooks/use-toast";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Leaf,
  MapPin,
  Share2,
  Users,
  Award,
} from "lucide-react";
import { useNavigate } from "react-router";

export default function ProjectDetailPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userSubmission, setUserSubmission] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // In a real app, this would come from auth state
  const [hasJoined, setHasJoined] = useState(false); // Track if user has joined the project

  useEffect(() => {
    // In a real app, this would be an API call to fetch the project details
    const fetchProject = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock project data
        setProject({
          id: 1,
          title: "Community Reforestation Initiative",
          description:
            "A collaborative effort to restore native forests in urban areas. This project aims to plant 1,000 trees across the city, creating green spaces, improving air quality, and enhancing biodiversity. Participants will help with planting, maintenance, and monitoring of tree growth.",
          longDescription:
            "The Community Reforestation Initiative is a comprehensive approach to urban environmental restoration. By strategically planting native tree species in underserved neighborhoods, we aim to address multiple environmental and social challenges simultaneously.\n\nEnvironmental Benefits:\n- Carbon sequestration to combat climate change\n- Improved air quality through natural filtration\n- Enhanced biodiversity by creating habitats for local wildlife\n- Reduced urban heat island effect\n- Natural stormwater management\n\nSocial Benefits:\n- Creation of green spaces for community gathering\n- Educational opportunities about local ecosystems\n- Improved mental and physical health for residents\n- Community building through collaborative planting events\n\nParticipants will be involved in all aspects of the project, from site selection and preparation to planting, maintenance, and monitoring. Training will be provided on proper planting techniques, tree care, and data collection methods.",
          category: "Forestry",
          location: "Portland, Oregon",
          startDate: "2025-05-01",
          endDate: "2025-08-31",
          participants: 324,
          maxParticipants: 500,
          reward: 15000,
          individualReward: 50,
          progress: 35,
          verified: true,
          status: "Active",
          impact: "1,250 trees planted",
          organizer: {
            name: "Green Urban Spaces",
            avatar: "GU",
          },
          updates: [
            {
              date: "2025-05-15",
              title: "First planting event completed",
              content:
                "We successfully planted 250 trees in the downtown area with the help of 75 volunteers. Thank you to everyone who participated!",
            },
            {
              date: "2025-05-30",
              title: "Second location prepared",
              content:
                "The second planting site has been prepared. We've cleared invasive species and improved the soil quality. Ready for planting next week!",
            },
          ],
          requirements: [
            "Attend at least one planting session (3-4 hours)",
            "Complete basic tree care training (online or in-person)",
            "Submit photos of your planted trees",
            "Participate in at least one follow-up maintenance session",
          ],
          timeline: [
            {
              date: "2025-05-01",
              event: "Project kickoff and training sessions",
            },
            {
              date: "2025-05-15",
              event: "First planting event (Downtown)",
            },
            {
              date: "2025-06-05",
              event: "Second planting event (Eastside)",
            },
            {
              date: "2025-06-25",
              event: "Third planting event (Westside)",
            },
            {
              date: "2025-07-15",
              event: "Maintenance workshop",
            },
            {
              date: "2025-08-15",
              event: "Final assessment and celebration",
            },
          ],
        });

        // Mock user submission if logged in
        if (Math.random() > 0.5) {
          setIsLoggedIn(true);
          // Randomly determine if user has joined the project
          const joined = Math.random() > 0.3;
          setHasJoined(joined);

          // If joined and random condition, set a submission
          if (joined && Math.random() > 0.5) {
            setUserSubmission({
              id: 1,
              status: ["Pending", "Approved", "Rejected"][
                Math.floor(Math.random() * 3)
              ],
              submittedAt: "2025-05-20T14:30:00",
              evidence: "Planted 5 trees in the downtown area",
              files: [
                {
                  name: "tree_planting_photo.jpg",
                  type: "image",
                  size: "2.4 MB",
                },
                {
                  name: "location_data.csv",
                  type: "document",
                  size: "45 KB",
                },
              ],
              feedback: "Great work! The trees look healthy and well-planted.",
            });
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching project:", error);
        setIsLoading(false);
      }
    };

    fetchProject();
  }, []);

  const handleSubmitEvidence = (data) => {
    // In a real app, this would be an API call to submit evidence
    setUserSubmission({
      id: Date.now(),
      status: "Pending",
      submittedAt: new Date().toISOString(),
      evidence: data.description,
      files: data.files,
    });

    toast({
      title: "Evidence submitted successfully",
      description:
        "Your submission is now pending review by project administrators.",
    });
  };

  const handleJoinProject = () => {
    if (!isLoggedIn) {
      openLoginModal("project", `/projects/${1}`);
    } else {
      // In a real app, this would be an API call to join the project
      setHasJoined(true);
      toast({
        title: "Project joined successfully",
        description: "You are now a participant in this project.",
      });
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
            <p className="text-muted-foreground mb-4">
              The project you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate("/projects")}>
              View All Projects
            </Button>
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
          src={`/placeholder.svg?height=600&width=1200&text=Project ${project.id}`}
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
                  <Badge
                    variant="outline"
                    className="bg-primary/10 text-primary border-primary/20"
                  >
                    {project.category}
                  </Badge>
                  {project.verified && (
                    <Badge className="bg-emerald-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  <Badge variant="outline">{project.status}</Badge>
                </div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                  {project.title}
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {project.location}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                {isLoggedIn && hasJoined ? (
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    size="sm"
                    onClick={() => router.push("/balance")}
                  >
                    <Leaf className="h-4 w-4 mr-2" />
                    View Balance
                  </Button>
                ) : (
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700"
                    size="sm"
                    onClick={handleJoinProject}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    {isLoggedIn ? "Join Project" : "Login to Join"}
                  </Button>
                )}
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
                <a
                  href="/projects"
                  className="text-sm text-muted-foreground hover:underline flex items-center"
                >
                  <ArrowLeft className="h-3 w-3 mr-1" />
                  Back to Projects
                </a>
              </div>

              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="updates">Updates</TabsTrigger>
                  <TabsTrigger value="requirements">Requirements</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  {isLoggedIn && hasJoined && (
                    <TabsTrigger value="submit">Submit Evidence</TabsTrigger>
                  )}
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <p>{project.description}</p>
                        <div className="mt-4">
                          {project.longDescription
                            .split("\n\n")
                            .map((paragraph, index) => (
                              <p key={index} className="mb-4">
                                {paragraph}
                              </p>
                            ))}
                        </div>
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
                          <h3 className="font-medium text-lg">
                            {project.impact}
                          </h3>
                          <p className="text-sm text-muted-foreground text-center">
                            Environmental Impact
                          </p>
                        </div>
                        <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                          <Users className="h-8 w-8 text-blue-500 mb-2" />
                          <h3 className="font-medium text-lg">
                            {project.participants} participants
                          </h3>
                          <p className="text-sm text-muted-foreground text-center">
                            Community Engagement
                          </p>
                        </div>
                        <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                          <Award className="h-8 w-8 text-amber-500 mb-2" />
                          <h3 className="font-medium text-lg">
                            {project.reward} LUM
                          </h3>
                          <p className="text-sm text-muted-foreground text-center">
                            Total Rewards
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="updates" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Updates</CardTitle>
                      <CardDescription>
                        Latest news and progress updates
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {project.updates.map((update, index) => (
                          <div
                            key={index}
                            className="border-b pb-6 last:border-0 last:pb-0"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <Badge
                                variant="outline"
                                className="bg-blue-500/10 text-blue-500 border-blue-500/20"
                              >
                                {new Date(update.date).toLocaleDateString()}
                              </Badge>
                            </div>
                            <h3 className="text-lg font-medium mb-2">
                              {update.title}
                            </h3>
                            <p className="text-muted-foreground">
                              {update.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="requirements" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Participation Requirements</CardTitle>
                      <CardDescription>
                        What you need to do to complete this project
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-4">
                        {project.requirements.map((requirement, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-medium text-primary">
                                {index + 1}
                              </span>
                            </div>
                            <span>{requirement}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="timeline" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Timeline</CardTitle>
                      <CardDescription>
                        Key dates and milestones
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="relative">
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>
                        <div className="space-y-6">
                          {project.timeline.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-4 relative"
                            >
                              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 z-10">
                                <Calendar className="h-4 w-4 text-primary-foreground" />
                              </div>
                              <div className="pt-1">
                                <div className="font-medium">{item.event}</div>
                                <div className="text-sm text-muted-foreground">
                                  {new Date(item.date).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {isLoggedIn && hasJoined && (
                  <TabsContent value="submit" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Submit Evidence</CardTitle>
                        <CardDescription>
                          Provide evidence of your participation in this project
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {userSubmission ? (
                          <div className="space-y-4">
                            <SubmissionStatus submission={userSubmission} />

                            <div className="border rounded-lg p-4">
                              <h3 className="font-medium mb-2">
                                Your Submission
                              </h3>
                              <div className="text-sm text-muted-foreground mb-4">
                                Submitted on{" "}
                                {new Date(
                                  userSubmission.submittedAt
                                ).toLocaleString()}
                              </div>

                              <div className="space-y-4">
                                <div>
                                  <h4 className="text-sm font-medium mb-1">
                                    Description
                                  </h4>
                                  <p className="text-sm">
                                    {userSubmission.evidence}
                                  </p>
                                </div>

                                {userSubmission.files &&
                                  userSubmission.files.length > 0 && (
                                    <div>
                                      <h4 className="text-sm font-medium mb-2">
                                        Attached Files
                                      </h4>
                                      <div className="space-y-2">
                                        {userSubmission.files.map(
                                          (file, index) => (
                                            <div
                                              key={index}
                                              className="flex items-center gap-2 p-2 bg-muted/50 rounded-md"
                                            >
                                              <FileText className="h-4 w-4 text-muted-foreground" />
                                              <div className="flex-1">
                                                <div className="text-sm font-medium">
                                                  {file.name}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                  {file.size}
                                                </div>
                                              </div>
                                              <Button variant="ghost" size="sm">
                                                View
                                              </Button>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}

                                {userSubmission.feedback && (
                                  <div className="p-3 bg-muted rounded-md">
                                    <h4 className="text-sm font-medium mb-1">
                                      Admin Feedback
                                    </h4>
                                    <p className="text-sm">
                                      {userSubmission.feedback}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {userSubmission.status === "Rejected" && (
                              <div className="mt-4">
                                <Button
                                  className="bg-emerald-600 hover:bg-emerald-700"
                                  onClick={() => setUserSubmission(null)}
                                >
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
              {isLoggedIn && !hasJoined && (
                <Card className="border-emerald-500/50 bg-emerald-500/5">
                  <CardHeader>
                    <CardTitle className="text-emerald-500">
                      Join This Project
                    </CardTitle>
                    <CardDescription>
                      Participate and earn rewards
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">
                      Join this project to participate in activities, submit
                      evidence, and earn LUM tokens as rewards.
                    </p>
                    <div className="flex items-center gap-2 text-sm mb-2">
                      <Award className="h-4 w-4 text-amber-500" />
                      <span>
                        Earn up to {project.individualReward} LUM tokens
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span>
                        {project.participants} /{" "}
                        {project.maxParticipants || "∞"} participants
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      onClick={handleJoinProject}
                    >
                      Join Project
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {isLoggedIn && hasJoined && !userSubmission && (
                <Card className="border-blue-500/50 bg-blue-500/5">
                  <CardHeader>
                    <CardTitle className="text-blue-500">
                      Submit Your Evidence
                    </CardTitle>
                    <CardDescription>
                      Complete project requirements
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">
                      You've joined this project! Complete the requirements and
                      submit evidence of your participation to earn rewards.
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <Award className="h-4 w-4 text-amber-500" />
                      <span>
                        Earn {project.individualReward} LUM tokens upon approval
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() =>
                        document.querySelector('[data-value="submit"]').click()
                      }
                    >
                      Submit Evidence
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
                    <div className="text-sm text-muted-foreground">
                      Organizer
                    </div>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={`/placeholder.svg?height=24&width=24&text=${project.organizer.avatar}`}
                        />
                        <AvatarFallback>
                          {project.organizer.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">
                        {project.organizer.name}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">
                      Timeline
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {new Date(project.startDate).toLocaleDateString()} -{" "}
                        {new Date(project.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">
                      Participants
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {project.participants} /{" "}
                        {project.maxParticipants || "∞"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">
                      Reward per Participant
                    </div>
                    <div className="flex items-center gap-2">
                      <Leaf className="h-4 w-4 text-emerald-500" />
                      <span>{project.individualReward} LUM</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                </CardContent>
                {!isLoggedIn && (
                  <CardFooter>
                    <Button
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      onClick={handleJoinProject}
                    >
                      Login to Join
                    </Button>
                  </CardFooter>
                )}
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Project Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.timeline.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          <Clock className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">
                            {item.event}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(item.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {project.timeline.length > 3 && (
                    <Button
                      variant="link"
                      className="mt-2 p-0 h-auto"
                      onClick={() =>
                        document
                          .querySelector('[data-value="timeline"]')
                          .click()
                      }
                    >
                      View full timeline
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
