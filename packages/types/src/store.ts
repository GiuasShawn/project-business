/**
 * Store-related types for multi-tenancy.
 *
 * @see docs/adr/ADR-004-Multi-Tenancy.md
 * @see docs/adr/ADR-013-Database-Enum-Case-Convention.md
 * @see docs/adr/ADR-015-Store-Status-Initial-State.md
 */

/**
 * Store status lifecycle.
 *
 * Canonical UPPERCASE values per ADR-013. Initial state is `DRAFT` per ADR-015.
 */
export type StoreStatus = 'DRAFT' | 'CONFIGURED' | 'PUBLISHED' | 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED'

/**
 * Store membership role.
 *
 * V1 Architecture: One primary store per seller.
 * Store has a single owner. No admin/member roles in V1.
 *
 * @see docs/adr/ADR-004-Multi-Tenancy.md
 * @see docs/product/Product-Data-Model.md (Entity — Store)
 */
export type StoreRole = 'OWNER'

/**
 * Store entity — tenant boundary.
 */
export interface Store {
  readonly id: string
  readonly name: string
  readonly slug: string
  readonly description?: string | null
  readonly logo?: string | null
  readonly banner?: string | null
  readonly status: StoreStatus
  readonly settings?: Record<string, unknown> | null
  readonly branding?: Record<string, unknown> | null
  readonly seo?: Record<string, unknown> | null
  readonly ownerId: string
  readonly createdAt: Date
  readonly updatedAt: Date
}

/**
 * Store membership — User ↔ Store relationship.
 */
export interface StoreMembership {
  readonly id: string
  readonly userId: string
  readonly storeId: string
  readonly role: StoreRole
  readonly invitedAt?: Date | null
  readonly acceptedAt?: Date | null
  readonly createdAt: Date
  readonly updatedAt: Date
}

/**
 * Tenant context — request-scoped tenant identity.
 *
 * This is the authoritative tenant context for the current request.
 * It must come from trusted server-side resolution, never from client input.
 *
 * @see docs/adr/ADR-004-Multi-Tenancy.md
 */
export interface TenantContext {
  readonly storeId: string
  readonly store: Store
  readonly membership: StoreMembership
}

/**
 * Create store DTO.
 */
export interface CreateStoreDto {
  readonly name: string
  readonly slug: string
  readonly description?: string
}

/**
 * Update store DTO.
 */
export interface UpdateStoreDto {
  readonly name?: string
  readonly description?: string
  readonly logo?: string | null
  readonly banner?: string | null
}

/**
 * Store profile for API responses.
 */
export interface StoreProfile {
  readonly id: string
  readonly name: string
  readonly slug: string
  readonly description?: string | null
  readonly logo?: string | null
  readonly banner?: string | null
  readonly status: StoreStatus
  readonly ownerId: string
  readonly createdAt: Date
  readonly updatedAt: Date
}
