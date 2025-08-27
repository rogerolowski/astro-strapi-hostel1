# Use official Node.js LTS as base
FROM node:20-alpine AS builder

WORKDIR /app

# Enable Corepack and set Yarn version
RUN corepack enable && corepack prepare yarn@4.0.0 --activate

# Copy all source code
COPY . .

# Install dependencies and build
RUN yarn install
RUN yarn build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Enable Corepack and set Yarn version
RUN corepack enable && corepack prepare yarn@4.0.0 --activate

# Copy built app from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.yarnrc.yml ./
COPY --from=builder /app/yarn.lock ./

# Install only production dependencies
RUN yarn install

# Expose port (Astro default)
EXPOSE 4321

# Install curl for health checks and serve for static files
RUN apk add --no-cache curl && npm install -g serve

# Start the app
CMD ["serve", "-s", "dist", "-l", "4321"]
