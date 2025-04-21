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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/core/components/ui/tabs";
import { Badge } from "@/core/components/ui/badge";
import { TransactionHistory } from "@/core/components/balance/transaction-history";
import {
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Download,
  Upload,
  Leaf,
  Calendar,
  ExternalLink,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router";
export default function BalancePage() {
  const navigation = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [balanceData, setBalanceData] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // In a real app, this would check authentication status
    const checkAuth = async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      // For demo purposes, we'll assume the user is logged in
      setIsLoggedIn(true);

      // Mock balance data
      setBalanceData({
        balance: 1250,
        pendingRewards: 150,
        totalEarned: 2450,
        totalSpent: 1200,
        monthlyChange: 350,
        monthlyChangePercentage: 38.9,
        isPositive: true,
      });

      // Mock transaction history
      setTransactions([
        {
          id: 1,
          type: "reward",
          amount: 50,
          project: "Community Reforestation Initiative",
          date: "2025-05-18T14:30:00",
          status: "completed",
          description: "Reward for planting trees",
        },
        {
          id: 2,
          type: "reward",
          amount: 75,
          project: "Zero Waste Challenge",
          date: "2025-05-12T09:15:00",
          status: "completed",
          description: "Weekly challenge completion",
        },
        {
          id: 3,
          type: "spend",
          amount: 100,
          project: "Community Garden Donation",
          date: "2025-05-10T16:45:00",
          status: "completed",
          description: "Donation to local garden project",
        },
        {
          id: 4,
          type: "reward",
          amount: 150,
          project: "Bike to Work Month",
          date: "2025-05-01T08:30:00",
          status: "completed",
          description: "Monthly challenge completion",
        },
        {
          id: 5,
          type: "reward",
          amount: 25,
          project: "Energy Conservation Challenge",
          date: "2025-04-28T11:20:00",
          status: "completed",
          description: "Daily challenge completion",
        },
        {
          id: 6,
          type: "spend",
          amount: 200,
          project: "Solar Panel Initiative",
          date: "2025-04-15T13:10:00",
          status: "completed",
          description: "Contribution to community solar project",
        },
        {
          id: 7,
          type: "reward",
          amount: 150,
          project: "Community Reforestation Initiative",
          date: "2025-04-10T15:45:00",
          status: "pending",
          description: "Pending reward for tree maintenance",
        },
      ]);

      setIsLoading(false);
    };

    checkAuth();
  }, []);

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

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 container py-8">
          <div className="flex flex-col items-center justify-center h-64">
            <h1 className="text-2xl font-bold mb-2">Login Required</h1>
            <p className="text-muted-foreground mb-4">
              Please login to view your balance and transaction history.
            </p>
            <Button onClick={() => openLoginModal("general", "/balance")}>
              Login
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Your Balance</h1>
            <p className="text-muted-foreground">
              Manage your LUM tokens and view transaction history
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => navigate("/projects")}
            >
              <Leaf className="h-4 w-4 mr-2" />
              Earn More Tokens
            </Button>
          </div>
        </div>

        {/* Balance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-emerald-500/20 to-emerald-700/20 border-emerald-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Current Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline">
                <div className="text-3xl font-bold">{balanceData.balance}</div>
                <div className="ml-1 text-lg">LUM</div>
              </div>
              <div className="flex items-center mt-1 text-xs">
                {balanceData.isPositive ? (
                  <>
                    <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-1" />
                    <span className="text-emerald-500">
                      +{balanceData.monthlyChangePercentage}% this month
                    </span>
                  </>
                ) : (
                  <>
                    <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                    <span className="text-red-500">
                      -{balanceData.monthlyChangePercentage}% this month
                    </span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Rewards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline">
                <div className="text-3xl font-bold">
                  {balanceData.pendingRewards}
                </div>
                <div className="ml-1 text-lg">LUM</div>
              </div>
              <div className="flex items-center mt-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                <span>Awaiting approval</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Earned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline">
                <div className="text-3xl font-bold">
                  {balanceData.totalEarned}
                </div>
                <div className="ml-1 text-lg">LUM</div>
              </div>
              <div className="flex items-center mt-1 text-xs text-muted-foreground">
                <Download className="h-3 w-3 mr-1" />
                <span>All time earnings</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline">
                <div className="text-3xl font-bold">
                  {balanceData.totalSpent}
                </div>
                <div className="ml-1 text-lg">LUM</div>
              </div>
              <div className="flex items-center mt-1 text-xs text-muted-foreground">
                <Upload className="h-3 w-3 mr-1" />
                <span>All time spending</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle>Transaction History</CardTitle>
                </div>
                <CardDescription>
                  View your recent token transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TransactionHistory transactions={transactions} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Rewards</CardTitle>
                <CardDescription>Rewards awaiting approval</CardDescription>
              </CardHeader>
              <CardContent>
                {transactions.filter((t) => t.status === "pending").length >
                0 ? (
                  <div className="space-y-4">
                    {transactions
                      .filter((t) => t.status === "pending")
                      .map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div>
                            <div className="font-medium">
                              {transaction.project}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {transaction.description}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {new Date(transaction.date).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Badge className="bg-amber-500 mr-4">Pending</Badge>
                            <div className="text-lg font-bold text-emerald-500">
                              +{transaction.amount} LUM
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      No Pending Rewards
                    </h3>
                    <p className="text-muted-foreground max-w-md">
                      You don't have any pending rewards at the moment.
                      Participate in projects and challenges to earn more LUM
                      tokens.
                    </p>
                    <Button
                      className="mt-4 bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => router.push("/projects")}
                    >
                      Browse Projects
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reward Opportunities</CardTitle>
                <CardDescription>Ways to earn more LUM tokens</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      title: "Complete Challenges",
                      description:
                        "Participate in sustainability challenges to earn rewards",
                      icon: <Calendar className="h-8 w-8 text-emerald-500" />,
                      reward: "25-100 LUM",
                    },
                    {
                      title: "Join Projects",
                      description:
                        "Contribute to community sustainability projects",
                      icon: <Users className="h-8 w-8 text-blue-500" />,
                      reward: "50-500 LUM",
                    },
                    {
                      title: "Refer Friends",
                      description: "Invite friends to join the platform",
                      icon: (
                        <ExternalLink className="h-8 w-8 text-purple-500" />
                      ),
                      reward: "50 LUM per referral",
                    },
                  ].map((opportunity, index) => (
                    <Card key={index} className="border-muted/50">
                      <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center">
                          <div className="p-3 rounded-full bg-muted/50 mb-4">
                            {opportunity.icon}
                          </div>
                          <h3 className="font-medium mb-1">
                            {opportunity.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            {opportunity.description}
                          </p>
                          <Badge
                            variant="outline"
                            className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          >
                            {opportunity.reward}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6">
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => router.push("/projects")}
                >
                  Explore All Opportunities
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
