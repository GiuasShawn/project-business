import { z } from 'zod'

const envSchema = z.object({
  // Application
  NODE_ENV: z.enum(['development', 'staging', 'production', 'test']).default('development'),
  APP_NAME: z.string().default('project-loom'),
  APP_URL: z.string().url().default('http://localhost:3000'),
  API_URL: z.string().url().default('http://localhost:4000'),
  FRONTEND_URL: z.string().url().default('http://localhost:3000'),
  PORT: z.coerce.number().default(4000),

  // Database
  DATABASE_URL: z.string().url(),
  DATABASE_POOL_SIZE: z.coerce.number().default(10),
  DATABASE_SSL: z
    .preprocess((v) => {
      if (v === 'false' || v === '0' || v === '' || v === false || v === 0) return false
      if (v === 'true' || v === '1' || v === true || v === 1) return true
      return false
    }, z.boolean())
    .default(false),
  DATABASE_LOGGING: z.coerce.boolean().default(true),

  // Redis
  REDIS_URL: z.string().default('redis://localhost:6379'),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().optional(),

  // Authentication
  BETTER_AUTH_SECRET: z.string().min(32),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('15m'),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),
  COOKIE_DOMAIN: z.string().default('localhost'),

  // Storage (Cloudflare R2)
  R2_ACCOUNT_ID: z.string().optional(),
  R2_BUCKET: z.string().optional(),
  R2_ACCESS_KEY: z.string().optional(),
  R2_SECRET_KEY: z.string().optional(),
  R2_PUBLIC_URL: z.string().url().optional(),

  // Search (Meilisearch)
  MEILISEARCH_URL: z.string().url().default('http://localhost:7700'),
  MEILISEARCH_MASTER_KEY: z.string().optional(),

  // Payments - Razorpay
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional(),

  // Payments - Cashfree
  CASHFREE_APP_ID: z.string().optional(),
  CASHFREE_SECRET_KEY: z.string().optional(),
  CASHFREE_WEBHOOK_SECRET: z.string().optional(),

  // Email
  SMTP_HOST: z.string().default('localhost'),
  SMTP_PORT: z.coerce.number().default(1025),
  SMTP_USERNAME: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  EMAIL_FROM: z.string().email().default('noreply@projectloom.dev'),

  // SMS
  SMS_PROVIDER: z.string().optional(),
  SMS_API_KEY: z.string().optional(),
  SMS_SENDER_ID: z.string().optional(),

  // Analytics
  POSTHOG_KEY: z.string().optional(),
  POSTHOG_HOST: z.string().url().default('https://app.posthog.com'),

  // Monitoring
  SENTRY_DSN: z.string().url().optional(),
  OTEL_EXPORTER_ENDPOINT: z.string().url().optional(),
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),

  // Feature Flags
  ENABLE_SIGNUPS: z.coerce.boolean().default(true),
  ENABLE_PAYOUTS: z.coerce.boolean().default(false),
  ENABLE_RETURNS: z.coerce.boolean().default(true),
  ENABLE_ANALYTICS: z.coerce.boolean().default(true),
  ENABLE_SEARCH: z.coerce.boolean().default(true),

  // Build Information
  APP_VERSION: z.string().default('0.1.0'),
  GIT_COMMIT_SHA: z.string().optional(),
  BUILD_DATE: z.string().optional(),
})

export type Env = z.infer<typeof envSchema>

function validateEnv(): Env {
  const parsed = envSchema.safeParse(process.env)

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:')
    console.error(parsed.error.flatten().fieldErrors)
    throw new Error('Invalid environment variables')
  }

  return parsed.data
}

export const env = validateEnv()
