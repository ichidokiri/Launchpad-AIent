import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

// This is a workaround for the type issue in Next.js 15.1.0
interface RouteParams {
  symbol: string
}

export async function GET(request: NextRequest, { params }: { params: RouteParams }) {
  try {
    const symbol = params.symbol

    if (!symbol) {
      return NextResponse.json({ error: "Symbol is required" }, { status: 400 })
    }

    // Find the agent by symbol (case insensitive)
    const agent = await prisma.aIAgent.findFirst({
      where: {
        symbol: {
          equals: symbol,
          mode: "insensitive", // Case insensitive search
        },
      },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            username: true,
          },
        },
      },
    })

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 })
    }

    return NextResponse.json({ agent })
  } catch (error) {
    console.error("Error fetching agent by symbol:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch agent",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 },
    )
  }
}

