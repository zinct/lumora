import { useState, useEffect } from "react";
import { Button } from "@/core/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/core/components/ui/tabs";
import { Badge } from "@/core/components/ui/badge";
import { TransactionHistory } from "@/core/components/balance/transaction-history";
import { ArrowUpRight, ArrowDownRight, Clock, Download, Upload, Leaf, Calendar, ExternalLink, Users } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "@/core/providers/auth-provider";
import { token } from "declarations/token";
import { convertE8sToToken } from "../core/lib/canisterUtils";

export default function BalancePage() {
  const { user, identity, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [balanceData, setBalanceData] = useState(null);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  const fetchCurrentBalance = async () => {
    setCurrentBalance(balance);
  };

  const fetchBalanceData = async () => {
    setIsLoading(true);

    try {
      // Run balance and transaction history fetch in parallel
      const [balance, transactionHistory] = await Promise.all([
        token.icrc1_balance_of({
          owner: identity.getPrincipal(),
          subaccount: [],
        }),
        token.transactionHistoryOf({
          owner: identity.getPrincipal(),
          subaccount: [],
        }),
      ]);

      setTransactions(transactionHistory);

      const transformedTransactions = transactionHistory.map((tx) => {
        if ("Transfer" in tx.operation) {
          return tx.operation.Transfer;
        } else if ("Mint" in tx.operation) {
          return tx.operation.Mint;
        } else if ("Burn" in tx.operation) {
          return tx.operation.Burn;
        } else if ("Approve" in tx.operation) {
          return tx.operation.Approve;
        }
      });

      // Update balance data
      setBalanceData({
        balance: convertE8sToToken(balance),
        pendingRewards: 0,
        totalEarned: transformedTransactions.filter((tx) => tx.to.owner.toText() === identity.getPrincipal().toText()).reduce((sum, tx) => sum + convertE8sToToken(tx.amount), 0),
        totalSpent: transformedTransactions.filter((tx) => tx.from.owner.toText() === identity.getPrincipal().toText()).reduce((sum, tx) => sum + convertE8sToToken(tx.amount), 0),
      });
    } catch (error) {
      console.error("Error fetching balance data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBalanceData();
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 container py-8">
          <div className="flex flex-col items-center justify-center h-64">
            <h1 className="text-2xl font-bold mb-2">Login Required</h1>
            <p className="text-muted-foreground mb-4">Please login to view your balance and transaction history.</p>
            <Button onClick={() => openLoginModal("general", "/balance")}>Login</Button>
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
            <p className="text-muted-foreground">Manage your LUM tokens and view transaction history</p>
          </div>
          <div className="flex items-center gap-2">
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => navigate("/projects")}>
              <Leaf className="h-4 w-4 mr-2" />
              Earn More Tokens
            </Button>
          </div>
        </div>

        {/* Balance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-emerald-500/20 to-emerald-700/20 border-emerald-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline">
                <div className="text-3xl font-bold">{balanceData.balance}</div>
                <div className="ml-1 text-lg">LUM</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline">
                <div className="text-3xl font-bold">{balanceData.totalEarned}</div>
                <div className="ml-1 text-lg">LUM</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline">
                <div className="text-3xl font-bold">{balanceData.totalSpent}</div>
                <div className="ml-1 text-lg">LUM</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>Transaction History</CardTitle>
            </div>
            <CardDescription>View your recent token transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <TransactionHistory transactions={transactions} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
