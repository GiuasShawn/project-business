export type UUID = string

export interface Timestamp {
  readonly created_at: Date
  readonly updated_at: Date
}

export interface PaginatedResponse<T> {
  readonly data: T[]
  readonly meta: {
    readonly total: number
    readonly page: number
    readonly limit: number
    readonly totalPages: number
  }
}

export interface ApiResponse<T> {
  readonly success: boolean
  readonly data?: T
  readonly error?: ErrorResponse
}

export interface ErrorResponse {
  readonly code: string
  readonly message: string
  readonly details?: Record<string, unknown>
}
