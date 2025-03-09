"use server"

import { cookies } from "next/headers"
import { signToken } from "@/lib/jwt"
import { prisma } from "@/lib/db"
import { sendVerificationEmail } from "@/lib/email"
import type { TokenPayload } from "@/types/auth"
import { hash, compare } from "bcryptjs"
import { z } from "zod"

const emailSchema = z.object({
  email: z.string().email(),
})

/**
 * Logs in a user with email and password
 * @param email - The user's email
 * @param password - The user's password
 * @returns The login result
 */
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
      role: user.role === "USER" ? "user" : "admin",
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

/**
 * Generates a random verification code
 * @returns A 4-digit verification code
 */
function generateVerificationCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

/**
 * Registers a new user
 * @param formData - The user registration data
 * @returns The registration result
 */
export async function signupUser(formData: { email: string; password: string; name?: string }) {
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
 * @param email - The user's email
 * @returns The forgot password result
 */
export async function forgotPassword(email: string) {
  try {
    // Input validation
    if (!email) {
      return { success: false, message: "Email is required" }
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Don't reveal that the user doesn't exist for security reasons
      return { success: true, message: "If your email is registered, you will receive a reset link." }
    }

    // Generate verification code
    const verificationCode = generateVerificationCode()

    // Store the code
    await prisma.verificationCode.create({
      data: {
        email,
        code: verificationCode,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      },
    })

    // Send the code via email
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
 * @param email - The user's email
 * @param code - The verification code
 * @returns The verification result
 */
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

/**
 * Resends an OTP (One-Time Password)
 * @param email - The user's email
 * @returns The resend result
 */
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

export async function resendVerificationCode(email: string) {
  try {
    // Validate email
    const validatedFields = emailSchema.safeParse({ email })
    if (!validatedFields.success) {
      return { error: "Invalid email address" }
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return { error: "User not found" }
    }

    // Check if user is already verified
    // The 'verified' property doesn't exist, so let's check 'status' instead
    if (user.status === "VERIFIED") {
      return { error: "User is already verified" }
    }

    // Delete any existing verification codes for this user
    await prisma.verificationCode.deleteMany({
      where: { email: email },
    })

    // Generate a new verification code
    const verificationCode = generateVerificationCode()

    // Save the new code to the database
    await prisma.verificationCode.create({
      data: {
        code: verificationCode,
        email: email,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      },
    })

    // Send the new code via email
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
 * @param email - The user's email
 * @param password - The new password
 * @returns The password reset result
 */
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

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return { success: false, message: "User not found" }
    }

    // Hash the new password
    const hashedPassword = await hash(password, 10)

    // Update the user's password
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    })

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

/**
 * Refreshes an authentication token
 * @returns The refresh result
 */
export async function refreshAuthToken() {
  try {
    const cookieStore = cookies()
    const authToken = cookieStore.get("authToken")?.value

    if (!authToken) {
      return { success: false, message: "No auth token available" }
    }

    // For demo purposes, create a new auth token with extended expiration
    const mockUserData: TokenPayload = {
      id: "1",
      email: "demo@example.com",
      role: "user", // This must match one of the values in UserRole type
    }

    const newAuthToken = await signToken(mockUserData)

    if (newAuthToken) {
      cookieStore.set("authToken", newAuthToken, {
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

/**
 * Logs out a user
 * @returns The logout result
 */
export async function logout() {
  try {
    cookies().delete("authToken")
    return { success: true }
  } catch (error) {
    console.error("Logout error:", error)
    return { success: false }
  }
}

