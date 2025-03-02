"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { UserRole } from "@/types/auth"

interface User {
  id: string
  email: string
  role: UserRole
  username?: string
  firstName?: string
  lastName?: string
  status?: string
  monadBalance?: number
  createdAt?: string
  updatedAt?: string
}

interface AuthState {
  user: User | null
  error: string | null
  isLoading: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  error: string | null
  isLoading: boolean
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: async () => {},
  error: null,
  isLoading: false,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    error: null,
    isLoading: false,
  })
  const router = useRouter()

  useEffect(() => {
    // Check for existing session
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }))
      const response = await fetch("/api/auth/session")

      if (!response.ok) {
        // If not authorized, just set user to null without showing an error
        setState((prev) => ({
          ...prev,
          user: null,
          isLoading: false,
        }))
        return
      }

      const data = await response.json()

      if (data.user) {
        setState((prev) => ({
          ...prev,
          user: data.user,
          isLoading: false,
        }))
      } else {
        setState((prev) => ({
          ...prev,
          user: null,
          isLoading: false,
        }))
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      setState((prev) => ({
        ...prev,
        user: null,
        isLoading: false,
      }))
    }
  }

  const login = async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true }))
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }

      setState((prev) => ({
        ...prev,
        user: data.user,
        error: null,
        isLoading: false,
      }))

      router.push("/dashboard")
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Login failed",
        isLoading: false,
      }))
    }
  }

  const logout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Logout failed")
      }

      setState((prev) => ({
        ...prev,
        user: null,
        error: null,
      }))

      router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Logout failed",
      }))
    }
  }

  return (
      <AuthContext.Provider
          value={{
            user: state.user,
            login,
            logout,
            error: state.error,
            isLoading: state.isLoading,
          }}
      >
        {children}
      </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

