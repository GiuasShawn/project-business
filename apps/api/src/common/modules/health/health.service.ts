import { Injectable } from '@nestjs/common'
import { DatabaseService } from '../database/database.service.js'
import { RedisService } from '../redis/redis.service.js'

export interface HealthStatus {
  status: 'ok' | 'error'
  timestamp: string
  version: string
  uptime: number
  checks: {
    database: ComponentHealth
    redis: ComponentHealth
  }
}

export interface ComponentHealth {
  status: 'ok' | 'error'
  latencyMs?: number
  error?: string
}

/**
 * Health check service.
 *
 * Probes each infrastructure component and reports aggregate status.
 * Tracks startup completion for the /health/startup endpoint.
 */

@Injectable()
export class HealthService {
  private startupComplete = false

  constructor(
    private readonly database: DatabaseService,
    private readonly redis: RedisService,
  ) {}

  /**
   * Mark startup as complete. Called after all modules are initialized.
   */
  markStartupComplete(): void {
    this.startupComplete = true
  }

  /**
   * Is the application fully started?
   */
  isStartupComplete(): boolean {
    return this.startupComplete
  }

  /**
   * GET /health/live — Liveness check.
   * Process is alive.
   */
  getLiveness(): { status: string; timestamp: string } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    }
  }

  /**
   * GET /health/startup — Startup check.
   * Returns ok only after bootstrap completes.
   */
  getStartup(): { status: string; timestamp: string; uptime: number } {
    return {
      status: this.startupComplete ? 'ok' : 'starting',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    }
  }

  /**
   * GET /health/ready — Readiness check.
   * Verifies all infrastructure dependencies.
   */
  async getReadiness(): Promise<HealthStatus> {
    const [database, redis] = await Promise.all([this.checkDatabase(), this.checkRedis()])

    const allHealthy = database.status === 'ok' && redis.status === 'ok'

    return {
      status: allHealthy ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      version: process.env.APP_VERSION ?? '0.1.0',
      uptime: process.uptime(),
      checks: {
        database,
        redis,
      },
    }
  }

  private async checkDatabase(): Promise<ComponentHealth> {
    const start = Date.now()
    try {
      const healthy = await this.database.isHealthy()
      return {
        status: healthy ? 'ok' : 'error',
        latencyMs: Date.now() - start,
      }
    } catch (error) {
      return {
        status: 'error',
        latencyMs: Date.now() - start,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  private async checkRedis(): Promise<ComponentHealth> {
    const start = Date.now()
    try {
      const healthy = await this.redis.isHealthy()
      return {
        status: healthy ? 'ok' : 'error',
        latencyMs: Date.now() - start,
      }
    } catch (error) {
      return {
        status: 'error',
        latencyMs: Date.now() - start,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }
}
