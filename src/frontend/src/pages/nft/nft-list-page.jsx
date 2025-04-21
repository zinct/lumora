import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/core/components/ui/tabs";
import { Card, CardContent } from "@/core/components/ui/card";
import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import {
  Sparkles,
  Search,
  Filter,
  Grid3X3,
  ListFilter,
  Lock,
  Clock,
  Leaf,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/core/components/ui/dialog";
// Mock data for NFT collections
const nftCollections = [
  {
    id: 1,
    name: "Eco Guardians",
    description:
      "Celebrate your commitment to environmental protection with these guardian-themed NFTs.",
    image: "/placeholder.svg?height=300&width=300&text=Eco Guardians",
    itemCount: 12,
    category: "Achievement",
    featured: true,
  },
  {
    id: 2,
    name: "Ocean Defenders",
    description:
      "A collection honoring those who have contributed to ocean conservation efforts.",
    image: "/placeholder.svg?height=300&width=300&text=Ocean Defenders",
    itemCount: 8,
    category: "Conservation",
    featured: true,
  },
  {
    id: 3,
    name: "Forest Spirits",
    description:
      "Mystical beings representing your dedication to forest preservation.",
    image: "/placeholder.svg?height=300&width=300&text=Forest Spirits",
    itemCount: 10,
    category: "Conservation",
    featured: false,
  },
  {
    id: 4,
    name: "Climate Heroes",
    description:
      "Honoring those who have made significant contributions to climate action.",
    image: "/placeholder.svg?height=300&width=300&text=Climate Heroes",
    itemCount: 6,
    category: "Achievement",
    featured: true,
  },
  {
    id: 5,
    name: "Sustainable Cities",
    description: "Futuristic visions of sustainable urban environments.",
    image: "/placeholder.svg?height=300&width=300&text=Sustainable Cities",
    itemCount: 15,
    category: "Vision",
    featured: false,
  },
  {
    id: 6,
    name: "Renewable Energy",
    description:
      "Celebrating innovations and achievements in renewable energy.",
    image: "/placeholder.svg?height=300&width=300&text=Renewable Energy",
    itemCount: 9,
    category: "Innovation",
    featured: false,
  },
  {
    id: 7,
    name: "Biodiversity Champions",
    description: "Recognizing efforts to protect and enhance biodiversity.",
    image: "/placeholder.svg?height=300&width=300&text=Biodiversity",
    itemCount: 12,
    category: "Conservation",
    featured: false,
  },
  {
    id: 8,
    name: "Zero Waste Heroes",
    description:
      "Honoring those committed to reducing waste and promoting circular economy.",
    image: "/placeholder.svg?height=300&width=300&text=Zero Waste",
    itemCount: 7,
    category: "Achievement",
    featured: true,
  },
];

// Mock data for user's NFTs
const userNFTs = [
  {
    id: 101,
    name: "Forest Guardian",
    image: "/placeholder.svg?height=300&width=300&text=Forest Guardian",
    collection: "Eco Guardians",
    rarity: "Rare",
    acquiredDate: "2025-03-15",
  },
  {
    id: 102,
    name: "Ocean Protector",
    image: "/placeholder.svg?height=300&width=300&text=Ocean Protector",
    collection: "Ocean Defenders",
    rarity: "Uncommon",
    acquiredDate: "2025-04-02",
  },
  {
    id: 103,
    name: "Climate Innovator",
    image: "/placeholder.svg?height=300&width=300&text=Climate Innovator",
    collection: "Climate Heroes",
    rarity: "Epic",
    acquiredDate: "2025-02-28",
  },
];

export default function NFTsPage() {
  const userRole = "Participant";
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check if user is eligible to view NFTs (is a participant)
  const canViewNFTs = userRole === "participant";

  // Filter collections based on search and category
  const filteredCollections = nftCollections.filter((collection) => {
    const matchesSearch =
      collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || collection.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case "Common":
        return "bg-slate-500";
      case "Uncommon":
        return "bg-green-500";
      case "Rare":
        return "bg-blue-500";
      case "Epic":
        return "bg-purple-500";
      case "Legendary":
        return "bg-amber-500";
      default:
        return "bg-slate-500";
    }
  };

  const handleNFTClick = (nft) => {
    setSelectedNFT(nft);
    setIsModalOpen(true);
  };

  if (canViewNFTs) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 container py-12 flex flex-col items-center justify-center">
          <div className="text-center max-w-md">
            <Lock className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-2">
              Participant Access Required
            </h1>
            <p className="text-muted-foreground mb-6">
              You need to be logged in as a Participant to view and manage NFTs.
            </p>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => openLoginModal("participant", "/nfts")}
            >
              Login as Participant
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Sparkles className="h-6 w-6 mr-2 text-amber-400" />
              NFT Collections
            </h1>
            <p className="text-muted-foreground mt-1">
              Explore and collect unique NFTs that represent your sustainability
              achievements
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className={
                viewMode === "grid" ? "bg-emerald-600 hover:bg-emerald-700" : ""
              }
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
              className={
                viewMode === "list" ? "bg-emerald-600 hover:bg-emerald-700" : ""
              }
            >
              <ListFilter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="collections">
          <TabsList className="mb-6">
            <TabsTrigger value="collections">Collections</TabsTrigger>
            <TabsTrigger value="my-nfts">My NFTs</TabsTrigger>
          </TabsList>

          <TabsContent value="collections">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search collections..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Achievement">Achievement</SelectItem>
                  <SelectItem value="Conservation">Conservation</SelectItem>
                  <SelectItem value="Innovation">Innovation</SelectItem>
                  <SelectItem value="Vision">Vision</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="md:w-auto">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCollections.map((collection) => (
                  <Card
                    className="overflow-hidden hover:shadow-md transition-shadow h-full"
                    onClick={() => handleNFTClick(collection)}
                    key={collection.id}
                  >
                    <div className="relative aspect-square">
                      <img
                        src={collection.image || "/placeholder.svg"}
                        alt={collection.name}
                        fill
                        className="object-cover"
                      />
                      {collection.featured && (
                        <Badge className="absolute top-2 right-2 bg-amber-500">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h2 className="font-bold text-lg mb-1">
                        {collection.name}
                      </h2>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {collection.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <Badge variant="outline">{collection.category}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {collection.itemCount} items
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCollections.map((collection) => (
                  <a
                    href={`/nfts/collections/${collection.id}`}
                    key={collection.id}
                  >
                    <Card className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="flex">
                        <div className="relative w-24 h-24 sm:w-32 sm:h-32">
                          <img
                            src={collection.image || "/placeholder.svg"}
                            alt={collection.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h2 className="font-bold text-lg">
                                {collection.name}
                              </h2>
                              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                {collection.description}
                              </p>
                            </div>
                            {collection.featured && (
                              <Badge className="bg-amber-500">
                                <Sparkles className="h-3 w-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                          </div>
                          <div className="flex justify-between items-center mt-3">
                            <Badge variant="outline">
                              {collection.category}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {collection.itemCount} items
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </a>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="my-nfts">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">
                Your NFT Collection
              </h2>
              <p className="text-muted-foreground">
                NFTs you've earned through your sustainability actions and token
                redemptions
              </p>
            </div>

            {userNFTs.length === 0 ? (
              <div className="text-center py-12">
                <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-medium mb-2">No NFTs Yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  You haven't earned any NFTs yet. Complete sustainability
                  challenges or redeem tokens to earn your first NFT.
                </p>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Explore Collections
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {userNFTs.map((nft) => (
                  <Card
                    key={nft.id}
                    className="overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="relative aspect-square">
                      <img
                        src={nft.image || "/placeholder.svg"}
                        alt={nft.name}
                        fill
                        className="object-cover"
                      />
                      <Badge
                        className={`absolute top-2 right-2 ${getRarityColor(
                          nft.rarity
                        )}`}
                      >
                        <Sparkles className="h-3 w-3 mr-1" />
                        {nft.rarity}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium text-lg mb-1">{nft.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Collection: {nft.collection}
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        Acquired:{" "}
                        {new Date(nft.acquiredDate).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {selectedNFT && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-amber-400" />
                {selectedNFT.name}
              </DialogTitle>
              <DialogDescription>
                From the {selectedNFT.collection} collection
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative w-full md:w-48 h-48 rounded-lg overflow-hidden">
                  <img
                    src={selectedNFT.image || "/placeholder.svg"}
                    alt={selectedNFT.name}
                    fill
                    className="object-cover"
                  />
                  <Badge
                    className={`absolute top-2 right-2 ${getRarityColor(
                      selectedNFT.rarity
                    )}`}
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    {selectedNFT.rarity}
                  </Badge>
                </div>

                <div className="flex-1">
                  <h3 className="font-medium text-lg mb-2">
                    {selectedNFT.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {selectedNFT.description}
                  </p>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Collection:</span>
                      <span>{selectedNFT.collection}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Rarity:</span>
                      <span>{selectedNFT.rarity}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status:</span>
                      <span>{selectedNFT.owned ? "Owned" : "Not Owned"}</span>
                    </div>
                    {!selectedNFT.owned && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Required Tokens:
                        </span>
                        <span className="flex items-center">
                          <Leaf className="h-3 w-3 mr-1 text-emerald-500" />
                          {selectedNFT.requiredTokens} LUM
                        </span>
                      </div>
                    )}
                  </div>

                  {!selectedNFT.owned && selectedNFT.progress > 0 && (
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress:</span>
                        <span>{selectedNFT.progress}%</span>
                      </div>
                      <Progress value={selectedNFT.progress} className="h-2" />
                    </div>
                  )}
                </div>
              </div>

              {!selectedNFT.owned && (
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">How to earn this NFT</h4>
                  <p className="text-sm text-muted-foreground">
                    Complete sustainability challenges related to{" "}
                    {selectedNFT.category.toLowerCase()} or redeem with{" "}
                    {selectedNFT.requiredTokens} LUM tokens when you've earned
                    enough.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
