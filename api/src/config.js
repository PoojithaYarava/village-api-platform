const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(process.cwd(), "../.env") });
dotenv.config();

const config = {
  port: Number(process.env.PORT || process.env.API_PORT || 3000),
  jwtSecret: process.env.JWT_SECRET || "development-secret",
  databaseUrl: process.env.DATABASE_URL || "",
  redisUrl: process.env.REDIS_URL || "",
  nodeEnv: process.env.NODE_ENV || "development",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  allowedOrigins: (process.env.CORS_ORIGINS || process.env.FRONTEND_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60 * 1000),
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX || 120),
  useProcessedCsv: process.env.USE_PROCESSED_CSV !== "false",
};

module.exports = { config };
