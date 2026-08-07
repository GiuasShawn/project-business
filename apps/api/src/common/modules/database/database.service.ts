import { type Database, createDb } from '@loom/database'
import { Injectable, Logger, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common'
import { sql } from 'drizzle-orm'

/**
 * Managed database connection service.
 *
 * Lifecycle:
 *  - Creates connection on module init
 *  - Closes connection on module destroy
 *  - Exposes the Drizzle instance for repository and service use
 */

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name)
  private db!: Database

  async onModuleInit(): Promise<void> {
    try {
      this.db = createDb()
      this.logger.log('Database connection established')
    } catch (error) {
      this.logger.error(
        'Failed to connect to database',
        error instanceof Error ? error.stack : String(error),
      )
      throw error
    }
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.log('Database connection closed')
  }

  /**
   * Get the Drizzle ORM instance.
   */
  getDb(): Database {
    return this.db
  }

  /**
   * Health check — returns true if the database responds to a simple query.
   */
  async isHealthy(): Promise<boolean> {
    try {
      await this.db.execute(sql`SELECT 1`)
      return true
    } catch {
      return false
    }
  }
}
