import { Search, Menu, Leaf, Wallet, User, Bell } from "lucide-react";
import { Outlet, useNavigate } from "react-router";
import { Button } from "@/core/components/ui/button";
import { useAuth } from "@/core/providers/auth-provider";
import { UserProfileHeader } from "../user-profile";

export default function HomeLayout() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, login } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className={`border-b border-white/10 ${window.location.pathname === "/" ? "fixed" : "sticky"} top-0 right-0 left-0 bg-black/40 backdrop-blur-3xl z-50`}>
        <div className="container flex items-center h-16 justify-between">
          <div className="flex items-center gap-8">
            <a onClick={() => navigate("/")} className="flex items-center gap-2 font-bold text-xl cursor-pointer">
              <Leaf className="h-6 w-6" />
              Lumora
            </a>
          </div>

          <div className="flex items-center gap-4">
            {isLoading ? (
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
            ) : isAuthenticated ? (
              <UserProfileHeader />
            ) : (
              <Button className="hidden md:flex bg-transparent hover:bg-black/30 hover:backdrop-blur-lg" onClick={() => login()}>
                <User className="h-5 w-5 mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      <Outlet />

      <footer className="bg-card border-t border-border/40 py-12">
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
