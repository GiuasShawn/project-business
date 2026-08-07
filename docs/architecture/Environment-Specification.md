# ENV-001 — Environment Variables & Configuration Specification

**Project:** Project Loom

**Version:** 1.0.0

**Status:** Living Specification

---

# 1. Purpose

This document defines every environment variable, configuration source, secret, and runtime configuration used throughout Project Loom.

Configuration must be centralized, validated at startup, and never hardcoded.

---

# 2. Configuration Principles

Configuration shall be:

- Environment-specific
- Type-safe
- Validated during startup
- Immutable during runtime
- Secret-aware
- Documented

---

# 3. Configuration Sources

Priority (highest first):

```text
CLI Arguments

↓

Environment Variables

↓

.env Files

↓

Application Defaults
```

---

# 4. Environment Types

Supported environments:

```text
local

development

staging

production
```

Every environment uses the same configuration schema.

---

# 5. Application Variables

```text
NODE_ENV

APP_NAME

APP_URL

API_URL

FRONTEND_URL

PORT
```

---

# 6. Database

```text
DATABASE_URL

DATABASE_POOL_SIZE

DATABASE_SSL

DATABASE_LOGGING
```

---

# 7. Redis

```text
REDIS_URL

REDIS_HOST

REDIS_PORT

REDIS_PASSWORD
```

---

# 8. Authentication

```text
BETTER_AUTH_SECRET

JWT_SECRET

JWT_EXPIRES_IN

REFRESH_TOKEN_EXPIRES_IN

COOKIE_DOMAIN
```

---

# 9. Storage

```text
R2_ACCOUNT_ID

R2_BUCKET

R2_ACCESS_KEY

R2_SECRET_KEY

R2_PUBLIC_URL
```

---

# 10. Search

```text
MEILISEARCH_URL

MEILISEARCH_MASTER_KEY
```

---

# 11. Payments

### Razorpay

```text
RAZORPAY_KEY_ID

RAZORPAY_KEY_SECRET

RAZORPAY_WEBHOOK_SECRET
```

### Cashfree

```text
CASHFREE_APP_ID

CASHFREE_SECRET_KEY

CASHFREE_WEBHOOK_SECRET
```

### Stripe (Future)

```text
STRIPE_SECRET_KEY

STRIPE_WEBHOOK_SECRET
```

---

# 12. Email

```text
SMTP_HOST

SMTP_PORT

SMTP_USERNAME

SMTP_PASSWORD

EMAIL_FROM
```

---

# 13. SMS Provider

```text
SMS_PROVIDER

SMS_API_KEY

SMS_SENDER_ID
```

---

# 14. Analytics

```text
POSTHOG_KEY

POSTHOG_HOST
```

---

# 15. Monitoring

```text
SENTRY_DSN

OTEL_EXPORTER_ENDPOINT

LOG_LEVEL
```

---

# 16. Feature Flags

```text
ENABLE_SIGNUPS

ENABLE_PAYOUTS

ENABLE_RETURNS

ENABLE_ANALYTICS

ENABLE_SEARCH
```

---

# 17. Build Information

```text
APP_VERSION

GIT_COMMIT_SHA

BUILD_DATE
```

These values should be injected automatically during CI/CD.

---

# 18. Validation

Every variable shall include:

- Type
- Required/Optional
- Default value
- Validation rule
- Description

The application must fail to start if required configuration is missing or invalid.

---

# 19. Secrets Policy

Secrets:

- Never committed to Git
- Never logged
- Never exposed to the frontend
- Rotated periodically
- Stored in a secrets manager in production

---

# 20. Frontend Exposure

Only variables prefixed for client use (for example, `NEXT_PUBLIC_*`) may be bundled into frontend code.

All other variables remain server-side only.

---

# 21. Configuration Package

Configuration is exposed through:

```text
packages/config
```

Responsibilities:

- Load configuration
- Validate configuration
- Export typed configuration
- Prevent direct `process.env` usage elsewhere

---

# 22. Acceptance Criteria

The configuration system is complete when:

- All applications use the shared configuration package.
- Configuration is validated before startup.
- Secrets are isolated from client code.
- Every variable is documented.
- Production secrets are managed outside the repository.

---

# Revision History

| Version | Date | Summary |
|---------|------|---------|
| 1.0.0 | Initial Draft | Established configuration and environment standards. |