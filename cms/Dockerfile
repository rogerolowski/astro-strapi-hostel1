# Use Node.js 20-alpine for compatibility with package.json requirements
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /srv/app

# Install system dependencies needed for build
RUN apk add --no-cache \
    postgresql-client \
    build-base \
    python3 \
    vips-dev \
    curl

# Copy package files
COPY package.json yarn.lock* ./

# Install dependencies
RUN yarn install

# Copy source code
COPY . .

# Build the application
RUN yarn build

# Production stage
FROM node:20-alpine

# Set working directory
WORKDIR /srv/app

# Install system dependencies for runtime
RUN apk add --no-cache \
    postgresql-client \
    vips \
    vips-cpp \
    curl

# Copy built application from builder stage
COPY --from=builder /srv/app ./

# Expose port
EXPOSE 1337

# Start the application
CMD ["yarn", "start"]
