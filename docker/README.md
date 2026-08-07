# Docker Configuration

Development and production Docker configurations for Project Loom.

## Development

```bash
# Start all services
docker compose -f docker-compose.yml up -d

# Stop all services
docker compose -f docker-compose.yml down

# View logs
docker compose -f docker-compose.yml logs -f
```

## Services

| Service | Port | Description |
|---------|------|-------------|
| PostgreSQL | 5432 | Database |
| Redis | 6379 | Cache & Queue |
| Meilisearch | 7700 | Search |
| MailHog | 8025 | Email Testing |

## Production

```bash
docker compose -f docker-compose.prod.yml up -d
```
