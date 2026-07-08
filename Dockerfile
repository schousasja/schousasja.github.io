# ==========================================
# Multi-Stage Dockerfile for Cloud Run
# ==========================================

# --- Stage 1: Builder ---
# Using node:20-slim (Debian-based) ensures full glibc compatibility for compiled 
# binaries like esbuild/vite, avoiding the native issues common in alpine (musl).
FROM node:20-slim AS builder

WORKDIR /app

# Copy dependency manifests & local overrides
COPY package.json package-lock.json ./
COPY dummy-domexception ./dummy-domexception

# Use npm install instead of npm ci to gracefully resolve platform-specific
# binaries (such as esbuild and swc) for the container's architecture.
RUN npm install

# Copy the rest of the application source code
COPY . .

# Run the production build pipeline
# This builds the React client (via Vite) and bundles server.ts (via esbuild) to dist/
RUN npm run build


# --- Stage 2: Production Runner ---
FROM node:20-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
# Cloud Run automatically injects PORT, but we default to 3000
ENV PORT=3000

# Copy manifests & local overrides
COPY package.json package-lock.json ./
COPY dummy-domexception ./dummy-domexception

# Install only production dependencies to keep the image slim and fast
RUN npm install --omit=dev

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist

# Expose port 3000
EXPOSE 3000

# Start the Node.js production server
CMD ["npm", "start"]
