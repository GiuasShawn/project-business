# @loom/events

Domain event definitions for Project Loom.

## Purpose

Shared event types used by API and Workers.

## Usage

```typescript
import { EventType, DomainEvent } from '@loom/events'
```

## Rules

- Events are immutable
- Events use past tense (e.g., OrderPlaced)
- Events are facts, not commands
