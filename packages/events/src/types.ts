import type { UUID } from '@loom/types'

export enum EventType {
  OrderPlaced = 'order.placed',
  PaymentCaptured = 'payment.captured',
  PaymentFailed = 'payment.failed',
  ProductPublished = 'product.published',
  InventoryReserved = 'inventory.reserved',
  ReturnApproved = 'return.approved',
  PayoutCompleted = 'payout.completed',
}

export interface DomainEvent<T = unknown> {
  readonly id: UUID
  readonly type: EventType
  readonly aggregateId: UUID
  readonly tenantId: string
  readonly timestamp: Date
  readonly version: number
  readonly data: T
  readonly metadata: {
    readonly correlationId?: string
    readonly causationId?: string
  }
}
