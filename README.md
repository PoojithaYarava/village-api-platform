# Village API Platform

Production-oriented SaaS starter for village-level India geography APIs. The project includes an Express REST API, a React/Vite dashboard, Prisma data models, and a cleaned census-era village dataset prepared for future PostgreSQL import.

## What is included

- Versioned REST API under `/api/v1`
- React dashboard for admin, client, documentation, usage, and API explorer flows
- Prisma schema for geography hierarchy, tenants, API keys, access control, and usage logs
- Dataset cleaning script for the raw MDDS-style village spreadsheets
- Cleaned CSV outputs for states, districts, sub-districts, villages, and quality reports

## Repository layout

```text
api/                  Express API application
frontend/             React + Vite dashboard
prisma/               Prisma schema for production database tables
scripts/              Dataset cleaning and future import tooling
data/raw/dataset/     Source village spreadsheets
data/processed/       Cleaned CSV outputs
docs/                 Architecture and data-cleaning notes
```

## Prerequisites

- Node.js 20 or newer
- npm
- Python 3 for dataset cleaning
- Git LFS for `data/processed/villages_clean.csv`
- PostgreSQL and Redis for the planned production-backed services

Install Git LFS before cloning or pulling the dataset files:

```bash
git lfs install
```

## Environment setup

Copy the example environment file and update values as needed:

```bash
cp .env.example .env
```

Important variables:

- `API_PORT`: API server port, default `3000`
- `VITE_API_BASE_URL`: frontend API base URL, default `http://localhost:3000/api/v1`
- `DATABASE_URL`: PostgreSQL connection string for Prisma-backed work
- `REDIS_URL`: Redis connection string for future rate limiting and analytics
- `JWT_SECRET`: secret used by future auth flows

## Quick start

Install dependencies from the repository root:

```bash
npm install
```

Run API and frontend together:

```bash
npm run dev
```

Local services:

- API: `http://localhost:3000`
- API v1 root: `http://localhost:3000/api/v1`
- Frontend: `http://localhost:5173`

Build the frontend:

```bash
npm run build
```

Start the API only:

```bash
npm run start
```

## API endpoints

Current geography routes are backed by mock-ready service data while the Prisma repository layer is being connected.

```text
GET /api/v1
GET /api/v1/snapshot
GET /api/v1/states
GET /api/v1/states/:id/districts
GET /api/v1/districts/:id/subdistricts
GET /api/v1/subdistricts/:id/villages?page=1&limit=20
GET /api/v1/search?q=village&state=&district=&subDistrict=&limit=10
GET /api/v1/autocomplete?q=term&hierarchyLevel=village
```

Responses use a consistent wrapper from `api/src/utils/respond.js`.

## Dataset cleaning

The raw village spreadsheets live in `data/raw/dataset`. Run the cleaner from the repository root:

```bash
python scripts/clean_mdds_dataset.py
```

Generated outputs:

- `data/processed/states_clean.csv`
- `data/processed/districts_clean.csv`
- `data/processed/subdistricts_clean.csv`
- `data/processed/villages_clean.csv`
- `data/processed/reports/quality_report.json`
- `data/processed/reports/village_code_conflicts.csv`

Cleaning behavior:

- Normalizes whitespace in hierarchy and village names
- Excludes placeholder hierarchy rows where `MDDS PLCN = 000000`
- Repairs one broken Assam row from local context and logs it in the quality report
- Preserves duplicate village-code rows and reports conflicts separately

See `docs/data-cleaning.md` for counts and implementation notes.

## Documentation

- `docs/architecture.md`: current application shape and next implementation steps
- `docs/data-cleaning.md`: source data, cleaning rules, output counts, and project impact

## Current status

This repository is ready for product demo and API contract validation. The next backend milestone is replacing the mock geography repository with Prisma-backed queries over the cleaned dataset.

## Next milestones

1. Import the cleaned CSV outputs into PostgreSQL through Prisma.
2. Replace mock geography services with Prisma repositories.
3. Add JWT auth, tenant onboarding, and API key issuance flows.
4. Wire Redis-backed rate limiting and usage analytics.
5. Add automated API and frontend tests.
