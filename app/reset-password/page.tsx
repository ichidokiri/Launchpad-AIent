"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useTheme } from "next-themes"
import { Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react"
import { resetPassword } from "@/app/actions"
import Link from "next/link"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { theme } = useTheme()
  const email = searchParams.get("email") || ""

  // Form state
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!password) {
      setError("Please enter a new password")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const result = await resetPassword(email, password)
      if (result.success) {
        router.push("/") // Redirect to login page after successful reset
      } else {
        setError(result.message || "Failed to reset password")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
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
              ? "https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?q=80&w=2072&auto=format&fit=crop"
              : "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?q=80&w=2070&auto=format&fit=crop"
          }
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      <Link
        href="/forgot-password"
        className="fixed top-4 left-4 p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 z-50"
      >
        <ArrowLeft className="h-5 w-5 text-black dark:text-white opacity-70" />
      </Link>

      <div className="w-full max-w-md space-y-8 bg-[#1f1f1f] border-gray-800 rounded-lg p-4 sm:p-8 shadow-xl relative z-10">
        <div className="flex flex-col min-h-[480px]">
          {/* Logo and Text Section */}
          <div className="flex flex-col items-center justify-start space-y-6">
            <div className="w-16 h-16 relative">
              <Image
                src="/placeholder.svg?height=64&width=64&text=AI"
                alt="AIent Logo"
                width={64}
                height={64}
                className="rounded-full"
              />
            </div>
            <h1 className="text-2xl font-bold text-white">Welcome To AIent 🐤</h1>
            <div className="space-y-2 text-center">
              <p className="text-black dark:text-white">Please enter and confirm your new password.</p>
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between mt-6">
            <div className="space-y-6">
              {/* Password Inputs */}
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-full bg-transparent border border-black dark:border-white focus:outline-none focus:border-black dark:focus:border-white text-black dark:text-white placeholder-black/70 dark:placeholder-white/70 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-black dark:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-full bg-transparent border border-black dark:border-white focus:outline-none focus:border-black dark:focus:border-white text-black dark:text-white placeholder-black/70 dark:placeholder-white/70 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-black dark:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && <p className="text-red-500 text-xs text-center">{error}</p>}
            </div>

            {/* Submit Button */}
            <div className="mt-auto">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-full bg-black dark:bg-white text-white dark:text-black text-sm font-medium hover:bg-black/90 dark:hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Resetting Password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

