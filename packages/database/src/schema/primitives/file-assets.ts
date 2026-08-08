import { sql } from 'drizzle-orm'
import { bigint, check, index, integer, pgEnum, pgTable, text } from 'drizzle-orm/pg-core'
import { createBaseColumns } from '../base.js'

/**
 * File asset lifecycle enum.
 */
export const fileAssetStatusEnum = pgEnum('file_asset_status', [
  'PENDING_UPLOAD',
  'UPLOADED',
  'PROCESSING',
  'READY',
  'FAILED',
  'ARCHIVED',
])

/**
 * File assets cross-domain primitive.
 *
 * Platform Domain — references every binary asset stored in Cloudflare R2.
 * The actual bytes live in R2; this table holds metadata only (file location,
 * mime type, dimensions, ownership).
 *
 * Multiple domains reference file assets:
 *  - Stores: logos, banners
 *  - Products: images (Phase 9)
 *  - Customers: profile pictures (Phase 4)
 *  - Reviews: uploaded images (Phase later)
 *  - Notifications: attachments
 *
 * Each domain's owner column is implemented via `owner_domain` codes (string)
 * with `owner_id` (UUID). Polymorphic-by-convention rather than polymorphic FK.
 *
 * @see docs/adr/ADR-009-Cloudflare-R2.md
 * @see docs/database/Database-Philosophy.md §26 (Security — files in R2)
 */
export const fileAsset = pgTable(
  'file_assets',
  {
    ...createBaseColumns(),
    bucket: text('bucket').notNull(),
    objectKey: text('object_key').notNull().unique(),
    mimeType: text('mime_type').notNull(),
    sizeBytes: bigint('size_bytes', { mode: 'number' }).notNull(),
    widthPx: integer('width_px'),
    heightPx: integer('height_px'),
    ownerDomain: text('owner_domain').notNull(),
    ownerId: text('owner_id'),
    status: fileAssetStatusEnum('status').notNull().default('PENDING_UPLOAD'),
    checksumSha256: text('checksum_sha256'),
  },
  (table) => [
    index('file_assets_owner_idx').on(table.ownerDomain, table.ownerId),
    index('file_assets_status_idx').on(table.status),
    index('file_assets_mime_type_idx').on(table.mimeType),
    check('file_assets_size_bytes_non_negative_chk', sql`${table.sizeBytes} >= 0`),
  ],
)

export type FileAsset = typeof fileAsset.$inferSelect
export type NewFileAsset = typeof fileAsset.$inferInsert
