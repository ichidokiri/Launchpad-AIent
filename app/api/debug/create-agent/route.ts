import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { auth } from "@/lib/auth"

export const dynamic = "force-dynamic"

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
})

export async function POST(request: NextRequest) {
  console.log("POST /api/debug/create-agent - Received request")

  try {
    // Authenticate user
    const user = await auth(request)
    console.log("Authenticated user:", user ? { id: user.id, email: user.email, role: user.role } : "No user")

    if (!user) {
      console.error("POST /api/debug/create-agent - Authentication failed")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Find the user in the database
    console.log("Looking up user in database with email:", user.email)
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    })

    if (!dbUser) {
      console.error("POST /api/debug/create-agent - User not found in database:", user.email)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    console.log("Found user in database:", { id: dbUser.id, email: dbUser.email })

    // Parse request body
    let data
    try {
      const rawData = await request.text()
      console.log("Raw request body:", rawData)
      data = JSON.parse(rawData)
      console.log("POST /api/debug/create-agent - Parsed request data:", data)
    } catch (parseError) {
      console.error("POST /api/debug/create-agent - Failed to parse request body:", parseError)
      return NextResponse.json(
        {
          error: "Invalid request body",
          details: parseError instanceof Error ? parseError.message : "JSON parse error",
        },
        { status: 400 },
      )
    }

    // Return diagnostic information without creating an agent
    return NextResponse.json({
      success: true,
      message: "Debug information for agent creation",
      user: {
        id: dbUser.id,
        email: dbUser.email,
        role: dbUser.role,
      },
      requestData: data,
      databaseConnection: "OK",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in debug endpoint:", error)
    return NextResponse.json(
      {
        error: "Debug endpoint error",
        message: error instanceof Error ? error.message : "Unknown error",
        stack: process.env.NODE_ENV === "development" ? (error instanceof Error ? error.stack : undefined) : undefined,
      },
      { status: 500 },
    )
  } finally {
    await prisma.$disconnect()
  }
}

