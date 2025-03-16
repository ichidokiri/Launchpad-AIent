const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

// Directories to clean
const dirsToRemove = [".next", ".vercel", "node_modules/.cache"]

console.log("🧹 Cleaning project...")

// Remove directories
dirsToRemove.forEach((dir) => {
  const dirPath = path.join(__dirname, "..", dir)
  if (fs.existsSync(dirPath)) {
    console.log(`Removing ${dir}...`)
    try {
      fs.rmSync(dirPath, { recursive: true, force: true })
      console.log(`✅ Removed ${dir}`)
    } catch (error) {
      console.error(`❌ Error removing ${dir}:`, error.message)
    }
  } else {
    console.log(`Directory ${dir} does not exist, skipping.`)
  }
})

// Clear npm cache
console.log("Clearing npm cache...")
try {
  execSync("npm cache clean --force", { stdio: "inherit" })
  console.log("✅ npm cache cleared")
} catch (error) {
  console.error("❌ Error clearing npm cache:", error.message)
}

// Clear pnpm store if pnpm is installed
try {
  execSync("which pnpm", { stdio: "ignore" })
  console.log("Clearing pnpm store...")
  try {
    execSync("pnpm store prune", { stdio: "inherit" })
    console.log("✅ pnpm store cleared")
  } catch (pnpmError) {
    console.error("❌ Error clearing pnpm store:", pnpmError.message)
  }
} catch {
  console.log("pnpm not installed, skipping pnpm store cleanup")
}

console.log("🎉 Cleanup complete!")
console.log("Next steps:")
console.log("1. Run: pnpm install")
console.log("2. Run: pnpm build")
console.log("3. Run: pnpm start")

