
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Project } from "@/types";
import ProjectService from "@/services/ProjectService";
import UserService from "@/services/UserService";
import ProjectCard from "@/components/ProjectCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const allProjects = await ProjectService.getAllProjects();
        setProjects(allProjects);
        setFilteredProjects(allProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    
    const checkLoginStatus = () => {
      const user = UserService.getCurrentUser();
      setIsLoggedIn(!!user);
      setCurrentUserId(user?.id || null);
    };
    
    fetchProjects();
    checkLoginStatus();
  }, []);
  
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(project => 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.tags && project.tags.some(tag => 
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
      setFilteredProjects(filtered);
    }
  }, [searchTerm, projects]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="container py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold">Projets</h1>
            <p className="text-gray-500 mt-1">Découvrez les projets de la communauté</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher des projets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {isLoggedIn && (
              <Button asChild>
                <Link to="/projects/create">Créer un projet</Link>
              </Button>
            )}
          </div>
        </div>
        
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                isOwner={currentUserId === project.userId}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold mb-2">Aucun projet trouvé</h2>
            <p className="text-gray-500 mb-6">
              {searchTerm 
                ? "Aucun projet ne correspond à votre recherche" 
                : "Aucun projet n'a encore été créé"}
            </p>
            {isLoggedIn && (
              <Button asChild>
                <Link to="/projects/create">Créer votre premier projet</Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
