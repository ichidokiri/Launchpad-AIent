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
  console.log("POST /api/ai-agents - Received request")

  try {
    // Use the custom auth function instead of getServerSession
    const user = await auth(request)
    console.log("Authenticated user:", user ? { id: user.id, email: user.email, role: user.role } : "No user")

    if (!user) {
      console.error("POST /api/ai-agents - Authentication failed")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Find the user in the database
    console.log("Looking up user in database with email:", user.email)
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    })

    if (!dbUser) {
      console.error("POST /api/ai-agents - User not found in database:", user.email)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    console.log("Found user in database:", { id: dbUser.id, email: dbUser.email })

    // Parse request body
    let data
    try {
      const rawData = await request.text()
      console.log("Raw request body:", rawData)
      data = JSON.parse(rawData)
      console.log("POST /api/ai-agents - Parsed request data:", data)
    } catch (parseError) {
      console.error("POST /api/ai-agents - Failed to parse request body:", parseError)
      return NextResponse.json(
          {
            error: "Invalid request body",
            details: parseError instanceof Error ? parseError.message : "JSON parse error",
          },
          { status: 400 },
      )
    }

    // Validate required fields
    if (!data.name) {
      console.error("POST /api/ai-agents - Missing required field: name")
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    if (!data.symbol) {
      console.error("POST /api/ai-agents - Missing required field: symbol")
      return NextResponse.json({ error: "Symbol is required" }, { status: 400 })
    }

    // Prepare data for creation with defaults for optional fields
    const agentData = {
      name: data.name,
      description: data.description || "",
      model: data.model || "gpt-3.5-turbo",
      systemPrompt: data.systemPrompt || "You are a helpful assistant.",
      category: data.category || "general",
      isPublic: data.isPublic || false,
      price: typeof data.price === "number" ? data.price : 0,
      symbol: data.symbol.toUpperCase(),
      marketCap: typeof data.marketCap === "number" ? data.marketCap : 0,
      creatorId: dbUser.id,
    }

    console.log("Creating AI agent with data:", agentData)

    // Create the AI agent
    const agent = await prisma.aIAgent.create({
      data: agentData,
    })

    console.log("AI agent created successfully:", { id: agent.id, name: agent.name })

    return NextResponse.json({
      success: true,
      message: "AI agent created successfully",
      agent,
    })
  } catch (error) {
    console.error("Error creating agent:", error)

    // Provide more detailed error information
    let errorMessage = "Failed to create agent"
    let statusCode = 500

    if (error instanceof Error) {
      errorMessage = error.message

      // Check for Prisma-specific errors
      if (error.name === "PrismaClientKnownRequestError") {
        // @ts-ignore - Prisma error code
        const code = error.code
        if (code === "P2002") {
          errorMessage = "A unique constraint would be violated. An agent with this name or symbol might already exist."
          statusCode = 409 // Conflict
        }
      }
    }

    return NextResponse.json(
        {
          error: errorMessage,
          stack: process.env.NODE_ENV === "development" ? (error instanceof Error ? error.stack : undefined) : undefined,
        },
        { status: statusCode },
    )
  } finally {
    await prisma.$disconnect()
  }
}

