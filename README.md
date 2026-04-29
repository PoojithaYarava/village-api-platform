# Village API Platform

Production-grade SaaS platform for village-level India geography APIs, built for B2B integrations, admin operations, and client self-service.

## Workspaces

- `api`: Express REST API with mock-ready geography services and Prisma integration points
- `frontend`: React + Vite dashboard with admin, client, and API explorer experiences
- `prisma`: data model for geography, tenants, keys, access control, and usage logs
- `scripts`: reserved for future data import and seed tooling

## Quick start

```bash
npm install
npm run dev
```

API: `http://localhost:3000`

Frontend: `http://localhost:5173`

## Dataset cleaning

The uploaded census-era village dataset has been extracted and cleaned into repo-local CSV outputs.

Run the cleaner:

```bash
python scripts/clean_mdds_dataset.py
```

Outputs:

- `data/processed/states_clean.csv`
- `data/processed/districts_clean.csv`
- `data/processed/subdistricts_clean.csv`
- `data/processed/villages_clean.csv`
- `data/processed/reports/quality_report.json`
- `data/processed/reports/village_code_conflicts.csv`

Notes:

- source hierarchy rows with `MDDS PLCN = 000000` are excluded from the village master
- one broken Assam row is repaired from local context and logged in the quality report
- duplicate village codes are preserved and surfaced in a dedicated conflict report

## Next milestones

1. Add the MDDS Excel import pipeline and connect it to Neon/PostgreSQL.
2. Replace the mock geography repository with Prisma-backed queries.
3. Wire Redis-backed rate limiting and usage analytics.
