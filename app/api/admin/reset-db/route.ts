import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function POST(req: Request) {
    try {
        // Verify admin authorization
        const user = await auth(req)
        if (!user || user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Delete all data in reverse order of dependencies
        await prisma.$transaction([
            prisma.verificationCode.deleteMany(),
            prisma.interaction.deleteMany(),
            prisma.token.deleteMany(),
            prisma.agent.deleteMany(),
            prisma.user.deleteMany(),
        ])

        return NextResponse.json({ success: true, message: "Database reset successfully" })
    } catch (error) {
        console.error("Database reset error:", error)
        return NextResponse.json(
            { error: "Failed to reset database", details: process.env.NODE_ENV === "development" ? error : undefined },
            { status: 500 },
        )
    }
}

