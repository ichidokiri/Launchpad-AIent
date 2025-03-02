"use client"

import type React from "react"

import { useState } from "react"
import { Eye, EyeOff, User, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTheme } from "next-themes"
import { signupUser } from "@/app/actions"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { theme } = useTheme()
  const [showTerms, setShowTerms] = useState(false)

  // Form state
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)

  // Error state
  const [nameError, setNameError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [confirmPasswordError, setConfirmPasswordError] = useState("")
  const [termsError, setTermsError] = useState("")

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

    if (!name) {
      setNameError("Name is required")
      return
    }

    if (!password) {
      setPasswordError("Password is required")
      return
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match")
      return
    }

    if (!isEmailValid) {
      return
    }

    if (!acceptTerms) {
      setTermsError("Please accept the terms and conditions")
      return
    }

    setIsLoading(true)
    setNameError("")
    setPasswordError("")
    setConfirmPasswordError("")
    setTermsError("")

    try {
      const result = await signupUser({ name, email, password })
      if (result.success) {
        // Handle successful signup (e.g., redirect to login page or dashboard)
        console.log("Signup successful", result)
      } else {
        // Handle signup failure
        console.error("Signup failed:", result.message)
      }
    } catch (error) {
      console.error("Signup failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const termsText = `By signing up for Kanegi, you agree to these Terms and Conditions. You must provide accurate information during registration and are responsible for maintaining the security of your account. You agree not to share your credentials or misuse the app. The app provides meditation audio and video content for personal use only; you may not reproduce, distribute, or misuse any content. Your use of the app is also governed by our Privacy Policy, which outlines how we handle your data. We reserve the right to modify these terms at any time, and your continued use of the app constitutes acceptance of any changes. We may suspend or terminate your account for violations of these terms. [Your Meditation App Name] is not liable for any indirect damages arising from your use of the app.`

  return (
    <div className="min-h-screen w-full sm:w-auto flex items-center justify-center p-4 sm:p-0">
      <div className="fixed inset-0 z-0">
        <Image
          src={
            theme === "dark"
              ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/0f1475241e52bfb83f4661bd11984472-xFZNhV2RwAJXrDJOleRhxLNtd0vkMB.jpeg"
              : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/507a14707d5da14d8bd2d147bd77bf6f-GVLaXOuITHwkfR4YXRcXa0CnJBPqfN.jpeg"
          }
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      <ThemeToggle />

      <div className="w-full sm:min-w-[344px] sm:max-w-md space-y-8 bg-white/8 dark:bg-black/8 backdrop-blur-md rounded-3xl p-4 sm:p-8 shadow-xl relative z-10 border border-white/20 dark:border-black/20 min-h-[700px]">
        {/* Logo */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-24 h-24">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-RB1wlyGjhABEyhpwuZsvED6ZCpgyHC.png"
              alt="Kanegi Logo"
              width={96}
              height={96}
              className="object-contain dark:invert"
            />
          </div>
          <h1 className="text-2xl font-light text-black dark:text-white mt-4 mb-8">Welcome to Kanegi 👋</h1>
          <p className="text-black dark:text-white">Sign up to start your experience</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Name Input */}
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (name.length > 0) {
                      if (!e.target.value) {
                        setNameError("Name is required")
                      } else {
                        setNameError("")
                      }
                    }
                  }}
                  className={`w-full px-4 py-2.5 rounded-full bg-transparent border ${
                    nameError ? "border-red-500" : "border-black dark:border-white"
                  } focus:outline-none focus:border-black dark:focus:border-white text-black dark:text-white placeholder-black/70 dark:placeholder-white/70 text-sm pr-10`}
                />
                <User
                  className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 ${
                    nameError ? "text-red-500" : "text-black dark:text-white"
                  }`}
                />
              </div>
              {nameError && <p className="text-red-500 text-xs px-4">{nameError}</p>}
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email"
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

            {/* Password Input */}
            <div className="space-y-2">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (password.length > 0) {
                      if (!e.target.value) {
                        setPasswordError("Password is required")
                      } else {
                        setPasswordError("")
                      }
                    }
                  }}
                  className={`w-full px-4 py-2.5 rounded-full bg-transparent border ${
                    passwordError ? "border-red-500" : "border-black dark:border-white"
                  } focus:outline-none focus:border-black dark:focus:border-white text-black dark:text-white placeholder-black/70 dark:placeholder-white/70 text-sm`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 ${
                    passwordError ? "text-red-500" : "text-black dark:text-white"
                  }`}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordError && <p className="text-red-500 text-xs px-4">{passwordError}</p>}
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    if (confirmPassword.length > 0) {
                      if (e.target.value !== password) {
                        setConfirmPasswordError("Passwords do not match")
                      } else {
                        setConfirmPasswordError("")
                      }
                    }
                  }}
                  className={`w-full px-4 py-2.5 rounded-full bg-transparent border ${
                    confirmPasswordError ? "border-red-500" : "border-black dark:border-white"
                  } focus:outline-none focus:border-black dark:focus:border-white text-black dark:text-white placeholder-black/70 dark:placeholder-white/70 text-sm`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 ${
                    confirmPasswordError ? "text-red-500" : "text-black dark:text-white"
                  }`}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPasswordError && <p className="text-red-500 text-xs px-4">{confirmPasswordError}</p>}
            </div>

            {/* Terms & Conditions */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptTerms}
                  onChange={(e) => {
                    setAcceptTerms(e.target.checked)
                    setShowTerms(e.target.checked)
                    if (termsError) setTermsError("")
                  }}
                  className="w-3 h-3 rounded border-gray-300 dark:border-gray-600"
                />
                <label htmlFor="terms" className="text-xs text-black dark:text-white">
                  Accept Terms & Conditions
                </label>
              </div>
              {termsError && <p className="text-red-500 text-xs px-4">{termsError}</p>}
              {showTerms && (
                <div className="mt-4 p-4 rounded-lg">
                  <p className="text-xs text-black dark:text-white leading-relaxed">{termsText}</p>
                </div>
              )}
            </div>
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-full bg-black dark:bg-white text-white dark:text-black text-sm font-medium hover:bg-black/90 dark:hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              </>
            ) : (
              "Sign Up"
            )}
          </button>

          {/* Login Link */}
          <div className="text-center space-y-2 mt-6">
            <p className="text-black dark:text-white text-xs">Already have an account?</p>
            <Link href="/" className="text-blue-600 dark:text-blue-400 text-xs">
              Log in
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

