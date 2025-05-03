import { ChevronDown, Grid3X3, Star, Trophy, ArrowRight, Wallet, BadgeDollarSign, PercentCircle, Info, HelpCircle, Sparkles } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { motion, useScroll, useTransform } from "framer-motion";

import { Button } from "@/core/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/core/components/ui/tabs";
import { SakuraAnimation } from "@/core/components/sakura-animation";
import NFTRewardsSection from "../core/components/nft/nft-rewards-section";
import { ProjectCard } from "@/core/components/project/project-card";
import { EmptyState } from "../core/components/ui/empty-state";
import { Badge } from "@/core/components/ui/badge";
import { Progress } from "@/core/components/ui/progress";
import { Separator } from "@/core/components/ui/seperator";

// Import the backend canister
import { backend } from "declarations/backend";

const levels = [
  {
    name: "Bronze",
    value: "bronze",
    color: "bg-amber-700",
    textColor: "text-white",
    borderColor: "",
    holdingRequirement: "0 - 100 LUM",
    maxReward: "100 LUM",
    fee: "5%",
    benefits: ["Create basic community challenges", "Earn organizer fees on completed actions", "Access to community dashboard"],
  },
  {
    name: "Silver",
    value: "silver",
    color: "bg-slate-400",
    textColor: "text-slate-300",
    borderColor: "",
    holdingRequirement: "100 - 500 LUM",
    maxReward: "500 LUM",
    fee: "10%",
    benefits: ["All Bronze benefits", "Create advanced challenges with milestones", "Access to basic analytics", "Featured in community section (limited)"],
  },
  {
    name: "Gold",
    value: "gold",
    color: "bg-amber-500",
    textColor: "text-amber-400",
    borderColor: "",
    holdingRequirement: "500 - 2000 LUM",
    maxReward: "2000 LUM",
    fee: "15%",
    benefits: ["All Silver benefits", "Create multi-stage projects", "Advanced analytics and reporting", "Priority verification for submissions", "Featured in community section"],
  },
  {
    name: "Diamond",
    value: "diamond",
    color: "bg-sky-400",
    textColor: "text-sky-300",
    borderColor: "",
    holdingRequirement: "2000 - 5000 LUM",
    maxReward: "5000 LUM",
    fee: "20%",
    benefits: ["All Gold benefits", "Create ecosystem-level initiatives", "Full analytics suite with export options", "Priority support and verification", "Featured on homepage and community section", "Access to exclusive organizer events"],
  },
];

