"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { signupUser } from "@/app/actions"
import Link from "next/link"
import { Divider } from "@/components/divider"
import toast from "react-hot-toast"

export default function RegisterPage() {
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

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long")
      return
    }

    setIsLoading(true)

    try {
      const result = await signupUser({ email, password })

      if (result.success) {
        toast.success(result.message || "Registration successful!")
        // Add a small delay before redirecting
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } else {
        // Show error message from server
        toast.error(result.message || "Registration failed")
      }
    } catch (error) {
      console.error("Registration error:", error)
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
                    Registering...
                  </>
              ) : (
                  "Register"
              )}
            </button>
          </form>

          <Divider />

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
  )
}

