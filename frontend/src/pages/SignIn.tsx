
import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import UserService from "@/services/UserService";
import { toast } from "sonner";

// Form schema
const signInSchema = z.object({
  email: z
    .string()
    .email({ message: "Email invalide" }),
  password: z
    .string()
    .min(1, { message: "Le mot de passe est requis" }),
});

type SignInFormValues = z.infer<typeof signInSchema>;

const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    // Check if there's a message from redirect (e.g., after signup)
    if (location.state?.message) {
      toast.success(location.state.message);
      // Clear the message so it doesn't show again on refresh
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const onSubmit = async (data: SignInFormValues) => {
    try {
      setIsSubmitting(true);
      
      await UserService.signIn({
        email: data.email,
        password: data.password,
      });
      
      // Redirect to projects page
      navigate("/projects");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex-1 container flex items-center justify-center py-10">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Connexion</h1>
            <p className="text-gray-500">Entrez vos identifiants pour vous connecter</p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Connexion en cours..." : "Se connecter"}
              </Button>
            </form>
          </Form>
          
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Vous n'avez pas de compte?{" "}
              <Link to="/signup" className="text-blue-600 hover:underline">
                S'inscrire
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
