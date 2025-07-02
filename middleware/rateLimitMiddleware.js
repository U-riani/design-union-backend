const rateLimitMap = new Map();

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 3;

const rateLimitMiddleware = (req, res, next) => {
  const ip = req.ip;
  const currentTime = Date.now();

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, []);
  }

  const timestamps = rateLimitMap.get(ip);
  const recentTimestamps = timestamps.filter(ts => currentTime - ts < RATE_LIMIT_WINDOW_MS);

  if (recentTimestamps.length >= MAX_REQUESTS_PER_WINDOW && req.body.role !== 'admin') {
    return res.status(429).json({ message: "Too many requests. Please try again later." });
  }

  recentTimestamps.push(currentTime);
  rateLimitMap.set(ip, recentTimestamps);
  next();
};

module.exports = rateLimitMiddleware;
