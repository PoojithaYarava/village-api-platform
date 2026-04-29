from __future__ import annotations

import json
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
RAW_DIR = ROOT / "data" / "raw" / "dataset"
PROCESSED_DIR = ROOT / "data" / "processed"
REPORTS_DIR = PROCESSED_DIR / "reports"

EXPECTED_COLUMNS = [
    "MDDS STC",
    "STATE NAME",
    "MDDS DTC",
    "DISTRICT NAME",
    "MDDS Sub_DT",
    "SUB-DISTRICT NAME",
    "MDDS PLCN",
    "Area Name",
]


@dataclass(frozen=True)
class CleanResult:
    states: pd.DataFrame
    districts: pd.DataFrame
    subdistricts: pd.DataFrame
    villages: pd.DataFrame
    village_conflicts: pd.DataFrame
    quality_report: dict


def normalize_spaces(value: object) -> str:
    if pd.isna(value):
        return ""
    text = str(value).replace("\xa0", " ")
    text = re.sub(r"\s+", " ", text).strip()
    text = re.sub(r"\s+\*", "", text)
    return text


def display_name(value: str) -> str:
    text = value
    text = re.sub(r"\s*\(OG\)", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\s*\(RURAL\)", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\s*\(Part\)", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\s*\(Ward No\.\s*\d+\)", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\s*\(\d+\)", "", text)
    text = re.sub(r"\s+", " ", text).strip(" -")
    return text


