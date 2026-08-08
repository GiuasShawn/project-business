import { type MiddlewareConsumer, Module, type NestModule } from '@nestjs/common'
import { RequestIdMiddleware } from './common/middleware/request-id.middleware.js'
import { RequestLoggingMiddleware } from './common/middleware/request-logging.middleware.js'
import { AuthModule } from './common/modules/auth/auth.module.js'
import { ConfigModule } from './common/modules/config/config.module.js'
import { DatabaseModule } from './common/modules/database/database.module.js'
import { HealthModule } from './common/modules/health/health.module.js'
import { RedisModule } from './common/modules/redis/redis.module.js'

/**
 * Root application module.
 *
 * Imports all core infrastructure modules and registers
 * global middleware for correlation IDs, request logging,
 * and optional authentication context.
 */

@Module({
  imports: [ConfigModule, DatabaseModule, HealthModule, RedisModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    // Apply correlation ID to all routes
    consumer.apply(RequestIdMiddleware).forRoutes('*')

    // Apply request logging to all routes (must run after RequestIdMiddleware)
    consumer.apply(RequestLoggingMiddleware).forRoutes('*')
  }
}
