"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Briefcase, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/layout/header"
import { useAuth } from "@/components/auth/auth-provider"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Project = {
  id: number
  title: string
  description: string
  repoLink: string
  technologies: string[]
  screenshot: string | null
  status: string
}

export default function ProjectsPage() {
  const { token } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [allTechnologies, setAllTechnologies] = useState<string[]>([])
  const [selectedTech, setSelectedTech] = useState<string[]>([])

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

          // Extract all unique technologies
          const techs = new Set<string>()
          data.forEach((project: Project) => {
            project.technologies.forEach((tech) => techs.add(tech))
          })
          setAllTechnologies(Array.from(techs))
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [token])

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = !statusFilter || project.status === statusFilter

    const matchesTech = selectedTech.length === 0 || selectedTech.every((tech) => project.technologies.includes(tech))

    return matchesSearch && matchesStatus && matchesTech
  })

  const toggleTechFilter = (tech: string) => {
    if (selectedTech.includes(tech)) {
      setSelectedTech(selectedTech.filter((t) => t !== tech))
    } else {
      setSelectedTech([...selectedTech, tech])
    }
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter(null)
    setSelectedTech([])
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
              <p className="text-muted-foreground">Manage and showcase your portfolio projects</p>
            </div>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/projects/new">
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Link>
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter || ""} onValueChange={(value) => setStatusFilter(value || null)}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="PLANNED">Planned</SelectItem>
              </SelectContent>
            </Select>
            {(searchTerm || statusFilter || selectedTech.length > 0) && (
              <Button variant="ghost" onClick={clearFilters} className="h-10 px-3">
                <X className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </div>

          {selectedTech.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedTech.map((tech) => (
                <Badge key={tech} variant="secondary" className="cursor-pointer" onClick={() => toggleTechFilter(tech)}>
                  {tech}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              [...Array(6)].map((_, i) => (
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
              ))
            ) : filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <Link href={`/projects/${project.id}`} key={project.id} className="block">
                  <Card className="h-full transition-all hover:border-primary/50">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="line-clamp-1">{project.title}</CardTitle>
                        <Badge
                          variant={
                            project.status === "COMPLETED"
                              ? "default"
                              : project.status === "IN_PROGRESS"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {project.status.replace("_", " ")}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2">{project.description}</CardDescription>
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
                        {project.technologies.map((tech, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className={`cursor-pointer ${selectedTech.includes(tech) ? "bg-primary/10 border-primary/50" : ""}`}
                            onClick={(e) => {
                              e.preventDefault()
                              toggleTechFilter(tech)
                            }}
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="col-span-full">
                <Card>
                  <CardHeader>
                    <CardTitle>No projects found</CardTitle>
                    <CardDescription>
                      {searchTerm || statusFilter || selectedTech.length > 0
                        ? "Try adjusting your filters or create a new project"
                        : "Create your first project to showcase in your portfolio"}
                    </CardDescription>
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
              </div>
            )}
          </div>

          {!loading && allTechnologies.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-2">Filter by Technology</h2>
              <div className="flex flex-wrap gap-2">
                {allTechnologies.map((tech) => (
                  <Badge
                    key={tech}
                    variant={selectedTech.includes(tech) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleTechFilter(tech)}
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
