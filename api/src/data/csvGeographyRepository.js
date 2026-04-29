const fs = require("fs");
const path = require("path");

const processedDir = path.resolve(__dirname, "../../../data/processed");
const statePath = path.join(processedDir, "states_clean.csv");
const districtPath = path.join(processedDir, "districts_clean.csv");
const subDistrictPath = path.join(processedDir, "subdistricts_clean.csv");
const villagePath = path.join(processedDir, "villages_clean.csv");
const qualityReportPath = path.join(processedDir, "reports/quality_report.json");

let cache;

const country = {
  id: "country_in",
  code: "IN",
  name: "India",
};

function parseCsvLine(line) {
  const values = [];
  let value = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const nextChar = line[index + 1];

    if (char === '"' && inQuotes && nextChar === '"') {
      value += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      values.push(value);
      value = "";
    } else {
      value += char;
    }
  }

  values.push(value);
  return values;
}

function readCsv(filePath, mapper) {
  const raw = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");

  if (raw.startsWith("version https://git-lfs.github.com/spec/v1")) {
    throw new Error(`${path.basename(filePath)} is a Git LFS pointer. Run git lfs pull.`);
  }

  const lines = raw.split(/\r?\n/).filter(Boolean);
  const headers = parseCsvLine(lines.shift());

  return lines.map((line) => {
    const values = parseCsvLine(line);
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || "";
    });
    return mapper(row);
  });
}

function toTitleCase(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\b[a-z]/g, (char) => char.toUpperCase())
    .replace(/\bAnd\b/g, "and");
}

function stateId(code) {
  return `state_${code}`;
}

function districtId(stateCode, districtCode) {
  return `district_${stateCode}_${districtCode}`;
}

function subDistrictId(districtCode, subDistrictCode) {
  return `subdistrict_${districtCode}_${subDistrictCode}`;
}

function villageId(subDistrictCode, villageCode, index) {
  return `village_${subDistrictCode}_${villageCode}_${index}`;
}

function readQualitySummary() {
  if (!fs.existsSync(qualityReportPath)) return {};

  try {
    return JSON.parse(fs.readFileSync(qualityReportPath, "utf8")).summary || {};
  } catch {
    return {};
  }
}

function loadRepository() {
  if (cache) return cache;

  const states = readCsv(statePath, (row) => ({
    id: stateId(row.state_code),
    code: row.state_code,
    name: toTitleCase(row.state_name),
    region: "",
    sourceFile: row.source_file,
    districts: [],
  }));

  const stateByCode = new Map(states.map((state) => [state.code, state]));
  const districtByKey = new Map();
  const subDistrictByKey = new Map();

  readCsv(districtPath, (row) => row).forEach((row) => {
    const state = stateByCode.get(row.state_code);
    if (!state) return;

    const district = {
      id: districtId(row.state_code, row.district_code),
      code: row.district_code,
      name: toTitleCase(row.district_name),
      stateId: state.id,
      sourceFile: row.source_file,
      subDistricts: [],
    };

    state.districts.push(district);
    districtByKey.set(`${row.state_code}:${row.district_code}`, district);
  });

  readCsv(subDistrictPath, (row) => row).forEach((row) => {
    const district = districtByKey.get(`${row.state_code}:${row.district_code}`);
    if (!district) return;

    const subDistrict = {
      id: subDistrictId(row.district_code, row.subdistrict_code),
      code: row.subdistrict_code,
      name: toTitleCase(row.subdistrict_name),
      districtId: district.id,
      sourceFile: row.source_file,
      villages: [],
    };

    district.subDistricts.push(subDistrict);
    subDistrictByKey.set(`${row.district_code}:${row.subdistrict_code}`, {
      state: stateByCode.get(row.state_code),
      district,
      subDistrict,
    });
  });

  readCsv(villagePath, (row) => row).forEach((row, index) => {
    const match = subDistrictByKey.get(`${row.district_code}:${row.subdistrict_code}`);
    if (!match) return;
    const rawName = row.village_name_raw || row.village_name || row.raw_name || "";
    const displayName = row.village_name_display || row.display_name || rawName;

    match.subDistrict.villages.push({
      id: villageId(row.subdistrict_code, row.village_code, index),
      code: row.village_code,
      name: toTitleCase(displayName),
      rawName,
      normalizedName: row.village_name_normalized || row.normalized_name || "",
      sourceFile: row.source_file,
    });
  });

  cache = {
    country,
    states,
    summary: readQualitySummary(),
    source: "processed-csv",
  };

  return cache;
}

function isAvailable() {
  return [statePath, districtPath, subDistrictPath, villagePath].every(fs.existsSync);
}

module.exports = {
  country,
  isAvailable,
  loadRepository,
};
