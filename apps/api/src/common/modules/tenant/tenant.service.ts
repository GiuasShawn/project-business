import { store, storeMembership } from '@loom/database'
import type {
  AuthUser,
  CreateStoreDto,
  Store,
  StoreMembership,
  StoreProfile,
  UpdateStoreDto,
} from '@loom/types'
import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { and, eq, inArray } from 'drizzle-orm'
import { DatabaseService } from '../database/database.service.js'

/**
 * Tenant service.
 *
 * Handles store (tenant) operations and membership management.
 * Provides tenant resolution logic for middleware.
 *
 * @see docs/adr/ADR-004-Multi-Tenancy.md
 */
@Injectable()
export class TenantService {
  private readonly logger = new Logger(TenantService.name)

  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Get store by ID.
   */
  async getStoreById(storeId: string): Promise<Store | null> {
    const db = this.databaseService.getDb()
    const result = await db.select().from(store).where(eq(store.id, storeId)).limit(1)

    if (result.length === 0) {
      return null
    }

    return result[0] as Store
  }

  /**
   * Get store by slug (subdomain).
   */
  async getStoreBySlug(slug: string): Promise<Store | null> {
    const db = this.databaseService.getDb()
    const result = await db.select().from(store).where(eq(store.slug, slug)).limit(1)

    if (result.length === 0) {
      return null
    }

    return result[0] as Store
  }

  /**
   * Map a Store row to the API StoreProfile shape.
   */
  toStoreProfile(storeData: Store): StoreProfile {
    return {
      id: storeData.id,
      name: storeData.name,
      slug: storeData.slug,
      description: storeData.description,
      logo: storeData.logo,
      banner: storeData.banner,
      status: storeData.status,
      ownerId: storeData.ownerId,
      createdAt: storeData.createdAt,
      updatedAt: storeData.updatedAt,
    }
  }

  /**
   * Get store profile for API responses.
   */
  async getStoreProfile(storeId: string): Promise<StoreProfile | null> {
    const storeData = await this.getStoreById(storeId)
    if (!storeData) {
      return null
    }

    return this.toStoreProfile(storeData)
  }

  /**
   * Get user's membership for a specific store.
   */
  async getMembership(userId: string, storeId: string): Promise<StoreMembership | null> {
    const db = this.databaseService.getDb()
    const result = await db
      .select()
      .from(storeMembership)
      .where(and(eq(storeMembership.userId, userId), eq(storeMembership.storeId, storeId)))
      .limit(1)

    if (result.length === 0) {
      return null
    }

    return result[0] as StoreMembership
  }

  /**
   * Get all stores a user belongs to.
   *
   * Uses a batched IN query instead of N+1 loop per ADR-004 §"Repository Standards".
   * Fetches all memberships in one query, then all stores in one batched query,
   * then joins them in memory.
   */
  async getUserStores(
    userId: string,
  ): Promise<Array<{ store: Store; membership: StoreMembership }>> {
    const db = this.databaseService.getDb()
    const memberships = await db
      .select()
      .from(storeMembership)
      .where(eq(storeMembership.userId, userId))

    if (memberships.length === 0) {
      return []
    }

    const storeIds = memberships.map((m) => m.storeId)
    const storesData = await db.select().from(store).where(inArray(store.id, storeIds))

    const storeMap = new Map(storesData.map((s) => [s.id, s as Store]))

    return memberships
      .map((membership) => {
        const storeData = storeMap.get(membership.storeId)
        if (!storeData) return null
        return { store: storeData, membership: membership as StoreMembership }
      })
      .filter((item): item is { store: Store; membership: StoreMembership } => item !== null)
  }

  /**
   * Create a new store.
   *
   * The creating user becomes the owner.
   */
  async createStore(authUser: AuthUser, dto: CreateStoreDto): Promise<StoreProfile> {
    const db = this.databaseService.getDb()

    // Check slug uniqueness
    const existingStore = await this.getStoreBySlug(dto.slug)
    if (existingStore) {
      throw new ForbiddenException('Store slug already exists')
    }

    // Create store
    const [newStore] = await db
      .insert(store)
      .values({
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        ownerId: authUser.id,
        status: 'DRAFT',
      })
      .returning()

    // Create owner membership
    await db.insert(storeMembership).values({
      userId: authUser.id,
      storeId: newStore.id,
      role: 'OWNER',
      acceptedAt: new Date(),
    })

    this.logger.log(`Store created: ${newStore.id} (${newStore.slug}) by user ${authUser.id}`)

    return this.getStoreProfile(newStore.id) as Promise<StoreProfile>
  }

  /**
   * Update store.
   *
   * V1: Only the store owner can update.
   */
  async updateStore(
    authUser: AuthUser,
    storeId: string,
    dto: UpdateStoreDto,
  ): Promise<StoreProfile> {
    // Verify membership
    const membership = await this.getMembership(authUser.id, storeId)
    if (!membership) {
      throw new ForbiddenException('Not a member of this store')
    }

    // Only owner can update (V1: single owner per store)
    if (membership.role !== 'OWNER') {
      throw new ForbiddenException('Only the store owner can update the store')
    }

    const db = this.databaseService.getDb()
    await db
      .update(store)
      .set({
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.logo !== undefined && { logo: dto.logo }),
        ...(dto.banner !== undefined && { banner: dto.banner }),
        updatedAt: new Date(),
      })
      .where(eq(store.id, storeId))

    this.logger.log(`Store updated: ${storeId} by user ${authUser.id}`)

    return this.getStoreProfile(storeId) as Promise<StoreProfile>
  }

  /**
   * Resolve tenant context from store ID and user.
   *
   * This is the core tenant resolution logic that:
   * 1. Validates the store exists
   * 2. Validates the user has membership
   * 3. Returns the full tenant context
   *
   * @throws NotFoundException if store not found
   * @throws ForbiddenException if user not a member
   */
  async resolveTenantContext(
    userId: string,
    storeId: string,
  ): Promise<{
    store: Store
    membership: StoreMembership
  }> {
    const storeData = await this.getStoreById(storeId)
    if (!storeData) {
      throw new NotFoundException('Store not found')
    }

    const membership = await this.getMembership(userId, storeId)
    if (!membership) {
      throw new ForbiddenException('Not a member of this store')
    }

    return {
      store: storeData,
      membership: membership as StoreMembership,
    }
  }

  /**
   * Resolve tenant context from subdomain and user.
   *
   * Used for public storefront requests where the tenant is
   * identified by the HTTP Host Header subdomain.
   *
   * @throws NotFoundException if store not found
   * @throws ForbiddenException if user not a member (for authenticated requests)
   */
  async resolveTenantFromSubdomain(
    slug: string,
    userId?: string,
  ): Promise<{
    store: Store
    membership?: StoreMembership
  }> {
    const storeData = await this.getStoreBySlug(slug)
    if (!storeData) {
      throw new NotFoundException('Store not found')
    }

    // For authenticated requests, verify membership
    if (userId) {
      const membership = await this.getMembership(userId, storeData.id)
      if (!membership) {
        throw new ForbiddenException('Not a member of this store')
      }
      return { store: storeData, membership: membership as StoreMembership }
    }

    // For unauthenticated requests (public storefront), no membership required
    return { store: storeData }
  }
}
