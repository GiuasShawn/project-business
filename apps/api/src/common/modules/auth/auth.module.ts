import { type MiddlewareConsumer, Module, type NestModule, RequestMethod } from '@nestjs/common'
import { AuthController } from './auth.controller.js'
import { AuthMiddleware } from './auth.middleware.js'
import { AuthService } from './auth.service.js'

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply auth middleware to all routes for optional user context
    consumer.apply(AuthMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL })
  }
}
