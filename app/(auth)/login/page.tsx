"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { loginUser } from "@/app/actions"
import Link from "next/link"
import { Divider } from "@/components/divider"
import toast from "react-hot-toast"

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
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-black">
      <div className="w-full max-w-md space-y-8 bg-[#2F2F2F] rounded-lg p-8 shadow-lg border border-gray-800">
        <div className="flex flex-col items-center justify-center">
          <div className="w-24 h-24">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-RB1wlyGjhABEyhpwuZsvED6ZCpgyHC.png"
              alt="AIent Logo"
              width={96}
              height={96}
              className="object-contain dark:invert"
            />
          </div>
          <h1 className="text-2xl font-light mt-4 mb-8 text-white">Welcome to AIent 👋</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Email Input */}
            <div className="relative">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-[#1f1f1f] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 text-white placeholder:text-gray-400 text-sm"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-[#1f1f1f] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 text-white placeholder:text-gray-400 text-sm pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg bg-gray-700 text-white text-sm font-medium hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Logging in...
              </>
            ) : (
              "Log in"
            )}
          </button>
        </form>

        <Divider className="border-gray-700" />

        <div className="text-center space-y-2">
          <Link href="/forgot-password" className="text-blue-400 hover:underline text-sm">
            Forgot password?
          </Link>
          <p className="text-sm text-gray-400">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-400 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
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

