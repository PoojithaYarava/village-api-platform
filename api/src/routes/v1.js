const express = require("express");
const {
  getAutocomplete,
  getDistrictsByState,
  getPlatformSnapshot,
  getStates,
  getSubDistrictsByDistrict,
  getVillagesBySubDistrict,
  searchVillages,
} = require("../services/geographyService");
const { respond } = require("../utils/respond");

const router = express.Router();

function toPositiveInt(value, fallback, max = 100) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, max);
}

router.get("/", (req, res) => {
  respond(res, {
    name: "Village API Platform",
    version: "v1",
    status: "ok",
  });
});

router.get("/snapshot", (req, res) => {
  respond(res, getPlatformSnapshot());
});

router.get("/states", (req, res) => {
  respond(res, getStates());
});

router.get("/states/:id/districts", (req, res) => {
  respond(res, getDistrictsByState(req.params.id));
});

router.get("/districts/:id/subdistricts", (req, res) => {
  respond(res, getSubDistrictsByDistrict(req.params.id));
});

router.get("/subdistricts/:id/villages", (req, res) => {
  const page = toPositiveInt(req.query.page, 1, 100000);
  const limit = toPositiveInt(req.query.limit, 20, 100);
  const result = getVillagesBySubDistrict(req.params.id, page, limit);
  respond(res, result.data, 200, {
    count: result.total,
    extra: {
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
      },
    },
  });
});

router.get("/search", (req, res) => {
  const limit = toPositiveInt(req.query.limit, 10, 50);
  const data = searchVillages({
    q: req.query.q || "",
    state: req.query.state,
    district: req.query.district,
    subDistrict: req.query.subDistrict,
    limit,
  });
  respond(res, data);
});

router.get("/autocomplete", (req, res) => {
  const data = getAutocomplete(req.query.q || "", req.query.hierarchyLevel || "village");
  respond(res, data);
});

module.exports = router;
