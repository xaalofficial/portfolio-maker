
import { Link } from "react-router-dom";
import { Project } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, ExternalLink, Github } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProjectCardProps {
  project: Project;
  isOwner?: boolean;
}

export default function ProjectCard({ project, isOwner = false }: ProjectCardProps) {
  return (
    <Card className="project-card overflow-hidden border border-violet-500/20 bg-black/30 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-900/20 transition-all hover:-translate-y-1">
      {project.image ? (
        <div className="h-48 bg-secondary overflow-hidden">
          <img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-violet-900/30 to-purple-700/20 flex items-center justify-center">
          <span className="text-violet-300/50">Pas d'image</span>
        </div>
      )}
      
      <CardHeader className="p-4">
        <CardTitle className="line-clamp-1 text-violet-200">{project.title}</CardTitle>
        <CardDescription className="line-clamp-2 text-gray-400">{project.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs bg-violet-500/10 text-violet-300 hover:bg-violet-500/20">{tag}</Badge>
            ))}
          </div>
        )}
        
        <div className="flex flex-col space-y-2">
          {project.githubUrl && (
            <a 
              href={project.githubUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1 truncate group"
            >
              <Github className="h-4 w-4 opacity-70 group-hover:opacity-100" />
              <span className="group-hover:underline">GitHub Repository</span>
            </a>
          )}
          
          {project.demoUrl && (
            <a 
              href={project.demoUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1 truncate group"
            >
              <ExternalLink className="h-4 w-4 opacity-70 group-hover:opacity-100" />
              <span className="group-hover:underline">Demo Live</span>
            </a>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button asChild variant="outline" size="sm" className="border-violet-500/40 hover:border-violet-400/60 text-violet-300 hover:bg-violet-500/10">
          <Link to={`/projects/${project.id}`}>
            Voir détails
          </Link>
        </Button>
        
        {isOwner && (
          <Button asChild variant="ghost" size="sm" className="hover:bg-violet-500/10 text-violet-300">
            <Link to={`/projects/${project.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
