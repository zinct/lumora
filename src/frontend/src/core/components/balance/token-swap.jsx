import { useState } from "react";
import { ArrowDown, AlertTriangle, Info, RefreshCw, Check } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Input } from "@/core/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import { useToast } from "@/core/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/core/components/ui/dialog";

export function TokenSwap() {
  const { toast } = useToast();
  const [fromToken, setFromToken] = useState("USDC");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [isSwapping, setIsSwapping] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [swapComplete, setSwapComplete] = useState(false);

  // Token exchange rates (in a real app, these would come from an API)
  const exchangeRates = {
    USDC: 8.33, // 1 USDC = 8.33 LUM
    ETH: 2500, // 1 ETH = 2500 LUM
    BTC: 35000, // 1 BTC = 35000 LUM
  };

  const handleFromAmountChange = (value) => {
    setFromAmount(value);
    if (value && !isNaN(value)) {
      const calculatedAmount = (
        Number.parseFloat(value) * exchangeRates[fromToken]
      ).toFixed(2);
      setToAmount(calculatedAmount);
    } else {
      setToAmount("");
    }
  };

  const handleToAmountChange = (value) => {
    setToAmount(value);
    if (value && !isNaN(value)) {
      const calculatedAmount = (
        Number.parseFloat(value) / exchangeRates[fromToken]
      ).toFixed(6);
      setFromAmount(calculatedAmount);
    } else {
      setFromAmount("");
    }
  };

  const handleFromTokenChange = (value) => {
    setFromToken(value);
    if (fromAmount && !isNaN(fromAmount)) {
      const calculatedAmount = (
        Number.parseFloat(fromAmount) * exchangeRates[value]
      ).toFixed(2);
      setToAmount(calculatedAmount);
    }
  };

  const handleSwap = () => {
    if (
      !fromAmount ||
      isNaN(fromAmount) ||
      Number.parseFloat(fromAmount) <= 0
    ) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to swap.",
        variant: "destructive",
      });
      return;
    }

    setShowConfirmation(true);
  };

  const confirmSwap = () => {
    setIsSwapping(true);
    setShowConfirmation(false);

    // Simulate API call
    setTimeout(() => {
      setIsSwapping(false);
      setSwapComplete(true);

      toast({
        title: "Token swap successful",
        description: `Successfully swapped ${fromAmount} ${fromToken} for ${toAmount} LUM tokens.`,
      });

      // Reset form after a delay
      setTimeout(() => {
        setSwapComplete(false);
        setFromAmount("");
        setToAmount("");
      }, 3000);
    }, 2000);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Token Swap</CardTitle>
          <CardDescription>
            Swap other tokens for LUM tokens to top up the community balance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* From Token */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">From</label>
                <span className="text-xs text-muted-foreground">
                  Balance:{" "}
                  {fromToken === "USDC"
                    ? "10,000"
                    : fromToken === "ETH"
                    ? "5.0"
                    : "0.25"}{" "}
                  {fromToken}
                </span>
              </div>
              <div className="flex gap-2">
                <Select value={fromToken} onValueChange={handleFromTokenChange}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Select token" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USDC">USDC</SelectItem>
                    <SelectItem value="ETH">ETH</SelectItem>
                    <SelectItem value="BTC">BTC</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="0.0"
                  value={fromAmount}
                  onChange={(e) => handleFromAmountChange(e.target.value)}
                  className="flex-1"
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  1 {fromToken} = {exchangeRates[fromToken]} LUM
                </span>
                <button
                  className="text-primary hover:underline"
                  onClick={() =>
                    handleFromAmountChange(
                      fromToken === "USDC"
                        ? "1000"
                        : fromToken === "ETH"
                        ? "1.0"
                        : "0.05"
                    )
                  }
                >
                  Max
                </button>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
              <div className="bg-muted rounded-full p-2">
                <ArrowDown className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            {/* To Token (LUM) */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">To</label>
                <span className="text-xs text-muted-foreground">
                  Balance: 125,000 LUM
                </span>
              </div>
              <div className="flex gap-2">
                <div className="w-[120px] h-10 flex items-center justify-center rounded-md border border-input bg-background px-3">
                  <span>LUM</span>
                </div>
                <Input
                  type="number"
                  placeholder="0.0"
                  value={toAmount}
                  onChange={(e) => handleToAmountChange(e.target.value)}
                  className="flex-1"
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Community token</span>
                <span>
                  ≈ ${(Number.parseFloat(toAmount || 0) * 0.12).toFixed(2)} USD
                </span>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-muted/50 rounded-lg p-4 text-sm">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="mb-1">
                    Token swaps are used to top up the community balance for
                    rewards distribution.
                  </p>
                  <p className="text-muted-foreground">
                    All swaps are recorded on the blockchain for transparency
                    and auditability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Button
            variant="outline"
            className="w-[120px]"
            onClick={() => {
              setFromAmount("");
              setToAmount("");
            }}
          >
            Reset
          </Button>
          <Button
            className="flex-1 ml-2 bg-emerald-600 hover:bg-emerald-700"
            onClick={handleSwap}
            disabled={
              !fromAmount ||
              isNaN(fromAmount) ||
              Number.parseFloat(fromAmount) <= 0 ||
              isSwapping ||
              swapComplete
            }
          >
            {isSwapping ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Swapping...
              </>
            ) : swapComplete ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Swap Complete
              </>
            ) : (
              "Swap Tokens"
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Token Swap</DialogTitle>
            <DialogDescription>
              Please review the details of your token swap before confirming.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-500">Important</p>
                <p className="text-muted-foreground">
                  This action cannot be undone. The tokens will be swapped
                  immediately and added to the community balance.
                </p>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-4">
              <h4 className="text-sm font-medium mb-3">Swap Details</h4>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">From:</span>
                  <span className="font-medium">
                    {fromAmount} {fromToken}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">To:</span>
                  <span className="font-medium">{toAmount} LUM</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Rate:</span>
                  <span>
                    1 {fromToken} = {exchangeRates[fromToken]} LUM
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">USD Value:</span>
                  <span>
                    ${(Number.parseFloat(toAmount || 0) * 0.12).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={confirmSwap}
            >
              Confirm Swap
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
