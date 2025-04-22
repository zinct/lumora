import { useState, useEffect } from "react";
import { X, Shield, CheckCircle, AlertCircle, User, Users } from "lucide-react";
import { cn } from "@/core/lib/utils";
import { Button } from "@/core/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/core/components/ui/tabs";
import { Input } from "@/core/components/ui/input";
import { Label } from "@/core/components/ui/label";
import { motion } from "framer-motion";
import { backend } from "declarations/backend";
import { Actor } from "@dfinity/agent";
import { useAuth } from "@/core/providers/auth-provider";

export default function RegistrationModal({ isOpen, onClose, redirectPath = "/" }) {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null); // null, 'success', 'error'
  const [isVisible, setIsVisible] = useState(false);
  const [role, setRole] = useState("participant"); // "participant" or "community"
  const [formData, setFormData] = useState({
    participantName: "",
    communityName: "",
    initialToken: "",
  });
  const { identity } = useAuth();
  // Handle animation states
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 300); // Match this with CSS transition duration
    }
  }, [isOpen]);

  // Reset status when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStatus(null);
        setFormData({
          participantName: "",
          communityName: "",
          initialToken: "",
        });
      }, 300);
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async () => {
    setIsLoading(true);
    setStatus(null);

    // Validate form data
    let isValid = true;
    if (role === "participant" && !formData.participantName.trim()) {
      isValid = false;
    } else if (role === "community" && (!formData.communityName.trim() || !formData.initialToken.trim())) {
      isValid = false;
    }

    if (!isValid) {
      setStatus("error");
      setIsLoading(false);
      return;
    }

    Actor.agentOf(backend).replaceIdentity(identity);
    const registerResponse = await backend.register({
      name: formData.participantName,
      registerAs: role,
    });

    if ("Ok" in registerResponse) {
      setStatus("success");
      setIsLoading(false);
      document.location.replace(redirectPath);
    } else if ("Err" in registerResponse) {
      setStatus("error");
      setIsLoading(false);
    }
  };

  if (!isOpen && !isVisible) return null;

  return (
    <div className={cn("fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0", isVisible ? "visible" : "invisible")}>
      {/* Backdrop with blur effect */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
        style={{
          transition: "backdrop-filter 300ms ease-out, background-color 300ms ease-out",
        }}
      />

      {/* Modal content */}
      <motion.div initial={{ scale: 0.95, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, y: 20, opacity: 0 }} transition={{ duration: 0.3 }} className="relative z-10 w-full max-w-md rounded-lg border bg-card p-6 shadow-lg">
        <div className="absolute right-4 top-4">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <div className="mb-2 flex items-center justify-center">
            <h2 className="text-2xl font-bold">Create Your Lumora Account</h2>
          </div>

          <p className="text-center text-muted-foreground">Join the Lumora ecosystem to track your sustainability efforts, earn rewards, and make a positive impact.</p>

          {/* Role selection tabs */}
          <Tabs defaultValue="participant" className="w-full" onValueChange={setRole}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="participant" className="flex items-center justify-center gap-2">
                <User className="h-4 w-4" />
                <span>Participant</span>
              </TabsTrigger>
              <TabsTrigger value="community" className="flex items-center justify-center gap-2">
                <Users className="h-4 w-4" />
                <span>Community</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="participant" className="mt-4 space-y-4">
              <div className="rounded-lg border border-border/50 bg-emerald-500/5 p-3 text-sm">
                <p className="font-medium text-emerald-600">Participant Access</p>
                <p className="text-muted-foreground">Track eco-actions, earn rewards, and browse NFT collections.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="participantName">Participant Name</Label>
                <Input id="participantName" name="participantName" placeholder="Enter your name" value={formData.participantName} onChange={handleInputChange} required />
              </div>
            </TabsContent>
            <TabsContent value="community" className="mt-4 space-y-4">
              <div className="rounded-lg border border-border/50 bg-blue-500/5 p-3 text-sm">
                <p className="font-medium text-blue-600">Community Access</p>
                <p className="text-muted-foreground">Create projects, manage challenges, and review submissions.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="communityName">Community Name</Label>
                <Input id="communityName" name="communityName" placeholder="Enter community name" value={formData.communityName} onChange={handleInputChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="initialToken">Initial Token</Label>
                <Input id="initialToken" name="initialToken" placeholder="Enter initial token" value={formData.initialToken} onChange={handleInputChange} required />
                <p className="text-xs text-red-500">The initial token is for testing purposes only.</p>
              </div>
            </TabsContent>
          </Tabs>

          {status === "success" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex w-full items-center justify-center rounded-md bg-emerald-500/10 p-3 text-emerald-500">
              <CheckCircle className="mr-2 h-5 w-5" />
              <span>Registration successful! Redirecting...</span>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex w-full items-center justify-center rounded-md bg-red-500/10 p-3 text-red-500">
              <AlertCircle className="mr-2 h-5 w-5" />
              <span>Registration failed. Please check your information and try again.</span>
            </motion.div>
          )}

          <Button className={cn("mt-4 w-full", role === "community" ? "bg-blue-500 hover:bg-blue-600" : "bg-emerald-500 hover:bg-emerald-600")} onClick={handleRegister} disabled={isLoading || status === "success"}>
            {isLoading ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
