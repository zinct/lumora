import { Search, Menu, ChevronDown, Wallet, User, Bell, Leaf } from "lucide-react";

import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";

export function ProjectHeader() {
  return (
    <header className="border-b border-border/40 sticky top-0 bg-background z-50">
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
            <a href="/projects" className="text-sm font-medium flex items-center gap-1 text-emerald-500">
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
          <div className="relative hidden md:flex items-center">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search actions, projects, and users" className="pl-10 w-[300px] lg:w-[400px] rounded-full bg-secondary/50 border-none" />
          </div>
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
  );
}
