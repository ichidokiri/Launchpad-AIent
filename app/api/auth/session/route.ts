import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function GET(req: Request) {
    try {
        const user = await auth(req)

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        return NextResponse.json({ user })
    } catch (error) {
        console.error("Session error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

