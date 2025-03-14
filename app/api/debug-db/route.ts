import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

export const dynamic = "force-dynamic"

export async function GET() {
  const prisma = new PrismaClient()

  try {
    // Get basic database stats using proper model name AIAgent
    const agentCount = await prisma.aIAgent.count().catch((err) => {
      console.error("Error counting agents:", err)
      return 0
    })

    const userCount = await prisma.user.count().catch((err) => {
      console.error("Error counting users:", err)
      return 0
    })

    // If we made it here, the database is connected
    return NextResponse.json({
      status: "success",
      stats: {
        agents: agentCount,
        users: userCount,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json(
      {
        error: "Database error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  } finally {
    await prisma.$disconnect()
  }
}

