import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

/**
 * User table — Better Auth compatible.
 *
 * Follows Better Auth's expected user schema while using
 * Project Loom's UUID primary key convention.
 *
 * Better Auth manages password hashing internally via Scrypt.
 */

export const user = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export type User = typeof user.$inferSelect
export type NewUser = typeof user.$inferInsert
