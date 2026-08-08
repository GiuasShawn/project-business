export { auth, type AuthConfig } from './auth.js'
export { authInstance, type AuthInstance } from './auth-config.js'
export { createRBAC, type RBACConfig } from './rbac.js'

// Roles
export { Role, ROLE_HIERARCHY, hasRoleHierarchy } from './roles.js'

// Permissions
export { Permission, ALL_PERMISSIONS } from './permissions.js'

// Permission Matrix
export {
  DEFAULT_PERMISSION_MATRIX,
  getPermissionsForRole,
  roleHasPermission,
} from './permission-matrix.js'
export type { PermissionMatrix } from './permission-matrix.js'
