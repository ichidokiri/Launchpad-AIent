import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
    try {
        // Clear the auth token cookie
        const cookieStore = cookies()
        await cookieStore.delete("authToken")

        return NextResponse.json({ success: true, message: "Logged out successfully" })
    } catch (error) {
        console.error("Logout error:", error)
        return NextResponse.json(
            {
                success: false,
                error: "Failed to logout",
                details: process.env.NODE_ENV === "development" ? error : undefined,
            },
            { status: 500 },
        )
    }
}

