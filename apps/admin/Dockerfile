FROM node:22-alpine AS base
RUN npm install -g pnpm@11.3.0 turbo
WORKDIR /app

FROM base AS pruner
COPY . .
RUN turbo prune --scope=admin --docker

FROM base AS builder
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml .
COPY pnpm-workspace.yaml .
RUN pnpm install --frozen-lockfile
COPY --from=pruner /app/out/full/ .
RUN pnpm --filter=admin run build

FROM nginx:alpine AS runner
COPY --from=builder /app/apps/admin/dist/ /usr/share/nginx/html/
RUN printf 'server {\n  listen 80;\n  root /usr/share/nginx/html;\n  index index.html;\n  location / {\n    try_files $$uri $$uri/ /index.html;\n  }\n}\n' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
