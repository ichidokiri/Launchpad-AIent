export const dynamic = "force-dynamic"

/**
 * API route for managing individual agents
 * This file handles retrieving, updating, and deleting agents by ID or symbol
 */
import { auth } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// Simple GET handler
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const idOrSymbol = params.id

    // Find agent by ID
    let agent = await prisma.aIAgent.findUnique({
      where: { id: idOrSymbol },
      include: { creator: { select: { id: true, email: true } } },
    })

    // If not found, try by symbol
    if (!agent) {
      agent = await prisma.aIAgent.findFirst({
        where: { symbol: { equals: idOrSymbol, mode: "insensitive" } },
        include: { creator: { select: { id: true, email: true } } },
      })
    }

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 })
    }

    return NextResponse.json({ agent })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch agent" }, { status: 500 })
  }
}

// Simple DELETE handler
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await auth(req)
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const id = params.id
    const agent = await prisma.aIAgent.findUnique({
      where: { id },
      include: { creator: { select: { id: true, email: true } } },
    })

    if (!agent) return NextResponse.json({ error: "Agent not found" }, { status: 404 })

    if (agent.creator.email !== user.email && user.role.toLowerCase() !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    await prisma.aIAgent.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete agent" }, { status: 500 })
  }
}

// Simple PATCH handler
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await auth(req)
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const id = params.id
    const agent = await prisma.aIAgent.findUnique({
      where: { id },
      include: { creator: { select: { id: true, email: true } } },
    })

    if (!agent) return NextResponse.json({ error: "Agent not found" }, { status: 404 })

    if (agent.creator.email !== user.email && user.role.toLowerCase() !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const data = await req.json()
    const updatedAgent = await prisma.aIAgent.update({
      where: { id },
      data,
      include: { creator: { select: { id: true, email: true } } },
    })

    return NextResponse.json({ success: true, agent: updatedAgent })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update agent" }, { status: 500 })
  }
}

