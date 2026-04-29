const cors = require("cors");
const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
});

const corsMiddleware = cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
});

function setSecurityHeaders(req, res, next) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Strict-Transport-Security", "max-age=31536000");
  res.setHeader("Content-Security-Policy", "default-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self' http://localhost:5173");
  next();
}

module.exports = {
  apiLimiter,
  corsMiddleware,
  setSecurityHeaders,
};
