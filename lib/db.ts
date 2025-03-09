/**
 * Database utilities for the application
 * This file provides a singleton instance of PrismaClient to prevent connection issues
 */
import { PrismaClient } from "@prisma/client"

// Declare global variable for PrismaClient to enable singleton pattern
declare global {
  var prisma: PrismaClient | undefined
}

// Create a singleton instance of PrismaClient
let prisma: PrismaClient

// In production, create a new instance
// In development, reuse the global instance to prevent multiple connections
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient()
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ["query", "error", "warn"], // Enable logging in development
    })
  }
  prisma = global.prisma
}

export { prisma }

/**
 * Safely disconnects from the database
 * Use this in API routes to prevent connection leaks
 */
export async function disconnectDb(): Promise<void> {
  try {
    await prisma.$disconnect()
  } catch (error) {
    console.error("Error disconnecting from database:", error)
  }
}

/**
 * Executes a database operation with proper error handling and connection management
 * @param operation - The database operation to execute
 * @returns The result of the operation
 */
export async function withDb<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    console.error("Database operation error:", error)
    throw error
  } finally {
    // No need to disconnect here as we're using a singleton
  }
}

