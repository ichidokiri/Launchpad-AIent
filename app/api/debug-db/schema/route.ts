import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  try {
    // Get database schema information
    const userTableInfo = await prisma.$queryRaw`
      SELECT 
        table_name, 
        column_name, 
        data_type 
      FROM 
        information_schema.columns 
      WHERE 
        table_name = 'User'
    `

    const aiAgentTableInfo = await prisma.$queryRaw`
      SELECT 
        table_name, 
        column_name, 
        data_type 
      FROM 
        information_schema.columns 
      WHERE 
        table_name = 'AIAgent'
    `

    // Return diagnostic info
    return NextResponse.json(
      {
        databaseStatus: "connected",
        schema: {
          User: userTableInfo,
          AIAgent: aiAgentTableInfo,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Database schema diagnostic error:", error)
    return NextResponse.json(
      {
        error: "Failed to run database schema diagnostics",
        message: error instanceof Error ? error.message : String(error),
        stack: process.env.NODE_ENV === "development" ? (error instanceof Error ? error.stack : undefined) : undefined,
      },
      { status: 500 },
    )
  }
}

