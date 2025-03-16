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

