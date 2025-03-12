export const dynamic = "force-dynamic";

/**
 * API route for AI agents
 * This file handles creating and retrieving AI agents
 * Note: Prisma generates camelCase properties (aIAgent) from PascalCase models (AIAgent)
 */
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { NextRequest } from "next/server";

/**
 * Creates a new agent
 * @param req - The request object
 * @returns The response with the created agent
 */
export async function POST(req: Request) {
  try {
    // Get the authenticated user
    const user = await auth(req);
    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in to create an agent" },
        { status: 401 }
      );
    }

    const data = await req.json();
    const { name, symbol, description, price, tokenAmount, avatar } = data;

    // Validate required fields
    if (!name || !symbol || !price || !tokenAmount) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          message: "Please fill in all required fields",
        },
        { status: 400 }
      );
    }

    // Validate symbol format
    const symbolRegex = /^[A-Z0-9]{1,10}$/;
    if (!symbolRegex.test(symbol)) {
      return NextResponse.json(
        {
          error: "Invalid symbol format",
          message: "Symbol must be 1-10 uppercase letters or numbers",
        },
        { status: 400 }
      );
    }

    // Check if symbol already exists
    // Using prisma.aIAgent (camelCase)
    const existingAgent = await prisma.aIAgent.findFirst({
      where: {
        symbol: {
          equals: symbol,
          mode: "insensitive", // Case-insensitive comparison
        },
      },
    });

    if (existingAgent) {
      return NextResponse.json(
        {
          error: "Symbol already exists",
          message:
            "This symbol is already in use. Please choose a different symbol.",
        },
        { status: 400 }
      );
    }

    // Find the user in the database
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!dbUser) {
      return NextResponse.json(
        {
          error: "User not found",
          message: "Please log in again",
        },
        { status: 401 }
      );
    }

    // Create the agent
    // Using prisma.aIAgent (camelCase)
    const agent = await prisma.aIAgent.create({
      data: {
        name,
        symbol: symbol.toUpperCase(),
        description: description || "",
        price: Number(price),
        marketCap: Number(price) * Number(tokenAmount),
        logo: avatar || null,
        creatorId: dbUser.id,
      },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      agent,
      message: "AI agent created successfully",
    });
  } catch (error) {
    console.error("Error creating AI agent:", error);
    return NextResponse.json(
      {
        error: "Failed to create AI agent",
        message: "An unexpected error occurred while creating the agent",
      },
      { status: 500 }
    );
  }
}

/**
 * Retrieves agents based on query parameters
 * @returns The response with the agents
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const creatorId = searchParams.get("creatorId");

    console.log("GET /api/ai-agents - Query params:", { creatorId });

    // Create the query object
    const query: any = {};

    // Add filters if present
    if (creatorId) {
      query.where = {
        ...query.where,
        creatorId,
      };
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
    };

    console.log("Prisma query:", JSON.stringify(query, null, 2));

    const agents = await prisma.aIAgent.findMany(query);

    console.log(`Found ${agents.length} agents`);

    return NextResponse.json({ agents });
  } catch (error) {
    console.error("Error fetching agents:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch agents",
        message: error instanceof Error ? error.message : String(error),
        stack:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.stack
              : undefined
            : undefined,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
