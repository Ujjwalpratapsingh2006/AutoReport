import rateLimit from 'express-rate-limit';

// Auth Rate Limiter: 10 requests per 15 minutes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: "Too many authentication attempts from this IP, please try again after 15 minutes" }
});
