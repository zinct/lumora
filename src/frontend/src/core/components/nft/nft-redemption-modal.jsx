

import { Coins, AlertTriangle, CheckCircle2, X } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/core/components/ui/dialog"
import { Button } from "@/core/components/ui/button"
import { Badge } from "@/core/components/ui/badge"
import { Progress } from "@/core/components/ui/progress"

export function NFTRedemptionModal({ nft, isOpen, onClose, onConfirm, userTokens }) {
  // Get rarity color class
  const getRarityColorClass = (rarity) => {
    switch (rarity) {
      case "Rare":
        return "bg-purple-500/20 text-purple-500"
      case "Uncommon":
        return "bg-blue-500/20 text-blue-500"
      default:
        return "bg-green-500/20 text-green-500"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm NFT Redemption</DialogTitle>
          <DialogDescription>
            You are about to redeem this NFT using your LUM tokens. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center py-4">
          <div className="relative w-40 h-40 mb-4 rounded-lg overflow-hidden">
            <img src={nft.image || "/placeholder.svg"} alt={nft.name} fill className="object-cover" />
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className={getRarityColorClass(nft.rarity)}>
                {nft.rarity}
              </Badge>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-center mb-1">{nft.name}</h3>
          <p className="text-sm text-muted-foreground text-center mb-4">{nft.description}</p>

          <div className="w-full bg-muted p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Your Balance</span>
              <span className="text-sm font-medium flex items-center">
                {userTokens} <Coins className="h-3 w-3 ml-1 text-emerald-500" />
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Redemption Cost</span>
              <span className="text-sm font-medium flex items-center">
                {nft.tokenCost} <Coins className="h-3 w-3 ml-1 text-emerald-500" />
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Remaining Balance</span>
              <span className="text-sm font-medium flex items-center">
                {userTokens - nft.tokenCost} <Coins className="h-3 w-3 ml-1 text-emerald-500" />
              </span>
            </div>
            <Progress value={((userTokens - nft.tokenCost) / userTokens) * 100} className="h-2 mt-2" />
          </div>

          {userTokens < nft.tokenCost ? (
            <div className="flex items-center text-amber-500 mb-4">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <span className="text-sm">You don't have enough tokens to redeem this NFT.</span>
            </div>
          ) : (
            <div className="flex items-center text-emerald-500 mb-4">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              <span className="text-sm">You have enough tokens to redeem this NFT!</span>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1 sm:flex-none">
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700"
            disabled={userTokens < nft.tokenCost}
          >
            <Coins className="h-4 w-4 mr-2" />
            Confirm Redemption
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
