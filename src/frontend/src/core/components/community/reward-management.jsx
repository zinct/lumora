import { useState, useEffect } from "react";
import { Search, Filter, ArrowUpDown, Leaf, Award, User, Calendar, Clock, CheckCircle, Send, Plus } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Badge } from "@/core/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/core/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/core/components/ui/dialog";
import { Label } from "@/core/components/ui/label";
import { Textarea } from "@/core/components/ui/textarea";
import { backend } from "declarations/backend";
import { toast } from "sonner";
import { EmptyState } from "@/core/components/ui/empty-state";

export function RewardManagement() {
  const [isDistributeDialogOpen, setIsDistributeDialogOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [distributionMessage, setDistributionMessage] = useState("");
  const [rewards, setRewards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      setIsLoading(true);
      const result = await backend.getCommunityRewards();
      if (result.Ok) {
        console.log("result", "================", result);
        const formattedRewards = result.Ok.map((reward) => ({
          id: reward.id,
          title: reward.title,
          type: "Project",
          name: reward.title,
          recipients: reward.participants.length,
          totalAmount: parseInt(reward.reward) * reward.participants.length,
          individualAmount: parseInt(reward.reward),
          status: parseInt(reward.status) === 2 ? "Distributed" : parseInt(reward.status) === 1 ? "Pending" : "Closed",
          dueDate: new Date(Number(reward.expiredAt) / 1000000).toISOString().split("T")[0],
          distributedDate: parseInt(reward.status) === 2 ? new Date().toISOString().split("T")[0] : undefined,
        }));
        console.log("formattedRewards", "================", formattedRewards);
        setRewards(formattedRewards);
      } else {
        toast.error("Failed to fetch rewards: " + result.Err);
      }
    } catch (error) {
      console.log(error, "error");

      toast.error("Error fetching rewards: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDistributeReward = async (reward) => {
    try {
      const result = await backend.distributeRewards(reward.id);
      if (result.Ok) {
        toast.success("Rewards distributed successfully");
        fetchRewards(); // Refresh the rewards list
      } else {
        toast.error("Failed to distribute rewards: " + result.Err);
      }
    } catch (error) {
      toast.error("Error distributing rewards: " + error.message);
    }
    setIsDistributeDialogOpen(false);
  };

  const handleConfirmDistribution = () => {
    if (selectedReward) {
      handleDistributeReward(selectedReward);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Distributed":
        return <Badge className="bg-emerald-500">Distributed</Badge>;
      case "Pending":
        return <Badge className="bg-amber-500">Pending</Badge>;
      case "Closed":
        return <Badge className="bg-gray-500">Closed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "Challenge":
        return <Award className="h-4 w-4 text-amber-500" />;
      case "Project":
        return <Leaf className="h-4 w-4 text-emerald-500" />;
      default:
        return <Award className="h-4 w-4" />;
    }
  };

  const filteredRewards = rewards.filter((reward) => {
    const matchesSearch = searchQuery === "" || reward.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || reward.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-muted rounded mb-4"></div>
          <div className="h-4 w-48 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search rewards..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="distributed">Distributed</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Reward Management</CardTitle>
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
          <CardDescription>Manage and distribute rewards for completed projects</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {filteredRewards.length === 0 ? (
            <div className="p-8">
              <EmptyState title="No Rewards Found" description="There are no rewards to display at the moment." variant="rewards" icon={Award} />
            </div>
          ) : (
            <div className="rounded-md border">
              <div className="grid grid-cols-12 p-4 bg-muted text-sm font-medium">
                <div className="col-span-4">Reward</div>
                <div className="col-span-2 text-center">Recipients</div>
                <div className="col-span-2 text-center">Amount</div>
                <div className="col-span-2 text-center">Date</div>
                <div className="col-span-1 text-center">Status</div>
                <div className="col-span-1 text-center">Actions</div>
              </div>
              <div className="divide-y">
                {filteredRewards.map((reward) => (
                  <div key={reward.id} className="grid grid-cols-12 p-4 items-center">
                    <div className="col-span-4">
                      <div className="font-medium">{reward.title}</div>
                      <div className="text-sm text-muted-foreground">{reward.name}</div>
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
                    <div className="col-span-1 text-center">
                      {reward.status === "Pending" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedReward(reward);
                            setIsDistributeDialogOpen(true);
                          }}>
                          <Send className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between pt-6">
          <div className="text-sm text-muted-foreground">Showing {filteredRewards.length} rewards</div>
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
                <Textarea id="message" placeholder="Message to send to recipients..." value={distributionMessage} onChange={(e) => setDistributionMessage(e.target.value)} rows={4} />
                <p className="text-xs text-muted-foreground">This message will be sent to all recipients along with their reward notification.</p>
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
  );
}
