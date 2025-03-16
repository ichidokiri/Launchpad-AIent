const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

// Paths to clear
const pathsToClear = [".next", "node_modules/.cache"]

console.log("Clearing Next.js cache...")

// Delete directories
pathsToClear.forEach((dirPath) => {
  try {
    if (fs.existsSync(dirPath)) {
      console.log(`Removing ${dirPath}...`)
      fs.rmSync(dirPath, { recursive: true, force: true })
      console.log(`Successfully removed ${dirPath}`)
    } else {
      console.log(`${dirPath} does not exist, skipping`)
    }
  } catch (error) {
    console.error(`Error removing ${dirPath}:`, error)
  }
})

console.log("Cache cleared successfully!")
console.log("Now run: pnpm install && pnpm build && pnpm start")

