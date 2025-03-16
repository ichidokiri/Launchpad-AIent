/**
 * Database utilities for the application
 * This file provides a singleton instance of PrismaClient to prevent connection issues
 */
import { PrismaClient } from "@prisma/client"

// Prevent multiple instances of Prisma Client in development
declare global {
  var prisma: PrismaClient | undefined
}

// Use a simplified approach to avoid build issues
export const prisma = global.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma
}

// Simple function to check if a user exists
export async function userExists(userId: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })
    return !!user
  } catch (error) {
    console.error("Error checking if user exists:", error)
    return false
  }
}

/**
 * Safely disconnects from the database
 * Use this in API routes to prevent connection leaks
 */
export async function disconnectDb(): Promise<void> {
  try {
    if (prisma) {
      await prisma.$disconnect()
    }
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
    if (!prisma) {
      throw new Error("PrismaClient is not initialized")
    }
    return await operation()
  } catch (error) {
    console.error("Database operation error:", error)
    throw error
  }
}

/**
 * Checks if the database is connected
 * @returns True if connected, false otherwise
 */
export async function checkDbConnection(): Promise<boolean> {
  try {
    if (!prisma) {
      console.error("PrismaClient is not initialized")
      return false
    }
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error("Database connection check failed:", error)
    return false
  }
}

