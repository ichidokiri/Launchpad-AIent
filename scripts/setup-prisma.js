/**
 * Script to set up Prisma properly
 */
const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

console.log("Setting up Prisma...")

// Check if .env file exists
const envPath = path.join(__dirname, "..", ".env")
if (!fs.existsSync(envPath)) {
  console.log("Creating .env file from .env.example...")
  try {
    // Check if .env.example exists
    const envExamplePath = path.join(__dirname, "..", ".env.example")
    if (fs.existsSync(envExamplePath)) {
      fs.copyFileSync(envExamplePath, envPath)
      console.log(".env file created from .env.example")
    } else {
      // Create a basic .env file
      fs.writeFileSync(envPath, 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tradegpt?schema=public"\n')
      console.log("Basic .env file created")
    }
  } catch (error) {
    console.error("Error creating .env file:", error)
  }
}

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

