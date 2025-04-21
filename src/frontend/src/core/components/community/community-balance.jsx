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
import { Progress } from "@/core/components/ui/progress";
import { TokenSwap } from "@/core/components/balance/token-swap";
import { CommunityBalanceAnalytics } from "@/core/components/balance/community-balance-analytics";
import { TransactionHistory } from "@/core/components/balance/transaction-history";
import {
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Download,
  Filter,
  Leaf,
  PieChart,
  Users,
  ArrowRight,
  AlertTriangle,
  Settings,
  Shield,
} from "lucide-react";

export default function CommunityBalance() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [balanceData, setBalanceData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [timeframe, setTimeframe] = useState("month");

  useEffect(() => {
    // In a real app, this would check authentication status and admin rights
    const checkAuth = async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      // For demo purposes, we'll assume the user is an admin
      setIsAdmin(true);

      // Mock balance data
      setBalanceData({
        balance: 125000,
        allocated: 45000,
        distributed: 32500,
        remaining: 80000,
        monthlyDistribution: 12500,
        monthlyChangePercentage: 15.3,
        isPositive: false,
        tokenValue: 0.12, // USD value per token
      });

      // Mock transaction history
      setTransactions([
        {
          id: 1,
          type: "distribution",
          amount: 2500,
          project: "Community Reforestation Initiative",
          date: "2025-05-18T14:30:00",
          status: "completed",
          description: "Rewards distribution to 50 participants",
          recipients: 50,
        },
        {
          id: 2,
          type: "topup",
          amount: 10000,
          project: null,
          date: "2025-05-15T09:15:00",
          status: "completed",
          description: "Token swap from treasury",
          swapDetails: {
            fromToken: "USDC",
            fromAmount: 1200,
            rate: 8.33,
          },
        },
        {
          id: 3,
          type: "distribution",
          amount: 3750,
          project: "Zero Waste Challenge",
          date: "2025-05-12T16:45:00",
          status: "completed",
          description: "Weekly challenge rewards",
          recipients: 75,
        },
        {
          id: 4,
          type: "allocation",
          amount: 5000,
          project: "Bike to Work Month",
          date: "2025-05-10T08:30:00",
          status: "completed",
          description: "Allocation for new challenge",
        },
        {
          id: 5,
          type: "distribution",
          amount: 1250,
          project: "Energy Conservation Challenge",
          date: "2025-05-05T11:20:00",
          status: "completed",
          description: "Daily challenge rewards",
          recipients: 50,
        },
        {
          id: 6,
          type: "topup",
          amount: 20000,
          project: null,
          date: "2025-05-01T13:10:00",
          status: "completed",
          description: "Token swap from treasury",
          swapDetails: {
            fromToken: "USDC",
            fromAmount: 2400,
            rate: 8.33,
          },
        },
        {
          id: 7,
          type: "allocation",
          amount: 7500,
          project: "Community Reforestation Initiative",
          date: "2025-04-28T15:45:00",
          status: "completed",
          description: "Additional allocation for project expansion",
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 container py-8">
        {/* Balance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-emerald-500/20 to-emerald-700/20 border-emerald-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline">
                <div className="text-3xl font-bold">
                  {balanceData.balance.toLocaleString()}
                </div>
                <div className="ml-1 text-lg">LUM</div>
              </div>
              <div className="flex items-center mt-1 text-xs">
                <span className="text-muted-foreground">
                  ≈ $
                  {(
                    balanceData.balance * balanceData.tokenValue
                  ).toLocaleString()}{" "}
                  USD
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Allocated to Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline">
                <div className="text-3xl font-bold">
                  {balanceData.allocated.toLocaleString()}
                </div>
                <div className="ml-1 text-lg">LUM</div>
              </div>
              <div className="flex items-center mt-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                <span>
                  {(
                    (balanceData.allocated / balanceData.balance) *
                    100
                  ).toFixed(1)}
                  % of total balance
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Distributed Rewards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline">
                <div className="text-3xl font-bold">
                  {balanceData.distributed.toLocaleString()}
                </div>
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
                    <ArrowDownRight className="h-3 w-3 text-amber-500 mr-1" />
                    <span className="text-amber-500">
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
                Available for Allocation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline">
                <div className="text-3xl font-bold">
                  {balanceData.remaining.toLocaleString()}
                </div>
                <div className="ml-1 text-lg">LUM</div>
              </div>
              <div className="flex items-center mt-1 text-xs text-muted-foreground">
                <Leaf className="h-3 w-3 mr-1" />
                <span>
                  {(
                    (balanceData.remaining / balanceData.balance) *
                    100
                  ).toFixed(1)}
                  % of total balance
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="swap">Token Swap</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle>Transaction History</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  View all community token transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TransactionHistory
                  transactions={transactions}
                  isCommunity={true}
                />
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <div className="text-sm text-muted-foreground">
                  Showing {transactions.length} transactions
                </div>
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

          <TabsContent value="swap" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TokenSwap />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Swap History</CardTitle>
                  <CardDescription>
                    Recent token swap transactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions
                      .filter((t) => t.type === "topup")
                      .map((transaction) => (
                        <div
                          key={transaction.id}
                          className="p-4 border rounded-lg"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <div className="font-medium">Token Swap</div>
                            <Badge className="bg-blue-500">Completed</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mb-3">
                            {new Date(transaction.date).toLocaleDateString()} at{" "}
                            {new Date(transaction.date).toLocaleTimeString()}
                          </div>
                          <div className="flex justify-between items-center text-sm mb-1">
                            <span>From:</span>
                            <span className="font-medium">
                              {transaction.swapDetails.fromAmount}{" "}
                              {transaction.swapDetails.fromToken}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm mb-1">
                            <span>To:</span>
                            <span className="font-medium">
                              {transaction.amount} LUM
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span>Rate:</span>
                            <span className="font-medium">
                              1 {transaction.swapDetails.fromToken} ={" "}
                              {transaction.swapDetails.rate} LUM
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
