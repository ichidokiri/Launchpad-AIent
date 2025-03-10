"use server"

import { cookies } from "next/headers"
import { signToken } from "@/lib/jwt"
import { prisma } from "@/lib/db"
import { sendVerificationEmail } from "@/lib/email"
import type { TokenPayload } from "@/types/auth"
import { hash, compare } from "bcryptjs"
import { z } from "zod"

/**
 * Zod schema to validate email addresses
 */
const emailSchema = z.object({
  email: z.string().email(),
})

/**
 * Generate a 4-digit verification code
 */
function generateVerificationCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

/**
 * Logs in a user with email and password
 */
export async function loginUser(email: string, password: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return { success: false, message: "User not found. Please register first." }
    }

    const isValidPassword = await compare(password, user.password)
    if (!isValidPassword) {
      return { success: false, message: "Invalid credentials" }
    }

    const tokenPayload: TokenPayload = {
      id: user.id.toString(),
      email: user.email,
      role: user.role === "USER" ? "user" : "admin",
    }

    const authToken = await signToken(tokenPayload)
    if (authToken) {
      // Use await with cookies()
      const cookieStore = cookies()
      cookieStore.set("authToken", authToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: "/",
      })

      return { success: true, user: tokenPayload }
    }

    return { success: false, message: "Authentication failed" }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, message: "An unexpected error occurred" }
  }
}

/**
 * Registers a new user
 */
export async function signupUser(formData: { email: string; password: string; name?: string }) {
  try {
    if (!formData.email || !formData.password) {
      return { success: false, message: "All fields are required" }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      return { success: false, message: "Invalid email format" }
    }

    if (formData.password.length < 8) {
      return { success: false, message: "Password must be at least 8 characters long" }
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: formData.email },
    })
    if (existingUser) {
      return { success: false, message: "User with this email already exists" }
    }

    const hashedPassword = await hash(formData.password, 10)
    const user = await prisma.user.create({
      data: {
        email: formData.email,
        password: hashedPassword,
        name: formData.name || null,
        role: "USER",
      },
    })

    return {
      success: true,
      message: "Registration successful! Please log in.",
      user: {
        id: user.id.toString(),
        email: user.email,
        role: user.role,
      },
    }
  } catch (error) {
    console.error("Signup error:", error)
    return {
      success: false,
      message: "Registration failed. Please try again.",
    }
  }
}

/**
 * Initiates the forgot password process
 */
export async function forgotPassword(email: string) {
  try {
    if (!email) {
      return { success: false, message: "Email is required" }
    }

    const user = await prisma.user.findUnique({ where: { email } })
    // Hide whether the user exists
    if (!user) {
      return {
        success: true,
        message: "If your email is registered, you will receive a reset link.",
      }
    }

    const verificationCode = generateVerificationCode()
    await prisma.verificationCode.create({
      data: {
        email,
        code: verificationCode,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      },
    })

    await sendVerificationEmail(email, verificationCode)
    return {
      success: true,
      status: "Success",
      message: "Verification code sent successfully",
    }
  } catch (error) {
    console.error("Forgot password error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred",
    }
  }
}

/**
 * Verifies an OTP (One-Time Password)
 */
export async function verifyOTP(email: string, code: string) {
  try {
    if (!email || !code) {
      return { success: false, message: "Email and OTP are required" }
    }

    const verificationRecord = await prisma.verificationCode.findFirst({
      where: {
        email,
        code,
        expiresAt: { gt: new Date() },
        used: false,
      },
    })

    if (!verificationRecord) {
      return { success: false, message: "Invalid or expired verification code" }
    }

    await prisma.verificationCode.update({
      where: { id: verificationRecord.id },
      data: { used: true },
    })

    return { success: true, message: "Email verified successfully" }
  } catch (error) {
    console.error("Verification error:", error)
    return {
      success: false,
      message: "An error occurred during verification",
    }
  }
}

/**
 * Resends an OTP (One-Time Password)
 */
export async function resendOTP(email: string) {
  try {
    if (!email) {
      return { success: false, message: "Email is required" }
    }

    const verificationCode = generateVerificationCode()
    await prisma.verificationCode.create({
      data: {
        email,
        code: verificationCode,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    })

    const emailSent = await sendVerificationEmail(email, verificationCode)
    if (!emailSent) {
      throw new Error("Failed to send verification email")
    }

    return {
      success: true,
      message: "Verification code sent successfully",
    }
  } catch (error) {
    console.error("Resend OTP error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to resend verification code",
    }
  }
}

/**
 * Resends the verification code if user isn't verified
 */
export async function resendVerificationCode(email: string) {
  try {
    const validatedFields = emailSchema.safeParse({ email })
    if (!validatedFields.success) {
      return { error: "Invalid email address" }
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return { error: "User not found" }
    }

    // If user is already verified
    if (user.status === "VERIFIED") {
      return { error: "User is already verified" }
    }

    // Delete any old codes
    await prisma.verificationCode.deleteMany({ where: { email } })

    const verificationCode = generateVerificationCode()
    await prisma.verificationCode.create({
      data: {
        code: verificationCode,
        email,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    })

    const emailSent = await sendVerificationEmail(email, verificationCode)
    if (!emailSent) {
      throw new Error("Failed to send verification email")
    }

    return { success: true }
  } catch (error) {
    console.error("Error resending verification code:", error)
    return { error: "Failed to resend verification code" }
  }
}

/**
 * Resets a user's password
 */
export async function resetPassword(email: string, password: string) {
  try {
    if (!email || !password) {
      return { success: false, message: "Email and password are required" }
    }
    if (password.length < 8) {
      return { success: false, message: "Password must be at least 8 characters long" }
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return { success: false, message: "User not found" }
    }

    const hashedPassword = await hash(password, 10)
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    })

    return { success: true, message: "Password reset successfully" }
  } catch (error) {
    console.error("Password reset error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred during password reset",
    }
  }
}

/**
 * Refreshes an authentication token
 */
export async function refreshAuthToken() {
  try {
    const cookieStore = cookies()
    const authToken = cookieStore.get("authToken")?.value
    if (!authToken) {
      return { success: false, message: "No auth token available" }
    }

    // Example: create a new token
    const mockUserData: TokenPayload = {
      id: "1",
      email: "demo@example.com",
      role: "user",
    }

    const newAuthToken = await signToken(mockUserData)
    if (newAuthToken) {
      cookieStore.set("authToken", newAuthToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      })
      return { success: true, userData: mockUserData }
    }

    return { success: false, message: "Failed to generate new token" }
  } catch (error) {
    console.error("Token refresh error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Token refresh failed",
    }
  }
}

/**
 * Logs out a user
 */
export async function logout() {
  try {
    const cookieStore = cookies()
    cookieStore.delete("authToken")
    return { success: true }
  } catch (error) {
    console.error("Logout error:", error)
    return { success: false }
  }
}

