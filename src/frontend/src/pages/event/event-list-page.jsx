"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Leaf, Trash2, Droplets, Sun, Filter, Search } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import EventCard from "@/core/components/event-card";

// Sample event data
const events = [
  {
    id: 1,
    title: "Community Tree Planting",
    description: "Join us for a day of tree planting in Central Park. All equipment provided.",
    date: "2023-12-15",
    time: "09:00 AM - 02:00 PM",
    location: "Central Park, Sector 7",
    category: "tree-planting",
    rewards: "100 GreenTokens per tree planted",
    participants: 24,
    image: "https://source.unsplash.com/random/400x200/?nature,tree,planting",
  },
  {
    id: 2,
    title: "Beach Cleanup Initiative",
    description: "Help clean our local beaches and protect marine life from plastic pollution.",
    date: "2023-12-18",
    time: "08:00 AM - 12:00 PM",
    location: "Sunset Beach, West Coast",
    category: "waste-cleanup",
    rewards: "75 GreenTokens per hour of participation",
    participants: 42,
    image: "https://source.unsplash.com/random/400x200/?nature,beach,cleanup",
  },
  {
    id: 3,
    title: "River Conservation Project",
    description: "Help monitor water quality and remove invasive species from our local river.",
    date: "2023-12-20",
    time: "10:00 AM - 03:00 PM",
    location: "Riverside Park, East District",
    category: "water-conservation",
    rewards: "120 GreenTokens for full participation",
    participants: 18,
    image: "https://source.unsplash.com/random/400x200/?nature,river,conservation",
  },
  {
    id: 4,
    title: "Renewable Energy Workshop",
    description: "Learn how to build small-scale solar panels and wind turbines for home use.",
    date: "2023-12-22",
    time: "01:00 PM - 05:00 PM",
    location: "Community Center, Downtown",
    category: "renewable-energy",
    rewards: "150 GreenTokens for completed project",
    participants: 35,
    image: "https://source.unsplash.com/random/400x200/?nature,solar,wind",
  },
  {
    id: 5,
    title: "Urban Garden Development",
    description: "Transform empty lots into productive community gardens with native plants.",
    date: "2023-12-25",
    time: "09:00 AM - 04:00 PM",
    location: "Urban District, Block 12",
    category: "tree-planting",
    rewards: "90 GreenTokens per garden section completed",
    participants: 29,
    image: "https://picsum.photos/400/200/?nature,garden,development",
  },
  {
    id: 6,
    title: "Highway Cleanup Campaign",
    description: "Join our effort to clean up trash along major highways and reduce pollution.",
    date: "2023-12-28",
    time: "07:00 AM - 11:00 AM",
    location: "Highway 101, North Entrance",
    category: "waste-cleanup",
    rewards: "80 GreenTokens per bag of trash collected",
    participants: 56,
    image: "https://source.unsplash.com/random/400x200/?nature,highway,cleanup",
  },
];

// Category mapping for icons and colors
const categoryMap = {
  "tree-planting": {
    icon: <Leaf className="h-5 w-5" />,
    color: "bg-green-500",
    label: "Tree Planting",
  },
  "waste-cleanup": {
    icon: <Trash2 className="h-5 w-5" />,
    color: "bg-amber-500",
    label: "Waste Cleanup",
  },
  "water-conservation": {
    icon: <Droplets className="h-5 w-5" />,
    color: "bg-blue-500",
    label: "Water Conservation",
  },
  "renewable-energy": {
    icon: <Sun className="h-5 w-5" />,
    color: "bg-yellow-500",
    label: "Renewable Energy",
  },
};

