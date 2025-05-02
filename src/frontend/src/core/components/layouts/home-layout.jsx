import { Menu, Leaf, Wallet, User, X, ChevronDown, Zap, Droplets, Recycle, TreePine, Sparkles } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/core/components/ui/sheet";
import { Outlet, useNavigate } from "react-router";
import { Button } from "@/core/components/ui/button";
import { useAuth } from "@/core/providers/auth-provider";
import { UserProfileHeader } from "../user-profile";
import { useState } from "react";
import { convertE8sToToken } from "@/core/lib/canisterUtils";
export default function HomeLayout() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, login, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className={`min-h-screen flex flex-col ${window.location.pathname === "/assistant" ? "bg-black" : ""}`}>
      <header className={`border-b border-white/10 ${window.location.pathname === "/" ? "fixed" : "sticky"} top-0 right-0 left-0 bg-black/40 backdrop-blur-3xl z-50`}>
        <div className="container flex items-center h-16 justify-between">
          <div className="flex items-center gap-8">
            <a onClick={() => navigate("/")} className="flex items-center gap-2 font-bold text-xl cursor-pointer">
              <Leaf className="h-6 w-6" />
              Lumora
            </a>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="text-sm text-white/90 font-medium flex items-center justify-center">
                Community
              </a>
              <a href="#" className="text-sm text-white/90 font-medium flex items-center justify-center">
                Resources
              </a>
              <a href="#" className="text-sm text-white/90 font-medium flex items-center justify-center">
                NFTs
              </a>
              <a href="#" className="text-sm text-white/90 font-medium flex items-center justify-center">
                White Paper
              </a>
              <a href="#" onClick={() => navigate("/assistant")} className="text-sm font-medium flex items-center justify-center gap-1">
                <Sparkles className="h-4 w-4 text-emerald-400 mr-1" />
                Assistant
              </a>
            </nav>
          </div>

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden relative z-50" onClick={handleMobileMenuToggle}>
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85%] sm:w-[350px] p-0">
              <div className="flex flex-col h-full">
                {/* Mobile Menu Header */}
                <div className="border-b border-border/40 p-4 flex items-center justify-between">
                  <a href="/" className="flex items-center gap-2 font-bold text-xl">
                    <Leaf className="h-6 w-6 text-emerald-500" />
                    Lumora
                  </a>
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* LUM Balance - Mobile */}
                <div className="border-b border-border/40 p-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                    <Wallet className="h-6 w-6 text-emerald-500" />
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">LUM Balance</span>
                      <span className="text-base font-medium">125,000</span>
                    </div>
                  </div>
                </div>

                {/* Mobile Navigation as */}
                <div className="flex-1 overflow-auto py-4">
                  <nav className="flex flex-col px-4 gap-1">
                    <div className="py-2 border-b border-border/40">
                      <div className="font-medium mb-2 text-muted-foreground text-sm">Navigation</div>
                      <div className="space-y-3">
                        <a href="#" className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-secondary/50" onClick={() => setIsMobileMenuOpen(false)}>
                          <span className="font-medium">Actions</span>
                          <ChevronDown className="h-4 w-4" />
                        </a>
                        <a href="#" className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-secondary/50" onClick={() => setIsMobileMenuOpen(false)}>
                          <span className="font-medium">Impact</span>
                          <ChevronDown className="h-4 w-4" />
                        </a>
                        <a href="#" className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-secondary/50" onClick={() => setIsMobileMenuOpen(false)}>
                          <span className="font-medium">Community</span>
                          <ChevronDown className="h-4 w-4" />
                        </a>
                        <a href="#" className="flex items-center py-2 px-3 rounded-md hover:bg-secondary/50" onClick={() => setIsMobileMenuOpen(false)}>
                          <span className="font-medium">Learn</span>
                        </a>
                      </div>
                    </div>

                    <div className="py-2 border-b border-border/40">
                      <div className="font-medium mb-2 text-muted-foreground text-sm">Categories</div>
                      <div className="space-y-3">
                        <a href="#" className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-secondary/50" onClick={() => setIsMobileMenuOpen(false)}>
                          <Zap className="h-5 w-5 text-yellow-400" />
                          <span>Energy</span>
                        </a>
                        <a href="#" className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-secondary/50" onClick={() => setIsMobileMenuOpen(false)}>
                          <Droplets className="h-5 w-5 text-blue-400" />
                          <span>Water</span>
                        </a>
                        <a href="#" className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-secondary/50" onClick={() => setIsMobileMenuOpen(false)}>
                          <Recycle className="h-5 w-5 text-emerald-400" />
                          <span>Waste</span>
                        </a>
                        <a href="#" className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-secondary/50" onClick={() => setIsMobileMenuOpen(false)}>
                          <TreePine className="h-5 w-5 text-emerald-500" />
                          <span>Forestry</span>
                        </a>
                      </div>
                    </div>
                  </nav>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-4">
            <Button
              className="hidden md:flex bg-transparent hover:bg-black/30 hover:backdrop-blur-lg"
              onClick={() => {
                if (!isAuthenticated) {
                  return;
                }

                if (user.role === "community") {
                  navigate("/community?tab=balance");
                } else {
                  navigate("/balance");
                }
              }}>
              <span className="text-sm font-medium h-5">{isAuthenticated ? convertE8sToToken(user?.balance) : 0} LUM</span>
            </Button>
            {isLoading ? (
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
            ) : isAuthenticated ? (
              <UserProfileHeader />
            ) : (
              <Button className="hidden md:flex bg-black/20 hover:bg-black/30 hover:backdrop-blur-lg" onClick={() => login()}>
                <User className="h-5 w-5 mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      <Outlet />

      <footer className={`${window.location.pathname === "/assistant" ? "bg-black" : "bg-card"} border-t border-border/40 py-12`}>
        <div className="container">
          <div className="flex flex-col items-center justify-center">
            <a href="/" className="flex items-center gap-2 font-bold text-left text-xl mb-4">
              <Leaf className="h-6 w-6 text-emerald-500" />
              Lumora
            </a>
            <p className="text-muted-foreground mb-6 text-left max-w-lg">A decentralized, community-driven platform that incentivizes real-world eco-friendly actions through token rewards on the Internet Computer Protocol.</p>
            <div className="text-center text-muted-foreground">
              <p>© {new Date().getFullYear()} Lumora. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
