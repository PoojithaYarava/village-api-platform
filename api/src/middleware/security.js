const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { config } = require("../config");

const apiLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  limit: config.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
});

const corsMiddleware = cors({
  origin(origin, callback) {
    if (!origin || config.allowedOrigins.length === 0 || config.allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    const error = new Error("Origin is not allowed by CORS");
    error.statusCode = 403;
    callback(error);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
});

function setSecurityHeaders(req, res, next) {
  const connectSources = ["'self'", "http://localhost:5173", ...config.allowedOrigins].join(" ");

  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Strict-Transport-Security", "max-age=31536000");
  res.setHeader(
    "Content-Security-Policy",
    `default-src 'self'; style-src 'self' 'unsafe-inline'; connect-src ${connectSources}`
  );
  next();
}

module.exports = {
  apiLimiter,
  corsMiddleware,
  setSecurityHeaders,
};