export default function EventsPage() {
  const [filteredEvents, setFilteredEvents] = useState(events);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Filter events based on category and search query
  useEffect(() => {
    let result = events;

    if (activeFilter !== "all") {
      result = result.filter((event) => event.category === activeFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((event) => event.title.toLowerCase().includes(query) || event.description.toLowerCase().includes(query));
    }

    setFilteredEvents(result);
  }, [activeFilter, searchQuery]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const filterVariants = {
    active: {
      backgroundColor: "#2C2B27",
      color: "#ECEAE3",
      border: "2px solid #ECEAE3",
    },
    inactive: {
      backgroundColor: "transparent",
      color: "#ECEAE3",
      border: "2px solid #8D8566",
    },
  };

  return (
    <div className="min-h-screen bg-beige-950 font-mono">
      {/* Terminal-like header */}
      <header className="border-b-2 border-beige-700 bg-beige-900 p-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-beige-200 text-2xl font-bold tracking-tight">
                <span className="text-green-400">&gt;</span> LUMORA://
                <span className="text-green-400 animate-pulse">_</span>
                <span className="text-beige-300">eco-events</span>
              </h1>
              <p className="text-beige-400 text-sm">
                <span className="text-green-400">SYS:</span> {filteredEvents.length} active missions available
              </p>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-beige-500" />
                <Input type="text" placeholder="Search missions..." className="pl-8 bg-beige-900 border-beige-700 text-beige-200 w-full" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <a href="/dashboard">
                <Button variant="outline" className="border-beige-700 text-beige-200">
                  Dashboard
                </Button>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {/* Grid background effect */}
        <div className="fixed inset-0 z-0 opacity-10">
          <div className="h-full w-full bg-[linear-gradient(to_right,#8d856633_1px,transparent_1px),linear-gradient(to_bottom,#8d856633_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>

        {/* Category filters */}
        <div className="relative z-10 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-beige-400" />
            <h2 className="text-beige-200 font-bold">FILTER BY CATEGORY:</h2>
          </div>

          <div className="flex flex-wrap gap-3">
            <motion.button
              variants={filterVariants}
              animate={activeFilter === "all" ? "active" : "inactive"}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveFilter("all")}
              className="px-4 py-2 rounded-md text-sm font-medium border-2"
            >
              All Missions
            </motion.button>

            {Object.entries(categoryMap).map(([key, { icon, label }]) => (
              <motion.button
                key={key}
                variants={filterVariants}
                animate={activeFilter === key ? "active" : "inactive"}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(key)}
                className="px-4 py-2 rounded-md text-sm font-medium border-2 flex items-center gap-2"
              >
                {icon} {label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <motion.div
              animate={{
                rotate: 360,
                borderRadius: ["20%", "20%", "50%", "50%", "20%"],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="w-16 h-16 border-4 border-t-green-400 border-r-beige-400 border-b-green-400 border-l-beige-400"
            />
            <p className="mt-4 text-beige-300 text-lg">Loading mission data...</p>
            <div className="mt-2 text-green-400 text-sm font-mono">
              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}>
                Connecting to blockchain
              </motion.span>
            </div>
          </div>
        ) : (
          <>
            {/* Events listing */}
            {filteredEvents.length > 0 ? (
              <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" variants={containerVariants} initial="hidden" animate="visible">
                {filteredEvents.map((event) => (
                  <motion.div key={event.id} variants={itemVariants}>
                    <EventCard event={event} categoryMap={categoryMap} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-20 border-2 border-dashed border-beige-700 rounded-lg">
                <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-beige-900 mb-4">
                  <Search className="h-8 w-8 text-beige-400" />
                </div>
                <h3 className="text-xl font-bold text-beige-200 mb-2">No missions found</h3>
                <p className="text-beige-400 max-w-md mx-auto">No eco-missions match your current filters. Try adjusting your search or check back later for new opportunities.</p>
                <Button
                  variant="outline"
                  className="mt-4 border-beige-700 text-beige-200"
                  onClick={() => {
                    setActiveFilter("all");
                    setSearchQuery("");
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer with retro style */}
      <footer className="border-t-2 border-beige-700 bg-beige-900 p-4 mt-8">
        <div className="container mx-auto text-center">
          <p className="text-beige-400 text-sm">
            <span className="text-green-400">SYSTEM:</span> Blockchain status: ONLINE |<span className="text-green-400"> BLOCKS:</span> 1,452,028 |<span className="text-green-400"> VALIDATORS:</span> 128
          </p>
          <p className="text-beige-500 text-xs mt-2">© {new Date().getFullYear()} LUMORA ECO-PROTOCOL v2.4.1</p>
        </div>
      </footer>
    </div>
  );
}
