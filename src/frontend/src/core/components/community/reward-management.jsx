

import { useState } from "react"
import { Search, Filter, ArrowUpDown, Leaf, Award, User, Calendar, Clock, CheckCircle, Send } from "lucide-react"
import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/core/components/ui/card"
import { Badge } from "@/core/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/core/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/core/components/ui/dialog"
import { Label } from "@/core/components/ui/label"
import { Textarea } from "@/core/components/ui/textarea"

export function RewardManagement() {
  const [isDistributeDialogOpen, setIsDistributeDialogOpen] = useState(false)
  const [selectedReward, setSelectedReward] = useState(null)
  const [distributionMessage, setDistributionMessage] = useState("")
  const [rewards, setRewards] = useState([
    {
      id: 1,
      title: "Zero Waste Week Completion",
      type: "Challenge",
      name: "Zero Waste Week",
      recipients: 124,
      totalAmount: 62000,
      individualAmount: 500,
      status: "Pending",
      dueDate: "2025-05-10",
    },
    {
      id: 2,
      title: "Bike to Work Month Completion",
      type: "Challenge",
      name: "Bike to Work Month",
      recipients: 87,
      totalAmount: 65250,
      individualAmount: 750,
      status: "Distributed",
      distributedDate: "2025-05-01",
    },
    {
      id: 3,
      title: "Community Garden Initiative Q2 Milestone",
      type: "Project",
      name: "Community Garden Initiative",
      recipients: 45,
      totalAmount: 22500,
      individualAmount: 500,
      status: "Pending",
      dueDate: "2025-06-15",
    },
    {
      id: 4,
      title: "Water Saving Challenge Completion",
      type: "Challenge",
      name: "Water Saving Challenge",
      recipients: 93,
      totalAmount: 37200,
      individualAmount: 400,
      status: "Distributed",
      distributedDate: "2025-05-01",
    },
    {
      id: 5,
      title: "Solar Panel Collective Q1 Milestone",
      type: "Project",
      name: "Solar Panel Collective",
      recipients: 32,
      totalAmount: 32000,
      individualAmount: 1000,
      status: "Distributed",
      distributedDate: "2025-04-15",
    },
    {
      id: 6,
      title: "Public Transport Only Completion",
      type: "Challenge",
      name: "Public Transport Only",
      recipients: 112,
      totalAmount: 78400,
      individualAmount: 700,
      status: "Distributed",
      distributedDate: "2025-04-01",
    },
    {
      id: 7,
      title: "Reforestation Project Q2 Milestone",
      type: "Project",
      name: "Reforestation Project",
      recipients: 72,
      totalAmount: 36000,
      individualAmount: 500,
      status: "Pending",
      dueDate: "2025-06-30",
    },
  ])

  const handleDistributeReward = (reward) => {
    setSelectedReward(reward)
    setDistributionMessage(
      `Congratulations on completing the ${reward.name}! You've earned ${reward.individualAmount} LUM tokens for your contribution to sustainability.`,
    )
    setIsDistributeDialogOpen(true)
  }

  const handleConfirmDistribution = () => {
    setRewards(
      rewards.map((reward) =>
        reward.id === selectedReward.id
          ? {
              ...reward,
              status: "Distributed",
              distributedDate: new Date().toISOString().split("T")[0],
              dueDate: undefined,
            }
          : reward,
      ),
    )
    setIsDistributeDialogOpen(false)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "Distributed":
        return <Badge className="bg-emerald-500">Distributed</Badge>
      case "Pending":
        return <Badge className="bg-amber-500">Pending</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case "Challenge":
        return <Award className="h-4 w-4 text-amber-500" />
      case "Project":
        return <Leaf className="h-4 w-4 text-emerald-500" />
      default:
        return <Award className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search rewards..." className="pl-9" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="distributed">Distributed</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="challenge">Challenge</SelectItem>
              <SelectItem value="project">Project</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending Distribution</TabsTrigger>
          <TabsTrigger value="all">All Rewards</TabsTrigger>
          <TabsTrigger value="distributed">Distributed</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Rewards Pending Distribution</CardTitle>
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
              <CardDescription>
                Distribute rewards to participants who have completed challenges or projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rewards
                  .filter((r) => r.status === "Pending")
                  .map((reward) => (
                    <Card key={reward.id} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(reward.type)}
                            <CardTitle className="text-base">{reward.title}</CardTitle>
                          </div>
                          {getStatusBadge(reward.status)}
                        </div>
                        <CardDescription className="text-sm">
                          {reward.type}: {reward.name}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">Recipients</div>
                            <div className="font-medium flex items-center">
                              <User className="h-4 w-4 mr-2 text-muted-foreground" />
                              {reward.recipients} participants
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">Individual Reward</div>
                            <div className="font-medium flex items-center">
                              <Leaf className="h-4 w-4 mr-2 text-emerald-500" />
                              {reward.individualAmount} LUM
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">Total Amount</div>
                            <div className="font-medium flex items-center">
                              <Leaf className="h-4 w-4 mr-2 text-emerald-500" />
                              {reward.totalAmount} LUM
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-muted-foreground">Due by:</span>
                          <span className="ml-2 font-medium">{new Date(reward.dueDate).toLocaleDateString()}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t pt-4 flex justify-end">
                        <Button
                          className="bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => handleDistributeReward(reward)}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Distribute Rewards
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>All Rewards</CardTitle>
              <CardDescription>View and manage all reward distributions</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <div className="grid grid-cols-12 p-4 bg-muted text-sm font-medium">
                  <div className="col-span-4">Reward</div>
                  <div className="col-span-1 text-center">Type</div>
                  <div className="col-span-2 text-center">Recipients</div>
                  <div className="col-span-2 text-center">Amount</div>
                  <div className="col-span-2 text-center">Date</div>
                  <div className="col-span-1 text-center">Status</div>
                </div>
                <div className="divide-y">
                  {rewards.map((reward) => (
                    <div key={reward.id} className="grid grid-cols-12 p-4 items-center">
                      <div className="col-span-4">
                        <div className="font-medium">{reward.title}</div>
                        <div className="text-sm text-muted-foreground">{reward.name}</div>
                      </div>
                      <div className="col-span-1 text-center">
                        <div className="flex items-center justify-center">
                          {getTypeIcon(reward.type)}
                          <span className="sr-only">{reward.type}</span>
                        </div>
                      </div>
                      <div className="col-span-2 text-center">
                        <div className="flex items-center justify-center">
                          <User className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span>{reward.recipients}</span>
                        </div>
                      </div>
                      <div className="col-span-2 text-center">
                        <div className="flex flex-col items-center">
                          <div className="flex items-center">
                            <Leaf className="h-3 w-3 mr-1 text-emerald-500" />
                            <span>{reward.individualAmount} LUM</span>
                          </div>
                          <div className="text-xs text-muted-foreground">Total: {reward.totalAmount} LUM</div>
                        </div>
                      </div>
                      <div className="col-span-2 text-center text-sm">
                        {reward.status === "Distributed" ? (
                          <div className="flex items-center justify-center">
                            <CheckCircle className="h-3 w-3 mr-1 text-emerald-500" />
                            <span>{new Date(reward.distributedDate).toLocaleDateString()}</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <Clock className="h-3 w-3 mr-1 text-amber-500" />
                            <span>Due: {new Date(reward.dueDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                      <div className="col-span-1 text-center">{getStatusBadge(reward.status)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-6">
              <div className="text-sm text-muted-foreground">Showing {rewards.length} rewards</div>
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

        <TabsContent value="distributed" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {rewards
                  .filter((r) => r.status === "Distributed")
                  .map((reward) => (
                    <div key={reward.id} className="flex items-start p-4 border rounded-lg">
                      <div className="p-2 rounded-full bg-emerald-500/10 mr-4">{getTypeIcon(reward.type)}</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{reward.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {reward.type}: {reward.name}
                            </div>
                          </div>
                          {getStatusBadge(reward.status)}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
                          <div className="text-sm">
                            <span className="text-muted-foreground">Recipients:</span>{" "}
                            <span className="font-medium">{reward.recipients} participants</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">Individual Amount:</span>{" "}
                            <span className="font-medium">{reward.individualAmount} LUM</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">Total Amount:</span>{" "}
                            <span className="font-medium">{reward.totalAmount} LUM</span>
                          </div>
                        </div>
                        <div className="mt-2 text-sm flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1 text-emerald-500" />
                          <span className="text-muted-foreground">Distributed on:</span>{" "}
                          <span className="font-medium ml-1">
                            {new Date(reward.distributedDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Distribute Rewards Dialog */}
      <Dialog open={isDistributeDialogOpen} onOpenChange={setIsDistributeDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Distribute Rewards</DialogTitle>
            <DialogDescription>Confirm reward distribution to all eligible participants</DialogDescription>
          </DialogHeader>

          {selectedReward && (
            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  {getTypeIcon(selectedReward.type)}
                  <span className="font-medium">{selectedReward.title}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Recipients</div>
                    <div className="font-medium flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      {selectedReward.recipients} participants
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Individual Reward</div>
                    <div className="font-medium flex items-center">
                      <Leaf className="h-4 w-4 mr-2 text-emerald-500" />
                      {selectedReward.individualAmount} LUM
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Total Amount</div>
                    <div className="font-medium flex items-center">
                      <Leaf className="h-4 w-4 mr-2 text-emerald-500" />
                      {selectedReward.totalAmount} LUM
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Distribution Message</Label>
                <Textarea
                  id="message"
                  placeholder="Message to send to recipients..."
                  value={distributionMessage}
                  onChange={(e) => setDistributionMessage(e.target.value)}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  This message will be sent to all recipients along with their reward notification.
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsDistributeDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleConfirmDistribution}>
              <Send className="h-4 w-4 mr-2" />
              Distribute {selectedReward?.totalAmount} LUM
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
