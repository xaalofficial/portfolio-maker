
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import UserService from "@/services/UserService";
import ProjectService from "@/services/ProjectService";
import { toast } from "sonner";
import { Project } from "@/types";

// Form schema
const projectSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Le titre doit contenir au moins 3 caractères" })
    .max(100, { message: "Le titre est trop long" }),
  description: z
    .string()
    .min(10, { message: "La description doit contenir au moins 10 caractères" })
    .max(2000, { message: "La description est trop longue" }),
  githubUrl: z
    .string()
    .url({ message: "L'URL GitHub n'est pas valide" })
    .optional()
    .or(z.literal('')),
  demoUrl: z
    .string()
    .url({ message: "L'URL de démo n'est pas valide" })
    .optional()
    .or(z.literal('')),
  image: z
    .string()
    .url({ message: "L'URL de l'image n'est pas valide" })
    .optional()
    .or(z.literal('')),
  tags: z
    .string()
    .optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

const EditProject = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      githubUrl: "",
      demoUrl: "",
      image: "",
      tags: "",
    },
  });

  useEffect(() => {
    const currentUser = UserService.getCurrentUser();
    if (!currentUser) {
      navigate("/signin", { state: { message: "Veuillez vous connecter pour modifier un projet" } });
      return;
    }
    
    const fetchProject = async () => {
      if (!projectId) return;
      
      try {
        setIsLoading(true);
        const projectData = await ProjectService.getProjectById(projectId);
        
        if (!projectData) {
          toast.error("Projet non trouvé");
          navigate("/projects");
          return;
        }
        
        // Check if the current user is the owner of the project
        if (projectData.userId !== currentUser.id) {
          toast.error("Vous n'êtes pas autorisé à modifier ce projet");
          navigate("/projects");
          return;
        }
        
        setProject(projectData);
        
        // Set form values from project data
        form.setValue("title", projectData.title);
        form.setValue("description", projectData.description);
        form.setValue("githubUrl", projectData.githubUrl || "");
        form.setValue("demoUrl", projectData.demoUrl || "");
        form.setValue("image", projectData.image || "");
        form.setValue("tags", projectData.tags?.join(", ") || "");
      } catch (error) {
        console.error("Error fetching project:", error);
        toast.error("Erreur lors du chargement du projet");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProject();
  }, [projectId, navigate, form]);

  const onSubmit = async (data: ProjectFormValues) => {
    if (!projectId) return;
    
    try {
      setIsSubmitting(true);
      
      // Parse tags from comma-separated string to array
      const tags = data.tags
        ? data.tags.split(",").map(tag => tag.trim()).filter(Boolean)
        : undefined;
      
      await ProjectService.updateProject(projectId, {
        title: data.title,
        description: data.description,
        githubUrl: data.githubUrl || undefined,
        demoUrl: data.demoUrl || undefined,
        image: data.image || undefined,
        tags,
      });
      
      navigate(`/projects`);
    } catch (error) {
      console.error("Project update error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!projectId || !window.confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
      return;
    }
    
    try {
      await ProjectService.deleteProject(projectId);
      navigate("/projects");
    } catch (error) {
      console.error("Project deletion error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="container py-20 flex justify-center">
          <p>Chargement du projet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="container py-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Modifier le projet</h1>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Titre du projet *</FormLabel>
                      <FormControl>
                        <Input placeholder="Mon super projet" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Décrivez votre projet en détail..."
                          className="h-32"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Expliquez ce que fait votre projet, les technologies utilisées, etc.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="githubUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL GitHub</FormLabel>
                        <FormControl>
                          <Input placeholder="https://github.com/username/repo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="demoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL de démo</FormLabel>
                        <FormControl>
                          <Input placeholder="https://demo-site.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL de l'image du projet</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormDescription>
                        URL d'une image représentative de votre projet
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="React, TypeScript, API" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Liste de tags séparés par des virgules
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-between pt-4">
                  <Button 
                    type="button" 
                    variant="destructive" 
                    onClick={handleDelete}
                  >
                    Supprimer
                  </Button>
                  
                  <div className="flex space-x-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => navigate("/projects")}
                    >
                      Annuler
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Sauvegarde en cours..." : "Sauvegarder"}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProject;
