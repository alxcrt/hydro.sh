FROM oven/bun:1.2.14 AS base

WORKDIR /app

# Copy all files for installation
COPY . .

# Install dependencies
# --frozen-lockfile ensures exact versions from lockfile are used and prevents lockfile updates
RUN bun install --frozen-lockfile

# Build the application using Turbo
RUN bun run build

# Production stage
FROM oven/bun:1.2.14 AS production

WORKDIR /app

# Copy all files to production stage
COPY . .

# Use production environment
ENV NODE_ENV=production

# Expose ports for backend and frontend
EXPOSE 3000
EXPOSE 3001

# Run the application
CMD ["bun", "run", "start"]
