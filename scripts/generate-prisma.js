/**
 * Script to generate Prisma client
 * Run this script before building the application
 */
const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

// Check if prisma directory exists
const prismaDir = path.join(__dirname, "..", "prisma")
if (!fs.existsSync(prismaDir)) {
  console.error("Prisma directory not found. Make sure you have a prisma directory with a schema.prisma file.")
  process.exit(1)
}

// Check if schema.prisma exists
const schemaPath = path.join(prismaDir, "schema.prisma")
if (!fs.existsSync(schemaPath)) {
  console.error("schema.prisma not found. Make sure you have a valid schema.prisma file in the prisma directory.")
  process.exit(1)
}

console.log("Generating Prisma client...")

try {
  // Generate Prisma client
  execSync("npx prisma generate", { stdio: "inherit" })
  console.log("Prisma client generated successfully!")
} catch (error) {
  console.error("Error generating Prisma client:", error)
  process.exit(1)
}

