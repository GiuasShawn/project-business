# DOC-001: Normalize Domain Naming Before Phase 2

**Status:** Open
**Priority:** High
**Created:** 2026-08-07
**Phase Target:** Phase 2 (Infrastructure)

---

## Description

Domain naming and scope are inconsistent across documentation sources. This must be resolved before domain modules are implemented in Phase 2+.

---

## Inconsistencies Identified

### 1. Missing from AUDIT_REPORT.md

| Domain | PRD | Architecture Overview | AUDIT_REPORT |
|--------|-----|----------------------|--------------|
| Coupons | ✅ Section 7 | ✅ Section 18 | ❌ Not listed |
| Settings | ✅ Section 7 | ✅ Section 24 | ❌ Not listed |
| File Management | ❌ Not listed | ✅ Section 23 | ❌ Not listed |
| Checkout | ✅ Section 7 | ✅ Section 12 | ❌ Not listed |
| Catalog | ✅ Section 7 | ✅ Section 8 | ❌ Not listed |
| Returns | ✅ Section 7 | ✅ Section 16 | ❌ Not listed |

### 2. Missing from Architecture Overview

| Domain | PRD | Architecture Overview | AUDIT_REPORT |
|--------|-----|----------------------|--------------|
| Wishlist | ✅ Section 7 | ❌ Not listed | ✅ Section 16 |

### 3. Missing from PRD

| Domain | PRD | Architecture Overview | AUDIT_REPORT |
|--------|-----|----------------------|--------------|
| Shipping | ❌ Not listed | ✅ Section 15 | ✅ Section 10 |

### 4. Naming Differences

| PRD Name | Architecture Overview Name | AUDIT_REPORT Name |
|----------|---------------------------|-------------------|
| Seller | Seller Management | User (covers Seller) |
| Variant | Part of Products | Variant (separate) |

---

## Source of Truth Hierarchy

The implementation hierarchy must be:

```
PRD
↓
Domain Model
↓
System Blueprint
↓
Architecture Overview
↓
Implementation
```

**Note:** `AUDIT_REPORT.md` only verifies these documents — it is NOT the implementation source of truth.

---

## Resolution Approach

1. **Do NOT modify existing documentation** until Phase 2.
2. During Phase 2 (Infrastructure), normalize domain naming across all documents.
3. Decide whether missing domains (Coupons, Settings, Checkout, etc.) are:
   - Separate bounded domains, OR
   - Sub-modules within existing domains
4. Update the source of truth documents (PRD, Domain Model, System Blueprint, Architecture Overview).
5. Update AUDIT_REPORT.md to reflect the normalized domains.

---

## Acceptance Criteria

- [ ] All domain names consistent across PRD, Domain Model, System Blueprint, Architecture Overview
- [ ] All 19+ domains explicitly listed in Architecture Overview
- [ ] AUDIT_REPORT.md updated to match
- [ ] No naming differences remain

---

*This issue must be resolved before Phase 2 implementation begins.*
