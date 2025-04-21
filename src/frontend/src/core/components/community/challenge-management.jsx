

import { useState } from "react"
import { Plus, Search, Filter, ArrowUpDown, Edit, Eye, Users, Calendar, Award, CheckCircle, Trophy } from "lucide-react"
import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/core/components/ui/card"
import { Badge } from "@/core/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/core/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/core/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/components/ui/select"
import { ChallengeForm } from "@/core/components/community/challenge-form"
import { Progress } from "@/core/components/ui/progress"

export function ChallengeManagement() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [challenges, setChallenges] = useState([
    {
      id: 1,
      title: "Zero Waste Week",
      description: "Challenge to produce no landfill waste for one week",
      category: "Waste",
      startDate: "2025-05-01",
      endDate: "2025-05-08",
      participants: 124,
      reward: 500,
      status: "Active",
      progress: 65,
      verified: true,
      difficulty: "Medium",
    },
    {
      id: 2,
      title: "Bike to Work Month",
      description: "Commute by bicycle for a full month",
      category: "Transportation",
      startDate: "2025-04-01",
      endDate: "2025-04-30",
      participants: 87,
      reward: 750,
      status: "Active",
      progress: 90,
      verified: true,
      difficulty: "Hard",
    },
    {
      id: 3,
      title: "Plastic-Free Challenge",
      description: "Avoid single-use plastics for 30 days",
      category: "Waste",
      startDate: "2025-05-15",
      endDate: "2025-06-15",
      participants: 156,
      reward: 600,
      status: "Pending",
      progress: 0,
      verified: false,
      difficulty: "Medium",
    },
    {
      id: 4,
      title: "Local Food Only",
      description: "Eat only locally-sourced food for two weeks",
      category: "Food",
      startDate: "2025-06-01",
      endDate: "2025-06-15",
      participants: 42,
      reward: 450,
      status: "Draft",
      progress: 0,
      verified: false,
      difficulty: "Medium",
    },
    {
      id: 5,
      title: "Energy Conservation",
      description: "Reduce home energy usage by 20% for one month",
      category: "Energy",
      startDate: "2025-05-01",
      endDate: "2025-05-31",
      participants: 68,
      reward: 550,
      status: "Active",
      progress: 45,
      verified: true,
      difficulty: "Easy",
    },
    {
      id: 6,
      title: "Water Saving Challenge",
      description: "Reduce water consumption by 30% for two weeks",
      category: "Water",
      startDate: "2025-04-15",
      endDate: "2025-04-30",
      participants: 93,
      reward: 400,
      status: "Completed",
      progress: 100,
      verified: true,
      difficulty: "Medium",
    },
    {
      id: 7,
      title: "Public Transport Only",
      description: "Use only public transportation for commuting for one month",
      category: "Transportation",
      startDate: "2025-03-01",
      endDate: "2025-03-31",
      participants: 112,
      reward: 700,
      status: "Completed",
      progress: 100,
      verified: true,
      difficulty: "Medium",
    },
  ])

  const handleCreateChallenge = (newChallenge) => {
    setChallenges([
      ...challenges,
      {
        ...newChallenge,
        id: challenges.length + 1,
        participants: 0,
        progress: 0,
        verified: false,
      },
    ])
    setIsCreateDialogOpen(false)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-emerald-500">Active</Badge>
      case "Draft":
        return <Badge className="bg-blue-500">Draft</Badge>
      case "Pending":
        return <Badge className="bg-amber-500">Pending</Badge>
      case "Completed":
        return <Badge className="bg-purple-500">Completed</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
            Easy
          </Badge>
        )
      case "Medium":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
            Medium
          </Badge>
        )
      case "Hard":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
            Hard
          </Badge>
        )
      default:
        return <Badge variant="outline">{difficulty}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search challenges..." className="pl-9" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="energy">Energy</SelectItem>
              <SelectItem value="water">Water</SelectItem>
              <SelectItem value="waste">Waste</SelectItem>
              <SelectItem value="transportation">Transportation</SelectItem>
              <SelectItem value="food">Food</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Challenge
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Challenge</DialogTitle>
              <DialogDescription>Fill in the details to create a new sustainability challenge</DialogDescription>
            </DialogHeader>
            <ChallengeForm onSubmit={handleCreateChallenge} onCancel={() => setIsCreateDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Challenges</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Challenge Management</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    Sort
                  </Button>
                </div>
              </div>
              <CardDescription>Manage all your sustainability challenges</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <div className="grid grid-cols-12 p-4 bg-muted text-sm font-medium">
                  <div className="col-span-4">Challenge</div>
                  <div className="col-span-1 text-center">Difficulty</div>
                  <div className="col-span-2 text-center">Timeline</div>
                  <div className="col-span-1 text-center">Participants</div>
                  <div className="col-span-1 text-center">Reward</div>
                  <div className="col-span-1 text-center">Progress</div>
                  <div className="col-span-1 text-center">Status</div>
                  <div className="col-span-1 text-center">Actions</div>
                </div>
                <div className="divide-y">
                  {challenges.map((challenge) => (
                    <div key={challenge.id} className="grid grid-cols-12 p-4 items-center">
                      <div className="col-span-4">
                        <div className="font-medium">{challenge.title}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-xs">{challenge.description}</div>
                      </div>
                      <div className="col-span-1 text-center">{getDifficultyBadge(challenge.difficulty)}</div>
                      <div className="col-span-2 text-center text-sm">
                        <div className="flex items-center justify-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>
                            {new Date(challenge.startDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="text-muted-foreground">
                          to{" "}
                          {new Date(challenge.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </div>
                      </div>
                      <div className="col-span-1 text-center">
                        <div className="flex items-center justify-center">
                          <Users className="h-3 w-3 mr-1" />
                          <span>{challenge.participants}</span>
                        </div>
                      </div>
                      <div className="col-span-1 text-center">
                        <div className="flex items-center justify-center">
                          <Award className="h-3 w-3 mr-1 text-amber-500" />
                          <span>{challenge.reward}</span>
                        </div>
                      </div>
                      <div className="col-span-1 text-center">
                        <Progress value={challenge.progress} className="h-2 w-16 mx-auto" />
                      </div>
                      <div className="col-span-1 text-center">{getStatusBadge(challenge.status)}</div>
                      <div className="col-span-1 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-6">
              <div className="text-sm text-muted-foreground">Showing {challenges.length} challenges</div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {challenges
                  .filter((c) => c.status === "Active")
                  .map((challenge) => (
                    <Card key={challenge.id} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{challenge.title}</CardTitle>
                          {getStatusBadge(challenge.status)}
                        </div>
                        <CardDescription className="line-clamp-2">{challenge.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Category:</span>
                            <span>{challenge.category}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Difficulty:</span>
                            <span>{getDifficultyBadge(challenge.difficulty)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Timeline:</span>
                            <span>
                              {new Date(challenge.startDate).toLocaleDateString()} -{" "}
                              {new Date(challenge.endDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Participants:</span>
                            <span>{challenge.participants}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Reward:</span>
                            <span className="flex items-center">
                              <Award className="h-3 w-3 mr-1 text-amber-500" />
                              {challenge.reward} LUM
                            </span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Progress:</span>
                              <span>{challenge.progress}%</span>
                            </div>
                            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                              <div
                                className="h-full bg-amber-500 rounded-full"
                                style={{ width: `${challenge.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t pt-4 flex justify-between">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trophy className="h-4 w-4 mr-2" />
                          Leaderboard
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {challenges
                  .filter((c) => c.status === "Draft" || c.status === "Pending")
                  .map((challenge) => (
                    <Card key={challenge.id} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{challenge.title}</CardTitle>
                          {getStatusBadge(challenge.status)}
                        </div>
                        <CardDescription className="line-clamp-2">{challenge.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Category:</span>
                            <span>{challenge.category}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Difficulty:</span>
                            <span>{getDifficultyBadge(challenge.difficulty)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Timeline:</span>
                            <span>
                              {new Date(challenge.startDate).toLocaleDateString()} -{" "}
                              {new Date(challenge.endDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Reward:</span>
                            <span className="flex items-center">
                              <Award className="h-3 w-3 mr-1 text-amber-500" />
                              {challenge.reward} LUM
                            </span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t pt-4 flex justify-between">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button className="bg-emerald-600 hover:bg-emerald-700" size="sm">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Publish
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {challenges
                  .filter((c) => c.status === "Completed")
                  .map((challenge) => (
                    <Card key={challenge.id} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{challenge.title}</CardTitle>
                          {getStatusBadge(challenge.status)}
                        </div>
                        <CardDescription className="line-clamp-2">{challenge.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Category:</span>
                            <span>{challenge.category}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Difficulty:</span>
                            <span>{getDifficultyBadge(challenge.difficulty)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Timeline:</span>
                            <span>
                              {new Date(challenge.startDate).toLocaleDateString()} -{" "}
                              {new Date(challenge.endDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Participants:</span>
                            <span>{challenge.participants}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Reward:</span>
                            <span className="flex items-center">
                              <Award className="h-3 w-3 mr-1 text-amber-500" />
                              {challenge.reward} LUM
                            </span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t pt-4 flex justify-between">
                        <Button variant="outline" size="sm">
                          <Trophy className="h-4 w-4 mr-2" />
                          Winners
                        </Button>
                        <Button variant="outline" size="sm">
                          <Award className="h-4 w-4 mr-2" />
                          Impact Report
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
