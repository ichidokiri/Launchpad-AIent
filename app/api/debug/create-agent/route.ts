export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`

    // Get recent agent creation attempts
    const recentAgents = await prisma.aIAgent.findMany({
      take: 10,
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

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      recentAgents,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Debug endpoint error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Database connection failed",
        message: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    console.log("Debug agent creation request:", body)

    // Find a user to use as creator
    const user = await prisma.user.findFirst()

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "No users found in database",
          message: "Please create a user first",
        },
        { status: 400 },
      )
    }

    // Create a test agent
    const testAgent = await prisma.aIAgent.create({
      data: {
        name: body.name || "Test Agent",
        description: body.description || "Created by debug endpoint",
        symbol: body.symbol || "TEST",
        price: typeof body.price === "number" ? body.price : 0.01,
        marketCap: typeof body.marketCap === "number" ? body.marketCap : 100,
        creatorId: user.id,
        model: "gpt-3.5-turbo",
        category: "test",
        isPublic: true,
        logo: body.avatar || null,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Test agent created successfully",
      agent: testAgent,
      user: {
        id: user.id,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Debug agent creation error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create test agent",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

