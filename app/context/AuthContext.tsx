"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import type { UserRole } from "@/lib/auth"
import toast from "react-hot-toast"

/**
 * User interface representing an authenticated user
 */
interface User {
  id: string
  email: string
  role: UserRole | string
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
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => Promise<void>
  refreshUser: () => Promise<User | null>
  error: string | null
  isLoading: boolean
  isInitialized: boolean
}

// Create the auth context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => ({ success: false }),
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
    isLoading: true,
    isInitialized: false,
  })
  const router = useRouter()

  // Improved checkAuth function
  const checkAuth = useCallback(async () => {
    try {
      console.log("Checking auth status...")
      setState((prev) => ({ ...prev, isLoading: true }))

      // Add a timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Auth check timed out")), 5000),
      )

      const fetchPromise = fetch("/api/auth/session", {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      })

      // Race between the fetch and the timeout
      const response = (await Promise.race([fetchPromise, timeoutPromise])) as Response

      if (!response.ok) {
        console.log("Auth check failed with status:", response.status)
        setState((prev) => ({
          ...prev,
          user: null,
          isLoading: false,
          isInitialized: true,
        }))
        return null
      }

      const data = await response.json()
      console.log("Auth check response:", data)

      if (data.user) {
        console.log("User is authenticated:", data.user.email)
        setState((prev) => ({
          ...prev,
          user: data.user,
          isLoading: false,
          isInitialized: true,
        }))
        return data.user
      } else {
        console.log("No user in auth check response")
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

  // Initial auth check on mount
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  // Improved login function
  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      console.log(`Attempting to login user: ${email}`)

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
        body: JSON.stringify({ email, password }),
        cache: "no-store",
      })

      const data = await response.json()
      console.log("Login response:", data)

      if (!response.ok || !data.success) {
        const errorMessage = data.message || "Login failed"
        console.error("Login error:", errorMessage)
        setState((prev) => ({
          ...prev,
          error: errorMessage,
          isLoading: false,
        }))
        toast.error(errorMessage)
        return { success: false, message: errorMessage }
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

      // Only navigate after successful login and state update
      router.push("/dashboard")
      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login failed"
      console.error("Login error:", error)
      setState((prev) => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }))
      toast.error(errorMessage)
      return { success: false, message: errorMessage }
    }
  }

  // Improved logout function
  const logout = useCallback(async () => {
    try {
      console.log("Logging out user...")
      setState((prev) => ({ ...prev, isLoading: true }))

      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error("Logout failed")
      }

      // Clear user state immediately
      setState((prev) => ({
        ...prev,
        user: null,
        error: null,
        isLoading: false,
      }))

      // Clear any localStorage items if used
      if (typeof window !== "undefined") {
        localStorage.removeItem("user")
      }

      toast.success("Logged out successfully")

      // Add a small delay before redirecting
      setTimeout(() => {
        router.push("/login")
        // Force a router refresh
        router.refresh()
      }, 100)
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

