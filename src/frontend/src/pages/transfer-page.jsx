import { useState, useEffect } from "react";
import { useAuth } from "../contexts/auth-context";
import { useCanister } from "@connect2ic/react";
import { Principal } from "@dfinity/principal";

export default function TransferPage() {
  const { isAuthenticated, principal } = useAuth();
  const [lumora] = useCanister("lumora");
  const [balance, setBalance] = useState(0);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch balance on component mount
  useEffect(() => {
    if (isAuthenticated && principal) {
      fetchBalance();
    }
  }, [isAuthenticated, principal]);

  const fetchBalance = async () => {
    try {
      setIsLoading(true);
      const account = { owner: Principal.fromText(principal) };
      const result = await lumora.getBalance(account);
      setBalance(result);
    } catch (error) {
      console.error("Error fetching balance:", error);
      setError("Failed to fetch balance");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    setError("");

    // Validate inputs
    if (!recipient || !amount) {
      setError("Please fill in all fields");
      return;
    }

    if (Number(amount) > balance) {
      setError("Insufficient balance");
      return;
    }

    try {
      setIsLoading(true);
      const result = await lumora.transfer(Principal.fromText(recipient), Number(amount));

      if ("Ok" in result) {
        // Refresh balance after successful transfer
        await fetchBalance();
        setRecipient("");
        setAmount("");
      } else {
        setError(result.Err);
      }
    } catch (error) {
      console.error("Transfer error:", error);
      setError("Transfer failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Transfer LUM</h1>

          {/* Balance Display */}
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-2">Your Balance</h2>
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-700 rounded w-1/4"></div>
              </div>
            ) : (
              <p className="text-2xl font-bold text-green-400">{balance} LUM</p>
            )}
          </div>

          {/* Transfer Form */}
          <form onSubmit={handleTransfer} className="space-y-6">
            <div>
              <label className="block text-white mb-2">Recipient Principal ID</label>
              <input type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} className="w-full p-3 rounded-lg bg-gray-700 text-white" placeholder="Enter recipient's Principal ID" />
            </div>

            <div>
              <label className="block text-white mb-2">Amount</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full p-3 rounded-lg bg-gray-700 text-white" placeholder="Enter amount" />
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <button type="submit" disabled={isLoading} className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 disabled:opacity-50">
              {isLoading ? "Processing..." : "Transfer"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
