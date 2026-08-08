import { index, jsonb, pgEnum, pgTable, text } from 'drizzle-orm/pg-core'
import { createBaseColumns } from '../base.js'

/**
 * Audit log action enum — coarse-grained categories.
 *
 * Specific actions are stored in the `action` text column to allow ad-hoc
 * events without a schema change. This enum captures only the canonical
 * categories used by the platform.
 */
export const auditActionEnum = pgEnum('audit_action', [
  'CREATE',
  'UPDATE',
  'DELETE',
  'ARCHIVE',
  'LOGIN',
  'LOGOUT',
  'AUTH_LOGIN_FAILED',
  'AUTH_PASSWORD_RESET_REQUESTED',
  'AUTH_PASSWORD_CHANGED',
  'AUTH_EMAIL_VERIFIED',
  'TENANT_RESOLVED',
  'TENANT_DENIED',
  'PERMISSION_GRANTED',
  'PERMISSION_DENIED',
  'ADMIN_ACTION',
])

/**
 * Audit log severity.
 */
export const auditSeverityEnum = pgEnum('audit_severity', ['INFO', 'WARN', 'CRITICAL'])

/**
 * Audit log cross-domain primitive.
 *
 * Platform Domain — append-only audit trail for security-sensitive operations.
 *
 * V1 uses single-table layout. The table is **append-only**: there is no
 * service-level UPDATE or DELETE in V1. Server-side triggers / revoke of
 * UPDATE/DELETE privileges are a future ops concern.
 *
 * Stores: who acted (user_id nullable for system events), on what (target
 * domain + id, polymorphic-by-convention), when, what the resulting action
 * was, optional machine-readable payload, optional human-readable reason,
 * correlation_id for tracing.
 *
 * NOT a domain-event log (those go through BullMQ); audit_logs is for
 * security-relevant records that must persist beyond the event horizon.
 *
 * @see docs/database/Database-Philosophy.md §16 (Audit Strategy)
 * @see docs/database/Event-Catalog.md
 */
export const auditLog = pgTable(
  'audit_logs',
  {
    ...createBaseColumns(),
    actorUserId: text('actor_user_id'),
    actorRole: text('actor_role'),
    action: auditActionEnum('action').notNull(),
    severity: auditSeverityEnum('severity').notNull().default('INFO'),
    targetDomain: text('target_domain'),
    targetId: text('target_id'),
    correlationId: text('correlation_id'),
    payload: jsonb('payload').$type<Record<string, unknown>>().default({}),
    reason: text('reason'),
  },
  (table) => [
    index('audit_logs_actor_user_id_idx').on(table.actorUserId),
    index('audit_logs_target_idx').on(table.targetDomain, table.targetId),
    index('audit_logs_action_idx').on(table.action),
    index('audit_logs_correlation_id_idx').on(table.correlationId),
    index('audit_logs_created_at_idx').on(table.createdAt),
  ],
)

export type AuditLog = typeof auditLog.$inferSelect
export type NewAuditLog = typeof auditLog.$inferInsert
