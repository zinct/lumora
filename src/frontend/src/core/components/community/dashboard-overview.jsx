import { useState } from "react";
import {
  Users,
  Award,
  TrendingUp,
  CheckCircle,
  Clock,
  Leaf,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Button } from "@/core/components/ui/button";
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

export function DashboardOverview() {
  // In a real app, this data would come from an API
  const [stats] = useState({
    activeProjects: 12,
    activeChallenges: 8,
    pendingSubmissions: 47,
    totalParticipants: 1248,
    totalRewardsDistributed: 25600,
    projectCompletionRate: 78,
  });

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Active Projects
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProjects}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Active Challenges
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeChallenges}</div>
            <p className="text-xs text-muted-foreground">+3 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Submissions
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingSubmissions}</div>
            <p className="text-xs text-muted-foreground">Requires review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Participants
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalParticipants}</div>
            <p className="text-xs text-muted-foreground">
              +124 from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions in the community</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                action: "New submission",
                project: "Ocean Cleanup Challenge",
                user: "Alex Johnson",
                time: "10 minutes ago",
                icon: <CheckCircle className="h-4 w-4 text-emerald-500" />,
                avatar: "AJ",
              },
              {
                action: "Project completed",
                project: "Community Garden Initiative",
                user: "Maria Rodriguez",
                time: "2 hours ago",
                icon: <Leaf className="h-4 w-4 text-emerald-500" />,
                avatar: "MR",
              },
              {
                action: "Challenge created",
                project: "Zero Waste Week",
                user: "Sam Taylor",
                time: "Yesterday",
                icon: <Award className="h-4 w-4 text-blue-500" />,
                avatar: "ST",
              },
              {
                action: "Rewards distributed",
                project: "Bike to Work Challenge",
                user: "Admin",
                time: "2 days ago",
                icon: <Leaf className="h-4 w-4 text-emerald-500" />,
                avatar: "A",
              },
            ].map((activity, i) => (
              <div key={i} className="flex items-start space-x-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={`/placeholder.svg?height=32&width=32&text=${activity.avatar}`}
                  />
                  <AvatarFallback>{activity.avatar}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.action}
                    <span className="text-muted-foreground"> in </span>
                    {activity.project}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    By {activity.user} • {activity.time}
                  </p>
                </div>
                <div className="ml-auto">{activity.icon}</div>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full" size="sm">
              View All Activity
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
            <CardDescription>
              Projects and challenges ending soon
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                title: "Plastic-Free Challenge",
                deadline: "Tomorrow",
                submissions: 28,
                status: "Urgent",
                statusColor: "bg-red-500",
              },
              {
                title: "Solar Panel Installation",
                deadline: "3 days",
                submissions: 12,
                status: "Approaching",
                statusColor: "bg-amber-500",
              },
              {
                title: "Community Cleanup",
                deadline: "1 week",
                submissions: 45,
                status: "On Track",
                statusColor: "bg-emerald-500",
              },
              {
                title: "Sustainable Transport",
                deadline: "2 weeks",
                submissions: 19,
                status: "On Track",
                statusColor: "bg-emerald-500",
              },
            ].map((deadline, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="flex-1">
                  <p className="text-sm font-medium">{deadline.title}</p>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 text-muted-foreground mr-1" />
                    <p className="text-xs text-muted-foreground">
                      Ends in {deadline.deadline} • {deadline.submissions}{" "}
                      submissions
                    </p>
                  </div>
                </div>
                <Badge className={`${deadline.statusColor}`}>
                  {deadline.status}
                </Badge>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full" size="sm">
              View All Deadlines
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Recent Projects & Challenges */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Projects & Challenges</CardTitle>
          <CardDescription>
            Overview of recently created initiatives
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="projects">
            <TabsList className="mb-4">
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="challenges">Challenges</TabsTrigger>
            </TabsList>

            <TabsContent value="projects">
              <div className="space-y-4">
                {[
                  {
                    title: "Community Garden Initiative",
                    description:
                      "Creating urban gardens in underserved neighborhoods",
                    participants: 45,
                    reward: 2500,
                    status: "Active",
                    statusColor: "bg-emerald-500",
                  },
                  {
                    title: "Solar Panel Collective",
                    description:
                      "Group purchasing program for residential solar panels",
                    participants: 32,
                    reward: 5000,
                    status: "Active",
                    statusColor: "bg-emerald-500",
                  },
                  {
                    title: "Rainwater Harvesting",
                    description:
                      "Installing rainwater collection systems in community buildings",
                    participants: 18,
                    reward: 1800,
                    status: "Draft",
                    statusColor: "bg-blue-500",
                  },
                ].map((project, i) => (
                  <div
                    key={i}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1 mb-4 md:mb-0">
                      <div className="flex items-center">
                        <h3 className="font-medium">{project.title}</h3>
                        <Badge className={`ml-2 ${project.statusColor}`}>
                          {project.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {project.description}
                      </p>
                    </div>
                    <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-start md:items-center">
                      <div className="text-sm">
                        <Users className="h-3 w-3 inline mr-1" />
                        {project.participants} participants
                      </div>
                      <div className="text-sm">
                        <Leaf className="h-3 w-3 inline mr-1 text-emerald-500" />
                        {project.reward} LUM
                      </div>
                      <Button size="sm">Manage</Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="challenges">
              <div className="space-y-4">
                {[
                  {
                    title: "Zero Waste Week",
                    description:
                      "Challenge to produce no landfill waste for one week",
                    participants: 124,
                    reward: 500,
                    status: "Active",
                    statusColor: "bg-emerald-500",
                  },
                  {
                    title: "Bike to Work Month",
                    description: "Commute by bicycle for a full month",
                    participants: 87,
                    reward: 750,
                    status: "Active",
                    statusColor: "bg-emerald-500",
                  },
                  {
                    title: "Plastic-Free Challenge",
                    description: "Avoid single-use plastics for 30 days",
                    participants: 156,
                    reward: 600,
                    status: "Ending Soon",
                    statusColor: "bg-amber-500",
                  },
                ].map((challenge, i) => (
                  <div
                    key={i}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1 mb-4 md:mb-0">
                      <div className="flex items-center">
                        <h3 className="font-medium">{challenge.title}</h3>
                        <Badge className={`ml-2 ${challenge.statusColor}`}>
                          {challenge.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {challenge.description}
                      </p>
                    </div>
                    <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-start md:items-center">
                      <div className="text-sm">
                        <Users className="h-3 w-3 inline mr-1" />
                        {challenge.participants} participants
                      </div>
                      <div className="text-sm">
                        <Award className="h-3 w-3 inline mr-1 text-amber-500" />
                        {challenge.reward} LUM
                      </div>
                      <Button size="sm">Manage</Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <div className="flex justify-between w-full">
            <Button variant="outline">Create Project</Button>
            <Button variant="outline">Create Challenge</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
