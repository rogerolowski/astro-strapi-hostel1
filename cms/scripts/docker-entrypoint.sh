#!/bin/bash
set -e

# CMS Docker Entrypoint Script
# This script handles initialization and startup for the Strapi CMS container

echo "🚀 Starting Hostel CMS container..."

# Function to wait for database
wait_for_db() {
    echo "⏳ Waiting for PostgreSQL database..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if pg_isready -h "${DATABASE_HOST:-postgres}" -p "${DATABASE_PORT:-5432}" -U "${DATABASE_USERNAME:-hostel_user}" > /dev/null 2>&1; then
            echo "✅ Database is ready!"
            return 0
        fi
        
        echo "Attempt $attempt/$max_attempts: Database not ready, waiting 2 seconds..."
        sleep 2
        ((attempt++))
    done
    
    echo "❌ Database failed to become ready after $max_attempts attempts"
    exit 1
}

# Function to run database migrations
run_migrations() {
    echo "🔄 Running database migrations..."
    
    # Check if this is first run (no migrations table exists)
    if ! yarn strapi db:migrations:list > /dev/null 2>&1; then
        echo "📋 First run detected, creating initial database structure..."
    fi
    
    # Run migrations
    yarn strapi db:migrations:run
    
    echo "✅ Database migrations completed"
}

# Function to initialize CMS data
initialize_cms() {
    echo "🌱 Initializing CMS..."
    
    # Only run initialization if admin user doesn't exist
    if [ "${SKIP_INIT:-false}" != "true" ]; then
        # Set default admin credentials if not provided
        export ADMIN_EMAIL="${ADMIN_EMAIL:-admin@hostel.local}"
        export ADMIN_USERNAME="${ADMIN_USERNAME:-admin}"
        export ADMIN_PASSWORD="${ADMIN_PASSWORD:-Admin123!}"
        export ADMIN_FIRSTNAME="${ADMIN_FIRSTNAME:-Hostel}"
        export ADMIN_LASTNAME="${ADMIN_LASTNAME:-Admin}"
        
        # Run initialization script
        if [ -f "/app/scripts/init-cms.js" ]; then
            node /app/scripts/init-cms.js init
        else
            echo "⚠️  Init script not found, skipping CMS initialization"
        fi
    else
        echo "ℹ️  Skipping CMS initialization (SKIP_INIT=true)"
    fi
}

# Function to build admin panel (production only)
build_admin() {
    if [ "${NODE_ENV}" = "production" ]; then
        echo "🏗️  Building admin panel for production..."
        
        # Check if build already exists
        if [ ! -d "/app/build" ] || [ "${FORCE_BUILD:-false}" = "true" ]; then
            yarn strapi build
            echo "✅ Admin panel built successfully"
        else
            echo "ℹ️  Admin panel already built, skipping (set FORCE_BUILD=true to rebuild)"
        fi
    fi
}

# Function to validate environment
validate_environment() {
    echo "🔍 Validating environment..."
    
    # Check required environment variables
    local required_vars=(
        "DATABASE_HOST"
        "DATABASE_NAME"
        "DATABASE_USERNAME"
        "DATABASE_PASSWORD"
        "JWT_SECRET"
        "ADMIN_JWT_SECRET"
        "APP_KEYS"
    )
    
    local missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -ne 0 ]; then
        echo "❌ Missing required environment variables:"
        printf '  - %s\n' "${missing_vars[@]}"
        exit 1
    fi
    
    echo "✅ Environment validation passed"
}

# Function to setup file permissions
setup_permissions() {
    echo "🔐 Setting up file permissions..."
    
    # Ensure proper ownership
    chown -R node:node /app
    
    # Ensure uploads directory exists and has correct permissions
    mkdir -p /app/public/uploads
    chown -R node:node /app/public/uploads
    chmod -R 755 /app/public/uploads
    
    # Ensure logs directory exists
    mkdir -p /app/logs
    chown -R node:node /app/logs
    chmod -R 755 /app/logs
    
    echo "✅ File permissions configured"
}

# Function for health check
health_check() {
    echo "🏥 Running health check..."
    
    if [ -f "/app/scripts/init-cms.js" ]; then
        node /app/scripts/init-cms.js health
    else
        echo "⚠️  Health check script not found"
        # Basic health check
        curl -f http://localhost:${PORT:-1337}/_health || exit 1
    fi
    
    echo "✅ Health check passed"
}

# Main execution flow
main() {
    echo "================================================"
    echo "🏨 Hostel Management CMS Initialization"
    echo "Environment: ${NODE_ENV:-development}"
    echo "Port: ${PORT:-1337}"
    echo "================================================"
    
    # Validate environment
    validate_environment
    
    # Setup permissions (only if running as root)
    if [ "$(id -u)" = "0" ]; then
        setup_permissions
    fi
    
    # Wait for database
    wait_for_db
    
    # Install dependencies if needed (development only)
    if [ "${NODE_ENV}" != "production" ] && [ ! -d "node_modules" ]; then
        echo "📦 Installing dependencies..."
        yarn install
    fi
    
    # Run migrations
    run_migrations
    
    # Build admin panel (production only)
    build_admin
    
    # Initialize CMS data
    initialize_cms
    
    echo "🎉 CMS initialization completed successfully!"
    echo "================================================"
    
    # Execute the main command
    if [ "$1" = "health" ]; then
        health_check
        exit 0
    elif [ "$1" = "init-only" ]; then
        echo "ℹ️  Initialization completed, exiting..."
        exit 0
    else
        echo "🚀 Starting Strapi CMS..."
        exec "$@"
    fi
}

# Handle special commands
case "$1" in
    "health")
        health_check
        exit 0
        ;;
    "init-only")
        # Run initialization without starting the server
        validate_environment
        wait_for_db
        run_migrations
        initialize_cms
        echo "✅ Initialization completed"
        exit 0
        ;;
    *)
        # Normal startup
        main "$@"
        ;;
esac
