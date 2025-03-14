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
let prismaInstance: PrismaClient

// In production, create a new instance
// In development, reuse the global instance to prevent multiple connections
if (process.env.NODE_ENV === "production") {
  prismaInstance = new PrismaClient({
    log: ["query", "error", "warn"], // Enable logging in production too for debugging
  })
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ["query", "error", "warn"], // Enable logging in development
    })
  }
  prismaInstance = global.prisma
}

// Export the prisma instance that is guaranteed to be defined
export const prisma = prismaInstance

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

/**
 * Checks if the database is connected
 * @returns True if connected, false otherwise
 */
export async function checkDbConnection(): Promise<boolean> {
  try {
    // Execute a simple query to check connection
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error("Database connection check failed:", error)
    return false
  }
}

