"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Loader2, ArrowLeft } from "lucide-react"
import { forgotPassword } from "@/app/actions"
import { toast } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ForgotPasswordPage() {
  const router = useRouter()

  // Form state
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Client-side validation
    if (!email.trim()) {
      toast.error("Email is required")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address")
      return
    }

    setIsLoading(true)

    try {
      const result = await forgotPassword(email)

      if (result.status === "Success") {
        setIsSubmitted(true)
        toast.success("Password reset instructions sent to your email")
      } else {
        toast.error(result.message || "Failed to send reset instructions")
      }
    } catch (error) {
      console.error("Forgot password error:", error)
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black">
      <Link href="/login" className="absolute top-4 left-4 p-2 rounded-full bg-[#2a2a2a] text-white hover:bg-gray-700">
        <ArrowLeft className="h-5 w-5" />
      </Link>

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
            <CardTitle className="text-2xl font-bold text-white">Reset Password</CardTitle>
            <CardDescription className="text-gray-400">
              {isSubmitted
                ? "Check your email for reset instructions"
                : "Enter your email to receive password reset instructions"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSubmitted ? (
              <div className="text-center space-y-4">
                <p className="text-gray-300">We've sent password reset instructions to:</p>
                <p className="font-medium text-white">{email}</p>
                <p className="text-sm text-gray-400 mt-4">
                  Didn't receive the email? Check your spam folder or{" "}
                  <button onClick={() => setIsSubmitted(false)} className="text-blue-400 hover:underline">
                    try again
                  </button>
                </p>

                <Button onClick={() => router.push("/login")} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                  Return to Login
                </Button>
              </div>
            ) : (
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

                <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Instructions"
                  )}
                </Button>

                <div className="text-center mt-4">
                  <Link href="/login" className="text-sm text-blue-400 hover:underline">
                    Back to Login
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

