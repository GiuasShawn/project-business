import { Injectable, Logger, type NestMiddleware } from '@nestjs/common'
import type { NextFunction, Request, Response } from 'express'

/**
 * Request logging middleware.
 *
 * Logs every completed request with:
 *  - method, path, status code
 *  - duration in ms
 *  - requestId (from RequestIdMiddleware)
 *  - ip address
 *  - userId / tenantId (if available on request)
 *
 * Structured for easy filtering in production log aggregators.
 */

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP')

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, url, ip } = req
    const requestId = req.requestId ?? 'unknown'

    res.on('finish', () => {
      const duration = Date.now() - (req.startTime ?? Date.now())
      const { statusCode } = res

      // Extract user/tenant context if set by auth middleware (Phase 3+)
      const reqAny = req as unknown as Record<string, unknown>
      const userId = reqAny.userId as string | undefined
      const tenantId = reqAny.tenantId as string | undefined

      const logContext = {
        requestId,
        method,
        path: url,
        status: statusCode,
        duration,
        ip: ip ?? req.socket.remoteAddress,
        ...(userId ? { userId } : {}),
        ...(tenantId ? { tenantId } : {}),
      }

      if (statusCode >= 500) {
        this.logger.error(`${method} ${url} ${statusCode} ${duration}ms`, logContext)
      } else if (statusCode >= 400) {
        this.logger.warn(`${method} ${url} ${statusCode} ${duration}ms`, logContext)
      } else {
        this.logger.log(`${method} ${url} ${statusCode} ${duration}ms`, logContext)
      }
    })

    next()
  }
}
