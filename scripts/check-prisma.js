const { PrismaClient } = require("@prisma/client")

async function checkPrisma() {
  console.log("🔍 Checking Prisma setup...")

  let prisma
  try {
    prisma = new PrismaClient()
    console.log("✅ PrismaClient initialized successfully")
  } catch (error) {
    console.error("❌ Error initializing PrismaClient:", error.message)
    process.exit(1)
  }

  try {
    console.log("Connecting to database...")
    await prisma.$connect()
    console.log("✅ Connected to database successfully")
  } catch (error) {
    console.error("❌ Error connecting to database:", error.message)
    console.error("Please check your DATABASE_URL in .env file")
    process.exit(1)
  }

  try {
    console.log("Checking available models...")
    const dmmf = prisma._baseDmmf.modelMap
    console.log("Available models:")
    Object.keys(dmmf).forEach((model) => {
      console.log(`- ${model}`)
    })
  } catch (error) {
    console.error("❌ Error checking models:", error.message)
  }

  try {
    console.log("Checking User table...")
    const userCount = await prisma.user.count()
    console.log(`✅ User table exists with ${userCount} records`)
  } catch (error) {
    console.error("❌ Error checking User table:", error.message)
    console.error("This might indicate a schema mismatch or missing table")
  }

  try {
    console.log("Checking AIAgent table...")
    // Try both casing variations
    try {
      const agentCount = await prisma.aIAgent.count()
      console.log(`✅ aIAgent table exists with ${agentCount} records`)
    } catch (error) {
      try {
        const agentCount = await prisma.AIAgent.count()
        console.log(`✅ AIAgent table exists with ${agentCount} records`)
      } catch (innerError) {
        console.error("❌ Error checking AIAgent table (tried both aIAgent and AIAgent):", error.message)
        console.error("This might indicate a schema mismatch or missing table")
      }
    }
  } catch (error) {
    console.error("❌ Error checking AIAgent table:", error.message)
  }

  try {
    await prisma.$disconnect()
    console.log("✅ Disconnected from database")
  } catch (error) {
    console.error("❌ Error disconnecting from database:", error.message)
  }

  console.log("🎉 Prisma check complete!")
}

checkPrisma().catch((error) => {
  console.error("Unhandled error during Prisma check:", error)
  process.exit(1)
})

