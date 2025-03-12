import { eq, and, or, like, ilike, desc, asc, sql } from "drizzle-orm";
import { db } from "./index";
import * as schema from "./schema";

// User helpers
export const userHelpers = {
  findById: async (id: string) => {
    return await db.query.users.findFirst({
      where: eq(schema.users.id, id),
    });
  },

  findByEmail: async (email: string) => {
    return await db.query.users.findFirst({
      where: eq(schema.users.email, email),
    });
  },

  findByUsername: async (username: string) => {
    return await db.query.users.findFirst({
      where: eq(schema.users.username, username),
    });
  },

  create: async (userData: typeof schema.users.$inferInsert) => {
    const result = await db.insert(schema.users).values(userData).returning();
    return result[0];
  },

  update: async (
    id: string,
    userData: Partial<typeof schema.users.$inferInsert>
  ) => {
    const result = await db
      .update(schema.users)
      .set(userData)
      .where(eq(schema.users.id, id))
      .returning();
    return result[0];
  },

  delete: async (id: string) => {
    return await db.delete(schema.users).where(eq(schema.users.id, id));
  },
};

// AI Agent helpers
export const aiAgentHelpers = {
  findById: async (id: string) => {
    return await db.query.aiAgents.findFirst({
      where: eq(schema.aiAgents.id, id),
    });
  },

  findByCreatorId: async (creatorId: string) => {
    return await db
      .select()
      .from(schema.aiAgents)
      .where(eq(schema.aiAgents.creatorId, creatorId));
  },

  findPublic: async () => {
    return await db
      .select()
      .from(schema.aiAgents)
      .where(eq(schema.aiAgents.isPublic, true));
  },

  create: async (agentData: typeof schema.aiAgents.$inferInsert) => {
    const result = await db
      .insert(schema.aiAgents)
      .values(agentData)
      .returning();
    return result[0];
  },

  update: async (
    id: string,
    agentData: Partial<typeof schema.aiAgents.$inferInsert>
  ) => {
    const result = await db
      .update(schema.aiAgents)
      .set(agentData)
      .where(eq(schema.aiAgents.id, id))
      .returning();
    return result[0];
  },

  delete: async (id: string) => {
    return await db.delete(schema.aiAgents).where(eq(schema.aiAgents.id, id));
  },
};

// Verification Code helpers
export const verificationCodeHelpers = {
  findByEmailAndCode: async (email: string, code: string) => {
    return await db.query.verificationCodes.findFirst({
      where: and(
        eq(schema.verificationCodes.email, email),
        eq(schema.verificationCodes.code, code),
        eq(schema.verificationCodes.used, false)
      ),
    });
  },

  create: async (codeData: typeof schema.verificationCodes.$inferInsert) => {
    const result = await db
      .insert(schema.verificationCodes)
      .values(codeData)
      .returning();
    return result[0];
  },

  markAsUsed: async (id: string) => {
    const result = await db
      .update(schema.verificationCodes)
      .set({ used: true })
      .where(eq(schema.verificationCodes.id, id))
      .returning();
    return result[0];
  },
};

// Token helpers
export const tokenHelpers = {
  findByToken: async (token: string) => {
    return await db.query.tokens.findFirst({
      where: eq(schema.tokens.token, token),
    });
  },

  create: async (tokenData: typeof schema.tokens.$inferInsert) => {
    const result = await db.insert(schema.tokens).values(tokenData).returning();
    return result[0];
  },

  delete: async (id: string) => {
    return await db.delete(schema.tokens).where(eq(schema.tokens.id, id));
  },

  deleteByUserId: async (userId: string) => {
    return await db
      .delete(schema.tokens)
      .where(eq(schema.tokens.userId, userId));
  },
};

// Purchase helpers
export const purchaseHelpers = {
  findById: async (id: string) => {
    return await db.query.purchases.findFirst({
      where: eq(schema.purchases.id, id),
    });
  },

  findByUserId: async (userId: string) => {
    return await db
      .select()
      .from(schema.purchases)
      .where(eq(schema.purchases.userId, userId));
  },

  create: async (purchaseData: typeof schema.purchases.$inferInsert) => {
    const result = await db
      .insert(schema.purchases)
      .values(purchaseData)
      .returning();
    return result[0];
  },
};

// Interaction helpers
export const interactionHelpers = {
  findById: async (id: string) => {
    return await db.query.interactions.findFirst({
      where: eq(schema.interactions.id, id),
    });
  },

  findByUserId: async (userId: string) => {
    return await db
      .select()
      .from(schema.interactions)
      .where(eq(schema.interactions.userId, userId));
  },

  findByAgentId: async (agentId: string) => {
    return await db
      .select()
      .from(schema.interactions)
      .where(eq(schema.interactions.agentId, agentId));
  },

  create: async (interactionData: typeof schema.interactions.$inferInsert) => {
    const result = await db
      .insert(schema.interactions)
      .values(interactionData)
      .returning();
    return result[0];
  },
};
