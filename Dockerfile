FROM oven/bun:1.2.14 AS base

WORKDIR /app

# Copy all files for installation
COPY . .

# Install dependencies
# --frozen-lockfile ensures exact versions from lockfile are used and prevents lockfile updates
RUN bun install --frozen-lockfile

# Install Turbo globally
RUN bun install -g turbo

# Build the application using Turbo
RUN turbo build

# Production stage
FROM oven/bun:1.2.14 AS production

WORKDIR /app

# Copy package.json and other config files
COPY package.json turbo.json bun.lockb ./
COPY apps/server/package.json ./apps/server/
COPY apps/web/package.json ./apps/web/
COPY packages/schemas/package.json ./packages/schemas/

# Copy built artifacts from base stage
COPY --from=base /app/apps/server/dist ./apps/server/dist
COPY --from=base /app/apps/web/dist ./apps/web/dist
COPY --from=base /app/packages/schemas/dist ./packages/schemas/dist

# Install production dependencies only
RUN bun install --frozen-lockfile --production

# Install Turbo globally in production
RUN bun install -g turbo

# Use production environment
ENV NODE_ENV=production

# Expose ports for backend and frontend
EXPOSE 3000
EXPOSE 3001

# Run the application (ensure server has access to built files)
CMD ["turbo", "start"]
