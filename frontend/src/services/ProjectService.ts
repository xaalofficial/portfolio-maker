
import { Project, ProjectFormData } from "../types";
import { toast } from "sonner";

// Mock project storage
const PROJECTS_KEY = "app_projects";

class ProjectService {
  private getProjects(): Project[] {
    const storedProjects = localStorage.getItem(PROJECTS_KEY);
    return storedProjects ? JSON.parse(storedProjects) : [];
  }

  private saveProjects(projects: Project[]): void {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  }

  public async createProject(userId: string, projectData: ProjectFormData): Promise<Project> {
    try {
      const projects = this.getProjects();
      
      const newProject: Project = {
        id: crypto.randomUUID(),
        userId,
        title: projectData.title,
        description: projectData.description,
        githubUrl: projectData.githubUrl,
        demoUrl: projectData.demoUrl,
        image: projectData.image,
        tags: projectData.tags,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      projects.push(newProject);
      this.saveProjects(projects);
      
      toast.success("Projet créé avec succès");
      return newProject;
    } catch (error) {
      toast.error(`Erreur: ${(error as Error).message}`);
      throw error;
    }
  }

  public async getAllProjects(): Promise<Project[]> {
    return this.getProjects();
  }

  public async getUserProjects(userId: string): Promise<Project[]> {
    const projects = this.getProjects();
    return projects.filter(p => p.userId === userId);
  }

  public async getProjectById(projectId: string): Promise<Project | null> {
    const projects = this.getProjects();
    const project = projects.find(p => p.id === projectId);
    return project || null;
  }

  public async updateProject(projectId: string, projectData: ProjectFormData): Promise<Project> {
    try {
      const projects = this.getProjects();
      const projectIndex = projects.findIndex(p => p.id === projectId);
      
      if (projectIndex === -1) {
        throw new Error("Projet non trouvé");
      }

      // Update project
      const updatedProject = {
        ...projects[projectIndex],
        ...projectData,
        updatedAt: new Date()
      };

      projects[projectIndex] = updatedProject;
      this.saveProjects(projects);
      
      toast.success("Projet mis à jour avec succès");
      return updatedProject;
    } catch (error) {
      toast.error(`Erreur: ${(error as Error).message}`);
      throw error;
    }
  }

  public async deleteProject(projectId: string): Promise<void> {
    try {
      const projects = this.getProjects();
      const filteredProjects = projects.filter(p => p.id !== projectId);
      
      if (filteredProjects.length === projects.length) {
        throw new Error("Projet non trouvé");
      }
      
      this.saveProjects(filteredProjects);
      toast.success("Projet supprimé avec succès");
    } catch (error) {
      toast.error(`Erreur: ${(error as Error).message}`);
      throw error;
    }
  }
}

export default new ProjectService();
