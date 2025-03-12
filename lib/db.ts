/**
 * Database utilities for the application
 * This file provides a singleton instance of Drizzle to prevent connection issues
 */
import { db, withDb, checkDbConnection } from "./db/index";
import * as schema from "./db/schema";
import {
  userHelpers,
  aiAgentHelpers,
  verificationCodeHelpers,
  tokenHelpers,
  purchaseHelpers,
  interactionHelpers,
} from "./db/helpers";

// Export the db instance and schema
export { db, schema };

// Export helper functions
export { withDb, checkDbConnection };

// Export model helpers
export const helpers = {
  users: userHelpers,
  aiAgents: aiAgentHelpers,
  verificationCodes: verificationCodeHelpers,
  tokens: tokenHelpers,
  purchases: purchaseHelpers,
  interactions: interactionHelpers,
};

// For backward compatibility with Prisma code
export const prisma = {
  user: {
    findUnique: async ({ where }: { where: any }) => {
      if (where.id) return await userHelpers.findById(where.id);
      if (where.email) return await userHelpers.findByEmail(where.email);
      if (where.username)
        return await userHelpers.findByUsername(where.username);
      return null;
    },
    findFirst: async ({ where }: { where: any }) => {
      if (where.id) return await userHelpers.findById(where.id);
      if (where.email) return await userHelpers.findByEmail(where.email);
      if (where.username)
        return await userHelpers.findByUsername(where.username);
      return null;
    },
    create: async ({ data }: { data: any }) => await userHelpers.create(data),
    update: async ({ where, data }: { where: any; data: any }) => {
      if (where.id) return await userHelpers.update(where.id, data);
      return null;
    },
    delete: async ({ where }: { where: any }) => {
      if (where.id) return await userHelpers.delete(where.id);
      return null;
    },
  },
  aIAgent: {
    findUnique: async ({ where }: { where: any }) => {
      if (where.id) return await aiAgentHelpers.findById(where.id);
      return null;
    },
    findFirst: async ({ where }: { where: any }) => {
      if (where.id) return await aiAgentHelpers.findById(where.id);
      return null;
    },
    findMany: async ({ where }: { where: any }) => {
      if (where?.creatorId)
        return await aiAgentHelpers.findByCreatorId(where.creatorId);
      if (where?.isPublic) return await aiAgentHelpers.findPublic();
      return await db.select().from(schema.aiAgents);
    },
    create: async ({ data }: { data: any }) =>
      await aiAgentHelpers.create(data),
    update: async ({ where, data }: { where: any; data: any }) => {
      if (where.id) return await aiAgentHelpers.update(where.id, data);
      return null;
    },
    delete: async ({ where }: { where: any }) => {
      if (where.id) return await aiAgentHelpers.delete(where.id);
      return null;
    },
  },
  verificationCode: {
    findFirst: async ({ where }: { where: any }) => {
      if (where.email && where.code) {
        return await verificationCodeHelpers.findByEmailAndCode(
          where.email,
          where.code
        );
      }
      return null;
    },
    create: async ({ data }: { data: any }) =>
      await verificationCodeHelpers.create(data),
    update: async ({ where, data }: { where: any; data: any }) => {
      if (where.id && data.used)
        return await verificationCodeHelpers.markAsUsed(where.id);
      return null;
    },
  },
  token: {
    findFirst: async ({ where }: { where: any }) => {
      if (where.token) return await tokenHelpers.findByToken(where.token);
      return null;
    },
    create: async ({ data }: { data: any }) => await tokenHelpers.create(data),
    delete: async ({ where }: { where: any }) => {
      if (where.id) return await tokenHelpers.delete(where.id);
      if (where.userId) return await tokenHelpers.deleteByUserId(where.userId);
      return null;
    },
  },
  purchase: {
    findUnique: async ({ where }: { where: any }) => {
      if (where.id) return await purchaseHelpers.findById(where.id);
      return null;
    },
    findMany: async ({ where }: { where: any }) => {
      if (where?.userId)
        return await purchaseHelpers.findByUserId(where.userId);
      return await db.select().from(schema.purchases);
    },
    create: async ({ data }: { data: any }) =>
      await purchaseHelpers.create(data),
  },
  interaction: {
    findUnique: async ({ where }: { where: any }) => {
      if (where.id) return await interactionHelpers.findById(where.id);
      return null;
    },
    findMany: async ({ where }: { where: any }) => {
      if (where?.userId)
        return await interactionHelpers.findByUserId(where.userId);
      if (where?.agentId)
        return await interactionHelpers.findByAgentId(where.agentId);
      return await db.select().from(schema.interactions);
    },
    create: async ({ data }: { data: any }) =>
      await interactionHelpers.create(data),
  },
};
