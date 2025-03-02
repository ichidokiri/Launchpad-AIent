import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(req: Request) {
    try {
        // Get the authenticated user
        const user = await auth(req)
        if (!user) {
            return NextResponse.json({ error: "You must be logged in to create an agent" }, { status: 401 })
        }

        const data = await req.json()
        const { name, symbol, description, price, tokenAmount, avatar } = data

        // Validate required fields
        if (!name || !symbol || !price || !tokenAmount) {
            return NextResponse.json(
                {
                    error: "Missing required fields",
                    message: "Please fill in all required fields",
                },
                { status: 400 },
            )
        }

        // Validate symbol format
        const symbolRegex = /^[A-Z0-9]{1,10}$/
        if (!symbolRegex.test(symbol)) {
            return NextResponse.json(
                {
                    error: "Invalid symbol format",
                    message: "Symbol must be 1-10 uppercase letters or numbers",
                },
                { status: 400 },
            )
        }

        // Check if symbol already exists
        const existingAgent = await prisma.agent.findFirst({
            where: {
                symbol: {
                    equals: symbol,
                    mode: "insensitive", // Case-insensitive comparison
                },
            },
        })

        if (existingAgent) {
            return NextResponse.json(
                {
                    error: "Symbol already exists",
                    message: "This symbol is already in use. Please choose a different symbol.",
                },
                { status: 400 },
            )
        }

        // Find the user in the database
        const dbUser = await prisma.user.findUnique({
            where: { email: user.email },
        })

        if (!dbUser) {
            return NextResponse.json(
                {
                    error: "User not found",
                    message: "Please log in again",
                },
                { status: 401 },
            )
        }

        // Create the agent
        const agent = await prisma.agent.create({
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
        })

        return NextResponse.json({
            success: true,
            agent,
            message: "AI agent created successfully",
        })
    } catch (error) {
        console.error("Error creating AI agent:", error)
        return NextResponse.json(
            {
                error: "Failed to create AI agent",
                message: "An unexpected error occurred while creating the agent",
            },
            { status: 500 },
        )
    }
}

export async function GET() {
    try {
        const agents = await prisma.agent.findMany({
            include: {
                creator: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc", // Show newest agents first
            },
        })

        return NextResponse.json({ agents })
    } catch (error) {
        console.error("Error fetching agents:", error)
        return NextResponse.json(
            {
                error: "Failed to fetch agents",
                message: "An unexpected error occurred while fetching agents",
            },
            { status: 500 },
        )
    }
}

