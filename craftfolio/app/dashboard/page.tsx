"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Briefcase, User, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/layout/header"
import { useAuth } from "@/components/auth/auth-provider"
import { Skeleton } from "@/components/ui/skeleton"

type Project = {
  id: number
  title: string
  description: string
  repoLink: string
  technologies: string[]
  screenshot: string | null
  status: string
}

export default function DashboardPage() {
  const { user, token } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      if (!token) return

      try {
        const response = await fetch("http://localhost:5000/api/projects", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setProjects(data)
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [token])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {user?.username || "User"}!</p>
            </div>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/projects/new">
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Projects</CardTitle>
                <CardDescription>Your portfolio projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {loading ? <Skeleton className="h-9 w-16" /> : projects.length}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" asChild className="w-full">
                  <Link href="/projects">
                    <Briefcase className="mr-2 h-4 w-4" />
                    View All Projects
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Profile Completion</CardTitle>
                <CardDescription>Complete your profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {loading ? (
                    <Skeleton className="h-9 w-16" />
                  ) : (
                    `${user?.bio && user?.email && user?.location ? "100" : "75"}%`
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" asChild className="w-full">
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Portfolio Status</CardTitle>
                <CardDescription>Your public portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{loading ? <Skeleton className="h-9 w-16" /> : "Active"}</div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" asChild className="w-full">
                  <Link href="#">
                    <Sparkles className="mr-2 h-4 w-4" />
                    View Portfolio
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-4">Recent Projects</h2>
            {loading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-5 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-24 w-full mb-2" />
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : projects.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {projects.slice(0, 3).map((project) => (
                  <Link href={`/projects/${project.id}`} key={project.id} className="block">
                    <Card className="h-full transition-all hover:border-primary/50">
                      <CardHeader>
                        <CardTitle>{project.title}</CardTitle>
                        <CardDescription className="line-clamp-1">{project.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="aspect-video rounded-md bg-muted/50 flex items-center justify-center mb-2">
                          {project.screenshot ? (
                            <img
                              src={project.screenshot || "/placeholder.svg"}
                              alt={project.title}
                              className="rounded-md object-cover w-full h-full"
                            />
                          ) : (
                            <Briefcase className="h-10 w-10 text-muted-foreground/50" />
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {project.technologies.slice(0, 3).map((tech, i) => (
                            <div
                              key={i}
                              className="bg-secondary text-secondary-foreground px-2.5 py-0.5 rounded-full text-xs"
                            >
                              {tech}
                            </div>
                          ))}
                          {project.technologies.length > 3 && (
                            <div className="bg-secondary text-secondary-foreground px-2.5 py-0.5 rounded-full text-xs">
                              +{project.technologies.length - 3}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No projects yet</CardTitle>
                  <CardDescription>Create your first project to showcase in your portfolio</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="bg-primary hover:bg-primary/90">
                    <Link href="/projects/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Project
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {projects.length > 3 && (
              <div className="mt-4 text-center">
                <Button variant="outline" asChild>
                  <Link href="/projects">View All Projects</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
