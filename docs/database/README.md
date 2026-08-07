# Database Documentation

**Purpose:** Defines the database philosophy, schema design, state machines, event catalog, and permission matrix for Project Loom.

**Owner:** Database & Backend Teams

**Relationships:**
- Implements the data layer defined in [product/Product-Data-Model.md](../product/Product-Data-Model.md)
- Follows standards from [architecture/Engineering-Standards.md](../architecture/Engineering-Standards.md)
- Events integrate with [api/](../api/) and [backend/](../backend/) implementations

---

## Documents

| Document | Description |
|----------|-------------|
| [Database-Philosophy.md](./Database-Philosophy.md) | Database philosophy, modeling standards, and PostgreSQL conventions |
| [Database-Package.md](./Database-Package.md) | Complete PostgreSQL database architecture — rules, naming, and schema |
| [State-Machines.md](./State-Machines.md) | State machine definitions for sellers, orders, payments, returns, and more |
| [Event-Catalog.md](./Event-Catalog.md) | Domain events used for inter-domain communication |
| [Permission-Matrix.md](./Permission-Matrix.md) | RBAC permission definitions and authorization rules |
