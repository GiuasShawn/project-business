/**
 * Centralized permission definitions for Project Loom.
 *
 * Permissions follow the format: "resource:action"
 * Examples: "products:read", "orders:write", "users:manage"
 *
 * Permissions are defined once and mapped to roles in the permission matrix.
 * Do not scatter permission strings throughout controllers.
 */

export const Permission = {
  // User permissions
  USERS_READ: 'users:read',
  USERS_WRITE: 'users:write',
  USERS_MANAGE: 'users:manage',

  // Profile permissions
  PROFILE_READ: 'profile:read',
  PROFILE_WRITE: 'profile:write',

  // Product permissions
  PRODUCTS_READ: 'products:read',
  PRODUCTS_WRITE: 'products:write',
  PRODUCTS_MANAGE: 'products:manage',

  // Order permissions
  ORDERS_READ: 'orders:read',
  ORDERS_WRITE: 'orders:write',
  ORDERS_MANAGE: 'orders:manage',

  // Store permissions
  STORES_READ: 'stores:read',
  STORES_WRITE: 'stores:write',
  STORES_MANAGE: 'stores:manage',

  // Inventory permissions
  INVENTORY_READ: 'inventory:read',
  INVENTORY_WRITE: 'inventory:write',
  INVENTORY_MANAGE: 'inventory:manage',

  // Analytics permissions
  ANALYTICS_READ: 'analytics:read',
  ANALYTICS_MANAGE: 'analytics:manage',

  // Payment permissions
  PAYMENTS_READ: 'payments:read',
  PAYMENTS_WRITE: 'payments:write',
  PAYMENTS_MANAGE: 'payments:manage',

  // Settings permissions
  SETTINGS_READ: 'settings:read',
  SETTINGS_WRITE: 'settings:write',
  SETTINGS_MANAGE: 'settings:manage',

  // System permissions
  SYSTEM_MANAGE: 'system:manage',
} as const

export type Permission = (typeof Permission)[keyof typeof Permission]

/**
 * All permissions as an array for validation purposes.
 */
export const ALL_PERMISSIONS: Permission[] = Object.values(Permission)
