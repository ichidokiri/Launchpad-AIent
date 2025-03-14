"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useTheme } from "next-themes"
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react"
import { verifyOTP, resendOTP } from "@/app/actions"
import Link from "next/link"

export default function VerifyAccountPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { theme } = useTheme()
  const email = searchParams.get("email") || ""
  const hasEmail = !!email
  const [shouldRedirect, setShouldRedirect] = useState(!hasEmail)

  useEffect(() => {
    if (!hasEmail) {
      router.push("/forgot-password")
    }
  }, [hasEmail, router])

  const [otp, setOtp] = useState(["", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [countdown, setCountdown] = useState(59)
  const [canResend, setCanResend] = useState(false)
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countdown > 0 && !canResend) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
    } else if (countdown === 0 && !canResend) {
      setCanResend(true)
    }
    return () => clearInterval(timer)
  }, [countdown, canResend])

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0]
    }

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value !== "" && index < 3) {
      inputRefs[index + 1].current?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs[index - 1].current?.focus()
    }
  }

  const handleResendCode = async () => {
    if (!canResend) return

    try {
      const result = await resendOTP(email)
      if (result.success) {
        setCountdown(59)
        setCanResend(false)
        setError("")
      } else {
        setError(result.message || "Failed to resend code")
      }
    } catch (error) {
      setError("Failed to resend code")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const code = otp.join("")

    if (code.length !== 4) {
      setError("Please enter the complete code")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const result = await verifyOTP(email, code)
      if (result.success) {
        router.push(`/reset-password?email=${encodeURIComponent(email)}`)
      } else {
        setError(result.message || "Invalid verification code")
      }
    } catch (error) {
      setError("An error occurred during verification")
    } finally {
      setIsLoading(false)
    }
  }

  if (!hasEmail) {
    return null
  }

  return (
    <div className="min-h-screen w-full sm:w-auto flex items-center justify-center p-4 sm:p-0">
      <Link
        href="/forgot-password"
        className="fixed top-4 left-4 p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 z-50"
      >
        <ArrowLeft className="h-5 w-5 text-black dark:text-white opacity-70" />
      </Link>

      <div className="w-full max-w-md min-h-[700px] space-y-8 bg-[#1f1f1f] border-gray-800 rounded-lg p-4 sm:p-8 shadow-xl relative z-10">
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
              <p className="text-black dark:text-white">
                Code has been send to <span className="font-medium">{email}</span>
              </p>
              <p className="text-black dark:text-white">Enter the code to verify your account.</p>
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between mt-6">
            <div className="space-y-6">
              {/* OTP Input */}
              <div className="flex justify-center gap-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={inputRefs[index]}
                    type="text"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value.replace(/[^0-9]/g, ""))}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-lg bg-white/10 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-black dark:text-white"
                  />
                ))}
              </div>

              {error && <p className="text-red-500 text-xs text-center">{error}</p>}

              {/* Resend Code */}
              <div className="text-center space-y-2">
                <p className="text-black dark:text-white text-sm">
                  Didn't Receive Code?{" "}
                  <button
                    type="button"
                    onClick={handleResendCode}
                    className={`text-[#4285f4] ${!canResend && "opacity-50 cursor-not-allowed"}`}
                    disabled={!canResend}
                  >
                    Resend Code
                  </button>
                </p>
                {!canResend && (
                  <p className="text-black/70 dark:text-white/70 text-sm">
                    Resend code in {String(Math.floor(countdown / 60)).padStart(2, "0")}:
                    {String(countdown % 60).padStart(2, "0")}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center mb-8">
              <button
                type="submit"
                disabled={isLoading}
                className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white dark:text-black hover:bg-white/20 dark:hover:bg-black/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin opacity-70" />
                ) : (
                  <ArrowRight className="w-4 h-4 text-black dark:text-white opacity-70" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

