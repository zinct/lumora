import { useRef } from "react";
import { Button } from "@/core/components/ui/button";
import { ArrowRight, ChevronDown } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router";
export default function HomePage() {
  // Refs for scroll animations
  const heroRef = useRef(null);
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-beige-950">
      {/* Hero Section with Immersive Animation */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div className="absolute inset-0 z-0" style={{ scale: heroScale }}>
          <div className="absolute inset-0 bg-black/40 z-10"></div>
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
        </motion.div>

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

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.8 }} className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { label: "COMMUNITY", value: "10K+" },
              { label: "ECO ACTIONS", value: "45K+" },
              { label: "TOKENS", value: "2.5M+" },
              { label: "CO₂ OFFSET", value: "500T+" },
            ].map((stat, index) => (
              <motion.div key={index} animate={floatingAnimation} custom={index} className="px-4 py-3 bg-beige-900/50 backdrop-blur-sm rounded-lg border border-beige-700/50">
                <p className="text-beige-200 font-mono text-sm">{stat.label}</p>
                <p className="text-white text-xl font-bold">{stat.value}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }} className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 text-beige-200">
          <ChevronDown className="h-8 w-8 animate-bounce" />
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-beige-950 to-transparent z-10"></div>
      </section>

      {/* About Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Decentralized <span className="text-beige-200">Eco-Rewards</span> Platform
            </h2>
            <p className="text-beige-100 text-lg">
              Lumora is a revolutionary platform that connects real-world environmental actions with digital rewards. Our community-driven ecosystem incentivizes sustainable behaviors through transparent, blockchain-verified achievements.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-beige-950 border-t border-beige-800/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold text-white">
                <span className="text-beige-200">LUMORA</span>
              </h2>
              <p className="text-beige-200 text-sm">Decentralized Eco-Rewards Platform</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-beige-200 hover:text-white transition-colors">
                Twitter
              </a>
              <a href="#" className="text-beige-200 hover:text-white transition-colors">
                Discord
              </a>
              <a href="#" className="text-beige-200 hover:text-white transition-colors">
                GitHub
              </a>
              <a href="#" className="text-beige-200 hover:text-white transition-colors">
                Documentation
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-beige-800/30 text-center">
            <p className="text-beige-200/70 text-sm">© {new Date().getFullYear()} Lumora. Built on Internet Computer Protocol.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
