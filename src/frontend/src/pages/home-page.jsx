import { Search, Menu, ChevronDown, Grid3X3, Clock, ArrowRight, Leaf, Star, Wallet, User, Bell, Globe, TreePine, Recycle, Droplets, Zap, Sprout } from "lucide-react";

import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/core/components/ui/avatar";
import { Badge } from "@/core/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/core/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/core/components/ui/tabs";
import { SakuraAnimation } from "@/core/components/sakura-animation";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Home() {
  const heroRef = useRef(null);

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

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border/40 sticky top-0 bg-black/30 z-50">
        <div className="container flex items-center h-16 justify-between">
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center gap-2 font-bold text-xl">
              <Leaf className="h-6 w-6 text-emerald-500" />
              Lumora
            </a>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="text-sm font-medium flex items-center gap-1">
                Actions
                <ChevronDown className="h-4 w-4" />
              </a>
              <a href="#" className="text-sm font-medium flex items-center gap-1">
                Impact
                <ChevronDown className="h-4 w-4" />
              </a>
              <a href="#" className="text-sm font-medium flex items-center gap-1">
                Community
                <ChevronDown className="h-4 w-4" />
              </a>
              <a href="#" className="text-sm font-medium">
                Learn
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Wallet className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <Button className="hidden md:flex bg-emerald-600 hover:bg-emerald-700">Connect Wallet</Button>
          </div>
        </div>
      </header>

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
              <Button onClick={() => navigate("/event")} className="bg-beige-200 hover:bg-beige-300 text-beige-950 px-8 py-6 rounded-xl text-lg font-medium">
                Contribute <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" className="border-beige-200 text-beige-200 hover:bg-beige-200/10 px-8 py-6 rounded-xl text-lg font-medium">
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
            <h2 className="text-2xl font-bold mb-8">Featured Impact Projects</h2>
            <Tabs defaultValue="trending">
              <div className="flex justify-between items-center mb-6">
                <TabsList>
                  <TabsTrigger value="trending">Trending</TabsTrigger>
                  <TabsTrigger value="top">Top Impact</TabsTrigger>
                  <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="hidden md:flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    This Month
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                  <Button variant="outline" size="sm" className="hidden md:flex items-center gap-1">
                    <Grid3X3 className="h-4 w-4" />
                    View All
                  </Button>
                </div>
              </div>

              <TabsContent value="trending" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      title: "Community Reforestation",
                      impact: "1,250 trees planted",
                      tokens: "15,000",
                      participants: "324",
                    },
                    {
                      title: "Ocean Cleanup Initiative",
                      impact: "3.5 tons plastic removed",
                      tokens: "12,500",
                      participants: "189",
                    },
                    {
                      title: "Renewable Energy Co-op",
                      impact: "45 MWh generated",
                      tokens: "18,200",
                      participants: "412",
                    },
                    {
                      title: "Urban Composting Network",
                      impact: "8.2 tons waste diverted",
                      tokens: "9,800",
                      participants: "276",
                    },
                  ].map((project, i) => (
                    <Card key={i} className="overflow-hidden bg-card border-border/40">
                      <div className="relative aspect-square">
                        <img src={`/placeholder.svg?height=300&width=300&text=Project ${i + 1}`} alt={project.title} fill className="object-cover" />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar className="h-8 w-8 border-2 border-background -mt-8">
                            <AvatarImage src={`/placeholder.svg?height=32&width=32&text=${i}`} alt="Project" />
                            <AvatarFallback>P{i}</AvatarFallback>
                          </Avatar>
                          <div className="font-medium">{project.title}</div>
                          <Badge variant="secondary" className="ml-auto bg-emerald-500/20 text-emerald-400">
                            <Leaf className="h-3 w-3 mr-1" />
                            Active
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

        {/* Actions Grid */}
        <section className="py-12">
          <div className="container">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Trending Eco Actions</h2>
              <Button variant="outline" className="hidden md:flex">
                View All
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Bike to Work Week",
                  category: "Transportation",
                  reward: "25",
                  impact: "5kg CO₂ saved",
                },
                {
                  title: "Community Garden",
                  category: "Agriculture",
                  reward: "40",
                  impact: "Local food +10kg",
                },
                {
                  title: "E-Waste Collection",
                  category: "Recycling",
                  reward: "30",
                  impact: "Toxic waste -2kg",
                },
                {
                  title: "Energy Audit",
                  category: "Conservation",
                  reward: "35",
                  impact: "15% energy saved",
                },
                {
                  title: "Beach Cleanup",
                  category: "Conservation",
                  reward: "45",
                  impact: "Plastic -8kg",
                },
                {
                  title: "Meatless Monday",
                  category: "Food",
                  reward: "15",
                  impact: "3kg CO₂ saved",
                },
                {
                  title: "Solar Panel Install",
                  category: "Energy",
                  reward: "200",
                  impact: "2MWh renewable",
                },
                {
                  title: "Rainwater Collection",
                  category: "Water",
                  reward: "30",
                  impact: "500L water saved",
                },
              ].map((action, i) => (
                <Card key={i} className="overflow-hidden bg-card border-border/40">
                  <div className="relative aspect-square">
                    <img src={`/placeholder.svg?height=300&width=300&text=Action ${i + 1}`} alt={action.title} fill className="object-cover" />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={`/placeholder.svg?height=24&width=24&text=${i}`} alt="Category" />
                        <AvatarFallback>C{i}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">{action.category}</span>
                    </div>
                    <h3 className="font-medium mb-1">{action.title}</h3>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between border-t">
                    <div>
                      <p className="text-xs text-muted-foreground">Reward</p>
                      <p className="font-medium">{action.reward} LUM</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Impact</p>
                      <p className="font-medium">{action.impact}</p>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-12 bg-card">
          <div className="container">
            <h2 className="text-2xl font-bold mb-8">Browse by sustainability category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { name: "Energy", icon: <Zap className="h-10 w-10 text-yellow-400" /> },
                { name: "Water", icon: <Droplets className="h-10 w-10 text-blue-400" /> },
                { name: "Waste", icon: <Recycle className="h-10 w-10 text-emerald-400" /> },
                { name: "Transportation", icon: <Globe className="h-10 w-10 text-cyan-400" /> },
                { name: "Food", icon: <Sprout className="h-10 w-10 text-green-400" /> },
                { name: "Forestry", icon: <TreePine className="h-10 w-10 text-emerald-500" /> },
                {
                  name: "Education",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400">
                      <path d="m2 8 10-5 10 5-10 5Z" />
                      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                    </svg>
                  ),
                },
                {
                  name: "Community",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-400">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  ),
                },
                {
                  name: "Biodiversity",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-400">
                      <path d="M9 12a3 3 0 1 0 6 0 3 3 0 1 0-6 0" />
                      <path d="M12 3c-1.333 0-2 .667-2 2 0 2 1 3 2 3s2-1 2-3c0-1.333-.667-2-2-2Z" />
                      <path d="M12 18c-1.333 0-2 .667-2 2 0 2 1 3 2 3s2-1 2-3c0-1.333-.667-2-2-2Z" />
                      <path d="M3 12c0-1.333.667-2 2-2 2 0 3 1 3 2s-1 2-3 2c-1.333 0-2-.667-2-2Z" />
                      <path d="M18 12c0-1.333.667-2 2-2 2 0 3 1 3 2s-1 2-3 2c-1.333 0-2-.667-2-2Z" />
                      <path d="M5.5 5.5c-.945-.945-.667-2.333 0-3s2.055-.945 3 0c1.333 1.333.5 2.5 0 3-.5.5-1.667 1.333-3 0Z" />
                      <path d="M18.5 5.5c.945-.945.667-2.333 0-3s-2.055-.945-3 0c-1.333 1.333-.5 2.5 0 3 .5.5 1.667 1.333 3 0Z" />
                      <path d="M5.5 18.5c-.945.945-.667 2.333 0 3s2.055.945 3 0c1.333-1.333.5-2.5 0-3-.5-.5-1.667-1.333-3 0Z" />
                      <path d="M18.5 18.5c.945.945.667 2.333 0 3s-2.055.945-3 0c-1.333-1.333-.5-2.5 0-3 .5-.5 1.667 1.333 3 0Z" />
                    </svg>
                  ),
                },
                {
                  name: "Climate",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-400">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                      <path d="M2 12h20" />
                    </svg>
                  ),
                },
                {
                  name: "Innovation",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
                      <path d="M12 2v5" />
                      <path d="M6 7h12" />
                      <path d="M17 22H7a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2Z" />
                      <path d="M12 17v.01" />
                    </svg>
                  ),
                },
              ].map((category, i) => (
                <Card key={i} className="overflow-hidden hover:shadow-md transition-shadow bg-card border-border/40">
                  <a href="#" className="block">
                    <div className="relative aspect-square bg-gradient-to-br from-primary/10 to-background flex items-center justify-center">{category.icon}</div>
                    <CardContent className="p-3 text-center">
                      <h3 className="font-medium">{category.name}</h3>
                    </CardContent>
                  </a>
                </Card>
              ))}
            </div>
          </div>
        </section>

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
                  <Button variant="outline" className="border-emerald-600 text-emerald-500">
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
                  <Button variant="outline" className="border-emerald-600 text-emerald-500">
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
                  <Button variant="outline" className="border-emerald-600 text-emerald-500">
                    Connect Wallet
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-card border-t border-border/40 py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <a href="/" className="flex items-center gap-2 font-bold text-xl mb-4">
                <Leaf className="h-6 w-6 text-emerald-500" />
                Lumora
              </a>
              <p className="text-muted-foreground mb-4">A decentralized, community-driven platform that incentivizes real-world eco-friendly actions through token rewards on the Internet Computer Protocol.</p>
              <div className="flex gap-4">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                  </svg>
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                  </svg>
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-4">Platform</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    How it works
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Token
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Governance
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Partners
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Disclaimer
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border/40 text-center text-muted-foreground">
            <p>© {new Date().getFullYear()} Lumora. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
