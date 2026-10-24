FROM oven/bun:1.4.3-slim AS bun
FROM node:24-bookworm-slim AS build
COPY --from=bun /usr/local/bin/bun /usr/local/bin/bun
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates curl && rm -rf /var/lib/apt/lists/*
COPY . .
RUN bun install --frozen-lockfile
ARG VITE_SERVER_URL=http://127.0.0.1:3001
ENV VITE_SERVER_URL=$VITE_SERVER_URL
RUN bun run build && bun run typecheck
ENV NODE_ENV=production
USER node
EXPOSE 3000 3001
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s CMD curl -fsS http://127.0.0.1:3000/ > /dev/null && test "$(curl -fsS http://127.0.0.1:3001/)" = OK
CMD ["node", "scripts/start.mjs"]
