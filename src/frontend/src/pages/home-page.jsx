import {
  Search,
  Menu,
  ChevronDown,
  Grid3X3,
  Clock,
  ArrowRight,
  Leaf,
  Star,
  Wallet,
  User,
  Bell,
  Globe,
  TreePine,
  Recycle,
  Droplets,
  Zap,
  Sprout,
  Ban,
  CalendarClock,
  HelpCircle,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { motion, useScroll, useTransform } from "framer-motion";

import { Button } from "@/core/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/core/components/ui/avatar";
import { Badge } from "@/core/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/core/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/core/components/ui/tabs";
import { SakuraAnimation } from "@/core/components/sakura-animation";
import NFTRedemptionSection from "../core/components/nft/nft-redemption-section";
import { ProjectCard } from "@/core/components/project/project-card";
import { EmptyState } from "../core/components/ui/empty-state";

// Import the backend canister
import { backend } from "declarations/backend";

export default function Home() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch projects from backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const result = await backend.getProjects();
        if ("Ok" in result) {
          // Sort projects by createdAt in descending order and take the latest 4
          const sortedProjects = result.Ok.sort(
            (a, b) => Number(b.createdAt) - Number(a.createdAt)
          ).slice(0, 4);
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

  // Floating animation for hero elements
  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  };

  // Helper function to format timestamp
  const formatDate = (timestamp) => {
    return new Date(Number(timestamp) / 1000000).toLocaleDateString();
  };

  // Helper function to render project status
  const renderProjectStatus = (status) => {
    status = parseInt(status);
    switch (status) {
      case 0: // inactive
        return (
          <Badge
            variant="secondary"
            className="ml-auto bg-red-500/20 text-red-400"
          >
            <Ban className="h-3 w-3 mr-1" />
            Inactive
          </Badge>
        );
      case 1: // active
        return (
          <Badge
            variant="secondary"
            className="ml-auto bg-emerald-500/20 text-emerald-400"
          >
            <Leaf className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case 2: // upcoming
        return (
          <Badge
            variant="secondary"
            className="ml-auto bg-blue-500/20 text-blue-400"
          >
            <CalendarClock className="h-3 w-3 mr-1" />
            Upcoming
          </Badge>
        );
      case 3: // closed
        return (
          <Badge
            variant="secondary"
            className="ml-auto bg-gray-500/20 text-gray-400"
          >
            <Clock className="h-3 w-3 mr-1" />
            Closed
          </Badge>
        );
      default:
        return (
          <Badge
            variant="secondary"
            className="ml-auto bg-gray-500/20 text-gray-400"
          >
            <HelpCircle className="h-3 w-3 mr-1" />
            Unknown
          </Badge>
        );
    }
  };

  return (
    <main>
      <section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 z-0"
          style={{ scale: heroScale }}
        >
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

        <motion.div
          className="container relative z-20 px-4 mx-auto text-center"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-[0_0_15px_rgba(236,234,227,0.5)]"
          >
            <span className="text-beige-200">LUMORA</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-xl md:text-2xl text-beige-100 max-w-3xl mx-auto mb-10"
          >
            Earn rewards for real-world eco-friendly actions through our
            decentralized, community-driven platform
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              onClick={() => navigate("/projects")}
              className="bg-black/40 backdrop-blur-lg hover:bg-black/60 px-8 py-6 rounded-xl text-lg font-medium"
            >
              Contribute <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              className="px-8 bg-transparent hover:bg-transparent py-6 rounded-xl text-lg font-medium"
              onClick={() => navigate("/resources")}
            >
              Learn More
            </Button>
          </motion.div>
          <div className="mb-28"></div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20 text-beige-200"
        >
          <ChevronDown className="h-8 w-8 animate-bounce" />
        </motion.div>
      </section>

      {/* Featured Projects */}
      <section className="py-12 border-b">
        <div className="container">
          <Tabs defaultValue="trending">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold mb-8">
                Latest Impact Projects
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden md:flex items-center gap-1"
                  onClick={() => navigate("/projects")}
                >
                  <Grid3X3 className="h-4 w-4" />
                  View All
                </Button>
              </div>
            </div>

            <TabsContent value="trending" className="mt-0">
              {loading ? (
                <div className="text-center py-8">Loading projects...</div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">
                  Error: {error}
                </div>
              ) : projects.length === 0 ? (
                <EmptyState
                  variant="projects"
                  title="No projects yet"
                  description="No projects to display at the moment."
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {projects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onClick={() => navigate(`/projects/${project.id}`)}
                    />
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
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onClick={() => {}}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="watchlist" className="mt-0">
              <div className="flex flex-col items-center justify-center py-12">
                <div className="text-center max-w-md">
                  <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-medium mb-2">
                    No projects in your watchlist
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Add projects to your watchlist to track initiatives you're
                    interested in supporting.
                  </p>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    Explore Projects
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <NFTRedemptionSection />

      {/* Resources */}
      <section className="py-12 border-t">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">
            Resources for getting started
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-card border-border/40">
              <div className="relative aspect-video">
                <img
                  src="/placeholder.svg?height=200&width=400&text=Lumora Basics"
                  alt="Lumora Basics"
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-medium mb-2">
                  Learn the basics of Lumora
                </h3>
                <p className="text-muted-foreground mb-4">
                  Everything you need to know to get started with eco-friendly
                  actions and token rewards.
                </p>
                <Button
                  variant="outline"
                  className="border-emerald-600 text-emerald-500"
                  onClick={() => navigate("/resources")}
                >
                  Learn More
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/40">
              <div className="relative aspect-video">
                <img
                  src="/placeholder.svg?height=200&width=400&text=Track Actions"
                  alt="Track Actions"
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-medium mb-2">
                  Track your eco-friendly actions
                </h3>
                <p className="text-muted-foreground mb-4">
                  Step-by-step guide to logging your sustainability efforts and
                  earning rewards.
                </p>
                <Button
                  variant="outline"
                  className="border-emerald-600 text-emerald-500"
                  onClick={() => navigate("/resources")}
                >
                  Start Tracking
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/40">
              <div className="relative aspect-video">
                <img
                  src="/placeholder.svg?height=200&width=400&text=ICP Wallet"
                  alt="ICP Wallet"
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-medium mb-2">
                  Set up your ICP wallet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Connect your Internet Computer wallet to start earning and
                  using Lumora tokens.
                </p>
                <Button
                  variant="outline"
                  className="border-emerald-600 text-emerald-500"
                  onClick={() => navigate("/resources")}
                >
                  Connect Wallet
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
