const { states } = require("../data/mockGeography");

const country = {
  id: "country_in",
  code: "IN",
  name: "India",
};

function buildVillagePayload(state, district, subDistrict, village) {
  return {
    value: village.id,
    label: village.name,
    code: village.code,
    fullAddress: `${village.name}, ${subDistrict.name}, ${district.name}, ${state.name}, India`,
    hierarchy: {
      village: village.name,
      subDistrict: subDistrict.name,
      district: district.name,
      state: state.name,
      country: country.name,
    },
  };
}

function getStates() {
  return states.map(({ districts, ...state }) => ({
    ...state,
    districtCount: districts.length,
  }));
}

function getDistrictsByState(stateId) {
  const state = states.find((item) => item.id === stateId || item.code === stateId);
  if (!state) return [];

  return state.districts.map(({ subDistricts, ...district }) => ({
    ...district,
    stateId: state.id,
    subDistrictCount: subDistricts.length,
  }));
}

function getSubDistrictsByDistrict(districtId) {
  for (const state of states) {
    const district = state.districts.find(
      (item) => item.id === districtId || item.code === districtId
    );

    if (district) {
      return district.subDistricts.map(({ villages, ...subDistrict }) => ({
        ...subDistrict,
        districtId: district.id,
        villageCount: villages.length,
      }));
    }
  }

  return [];
}

function getVillagesBySubDistrict(subDistrictId, page = 1, limit = 20) {
  for (const state of states) {
    for (const district of state.districts) {
      const subDistrict = district.subDistricts.find(
        (item) => item.id === subDistrictId || item.code === subDistrictId
      );

      if (subDistrict) {
        const items = subDistrict.villages.map((village) =>
          buildVillagePayload(state, district, subDistrict, village)
        );
        const start = (page - 1) * limit;

        return {
          data: items.slice(start, start + limit),
          total: items.length,
          page,
          limit,
        };
      }
    }
  }

  return { data: [], total: 0, page, limit };
}

function searchVillages({
  q = "",
  state: stateFilter,
  district: districtFilter,
  subDistrict: subDistrictFilter,
  limit = 10,
}) {
  const query = q.trim().toLowerCase();
  const results = [];

  for (const state of states) {
    if (stateFilter && state.name.toLowerCase() !== String(stateFilter).toLowerCase()) {
      continue;
    }

    for (const district of state.districts) {
      if (
        districtFilter &&
        district.name.toLowerCase() !== String(districtFilter).toLowerCase()
      ) {
        continue;
      }

      for (const subDistrict of district.subDistricts) {
        if (
          subDistrictFilter &&
          subDistrict.name.toLowerCase() !== String(subDistrictFilter).toLowerCase()
        ) {
          continue;
        }

        for (const village of subDistrict.villages) {
          const matches =
            !query ||
            village.name.toLowerCase().includes(query) ||
            district.name.toLowerCase().includes(query) ||
            subDistrict.name.toLowerCase().includes(query) ||
            state.name.toLowerCase().includes(query);

          if (matches) {
            results.push(buildVillagePayload(state, district, subDistrict, village));
          }
        }
      }
    }
  }

  return results.slice(0, limit);
}

function getAutocomplete(q = "", hierarchyLevel = "village") {
  const query = q.trim().toLowerCase();
  if (query.length < 2) return [];

  if (hierarchyLevel === "state") {
    return states
      .filter((state) => state.name.toLowerCase().includes(query))
      .map((state) => ({
        value: state.id,
        label: state.name,
        hierarchyLevel: "state",
      }));
  }

  return searchVillages({ q, limit: 8 }).map((item) => ({
    value: item.value,
    label: `${item.label} (${item.hierarchy.subDistrict}, ${item.hierarchy.district}, ${item.hierarchy.state})`,
    fullAddress: item.fullAddress,
    hierarchy: item.hierarchy,
    hierarchyLevel: "village",
  }));
}

function getPlatformSnapshot() {
  const districtCount = states.reduce((total, state) => total + state.districts.length, 0);
  const subDistrictCount = states.reduce(
    (total, state) =>
      total +
      state.districts.reduce((subtotal, district) => subtotal + district.subDistricts.length, 0),
    0
  );
  const villageCount = states.reduce(
    (total, state) =>
      total +
      state.districts.reduce(
        (subtotal, district) =>
          subtotal +
          district.subDistricts.reduce((sum, subDistrict) => sum + subDistrict.villages.length, 0),
        0
      ),
    0
  );

  return {
    coverage: {
      country,
      states: states.length,
      districts: districtCount,
      subDistricts: subDistrictCount,
      villages: villageCount,
    },
    performance: {
      p95ResponseMs: 84,
      dailyCapacity: "1M+",
      cacheHitRate: 91,
    },
    plans: [
      { name: "Free", dailyLimit: 5000, regions: "Single state" },
      { name: "Premium", dailyLimit: 50000, regions: "Up to 5 states" },
      { name: "Pro", dailyLimit: 300000, regions: "All states" },
      { name: "Unlimited", dailyLimit: 1000000, regions: "All states + SLA" },
    ],
  };
}

module.exports = {
  getAutocomplete,
  getDistrictsByState,
  getPlatformSnapshot,
  getStates,
  getSubDistrictsByDistrict,
  getVillagesBySubDistrict,
  searchVillages,
};
