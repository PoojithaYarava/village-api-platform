const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(process.cwd(), "../.env") });
dotenv.config();

const config = {
  port: Number(process.env.API_PORT || 3000),
  jwtSecret: process.env.JWT_SECRET || "development-secret",
  databaseUrl: process.env.DATABASE_URL || "",
  redisUrl: process.env.REDIS_URL || "",
  nodeEnv: process.env.NODE_ENV || "development",
};

module.exports = { config };
