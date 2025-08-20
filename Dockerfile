# ---------------------------------------------------
# Stage 1 — Base dependencies
# ---------------------------------------------------
FROM node:20-alpine AS base
WORKDIR /app
RUN npm install -g pnpm

# Pass service name and libs as build args
ARG SERVICE

# Copy only root package files for caching
COPY package.json pnpm-lock.yaml ./

# Install all deps
RUN pnpm install --frozen-lockfile

# Copy selected service
COPY apps/${SERVICE} ./apps/${SERVICE}

# Copy shared config files
COPY nest-cli.json tsconfig*.json ./

# ---------------------------------------------------
# Stage 2 — Development target
# ---------------------------------------------------
FROM base AS development
ENV NODE_ENV=development
COPY apps/${SERVICE}/.env.dev .env
VOLUME ["/app/apps/${SERVICE}"]
CMD ["pnpm", "--filter", "${SERVICE}", "start:dev"]

# ---------------------------------------------------
# Stage 3 — Build target
# ---------------------------------------------------
FROM base AS build
ENV NODE_ENV=production
RUN pnpm nest build ${SERVICE}

# ---------------------------------------------------
# Stage 4 — Production runtime
# ---------------------------------------------------
FROM node:20-alpine AS production
WORKDIR /app
RUN npm install -g pnpm

# Create non-root user
RUN addgroup -S app && adduser -S app -G app

# Copy package files & install only prod deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm fetch --prod && pnpm install --offline --prod && rm -rf /root/.pnpm-store

# Copy compiled dist & env
COPY --from=build /app/dist ./dist
COPY apps/${SERVICE}/.env.prod .env

USER app
CMD ["node", "dist/apps/${SERVICE}/main.js"]


# docker build --build-arg SERVICE=sname --build-arg LIBS="shared-sname shared-common" -t myapp-sname .