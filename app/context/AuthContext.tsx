"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import type { UserRole } from "@/lib/auth" // Import from lib/auth instead of types/auth
import toast from "react-hot-toast"

/**
 * User interface representing an authenticated user
 */
interface User {
  id: string
  email: string
  role: UserRole | string // Allow both enum and string for flexibility
  username?: string
  status?: string
  monadBalance?: number
  createdAt?: string
  updatedAt?: string
}

/**
 * Authentication state interface
 */
interface AuthState {
  user: User | null
  error: string | null
  isLoading: boolean
  isInitialized: boolean
}

/**
 * Authentication context interface
 */
interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  error: string | null
  isLoading: boolean
  isInitialized: boolean
}

// Create the auth context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: async () => {},
  error: null,
  isLoading: false,
  isInitialized: false,
})

/**
 * Authentication provider component
 * Manages authentication state and provides auth functions
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    error: null,
    isLoading: true, // Start with loading true to prevent flash of unauthenticated content
    isInitialized: false,
  })
  const router = useRouter()

  // Check for existing session on mount
  useEffect(() => {
    checkAuth()
  }, [])

  // Add better error handling for auth check
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
          isInitialized: true,
        }))
        return
      }

      const data = await response.json()

      if (data.user) {
        setState((prev) => ({
          ...prev,
          user: data.user,
          isLoading: false,
          isInitialized: true,
        }))
      } else {
        setState((prev) => ({
          ...prev,
          user: null,
          isLoading: false,
          isInitialized: true,
        }))
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      setState((prev) => ({
        ...prev,
        user: null,
        isLoading: false,
        isInitialized: true,
      }))
    }
  }

  /**
   * Logs in a user with email and password
   */
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

      toast.success("Login successful!")
      router.push("/dashboard")
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Login failed",
        isLoading: false,
      }))
      toast.error(error instanceof Error ? error.message : "Login failed")
    }
  }

  /**
   * Logs out the current user
   */
  const logout = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }))
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
        isLoading: false,
      }))

      toast.success("Logged out successfully")
      router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Logout failed",
        isLoading: false,
      }))
      toast.error("Failed to log out")
    }
  }, [router])

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        login,
        logout,
        error: state.error,
        isLoading: state.isLoading,
        isInitialized: state.isInitialized,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Hook to use the auth context
 * @returns The auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

