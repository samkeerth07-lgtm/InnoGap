// In-memory rate limiting middleware to protect the AI backend from floods
// Zero external dependencies.

const RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000", 10); // 1 minute
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX || "10", 10); // 10 requests per window

const rateLimiter = (options = {}) => {
  const windowMs = options.windowMs || RATE_LIMIT_WINDOW_MS;
  const max = options.max || RATE_LIMIT_MAX;
  const store = options.store || new Map();

  // Periodic cleanup of expired entries every window to prevent memory leaks
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of store.entries()) {
      if (now - record.startTime > windowMs) {
        store.delete(key);
      }
    }
  }, Math.max(10000, windowMs));

  if (cleanupInterval.unref) {
    cleanupInterval.unref();
  }

  return (req, res, next) => {
    const ip = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";
    const now = Date.now();

    let record = store.get(ip);

    if (!record || now - record.startTime > windowMs) {
      record = {
        count: 1,
        startTime: now
      };
      store.set(ip, record);
    } else {
      record.count += 1;
    }

    const remaining = Math.max(0, max - record.count);
    const resetTime = Math.ceil((record.startTime + windowMs - now) / 1000);

    res.setHeader("X-RateLimit-Limit", max);
    res.setHeader("X-RateLimit-Remaining", remaining);
    res.setHeader("X-RateLimit-Reset", Math.max(0, resetTime));

    if (record.count > max) {
      res.setHeader("Retry-After", Math.max(1, resetTime));
      return res.status(429).json({
        error: "Too Many Requests",
        message: `Rate limit exceeded. Maximum ${max} requests per ${Math.round(windowMs / 1000)} seconds allowed.`
      });
    }

    next();
  };
};

module.exports = {
  rateLimiter
};
