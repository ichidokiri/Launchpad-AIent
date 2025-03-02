import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import type { TokenPayload } from "@/types/auth"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")

export async function verifyToken(token: string): Promise<TokenPayload | null> {
    try {
        const { payload } = await jwtVerify(token, secret)
        return payload as TokenPayload
    } catch (error) {
        console.error("Token verification failed:", error)
        return null
    }
}

export async function signToken(payload: Partial<TokenPayload>) {
    try {
        const token = await new SignJWT(payload)
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("24h")
            .sign(secret)
        return token
    } catch (error) {
        console.error("Token signing failed:", error)
        return null
    }
}

export async function getToken() {
    const token = cookies().get("authToken")?.value
    if (!token) return null

    const payload = await verifyToken(token)
    return payload
}

