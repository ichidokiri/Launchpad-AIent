/**
 * Environment variables validation
 * This file validates required environment variables at startup
 */

// Define required environment variables
const REQUIRED_ENV_VARS = ["DATABASE_URL", "JWT_SECRET", "OPENAI_API_KEY"]

/**
 * Validates that all required environment variables are set
 * @returns Object with validation result and missing variables
 */
export function validateEnv(): { valid: boolean; missing: string[] } {
  const missing: string[] = []

  for (const envVar of REQUIRED_ENV_VARS) {
    if (!process.env[envVar]) {
      missing.push(envVar)
    }
  }

  return {
    valid: missing.length === 0,
    missing,
  }
}

/**
 * Logs warnings for missing environment variables
 * Call this function early in the application startup
 */
export function checkEnv(): void {
  const { valid, missing } = validateEnv()

  if (!valid) {
    console.warn("⚠️ Missing required environment variables:")
    missing.forEach((envVar) => {
      console.warn(`  - ${envVar}`)
    })
    console.warn("Some features may not work correctly without these variables.")
  }
}

