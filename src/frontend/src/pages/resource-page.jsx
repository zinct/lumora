import { BookOpen, LineChart, Wallet } from "lucide-react"
import ResourcesHeader from "@/core/components/resources/resources-header"
import LearnBasics from "@/core/components/resources/learn-basics"
import TrackActions from "@/core/components/resources/track-actions"
import SetupWallet from "@/core/components/resources/setup-wallet"


export default function ResourcePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <ResourcesHeader />

      {/* Simple section navigation */}
      <div className="flex justify-center gap-4 my-8">
        <a
          href="#learn-basics"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
        >
          <BookOpen className="h-4 w-4" />
          <span>Basics</span>
        </a>
        <a
          href="#track-actions"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
        >
          <LineChart className="h-4 w-4" />
          <span>Tracking</span>
        </a>
        <a
          href="#setup-wallet"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
        >
          <Wallet className="h-4 w-4" />
          <span>Wallet</span>
        </a>
      </div>

      {/* Content sections */}
      <div className="space-y-16">
        <section id="learn-basics">
          <LearnBasics />
        </section>
        <section id="track-actions">
          <TrackActions />
        </section>
        <section id="setup-wallet">
          <SetupWallet />
        </section>
      </div>
    </div>
  )
}
