FROM postgres:16-alpine

# Install pg_uuidv7 extension for UUID v7 support (ADR-017)
# Uses pre-built extension files from a community image to avoid
# cloning from GitHub during build (network proxy issues in Docker build context).
# Alpine postgres uses /usr/local/ paths (not /usr/lib/postgresql/16/ like Debian).
COPY --from=jegj/postgres_16_uuidv7:latest /usr/lib/postgresql/16/lib/pg_uuidv7.so /usr/local/lib/postgresql/pg_uuidv7.so
COPY --from=jegj/postgres_16_uuidv7:latest /usr/share/postgresql/16/extension/pg_uuidv7.control /usr/local/share/postgresql/extension/pg_uuidv7.control
COPY --from=jegj/postgres_16_uuidv7:latest /usr/share/postgresql/16/extension/pg_uuidv7--1.5.sql /usr/local/share/postgresql/extension/pg_uuidv7--1.5.sql

HEALTHCHECK --interval=10s --timeout=5s --retries=5 \
  CMD pg_isready -U postgres
