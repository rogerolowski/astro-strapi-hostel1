# OpenResty Configuration for Hostel Management System

This directory contains OpenResty (Nginx + Lua) configuration files that replace the standard Nginx reverse proxy in production mode.

## Directory Structure

```
openresty/
├── nginx.conf              # Main OpenResty configuration
├── conf.d/
│   ├── hostel.conf         # HTTP server configuration
│   └── ssl.conf.example    # HTTPS configuration template
├── lua/
│   └── utils.lua           # Lua utility functions
├── ssl/                    # SSL certificates (place your certs here)
└── README.md               # This file
```

## Features

### Enhanced Capabilities over Standard Nginx
- **Lua Scripting**: Custom request processing, authentication, and business logic
- **Dynamic Configuration**: Runtime configuration changes without restarts
- **Advanced Rate Limiting**: Redis-backed rate limiting with custom rules
- **Real-time Logging**: Custom logging and monitoring with Lua
- **JWT Validation**: Built-in JWT token validation capabilities
- **Health Checks**: Automated backend health monitoring

### Security Features
- Rate limiting for API endpoints and login attempts
- CORS handling for cross-origin requests
- Security headers (HSTS, CSP, X-Frame-Options, etc.)
- Custom error responses to prevent information leakage
- JWT token validation middleware

### Performance Optimizations
- HTTP/2 support
- Gzip compression
- Static file caching with proper cache headers
- Connection keepalive and upstream connection pooling
- Lua shared memory for caching

## Configuration Files

### nginx.conf
Main configuration file with:
- Worker process settings
- Lua package paths and shared dictionaries
- Upstream definitions for all services
- Global rate limiting zones
- Logging configuration

### conf.d/hostel.conf
HTTP server configuration with:
- API routing (`/api/` → Django backend)
- CMS admin routing (`/admin` → Strapi admin)
- CMS content API routing (`/strapi/` → Strapi content)
- Static file handling
- Frontend routing (default → Astro)
- WebSocket support for development features

### conf.d/ssl.conf.example
HTTPS server configuration template with:
- SSL/TLS configuration
- Security headers
- HTTPS redirects
- Same routing as HTTP version but with SSL termination

### lua/utils.lua
Lua utilities providing:
- JWT token validation
- Redis-based rate limiting
- Request logging
- Custom error responses
- Backend health checks

## Usage

### Production Mode
```bash
# Start with OpenResty reverse proxy
./run.sh prod
```

### SSL Setup
1. Obtain SSL certificates for your domain
2. Copy certificates to `openresty/ssl/` directory
3. Rename `ssl.conf.example` to `ssl.conf`
4. Update domain names and certificate paths in `ssl.conf`
5. Restart the production environment

### Custom Lua Scripts
To add custom Lua functionality:
1. Create new `.lua` files in the `lua/` directory
2. Require them in your location blocks
3. Use OpenResty's extensive Lua API for custom logic

## Environment Variables

The configuration uses these environment variables:
- `HOSTEL_ENV=production` - Sets production mode indicators

## Service Routing

| URL Pattern | Destination | Purpose |
|------------|-------------|---------|
| `/api/` | Django Backend (port 8000) | REST API endpoints |
| `/admin` | Strapi CMS (port 1337) | CMS admin interface |
| `/strapi/` | Strapi CMS (port 1337) | Content API (prefix removed) |
| `/static/` | Django Backend | Static assets |
| `/media/` | Django Backend | User uploaded media |
| `/uploads/` | Strapi CMS | CMS uploaded files |
| `/` | Astro Frontend (port 4321) | Main application |
| `/_astro/` | Astro Frontend | WebSocket/dev assets |

## Rate Limiting

- **API endpoints**: 10 requests/second, burst up to 20
- **Login endpoints**: 1 request/second, burst up to 5
- **Content API**: 30 requests/second for content fetching

## Logging

Logs are written to:
- `/usr/local/openresty/nginx/logs/access.log` - Access logs with custom format
- `/usr/local/openresty/nginx/logs/error.log` - Error logs

## Monitoring & Health Checks

- Health check endpoint: `http://localhost/health`
- Backend service health monitoring via Lua
- Custom error responses for service unavailability

## Extending OpenResty

### Adding New Lua Modules
1. Install via `opm` (OpenResty Package Manager) or manually
2. Update `lua_package_path` in `nginx.conf` if needed
3. Require modules in your location blocks

### Common Extensions
- `lua-resty-redis` - Redis integration
- `lua-resty-http` - HTTP client
- `lua-resty-jwt` - JWT handling
- `lua-resty-template` - Template rendering
- `lua-cjson` - JSON processing

## Troubleshooting

### Common Issues
1. **Lua script errors**: Check error logs for syntax or runtime errors
2. **Module not found**: Ensure `lua_package_path` includes module directories
3. **Performance issues**: Monitor worker connections and adjust accordingly
4. **SSL errors**: Verify certificate paths and permissions

### Debug Commands
```bash
# Check OpenResty configuration
docker-compose exec openresty openresty -t

# Reload configuration without restart
docker-compose exec openresty openresty -s reload

# View logs
docker-compose logs -f openresty

# Access container for debugging
docker-compose exec openresty sh
```

## Migration from Nginx

This OpenResty setup is a drop-in replacement for the standard Nginx configuration. The routing and proxy behavior remain the same, with additional Lua-powered features available when needed.
