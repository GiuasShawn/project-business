import { type Env, env } from '@loom/config'
import { Injectable } from '@nestjs/common'

/**
 * Typed configuration service.
 *
 * Wraps the validated environment from @loom/config.
 * Provides type-safe access to all environment variables.
 */

@Injectable()
export class ConfigService {
  private readonly config: Env = env

  /**
   * Get the full validated configuration object.
   */
  getConfig(): Env {
    return this.config
  }

  /**
   * Get a specific configuration value by key.
   */
  get<K extends keyof Env>(key: K): Env[K] {
    return this.config[key]
  }

  /**
   * Check if the application is running in production.
   */
  isProduction(): boolean {
    return this.config.NODE_ENV === 'production'
  }

  /**
   * Check if the application is running in development.
   */
  isDevelopment(): boolean {
    return this.config.NODE_ENV === 'development'
  }
}
