import { Controller, Get } from '@nestjs/common'
import type { HealthStatus } from './health.service.js'
import type { HealthService } from './health.service.js'

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  /**
   * GET /health — Alias for liveness.
   */
  @Get()
  getHealth(): { status: string; timestamp: string } {
    return this.healthService.getLiveness()
  }

  /**
   * GET /health/live — Process alive.
   */
  @Get('live')
  getLiveness(): { status: string; timestamp: string } {
    return this.healthService.getLiveness()
  }

  /**
   * GET /health/startup — Startup completed.
   */
  @Get('startup')
  getStartup(): { status: string; timestamp: string; uptime: number } {
    return this.healthService.getStartup()
  }

  /**
   * GET /health/ready — Database + Redis ready.
   */
  @Get('ready')
  async getReadiness(): Promise<HealthStatus> {
    return this.healthService.getReadiness()
  }
}
