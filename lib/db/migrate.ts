import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

// This script will run migrations on your database
async function main() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  console.log("Running migrations...");

  const db = drizzle(connectionString);

  // Run migrations from the specified directory
  await migrate(db, { migrationsFolder: "drizzle/migrations" });

  console.log("Migrations completed successfully");

  process.exit(0);
}

main().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
