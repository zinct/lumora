
import { useState } from "react"
import { Sparkles, Gift, Clock, ChevronRight, Leaf, Coins } from "lucide-react"
import { Button } from "@/core/components/ui/button"
import { Card, CardContent } from "@/core/components/ui/card"
import { Badge } from "@/core/components/ui/badge"
import { NFTRedemptionModal } from "@/core/components/nft/nft-redemption-modal"

// Mock data for available NFTs
const availableNFTs = [
  {
    id: 1,
    name: "Earth Guardian",
    image: "/placeholder.svg?height=300&width=300&text=Earth Guardian",
    description: "A symbol of your commitment to protecting our planet's ecosystems.",
    tokenCost: 2500,
    rarity: "Rare",
    available: true,
    timeLeft: "3 days",
    category: "Achievement",
  },
  {
    id: 2,
    name: "Ocean Protector",
    image: "/placeholder.svg?height=300&width=300&text=Ocean Protector",
    description: "Awarded to those who have contributed to ocean conservation efforts.",
    tokenCost: 1800,
    rarity: "Uncommon",
    available: true,
    timeLeft: "5 days",
    category: "Achievement",
  },
  {
    id: 3,
    name: "Forest Steward",
    image: "/placeholder.svg?height=300&width=300&text=Forest Steward",
    description: "Recognition for your dedication to forest preservation and reforestation.",
    tokenCost: 3200,
    rarity: "Epic",
    available: true,
    timeLeft: "2 days",
    category: "Achievement",
  },
  {
    id: 4,
    name: "Climate Champion",
    image: "/placeholder.svg?height=300&width=300&text=Climate Champion",
    description: "For those who have made significant contributions to climate action.",
    tokenCost: 4000,
    rarity: "Legendary",
    available: true,
    timeLeft: "1 day",
    category: "Achievement",
  },
]

export default function NFTRedemptionSection() {
  const userRole = "participant"
  const [selectedNFT, setSelectedNFT] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [userTokens, setUserTokens] = useState(3500)

  // Check if user is eligible to redeem (is a participant)
  const canRedeem = userRole === "participant"

  const handleRedeemClick = (nft) => {
    setSelectedNFT(nft)
    setIsModalOpen(true)
  }

  const handleRedemptionComplete = (success) => {
    if (success) {
      // Update token balance after successful redemption
      setUserTokens((prev) => prev - selectedNFT.tokenCost)
    }
    setIsModalOpen(false)
  }

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case "Common":
        return "bg-slate-500"
      case "Uncommon":
        return "bg-green-500"
      case "Rare":
        return "bg-blue-500"
      case "Epic":
        return "bg-purple-500"
      case "Legendary":
        return "bg-amber-500"
      default:
        return "bg-slate-500"
    }
  }

  return (
    <section className="py-12 border-b">
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold flex items-center">
              <Sparkles className="h-6 w-6 mr-2 text-amber-400" />
              Exclusive NFT Rewards
            </h2>
            <p className="text-muted-foreground mt-1">Redeem your tokens for limited-edition sustainability NFTs</p>
          </div>
          {canRedeem && (
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-full">
                <Coins className="h-5 w-5 mr-2" />
                <span className="font-semibold">{userTokens} LUM Tokens</span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {availableNFTs.map((nft) => (
            <Card key={nft.id} className="overflow-hidden border-border/40 hover:shadow-md transition-shadow">
              <div className="relative aspect-square">
                <img src={nft.image || "/placeholder.svg"} alt={nft.name} fill className="object-cover" />
                <Badge className={`absolute top-2 right-2 ${getRarityColor(nft.rarity)}`}>
                  <Sparkles className="h-3 w-3 mr-1" />
                  {nft.rarity}
                </Badge>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {nft.timeLeft} left
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium text-lg mb-1">{nft.name}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{nft.description}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Leaf className="h-4 w-4 text-emerald-500 mr-1" />
                    <span className="font-medium">{nft.tokenCost} LUM</span>
                  </div>
                  {canRedeem ? (
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700"
                      disabled={userTokens < nft.tokenCost}
                      onClick={() => handleRedeemClick(nft)}
                    >
                      <Gift className="h-4 w-4 mr-1" />
                      Redeem
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" disabled>
                      Login to Redeem
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 text-center">
          <a href="/nfts">
            <Button variant="outline" className="mt-4">
              View All NFTs
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </a>
        </div>

        {selectedNFT && (
          <NFTRedemptionModal
            nft={selectedNFT}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onComplete={handleRedemptionComplete}
            userTokens={userTokens}
          />
        )}
      </div>
    </section>
  )
}
