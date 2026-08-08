import { Injectable, Logger, type OnModuleDestroy } from '@nestjs/common'
import Redis from 'ioredis'

/**
 * Managed Redis connection service.
 *
 * Lifecycle:
 *  - Creates the client handle on module init (lazy connect via ioredis auto-connect)
 *  - Disconnects on module destroy
 *  - Exposes the underlying ioredis client for all Redis operations
 *
 * The connection is not awaited at module init — a missing Redis at startup
 * (e.g., local development without the container) produces log warnings but
 * does NOT crash the application. The `/health/ready` endpoint reports the
 * live connection status.
 */

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name)
  private readonly client: Redis

  constructor() {
    const url = process.env.REDIS_URL ?? 'redis://localhost:6379'
    const logger = this.logger

    this.client = new Redis(url, {
      // Disable the per-command retry limit so ioredis never throws from the
      // command queue — connection retries are governed solely by retryStrategy.
      maxRetriesPerRequest: null,
      retryStrategy(times: number): number | null {
        if (times > 10) {
          logger.warn('Redis max retries (10) reached. Giving up.')
          return null
        }
        return Math.min(times * 200, 5000)
      },
      lazyConnect: true,
    })

    this.client.on('connect', () => {
      this.logger.log('Redis connected')
    })

    this.client.on('error', (error: Error) => {
      this.logger.error('Redis connection error', error.stack)
    })

    this.client.on('reconnecting', () => {
      this.logger.warn('Redis reconnecting...')
    })

    // Attempt an initial connect without crashing if Redis is unavailable.
    this.client.connect().catch((error: Error) => {
      this.logger.warn(
        'Redis unavailable at startup — service will rely on health checks.',
        error.message,
      )
    })
  }

  async onModuleDestroy(): Promise<void> {
    if (this.client.status === 'ready') {
      await this.client.quit()
      this.logger.log('Redis connection closed')
    }
  }

  /**
   * Get the underlying ioredis client.
   */
  getClient(): Redis {
    return this.client
  }

  /**
   * Health check — returns true if Redis responds to PING.
   */
  async isHealthy(): Promise<boolean> {
    try {
      if (this.client.status !== 'ready') {
        return false
      }
      const result = await this.client.ping()
      return result === 'PONG'
    } catch {
      return false
    }
  }
}
