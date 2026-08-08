import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module.js'
import { UserController } from './user.controller.js'
import { UserService } from './user.service.js'

/**
 * User management module.
 *
 * Provides user profile operations with authorization.
 * Imports AuthModule for authentication and authorization services.
 */
@Module({
  imports: [AuthModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
