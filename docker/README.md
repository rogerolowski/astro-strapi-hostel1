# Modular Docker Compose Setup

This directory contains modular Docker Compose files for the Hostel Management System.

## File Structure

```
docker/
├── docker-compose.base.yml      # Core infrastructure (PostgreSQL, Redis)
├── docker-compose.backend.yml   # Django backend service
├── docker-compose.cms.yml       # Strapi CMS service
├── docker-compose.frontend.yml  # Astro frontend service
├── docker-compose.dev.yml       # Development overrides
├── docker-compose.prod.yml      # Production overrides with Nginx
└── README.md                    # This file
```

## Usage

### Basic Setup (All Services)
```bash
# From project root
docker-compose up --build
```

### Development Mode (With Hot Reload)
```bash
# From project root
docker-compose -f docker-compose.yml -f docker/docker-compose.dev.yml up --build
```

### Production Mode (With Nginx)
```bash
# From project root
docker-compose -f docker-compose.yml -f docker/docker-compose.prod.yml up --build
```

### Individual Services
```bash
# Start only infrastructure
docker-compose -f docker/docker-compose.base.yml up --build

# Start only backend
docker-compose -f docker/docker-compose.base.yml -f docker/docker-compose.backend.yml up --build

# Start only frontend
docker-compose -f docker/docker-compose.base.yml -f docker/docker-compose.frontend.yml up --build
```

## Network Architecture

All services communicate through the `hostel_network` Docker network:

- **Frontend** → **Backend** (API calls via `http://backend:8000`)
- **Frontend** → **CMS** (Content via `http://cms:1337`)
- **Backend** → **PostgreSQL** (Database via `postgres:5432`)
- **Backend** → **Redis** (Cache via `redis:6379`)
- **CMS** → **PostgreSQL** (Database via `postgres:5432`)

## Service Dependencies

```
postgres (base)
    ↓
redis (base)
    ↓
backend (depends on postgres + redis)
    ↓
cms (depends on postgres)
    ↓
frontend (depends on backend + cms)
```

## Volume Management

- **Source Code**: Mounted for development, excluded in production
- **Dependencies**: Named volumes for `node_modules`, `__pycache__`, etc.
- **Data**: Persistent volumes for databases, uploads, and static files

## Environment Variables

Each service has its own environment configuration:
- **Backend**: Django settings, database URLs, Redis URLs
- **CMS**: Strapi configuration, database settings
- **Frontend**: API endpoints, build settings

## Benefits of Modular Structure

1. **Selective Deployment**: Run only the services you need
2. **Easier Testing**: Test individual components in isolation
3. **Better Maintenance**: Update services independently
4. **Flexible Scaling**: Scale services based on demand
5. **Clear Dependencies**: Explicit service relationships
6. **Environment Separation**: Different configs for dev/prod
