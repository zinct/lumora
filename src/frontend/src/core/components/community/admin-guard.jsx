import { Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/core/components/ui/button";

export function AdminGuard({ onLogin }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 flex items-center justify-center">
        <div className="max-w-md w-full p-6 bg-card rounded-lg border shadow-lg text-center">
          <div className="mb-4 flex justify-center">
            <div className="p-3 rounded-full bg-amber-500/10">
              <AlertTriangle className="h-10 w-10 text-amber-500" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2">Admin Access Required</h1>
          <p className="text-muted-foreground mb-6">
            You need to be logged in as a community administrator to access this
            page.
          </p>
          <Button
            onClick={onLogin}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            <Shield className="mr-2 h-4 w-4" />
            Login as Administrator
          </Button>
        </div>
      </main>
    </div>
  );
}
