export const dynamic = "force-dynamic"

/**
 * API route for managing individual agents
 * This file handles retrieving, updating, and deleting agents by ID
 * Note: Prisma generates camelCase properties (aIAgent) from PascalCase models (AIAgent)
 */
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

/**
 * Retrieves an agent by ID
 * @param request - The request object
 * @param params - The route parameters
 * @returns The response with the agent
 */
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Await params before accessing
    const { id: paramId } = await params
    const id = Number.parseInt(paramId)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid agent ID" }, { status: 400 })
    }

    // Using prisma.aIAgent (camelCase) instead of prisma.AIAgent
    const agent = await prisma.aIAgent.findUnique({
      where: { id: id.toString() }, // Convert to string since your ID is a string in the schema
      include: {
        creator: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    })

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 })
    }

    return NextResponse.json({ agent })
  } catch (error) {
    console.error("Error fetching agent:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch agent",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 },
    )
  }
}

/**
 * Deletes an agent by ID
 * @param request - The request object
 * @param params - The route parameters
 * @returns The response with the deletion result
 */
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Get the authenticated user
    const user = await auth(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the ID from params
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "Invalid agent ID" }, { status: 400 })
    }

    console.log("Deleting agent with ID:", id)

    // Find the agent first to check ownership
    const agent = await prisma.aIAgent.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    })

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 })
    }

    // Check if the user is the creator or an admin
    if (agent.creator.email !== user.email && user.role.toLowerCase() !== "admin") {
      return NextResponse.json({ error: "Unauthorized to delete this agent" }, { status: 403 })
    }

    // Delete the agent
    await prisma.aIAgent.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, message: "Agent deleted successfully" })
  } catch (error) {
    console.error("Error deleting agent:", error)
    return NextResponse.json(
      {
        error: "Failed to delete agent",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 },
    )
  }
}

/**
 * Updates an agent by ID
 * @param request - The request object
 * @param params - The route parameters
 * @returns The response with the updated agent
 */
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    // Get the authenticated user
    const user = await auth(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Await params before accessing
    const { id: paramId } = await params
    const id = Number.parseInt(paramId)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid agent ID" }, { status: 400 })
    }

    // Find the agent first to check ownership
    // Using prisma.aIAgent (camelCase)
    const agent = await prisma.aIAgent.findUnique({
      where: { id: id.toString() }, // Convert to string
      include: {
        creator: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    })

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 })
    }

    // Check if the user is the creator or an admin
    if (agent.creator.email !== user.email && user.role.toLowerCase() !== "admin") {
      return NextResponse.json({ error: "Unauthorized to update this agent" }, { status: 403 })
    }

    // Get the update data
    const data = await request.json()

    // Update the agent
    // Using prisma.aIAgent (camelCase)
    const updatedAgent = await prisma.aIAgent.update({
      where: { id: id.toString() }, // Convert to string
      data,
      include: {
        creator: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({ success: true, agent: updatedAgent })
  } catch (error) {
    console.error("Error updating agent:", error)
    return NextResponse.json(
      {
        error: "Failed to update agent",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

