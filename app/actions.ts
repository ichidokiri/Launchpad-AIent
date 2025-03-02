"use server"

import { cookies } from "next/headers"
import { signToken } from "@/lib/jwt"
import { prisma } from "@/lib/db"
import { sendVerificationEmail } from "@/lib/email"
import type { TokenPayload } from "@/types/auth"
import { hash, compare } from "bcryptjs"

export async function loginUser(email: string, password: string) {
  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return {
        success: false,
        message: "User not found. Please register first.",
      }
    }

    // Verify password
    const isValidPassword = await compare(password, user.password)
    if (!isValidPassword) {
      return {
        success: false,
        message: "Invalid credentials",
      }
    }

    // Create token payload
    const tokenPayload: TokenPayload = {
      id: user.id.toString(),
      email: user.email,
      role: user.role as "USER" | "ADMIN",
    }

    const authToken = await signToken(tokenPayload)

    if (authToken) {
      cookies().set("authToken", authToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: "/",
      })

      return {
        success: true,
        user: tokenPayload,
      }
    }

    return {
      success: false,
      message: "Authentication failed",
    }
  } catch (error) {
    console.error("Login error:", error)
    return {
      success: false,
      message: "An unexpected error occurred",
    }
  }
}

// Add this function to generate a random code
function generateVerificationCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

// Update the signupUser function
export async function signupUser(formData: { email: string; password: string }) {
  try {
    // Input validation
    if (!formData.email || !formData.password) {
      return { success: false, message: "All fields are required" }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      return { success: false, message: "Invalid email format" }
    }

    // Password validation
    if (formData.password.length < 8) {
      return { success: false, message: "Password must be at least 8 characters long" }
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: formData.email },
    })

    if (existingUser) {
      return { success: false, message: "User with this email already exists" }
    }

    // Hash password
    const hashedPassword = await hash(formData.password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: formData.email,
        password: hashedPassword,
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

export async function forgotPassword(email: string) {
  try {
    // Input validation
    if (!email) {
      return { success: false, message: "Email is required" }
    }

    // Mock successful forgot password request
    return {
      success: true,
      message: "OTP sent successfully",
    }
  } catch (error) {
    console.error("Forgot password error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred",
    }
  }
}

// Update the verifyOTP function
export async function verifyOTP(email: string, code: string) {
  try {
    // Input validation
    if (!email || !code) {
      return { success: false, message: "Email and OTP are required" }
    }

    // Find the verification code in the database
    const verificationRecord = await prisma.verificationCode.findFirst({
      where: {
        email,
        code,
        expiresAt: {
          gt: new Date(),
        },
        used: false,
      },
    })

    if (!verificationRecord) {
      return {
        success: false,
        message: "Invalid or expired verification code",
      }
    }

    // Mark the verification code as used
    await prisma.verificationCode.update({
      where: { id: verificationRecord.id },
      data: { used: true },
    })

    return {
      success: true,
      message: "Email verified successfully",
    }
  } catch (error) {
    console.error("Verification error:", error)
    return {
      success: false,
      message: "An error occurred during verification",
    }
  }
}

export async function resendOTP(email: string) {
  try {
    if (!email) {
      return { success: false, message: "Email is required" }
    }

    // Generate new verification code
    const verificationCode = generateVerificationCode()

    // Store the new code
    await prisma.verificationCode.create({
      data: {
        email,
        code: verificationCode,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      },
    })

    // Send the new code via email
    const emailResult = await sendVerificationEmail(email, verificationCode)
    if (!emailResult.success) {
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

export async function resetPassword(email: string, password: string) {
  try {
    // Input validation
    if (!email || !password) {
      return { success: false, message: "Email and password are required" }
    }

    // Password validation
    if (password.length < 8) {
      return { success: false, message: "Password must be at least 8 characters long" }
    }

    // Mock successful password reset
    return {
      success: true,
      message: "Password reset successfully",
    }
  } catch (error) {
    console.error("Password reset error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred during password reset",
    }
  }
}

// Add refresh token functionality
export async function refreshAuthToken() {
  try {
    const refreshToken = cookies().get("refreshToken")?.value

    if (!refreshToken) {
      return { success: false, message: "No refresh token available" }
    }

    // For demo purposes, create a new auth token
    const mockUserData = {
      id: "1",
      email: "demo@example.com",
      firstName: "Demo",
      lastName: "User",
      status: "active",
      role: "user",
    }

    const newAuthToken = await signToken(mockUserData)

    if (newAuthToken) {
      cookies().set("authToken", newAuthToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60, // 7 days
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

// Add logout functionality
export async function logout() {
  try {
    cookies().delete("authToken")
    cookies().delete("refreshToken")
    return { success: true }
  } catch (error) {
    console.error("Logout error:", error)
    return { success: false }
  }
}

