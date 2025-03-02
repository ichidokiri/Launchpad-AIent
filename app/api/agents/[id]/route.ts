import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Await params before accessing
    const { id: paramId } = await params
    const id = Number.parseInt(paramId)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid agent ID" }, { status: 400 })
    }

    const agent = await prisma.agent.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            email: true, // Removed username as it's not in the schema
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

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
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
    const agent = await prisma.agent.findUnique({
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
    if (agent.creator.email !== user.email && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized to delete this agent" }, { status: 403 })
    }

    // Delete the agent
    await prisma.agent.delete({
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

