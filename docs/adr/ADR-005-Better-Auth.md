# ADR-005 — Adopt Better Auth as the Authentication & Session Management System

**Status:** Accepted

**Date:** 2026-08-07

**Decision ID:** ADR-005

**Owners:** Engineering

---

# Context

Project Loom requires an authentication system that supports:

- Customers
- Sellers
- Administrators
- Super Administrators
- Secure session management
- OAuth providers
- Email/password authentication
- Role-based authorization
- Future enterprise authentication
- Multi-device sessions

The authentication system must integrate cleanly with the Next.js frontend and NestJS backend while remaining extensible.

Candidate solutions evaluated:

- Better Auth
- Auth.js (NextAuth)
- Clerk
- Auth0
- Supabase Auth
- Firebase Authentication
- Custom Authentication

---

# Decision

Project Loom will adopt **Better Auth** as the authentication framework.

Better Auth will be responsible for:

- User authentication
- Session management
- OAuth providers
- Password authentication
- Email verification
- Password reset
- Refresh token lifecycle

Authorization (RBAC and business permissions) remains the responsibility of the application.

---

# Responsibilities

Better Auth owns:

- Login
- Logout
- Sessions
- Password hashing
- Password reset
- OAuth
- Email verification

Application owns:

- Roles
- Permissions
- Seller approval
- Tenant resolution
- Business authorization
- Resource ownership

---

# Why Better Auth?

Advantages:

- TypeScript-first
- Modern architecture
- Self-hosted
- Database ownership remains with us
- No vendor lock-in
- Excellent integration with Next.js
- Flexible session model
- Extensible

---

# Why Not Clerk?

Reasons:

- External dependency
- Vendor lock-in
- Usage-based pricing
- Less control over authentication internals

May be suitable for other projects but not for Project Loom.

---

# Why Not Auth0?

Reasons:

- Operational cost
- External identity dependency
- More features than required
- Less flexibility for custom business workflows

---

# Why Not Custom Authentication?

Reasons:

- Security risk
- Reinventing proven solutions
- Higher maintenance burden
- Longer development time

Authentication is a solved problem and should leverage a mature framework.

---

# Authentication Flow

```text id="authflow"
Register

↓

Email Verification

↓

Login

↓

Session Created

↓

JWT Issued

↓

Authenticated Requests

↓

Refresh

↓

Logout
```

---

# Session Strategy

Primary session transport:

- Secure HTTP-only cookies (web)

Access token:

- Short-lived

Refresh token:

- Rotating
- Revocable
- Stored securely

All sessions are individually revocable.

---

# OAuth Providers

Initial support:

- Google

Future:

- Apple
- GitHub
- Microsoft

OAuth identity links to a single platform user account.

---

# Password Policy

Minimum requirements:

- At least 12 characters
- Mixed character classes recommended
- Passwords hashed using the algorithm provided by Better Auth
- Plaintext passwords are never stored or logged

---

# Email Verification

Required for:

- Seller activation
- Sensitive account changes

Recommended for customers before certain high-risk actions.

---

# Authorization Model

Authentication verifies identity.

Authorization verifies permissions.

Authentication **must never** imply authorization.

Every protected request performs:

```text id="authzflow"
Authentication

↓

Role Check

↓

Permission Check

↓

Tenant Ownership Check

↓

Business Rule Validation
```

---

# Session Revocation

Sessions may be revoked due to:

- User logout
- Password change
- Suspicious activity
- Administrative action

Revocation takes effect immediately.

---

# Security Requirements

Mandatory:

- HTTPS only
- Secure cookies
- CSRF protection where applicable
- Rate limiting
- Brute-force protection
- Email verification
- Session expiration
- Refresh token rotation

---

# Audit Events

Authentication events include:

- UserRegistered
- UserLoggedIn
- UserLoggedOut
- PasswordChanged
- PasswordResetRequested
- EmailVerified
- SessionRevoked

All authentication events are auditable.

---

# Future Expansion

Potential future additions:

- Multi-factor authentication
- Passkeys (WebAuthn)
- Enterprise SSO (OIDC/SAML)
- Device management
- Trusted devices

The architecture should support these without replacing Better Auth.

---

# Consequences

Positive:

- Modern authentication stack
- Strong TypeScript support
- Self-hosted control
- Extensible architecture
- Low vendor dependency

Negative:

- Team must understand Better Auth internals
- Authorization remains application responsibility

---

# Success Criteria

This decision remains valid while:

- Authentication remains secure.
- Session management scales with demand.
- Future authentication methods integrate cleanly.
- Business authorization remains decoupled from authentication.

---

# Related Documents

- ADR-001 — Modular Monolith
- ADR-004 — Multi-Tenant Architecture
- Permission Matrix
- Engineering Standards
- API Standards
- Event Catalog

---

# Revision History

| Version | Date | Summary |
|---------|------|---------|
| 1.0.0 | 2026-08-07 | Adopted Better Auth for authentication and session management. |