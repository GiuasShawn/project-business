import { Global, Module } from '@nestjs/common'
import { ConfigService } from './config.service.js'

/**
 * Configuration NestJS module.
 *
 * Wraps the existing @loom/config package and makes it available
 * via NestJS dependency injection.
 *
 * The config is validated once at startup (in @loom/config).
 * This module simply exposes the validated values to NestJS services.
 */

@Global()
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
