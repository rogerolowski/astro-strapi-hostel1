# Hostel Management System

A fully integrated hostel management application built with modern technologies and containerized with Docker.

## 📋 Table of Contents

- [🏗️ Architecture](#️-architecture)
- [🔒 Content Security Policy (CSP) Fix](#-content-security-policy-csp-fix)
- [🚀 Quick Start](#-quick-start)
- [📁 Project Structure](#-project-structure)
- [🌐 Service Communication](#-service-communication)
- [🔧 Service Details](#-service-details)
- [🛠️ Development Workflow](#️-development-workflow)
- [🧶 Yarn Package Management](#-yarn-package-management)
- [🔧 Strapi Admin Panel Configuration](#-strapi-admin-panel-configuration)
- [🚀 Production Deployment](#-production-deployment)
- [🔍 Useful Commands](#-useful-commands)
- [🐛 Troubleshooting](#-troubleshooting)
- [📚 Additional Documentation](#-additional-documentation)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## 🏗️ Architecture

- **Frontend**: Astro + Tailwind CSS + shadcn/ui + Nanostores
- **CMS**: Strapi (Headless CMS)
- **Backend**: Django DRF (Authentication & API)
- **Database**: PostgreSQL
- **Cache**: Redis
- **Containerization**: Docker & Docker Compose
- **Package Manager**: Yarn (for Node.js projects)

## 🔒 Content Security Policy (CSP) Fix

The Strapi admin panel has been configured to resolve Content Security Policy violations that were blocking connections to internal endpoints.

### **Configuration Files Created**

- **`cms/config/server.js`**: Server configuration with proper admin panel settings
- **`cms/config/middlewares.js`**: Middleware configuration for security and CORS
- **`cms/config/security.js`**: Custom CSP settings allowing localhost connections

### **Key CSP Settings**

```javascript
contentSecurityPolicy: {
  directives: {
    'connect-src': ["'self'", 'https:', 'http://localhost:3001', 'http://localhost:1337'],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    'style-src': ["'self'", "'unsafe-inline'"],
  }
}
```

### **Rebuilding After CSP Changes**

```bash
# Use the rebuild script
./rebuild-strapi-admin.sh

# Or manually rebuild
docker-compose build cms
docker-compose restart cms
```

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Git
- Node.js 18+ (for local development)
- Yarn 4+ (for local development)

### Option 1: Using the Convenience Script (Recommended)
```bash
# Clone the repository
git clone <your-repo-url>
cd astro-strapi-hostel1

# Start in development mode (hot reload)
./run.sh dev

# Start in production mode (with Nginx)
./run.sh prod

# Start only specific services
./run.sh backend    # Infrastructure + Backend
./run.sh frontend   # Infrastructure + Frontend
./run.sh cms        # Infrastructure + CMS

# Stop all services
./run.sh down

# Clean up everything
./run.sh clean
```

### Option 2: Manual Docker Compose Commands
```bash
# Development mode (hot reload)
docker-compose -f docker-compose.yml -f docker/docker-compose.dev.yml up --build

# Production mode (with Nginx)
docker-compose -f docker-compose.yml -f docker/docker-compose.prod.yml up --build

# Basic mode (all services)
docker-compose up --build
```

## 📁 Project Structure

```
├── docker-compose.yml              # Root compose file (orchestrates all services)
├── run.sh                         # Convenience script for running services
├── migrate-to-yarn.sh             # Script to migrate from npm to yarn
├── rebuild-strapi-admin.sh        # Script to rebuild Strapi admin panel
├── .dockerignore                  # Docker ignore patterns
├── docker/                        # Modular Docker Compose files
│   ├── docker-compose.base.yml    # Core infrastructure (PostgreSQL, Redis)
│   ├── docker-compose.backend.yml # Django backend service
│   ├── docker-compose.cms.yml     # Strapi CMS service
│   ├── docker-compose.frontend.yml# Astro frontend service
│   ├── docker-compose.dev.yml     # Development overrides
│   ├── docker-compose.prod.yml    # Production overrides with Nginx
│   └── README.md                  # Docker setup documentation
├── backend/                       # Django backend application
├── cms/                          # Strapi CMS application
├── frontend/                     # Astro frontend application
├── db/                           # PostgreSQL configuration
└── redis/                        # Redis configuration
```

## 🌐 Service Communication

All services communicate through Docker networks:

- **Frontend** → **Backend**: `http://backend:8000` (API calls)
- **Frontend** → **CMS**: `http://cms:1337` (Content)
- **Backend** → **PostgreSQL**: `postgres:5432`
- **Backend** → **Redis**: `redis:6379`
- **CMS** → **PostgreSQL**: `postgres:5432`

## 🔧 Service Details

### Frontend (Astro)
- **Port**: 4321
- **Features**: Hot reload in development, optimized build in production
- **Technologies**: Astro, React, Tailwind CSS, shadcn/ui, Nanostores
- **Package Manager**: Yarn

### Backend (Django DRF)
- **Port**: 8000
- **Features**: Authentication API, hostel management endpoints
- **Technologies**: Django, Django REST Framework, PostgreSQL, Redis

### CMS (Strapi)
- **Port**: 3001 (mapped from 1337)
- **Features**: Content management, media handling
- **Technologies**: Strapi, PostgreSQL
- **Package Manager**: Yarn
- **Admin Panel**: http://localhost:3001/admin

### Database (PostgreSQL)
- **Port**: 5432
- **Features**: Persistent data storage, optimized configuration

### Cache (Redis)
- **Port**: 6379
- **Features**: Session storage, caching, optimized configuration

## 🛠️ Development Workflow

1. **Start Development Environment**:
   ```bash
   ./run.sh dev
   ```

2. **Access Services**:
   - Frontend: http://localhost:4321
   - Backend API: http://localhost:8000
   - CMS Admin: http://localhost:3001/admin
   - Database: localhost:5432
   - Redis: localhost:6379

3. **Code Changes**: Hot reload enabled for frontend and backend

4. **Stop Services**:
   ```bash
   ./run.sh down
   ```

## 🧶 Yarn Package Management

This project uses **Yarn** instead of npm for Node.js dependencies. All Dockerfiles are configured to use Yarn.

### Local Development with Yarn
```bash
# Install dependencies
cd frontend && yarn install
cd cms && yarn install

# Run development servers
cd frontend && yarn dev
cd cms && yarn develop
```

### Migrating from npm to Yarn
If you have an existing project using npm:
```bash
# Run the migration script
./migrate-to-yarn.sh

# Or manually:
# 1. Remove package-lock.json and node_modules
# 2. Run yarn install in each project directory
```

### Yarn Benefits
- **Faster**: Parallel package installation
- **Reliable**: Deterministic dependency resolution
- **Secure**: Better security features
- **Modern**: Latest package management features

## 🔧 Strapi Admin Panel Configuration

The Strapi admin panel is properly configured with the correct URLs:

### Development Environment
- **Admin URL**: http://localhost:3001/admin
- **Public URL**: http://localhost:3001
- **Port**: 3001 (mapped from container port 1337)

### Production Environment
- **Admin URL**: http://yourdomain.com/admin
- **Public URL**: http://yourdomain.com
- **Port**: 80/443 (via Nginx)

### If You Need to Rebuild the Admin Panel
```bash
# Use the convenience script
./rebuild-strapi-admin.sh

# Or manually:
docker-compose build cms
docker-compose restart cms
```

### Environment Variables
Key Strapi environment variables are set in the Docker Compose files:
- `PUBLIC_URL`: The public URL of your Strapi instance
- `SERVER_ADMIN_URL`: The admin panel URL
- `HOST`: Bind to all interfaces (0.0.0.0)
- `PORT`: Internal port (1337)

## 🚀 Production Deployment

1. **Start Production Environment**:
   ```bash
   ./run.sh prod
   ```

2. **Access via Nginx**:
   - Main Application: http://localhost (port 80)
   - HTTPS: https://localhost (port 443, requires SSL certificates)

3. **Production Features**:
   - Nginx reverse proxy
   - Optimized builds
   - Gunicorn for Django
   - No source code mounting

## 🔍 Useful Commands

```bash
# Check service status
./run.sh status

# View logs
./run.sh logs

# Clean up everything
./run.sh clean

# Start only infrastructure
./run.sh base

# Start specific service combinations
./run.sh backend
./run.sh frontend
./run.sh cms

# Migrate to yarn (if needed)
./migrate-to-yarn.sh

# Rebuild Strapi admin panel
./rebuild-strapi-admin.sh
```

## 🐛 Troubleshooting

### Common Issues

1. **Port Conflicts**: Ensure ports 4321, 8000, 3001, 5432, 6379 are available
2. **Permission Issues**: Run `chmod +x run.sh` to make the script executable (Linux/Mac)
3. **Build Failures**: Check Docker logs with `./run.sh logs`
4. **Database Connection**: Ensure PostgreSQL container is healthy before starting backend
5. **Yarn Issues**: Ensure Yarn 4+ is installed locally for development
6. **Strapi Admin Issues**: Use `./rebuild-strapi-admin.sh` to rebuild the admin panel

### Debug Commands

```bash
# Check container status
docker-compose ps

# View specific service logs
docker-compose logs frontend
docker-compose logs backend
docker-compose logs cms

# Access container shell
docker-compose exec backend bash
docker-compose exec frontend sh
docker-compose exec cms sh

# Rebuild specific service
docker-compose build cms
docker-compose restart cms
```

## 📚 Additional Documentation

- **Docker Setup**: See `docker/README.md` for detailed Docker configuration
- **Service Configuration**: Check individual service directories for specific setup
- **Environment Variables**: Configure via `.env` files or Docker Compose overrides
- **Yarn Configuration**: See `.yarnrc.yml` files in frontend and cms directories
- **Strapi Configuration**: See `cms/env.example` for environment variable examples

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with `./run.sh dev`
5. Submit a pull request

## 📄 License

[Your License Here]
