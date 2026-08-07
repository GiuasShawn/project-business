import { Injectable, Logger, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common'
import Redis from 'ioredis'

/**
 * Managed Redis connection service.
 *
 * Lifecycle:
 *  - Connects on module init
 *  - Disconnects on module destroy
 *  - Exposes the underlying ioredis client for all Redis operations
 */

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name)
  private client!: Redis

  async onModuleInit(): Promise<void> {
    const url = process.env.REDIS_URL ?? 'redis://localhost:6379'

    this.client = new Redis(url, {
      maxRetriesPerRequest: 3,
      retryStrategy(times: number): number | null {
        if (times > 10) {
          return null
        }
        return Math.min(times * 200, 5000)
      },
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

    await this.client.ping()
    this.logger.log('Redis connection established')
  }

  async onModuleDestroy(): Promise<void> {
    if (this.client) {
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
      const result = await this.client.ping()
      return result === 'PONG'
    } catch {
      return false
    }
  }
}
