import {
  type CanActivate,
  type ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common'
import type { Request } from 'express'

interface RateLimitEntry {
  count: number
  readonly resetAt: number
}

/**
 * Simple in-memory rate limiter for auth endpoints.
 *
 * Uses a sliding window per IP + endpoint pair. This is NOT a distributed
 * rate limiter — it operates per-process. For multi-instance deployments
 * the state must be moved to Redis (Phase 19).
 *
 * Limits are documented in the constructor call. All failures use the
 * existing API error contract.
 */
@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly store = new Map<string, RateLimitEntry>()
  private readonly maxRequests: number
  private readonly windowMs: number

  constructor(maxRequests = 10, windowSeconds = 60) {
    this.maxRequests = maxRequests
    this.windowMs = windowSeconds * 1000

    // Periodic cleanup every 60 seconds to prevent memory leak.
    // `.unref()` so the timer never keeps the process alive on its own.
    setInterval(() => this.cleanup(), 60_000).unref()
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>()
    const ip = request.ip ?? 'unknown'
    const path = request.path ?? 'unknown'
    const key = `${ip}:${path}`
    const now = Date.now()

    const entry = this.store.get(key)

    if (!entry || now > entry.resetAt) {
      this.store.set(key, { count: 1, resetAt: now + this.windowMs })
      return true
    }

    if (entry.count >= this.maxRequests) {
      throw new HttpException(
        {
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests. Please try again later.',
          },
        },
        HttpStatus.TOO_MANY_REQUESTS,
      )
    }

    entry.count++
    return true
  }

  private cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetAt) {
        this.store.delete(key)
      }
    }
  }
}
