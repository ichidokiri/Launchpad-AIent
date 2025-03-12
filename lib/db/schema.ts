import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  real,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

// User table
export const users = pgTable(
  "users",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    name: text("name"),
    email: text("email").notNull(),
    username: text("username"),
    password: text("password").notNull(),
    role: text("role").notNull().default("USER"),
    status: text("status").default("active"),
    monadBalance: real("monad_balance").default(0),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => {
    return {
      emailIdx: uniqueIndex("email_idx").on(table.email),
      usernameIdx: uniqueIndex("username_idx").on(table.username),
    };
  }
);

// AI Agent table
export const aiAgents = pgTable("ai_agents", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  description: text("description"),
  model: text("model").notNull().default("gpt-3.5-turbo"),
  systemPrompt: text("system_prompt"),
  category: text("category").notNull().default("Other"),
  isPublic: boolean("is_public").notNull().default(false),
  price: real("price").notNull().default(0),
  creatorId: text("creator_id")
    .notNull()
    .references(() => users.id),
  logo: text("logo"),
  contractAddress: text("contract_address"),
  symbol: text("symbol").notNull(),
  marketCap: real("market_cap").notNull().default(0),
  totalSupply: real("total_supply"),
  holders: integer("holders"),
  verified: boolean("verified").default(false),
  status: text("status").default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
});

// Verification Code table
export const verificationCodes = pgTable("verification_codes", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  email: text("email")
    .notNull()
    .references(() => users.email),
  code: text("code").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Token table
export const tokens = pgTable(
  "tokens",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token: text("token").notNull(),
    type: text("type").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      tokenIdx: uniqueIndex("token_idx").on(table.token),
    };
  }
);

// Purchase table
export const purchases = pgTable("purchases", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  agentId: text("agent_id")
    .notNull()
    .references(() => aiAgents.id),
  userId: text("user_id").notNull(),
  amount: real("amount").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Interaction table
export const interactions = pgTable("interactions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  agentId: text("agent_id")
    .notNull()
    .references(() => aiAgents.id),
  type: text("type").notNull(),
  content: text("content"),
  rating: integer("rating"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
