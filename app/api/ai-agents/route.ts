import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth" // Changed from verifyAuth to auth

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const url = new URL(request.url)
    const creatorId = url.searchParams.get("creatorId")

    console.log("GET /api/ai-agents - Query params:", { creatorId })

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
    console.error("Error in GET /api/ai-agents:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("POST /api/ai-agents - Received request")

    // Authenticate user - Changed from verifyAuth to auth
    const authResult = await auth(request)
    console.log("Auth result:", authResult)

    if (!authResult) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = authResult.id
    console.log("Using authenticated user ID:", userId)

    // Check if user exists
    try {
      const userExists = await prisma.user.findUnique({ where: { id: userId } })
      if (!userExists) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }
    } catch (error) {
      console.error("Error checking if user exists:", error)
      return NextResponse.json({ error: "Error checking user" }, { status: 500 })
    }

    // Parse request body
    const body = await request.json()
    console.log("Request body:", body)

    // Create agent
    try {
      const agent = await prisma.aIAgent.create({
        data: {
          name: body.name,
          symbol: body.symbol,
          price: Number.parseFloat(body.price),
          marketCap: Number.parseFloat(body.price) * Number.parseFloat(body.tokenAmount),
          description: body.description || "",
          logo: body.avatar || null,
          creatorId: userId,
          model: body.model || "gpt-3.5-turbo",
          systemPrompt: body.systemPrompt || "You are a helpful assistant.",
          category: body.category || "general",
          isPublic: body.isPublic || false,
        },
      })

      return NextResponse.json({
        success: true,
        message: "AI agent created successfully",
        agent,
      })
    } catch (error) {
      console.error("Error creating agent:", error)

      // Try alternative model name
      try {
        const agent = await prisma.AIAgent.create({
          data: {
            name: body.name,
            symbol: body.symbol,
            price: Number.parseFloat(body.price),
            marketCap: Number.parseFloat(body.price) * Number.parseFloat(body.tokenAmount),
            description: body.description || "",
            logo: body.avatar || null,
            creatorId: userId,
            model: body.model || "gpt-3.5-turbo",
            systemPrompt: body.systemPrompt || "You are a helpful assistant.",
            category: body.category || "general",
            isPublic: body.isPublic || false,
          },
        })

        return NextResponse.json({
          success: true,
          message: "AI agent created successfully",
          agent,
        })
      } catch (altError) {
        console.error("Error creating agent with alternative model name:", altError)
        return NextResponse.json(
          {
            error: "Failed to create agent",
            message: altError instanceof Error ? altError.message : String(altError),
          },
          { status: 500 },
        )
      }
    }
  } catch (error) {
    console.error("Error in POST /api/ai-agents:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

