/**
 * Frozen API error response contract.
 *
 * Every error response from the API follows this exact shape.
 * Modules MUST NOT invent their own error formats.
 *
 * @example
 * ```json
 * {
 *   "success": false,
 *   "error": {
 *     "code": "VALIDATION_ERROR",
 *     "message": "Email is required",
 *     "requestId": "abc-123",
 *     "timestamp": "2026-08-08T00:00:00.000Z"
 *   }
 * }
 * ```
 */

export interface ApiErrorResponse {
  success: false
  error: {
    code: string
    message: string
    requestId?: string
    timestamp: string
    details?: Record<string, unknown>
  }
}

export interface ApiSuccessResponse<T = unknown> {
  success: true
  data: T
  meta?: {
    page?: number
    limit?: number
    total?: number
    hasMore?: boolean
  }
}

/**
 * Standard error codes used across the API.
 */
export const ErrorCode = {
  // Client errors (4xx)
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  CONFLICT: 'CONFLICT',
  RATE_LIMITED: 'RATE_LIMITED',
  BAD_REQUEST: 'BAD_REQUEST',

  // Server errors (5xx)
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
} as const

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode]

/**
 * Build a standardized error response.
 */
export function buildErrorResponse(
  code: ErrorCode,
  message: string,
  requestId?: string,
  details?: Record<string, unknown>,
): ApiErrorResponse {
  return {
    success: false,
    error: {
      code,
      message,
      requestId,
      timestamp: new Date().toISOString(),
      ...(details ? { details } : {}),
    },
  }
}
