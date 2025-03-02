import { cookies } from "next/headers"
import { verifyToken } from "@/lib/jwt"
import type { TokenPayload } from "@/types/auth"

export { verifyToken } from "@/lib/jwt"

export async function auth(req: Request): Promise<TokenPayload | null> {
  try {
    // Get token from cookie
    const cookieStore = await cookies()
    const token = cookieStore.get("authToken")?.value

    if (!token) {
      return null
    }

    // Verify token
    const payload = await verifyToken(token)
    if (!payload) {
      return null
    }

    return payload
  } catch (error) {
    console.error("Auth error:", error)
    return null
  }
}

export const authOptions = {}

