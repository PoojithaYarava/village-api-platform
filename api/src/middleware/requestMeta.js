function requestMeta(req, res, next) {
  const start = Date.now();
  const requestId = `req_${Math.random().toString(36).slice(2, 10)}`;

  res.locals.requestId = requestId;
  res.setHeader("X-Request-Id", requestId);

  res.on("finish", () => {
    res.locals.responseTime = Date.now() - start;
  });

  next();
}

module.exports = { requestMeta };
