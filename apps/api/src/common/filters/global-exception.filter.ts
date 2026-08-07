import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import type { Request, Response } from 'express'
import { type ApiErrorResponse, ErrorCode } from '../types/error-response.js'

/**
 * Global exception filter.
 *
 * Catches all unhandled exceptions and returns a standardized error response.
 * Follows the frozen API error contract — never exposes internal details.
 */

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    const requestId = request.requestId

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let code: ErrorCode = ErrorCode.INTERNAL_ERROR
    let message = 'Internal server error'

    if (exception instanceof HttpException) {
      status = exception.getStatus()
      const exResponse = exception.getResponse()

      if (typeof exResponse === 'string') {
        message = exResponse
      } else if (typeof exResponse === 'object' && exResponse !== null) {
        const responseObj = exResponse as Record<string, unknown>
        message = (responseObj.message as string) ?? message
        // Map HttpException error strings to our ErrorCode
        const rawCode = responseObj.error as string | undefined
        if (rawCode && rawCode in ErrorCode) {
          code = rawCode as ErrorCode
        } else {
          code = status === 404 ? ErrorCode.NOT_FOUND : ErrorCode.BAD_REQUEST
        }
      }
    }

    // Log the error with context
    this.logger.error(
      `${request.method} ${request.url} ${status}`,
      exception instanceof Error ? exception.stack : String(exception),
    )

    const errorResponse: ApiErrorResponse = {
      success: false,
      error: {
        code,
        message,
        requestId,
        timestamp: new Date().toISOString(),
      },
    }

    response.status(status).json(errorResponse)
  }
}