def normalized_name(value: str) -> str:
    text = display_name(value).upper()
    text = re.sub(r"[^A-Z0-9]+", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def zero_pad(series: pd.Series, size: int) -> pd.Series:
    return series.fillna(0).astype(int).astype(str).str.zfill(size)


def choose_sheet(path: Path) -> str:
    workbook = pd.ExcelFile(path)
    return "Village Directory" if "Village Directory" in workbook.sheet_names else workbook.sheet_names[0]


def load_file(path: Path) -> pd.DataFrame:
    sheet_name = choose_sheet(path)
    frame = pd.read_excel(path, sheet_name=sheet_name)

    if list(frame.columns) != EXPECTED_COLUMNS:
      # Madhya Pradesh contains an extra non-data sheet. If the first parse lands on the wrong
      # sheet or unnamed columns appear, re-read the intended Village Directory sheet explicitly.
        frame = pd.read_excel(path, sheet_name="Village Directory")

    frame = frame[EXPECTED_COLUMNS].copy()
    frame["source_file"] = path.name
    return frame


def load_raw_dataset() -> pd.DataFrame:
    files = sorted(
        path for path in RAW_DIR.iterdir() if path.is_file() and path.suffix.lower() in {".xls", ".ods"}
    )

    if not files:
        raise FileNotFoundError(f"No source spreadsheets found under {RAW_DIR}")

    frames = [load_file(path) for path in files]
    raw = pd.concat(frames, ignore_index=True)
    raw["source_row_number"] = raw.index + 2
    return raw


def repair_missing_subdistricts(frame: pd.DataFrame) -> tuple[pd.DataFrame, list[dict]]:
    repaired = frame.copy()
    repairs: list[dict] = []
    prev_sub_code = None
    prev_sub_name = None
    prev_state = None
    prev_district = None

    for idx, row in repaired.iterrows():
        if (
            row["source_file"] == "Rdir_2011_18_ASSAM.xls"
            and pd.isna(row["MDDS Sub_DT"])
            and row["MDDS PLCN"] != 0
            and prev_sub_code is not None
            and row["MDDS STC"] == prev_state
            and row["MDDS DTC"] == prev_district
        ):
            repaired.at[idx, "MDDS Sub_DT"] = prev_sub_code
            repaired.at[idx, "SUB-DISTRICT NAME"] = prev_sub_name
            repairs.append(
                {
                    "source_file": row["source_file"],
                    "source_row_number": int(row["source_row_number"]),
                    "village_code": str(int(row["MDDS PLCN"])).zfill(6),
                    "village_name": normalize_spaces(row["Area Name"]),
                    "imputed_subdistrict_code": str(int(prev_sub_code)).zfill(5),
                    "imputed_subdistrict_name": normalize_spaces(prev_sub_name),
                }
            )

        current_sub_code = row["MDDS Sub_DT"]
        current_sub_name = row["SUB-DISTRICT NAME"]
        if pd.notna(current_sub_code) and normalize_spaces(current_sub_name):
            prev_sub_code = current_sub_code
            prev_sub_name = current_sub_name
            prev_state = row["MDDS STC"]
            prev_district = row["MDDS DTC"]

    return repaired, repairs


def add_clean_columns(frame: pd.DataFrame) -> pd.DataFrame:
    cleaned = frame.copy()
    cleaned["state_code"] = zero_pad(cleaned["MDDS STC"], 2)
    cleaned["district_code"] = zero_pad(cleaned["MDDS DTC"], 3)
    cleaned["subdistrict_code"] = zero_pad(cleaned["MDDS Sub_DT"], 5)
    cleaned["village_code"] = zero_pad(cleaned["MDDS PLCN"], 6)

    cleaned["state_name"] = cleaned["STATE NAME"].map(normalize_spaces)
    cleaned["district_name"] = cleaned["DISTRICT NAME"].map(normalize_spaces)
    cleaned["subdistrict_name"] = cleaned["SUB-DISTRICT NAME"].map(normalize_spaces)
    cleaned["village_name_raw"] = cleaned["Area Name"].map(normalize_spaces)
    cleaned["village_name_display"] = cleaned["village_name_raw"].map(display_name)
    cleaned["village_name_normalized"] = cleaned["village_name_raw"].map(normalized_name)

    cleaned["row_type"] = "VILLAGE"
    cleaned.loc[
        (cleaned["district_code"] == "000")
        & (cleaned["subdistrict_code"] == "00000")
        & (cleaned["village_code"] == "000000"),
        "row_type",
    ] = "STATE"
    cleaned.loc[
        (cleaned["district_code"] != "000")
        & (cleaned["subdistrict_code"] == "00000")
        & (cleaned["village_code"] == "000000"),
        "row_type",
    ] = "DISTRICT"
    cleaned.loc[
        (cleaned["subdistrict_code"] != "00000") & (cleaned["village_code"] == "000000"),
        "row_type",
    ] = "SUBDISTRICT"

    cleaned["has_og_marker"] = cleaned["village_name_raw"].str.contains(r"\bOG\b", case=False, regex=True)
    cleaned["has_part_marker"] = cleaned["village_name_raw"].str.contains(r"\bPart\b", case=False, regex=True)
    cleaned["has_rural_marker"] = cleaned["village_name_raw"].str.contains(r"RURAL", case=False, regex=True)
    cleaned["has_ward_marker"] = cleaned["village_name_raw"].str.contains(r"Ward No\.", case=False, regex=True)
    cleaned["has_double_space_raw"] = cleaned["Area Name"].astype(str).str.contains(r"\s{2,}", regex=True)
    return cleaned


def build_reference_tables(cleaned: pd.DataFrame) -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    states = (
        cleaned.loc[cleaned["row_type"] == "STATE", ["state_code", "state_name", "source_file"]]
        .drop_duplicates()
        .sort_values(["state_code"])
        .reset_index(drop=True)
    )

    districts = (
        cleaned.loc[
            cleaned["row_type"] == "DISTRICT",
            ["state_code", "state_name", "district_code", "district_name", "source_file"],
        ]
        .drop_duplicates()
        .sort_values(["state_code", "district_code"])
        .reset_index(drop=True)
    )

    subdistricts = (
        cleaned.loc[
            cleaned["row_type"] == "SUBDISTRICT",
            [
                "state_code",
                "state_name",
                "district_code",
                "district_name",
                "subdistrict_code",
                "subdistrict_name",
                "source_file",
            ],
        ]
        .drop_duplicates()
        .sort_values(["state_code", "district_code", "subdistrict_code"])
        .reset_index(drop=True)
    )

    return states, districts, subdistricts


def build_village_dataset(cleaned: pd.DataFrame) -> tuple[pd.DataFrame, pd.DataFrame]:
    villages = cleaned.loc[cleaned["row_type"] == "VILLAGE"].copy()
    villages["full_address"] = (
        villages["village_name_display"]
        + ", "
        + villages["subdistrict_name"]
        + ", "
        + villages["district_name"]
        + ", "
        + villages["state_name"]
        + ", India"
    )

    villages["quality_flags"] = villages.apply(
        lambda row: "|".join(
            flag
            for flag, enabled in [
                ("OG", bool(row["has_og_marker"])),
                ("PART", bool(row["has_part_marker"])),
                ("RURAL", bool(row["has_rural_marker"])),
                ("WARD", bool(row["has_ward_marker"])),
            ]
            if enabled
        ),
        axis=1,
    )

    villages["canonical_rank"] = (
        villages["has_og_marker"].astype(int) * 10
        + villages["has_part_marker"].astype(int) * 5
        + villages["has_ward_marker"].astype(int) * 6
        + villages["has_rural_marker"].astype(int) * 4
        + villages["village_name_raw"].str.len().div(100)
    )

    villages["duplicate_village_code_count"] = villages.groupby("village_code")["village_code"].transform("size")
    villages["is_duplicate_village_code"] = villages["duplicate_village_code_count"] > 1
    villages["is_canonical_village_code_row"] = (
        villages.groupby("village_code")["canonical_rank"].rank(method="first", ascending=True) == 1
    )

    conflicts = (
        villages.loc[villages["is_duplicate_village_code"]]
        .sort_values(["village_code", "canonical_rank", "state_code", "district_code", "subdistrict_code"])
        .reset_index(drop=True)
    )

    villages = villages.sort_values(["state_code", "district_code", "subdistrict_code", "village_code"]).reset_index(
        drop=True
    )

    return villages, conflicts


def build_quality_report(
    raw: pd.DataFrame,
    cleaned: pd.DataFrame,
    states: pd.DataFrame,
    districts: pd.DataFrame,
    subdistricts: pd.DataFrame,
    villages: pd.DataFrame,
    conflicts: pd.DataFrame,
    repairs: list[dict],
) -> dict:
    duplicate_groups = int(conflicts["village_code"].nunique()) if not conflicts.empty else 0

    return {
        "source_dataset_version": "all-india-villages-master-list-excel.zip",
        "summary": {
            "raw_rows": int(len(raw)),
            "state_rows": int((cleaned["row_type"] == "STATE").sum()),
            "district_rows": int((cleaned["row_type"] == "DISTRICT").sum()),
            "subdistrict_rows": int((cleaned["row_type"] == "SUBDISTRICT").sum()),
            "village_rows": int((cleaned["row_type"] == "VILLAGE").sum()),
            "state_count": int(len(states)),
            "district_count": int(len(districts)),
            "subdistrict_count": int(len(subdistricts)),
            "village_count": int(len(villages)),
            "duplicate_village_code_groups": duplicate_groups,
            "duplicate_village_code_rows": int(len(conflicts)),
            "repaired_rows": len(repairs),
        },
        "data_quality": {
            "double_space_area_name_rows": int(cleaned["has_double_space_raw"].sum()),
            "og_marker_rows": int(villages["has_og_marker"].sum()),
            "part_marker_rows": int(villages["has_part_marker"].sum()),
            "rural_marker_rows": int(villages["has_rural_marker"].sum()),
            "ward_marker_rows": int(villages["has_ward_marker"].sum()),
        },
        "repair_log": repairs,
        "notes": [
            "The dataset is census-era and contains 30 state or union-territory files, not the current live administrative map of India.",
            "Rows with village code 000000 are hierarchy placeholders for state, district, or sub-district and are excluded from the final village master output.",
            "Duplicate village codes were preserved in the cleaned village dataset and surfaced in a separate conflict report instead of being silently dropped.",
        ],
    }


def clean_dataset() -> CleanResult:
    raw = load_raw_dataset()
    repaired, repairs = repair_missing_subdistricts(raw)
    cleaned = add_clean_columns(repaired)
    states, districts, subdistricts = build_reference_tables(cleaned)
    villages, conflicts = build_village_dataset(cleaned)
    quality_report = build_quality_report(
        raw=raw,
        cleaned=cleaned,
        states=states,
        districts=districts,
        subdistricts=subdistricts,
        villages=villages,
        conflicts=conflicts,
        repairs=repairs,
    )
    return CleanResult(states, districts, subdistricts, villages, conflicts, quality_report)


def write_outputs(result: CleanResult) -> None:
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)

    result.states.to_csv(PROCESSED_DIR / "states_clean.csv", index=False)
    result.districts.to_csv(PROCESSED_DIR / "districts_clean.csv", index=False)
    result.subdistricts.to_csv(PROCESSED_DIR / "subdistricts_clean.csv", index=False)
    result.villages.to_csv(PROCESSED_DIR / "villages_clean.csv", index=False)
    result.village_conflicts.to_csv(REPORTS_DIR / "village_code_conflicts.csv", index=False)

    with (REPORTS_DIR / "quality_report.json").open("w", encoding="utf-8") as handle:
        json.dump(result.quality_report, handle, indent=2)


def main() -> None:
    result = clean_dataset()
    write_outputs(result)

    print("Clean dataset written to:")
    print(f"  {PROCESSED_DIR}")
    print("Key counts:")
    print(json.dumps(result.quality_report["summary"], indent=2))


if __name__ == "__main__":
    main()
