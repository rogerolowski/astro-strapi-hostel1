#!/bin/bash

echo "🔧 Rebuilding Strapi Admin Panel with CSP Fix..."
echo "=================================================="

# Check if containers are running
if ! docker-compose ps | grep -q "cms.*Up"; then
    echo "❌ CMS container is not running. Starting services..."
    docker-compose up -d
    sleep 10
fi

echo "📦 Building CMS service with new configuration..."
docker-compose build cms

echo "🔄 Restarting CMS service..."
docker-compose restart cms

echo "⏳ Waiting for CMS to be healthy..."
sleep 15

# Check if CMS is healthy
if docker-compose ps | grep -q "cms.*healthy"; then
    echo "✅ CMS is healthy and running!"
    echo ""
    echo "🌐 Access your admin panel at: http://localhost:3001/admin"
    echo ""
    echo "🔍 If you still see CSP errors, check the browser console and try:"
    echo "   docker-compose logs cms"
    echo ""
    echo "💡 The new configuration includes:"
    echo "   - Custom CSP settings allowing localhost connections"
    echo "   - Proper URL configuration for external access"
    echo "   - Security middleware configuration"
else
    echo "❌ CMS is not healthy. Check logs:"
    echo "   docker-compose logs cms"
fi
