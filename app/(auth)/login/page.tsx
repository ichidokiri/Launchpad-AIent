"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { loginUser } from "@/app/actions"
import Link from "next/link"
import toast from "react-hot-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

/**
 * Login page component
 * Allows users to log in to the application
 */
export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Check for expired token or auth error
  useEffect(() => {
    const expired = searchParams.get("expired")
    const authError = searchParams.get("error")

    if (expired === "true") {
      toast.error("Your session has expired. Please log in again.")
    } else if (authError === "auth") {
      toast.error("Authentication error. Please log in again.")
    }
  }, [searchParams])

  /**
   * Handles form submission
   * @param e - The form event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Client-side validation
    if (!email.trim()) {
      toast.error("Email is required")
      return
    }

    if (!password.trim()) {
      toast.error("Password is required")
      return
    }

    setIsLoading(true)

    try {
      const result = await loginUser(email, password)

      if (result.success) {
        toast.success("Login successful!")
        // Add a small delay before redirecting
        setTimeout(() => {
          const redirectTo = searchParams.get("from") || "/dashboard"
          router.push(redirectTo)
        }, 1000)
      } else {
        // Show error message from server
        toast.error(result.message || "Invalid email or password")
      }
    } catch (error) {
      console.error("Login error:", error)
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black">
      <div className="w-full max-w-md">
        <Card className="bg-[#1f1f1f] border-gray-800">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 relative">
                <Image
                  src="/placeholder.svg?height=64&width=64&text=AI"
                  alt="AIent Logo"
                  width={64}
                  height={64}
                  className="rounded-full"
                />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-white">Welcome To AIent 🐤</CardTitle>
            <CardDescription className="text-gray-400">Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#2a2a2a] border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>

              <div className="space-y-2 relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-[#2a2a2a] border-gray-700 text-white placeholder:text-gray-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Log in"
                )}
              </Button>

              <div className="text-center space-y-2">
                <Link href="/forgot-password" className="text-sm text-blue-400 hover:underline">
                  Forgot password?
                </Link>
                <p className="text-sm text-gray-400">
                  Don't have an account?{" "}
                  <Link href="/register" className="text-blue-400 hover:underline">
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// This file contains the complete login functionality:
// - Email and password inputs
// - Form validation
// - Login submission
// - Error handling
// - Loading states
// - Links to forgot password and registration

// The login page is accessible at /login

