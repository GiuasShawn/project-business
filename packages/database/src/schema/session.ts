import { index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { user } from './user.js'

export const session = pgTable(
  'sessions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    token: text('token').notNull().unique(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: uuid('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    // DB-008 "Every FK — Indexed". PostgreSQL does NOT auto-create an index on
    // FK columns; we declare the index explicitly so per-user session lookups
    // are O(log n) instead of O(n).
    index('sessions_user_id_idx').on(table.userId),
    // expires_at is touched by Better Auth's GC; an index here supports
    // efficient cleanup queries in the workers app.
    index('sessions_expires_at_idx').on(table.expiresAt),
  ],
)

export type Session = typeof session.$inferSelect
export type NewSession = typeof session.$inferInsert
