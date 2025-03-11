/**
 * Script to set up Prisma properly
 */
const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

console.log("Setting up Prisma...")

// Run Prisma generate
try {
  console.log("Generating Prisma client...")
  execSync("npx prisma generate", { stdio: "inherit" })
  console.log("Prisma client generated successfully!")
} catch (error) {
  console.error("Error generating Prisma client:", error)
  process.exit(1)
}

console.log("Prisma setup complete!")

