# apps/server/Dockerfile
FROM oven/bun:1.2.14

WORKDIR /app

COPY package.json bun.lockb* ./
RUN bun install

COPY . .

# Build if needed (uncomment if you have a build step)
# RUN bun run build

EXPOSE 3000

CMD ["bun", "run", "start"]