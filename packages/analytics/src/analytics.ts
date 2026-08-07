export interface AnalyticsEvent {
  readonly event: string
  readonly properties?: Record<string, unknown>
  readonly userId?: string
  readonly tenantId?: string
}

export function trackEvent(event: AnalyticsEvent): void {
  // Analytics implementation will be added in Phase 14
  console.log('[Analytics]', event.event, event.properties)
}
