import { randomUUID } from 'node:crypto'
import type { NestMiddleware } from '@nestjs/common'
import type { NextFunction, Request, Response } from 'express'

/**
 * Request ID middleware.
 *
 * Assigns a unique UUID to every incoming request.
 * Uses the client-provided X-Request-ID header if present,
 * otherwise generates a new one.
 *
 * The ID is:
 *  - Set on req.requestId for downstream use
 *  - Returned in the X-Request-ID response header
 *  - Included in all log output via the request logging middleware
 */

declare global {
  namespace Express {
    interface Request {
      requestId: string
      startTime: number
    }
  }
}

export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const requestId = (req.headers['x-request-id'] as string) || randomUUID()

    req.requestId = requestId
    req.startTime = Date.now()

    res.setHeader('X-Request-ID', requestId)

    next()
  }
}
