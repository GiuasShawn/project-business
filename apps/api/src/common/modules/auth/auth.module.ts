import { type MiddlewareConsumer, Module, type NestModule, RequestMethod } from '@nestjs/common'
import { AuthController } from './auth.controller.js'
import { AuthMiddleware } from './auth.middleware.js'
import { AuthService } from './auth.service.js'
import { PermissionsGuard } from './permissions.guard.js'
import { RbacService } from './rbac.service.js'
import { RolesGuard } from './roles.guard.js'

/**
 * Auth NestJS module.
 *
 * Provides authentication and authorization services.
 * Exports guards and services for use in other modules.
 */
@Module({
  controllers: [AuthController],
  providers: [AuthService, RbacService, RolesGuard, PermissionsGuard],
  exports: [AuthService, RbacService, RolesGuard, PermissionsGuard],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply auth middleware to all routes for optional user context
    consumer.apply(AuthMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL })
  }
}
