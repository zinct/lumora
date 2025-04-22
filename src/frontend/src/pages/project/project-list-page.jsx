import { Search, Leaf, Clock } from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router";

import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/core/components/ui/avatar";
import { Badge } from "@/core/components/ui/badge";
import { Card, CardContent } from "@/core/components/ui/card";
import { EmptyState } from "@/core/components/ui/empty-state";

// Import the backend canister
import { backend } from "declarations/backend";

// Debounce function
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Project Card Component
const ProjectCard = ({ project, onClick }) => {
  const avatarUrl = useMemo(() => `https://api.dicebear.com/7.x/identicon/svg?seed=${project.title}&backgroundColor=c7d2fe&shape1Color=4f46e5`, [project.title]);

  const coverImageUrl = useMemo(() => `https://api.dicebear.com/7.x/shapes/svg?seed=${project.title}&backgroundColor=c7d2fe,ddd6fe,fae8ff,dbeafe,bfdbfe,e0e7ff&shape1Color=4f46e5,6d28d9,7c3aed,2563eb,3b82f6,4f46e5`, [project.title]);

  return (
    <Card className="overflow-hidden bg-card border-border/40 cursor-pointer hover:border-border/60 transition-colors" onClick={onClick}>
      <div className="relative aspect-square">
        {project.image ? (
          <img
            src={URL.createObjectURL(
              new Blob([project.image[0]], {
                type: "image/png",
              })
            )}
            alt={project.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = coverImageUrl;
            }}
          />
        ) : (
          <img src={coverImageUrl} alt={project.title} className="w-full h-full object-cover bg-gray-100" />
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-8 w-8 border-2 border-background -mt-8">
            <AvatarImage src={avatarUrl} alt={project.title} />
            <AvatarFallback>{project.title.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="font-medium">{project.title}</div>
          {project.status === 1 ? (
            <Badge variant="secondary" className="ml-auto bg-emerald-500/20 text-emerald-400">
              <Leaf className="h-3 w-3 mr-1" />
              Active
            </Badge>
          ) : (
            <Badge variant="secondary" className="ml-auto bg-gray-500/20 text-gray-400">
              <Clock className="h-3 w-3 mr-1" />
              Inactive
            </Badge>
          )}
        </div>
        <div className="flex justify-between text-sm">
          <div>
            <p className="text-muted-foreground">Participants</p>
            <p className="font-medium">
              {project.participants.length}/{project.maxParticipants}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Reward</p>
            <p className="font-medium">{project.reward} LUM</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProjects, setFilteredProjects] = useState([]);

  // Fetch projects from backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const result = await backend.getProjects();
        if ("Ok" in result) {
          setProjects(result.Ok);
          setFilteredProjects(result.Ok); // Initialize filtered projects
        } else {
          setError(result.Err);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query) => {
      const filtered = projects.filter((project) => project.title.toLowerCase().includes(query.toLowerCase()) || project.description.toLowerCase().includes(query.toLowerCase()));
      setFilteredProjects(filtered);
    }, 500),
    [projects]
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  return (
    <main className="flex-1">
      {/* Hero Banner */}
      <section className="bg-card py-12 border-b border-border/40">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Featured Impact Projects</h1>
              <p className="text-muted-foreground">Discover and support sustainable initiatives from around the world</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => navigate("/community?tab=community")}>
                Start a Project
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-8">
        <div className="container">
          {/* Search and Filters */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search projects..." className="pl-9 pr-4" value={searchQuery} onChange={handleSearchChange} />
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          <div>
            {loading ? (
              <div className="text-center py-8">Loading projects...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">Error: {error}</div>
            ) : filteredProjects.length === 0 ? (
              <EmptyState variant="projects" title="No projects found" description={searchQuery ? "No projects match your search criteria." : "No projects to display at the moment."} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} onClick={() => navigate(`/projects/${project.id}`)} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
