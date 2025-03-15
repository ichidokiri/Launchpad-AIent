"use client"

import type React from "react"
import { createContext, useState, useEffect, useCallback, useContext } from "react"
import { useRouter } from "next/navigation"
import type { UserRole } from "@/lib/auth"
import { loginUser, logout as logoutAction } from "@/app/actions"

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

  const checkAuth = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }))

      const response = await fetch("/api/auth/session")
      if (!response.ok) {
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

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const login = async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true }))
    try {
      const result = await loginUser(email, password)

      if (!result.success) {
        throw new Error(result.message || "Login failed")
      }

      setState((prev) => ({
        ...prev,
        user: result.user,
        error: null,
        isLoading: false,
      }))

      await checkAuth()
      router.push("/dashboard")
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Login failed",
        isLoading: false,
      }))
    }
  }

  const logout = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }))
      const result = await logoutAction()

      if (!result.success) {
        throw new Error("Logout failed")
      }

      setState((prev) => ({
        ...prev,
        user: null,
        error: null,
        isLoading: false,
      }))

      router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Logout failed",
        isLoading: false,
      }))
    }
  }, [router])

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

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

