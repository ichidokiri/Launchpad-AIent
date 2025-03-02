"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { loginUser } from "@/app/actions"
import Link from "next/link"
import { Divider } from "@/components/divider"
import toast from "react-hot-toast" // Change this line
// Remove the import { toast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

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
          const searchParams = new URLSearchParams(window.location.search)
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
      <div className="min-h-screen w-full flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 bg-card rounded-lg p-8 shadow-lg border border-border">
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
            <h1 className="text-2xl font-light mt-4 mb-8">Welcome to AIent 👋</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground text-sm"
                />
              </div>
              <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground text-sm pr-10"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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

          <Divider />

          <div className="text-center space-y-2">
            <Link href="/forgot-password" className="text-primary hover:underline text-sm">
              Forgot password?
            </Link>
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
  )
}

