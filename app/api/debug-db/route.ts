import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // Check if prisma is initialized
    if (!prisma) {
      return NextResponse.json({
        status: "error",
        message: "Prisma client is not initialized",
      })
    }

    // Try to connect to the database
    try {
      await prisma.$queryRaw`SELECT 1`

      // Get a list of all models
      const models = Object.keys(prisma).filter(
        (key) => !key.startsWith("_") && typeof prisma[key] === "object" && prisma[key] !== null,
      )

      // Try to count users
      let userCount = 0
      try {
        userCount = await prisma.user.count()
      } catch (userError) {
        console.error("Error counting users:", userError)
      }

      return NextResponse.json({
        status: "success",
        message: "Database connection successful",
        models,
        userCount,
        prismaVersion: prisma._engineConfig?.version || "unknown",
      })
    } catch (dbError) {
      console.error("Database connection error:", dbError)
      return NextResponse.json({
        status: "error",
        message: "Database connection failed",
        error: dbError.message,
      })
    }
  } catch (error) {
    console.error("Debug route error:", error)
    return NextResponse.json({
      status: "error",
      message: "An error occurred in the debug route",
      error: error.message,
    })
  }
}

