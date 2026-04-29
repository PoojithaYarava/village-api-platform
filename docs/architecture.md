# Architecture Notes

## Current shape

- `api` exposes a versioned REST surface under `/api/v1`
- mock geography data powers the initial product demo and UI integration
- `prisma/schema.prisma` models the production PostgreSQL structure for nationwide data
- `frontend` presents four product lanes:
  - overview
  - admin operations
  - B2B client workspace
  - live API explorer

## Why this approach

This starter optimizes for fast product validation without painting the codebase into a corner. The UI can be demoed now, the API contract is already stable enough for frontend integration, and the database model is shaped for the MDDS import pipeline and future scaling work.

## Next implementation steps

1. Add `scripts/import-mdds.*` to ingest the official Excel source.
2. Introduce Prisma repositories and swap out `mockGeography`.
3. Add Redis-backed distributed rate limiting and usage counters.
4. Add JWT auth, user registration, and API key issuance flows.
