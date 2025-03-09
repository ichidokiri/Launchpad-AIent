export const dynamic = "force-dynamic"

/**
 * API route for fetching a user's AI agents
 * This dedicated endpoint ensures proper filtering by user ID
 */
import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { auth } from "@/lib/auth"

// Create a new PrismaClient instance
const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  try {
    // Get the authenticated user
    const user = await auth(req)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get query parameters
    const url = new URL(req.url)
    const userId = url.searchParams.get("userId")

    // Validate that the requested userId matches the authenticated user
    if (userId && userId !== user.id) {
      console.warn("User ID mismatch: requested", userId, "but authenticated as", user.id)
      return NextResponse.json({ error: "Unauthorized to access this user's agents" }, { status: 403 })
    }

    // Find the user in the database to get the correct database ID
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    })

    if (!dbUser) {
      console.error("User not found in database:", user.email)
      return NextResponse.json({ error: "User not found in database" }, { status: 404 })
    }

    console.log("Fetching agents for database user ID:", dbUser.id)

    // Fetch agents for this user
    const agents = await prisma.aIAgent.findMany({
      where: {
        creatorId: dbUser.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    })

    console.log(`Found ${agents.length} agents for user ${dbUser.email}`)

    return NextResponse.json(agents, { status: 200 })
  } catch (error) {
    console.error("Error fetching user agents:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch user agents",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  } finally {
    // Explicitly disconnect from Prisma to prevent connection pool issues
    await prisma.$disconnect()
  }
}

