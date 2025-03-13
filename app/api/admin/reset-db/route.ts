export const dynamic = "force-dynamic";

/**
 * API route for resetting the database
 * This file handles admin-only database reset functionality
 * Note: Prisma generates camelCase properties (aIAgent) from PascalCase models (AIAgent)
 */
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth, isAdmin } from "@/lib/auth";
import { sql } from "drizzle-orm";
import { interactions, purchases, tokens, users } from "@/lib/db/schema";
import { verificationCodes } from "@/lib/db/schema";

export async function POST(req: Request) {
  try {
    // Verify admin authorization
    const user = await auth(req);

    // Check if user is authenticated and has admin privileges
    if (!user || !isAdmin(user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Use raw SQL to truncate all tables
    // This is a more direct approach that avoids model name issues
    try {
      // Execute raw SQL to reset the database
      // Note: This is PostgreSQL-specific syntax
      await db.execute(
        sql`TRUNCATE TABLE "VerificationCode", "Interaction", "Token", "Purchase", "AIAgent", "User" CASCADE;`
      );

      return NextResponse.json({
        success: true,
        message: "Database reset successfully",
      });
    } catch (sqlError) {
      console.error("SQL error during database reset:", sqlError);

      // Fallback to individual deletes if the SQL approach fails
      console.log("Falling back to individual table deletes...");

      // Try to delete from each table individually
      // This is less efficient but more robust to schema changes
      await db.delete(verificationCodes);
      await db.delete(interactions);
      await db.delete(tokens);
      await db.delete(purchases);

      // Use the correct camelCase property name
      await db.delete(users);

      return NextResponse.json({
        success: true,
        message: "Database reset completed with fallback method",
      });
    }
  } catch (error) {
    console.error("Database reset error:", error);
    return NextResponse.json(
      {
        error: "Failed to reset database",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 }
    );
  }
}
