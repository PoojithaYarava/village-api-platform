function respond(res, payload, status = 200, meta = {}) {
  return res.status(status).json({
    success: status < 400,
    count: Array.isArray(payload) ? payload.length : meta.count || undefined,
    data: payload,
    meta: {
      requestId: res.locals.requestId,
      responseTime: meta.responseTime || 0,
      rateLimit: meta.rateLimit || {
        remaining: 4900,
        limit: 5000,
        reset: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      },
      ...meta.extra,
    },
  });
}

module.exports = { respond };
