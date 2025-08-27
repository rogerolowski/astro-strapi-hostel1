#!/bin/bash

# Hostel Management System - Docker Compose Runner
# This script makes it easy to run different configurations

set -e

case "$1" in
  "dev"|"development")
    echo "🚀 Starting in DEVELOPMENT mode with hot reload..."
    docker-compose -f docker-compose.yml -f docker/docker-compose.dev.yml up --build
    ;;
  "prod"|"production")
    echo "🚀 Starting in PRODUCTION mode with Nginx..."
    docker-compose -f docker-compose.yml -f docker/docker-compose.prod.yml up --build
    ;;
  "base"|"infra")
    echo "🚀 Starting only infrastructure services (PostgreSQL + Redis)..."
    docker-compose -f docker/docker-compose.base.yml up --build
    ;;
  "backend")
    echo "🚀 Starting infrastructure + backend..."
    docker-compose -f docker/docker-compose.base.yml -f docker/docker-compose.backend.yml up --build
    ;;
  "frontend")
    echo "🚀 Starting infrastructure + frontend..."
    docker-compose -f docker/docker-compose.base.yml -f docker/docker-compose.frontend.yml up --build
    ;;
  "cms")
    echo "🚀 Starting infrastructure + CMS..."
    docker-compose -f docker/docker-compose.base.yml -f docker/docker-compose.cms.yml up --build
    ;;
  "down")
    echo "🛑 Stopping all services..."
    docker-compose down
    ;;
  "clean")
    echo "🧹 Cleaning up containers, images, and volumes..."
    docker-compose down -v --rmi all
    ;;
  "logs")
    echo "📋 Showing logs for all services..."
    docker-compose logs -f
    ;;
  "status")
    echo "📊 Checking service status..."
    docker-compose ps
    ;;
  *)
    echo "Hostel Management System - Docker Compose Runner"
    echo ""
    echo "Usage: ./run.sh [command]"
    echo ""
    echo "Commands:"
    echo "  dev, development    Start all services in development mode (hot reload)"
    echo "  prod, production    Start all services in production mode (with Nginx)"
    echo "  base, infra         Start only infrastructure (PostgreSQL + Redis)"
    echo "  backend             Start infrastructure + backend"
    echo "  frontend            Start infrastructure + frontend"
    echo "  cms                 Start infrastructure + CMS"
    echo "  down                Stop all services"
    echo "  clean               Stop and remove all containers, images, volumes"
    echo "  logs                Show logs for all services"
    echo "  status              Check service status"
    echo ""
    echo "Examples:"
    echo "  ./run.sh dev        # Start development mode"
    echo "  ./run.sh prod       # Start production mode"
    echo "  ./run.sh backend    # Start only backend"
    echo "  ./run.sh down       # Stop all services"
    ;;
esac
