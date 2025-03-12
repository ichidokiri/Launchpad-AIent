# Prisma to Drizzle Migration Guide

This document outlines the migration from Prisma ORM to Drizzle ORM in the Launchpad-AIent project.

## Overview

The project has been migrated from Prisma to Drizzle ORM for database operations. Drizzle is a lightweight, type-safe SQL query builder that offers better performance and more flexibility compared to Prisma.

## Key Changes

1. **Schema Definition**: Prisma schema has been replaced with Drizzle schema in `lib/db/schema.ts`
2. **Database Connection**: New connection management in `lib/db/index.ts`
3. **Helper Functions**: Added helper functions in `lib/db/helpers.ts` for common database operations
4. **Backward Compatibility**: The `lib/db.ts` file maintains a Prisma-compatible API for smooth transition

## Directory Structure

```
lib/
├── db/
│   ├── index.ts         # Database connection setup
│   ├── schema.ts        # Drizzle schema definitions
│   ├── helpers.ts       # Helper functions for database operations
│   ├── migrate.ts       # Migration script
│   └── seed.ts          # Database seeding script
├── db.ts                # Main export with Prisma compatibility layer
```

## Migration Scripts

Two new scripts have been added to help with the migration:

1. `scripts/generate-drizzle.js` - Generates Drizzle migrations based on the schema
2. `scripts/setup-drizzle.js` - Runs the migrations and seeds the database

## NPM Scripts

The following npm scripts have been added to package.json:

```json
"scripts": {
  "drizzle:generate": "node scripts/generate-drizzle.js",
  "drizzle:migrate": "node scripts/setup-drizzle.js",
  "db:setup": "npm run drizzle:generate && npm run drizzle:migrate"
}
```

## How to Use

### Setting Up the Database

To set up the database with Drizzle:

```bash
npm run db:setup
```

This will generate the migrations and apply them to your database.

### Using Drizzle in Your Code

You can use Drizzle in two ways:

1. **Direct Drizzle API** (recommended for new code):

```typescript
import { db, schema } from "@/lib/db";

// Query example
const users = await db
  .select()
  .from(schema.users)
  .where(eq(schema.users.role, "ADMIN"));

// Insert example
const newUser = await db
  .insert(schema.users)
  .values({
    name: "John Doe",
    email: "john@example.com",
    password: hashedPassword,
    role: "USER",
  })
  .returning();
```

2. **Using Helper Functions** (recommended for common operations):

```typescript
import { helpers } from "@/lib/db";

// Find a user by email
const user = await helpers.users.findByEmail("user@example.com");

// Create a new user
const newUser = await helpers.users.create({
  name: "John Doe",
  email: "john@example.com",
  password: hashedPassword,
  role: "USER",
});
```

3. **Using Prisma Compatibility Layer** (for existing code):

```typescript
import { prisma } from "@/lib/db";

// This uses the same API as before
const user = await prisma.user.findUnique({
  where: { email: "user@example.com" },
});
```

## Benefits of Drizzle

- **Performance**: Drizzle is significantly faster than Prisma
- **Type Safety**: Full TypeScript support with inferred types
- **SQL Control**: More direct control over SQL queries
- **Lightweight**: Smaller bundle size and fewer dependencies
- **No Code Generation**: No need to generate client code after schema changes

## Notes for Developers

- The Prisma compatibility layer in `lib/db.ts` is provided for backward compatibility but may not support all Prisma features
- For new code, it's recommended to use the direct Drizzle API or helper functions
- The database schema is now defined in `lib/db/schema.ts` instead of `prisma/schema.prisma`
