import { Global, Module } from '@nestjs/common'
import { RedisService } from './redis.service.js'

/**
 * Redis NestJS module.
 *
 * Provides a managed ioredis connection via dependency injection.
 *
 * @example
 * ```ts
 * // In a service:
 * constructor(private readonly redis: RedisService) {}
 *
 * await this.redis.set('key', 'value', 'EX', 3600)
 * const value = await this.redis.get('key')
 * ```
 */

@Global()
@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
