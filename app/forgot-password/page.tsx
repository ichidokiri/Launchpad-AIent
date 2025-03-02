"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react"
import { forgotPassword } from "@/app/actions"
import Link from "next/link"
import type React from "react"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { theme } = useTheme()

  // Form state
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Error state
  const [emailError, setEmailError] = useState("")

  // Validate email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (email.length > 0) {
      if (!email) {
        setEmailError("Email is required")
        return false
      }
      if (!emailRegex.test(email)) {
        setEmailError("Please enter a valid email")
        return false
      }
    }
    setEmailError("")
    return true
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const isEmailValid = validateEmail(email)

    if (!email) {
      setEmailError("Email is required")
      return
    }

    if (!isEmailValid) {
      return
    }

    setIsLoading(true)
    setEmailError("")

    try {
      const result = await forgotPassword(email)
      if (result.status === "Success") {
        router.push(`/verify-account?email=${encodeURIComponent(email)}`)
      } else {
        setEmailError(result.message || "Failed to send verification code")
      }
    } catch (error) {
      setEmailError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full sm:w-auto flex items-center justify-center p-4 sm:p-0">
      <div className="fixed inset-0 z-0">
        <Image
          src={
            theme === "dark"
              ? "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
              : "https://images.unsplash.com/photo-1518655048521-f130df041f66?q=80&w=2070&auto=format&fit=crop"
          }
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      <Link
        href="/"
        className="fixed top-4 left-4 p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 z-50"
      >
        <ArrowLeft className="h-5 w-5 text-black dark:text-white opacity-70" />
      </Link>

      <div className="w-full max-w-md min-h-[700px] space-y-8 bg-white/8 dark:bg-black/8 backdrop-blur-md rounded-3xl p-4 sm:p-8 shadow-xl relative z-10 border border-white/20 dark:border-black/20">
        <div className="flex flex-col min-h-[480px]">
          {/* Logo and Text Section */}
          <div className="flex flex-col items-center justify-start space-y-6">
            <div className="w-24 h-24">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-RB1wlyGjhABEyhpwuZsvED6ZCpgyHC.png"
                alt="Kanegi Logo"
                width={96}
                height={96}
                className="object-contain dark:invert"
              />
            </div>
            <h1 className="text-2xl font-light text-black dark:text-white">Welcome To Kanegi 👋</h1>
            <p className="text-black dark:text-white text-center max-w-sm text-lg font-normal">
              Enter your email address to reset your password.
            </p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between mt-6">
            {/* Email Input */}
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (emailError) validateEmail(e.target.value)
                  }}
                  onBlur={(e) => validateEmail(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-full bg-transparent border ${
                    emailError ? "border-red-500" : "border-black dark:border-white"
                  } focus:outline-none focus:border-black dark:focus:border-white text-black dark:text-white placeholder-black/70 dark:placeholder-white/70 text-sm`}
                />
                <svg
                  className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 ${
                    emailError ? "text-red-500" : "text-black dark:text-white"
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              {emailError && <p className="text-red-500 text-xs px-4">{emailError}</p>}
            </div>

            {/* Submit Button */}
            <div className="flex justify-center mt-auto">
              <button
                type="submit"
                disabled={isLoading}
                className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/40 hover:bg-white/20 dark:hover:bg-black/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-black dark:text-white opacity-90" />
                ) : (
                  <ArrowRight className="w-4 h-4 text-black dark:text-white opacity-90" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

