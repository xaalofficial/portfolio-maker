
export interface User {
  id: string;
  username: string;
  email: string;
  bio?: string;
  avatar?: string;
  location?: string;
  skills?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  githubUrl?: string;
  demoUrl?: string;
  image?: string;
  tags?: string[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface SignUpData extends UserCredentials {
  username: string;
}

export interface ProfileUpdateData {
  bio?: string;
  avatar?: string;
  location?: string;
  skills?: string[];
}

export interface ProjectFormData {
  title: string;
  description: string;
  githubUrl?: string;
  demoUrl?: string;
  image?: string;
  tags?: string[];
}
