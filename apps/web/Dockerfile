FROM node:22-alpine AS base
RUN npm install -g pnpm@11.3.0 turbo
WORKDIR /app

FROM base AS pruner
COPY . .
RUN turbo prune --scope=web --docker

FROM base AS builder
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml .
COPY pnpm-workspace.yaml .
RUN pnpm install --frozen-lockfile
COPY --from=pruner /app/out/full/ .
RUN pnpm --filter=web run build

FROM nginx:alpine AS runner
RUN mkdir -p /usr/share/nginx/html/steps
COPY --from=builder /app/apps/web/dist/ /usr/share/nginx/html/steps/
RUN printf 'server {\n  listen 80;\n  root /usr/share/nginx/html;\n  index index.html;\n  location / {\n    try_files $$uri $$uri/ /steps/index.html;\n  }\n}\n' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
