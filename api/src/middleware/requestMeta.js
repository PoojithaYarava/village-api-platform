const crypto = require("crypto");

function requestMeta(req, res, next) {
  const start = Date.now();
  const requestId = req.get("X-Request-Id") || `req_${crypto.randomUUID()}`;

  res.locals.requestId = requestId;
  res.setHeader("X-Request-Id", requestId);

  res.on("finish", () => {
    console.info(
      JSON.stringify({
        requestId,
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        responseTimeMs: Date.now() - start,
      })
    );
  });

  next();
}

module.exports = { requestMeta };
