import { type MiddlewareConsumer, Module, type NestModule, RequestMethod } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module.js'
import { TenantResolutionMiddleware } from './tenant-resolution.middleware.js'
import { TenantController } from './tenant.controller.js'
import { TenantService } from './tenant.service.js'

/**
 * Tenant NestJS module.
 *
 * Provides multi-tenancy services and middleware.
 * Exports TenantService for use in other modules.
 *
 * @see docs/adr/ADR-004-Multi-Tenancy.md
 */
@Module({
  imports: [AuthModule],
  controllers: [TenantController],
  providers: [TenantService],
  exports: [TenantService],
})
export class TenantModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply tenant resolution middleware to all routes
    // This must run after AuthMiddleware to have access to the authenticated user
    consumer.apply(TenantResolutionMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL })
  }
}
