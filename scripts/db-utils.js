/**
 * Database Utility Script
 *
 * This script provides various database utilities:
 * - Check database connection
 * - View database contents (users and agents)
 * - Test database by creating sample data
 * - Check and fix database schema issues
 *
 * Usage: node scripts/db-utils.js [command]
 * Commands:
 *   check - Check database contents
 *   test - Test database connection and create test data
 *   schema - Check database schema
 *   fix - Attempt to fix database schema issues
 *   help - Show this help message
 */

const { PrismaClient } = require("@prisma/client")

// Create Prisma client with logging
const prisma = new PrismaClient({
  log: ["error", "warn"],
})

// Parse command line arguments
const args = process.argv.slice(2)
const command = args[0] || "help"

// Main function
async function main() {
  try {
    switch (command) {
      case "check":
        await checkDatabase()
        break
      case "test":
        await testDatabase()
        break
      case "schema":
        await checkSchema()
        break
      case "fix":
        await fixSchema()
        break
      case "help":
      default:
        showHelp()
        break
    }
  } catch (error) {
    console.error("❌ Error:", error)
  } finally {
    await prisma.$disconnect()
  }
}

// Show help message
function showHelp() {
  console.log(`
Database Utility Script

Usage: node scripts/db-utils.js [command]

Commands:
  check  - Check database contents (users and agents)
  test   - Test database connection and create test data
  schema - Check database schema
  fix    - Attempt to fix database schema issues
  help   - Show this help message
  `)
}

// Check database contents (from check-db.js)
async function checkDatabase() {
  try {
    console.log("\n🔍 Checking database contents...\n")

    // Test connection first
    await testConnection()

    // Get all agents with their creators
    const agents = await prisma.aIAgent.findMany({
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    console.log(`📊 Found ${agents.length} agents in the database:\n`)

    agents.forEach((agent, index) => {
      console.log(`Agent ${index + 1}:`)
      console.log("----------------------------------------")
      console.log(`ID: ${agent.id}`)
      console.log(`Name: ${agent.name}`)
      console.log(`Symbol: ${agent.symbol}`)
      console.log(`Price: $${agent.price}`)
      console.log(`Market Cap: $${agent.marketCap}`)
      console.log(`Created At: ${agent.createdAt}`)
      console.log(`Creator: ${agent.creator.email} (ID: ${agent.creator.id})`)
      console.log("----------------------------------------\n")
    })

    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            agents: true,
          },
        },
      },
    })

    console.log(`👥 Found ${users.length} users in the database:\n`)

    users.forEach((user, index) => {
      console.log(`User ${index + 1}:`)
      console.log("----------------------------------------")
      console.log(`ID: ${user.id}`)
      console.log(`Email: ${user.email}`)
      console.log(`Role: ${user.role}`)
      console.log(`Created At: ${user.createdAt}`)
      console.log(`Number of Agents: ${user._count.agents}`)
      console.log("----------------------------------------\n")
    })
  } catch (error) {
    console.error("❌ Error checking database:", error)
    throw error
  }
}

// Test database connection (from test-db.js)
async function testDatabase() {
  try {
    console.log("🔍 Testing database connection and functionality...\n")

    // Test connection
    await testConnection()

    // Find a user to use as creator
    const user = await prisma.user.findFirst()
    console.log("Found user:", user ? user.id : "No users found")

    if (!user) {
      console.log("No users found. Creating a test user...")
      await prisma.user.create({
        data: {
          email: "test@example.com",
          password: "hashed_password",
          role: "USER",
        },
      })
    }

    // Check AIAgent model
    console.log("\n📊 Checking AIAgent model...")

    // Get the correct model name from Prisma
    const modelNames = Object.keys(prisma).filter(
      (key) => key.toLowerCase().includes("agent") && typeof prisma[key] === "object",
    )
    console.log("Available model names:", modelNames)

    // Use the correct model name (likely aIAgent)
    const modelName = modelNames.find((name) => name.toLowerCase() === "aiagent") || "aIAgent"
    console.log("Using model name:", modelName)

    // Try to create an agent directly
    console.log("\n🧪 Attempting to create a test agent...")
    const agent = await prisma[modelName].create({
      data: {
        name: "Test Agent " + new Date().toISOString(),
        description: "Created by test script",
        symbol: "$TEST",
        marketCap: 100,
        price: 0.01,
        creatorId: (await prisma.user.findFirst()).id,
      },
    })

    console.log("✅ Agent created successfully:", agent)

    // List all agents
    const agents = await prisma[modelName].findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    })
    console.log(`\n📈 Found ${agents.length} agents (showing latest 5):`, agents)
  } catch (error) {
    console.error("❌ Error testing database:", error)
    throw error
  }
}

// Check database schema (from debug-db.js and fix-db-schema.js)
async function checkSchema() {
  try {
    console.log("🔍 Checking database schema...\n")

    // Test connection
    await testConnection()

    // Check if the AIAgent table exists
    const tableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'AIAgent'
      ) as exists
    `

    console.log("AIAgent table exists:", tableExists[0].exists)

    if (!tableExists[0].exists) {
      console.log("❌ AIAgent table does not exist. Please run prisma migrate dev to create it.")
      return
    }

    // Check AIAgent model schema
    console.log("\n📊 Checking AIAgent model schema...")
    const aiAgentSchema = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'AIAgent'
    `
    console.log("AIAgent schema:", aiAgentSchema)

    // Check required columns
    const requiredColumns = ["name", "creatorId", "symbol", "marketCap"]
    const missingColumns = requiredColumns.filter((col) => !aiAgentSchema.some((c) => c.column_name === col))

    if (missingColumns.length > 0) {
      console.log("❌ Missing required columns:", missingColumns)
      console.log("Please update your Prisma schema and run prisma migrate dev")
    } else {
      console.log("✅ All required columns exist")
    }

    // Check User model schema
    console.log("\n📊 Checking User model schema...")
    const userSchema = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'User'
    `
    console.log("User schema:", userSchema)
  } catch (error) {
    console.error("❌ Error checking database schema:", error)
    throw error
  }
}

// Fix database schema issues (from fix-db-schema.js)
async function fixSchema() {
  try {
    console.log("🔧 Attempting to fix database schema issues...\n")

    // Check schema first
    await checkSchema()

    console.log("\n⚠️ This function doesn't actually modify the schema.")
    console.log("To fix schema issues, please update your Prisma schema and run:")
    console.log("npx prisma migrate dev")
  } catch (error) {
    console.error("❌ Error fixing database schema:", error)
    throw error
  }
}

// Test database connection
async function testConnection() {
  try {
    const result = await prisma.$queryRaw`SELECT 1 as connected`
    console.log("✅ Database connection successful:", result)
    return true
  } catch (error) {
    console.error("❌ Database connection failed:", error)
    throw error
  }
}

// Run the main function
main().catch((e) => {
  console.error(e)
  process.exit(1)
})