export default function Home() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLevel, setUserLevel] = useState("bronze");
  const [lumHolding, setLumHolding] = useState(75);

  // Calculate progress percentage for the current level
  const getProgressPercentage = () => {
    switch (userLevel) {
      case "bronze":
        return Math.min((lumHolding / 100) * 100, 100);
      case "silver":
        return Math.min(((lumHolding - 100) / 400) * 100, 100);
      case "gold":
        return Math.min(((lumHolding - 500) / 1500) * 100, 100);
      case "diamond":
        return Math.min(((lumHolding - 2000) / 3000) * 100, 100);
      default:
        return 0;
    }
  };

  // Get next level requirements
  const getNextLevelRequirement = () => {
    switch (userLevel) {
      case "bronze":
        return 100 - lumHolding;
      case "silver":
        return 500 - lumHolding;
      case "gold":
        return 2000 - lumHolding;
      case "diamond":
        return "Maximum level reached";
      default:
        return 0;
    }
  };

  // Fetch projects from backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const result = await backend.getProjects();
        if ("Ok" in result) {
          // Sort projects by createdAt in descending order and take the latest 4
          const sortedProjects = result.Ok.sort((a, b) => Number(b.createdAt) - Number(a.createdAt)).slice(0, 4);
          setProjects(sortedProjects);
        } else {
          setError(result.Err);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);

  const cardVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const imageVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const contentVariants = {
    initial: { y: 0 },
    hover: {
      y: -5,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <main>
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div className="absolute inset-0 z-0" style={{ scale: heroScale }}>
          <div className="absolute inset-0 bg-black/20 z-10"></div>
          <img
            src="/images/hero-tree.png"
            alt="Pixel art cherry blossom tree on a hill"
            className="w-full h-full object-cover object-center min-h-full min-w-full"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              minWidth: "100%",
              minHeight: "100%",
              maxWidth: "100%",
              maxHeight: "100%",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90" />
        </motion.div>

        <SakuraAnimation />

        <motion.div className="container relative z-20 px-4 mx-auto text-center" style={{ y: heroY, opacity: heroOpacity }}>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }} className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-[0_0_15px_rgba(236,234,227,0.5)]">
            <span className="text-beige-200">LUMORA</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }} className="text-xl md:text-2xl text-beige-100 max-w-3xl mx-auto mb-10">
            Earn rewards for real-world eco-friendly actions through our decentralized, community-driven platform
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8 }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate("/projects")} className="bg-black/40 backdrop-blur-lg hover:bg-black/60 px-8 py-6 rounded-xl text-lg font-medium">
              Contribute <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button className="px-8 bg-transparent hover:bg-transparent py-6 rounded-xl text-lg font-medium" onClick={() => navigate("/resources")}>
              Learn More
            </Button>
          </motion.div>
          <div className="mb-28"></div>
        </motion.div>

        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }} className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20 text-beige-200">
          <ChevronDown className="h-8 w-8 animate-bounce" />
        </motion.div>
      </section>

      {/* Featured Projects */}
      <section className="py-12 border-b">
        <div className="container">
          <Tabs defaultValue="trending">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold mb-8">Latest Impact Projects</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="hidden md:flex items-center gap-1" onClick={() => navigate("/projects")}>
                  <Grid3X3 className="h-4 w-4" />
                  View All
                </Button>
              </div>
            </div>

            <TabsContent value="trending" className="mt-0">
              {loading ? (
                <div className="text-center py-8">Loading projects...</div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">Error: {error}</div>
              ) : projects.length === 0 ? (
                <EmptyState variant="projects" title="No projects yet" description="No projects to display at the moment." />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {projects.map((project) => (
                    <motion.div key={project.id} variants={cardVariants} initial="initial" whileHover="hover" className="cursor-pointer" onClick={() => navigate(`/projects/${project.id}`)}>
                      <ProjectCard project={project} />
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="top" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    id: "top-1",
                    title: "Solar Panel Collective",
                    impact: "125 MWh generated",
                    reward: 32500,
                    participants: [1, 2, 3, 4, 5], // Dummy array for length
                    maxParticipants: 1000,
                    status: 1,
                    image: null,
                  },
                  {
                    id: "top-2",
                    title: "Sustainable Transport",
                    impact: "45 tons CO₂ saved",
                    reward: 28700,
                    participants: [1, 2, 3], // Dummy array for length
                    maxParticipants: 500,
                    status: 1,
                    image: null,
                  },
                  {
                    id: "top-3",
                    title: "Water Conservation",
                    impact: "1.2M gallons saved",
                    reward: 24300,
                    participants: [1, 2], // Dummy array for length
                    maxParticipants: 300,
                    status: 1,
                    image: null,
                  },
                  {
                    id: "top-4",
                    title: "Zero Waste Challenge",
                    impact: "18.5 tons diverted",
                    reward: 21800,
                    participants: [1, 2, 3, 4], // Dummy array for length
                    maxParticipants: 400,
                    status: 1,
                    image: null,
                  },
                ].map((project) => (
                  <ProjectCard key={project.id} project={project} onClick={() => {}} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="watchlist" className="mt-0">
              <div className="flex flex-col items-center justify-center py-12">
                <div className="text-center max-w-md">
                  <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-medium mb-2">No projects in your watchlist</h3>
                  <p className="text-muted-foreground mb-6">Add projects to your watchlist to track initiatives you're interested in supporting.</p>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">Explore Projects</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <NFTRewardsSection />

      {/* Resources */}
      <section className="py-12 border-t">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">Resources for getting started</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div variants={cardVariants} initial="initial" whileHover="hover" className="cursor-pointer" onClick={() => navigate("/resources")}>
              <Card className="bg-card border-border/40 overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="relative aspect-video overflow-hidden">
                  <motion.img src="/images/hero-tree.png" alt="Lumora Basics" variants={imageVariants} className="object-cover w-full h-full" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>
                <motion.div variants={contentVariants}>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-medium mb-2">Learn the basics of Lumora</h3>
                    <p className="text-muted-foreground mb-4">Everything you need to know to get started with eco-friendly actions and token rewards.</p>
                    <Button variant="outline" className="border-emerald-600 text-emerald-500">
                      Learn More
                    </Button>
                  </CardContent>
                </motion.div>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants} initial="initial" whileHover="hover" className="cursor-pointer" onClick={() => navigate("/resources")}>
              <Card className="bg-card border-border/40 overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="relative aspect-video overflow-hidden">
                  <motion.img src="/images/track.png" alt="Track Actions" variants={imageVariants} className="object-cover w-full h-full" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>
                <motion.div variants={contentVariants}>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-medium mb-2">Track your eco-friendly actions</h3>
                    <p className="text-muted-foreground mb-4">Step-by-step guide to logging your sustainability efforts and earning rewards.</p>
                    <Button variant="outline" className="border-emerald-600 text-emerald-500">
                      Start Tracking
                    </Button>
                  </CardContent>
                </motion.div>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants} initial="initial" whileHover="hover" className="cursor-pointer" onClick={() => navigate("/resources")}>
              <Card className="bg-card border-border/40 overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="relative aspect-video overflow-hidden">
                  <motion.img src="/images/white-paper.png" alt="ICP Wallet" variants={imageVariants} className="object-cover w-full h-full" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>
                <motion.div variants={contentVariants}>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-medium mb-2">Set up your ICP wallet</h3>
                    <p className="text-muted-foreground mb-4">Connect your Internet Computer wallet to start earning and using Lumora tokens.</p>
                    <Button variant="outline" className="border-emerald-600 text-emerald-500">
                      Connect Wallet
                    </Button>
                  </CardContent>
                </motion.div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Level */}
      <section className="py-12 border-t container">
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Community Organizer Levels</h1>
          <p className="text-muted-foreground max-w-[800px]">Unlock greater rewards and benefits as you level up your community organizer status by holding more LUM tokens.</p>
        </div>
        <Tabs defaultValue="overview" className="space-y-8">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="calculator">Level Calculator</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>

            <a href="#" onClick={() => navigate("/assistant")}>
              <Button variant="outline" className="gap-2">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                <span>Get Help</span>
              </Button>
            </a>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {levels.map((level) => (
                <Card key={level.value} className={`border ${level.borderColor} overflow-hidden`}>
                  <CardHeader className={`${level.color} text-white pb-4`}>
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5" />
                        {level.name}
                      </CardTitle>
                      <Badge variant="outline" className="bg-background/20 text-white border-white">
                        Level {levels.findIndex((l) => l.value === level.value) + 1}
                      </Badge>
                    </div>
                    <CardDescription className="text-white">Organizer tier</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Wallet className="h-4 w-4 text-white" />
                          <span className="text-white">Holding Requirement</span>
                        </div>
                        <span className={`font-medium text-white`}>{level.holdingRequirement}</span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <BadgeDollarSign className="h-4 w-4 text-white" />
                          <span className="text-white">Maximum Reward</span>
                        </div>
                        <span className={`font-medium text-white`}>{level.maxReward}</span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <PercentCircle className="h-4 w-4 text-white" />
                          <span className="text-white">Fee to Organizer</span>
                        </div>
                        <span className={`font-medium text-white`}>{level.fee}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-card border rounded-lg p-6 space-y-6">
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-semibold">How the Level System Works</h2>
                <p className="text-muted-foreground">As a community organizer, your level is determined by the amount of LUM tokens you hold in your wallet. Higher levels unlock greater rewards and benefits, but also come with increased responsibilities.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">1. Hold LUM Tokens</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Maintain the required amount of LUM tokens in your wallet to qualify for each level. Your level is automatically updated based on your holdings.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">2. Create Projects / Challenges</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Design and launch sustainability challenges with rewards up to your level's maximum. Higher levels allow for more complex and rewarding initiatives.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">3. Earn Fees</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Receive a percentage of all rewards distributed through your challenges. Higher levels earn larger percentages, incentivizing growth.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Calculator Tab */}
          <TabsContent value="calculator" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Level Calculator</CardTitle>
                <CardDescription>See your current level and what you need to reach the next tier</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="level-select" className="text-sm font-medium">
                      Select your current community account level
                    </label>
                    <select id="level-select" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={userLevel} onChange={(e) => setUserLevel(e.target.value)}>
                      {levels.map((level) => (
                        <option key={level.value} value={level.value}>
                          {level.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="lum-holding" className="text-sm font-medium">
                      Your current LUM holdings
                    </label>
                    <input id="lum-holding" type="number" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={lumHolding} placeholder="0" onChange={(e) => setLumHolding(Number.parseInt(e.target.value))} min="0" max="5000" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress to next level</span>
                    <span>{getProgressPercentage().toFixed(0)}%</span>
                  </div>
                  <Progress value={getProgressPercentage()} className="h-2" />
                </div>

                <div className="rounded-lg border bg-card p-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Trophy className={`h-5 w-5 ${levels.find((l) => l.value === userLevel)?.textColor}`} />
                        <span className="font-medium">Current Level: {levels.find((l) => l.value === userLevel)?.name}</span>
                      </div>
                      <Badge variant="outline" className={`${levels.find((l) => l.value === userLevel)?.textColor}`}>
                        {levels.find((l) => l.value === userLevel)?.holdingRequirement}
                      </Badge>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Maximum reward per challenge</span>
                        <span className="font-medium">{levels.find((l) => l.value === userLevel)?.maxReward}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Fee earned on rewards</span>
                        <span className="font-medium">{levels.find((l) => l.value === userLevel)?.fee}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">LUM needed for next level</span>
                        <span className="font-medium">{typeof getNextLevelRequirement() === "number" ? `${getNextLevelRequirement()} LUM` : getNextLevelRequirement()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Earnings Potential</CardTitle>
                <CardDescription>Estimate your potential earnings as a community organizer</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Monthly Challenges</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">5</div>
                        <p className="text-sm text-muted-foreground">Average for your level</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Completion Rate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">75%</div>
                        <p className="text-sm text-muted-foreground">Average for your level</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Potential Earnings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-emerald-500">{((Number.parseInt(levels.find((l) => l.value === userLevel)?.maxReward) * 5 * 0.75 * Number.parseInt(levels.find((l) => l.value === userLevel)?.fee)) / 100).toFixed(0)} LUM</div>
                        <p className="text-sm text-muted-foreground">Monthly estimate</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4 flex items-start gap-3">
                    <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">Earnings are estimated based on average challenge completion rates and reward distributions. Actual earnings may vary based on challenge design, participant engagement, and other factors.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>Common questions about the community organizer level system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {[
                    {
                      question: "How is my organizer level determined?",
                      answer: "Your level is determined by the amount of LUM tokens you hold in your account. The system automatically checks your balance and assigns the appropriate level.",
                    },
                    {
                      question: "How are organizer fees calculated and distributed?",
                      answer: "Organizer fees are calculated as a percentage of the rewards distributed to participants who complete your projects. Fees are automatically transferred to your wallet when rewards are distributed.",
                    },
                    {
                      question: "Can I create projects with rewards higher than my level's maximum?",
                      answer: "No, the maximum reward per challenge is limited by your current level. To create projects with higher rewards, you'll need to increase your LUM holdings to reach the next level.",
                    },
                    {
                      question: "How often are levels updated?",
                      answer: "Your level is updated in real-time based on your LUM holdings. As soon as you acquire enough tokens to reach the next level, your benefits and capabilities will be upgraded automatically.",
                    },
                  ].map((faq, i) => (
                    <div key={i} className="space-y-2">
                      <h3 className="font-medium flex items-center gap-2">
                        <HelpCircle className="h-4 w-4 text-emerald-500" />
                        {faq.question}
                      </h3>
                      <p className="text-sm text-muted-foreground pl-6">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}
