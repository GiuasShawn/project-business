import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module.js'
import { GlobalExceptionFilter } from './common/filters/global-exception.filter.js'
import { HealthService } from './common/modules/health/health.service.js'

async function bootstrap(): Promise<void> {
  const startTime = Date.now()
  const logger = new Logger('Bootstrap')

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  })

  // Global prefix
  app.setGlobalPrefix('api/v1')

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
  })

  // Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter())

  // Swagger / OpenAPI
  const config = new DocumentBuilder()
    .setTitle('Project Loom API')
    .setDescription('Multi-tenant fashion commerce platform API')
    .setVersion('0.1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication')
    .addTag('users', 'User Management')
    .addTag('health', 'Health checks')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)

  // Shutdown hooks
  app.enableShutdownHooks()

  const port = process.env.PORT ?? 4000
  await app.listen(port)

  // Mark startup complete in health service
  const healthService = app.get(HealthService)
  healthService.markStartupComplete()

  // Startup diagnostics
  const duration = Date.now() - startTime
  const nodeVersion = process.version
  const env = process.env.NODE_ENV ?? 'development'
  const apiVersion = 'v1'
  const buildVersion = process.env.APP_VERSION ?? '0.1.0'
  const gitSha = process.env.GIT_COMMIT_SHA ?? 'dev'

  logger.log('─'.repeat(50))
  logger.log('Project Loom')
  logger.log('')
  logger.log(`  Environment : ${env}`)
  logger.log(`  Node        : ${nodeVersion}`)
  logger.log(`  API Version : ${apiVersion}`)
  logger.log(`  Build       : ${buildVersion} (${gitSha})`)
  logger.log(`  Port        : ${port}`)
  logger.log('')
  logger.log(`  Health      : http://localhost:${port}/api/v1/health`)
  logger.log(`  Docs        : http://localhost:${port}/docs`)
  logger.log('')
  logger.log(`  Started in ${duration}ms`)
  logger.log('─'.repeat(50))
}

bootstrap()
