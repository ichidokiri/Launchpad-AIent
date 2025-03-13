# Base Image
FROM node:18.17.0-bullseye-slim AS base
WORKDIR /app
COPY package.json .
COPY package-lock.json .

# Dependencies
FROM base AS dependencies
RUN apt-get update && apt-get install -y python3 build-essential
RUN npm install 
# Runtime
FROM base AS runtime
COPY --from=dependencies /app/node_modules ./node_modules

# Install PostgreSQL client
RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

COPY . .
RUN npx ponder codegen

EXPOSE 42069
CMD ["npx","ponder","start"]