FROM postgres:16-alpine

# Build pg_uuidv7 extension from source for UUID v7 support (ADR-017)
RUN apk add --no-cache build-base git make gcc && \
    git clone --depth 1 https://github.com/fboulay/pg_uuidv7.git /tmp/pg_uuidv7 && \
    cd /tmp/pg_uuidv7 && \
    make && \
    make install && \
    apk del build-base git make gcc && \
    rm -rf /tmp/pg_uuidv7

HEALTHCHECK --interval=10s --timeout=5s --retries=5 \
  CMD pg_isready -U postgres
