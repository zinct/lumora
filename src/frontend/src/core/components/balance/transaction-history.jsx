import { useState } from "react";
import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import {
  Download,
  Upload,
  Clock,
  ChevronDown,
  Users,
  Wallet,
  ExternalLink,
} from "lucide-react";

export function TransactionHistory({ transactions, isCommunity = false }) {
  const [expandedTransaction, setExpandedTransaction] = useState(null);

  const toggleExpand = (id) => {
    if (expandedTransaction === id) {
      setExpandedTransaction(null);
    } else {
      setExpandedTransaction(id);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-emerald-500">Completed</Badge>;
      case "pending":
        return <Badge className="bg-amber-500">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-500">Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTypeIcon = (type, isCommunity) => {
    if (isCommunity) {
      switch (type) {
        case "topup":
          return (
            <Wallet className="h-10 w-10 p-2 text-blue-500 bg-blue-500/10 rounded-full" />
          );
        case "allocation":
          return (
            <Upload className="h-10 w-10 p-2 text-amber-500 bg-amber-500/10 rounded-full" />
          );
        case "distribution":
          return (
            <Users className="h-10 w-10 p-2 text-emerald-500 bg-emerald-500/10 rounded-full" />
          );
        default:
          return (
            <Clock className="h-10 w-10 p-2 text-muted-foreground bg-muted/50 rounded-full" />
          );
      }
    } else {
      switch (type) {
        case "reward":
          return (
            <Download className="h-10 w-10 p-2 text-emerald-500 bg-emerald-500/10 rounded-full" />
          );
        case "spend":
          return (
            <Upload className="h-10 w-10 p-2 text-amber-500 bg-amber-500/10 rounded-full" />
          );
        default:
          return (
            <Clock className="h-10 w-10 p-2 text-muted-foreground bg-muted/50 rounded-full" />
          );
      }
    }
  };

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="border rounded-lg overflow-hidden">
          <div className="flex items-center p-4">
            <div className="mr-4">
              {getTypeIcon(transaction.type, isCommunity)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">
                {isCommunity
                  ? transaction.type === "topup"
                    ? "Token Swap"
                    : transaction.type === "allocation"
                    ? "Project Allocation"
                    : "Reward Distribution"
                  : transaction.type === "reward"
                  ? "Reward Received"
                  : "Tokens Spent"}
              </div>
              <div className="text-sm text-muted-foreground truncate">
                {transaction.project
                  ? transaction.project
                  : isCommunity
                  ? "Community Treasury"
                  : "Platform"}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {new Date(transaction.date).toLocaleDateString()} at{" "}
                {new Date(transaction.date).toLocaleTimeString()}
              </div>
            </div>
            <div className="flex flex-col items-end ml-4">
              <div
                className={`font-bold ${
                  isCommunity
                    ? transaction.type === "topup"
                      ? "text-blue-500"
                      : "text-red-500"
                    : transaction.type === "reward"
                    ? "text-emerald-500"
                    : "text-amber-500"
                }`}
              >
                {isCommunity
                  ? transaction.type === "topup"
                    ? "+"
                    : "-"
                  : transaction.type === "reward"
                  ? "+"
                  : "-"}
                {transaction.amount} LUM
              </div>
              <div className="mt-1">{getStatusBadge(transaction.status)}</div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="ml-2"
              onClick={() => toggleExpand(transaction.id)}
            >
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  expandedTransaction === transaction.id ? "rotate-180" : ""
                }`}
              />
            </Button>
          </div>

          {expandedTransaction === transaction.id && (
            <div className="bg-muted/30 p-4 border-t">
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium mb-1">Description</h4>
                  <p className="text-sm text-muted-foreground">
                    {transaction.description}
                  </p>
                </div>

                {transaction.type === "topup" && transaction.swapDetails && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Swap Details</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">
                          From Token:
                        </span>{" "}
                        <span>{transaction.swapDetails.fromToken}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          From Amount:
                        </span>{" "}
                        <span>{transaction.swapDetails.fromAmount}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Exchange Rate:
                        </span>{" "}
                        <span>
                          1 {transaction.swapDetails.fromToken} ={" "}
                          {transaction.swapDetails.rate} LUM
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Transaction Hash:
                        </span>{" "}
                        <a
                          href="#"
                          className="text-primary hover:underline flex items-center"
                        >
                          0x123...abc
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {transaction.recipients && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Recipients</h4>
                    <p className="text-sm text-muted-foreground">
                      {transaction.recipients} participants received rewards
                    </p>
                  </div>
                )}

                <div className="pt-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
