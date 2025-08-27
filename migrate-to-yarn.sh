#!/bin/bash

# Migration script from npm to yarn
# This script helps migrate existing npm-based projects to use yarn

set -e

echo "🔄 Migrating from npm to yarn..."

# Check if yarn is installed
if ! command -v yarn &> /dev/null; then
    echo "❌ Yarn is not installed. Installing yarn..."
    npm install -g yarn
fi

echo "✅ Yarn version: $(yarn --version)"

# Function to migrate a project directory
migrate_project() {
    local project_dir=$1
    local project_name=$2
    
    if [ -d "$project_dir" ]; then
        echo "🔄 Migrating $project_name..."
        cd "$project_dir"
        
        # Remove npm files
        if [ -f "package-lock.json" ]; then
            echo "🗑️  Removing package-lock.json..."
            rm package-lock.json
        fi
        
        if [ -d "node_modules" ]; then
            echo "🗑️  Removing node_modules..."
            rm -rf node_modules
        fi
        
        # Install dependencies with yarn
        echo "📦 Installing dependencies with yarn..."
        yarn install
        
        echo "✅ $project_name migrated successfully!"
        cd ..
    else
        echo "⚠️  Project directory $project_dir not found, skipping..."
    fi
}

# Migrate frontend project
migrate_project "frontend" "Frontend (Astro)"

# Migrate CMS project
migrate_project "cms" "CMS (Strapi)"

echo ""
echo "🎉 Migration completed!"
echo ""
echo "Next steps:"
echo "1. Commit the new yarn.lock files"
echo "2. Update your CI/CD pipelines to use yarn instead of npm"
echo "3. Update your documentation to reflect yarn usage"
echo "4. Test your builds with: ./run.sh dev"
echo ""
echo "Note: The Dockerfiles are already configured to use yarn!"
