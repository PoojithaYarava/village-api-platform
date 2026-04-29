const express = require("express");
const { config } = require("./config");
const { requestMeta } = require("./middleware/requestMeta");
const { apiLimiter, corsMiddleware, setSecurityHeaders } = require("./middleware/security");
const v1Routes = require("./routes/v1");

const app = express();

app.use(express.json());
app.use(corsMiddleware);
app.use(setSecurityHeaders);
app.use(requestMeta);
app.use(apiLimiter);

app.get("/", (req, res) => {
  res.json({
    success: true,
    service: "village-api-platform",
    message: "Village API server is running",
    endpoints: {
      frontend: config.frontendUrl,
      health: "/health",
      apiBase: "/api/v1",
      snapshot: "/api/v1/snapshot",
      autocompleteExample: "/api/v1/autocomplete?q=ma&hierarchyLevel=village",
    },
  });
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    service: "village-api-platform",
    uptimeSeconds: Math.round(process.uptime()),
    environment: config.nodeEnv,
  });
});

app.use("/api/v1", v1Routes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: "Requested resource does not exist",
    },
  });
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  console.error(err);
  res.status(statusCode).json({
    success: false,
    error: {
      code: statusCode === 403 ? "FORBIDDEN" : "INTERNAL_SERVER_ERROR",
      message: statusCode === 403 ? err.message : "Unexpected server error",
    },
    meta: {
      requestId: res.locals.requestId,
    },
  });
});

module.exports = { app };
