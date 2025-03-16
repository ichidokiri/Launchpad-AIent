/**
 * Database Connection Verification Script
 *
 * This script verifies the database connection and helps diagnose connection issues.
 * Run with: npx ts-node scripts/verify-db-connection.ts
 */

import { PrismaClient } from "@prisma/client"
import * as dotenv from "dotenv"

// Load environment variables
dotenv.config()

async function main() {
  console.log("Database Connection Verification")
  console.log("================================\n")

  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL is not set in environment variables")
    console.log("Please check your .env file and make sure DATABASE_URL is properly configured")
    process.exit(1)
  }

  // Display the database URL (with password redacted)
  const dbUrlForLogging = process.env.DATABASE_URL.replace(/postgresql:\/\/([^:]+):([^@]+)@/, "postgresql://$1:****@")
  console.log(`📊 Using database URL: ${dbUrlForLogging}`)

  // Extract host and port from DATABASE_URL
  const urlMatch = process.env.DATABASE_URL.match(/postgresql:\/\/.*?@([^:]+):(\d+)\//)
  if (urlMatch) {
    const [, host, port] = urlMatch
    console.log(`📌 Host: ${host}`)
    console.log(`🔌 Port: ${port}`)
  } else {
    console.warn("⚠️ Could not parse host and port from DATABASE_URL")
  }

  // Create a new Prisma client with explicit connection URL
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })

  try {
    console.log("\n🔍 Testing database connection...")

    // Simple query to test connection
    const result = await prisma.$queryRaw`SELECT 1 as connected`
    console.log("✅ Database connection successful:", result)

    // Check if the User table exists
    console.log("\n🔍 Checking if User table exists...")
    const tableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'User'
      ) as exists
    `

    if (tableExists[0].exists) {
      console.log("✅ User table exists")

      // Count users
      const userCount = await prisma.user.count()
      console.log(`👥 Found ${userCount} users in the database`)
    } else {
      console.log("❌ User table does not exist")
      console.log("You may need to run migrations: npx prisma migrate dev")
    }
  } catch (error) {
    console.error("❌ Database connection failed:", error)

    // Provide helpful suggestions based on the error
    if (error.message.includes("Can't reach database server")) {
      console.log("\n🔧 Troubleshooting suggestions:")
      console.log("1. Make sure PostgreSQL is running on the specified host and port")
      console.log("2. Check if the host and port in DATABASE_URL are correct")
      console.log("3. Verify that your firewall allows connections to the database port")
      console.log("4. If using localhost, try using 127.0.0.1 instead")
    }
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

