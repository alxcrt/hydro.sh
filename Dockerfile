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

# Copy all files to production stage
COPY . .

# Install production dependencies
RUN bun install --frozen-lockfile

# Install Turbo globally in production
RUN bun install -g turbo

# Use production environment
ENV NODE_ENV=production

# Expose ports for backend and frontend
EXPOSE 3000
EXPOSE 3001

# Run the application
CMD ["turbo", "start"]
