# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a hostel management system built with a modern three-tier architecture using Docker for containerization. The system consists of a React/Astro frontend, Django DRF backend, and Strapi CMS, all backed by PostgreSQL and Redis.

## Architecture

- **Frontend**: Astro + React + Tailwind CSS + shadcn/ui + Nanostores (State Management)
- **Backend**: Django REST Framework (Authentication & API endpoints)  
- **CMS**: Strapi 4.15.0 (Headless content management)
- **Database**: PostgreSQL (shared between backend and CMS)
- **Cache**: Redis (session storage and caching)
- **Containerization**: Docker & Docker Compose with modular setup
- **Package Manager**: Yarn (for Node.js projects)

## Key Development Commands

### Primary Development Workflow
```bash
# Start full development environment (recommended)
./run.sh dev

# Start production environment with Nginx
./run.sh prod

# Stop all services
./run.sh down

# Clean up everything (containers, images, volumes)
./run.sh clean
```

### Service-Specific Commands
```bash
# Start only infrastructure (PostgreSQL + Redis)
./run.sh base

# Start infrastructure + backend only
./run.sh backend  

# Start infrastructure + frontend only
./run.sh frontend

# Start infrastructure + CMS only
./run.sh cms
```

### Manual Docker Compose (Alternative)
```bash
# Development with hot reload
docker-compose -f docker-compose.yml -f docker/docker-compose.dev.yml up --build

# Production with Nginx
docker-compose -f docker-compose.yml -f docker/docker-compose.prod.yml up --build
```

### Local Development (Without Docker)
```bash
# Frontend development
cd frontend && yarn install && yarn dev

# CMS development  
cd cms && yarn install && yarn develop

# Backend development (requires Python/Django setup)
cd backend && python manage.py runserver
```

### Strapi Admin Panel Management
```bash
# Rebuild Strapi admin after configuration changes
./rebuild-strapi-admin.sh

# Or manually:
docker-compose build cms
docker-compose restart cms
```

### Package Management
```bash
# Migrate from npm to yarn (if needed)
./migrate-to-yarn.sh

# Add dependencies to frontend
cd frontend && yarn add <package>

# Add dependencies to CMS
cd cms && yarn add <package>
```

## Service Endpoints

- **Frontend**: http://localhost:4321
- **Backend API**: http://localhost:8000
- **CMS Admin Panel**: http://localhost:3001/admin
- **Database**: localhost:5432 (postgres/postgres)
- **Redis**: localhost:6379
- **Database Admin (Adminer)**: http://localhost:8080

## Project Structure

### Root Level
- `docker-compose.yml` - Main orchestration file
- `run.sh` - Convenience script for service management
- `migrate-to-yarn.sh` - Script to migrate from npm to yarn
- `rebuild-strapi-admin.sh` - Script to rebuild Strapi admin panel

### Modular Docker Setup (`docker/`)
- `docker-compose.base.yml` - Core infrastructure (PostgreSQL, Redis)
- `docker-compose.backend.yml` - Django backend service
- `docker-compose.cms.yml` - Strapi CMS service  
- `docker-compose.frontend.yml` - Astro frontend service
- `docker-compose.dev.yml` - Development overrides (hot reload)
- `docker-compose.prod.yml` - Production overrides (Nginx)

### Application Directories
- `frontend/` - Astro frontend with React components
- `backend/` - Django REST Framework application
- `cms/` - Strapi CMS application
- `db/` - PostgreSQL configuration
- `redis/` - Redis configuration

## Service Communication

All services communicate through Docker network (`hostel_network`):
- Frontend → Backend: `http://backend:8000` (API calls)
- Frontend → CMS: `http://cms:1337` (Content fetching)
- Backend → PostgreSQL: `postgres:5432`
- Backend → Redis: `redis:6379`
- CMS → PostgreSQL: `postgres:5432`

## Important Configuration Details

### Strapi CSP Configuration
The CMS has been configured with specific Content Security Policy settings to resolve admin panel connection issues:
- Custom CSP settings in `cms/config/security.js`
- Server configuration in `cms/config/server.js`
- Middleware configuration in `cms/config/middlewares.js`

### Yarn Configuration
- Both frontend and CMS use Yarn instead of npm
- Dockerfiles are configured for Yarn
- Yarn workspaces may be in use for dependency management

### Hot Reload Support
- Frontend: Astro dev server with hot reload
- Backend: Django development server with auto-restart
- CMS: Strapi develop mode with auto-restart

## Testing & Quality

### Frontend Testing
```bash
cd frontend
yarn test          # Run tests (if configured)
yarn build         # Verify build works
```

### Backend Testing
```bash
# Inside backend container
docker-compose exec backend python manage.py test

# Or locally
cd backend && python manage.py test
```

### CMS Testing
```bash
cd cms
yarn build         # Verify admin panel builds correctly
```

## Troubleshooting

### Common Issues
1. **Port conflicts**: Ensure ports 4321, 8000, 3001, 5432, 6379, 8080 are available
2. **Strapi admin issues**: Use `./rebuild-strapi-admin.sh` to rebuild
3. **Database connection**: Ensure PostgreSQL is healthy before starting dependent services
4. **Yarn issues**: Ensure Yarn 4+ is installed for local development

### Debug Commands
```bash
# Check service status
docker-compose ps
./run.sh status

# View logs
docker-compose logs -f [service_name]
./run.sh logs

# Access container shell
docker-compose exec backend bash
docker-compose exec frontend sh
docker-compose exec cms sh

# Rebuild specific service
docker-compose build cms
docker-compose restart cms
```

## Development Workflow Best Practices

1. **Use the convenience script**: `./run.sh dev` for most development work
2. **Hot reload**: Code changes in frontend and backend auto-reload in dev mode
3. **Strapi changes**: Some CMS configuration changes may require admin panel rebuild
4. **Database schema**: Changes require rebuilding dependent services
5. **Environment variables**: Configure via Docker Compose environment sections

## State Management (Frontend)

The frontend uses **Nanostores** for state management:
- Lightweight state management library
- Integrates well with Astro and React
- Used for client-side state across components

## Dependencies & Versions

### Frontend (Astro)
- Astro 4.x
- React 18.x  
- Tailwind CSS 5.x
- TypeScript 5.x

### Backend (Django)
- Django 4.2.x
- Django REST Framework 3.14.x
- PostgreSQL driver (psycopg2)
- Redis client
- JWT authentication

### CMS (Strapi)
- Strapi 4.15.0
- PostgreSQL integration
- Users & permissions plugin
- i18n plugin

## Environment Requirements

- **Docker & Docker Compose** (primary development method)
- **Node.js 18+** (for local frontend/CMS development)
- **Yarn 4+** (package management)
- **Python 3.x** (for local backend development)

## Production Considerations

- OpenResty reverse proxy in production mode (Nginx + Lua scripting)
- Advanced rate limiting and security features
- Optimized builds for frontend
- Gunicorn WSGI server for Django
- No source code mounting in production
- SSL/HTTPS configuration ready (requires certificates)
- Custom Lua scripts for authentication and business logic
