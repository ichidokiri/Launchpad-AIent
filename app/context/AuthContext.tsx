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
  refreshUser: () => Promise<User | null>
  error: string | null
  isLoading: boolean
  isInitialized: boolean
}

// Create the auth context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: async () => {},
  refreshUser: async () => null,
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

  // Update the checkAuth function to be more robust and add it to the dependency array of useEffect
  // Also add a refreshUser function that can be called after login

  // Replace the checkAuth function with this improved version:
  const checkAuth = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }))

      // Add a timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Auth check timed out")), 5000),
      )

      const fetchPromise = fetch("/api/auth/session")

      // Race between the fetch and the timeout
      const response = (await Promise.race([fetchPromise, timeoutPromise])) as Response

      if (!response.ok) {
        // If not authorized, just set user to null without showing an error
        setState((prev) => ({
          ...prev,
          user: null,
          isLoading: false,
          isInitialized: true,
        }))
        return null
      }

      const data = await response.json()

      if (data.user) {
        setState((prev) => ({
          ...prev,
          user: data.user,
          isLoading: false,
          isInitialized: true,
        }))
        return data.user
      } else {
        setState((prev) => ({
          ...prev,
          user: null,
          isLoading: false,
          isInitialized: true,
        }))
        return null
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      setState((prev) => ({
        ...prev,
        user: null,
        isLoading: false,
        isInitialized: true,
      }))
      return null
    }
  }, [])

  // Check for existing session on mount
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  // Update the login function to properly update state and navigate
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

      // Update state with user data
      setState((prev) => ({
        ...prev,
        user: data.user,
        error: null,
        isLoading: false,
      }))

      toast.success("Login successful!")

      // Force a refresh of the auth state after login
      await checkAuth()

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

  // Add refreshUser function to the context
  const refreshUser = useCallback(async () => {
    return await checkAuth()
  }, [checkAuth])

  // Update the AuthContext.Provider value to include refreshUser
  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        login,
        logout,
        refreshUser,
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

