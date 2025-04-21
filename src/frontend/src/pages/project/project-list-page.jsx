import { Search, Leaf } from "lucide-react"

import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/core/components/ui/avatar"
import { Badge } from "@/core/components/ui/badge"
import { Card, CardContent } from "@/core/components/ui/card"


export default function ProjectsPage() {
  return (
    <main className="flex-1">
    {/* Hero Banner */}
    <section className="bg-card py-12 border-b border-border/40">
        <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
            <h1 className="text-3xl font-bold mb-2">Featured Impact Projects</h1>
            <p className="text-muted-foreground">
                Discover and support sustainable initiatives from around the world
            </p>
            </div>
            <div className="flex items-center gap-3">
            <Button className="bg-emerald-600 hover:bg-emerald-700">Start a Project</Button>
            </div>
        </div>
        </div>
    </section>

    {/* Projects Section - Simplified without left sidebar */}
    <section className="py-8">
        <div className="container">
        {/* Mobile Filters */}
        <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search projects..." className="pl-9 pr-4" />
                </div>
            </div>
        </div>

        {/* Projects Grid */}
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                      <img 
                        src={`https://picsum.photos/200/300`} 
                        alt={project.title}
                        className="absolute w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-8 w-8 border-2 border-background -mt-8">
                          <AvatarImage src={`https://picsum.photos/32/32`} alt="Project" />
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
        </div>
        </div>
    </section>
    </main>
  )
}
