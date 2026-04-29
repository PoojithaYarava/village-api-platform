function respond(res, payload, status = 200, meta = {}) {
  const rateLimit = {
    remaining: Number(res.getHeader("RateLimit-Remaining")) || undefined,
    limit: Number(res.getHeader("RateLimit-Limit")) || undefined,
    reset: res.getHeader("RateLimit-Reset") || undefined,
  };

  return res.status(status).json({
    success: status < 400,
    count: Array.isArray(payload) ? payload.length : meta.count || undefined,
    data: payload,
    meta: {
      requestId: res.locals.requestId,
      rateLimit: meta.rateLimit || rateLimit,
      ...meta.extra,
    },
  });
}

module.exports = { respond };
