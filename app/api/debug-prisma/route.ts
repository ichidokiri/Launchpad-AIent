import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

export const dynamic = "force-dynamic"

export async function GET() {
  const prisma = new PrismaClient()

  try {
    console.log("Testing Prisma connection...")
    await prisma.$connect()
    console.log("Prisma connected successfully")

    // Get all model names
    const modelNames = Object.keys(prisma).filter(
      (key) => !key.startsWith("_") && !key.startsWith("$") && typeof prisma[key as keyof typeof prisma] === "object",
    )

    console.log("Available Prisma models:", modelNames)

    // Try to get the table names from the database
    const tableNames = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `

    return NextResponse.json({
      status: "Connected",
      modelNames,
      tableNames,
      prismaClientVersion: prisma._engineConfig?.version || "unknown",
    })
  } catch (error) {
    console.error("Prisma diagnostic error:", error)
    return NextResponse.json(
      {
        status: "Error",
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  } finally {
    await prisma.$disconnect()
  }
}

