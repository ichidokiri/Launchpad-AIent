/**
 * Build fix script
 * This script cleans up cache and temporary files that might be causing build issues
 */
const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

// Paths to clear
const pathsToClear = [".next", "node_modules/.cache", ".vercel/output"]

console.log("🔧 Starting build fix process...")

// Clear cache directories
pathsToClear.forEach((dirPath) => {
  const fullPath = path.join(process.cwd(), dirPath)
  if (fs.existsSync(fullPath)) {
    console.log(`Clearing ${dirPath}...`)
    try {
      fs.rmSync(fullPath, { recursive: true, force: true })
      console.log(`✅ Cleared ${dirPath}`)
    } catch (error) {
      console.error(`❌ Error clearing ${dirPath}:`, error)
    }
  } else {
    console.log(`⚠️ Path ${dirPath} does not exist, skipping.`)
  }
})

// Update next.config.js to disable certain features that might be causing issues
try {
  const configPath = "next.config.js"
  const configExists = fs.existsSync(configPath)

  if (configExists) {
    console.log(`Updating ${configPath} to fix build issues...`)
    const nextConfigPath = path.join(process.cwd(), configPath)
    let nextConfig = fs.readFileSync(nextConfigPath, "utf8")

    // Disable experimental features that might be causing issues
    nextConfig = nextConfig.replace(
      /experimental:\s*{[^}]*}/,
      `experimental: {
      serverComponentsExternalPackages: ["@prisma/client", "bcryptjs"],
      outputFileTracingRoot: undefined,
      // Disable features that might be causing build issues
      optimizeCss: false,
      swcMinify: true
    }`,
    )

    fs.writeFileSync(nextConfigPath, nextConfig)
    console.log("✅ Updated next.config.js")
  } else {
    console.log("❌ No next.config.js found")
  }
} catch (error) {
  console.error(`❌ Error updating next config: ${error}`)
}

// Run build with clean flag
console.log("🚀 Running build with clean flag...")
try {
  execSync("npx prisma generate", { stdio: "inherit" })
  console.log("✅ Prisma client generated successfully")
} catch (error) {
  console.error("❌ Error generating Prisma client:", error)
}

console.log("✨ Build fix process completed. Try building your project again with:")
console.log("pnpm build")

