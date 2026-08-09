import { Permission } from '@loom/auth'
import type { AuthUser, StoreProfile } from '@loom/types'
import { createStoreSchema, updateStoreSchema } from '@loom/validation'
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import type { Request } from 'express'
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe.js'
import { RequirePermissions } from '../auth/auth.decorators.js'
import { AuthGuard } from '../auth/auth.guard.js'
import { PermissionsGuard } from '../auth/permissions.guard.js'
import { TenantGuard } from './tenant.guard.js'
import { TenantService } from './tenant.service.js'

/**
 * Tenant management controller.
 *
 * Provides endpoints for store (tenant) management.
 * All endpoints require authentication.
 *
 * @see docs/adr/ADR-004-Multi-Tenancy.md
 */
@ApiTags('stores')
@Controller('stores')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  /**
   * Create a new store.
   *
   * The creating user becomes the owner.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions(Permission.STORES_WRITE)
  @ApiOperation({ summary: 'Create a new store' })
  async createStore(
    @Req() req: Request,
    @Body(new ZodValidationPipe(createStoreSchema))
    dto: { name: string; slug: string; description?: string },
  ): Promise<{ success: true; data: { store: StoreProfile } }> {
    const authUser = (req as unknown as { authUser: AuthUser }).authUser
    const store = await this.tenantService.createStore(authUser, dto)

    return {
      success: true,
      data: { store },
    }
  }

  /**
   * Get current user's stores.
   */
  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current user's stores" })
  async getMyStores(@Req() req: Request): Promise<{
    success: true
    data: { stores: Array<{ store: StoreProfile; role: string }> }
  }> {
    const authUser = (req as unknown as { authUser: AuthUser }).authUser
    const userStores = await this.tenantService.getUserStores(authUser.id)

    // getUserStores returns batched full Store rows — map them to profiles
    // here instead of issuing a per-store query (avoids N+1).
    const stores: Array<{ store: StoreProfile; role: string }> = userStores.map((item) => ({
      store: this.tenantService.toStoreProfile(item.store),
      role: item.membership.role,
    }))

    return {
      success: true,
      data: { stores },
    }
  }

  /**
   * Get store by ID.
   */
  @Get(':storeId')
  @UseGuards(AuthGuard, TenantGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions(Permission.STORES_READ)
  @ApiParam({ name: 'storeId', description: 'Store ID' })
  @ApiOperation({ summary: 'Get store by ID' })
  async getStore(
    @Param('storeId') storeId: string,
  ): Promise<{ success: true; data: { store: StoreProfile } }> {
    const store = await this.tenantService.getStoreProfile(storeId)

    return {
      success: true,
      data: { store: store as StoreProfile },
    }
  }

  /**
   * Update store.
   *
   * V1: Only the store owner can update.
   */
  @Patch(':storeId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard, TenantGuard, PermissionsGuard)
  @ApiBearerAuth()
  @RequirePermissions(Permission.STORES_WRITE)
  @ApiParam({ name: 'storeId', description: 'Store ID' })
  @ApiOperation({ summary: 'Update store' })
  async updateStore(
    @Req() req: Request,
    @Param('storeId') storeId: string,
    @Body(new ZodValidationPipe(updateStoreSchema))
    dto: { name?: string; description?: string; logo?: string | null; banner?: string | null },
  ): Promise<{ success: true; data: { store: StoreProfile } }> {
    const authUser = (req as unknown as { authUser: AuthUser }).authUser
    const store = await this.tenantService.updateStore(authUser, storeId, dto)

    return {
      success: true,
      data: { store },
    }
  }
}
