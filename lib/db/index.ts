/**
 * Database utilities for the application
 * This file provides a singleton instance of Drizzle to prevent connection issues
 */
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import { sql } from "drizzle-orm";

// Declare global variable for DB connection to enable singleton pattern
declare global {
  var db: ReturnType<typeof createDrizzleClient> | undefined;
}

// Function to create a Drizzle client based on the environment
function createDrizzleClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  return drizzle(connectionString, { schema });
}

// Create a singleton instance of Drizzle
let dbInstance: ReturnType<typeof createDrizzleClient>;

// In production, create a new instance
// In development, reuse the global instance to prevent multiple connections
if (process.env.NODE_ENV === "production") {
  dbInstance = createDrizzleClient();
} else {
  if (!global.db) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL environment variable is not set");
    }

    global.db = drizzle(connectionString, { schema });
  }
  dbInstance = global.db;
}

// Export the db instance that is guaranteed to be defined
export const db = dbInstance;

/**
 * Executes a database operation with proper error handling
 * @param operation - The database operation to execute
 * @returns The result of the operation
 */
export async function withDb<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    console.error("Database operation error:", error);
    throw error;
  }
}

/**
 * Checks if the database is connected
 * @returns True if connected, false otherwise
 */
export async function checkDbConnection(): Promise<boolean> {
  try {
    // Execute a simple query to check connection
    await db.execute(sql`SELECT 1`);
    return true;
  } catch (error) {
    console.error("Database connection check failed:", error);
    return false;
  }
}

// Export schema for convenience
export { schema };
