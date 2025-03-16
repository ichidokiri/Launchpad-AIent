import { PrismaClient } from "@prisma/client"

// Prevent multiple instances of Prisma Client in development
declare global {
  var prisma: PrismaClient | undefined
}

// Simple singleton pattern
const prismaGlobal = global as typeof globalThis & {
  prisma?: PrismaClient
}

// Create Prisma client with explicit connection URL from environment
export const prisma =
  prismaGlobal.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })

// Log the database URL being used (with password redacted for security)
if (process.env.DATABASE_URL) {
  const dbUrlForLogging = process.env.DATABASE_URL.replace(/postgresql:\/\/([^:]+):([^@]+)@/, "postgresql://$1:****@")
  console.log(`Using database URL: ${dbUrlForLogging}`)
}

if (process.env.NODE_ENV !== "production") {
  prismaGlobal.prisma = prisma
}

export default prisma

