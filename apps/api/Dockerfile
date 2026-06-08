FROM node:22-alpine AS base
RUN npm install -g pnpm@11.3.0 turbo
WORKDIR /app

FROM base AS pruner
COPY . .
RUN turbo prune --scope=api --docker

FROM base AS builder
RUN apk add --no-cache python3 make g++
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml .
COPY turbo.json .
COPY pnpm-workspace.yaml .
RUN pnpm install --frozen-lockfile
COPY --from=pruner /app/out/full/ .
RUN pnpm turbo run build --filter=api

FROM node:22-alpine AS runner
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml .
COPY pnpm-workspace.yaml .
RUN npm install -g pnpm@11.3.0
RUN pnpm install --prod --frozen-lockfile
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/packages/db/dist ./packages/db/dist
COPY --from=builder /app/packages/FileStorage/dist ./packages/FileStorage/dist
RUN mkdir -p /app/data
ENV NODE_ENV=production
ENV PORT=17001
EXPOSE 17001
VOLUME ["/app/data"]
CMD ["node", "apps/api/dist/main.js"]
