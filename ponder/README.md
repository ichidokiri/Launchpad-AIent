# Ponder Indexer

This repository contains a Ponder indexer for blockchain data.

## Getting Started

Follow these steps to set up and run the indexer:

1. Copy the environment file:

   ```bash
   cp .env.local .env
   ```

2. Update the database URL in the `.env` file:
   Change:

   ```
   DATABASE_URL=postgresql://ponder:ponder_password@localhost:5435/ponder_prod
   ```

   To:

   ```
   DATABASE_URL=postgresql://ponder:ponder_password@db:5432/ponder_prod
   ```

3. Start the services:
   ```bash
   docker compose up
   ```

This will start both the PostgreSQL database and the Ponder indexer service. The Ponder API will be available at http://localhost:42069 once initialization is complete.
