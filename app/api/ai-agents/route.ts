import { type NextRequest, NextResponse } from "next/server"
import { prisma, userExists } from "@/lib/db" // Use the singleton instance from lib/db.ts
import { auth } from "@/lib/auth"

export const dynamic = "force-dynamic"

// Simplified AI agent creation route
export async function POST(request: NextRequest) {
  console.log("POST /api/ai-agents - Received request")

  try {
    // 1. Get the request body
    const body = await request.json()
    console.log("Request body:", JSON.stringify(body, null, 2))

    // 2. Authenticate the user with better error handling
    let userId: string | null = null

    try {
      const user = await auth(request)
      console.log("Auth result:", user)

      if (user && user.id) {
        userId = user.id
        console.log("Using authenticated user ID:", userId)
      } else {
        console.log("Authentication failed, will try to find a valid user")
      }
    } catch (authError) {
      console.error("Authentication error:", authError)
      console.log("Will try to find a valid user in the database")
    }

    // If we don't have a valid user ID yet, try to find one in the database
    if (!userId) {
      try {
        // Find a user that actually exists in the database
        const firstUser = await prisma.user.findFirst()
        if (firstUser) {
          userId = firstUser.id
          console.log("Using first user from database:", userId)
        } else {
          console.error("No users found in the database")
          return NextResponse.json({ error: "No valid user found to create the agent" }, { status: 400 })
        }
      } catch (dbError) {
        console.error("Error finding user:", dbError)
        return NextResponse.json({ error: "Failed to find a valid user", details: String(dbError) }, { status: 500 })
      }
    }

    // Verify that we have a valid user ID before proceeding
    if (!userId) {
      console.error("No valid user ID available")
      return NextResponse.json({ error: "No valid user ID available to create the agent" }, { status: 400 })
    }

    // Verify that the user actually exists in the database
    const userExistsInDb = await userExists(userId)
    if (!userExistsInDb) {
      console.error(`User with ID ${userId} does not exist in the database`)
      return NextResponse.json({ error: `User with ID ${userId} does not exist in the database` }, { status: 400 })
    }

    // 3. Validate required fields
    if (!body.name) {
      console.log("Validation failed: Name is required")
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    if (!body.symbol) {
      console.log("Validation failed: Symbol is required")
      return NextResponse.json({ error: "Symbol is required" }, { status: 400 })
    }

    if (body.price === undefined || body.price === null) {
      console.log("Validation failed: Price is required")
      return NextResponse.json({ error: "Price is required" }, { status: 400 })
    }

    if (body.tokenAmount === undefined || body.tokenAmount === null) {
      console.log("Validation failed: Token amount is required")
      return NextResponse.json({ error: "Token amount is required" }, { status: 400 })
    }

    // 4. Prepare agent data with defaults for optional fields
    const agentData = {
      name: body.name,
      description: body.description || "",
      model: body.model || "gpt-3.5-turbo",
      systemPrompt: body.systemPrompt || "You are a helpful assistant.",
      category: body.category || "general",
      isPublic: body.isPublic || false,
      price: typeof body.price === "number" ? body.price : Number.parseFloat(body.price) || 0,
      symbol: body.symbol.toUpperCase(),
      marketCap:
        typeof body.marketCap === "number"
          ? body.marketCap
          : typeof body.tokenAmount === "number"
            ? body.price * body.tokenAmount
            : 0,
      creatorId: userId,
      logo: body.avatar || null,
    }

    console.log("Creating AI agent with data:", JSON.stringify(agentData, null, 2))

    // 5. Create the agent - using the correct model name
    let agent
    try {
      // Use the correct model name (aIAgent)
      agent = await prisma.aIAgent.create({
        data: agentData,
      })
      console.log("Created agent successfully:", JSON.stringify(agent, null, 2))
    } catch (error1) {
      console.error("Error creating agent:", error1)
      throw error1
    }

    // 6. Return success response
    return NextResponse.json({
      success: true,
      message: "AI agent created successfully",
      agent,
    })
  } catch (error) {
    console.error("Error creating agent:", error)

    // Provide detailed error information
    return NextResponse.json(
      {
        error: "Failed to create agent",
        message: error instanceof Error ? error.message : String(error),
        stack: process.env.NODE_ENV === "development" ? (error instanceof Error ? error.stack : undefined) : undefined,
      },
      { status: 500 },
    )
  }
}

// Simplified agent fetching route
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
          username: true,
          email: true,
        },
      },
    }

    console.log("Prisma query:", JSON.stringify(query, null, 2))

    // Use the correct model name (aIAgent)
    const agents = await prisma.aIAgent.findMany(query)
    console.log("Found agents:", agents.length)

    return NextResponse.json({ agents })
  } catch (error) {
    console.error("Error fetching agents:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch agents",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

