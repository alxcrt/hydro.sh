FROM oven/bun:1.2.14 AS base

WORKDIR /app

# Copy root package files
COPY package.json bun.lockb* turbo.json ./


# Copy all workspace package files
COPY apps/*/package.json ./apps/
COPY packages/*/package.json ./packages/

# Install dependencies
# --frozen-lockfile ensures exact versions from lockfile are used and prevents lockfile updates
RUN bun install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Build the application using Turbo
RUN bun run build

# Production stage
FROM oven/bun:1.2.14 AS production

WORKDIR /app

# Copy package files
COPY package.json bun.lockb* turbo.json ./

# Copy built application from base stage
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/packages ./packages
COPY --from=base /app/apps ./apps

# Use production environment
ENV NODE_ENV=production

# Expose ports for backend and frontend
EXPOSE 3000
EXPOSE 3001

# Run the application
CMD ["bun", "run", "start"]
