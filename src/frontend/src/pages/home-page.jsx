import { Search, Menu, ChevronDown, Grid3X3, Clock, ArrowRight, Leaf, Star, Wallet, User, Bell, Globe, TreePine, Recycle, Droplets, Zap, Sprout } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { motion, useScroll, useTransform } from "framer-motion";

import { Button } from "@/core/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/core/components/ui/avatar";
import { Badge } from "@/core/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/core/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/core/components/ui/tabs";
import { SakuraAnimation } from "@/core/components/sakura-animation";
import NFTRedemptionSection from "../core/components/nft/nft-redemption-section";

// Import the backend canister
import { backend } from "declarations/backend";
import { EmptyState } from "../core/components/ui/empty-state";

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
    return status === 1 ? (
      <Badge variant="secondary" className="ml-auto bg-emerald-500/20 text-emerald-400">
        <Leaf className="h-3 w-3 mr-1" />
        Active
      </Badge>
    ) : (
      <Badge variant="secondary" className="ml-auto bg-gray-500/20 text-gray-400">
        <Clock className="h-3 w-3 mr-1" />
        Inactive
      </Badge>
    );
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
                  {projects.map((project, i) => (
                    <Card key={project.id} className="overflow-hidden bg-card border-border/40" onClick={() => navigate(`/projects/${project.id}`)}>
                      <div className="relative aspect-square">
                        {project.image ? (
                          <img
                            src={URL.createObjectURL(
                              new Blob([project.image[0]], {
                                type: "image/png",
                              })
                            )}
                            alt={project.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://api.dicebear.com/7.x/shapes/svg?seed=${project.title}&backgroundColor=c7d2fe,ddd6fe,fae8ff,dbeafe,bfdbfe,e0e7ff&shape1Color=4f46e5,6d28d9,7c3aed,2563eb,3b82f6,4f46e5`;
                            }}
                          />
                        ) : (
                          <img src={`https://api.dicebear.com/7.x/shapes/svg?seed=${project.title}&backgroundColor=c7d2fe,ddd6fe,fae8ff,dbeafe,bfdbfe,e0e7ff&shape1Color=4f46e5,6d28d9,7c3aed,2563eb,3b82f6,4f46e5`} alt={project.title} className="w-full h-full object-cover bg-gray-100" />
                        )}
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar className="h-8 w-8 border-2 border-background -mt-8">
                            <AvatarImage src={`https://api.dicebear.com/7.x/shapes/svg?seed=${project.title}&backgroundColor=c7d2fe&shape1Color=4f46e5`} alt={project.title} />
                            <AvatarFallback>{project.title.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="font-medium">{project.title}</div>
                          {renderProjectStatus(project.status)}
                        </div>
                        <div className="flex justify-between text-sm">
                          <div>
                            <p className="text-muted-foreground">Participants</p>
                            <p className="font-medium">
                              {project.participants.length}/{project.maxParticipants}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Reward</p>
                            <p className="font-medium">{project.reward} LUM</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="top" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: "Solar Panel Collective",
                    impact: "125 MWh generated",
                    tokens: "32,500",
                    participants: "512",
                  },
                  {
                    title: "Sustainable Transport",
                    impact: "45 tons CO₂ saved",
                    tokens: "28,700",
                    participants: "389",
                  },
                  {
                    title: "Water Conservation",
                    impact: "1.2M gallons saved",
                    tokens: "24,300",
                    participants: "276",
                  },
                  {
                    title: "Zero Waste Challenge",
                    impact: "18.5 tons diverted",
                    tokens: "21,800",
                    participants: "342",
                  },
                ].map((project, i) => (
                  <Card key={i} className="overflow-hidden bg-card border-border/40">
                    <div className="relative aspect-square">
                      <img src={`/placeholder.svg?height=300&width=300&text=Top ${i + 1}`} alt={project.title} fill className="object-cover" />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-8 w-8 border-2 border-background -mt-8">
                          <AvatarImage src={`/placeholder.svg?height=32&width=32&text=${i}`} alt="Project" />
                          <AvatarFallback>P{i}</AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{project.title}</div>
                        <Badge variant="secondary" className="ml-auto bg-emerald-500/20 text-emerald-400">
                          <Star className="h-3 w-3 mr-1" />#{i + 1}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <div>
                          <p className="text-muted-foreground">Impact</p>
                          <p className="font-medium">{project.impact}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Tokens</p>
                          <p className="font-medium">{project.tokens} LUM</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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

      <NFTRedemptionSection />

      {/* Resources */}
      <section className="py-12 border-t">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">Resources for getting started</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-card border-border/40">
              <div className="relative aspect-video">
                <img src="/placeholder.svg?height=200&width=400&text=Lumora Basics" alt="Lumora Basics" fill className="object-cover" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-medium mb-2">Learn the basics of Lumora</h3>
                <p className="text-muted-foreground mb-4">Everything you need to know to get started with eco-friendly actions and token rewards.</p>
                <Button variant="outline" className="border-emerald-600 text-emerald-500" onClick={() => navigate("/resources")}>
                  Learn More
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/40">
              <div className="relative aspect-video">
                <img src="/placeholder.svg?height=200&width=400&text=Track Actions" alt="Track Actions" fill className="object-cover" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-medium mb-2">Track your eco-friendly actions</h3>
                <p className="text-muted-foreground mb-4">Step-by-step guide to logging your sustainability efforts and earning rewards.</p>
                <Button variant="outline" className="border-emerald-600 text-emerald-500" onClick={() => navigate("/resources")}>
                  Start Tracking
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/40">
              <div className="relative aspect-video">
                <img src="/placeholder.svg?height=200&width=400&text=ICP Wallet" alt="ICP Wallet" fill className="object-cover" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-medium mb-2">Set up your ICP wallet</h3>
                <p className="text-muted-foreground mb-4">Connect your Internet Computer wallet to start earning and using Lumora tokens.</p>
                <Button variant="outline" className="border-emerald-600 text-emerald-500" onClick={() => navigate("/resources")}>
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
