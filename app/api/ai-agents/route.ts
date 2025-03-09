import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { auth } from "@/lib/auth" // Use the custom auth function

export const dynamic = "force-dynamic"

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"], // Enhanced logging
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const creatorId = searchParams.get("creatorId")

    console.log("GET /api/ai-agents - Query params:", { creatorId })

    // Create the query object
    const query: any = {}

    // Add filters if present
    if (creatorId) {
      query.where = {
        ...query.where,
        creatorId,
      }
    }

    // Add includes
    query.include = {
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    }

    console.log("Prisma query:", JSON.stringify(query, null, 2))

    const agents = await prisma.aIAgent.findMany(query)

    console.log(`Found ${agents.length} agents`)

    return NextResponse.json({ agents })
  } catch (error) {
    console.error("Error fetching agents:", error)
    return NextResponse.json({ error: "Failed to fetch agents" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(request: NextRequest) {
  try {
    // Use the custom auth function instead of getServerSession
    const user = await auth(request)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Find the user in the database
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    })

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const data = await request.json()
    console.log("POST /api/ai-agents - Request data:", data)

    // Ensure required fields
    if (!data.name || !data.symbol) {
      return NextResponse.json({ error: "Name and symbol are required" }, { status: 400 })
    }

    // Create the AI agent
    const agent = await prisma.aIAgent.create({
      data: {
        name: data.name,
        description: data.description || "",
        model: data.model || "gpt-3.5-turbo",
        systemPrompt: data.systemPrompt || "You are a helpful assistant.",
        category: data.category || "general",
        isPublic: data.isPublic || false,
        price: data.price || 0,
        symbol: data.symbol.toUpperCase(),
        marketCap: data.marketCap || 0,
        creatorId: dbUser.id,
      },
    })

    console.log("Agent created:", agent)

    return NextResponse.json({
      message: "AI agent created successfully",
      agent,
    })
  } catch (error) {
    console.error("Error creating agent:", error)
    return NextResponse.json({ error: "Failed to create agent" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

