# Dataset Cleaning Notes

## Source

- uploaded file: `all-india-villages-master-list-excel.zip`
- extracted under `data/raw/dataset`
- 30 state or union-territory spreadsheets

## Cleaning decisions

1. Normalize whitespace in all name fields.
2. Keep the raw source name and also derive:
   - display name
   - normalized name
3. Exclude hierarchy placeholder rows from the final village master:
   - state rows
   - district rows
   - sub-district rows
4. Repair the one Assam village row with a missing sub-district by forward context.
5. Preserve duplicate village-code rows instead of deleting them.

## Outputs

- `states_clean.csv`: 30 state or UT rows
- `districts_clean.csv`: 586 district rows
- `subdistricts_clean.csv`: 5,764 sub-district rows
- `villages_clean.csv`: 619,500 cleaned village rows
- `reports/village_code_conflicts.csv`: 507 rows across 232 duplicate-code groups
- `reports/quality_report.json`: summary counts and repair log

## Project impact

The Prisma `Village` model now allows duplicate source village codes inside the same sub-district when the raw labels differ. That change matches the uploaded dataset and avoids destructive import-time deduplication.
