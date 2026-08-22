const stores = new Map();

function getStore(key) {
  if (!stores.has(key)) stores.set(key, new Map());
  return stores.get(key);
}

export function createRateLimiter({
  name,
  windowMs,
  max,
  message = "Too many requests. Please try again later.",
}) {
  const store = getStore(name);

  return (req, res, next) => {
    const now = Date.now();
    const key = req.ip || req.socket?.remoteAddress || "unknown";
    const current = store.get(key);

    if (!current || current.resetAt <= now) {
      store.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    current.count += 1;

    if (current.count > max) {
      const retryAfter = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
      res.setHeader("Retry-After", String(retryAfter));
      return res.status(429).json({ success: false, message });
    }

    next();
  };
}
