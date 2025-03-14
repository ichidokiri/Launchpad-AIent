"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
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
      const result = await signupUser({ username: name, email, password })
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

  const termsText = `By signing up for AIent, you agree to these Terms and Conditions. You must provide accurate information during registration and are responsible for maintaining the security of your account. You agree not to share your credentials or misuse the platform. The platform provides AI agent trading and management services for personal use only; you may not reproduce, distribute, or misuse any content. Your use of the platform is also governed by our Privacy Policy, which outlines how we handle your data. We reserve the right to modify these terms at any time, and your continued use of the platform constitutes acceptance of any changes. We may suspend or terminate your account for violations of these terms. AIent is not liable for any indirect damages arising from your use of the platform.`

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
      <div className="relative bg-white dark:bg-neutral-900 shadow-xl rounded-lg overflow-hidden w-full max-w-md sm:max-w-lg">
        <div className="p-8 sm:px-16 sm:py-12">
          <div className="flex items-center justify-center">
            <div className="w-24 h-24">
              <Image
                src="/placeholder.svg?height=64&width=64&text=AI"
                alt="AIent Logo"
                width={96}
                height={96}
                className="object-contain dark:invert"
              />
            </div>
          </div>
          <h1 className="text-2xl font-light text-black dark:text-white mt-4 mb-8">Welcome to AIent 🐤</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline ${
                  nameError ? "border-red-500" : ""
                }`}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {nameError && <p className="text-red-500 text-xs italic">{nameError}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline ${
                  emailError ? "border-red-500" : ""
                }`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && <p className="text-red-500 text-xs italic">{emailError}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline ${
                    passwordError ? "border-red-500" : ""
                  }`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                  <span
                    className="text-gray-600 dark:text-gray-400 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </span>
                </div>
              </div>
              {passwordError && <p className="text-red-500 text-xs italic">{passwordError}</p>}
            </div>
            <div className="mb-6">
              <label
                htmlFor="confirm-password"
                className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirm-password"
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline ${
                    confirmPasswordError ? "border-red-500" : ""
                  }`}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                  <span
                    className="text-gray-600 dark:text-gray-400 cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </span>
                </div>
              </div>
              {confirmPasswordError && <p className="text-red-500 text-xs italic">{confirmPasswordError}</p>}
            </div>
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-indigo-600 rounded focus:shadow-outline"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300 text-sm">
                  I agree to the{" "}
                  <button
                    type="button"
                    className="text-indigo-600 hover:text-indigo-800 focus:outline-none focus:shadow-outline"
                    onClick={() => setShowTerms(true)}
                  >
                    Terms and Conditions
                  </button>
                </span>
              </label>
              {termsError && <p className="text-red-500 text-xs italic">{termsError}</p>}
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Signing up..." : "Sign Up"}
              </button>
              <a
                className="inline-block align-baseline font-bold text-sm text-indigo-500 hover:text-indigo-800"
                href="/login"
              >
                Already have an account?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

