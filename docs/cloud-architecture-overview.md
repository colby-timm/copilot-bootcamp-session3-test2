# Cloud Architecture Overview

This document provides a high-level system context view of the application contained in this monorepo. The stack includes:

- React Frontend (SPA) served to end users
- Express.js Backend API (Node.js)
- In-Memory Data Store (ephemeral — suitable for local/dev; replace with persistent store for prod)

The diagram below illustrates the primary actors, system boundary, and internal components at a conceptual (Context) level.

## System Context Diagram

```mermaid
%% Simple System Context (inspired by C4 Model Level 1)
flowchart LR
  user([End User<br/>Web Browser]):::actor

    subgraph system["Copilot Bootcamp App (Monorepo)"]
    fe["React Frontend<br/>(SPA)"]:::fe
    api["Express API<br/>(Node.js)"]:::api
    store[("In-Memory Store<br/>(Volatile Data)")]:::store
    end

  user -->|HTTPS GET+POST| fe
    fe -->|XHR / Fetch JSON| api
    api -->|Read/Write| store

    classDef actor fill:#f5f5f5,stroke:#555,color:#111,font-weight:bold
    classDef fe fill:#4f86f7,stroke:#1b57c4,color:#fff
    classDef api fill:#6c3bb8,stroke:#47207d,color:#fff
    classDef store fill:#ffb347,stroke:#cc7a00,color:#222
```

## Interaction Summary
1. End user loads the React SPA over HTTPS.
2. The SPA issues API requests (JSON) to the Express backend.
3. The backend performs synchronous, in-memory reads/writes (non-durable).

## Non-Functional Notes
- Current data layer is ephemeral: restarting the backend clears state.
- For production readiness, consider replacing the in-memory store with:
  - Redis (cache/session)
  - PostgreSQL / MongoDB (persistent domain data)
- Add an API gateway / edge CDN (e.g., CloudFront, Fastly) for scaling and caching static assets.
- Introduce authentication (e.g., JWT, OAuth) if user-specific data emerges.

## Next-Step Suggestions (Beyond Scope of Current Diagram)
- Containerization (Docker) and orchestration (Kubernetes) for horizontal scaling.
- Observability stack: structured logging, metrics, tracing.
- CI/CD pipeline integrating tests, linting, vulnerability scanning.

## Sequence: Creating a TODO

The following sequence shows the interactions when a user creates a new TODO item via the UI.

```mermaid
sequenceDiagram
  autonumber
  actor User as User (Browser)
  participant FE as React SPA
  participant API as Express API
  participant MEM as In-Memory Store

  User->>FE: Click "Add TODO" & submit form
  FE->>FE: Validate input (title, (optional) priority)
  FE->>API: POST /api/todos { title, priority }
  API->>API: Generate ID & timestamp
  API->>MEM: store.create({ id, title, priority, createdAt })
  MEM-->>API: ACK (stored)
    API-->>FE: 201 Created { id, title, priority, createdAt }
    Note over MEM,API: Ephemeral (lost on restart)
    FE->>FE: Update local state & re-render list
    FE-->>User: New TODO visible in list
```

### Notes on the Flow
- Validation kept lightweight client-side; backend should still enforce required fields.
- ID strategy is implicit (e.g., UUID or incremental counter) — define explicitly for consistency.
- Consider optimistic UI update (render before server response) once error handling is robust.
- For persistence, replace MEM with a database; step transitions remain similar.

---
_Last updated: 2025-09-28 (sequence diagram added)_
