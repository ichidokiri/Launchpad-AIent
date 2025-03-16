import { PrismaClient } from "@prisma/client"

// Prevent multiple instances of Prisma Client in development
declare global {
  var prisma: PrismaClient | undefined
}

// Simple singleton pattern
const prismaGlobal = global as typeof globalThis & {
  prisma?: PrismaClient
}

export const prisma = prismaGlobal.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") {
  prismaGlobal.prisma = prisma
}

export default prisma

