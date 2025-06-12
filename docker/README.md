# CouchDB Docker Setup

This directory contains Docker Compose configuration and CouchDB settings for both development and production environments.

## Quick Start

### Development Environment
```bash
# Start CouchDB in development mode
docker-compose --profile dev up -d

# Access CouchDB Fauxton (Web UI)
open http://localhost:5984/_utils

# Default credentials: admin/password
```

### Production Environment
```bash
# Copy environment file and set secure password
cp .env.example .env
# Edit .env and set COUCHDB_PASSWORD

# Start CouchDB in production mode
docker-compose --profile prod up -d

# Access CouchDB Fauxton (Web UI)
open http://localhost:5985/_utils
```

## Configuration Files

### Development (`docker/couchdb/dev/local.ini`)
- **Full logging**: Debug level logging enabled
- **Weak security**: Fast password hashing (iterations=1)
- **CORS enabled**: Allows all origins for development
- **No authentication required**: `require_valid_user = false`
- **Persistent cookies**: Enabled for convenience

### Production (`docker/couchdb/prod/local.ini`)
- **Minimal logging**: Warning level only
- **Strong security**: Secure password hashing (iterations=10000)
- **CORS restricted**: Only specific domains allowed
- **Authentication required**: `require_valid_user = true`
- **No persistent cookies**: Enhanced security
- **Secure rewrites**: Enabled

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `COUCHDB_PASSWORD` | Admin password for production | `changeme` |

## Ports

| Environment | Port | Description |
|-------------|------|-------------|
| Development | 5984 | CouchDB HTTP API |
| Production | 5985 | CouchDB HTTP API |

## Volumes

- `couchdb-dev-data`: Development database storage
- `couchdb-prod-data`: Production database storage

## Security Notes

### Development
- Uses weak password hashing for faster development
- Allows all CORS origins
- Debug logging enabled
- No authentication required for some operations

### Production
- Strong password hashing (10,000+ iterations)
- Restricted CORS origins (update in config)
- Minimal logging
- Authentication required for all operations
- Secure session management

## Commands

```bash
# Start development environment
docker-compose --profile dev up -d

# Start production environment
docker-compose --profile prod up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs couchdb-dev
docker-compose logs couchdb-prod

# Remove volumes (WARNING: This deletes all data)
docker-compose down -v
```

## Customization

1. **Update CORS origins** in production config:
   ```ini
   [cors]
   origins = https://yourdomain.com,https://www.yourdomain.com
   ```

2. **Set secure secret** in production config:
   ```ini
   [chttpd_auth]
   secret = your_random_secret_here
   ```

3. **Adjust logging levels** as needed:
   - `debug`, `info`, `warning`, `error`, `critical`

## Health Check

```bash
# Check if CouchDB is running
curl http://localhost:5984/

# Expected response:
# {"couchdb":"Welcome","version":"3.3.x"}
``` 