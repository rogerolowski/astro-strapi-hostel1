# Strapi CMS Dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /srv/app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy application code
COPY . .

# Create public/uploads directory
RUN mkdir -p public/uploads

# Set proper permissions
RUN chown -R node:node /srv/app
USER node

# Expose port
EXPOSE 1337

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:1337/_health || exit 1

# Start command
CMD ["yarn", "develop"]
