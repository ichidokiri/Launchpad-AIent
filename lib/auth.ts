/**
 * Authentication utilities for the application
 * This file provides authentication-related functions and types
 *
 * The auth function is the main authentication middleware used throughout the application
 * It verifies the JWT token from cookies or authorization header and returns the user payload
 */
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"
import { cookies } from "next/headers"

// Define the UserRole enum
export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  SUPERADMIN = "SUPERADMIN",
}

// Define the TokenPayload interface
export interface TokenPayload {
  id: string
  email: string
  role: UserRole | string // Allow both enum and string for flexibility with case
  iat?: number
  exp?: number
}

/**
 * Check if a user has admin privileges
 * @param user The user token payload
 * @returns Boolean indicating if the user is an admin
 */
export function isAdmin(user: TokenPayload | null): boolean {
  if (!user) return false

  // Compare with case insensitivity and handle both string and enum values
  const role = typeof user.role === "string" ? user.role.toUpperCase() : user.role
  return role === UserRole.ADMIN || role === UserRole.SUPERADMIN || role === "ADMIN" || role === "SUPERADMIN"
}

/**
 * Options for authentication, can be expanded as needed
 */
export const authOptions = {
  // Add any necessary options here
}

export async function get(token?: string): Promise<string | null> {
  if (!token) {
    const cookieStore = await cookies()
    token = cookieStore.get("authToken")?.value || cookieStore.get("token")?.value
  }

  if (!token) {
    return null
  }

  return token
}

/**
 * Verify JWT token from cookies or authorization header
 * @param request Request or NextRequest object
 * @returns Decoded token payload or null if invalid
 */
async function verifyToken(request?: Request | NextRequest): Promise<TokenPayload | null> {
  try {
    // Get token from cookies or authorization header
    let token: string | undefined

    if (request) {
      // Try to get from Authorization header
      const authHeader = request.headers.get("Authorization")
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7)
      }
    }

    // If no token in header, try both cookie names
    if (!token) {
      token = await get()
    }

    if (!token) {
      console.log("No token found in cookies or headers")
      return null
    }

    console.log("Token found, verifying...")

    // Verify the token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)

    // Safely convert JWTPayload to TokenPayload
    const tokenPayload: TokenPayload = {
      id: payload.id as string,
      email: payload.email as string,
      role: payload.role as string,
      iat: payload.iat,
      exp: payload.exp,
    }

    console.log("Token verified for user:", tokenPayload.email)
    return tokenPayload
  } catch (error) {
    console.error("Token verification failed:", error)
    return null
  }
}

/**
 * Authentication middleware for API routes
 * @param request Request or NextRequest object
 * @returns User payload if authenticated, null if not authenticated
 */
export const auth = async (request: Request | NextRequest): Promise<TokenPayload | null> => {
  try {
    const user = await verifyToken(request)
    return user
  } catch (error) {
    console.error("Auth middleware error:", error)
    return null
  }
}

