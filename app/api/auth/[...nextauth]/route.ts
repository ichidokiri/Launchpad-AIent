export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { verifyToken } from "@/lib/jwt"

export async function GET(request: Request) {
    try {
        const headersList = await headers() // Add await here
        const authorization = headersList.get("authorization")

        if (!authorization?.startsWith("Bearer ")) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Missing or invalid authorization header",
                },
                { status: 401 },
            )
        }

        const token = authorization.split(" ")[1]
        const verified = await verifyToken(token)

        if (!verified) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid or expired token",
                },
                { status: 401 },
            )
        }

        // Check token expiration
        if (verified.exp && verified.exp * 1000 < Date.now()) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Token expired",
                },
                { status: 401 },
            )
        }

        return NextResponse.json({
            success: true,
            user: {
                id: verified.id,
                email: verified.email,
                role: verified.role,
            },
        })
    } catch (error) {
        console.error("Auth error:", error)

        if (error instanceof Error) {
            return NextResponse.json(
                {
                    success: false,
                    error: error.message,
                },
                { status: 500 },
            )
        }

        return NextResponse.json(
            {
                success: false,
                error: "Internal server error",
            },
            { status: 500 },
        )
    }
}

