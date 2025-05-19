"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth/auth-provider"
import { useToast } from "@/components/ui/use-toast"
import { X, Plus, ArrowLeft, Trash2 } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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

export default function ProjectPage() {
  const { id } = useParams()
  const { token } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [repoLink, setRepoLink] = useState("")
  const [screenshot, setScreenshot] = useState("")
  const [status, setStatus] = useState("PLANNED")
  const [technology, setTechnology] = useState("")
  const [technologies, setTechnologies] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchProject = async () => {
      if (!token || !id) return

      try {
        const response = await fetch(`http://localhost:5000/api/projects/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setProject(data)
          setTitle(data.title)
          setDescription(data.description)
          setRepoLink(data.repoLink || "")
          setScreenshot(data.screenshot || "")
          setStatus(data.status)
          setTechnologies(data.technologies || [])
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load project",
          })
          router.push("/projects")
        }
      } catch (error) {
        console.error("Failed to fetch project:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load project",
        })
        router.push("/projects")
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [token, id, router, toast])

  const addTechnology = () => {
    if (technology && !technologies.includes(technology)) {
      setTechnologies([...technologies, technology])
      setTechnology("")
    }
  }

  const removeTechnology = (tech: string) => {
    setTechnologies(technologies.filter((t) => t !== tech))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token || !id) {
      toast({
        variant: "destructive",
        title: "Authentication error",
        description: "You must be logged in to update a project",
      })
      return
    }

    if (!title || !description) {
      toast({
        variant: "destructive",
        title: "Validation error",
        description: "Title and description are required",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`http://localhost:5000/api/projects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          repoLink,
          technologies,
          screenshot: screenshot || null,
          status,
        }),
      })

      if (response.ok) {
        toast({
          title: "Project updated",
          description: "Your project has been updated successfully",
        })
        router.push("/projects")
      } else {
        const errorText = await response.text()
        toast({
          variant: "destructive",
          title: "Failed to update project",
          description: errorText || "An error occurred",
        })
      }
    } catch (error) {
      console.error("Error updating project:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update project. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!token || !id) return

    setIsDeleting(true)

    try {
      const response = await fetch(`http://localhost:5000/api/projects/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        toast({
          title: "Project deleted",
          description: "Your project has been deleted successfully",
        })
        router.push("/projects")
      } else {
        const errorText = await response.text()
        toast({
          variant: "destructive",
          title: "Failed to delete project",
          description: errorText || "An error occurred",
        })
      }
    } catch (error) {
      console.error("Error deleting project:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete project. Please try again.",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="flex flex-col gap-8 max-w-3xl mx-auto">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/projects">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            {loading ? (
              <Skeleton className="h-9 w-48" />
            ) : (
              <h1 className="text-3xl font-bold tracking-tight">Edit Project</h1>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>Update your project information</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-6">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Project Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter project title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your project"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="repoLink">Repository Link</Label>
                    <Input
                      id="repoLink"
                      placeholder="https://github.com/username/repo"
                      value={repoLink}
                      onChange={(e) => setRepoLink(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="screenshot">Screenshot URL</Label>
                    <Input
                      id="screenshot"
                      placeholder="https://example.com/screenshot.png"
                      value={screenshot}
                      onChange={(e) => setScreenshot(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="PLANNED">Planned</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Technologies</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Add a technology (e.g., React, Spring Boot)"
                        value={technology}
                        onChange={(e) => setTechnology(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addTechnology()
                          }
                        }}
                      />
                      <Button type="button" variant="outline" size="icon" onClick={addTechnology}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {technologies.map((tech, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2.5 py-0.5 rounded-full text-sm"
                        >
                          {tech}
                          <button
                            type="button"
                            onClick={() => removeTechnology(tech)}
                            className="text-secondary-foreground/70 hover:text-secondary-foreground"
                          >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove {tech}</span>
                          </button>
                        </div>
                      ))}
                      {technologies.length === 0 && (
                        <div className="text-sm text-muted-foreground">No technologies added yet</div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between gap-4">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button type="button" variant="destructive" disabled={isDeleting}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          {isDeleting ? "Deleting..." : "Delete Project"}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your project.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <div className="flex gap-4">
                      <Button type="button" variant="outline" onClick={() => router.push("/projects")}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
