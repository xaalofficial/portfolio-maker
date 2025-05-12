
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User } from "@/types";
import UserService from "@/services/UserService";
import { toast } from "sonner";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const currentUser = UserService.getCurrentUser();
    setUser(currentUser);
  }, [location.pathname]);

  const handleSignOut = async () => {
    try {
      await UserService.signOut();
      setUser(null);
      navigate("/");
    } catch (error) {
      toast.error("Erreur lors de la déconnexion");
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-violet-500/20 bg-[#12071f]/80 backdrop-blur-lg supports-[backdrop-filter]:bg-[#12071f]/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <div className="flex">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-violet-300 to-purple-400">ProjetForge</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              to="/projects"
              className="transition-colors hover:text-violet-300 text-gray-300"
            >
              Projets
            </Link>
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="transition-colors hover:text-violet-300 text-gray-300"
                >
                  Profil
                </Link>
                <Button onClick={handleSignOut} variant="ghost" size="sm" className="text-gray-300 hover:text-violet-300 hover:bg-violet-500/10">
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Link to="/signin">
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-violet-300 hover:bg-violet-500/10">
                    Connexion
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 border border-violet-400/20">
                    Inscription
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <Button 
            onClick={toggleMobileMenu} 
            variant="ghost" 
            size="sm" 
            className="text-gray-300 hover:bg-violet-500/10"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-[#12071f]/95 backdrop-blur-md pt-16 animate-fade-in">
          <div className="container px-4 py-8 flex flex-col space-y-6 text-center">
            <Link 
              to="/projects" 
              className="text-lg font-medium py-2 text-gray-300 hover:text-violet-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Projets
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/profile" 
                  className="text-lg font-medium py-2 text-gray-300 hover:text-violet-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profil
                </Link>
                <Button 
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }} 
                  variant="ghost" 
                  className="text-lg font-medium py-2 text-gray-300 hover:text-violet-300"
                >
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Link 
                  to="/signin" 
                  className="text-lg font-medium py-2 text-gray-300 hover:text-violet-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Connexion
                </Link>
                <Link 
                  to="/signup" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button 
                    className="w-full bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 border border-violet-400/20 mt-4"
                  >
                    Inscription
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
