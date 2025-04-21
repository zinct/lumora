

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search, Filter, ArrowUpDown, Edit, Eye, Users, Calendar, Leaf, Trash } from "lucide-react"
import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/core/components/ui/card"
import { Badge } from "@/core/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/core/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/components/ui/select"
import { DeleteProjectModal } from "@/core/components/community/delete-project-modal"

export function ProjectManagementEnhanced() {
  const router = useRouter()
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "Community Garden Initiative",
      description: "Creating urban gardens in underserved neighborhoods",
      category: "Agriculture",
      startDate: "2025-05-01",
      endDate: "2025-08-31",
      participants: 45,
      reward: 2500,
      status: "Active",
      progress: 35,
      verified: true,
    },
    {
      id: 2,
      title: "Solar Panel Collective",
      description: "Group purchasing program for residential solar panels",
      category: "Energy",
      startDate: "2025-04-15",
      endDate: "2025-07-15",
      participants: 32,
      reward: 5000,
      status: "Active",
      progress: 60,
      verified: true,
    },
    {
      id: 3,
      title: "Rainwater Harvesting",
      description: "Installing rainwater collection systems in community buildings",
      category: "Water",
      startDate: "2025-06-01",
      endDate: "2025-09-30",
      participants: 18,
      reward: 1800,
      status: "Draft",
      progress: 0,
      verified: false,
    },
    {
      id: 4,
      title: "Sustainable Transportation Network",
      description: "Creating a community carpooling and bike-sharing program",
      category: "Transportation",
      startDate: "2025-05-15",
      endDate: "2025-11-15",
      participants: 56,
      reward: 3200,
      status: "Active",
      progress: 25,
      verified: true,
    },
    {
      id: 5,
      title: "Zero Waste Business Program",
      description: "Helping local businesses reduce waste and implement sustainable practices",
      category: "Waste",
      startDate: "2025-07-01",
      endDate: "2025-12-31",
      participants: 12,
      reward: 4500,
      status: "Pending",
      progress: 0,
      verified: false,
    },
  ])

  const handleDeleteProject = (projectId) => {
    setProjects(projects.filter((project) => project.id !== projectId))
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search projects..." className="pl-9" />
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
              <SelectItem value="agriculture">Agriculture</SelectItem>
              <SelectItem value="forestry">Forestry</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          className="bg-emerald-600 hover:bg-emerald-700"
          onClick={() => router.push("/community/projects/create")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Project
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Projects</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Project Management</CardTitle>
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
              <CardDescription>Manage all your sustainability projects</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <div className="grid grid-cols-12 p-4 bg-muted text-sm font-medium">
                  <div className="col-span-4">Project</div>
                  <div className="col-span-2 text-center">Category</div>
                  <div className="col-span-2 text-center">Timeline</div>
                  <div className="col-span-1 text-center">Participants</div>
                  <div className="col-span-1 text-center">Reward</div>
                  <div className="col-span-1 text-center">Status</div>
                  <div className="col-span-1 text-center">Actions</div>
                </div>
                <div className="divide-y">
                  {projects.map((project) => (
                    <div key={project.id} className="grid grid-cols-12 p-4 items-center">
                      <div className="col-span-4">
                        <div className="font-medium">{project.title}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-xs">{project.description}</div>
                      </div>
                      <div className="col-span-2 text-center">
                        <Badge variant="outline">{project.category}</Badge>
                      </div>
                      <div className="col-span-2 text-center text-sm">
                        <div className="flex items-center justify-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>
                            {new Date(project.startDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="text-muted-foreground">
                          to {new Date(project.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </div>
                      </div>
                      <div className="col-span-1 text-center">
                        <div className="flex items-center justify-center">
                          <Users className="h-3 w-3 mr-1" />
                          <span>{project.participants}</span>
                        </div>
                      </div>
                      <div className="col-span-1 text-center">
                        <div className="flex items-center justify-center">
                          <Leaf className="h-3 w-3 mr-1 text-emerald-500" />
                          <span>{project.reward}</span>
                        </div>
                      </div>
                      <div className="col-span-1 text-center">{getStatusBadge(project.status)}</div>
                      <div className="col-span-1 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Button variant="ghost" size="icon" onClick={() => router.push(`/projects/${project.id}`)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <DeleteProjectModal
                            project={project}
                            onDelete={handleDeleteProject}
                            trigger={
                              <Button variant="ghost" size="icon">
                                <Trash className="h-4 w-4 text-destructive" />
                              </Button>
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-6">
              <div className="text-sm text-muted-foreground">Showing {projects.length} projects</div>
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

        {/* Other tabs content remains the same */}
        <TabsContent value="active" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects
                  .filter((p) => p.status === "Active")
                  .map((project) => (
                    <Card key={project.id} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{project.title}</CardTitle>
                          {getStatusBadge(project.status)}
                        </div>
                        <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Category:</span>
                            <span>{project.category}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Timeline:</span>
                            <span>
                              {new Date(project.startDate).toLocaleDateString()} -{" "}
                              {new Date(project.endDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Participants:</span>
                            <span>{project.participants}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Reward:</span>
                            <span className="flex items-center">
                              <Leaf className="h-3 w-3 mr-1 text-emerald-500" />
                              {project.reward} LUM
                            </span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Progress:</span>
                              <span>{project.progress}%</span>
                            </div>
                            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                              <div
                                className="h-full bg-emerald-500 rounded-full"
                                style={{ width: `${project.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t pt-4 flex justify-between">
                        <Button variant="outline" size="sm" onClick={() => router.push(`/projects/${project.id}`)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <DeleteProjectModal
                          project={project}
                          onDelete={handleDeleteProject}
                          trigger={
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive border-destructive/20 hover:bg-destructive/10"
                            >
                              <Trash className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          }
                        />
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
