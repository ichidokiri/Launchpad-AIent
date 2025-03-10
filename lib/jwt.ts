/**
 * JWT utility functions for token generation and verification
 */
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import type { UserRole } from "./auth"

// Token expiration time in seconds (7 days)
const TOKEN_EXPIRATION = 7 * 24 * 60 * 60

// Define the TokenPayload interface with an index signature
export interface TokenPayload {
  id: string
  email: string
  role: string | UserRole
  [key: string]: any // Add index signature to make it compatible with JWTPayload
}

/**
 * Signs a JWT token with the provided payload
 * @param payload The data to include in the token
 * @returns Promise<string> The signed JWT token
 */
export async function signToken(payload: TokenPayload): Promise<string> {
  try {
    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      throw new Error("JWT_SECRET environment variable is not defined")
    }

    const token = await new SignJWT({ ...payload })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(`${TOKEN_EXPIRATION}s`)
        .sign(new TextEncoder().encode(jwtSecret))

    return token
  } catch (error) {
    console.error("Error signing token:", error)
    throw new Error("Failed to sign token")
  }
}

/**
 * Verifies a JWT token and returns the payload
 * @param token The JWT token to verify
 * @returns Promise<TokenPayload | null> The token payload or null if invalid
 */
export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      throw new Error("JWT_SECRET environment variable is not defined")
    }

    const { payload } = await jwtVerify(token, new TextEncoder().encode(jwtSecret))

    // Convert JWTPayload to TokenPayload
    const tokenPayload: TokenPayload = {
      id: payload.id as string,
      email: payload.email as string,
      role: payload.role as string,
      // Copy any additional properties
      ...payload,
    }

    return tokenPayload
  } catch (error) {
    console.error("Error verifying token:", error)
    return null
  }
}

/**
 * Gets the current user from the JWT token in cookies
 * @returns Promise<TokenPayload | null> The current user or null if not authenticated
 */
export async function getUserFromToken(): Promise<TokenPayload | null> {
  const cookieStore = cookies()
  const token = cookieStore.get("authToken")?.value

  if (!token) {
    return null
  }

  return verifyToken(token)
}

