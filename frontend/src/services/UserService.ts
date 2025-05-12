
import { SignUpData, User, UserCredentials, ProfileUpdateData } from "../types";
import { toast } from "sonner";

// Mock user storage as we don't have a backend yet
const USERS_KEY = "app_users";
const CURRENT_USER_KEY = "current_user";

class UserService {
  private getUsers(): User[] {
    const storedUsers = localStorage.getItem(USERS_KEY);
    return storedUsers ? JSON.parse(storedUsers) : [];
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  public getCurrentUser(): User | null {
    const storedUser = localStorage.getItem(CURRENT_USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  }

  private setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }

  public async signUp(userData: SignUpData): Promise<User> {
    try {
      const users = this.getUsers();
      
      // Check if email already exists
      if (users.find(u => u.email === userData.email)) {
        throw new Error("Email already registered");
      }

      // Create new user
      const newUser: User = {
        id: crypto.randomUUID(),
        username: userData.username,
        email: userData.email,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Store user with password (in real app, you'd hash the password)
      users.push({
        ...newUser,
        // @ts-ignore - we're storing the password only for mock purposes
        password: userData.password
      });
      this.saveUsers(users);
      
      // Simulate confirmation email
      toast.success(`Compte créé pour ${userData.email}. Confirmation envoyée par email.`);
      
      return newUser;
    } catch (error) {
      toast.error(`Erreur: ${(error as Error).message}`);
      throw error;
    }
  }

  public async signIn(credentials: UserCredentials): Promise<User> {
    try {
      const users = this.getUsers();
      const user = users.find(
        u => 
          u.email === credentials.email && 
          // @ts-ignore - password check for mock authentication
          u.password === credentials.password
      );

      if (!user) {
        throw new Error("Email ou mot de passe incorrect");
      }

      // Create a clean user object without the password
      const { password, ...cleanUser } = user as User & { password: string };
      this.setCurrentUser(cleanUser);

      toast.success(`Connexion réussie. Bienvenue ${cleanUser.username} !`);
      return cleanUser;
    } catch (error) {
      toast.error(`Erreur: ${(error as Error).message}`);
      throw error;
    }
  }

  public async updateProfile(userId: string, profileData: ProfileUpdateData): Promise<User> {
    try {
      const users = this.getUsers();
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        throw new Error("Utilisateur non trouvé");
      }

      // Update user
      const updatedUser = {
        ...users[userIndex],
        ...profileData,
        updatedAt: new Date()
      };

      users[userIndex] = updatedUser;
      this.saveUsers(users);
      
      // Update current user if it's the logged in user
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        this.setCurrentUser(updatedUser);
      }

      toast.success("Profil mis à jour avec succès");
      return updatedUser;
    } catch (error) {
      toast.error(`Erreur: ${(error as Error).message}`);
      throw error;
    }
  }

  public async signOut(): Promise<void> {
    this.setCurrentUser(null);
    toast.success("Déconnexion réussie");
  }
}

export default new UserService();
