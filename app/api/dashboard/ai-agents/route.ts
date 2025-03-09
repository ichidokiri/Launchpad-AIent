export const dynamic = "force-dynamic"

/**
 * API route for AI agents
 * This file handles retrieving AI agents for the dashboard
 * Note: Prisma generates camelCase properties (aIAgent) from PascalCase models (AIAgent)
 */
import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

// Create a new PrismaClient instance
const prisma = new PrismaClient()

/**
 * Handles GET requests to retrieve AI agents
 * @param req - The request object
 * @returns The response with the agents
 */
export async function GET(req: NextRequest) {
  try {
    console.log("AI Agent fetch request received for dashboard")

    // Get query parameters
    const url = new URL(req.url)
    const creatorId = url.searchParams.get("creatorId")

    if (!creatorId) {
      return NextResponse.json({ error: "Creator ID is required" }, { status: 400 })
    }

    console.log("Fetching agents for creator:", creatorId)

    // Fetch agents based on creator ID
    // Using prisma.aIAgent (camelCase)
    const agents = await prisma.aIAgent.findMany({
      where: {
        creatorId: creatorId,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    console.log(`Found ${agents.length} agents for creator ${creatorId}`)

    return NextResponse.json(agents, { status: 200 })
  } catch (error) {
    console.error("Error fetching AI agents:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch AI agents",
        message: error instanceof Error ? error.message : String(error),
        stack: process.env.NODE_ENV === "development" ? (error instanceof Error ? error.stack : undefined) : undefined,
      },
      { status: 500 },
    )
  } finally {
    // Explicitly disconnect from Prisma to prevent connection pool issues
    await prisma.$disconnect()
  }
}

