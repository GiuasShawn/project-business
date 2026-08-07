import type { ApiResponse } from '@loom/types'

export interface ApiClient {
  readonly get: <T>(url: string) => Promise<ApiResponse<T>>
  readonly post: <T>(url: string, body?: unknown) => Promise<ApiResponse<T>>
  readonly put: <T>(url: string, body?: unknown) => Promise<ApiResponse<T>>
  readonly patch: <T>(url: string, body?: unknown) => Promise<ApiResponse<T>>
  readonly delete: <T>(url: string) => Promise<ApiResponse<T>>
}

export function createApiClient(baseUrl: string): ApiClient {
  async function request<T>(method: string, url: string, body?: unknown): Promise<ApiResponse<T>> {
    const response = await fetch(`${baseUrl}${url}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    return response.json() as Promise<ApiResponse<T>>
  }

  return {
    get: (url) => request('GET', url),
    post: (url, body) => request('POST', url, body),
    put: (url, body) => request('PUT', url, body),
    patch: (url, body) => request('PATCH', url, body),
    delete: (url) => request('DELETE', url),
  }
}
