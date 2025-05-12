
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { User } from "@/types";
import UserService from "@/services/UserService";
import ProjectService from "@/services/ProjectService";
import ProjectCard from "@/components/ProjectCard";
import { Project } from "@/types";
import { toast } from "sonner";

// Form schema
const profileSchema = z.object({
  bio: z.string().max(500, { message: "La bio ne peut pas dépasser 500 caractères" }).optional(),
  location: z.string().max(100, { message: "La localité est trop longue" }).optional(),
  avatar: z.string().url({ message: "L'URL de l'avatar n'est pas valide" }).optional().or(z.literal('')),
  skills: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Profile = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const navigate = useNavigate();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      bio: "",
      location: "",
      avatar: "",
      skills: "",
    },
  });

  useEffect(() => {
    const currentUser = UserService.getCurrentUser();
    if (!currentUser) {
      navigate("/signin", { state: { message: "Veuillez vous connecter pour accéder à votre profil" } });
      return;
    }

    setUser(currentUser);
    
    // Set form values from user data
    form.setValue("bio", currentUser.bio || "");
    form.setValue("location", currentUser.location || "");
    form.setValue("avatar", currentUser.avatar || "");
    form.setValue("skills", currentUser.skills?.join(", ") || "");
    
    // Fetch user projects
    const fetchUserProjects = async () => {
      try {
        if (currentUser.id) {
          const projects = await ProjectService.getUserProjects(currentUser.id);
          setUserProjects(projects);
        }
      } catch (error) {
        console.error("Error fetching user projects:", error);
      }
    };
    
    fetchUserProjects();
  }, [navigate, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;
    
    try {
      setIsSubmitting(true);
      
      // Parse skills from comma-separated string to array
      const skills = data.skills
        ? data.skills.split(",").map(skill => skill.trim()).filter(Boolean)
        : undefined;
      
      const updatedUser = await UserService.updateProfile(user.id, {
        bio: data.bio,
        location: data.location,
        avatar: data.avatar || undefined,
        skills,
      });
      
      setUser(updatedUser);
    } catch (error) {
      console.error("Profile update error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="container py-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-10">Profil utilisateur</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Profile sidebar */}
            <div className="md:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-sm border flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-4">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user?.username} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-500">
                      <span className="text-2xl font-bold">{user?.username?.charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                </div>
                
                <h2 className="text-xl font-bold mb-1">{user?.username}</h2>
                <p className="text-gray-500 mb-3">{user?.email}</p>
                
                {user?.location && (
                  <p className="text-sm text-gray-600 mb-3">
                    📍 {user.location}
                  </p>
                )}
                
                {user?.skills && user.skills.length > 0 && (
                  <div className="mt-4 w-full">
                    <h3 className="text-sm font-semibold mb-2">Compétences</h3>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {user.skills.map((skill, index) => (
                        <span 
                          key={index} 
                          className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {user?.bio && (
                  <div className="mt-4 w-full">
                    <h3 className="text-sm font-semibold mb-2">Bio</h3>
                    <p className="text-sm text-gray-600">{user.bio}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Profile form */}
            <div className="md:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-sm border mb-10">
                <h2 className="text-xl font-bold mb-6">Modifier votre profil</h2>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="avatar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL de l'avatar</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/avatar.jpg" {...field} />
                          </FormControl>
                          <FormDescription>
                            Entrez l'URL d'une image pour votre avatar
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Biographie</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Parlez-nous de vous..."
                              className="h-32"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Une courte description de vous-même
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Localité</FormLabel>
                          <FormControl>
                            <Input placeholder="Paris, France" {...field} />
                          </FormControl>
                          <FormDescription>
                            Votre ville ou pays
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="skills"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Compétences</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="React, TypeScript, Node.js" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Liste de compétences séparées par des virgules
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
                    </Button>
                  </form>
                </Form>
              </div>
              
              {/* User projects section */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Vos projets</h2>
                  <Button asChild variant="outline">
                    <a href="/projects/create">Créer un projet</a>
                  </Button>
                </div>
                
                {userProjects.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {userProjects.map(project => (
                      <ProjectCard key={project.id} project={project} isOwner={true} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 mb-4">Vous n'avez pas encore de projets</p>
                    <Button asChild>
                      <a href="/projects/create">Créer votre premier projet</a>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
