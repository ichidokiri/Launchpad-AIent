/**
 * Prisma seed script to initialize the database with default data
 */
import { PrismaClient } from "@prisma/client"
import * as bcrypt from "bcrypt"

// Initialize Prisma client
const prisma = new PrismaClient()

/**
 * Main seed function
 */
async function main() {
  // Check if super admin password is defined
  const superAdminPasswordEnv = process.env.SUPER_ADMIN_PASSWORD
  if (!superAdminPasswordEnv) {
    throw new Error("SUPER_ADMIN_PASSWORD environment variable is not defined")
  }

  // Create super admin password hash using env variable
  const superAdminPassword = await bcrypt.hash(superAdminPasswordEnv, 12)

  // Create or update super admin account
  const superAdmin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || "admin@tradegpt.com" },
    update: {
      password: superAdminPassword,
      role: "SUPERADMIN",
    },
    create: {
      email: process.env.ADMIN_EMAIL || "admin@tradegpt.com",
      password: superAdminPassword,
      username: "SuperAdmin",
      role: "SUPERADMIN",
    },
  })

  console.log(`Super admin account created/updated: ${superAdmin.email}`)

  // Create default AI agents
  const defaultAgents = [
    {
      name: "TradeGPT Basic",
      symbol: "TGPT-B", // Add the symbol property
      description: "Basic trading assistant with market analysis capabilities",
      price: 0, // Free tier
      features: ["Market analysis", "Basic trading signals", "Educational content"],
      isPublic: true,
      creatorId: superAdmin.id,
    },
    {
      name: "TradeGPT Pro",
      symbol: "TGPT-P", // Add the symbol property
      description: "Advanced trading assistant with real-time signals and portfolio management",
      price: 9900, // $99.00
      features: [
        "Real-time trading signals",
        "Portfolio optimization",
        "Risk management",
        "Advanced market analysis",
        "Trading strategy backtesting",
      ],
      isPublic: true,
      creatorId: superAdmin.id,
    },
    {
      name: "TradeGPT Enterprise",
      symbol: "TGPT-E", // Add the symbol property
      description: "Enterprise-grade trading solution with custom integrations",
      price: 29900, // $299.00
      features: [
        "Custom API integrations",
        "Institutional-grade analysis",
        "Multi-asset portfolio management",
        "Custom reporting",
        "Dedicated support",
      ],
      isPublic: true,
      creatorId: superAdmin.id,
    },
  ]

  // Upsert default agents
  for (const agent of defaultAgents) {
    // First check if the agent already exists by name
    const existingAgent = await prisma.aIAgent.findFirst({
      where: { name: agent.name },
    })

    if (existingAgent) {
      // Update existing agent
      const updatedAgent = await prisma.aIAgent.update({
        where: { id: existingAgent.id },
        data: agent,
      })
      console.log(`AI Agent updated: ${updatedAgent.name}`)
    } else {
      // Create new agent
      const createdAgent = await prisma.aIAgent.create({
        data: agent,
      })
      console.log(`AI Agent created: ${createdAgent.name}`)
    }
  }

  console.log("Database seeding completed successfully")
}

// Execute the seed function
main()
  .catch((e) => {
    console.error("Error during database seeding:", e)
    process.exit(1)
  })
  .finally(async () => {
    // Close Prisma client connection
    await prisma.$disconnect()
  })

