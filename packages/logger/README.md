# @loom/logger

Structured logging for Project Loom.

## Purpose

Pino-based structured logging with request correlation.

## Usage

```typescript
import { logger, createLogger } from '@loom/logger'

logger.info('Server started')

const reqLogger = createLogger({ requestId: '123', correlationId: '456' })
reqLogger.info('Processing request')
```

## Rules

- Structured logging only
- Include request_id, correlation_id, trace_id
- Never log secrets
- Never log passwords, tokens, or card data
