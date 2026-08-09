#!/usr/bin/env node
/**
 * PostgreSQL backup / restore helper.
 *
 * Usage:
 *   node scripts/db-backup.mjs backup            # dump to scripts/backups/<timestamp>.sql
 *   node scripts/db-backup.mjs restore <file>    # restore from a backup file
 *   node scripts/db-backup.mjs list              # list existing backups
 *
 * Uses DATABASE_URL from the environment (falls back to the default local URL
 * used by docker-compose). Prefers the `loom-postgres` container via
 * `docker exec` when running; otherwise falls back to host `pg_dump`/`psql`.
 *
 * Note: this is a plain SQL dump (pg_dump default format), matching the simple
 * restore workflow used during local development. Production backup strategy
 * is documented separately (see docs/architecture/Data-Backup.md, Phase 20).
 */

import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const BACKUP_DIR = path.resolve(import.meta.dirname, 'backups')
const DEFAULT_DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/project_loom'
const CONTAINER_NAME = 'loom-postgres'

function getDatabaseUrl() {
  return process.env.DATABASE_URL ?? DEFAULT_DATABASE_URL
}

/** Parse postgres://user:pass@host:port/dbname */
function parseUrl(url) {
  const match = url.match(/^postgres(?:ql)?:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)$/)
  if (!match) throw new Error(`Cannot parse DATABASE_URL: ${url}`)
  const [, user, pass, host, port, db] = match
  return { user, pass, host, port, db }
}

/** True if the loom-postgres container is running. */
function containerRunning() {
  try {
    const names = execFileSync('docker', ['ps', '--format', '{{.Names}}'], { stdio: 'pipe' })
      .toString()
      .split('\n')
      .map((s) => s.trim())
    return names.includes(CONTAINER_NAME)
  } catch {
    return false
  }
}

/** True if pg_dump is available on the host PATH. */
function hostToolsAvailable() {
  try {
    execFileSync('pg_dump', ['--version'], { stdio: 'pipe' })
    return true
  } catch {
    return false
  }
}

/** Pick the toolchain: container `docker exec` preferred, host tools fallback. */
function toolchain() {
  if (containerRunning()) return 'docker'
  if (hostToolsAvailable()) return 'host'
  throw new Error(
    `Neither a running ${CONTAINER_NAME} container nor host pg_dump/psql was found. Start Postgres via 'docker compose -f docker/docker-compose.yml up -d' or install PostgreSQL tools.`,
  )
}

function dumpArgs(tool, db) {
  if (tool === 'docker') {
    // Connection info comes from the container's own env (POSTGRES_USER/POSTGRES_DB).
    return ['exec', CONTAINER_NAME, 'pg_dump', '-U', 'postgres', '-d', db]
  }
  // Password is carried inside the connection string, so it never shows in process args.
  return ['-d', getDatabaseUrl()]
}

function psqlArgs(tool, db) {
  if (tool === 'docker') {
    return ['exec', '-i', CONTAINER_NAME, 'psql', '-U', 'postgres', '-d', db]
  }
  return ['-d', getDatabaseUrl()]
}

function backup() {
  const tool = toolchain()
  const { db } = parseUrl(getDatabaseUrl())
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const file = path.join(BACKUP_DIR, `${db}_${stamp}.sql`)
  mkdirSync(BACKUP_DIR, { recursive: true })

  const bin = tool === 'docker' ? 'docker' : 'pg_dump'
  execFileSync(bin, dumpArgs(tool, db), { stdio: 'inherit' })

  console.log(`Backup written to ${file} (database ${db}, toolchain: ${tool})`)
  return file
}

function restore(fileArg) {
  if (!fileArg) throw new Error('Usage: node scripts/db-backup.mjs restore <backup-file>')

  const file = path.resolve(fileArg)
  if (!existsSync(file)) throw new Error(`Backup file not found: ${file}`)

  const tool = toolchain()
  const { db } = parseUrl(getDatabaseUrl())
  const bin = tool === 'docker' ? 'docker' : 'psql'
  const input = readFileSync(file)

  execFileSync(bin, psqlArgs(tool, db), { input })
  console.log(`Restored ${file} into database ${db}`)
}

function list() {
  if (!existsSync(BACKUP_DIR)) {
    console.log('No backups yet. Run: node scripts/db-backup.mjs backup')
    return
  }
  const files = readdirSync(BACKUP_DIR).filter((f) => f.endsWith('.sql'))
  if (files.length === 0) {
    console.log(`No *.sql backups in ${BACKUP_DIR}`)
    return
  }
  for (const file of files.sort().reverse()) {
    console.log(file)
  }
}

const [cmd, arg] = process.argv.slice(2)
switch (cmd) {
  case 'backup':
    backup()
    break
  case 'restore':
    restore(arg)
    break
  case 'list':
    list()
    break
  default:
    console.log('Usage: node scripts/db-backup.mjs {backup|restore <file>|list}')
    process.exit(1)
}
