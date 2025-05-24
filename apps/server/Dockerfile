# apps/server/Dockerfile
FROM oven/bun:1.2.14

WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Build the application
RUN bun run build

# Expose the correct port from package.json
EXPOSE 3000

# Use production environment
ENV NODE_ENV=production

# Run the application
CMD ["bun", "run", "start"]