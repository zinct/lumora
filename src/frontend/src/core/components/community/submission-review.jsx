

import { useState } from "react"
import { Search, Filter, ArrowUpDown, CheckCircle, XCircle, MessageSquare, Eye, Award, Clock } from "lucide-react"
import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/core/components/ui/card"
import { Badge } from "@/core/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/core/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/core/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/core/components/ui/dialog"
import { Textarea } from "@/core/components/ui/textarea"
import { Label } from "@/core/components/ui/label"

export function SubmissionReview() {
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [reviewFeedback, setReviewFeedback] = useState("")
  const [submissions, setSubmissions] = useState([
    {
      id: 1,
      title: "Zero Waste Week - Day 7 Completion",
      user: {
        name: "Alex Johnson",
        avatar: "AJ",
      },
      challenge: "Zero Waste Week",
      submittedAt: "2025-05-08T14:32:00",
      status: "Pending",
      evidence: "Photo evidence of waste jar for the entire week",
      description:
        "I've successfully completed the Zero Waste Week challenge! My total waste for the entire week fits in this small jar. I've included photos of my waste jar, along with receipts from bulk shopping and my reusable containers.",
    },
    {
      id: 2,
      title: "Bike to Work Month - Week 3",
      user: {
        name: "Maria Rodriguez",
        avatar: "MR",
      },
      challenge: "Bike to Work Month",
      submittedAt: "2025-04-22T08:15:00",
      status: "Approved",
      evidence: "GPS tracking data and photos",
      description:
        "Completed week 3 of the Bike to Work challenge. I've attached my GPS tracking data showing my routes and photos of my bike at work each day.",
    },
    {
      id: 3,
      title: "Plastic-Free Challenge - Week 2",
      user: {
        name: "Sam Taylor",
        avatar: "ST",
      },
      challenge: "Plastic-Free Challenge",
      submittedAt: "2025-05-29T16:45:00",
      status: "Pending",
      evidence: "Photos of plastic-free shopping and alternatives",
      description:
        "I've completed week 2 of the Plastic-Free Challenge. I've included photos of my plastic-free shopping trips, homemade alternatives to plastic products, and my reusable containers and bags.",
    },
    {
      id: 4,
      title: "Energy Conservation - Mid-month Report",
      user: {
        name: "Jordan Lee",
        avatar: "JL",
      },
      challenge: "Energy Conservation",
      submittedAt: "2025-05-15T11:20:00",
      status: "Pending",
      evidence: "Utility bill comparison and smart meter data",
      description:
        "Here's my mid-month report for the Energy Conservation challenge. I've attached my utility bill showing a 25% reduction compared to last month, along with daily smart meter readings.",
    },
    {
      id: 5,
      title: "Water Saving Challenge - Final Submission",
      user: {
        name: "Taylor Wilson",
        avatar: "TW",
      },
      challenge: "Water Saving Challenge",
      submittedAt: "2025-04-30T09:10:00",
      status: "Rejected",
      evidence: "Water bill and usage log",
      description:
        "I've completed the Water Saving Challenge. My water usage decreased by 28% according to my water bill, which I've attached along with my daily water usage log.",
      feedback:
        "The water bill shows only a 15% reduction, not the required 30%. Please resubmit with additional evidence of water-saving measures.",
    },
    {
      id: 6,
      title: "Local Food Only - Week 1",
      user: {
        name: "Jamie Rivera",
        avatar: "JR",
      },
      challenge: "Local Food Only",
      submittedAt: "2025-06-07T13:25:00",
      status: "Pending",
      evidence: "Photos of meals and receipts from local vendors",
      description:
        "First week of the Local Food Only challenge complete! I've included photos of all my meals this week, along with receipts from local farmers markets and vendors showing the origin of ingredients.",
    },
    {
      id: 7,
      title: "Public Transport Only - Final Report",
      user: {
        name: "Casey Morgan",
        avatar: "CM",
      },
      challenge: "Public Transport Only",
      submittedAt: "2025-03-31T17:50:00",
      status: "Approved",
      evidence: "Transit pass usage data and daily logs",
      description:
        "I've successfully completed the Public Transport Only challenge for the entire month. I've attached my transit pass usage data, daily logs of my journeys, and photos from various public transport modes I used.",
    },
  ])

  const handleReviewSubmission = (submission) => {
    setSelectedSubmission(submission)
    setReviewFeedback("")
    setIsReviewDialogOpen(true)
  }

  const handleApproveSubmission = () => {
    setSubmissions(
      submissions.map((sub) =>
        sub.id === selectedSubmission.id ? { ...sub, status: "Approved", feedback: reviewFeedback } : sub,
      ),
    )
    setIsReviewDialogOpen(false)
  }

  const handleRejectSubmission = () => {
    setSubmissions(
      submissions.map((sub) =>
        sub.id === selectedSubmission.id ? { ...sub, status: "Rejected", feedback: reviewFeedback } : sub,
      ),
    )
    setIsReviewDialogOpen(false)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return <Badge className="bg-emerald-500">Approved</Badge>
      case "Rejected":
        return <Badge className="bg-red-500">Rejected</Badge>
      case "Pending":
        return <Badge className="bg-amber-500">Pending</Badge>
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
            <Input placeholder="Search submissions..." className="pl-9" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by challenge" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Challenges</SelectItem>
              <SelectItem value="zero-waste">Zero Waste Week</SelectItem>
              <SelectItem value="bike-to-work">Bike to Work Month</SelectItem>
              <SelectItem value="plastic-free">Plastic-Free Challenge</SelectItem>
              <SelectItem value="energy">Energy Conservation</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending Review</TabsTrigger>
          <TabsTrigger value="all">All Submissions</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Submissions Awaiting Review</CardTitle>
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
              <CardDescription>Review and approve participant submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {submissions
                  .filter((s) => s.status === "Pending")
                  .map((submission) => (
                    <Card key={submission.id} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10 mt-1">
                              <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${submission.user.avatar}`} />
                              <AvatarFallback>{submission.user.avatar}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base">{submission.title}</CardTitle>
                              <CardDescription className="text-sm">
                                By {submission.user.name} • {new Date(submission.submittedAt).toLocaleString()}
                              </CardDescription>
                            </div>
                          </div>
                          {getStatusBadge(submission.status)}
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="space-y-3">
                          <div className="flex items-center text-sm">
                            <Award className="h-4 w-4 mr-2 text-amber-500" />
                            <span className="font-medium">Challenge:</span>
                            <span className="ml-2">{submission.challenge}</span>
                          </div>
                          <div className="flex items-start text-sm">
                            <Eye className="h-4 w-4 mr-2 text-blue-500 mt-1" />
                            <span className="font-medium">Evidence:</span>
                            <span className="ml-2">{submission.evidence}</span>
                          </div>
                          <div className="text-sm">
                            <p className="text-muted-foreground">{submission.description}</p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t pt-4 flex justify-end">
                        <Button
                          className="bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => handleReviewSubmission(submission)}
                        >
                          Review Submission
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
              <CardTitle>All Submissions</CardTitle>
              <CardDescription>View and manage all participant submissions</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <div className="grid grid-cols-12 p-4 bg-muted text-sm font-medium">
                  <div className="col-span-4">Submission</div>
                  <div className="col-span-2">Challenge</div>
                  <div className="col-span-2">Submitted</div>
                  <div className="col-span-2">User</div>
                  <div className="col-span-1 text-center">Status</div>
                  <div className="col-span-1 text-center">Actions</div>
                </div>
                <div className="divide-y">
                  {submissions.map((submission) => (
                    <div key={submission.id} className="grid grid-cols-12 p-4 items-center">
                      <div className="col-span-4">
                        <div className="font-medium">{submission.title}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-xs">{submission.evidence}</div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-sm">{submission.challenge}</div>
                      </div>
                      <div className="col-span-2 text-sm">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span>{new Date(submission.submittedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(submission.submittedAt).toLocaleTimeString()}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src={`/placeholder.svg?height=24&width=24&text=${submission.user.avatar}`} />
                            <AvatarFallback>{submission.user.avatar}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{submission.user.name}</span>
                        </div>
                      </div>
                      <div className="col-span-1 text-center">{getStatusBadge(submission.status)}</div>
                      <div className="col-span-1 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => handleReviewSubmission(submission)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-6">
              <div className="text-sm text-muted-foreground">Showing {submissions.length} submissions</div>
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

        <TabsContent value="approved" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {submissions
                  .filter((s) => s.status === "Approved")
                  .map((submission) => (
                    <div key={submission.id} className="flex items-start p-4 border rounded-lg">
                      <Avatar className="h-10 w-10 mr-4">
                        <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${submission.user.avatar}`} />
                        <AvatarFallback>{submission.user.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{submission.title}</div>
                            <div className="text-sm text-muted-foreground">
                              By {submission.user.name} • {new Date(submission.submittedAt).toLocaleString()}
                            </div>
                          </div>
                          {getStatusBadge(submission.status)}
                        </div>
                        <div className="mt-2 text-sm">
                          <span className="font-medium">Challenge:</span> {submission.challenge}
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground">{submission.description}</div>
                        {submission.feedback && (
                          <div className="mt-2 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded text-sm">
                            <div className="font-medium text-emerald-500 flex items-center">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approval Feedback:
                            </div>
                            <p className="text-muted-foreground">{submission.feedback}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {submissions
                  .filter((s) => s.status === "Rejected")
                  .map((submission) => (
                    <div key={submission.id} className="flex items-start p-4 border rounded-lg">
                      <Avatar className="h-10 w-10 mr-4">
                        <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${submission.user.avatar}`} />
                        <AvatarFallback>{submission.user.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{submission.title}</div>
                            <div className="text-sm text-muted-foreground">
                              By {submission.user.name} • {new Date(submission.submittedAt).toLocaleString()}
                            </div>
                          </div>
                          {getStatusBadge(submission.status)}
                        </div>
                        <div className="mt-2 text-sm">
                          <span className="font-medium">Challenge:</span> {submission.challenge}
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground">{submission.description}</div>
                        {submission.feedback && (
                          <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded text-sm">
                            <div className="font-medium text-red-500 flex items-center">
                              <XCircle className="h-3 w-3 mr-1" />
                              Rejection Reason:
                            </div>
                            <p className="text-muted-foreground">{submission.feedback}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Review Submission</DialogTitle>
            <DialogDescription>Review the submission details and provide feedback</DialogDescription>
          </DialogHeader>

          {selectedSubmission && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${selectedSubmission.user.avatar}`} />
                  <AvatarFallback>{selectedSubmission.user.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{selectedSubmission.user.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Submitted on {new Date(selectedSubmission.submittedAt).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">{selectedSubmission.title}</h3>
                <div className="text-sm">
                  <span className="font-medium">Challenge:</span> {selectedSubmission.challenge}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Evidence:</span> {selectedSubmission.evidence}
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>{selectedSubmission.description}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedback">Feedback</Label>
                <Textarea
                  id="feedback"
                  placeholder="Provide feedback for the participant..."
                  value={reviewFeedback}
                  onChange={(e) => setReviewFeedback(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
              Cancel
            </Button>
            <div className="flex space-x-2">
              <Button variant="destructive" onClick={handleRejectSubmission}>
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleApproveSubmission}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
