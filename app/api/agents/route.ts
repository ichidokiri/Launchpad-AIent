import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const url = new URL(request.url)
    const creatorId = url.searchParams.get("creatorId")

    console.log("GET /api/agents - Query params:", { creatorId })

    // Build the query
    const query: any = {
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    }

    // Add creatorId filter if provided
    if (creatorId) {
      query.where = { creatorId }
    }

    console.log("Prisma query:", JSON.stringify(query, null, 2))

    // Try to fetch agents
    try {
      const agents = await prisma.aIAgent.findMany(query)
      return NextResponse.json({ agents })
    } catch (error) {
      console.error("Error fetching agents:", error)

      // Try alternative model name
      try {
        const agents = await prisma.AIAgent.findMany(query)
        return NextResponse.json({ agents })
      } catch (altError) {
        console.error("Error fetching agents with alternative model name:", altError)
        return NextResponse.json({ error: "Failed to fetch agents" }, { status: 500 })
      }
    }
  } catch (error) {
    console.error("Error in GET /api/agents:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

