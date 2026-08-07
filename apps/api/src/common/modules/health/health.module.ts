import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module.js'
import { RedisModule } from '../redis/redis.module.js'
import { HealthController } from './health.controller.js'
import { HealthService } from './health.service.js'

/**
 * Health check NestJS module.
 *
 * Provides:
 *  - GET /health — basic liveness check
 *  - GET /health/ready — readiness check (DB + Redis)
 *  - GET /health/live — liveness check
 */

@Module({
  imports: [DatabaseModule, RedisModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
