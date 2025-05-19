"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

type User = {
  username: string
  email?: string
  bio?: string
  avatar?: string
  location?: string
  skills: string[]
}

type AuthContextType = {
  user: User | null
  token: string | null
  login: (username: string, password: string) => Promise<void>
  register: (username: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  loading: true,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  useEffect(() => {
    // Check if we have a token in localStorage
    const storedToken = localStorage.getItem("token")
    if (storedToken) {
      setToken(storedToken)
      fetchUserProfile(storedToken)
    } else {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Redirect logic
    if (!loading) {
      const publicRoutes = ["/", "/login", "/register"]
      const isPublicRoute = publicRoutes.includes(pathname)

      if (!token && !isPublicRoute) {
        router.push("/login")
      } else if (token && (pathname === "/login" || pathname === "/register")) {
        router.push("/dashboard")
      }
    }
  }, [token, loading, pathname, router])

  const fetchUserProfile = async (authToken: string) => {
    try {
      const response = await fetch("http://localhost:5000/api/user/me", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        // Token might be invalid or expired
        localStorage.removeItem("token")
        setToken(null)
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error)
      localStorage.removeItem("token")
      setToken(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
        {
          method: "POST",
        },
      )

      if (response.ok) {
        const authToken = await response.text()
        localStorage.setItem("token", authToken)
        setToken(authToken)
        await fetchUserProfile(authToken)
        router.push("/dashboard")
        toast({
          title: "Login successful",
          description: "Welcome back to Craftfolio!",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid username or password",
        })
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "An error occurred during login",
      })
    }
  }

  const register = async (username: string, password: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/register?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
        {
          method: "POST",
        },
      )

      if (response.ok) {
        toast({
          title: "Registration successful",
          description: "Your account has been created. Please log in.",
        })
        router.push("/login")
      } else {
        const errorText = await response.text()
        toast({
          variant: "destructive",
          title: "Registration failed",
          description: errorText || "Username may already be taken",
        })
      }
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "An error occurred during registration",
      })
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    setUser(null)
    router.push("/login")
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>{children}</AuthContext.Provider>
  )
}
