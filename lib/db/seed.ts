import { db } from "./index";
import * as schema from "./schema";
import bcrypt from "bcryptjs";
import { createId } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";

async function main() {
  console.log("Starting seed...");

  // Clear existing data
  await db.delete(schema.interactions);
  await db.delete(schema.purchases);
  await db.delete(schema.tokens);
  await db.delete(schema.verificationCodes);
  await db.delete(schema.aiAgents);
  await db.delete(schema.users);

  console.log("Cleared existing data");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await db
    .insert(schema.users)
    .values({
      id: createId(),
      name: "Admin User",
      email: "admin@example.com",
      username: "admin",
      password: adminPassword,
      role: "ADMIN",
      status: "active",
      monadBalance: 1000,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  console.log("Created admin user:", admin[0].email);

  // Create regular user
  const userPassword = await bcrypt.hash("user123", 10);
  const user = await db
    .insert(schema.users)
    .values({
      id: createId(),
      name: "Regular User",
      email: "user@example.com",
      username: "user",
      password: userPassword,
      role: "USER",
      status: "active",
      monadBalance: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  console.log("Created regular user:", user[0].email);

  // Create sample AI agents
  const agents = [
    {
      id: createId(),
      name: "Financial Advisor",
      description:
        "AI agent that provides financial advice and investment strategies",
      model: "gpt-4",
      systemPrompt:
        "You are a financial advisor AI. Provide sound financial advice and investment strategies.",
      category: "Finance",
      isPublic: true,
      price: 5,
      creatorId: admin[0].id,
      symbol: "FINA",
      marketCap: 10000,
      totalSupply: 1000000,
      holders: 120,
      verified: true,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: createId(),
      name: "Fitness Coach",
      description:
        "AI agent that helps with workout plans and nutrition advice",
      model: "gpt-3.5-turbo",
      systemPrompt:
        "You are a fitness coach AI. Provide workout plans and nutrition advice.",
      category: "Health",
      isPublic: true,
      price: 3,
      creatorId: admin[0].id,
      symbol: "FITN",
      marketCap: 5000,
      totalSupply: 500000,
      holders: 75,
      verified: true,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: createId(),
      name: "Code Assistant",
      description: "AI agent that helps with programming and debugging",
      model: "gpt-4",
      systemPrompt:
        "You are a coding assistant AI. Help with programming questions and debugging.",
      category: "Technology",
      isPublic: true,
      price: 10,
      creatorId: user[0].id,
      symbol: "CODE",
      marketCap: 20000,
      totalSupply: 2000000,
      holders: 250,
      verified: true,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  for (const agent of agents) {
    await db.insert(schema.aiAgents).values(agent);
    console.log("Created AI agent:", agent.name);
  }

  console.log("Seed completed successfully");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    // Close the database connection
    await db.execute(sql`SELECT 1`); // Dummy query to ensure connection is active
    process.exit(0);
  });
