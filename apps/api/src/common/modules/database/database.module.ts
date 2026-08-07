import { Global, Module } from '@nestjs/common'
import { DatabaseService } from './database.service.js'

/**
 * Database NestJS module.
 *
 * Provides the Drizzle ORM connection via dependency injection.
 * Wraps the existing @loom/database package.
 *
 * @example
 * ```ts
 * // In a service:
 * constructor(private readonly db: DatabaseService) {}
 *
 * const users = await this.db.select().from(usersTable)
 * ```
 */

@Global()
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
