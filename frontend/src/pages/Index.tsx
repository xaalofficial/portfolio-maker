
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { Project } from "@/types";
import ProjectService from "@/services/ProjectService";
import ProjectCard from "@/components/ProjectCard";
import UserService from "@/services/UserService";
import { ArrowRight, Code2, PenTool, Users } from "lucide-react";

const Index = () => {
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const fetchRecentProjects = async () => {
      try {
        const allProjects = await ProjectService.getAllProjects();
        setRecentProjects(allProjects.slice(0, 3));
      } catch (error) {
        console.error("Error fetching recent projects:", error);
      }
    };

    const checkLoginStatus = () => {
      const user = UserService.getCurrentUser();
      setIsLoggedIn(!!user);
    };

    fetchRecentProjects();
    checkLoginStatus();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#12071f]">
      <Navbar />
      
      {/* Hero Section with dark theme and image background */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/lovable-uploads/e50f3c7d-5011-467b-b027-cb351034015c.png"
            alt="Background" 
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#12071f]/90 via-[#1E1634]/80 to-[#12071f]"></div>
        </div>
        
        <div className="container relative z-10 px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold tracking-tight mb-6 sm:text-6xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-violet-300 via-purple-400 to-fuchsia-500">
              Créez et partagez vos projets avec la communauté
            </h1>
            <p className="text-xl text-gray-300 mb-8 md:text-2xl leading-relaxed">
              Une plateforme innovante pour les développeurs, designers et créateurs qui souhaitent présenter leurs projets et partager leur expertise.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {isLoggedIn ? (
                <Button asChild size="lg" className="bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 border border-violet-400/20 shadow-lg shadow-purple-900/30">
                  <Link to="/projects/create" className="gap-2">
                    Créer un projet <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <Button asChild size="lg" className="bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 border border-violet-400/20 shadow-lg shadow-purple-900/30">
                  <Link to="/signup" className="gap-2">
                    Commencer maintenant <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              )}
              <Button asChild variant="outline" size="lg" className="border-2 border-violet-500/50 text-violet-300 hover:bg-violet-500/10 shadow-lg shadow-purple-900/10">
                <Link to="/projects">Découvrir les projets</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Abstract glowing orbs */}
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-600 rounded-full filter blur-[100px] opacity-20"></div>
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-purple-700 rounded-full filter blur-[120px] opacity-10"></div>
      </section>
      
      {/* Features Section with glass cards */}
      <section className="py-24 bg-[#12071f] relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-violet-600 rounded-full filter blur-[100px] opacity-10"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-700 rounded-full filter blur-[120px] opacity-10"></div>
        </div>

        <div className="container px-4 mx-auto relative z-10">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-300 via-purple-400 to-fuchsia-500">
              Fonctionnalités principales
            </h2>
            <p className="mt-4 text-gray-400 text-lg">
              Tout ce dont vous avez besoin pour mettre en valeur vos projets
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="group p-8 rounded-2xl backdrop-blur-lg bg-white/5 border border-violet-500/20 transition-all hover:border-violet-500/40 hover:bg-white/10 hover:shadow-lg hover:shadow-purple-900/20 transform hover:-translate-y-1 duration-300">
              <div className="w-12 h-12 mb-4 bg-violet-500/20 text-violet-300 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Code2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-violet-200">Profil développeur</h3>
              <p className="text-gray-400">Créez un profil complet pour mettre en valeur vos compétences et votre expérience.</p>
            </div>
            
            <div className="group p-8 rounded-2xl backdrop-blur-lg bg-white/5 border border-violet-500/20 transition-all hover:border-violet-500/40 hover:bg-white/10 hover:shadow-lg hover:shadow-purple-900/20 transform hover:-translate-y-1 duration-300">
              <div className="w-12 h-12 mb-4 bg-violet-500/20 text-violet-300 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <PenTool className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-violet-200">Vitrine de projets</h3>
              <p className="text-gray-400">Présentez vos projets avec des images, des descriptions et des liens vers GitHub ou des démos.</p>
            </div>
            
            <div className="group p-8 rounded-2xl backdrop-blur-lg bg-white/5 border border-violet-500/20 transition-all hover:border-violet-500/40 hover:bg-white/10 hover:shadow-lg hover:shadow-purple-900/20 transform hover:-translate-y-1 duration-300">
              <div className="w-12 h-12 mb-4 bg-violet-500/20 text-violet-300 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-violet-200">Communauté</h3>
              <p className="text-gray-400">Connectez-vous avec d'autres développeurs et découvrez des projets intéressants.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Projects Section */}
      {recentProjects.length > 0 && (
        <section className="py-24 bg-[#12071f]/80 relative">
          <div className="absolute inset-0 z-0">
            <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-purple-700 rounded-full filter blur-[130px] opacity-10"></div>
          </div>

          <div className="container px-4 mx-auto relative z-10">
            <div className="mb-12 text-center">
              <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-300 via-purple-400 to-fuchsia-500">
                Projets récents
              </h2>
              <p className="mt-4 text-gray-400 text-lg">
                Découvrez les derniers projets ajoutés par la communauté
              </p>
            </div>
            
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {recentProjects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Button asChild variant="outline" size="lg" className="border-2 border-violet-500/50 text-violet-300 hover:bg-violet-500/10 shadow-lg shadow-purple-900/10">
                <Link to="/projects">Voir tous les projets</Link>
              </Button>
            </div>
          </div>
        </section>
      )}
      
      {/* Footer */}
      <footer className="py-12 bg-gradient-to-br from-[#12071f] to-[#1E0E34] text-gray-400 mt-auto relative">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 w-72 h-72 bg-purple-800 rounded-full filter blur-[130px] opacity-10 transform -translate-x-1/2"></div>
        </div>

        <div className="container px-4 mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-300 to-purple-400">ProjetForge</h2>
              <p className="mt-2 text-gray-500">Plateforme pour développeurs</p>
            </div>
            
            <div className="flex space-x-8">
              <Link to="/" className="hover:text-violet-300 transition-colors">Accueil</Link>
              <Link to="/projects" className="hover:text-violet-300 transition-colors">Projets</Link>
              <Link to="/signin" className="hover:text-violet-300 transition-colors">Connexion</Link>
              <Link to="/signup" className="hover:text-violet-300 transition-colors">Inscription</Link>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-violet-500/20 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} ProjetForge. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
