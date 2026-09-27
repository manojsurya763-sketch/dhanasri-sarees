import rateLimit from "express-rate-limit";

// Exact numbers are sane defaults, not tuned to real traffic yet — revisit
// via env vars once there's production traffic data.

// Brute-force protection on OTP send/verify and staff login.
export const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

// Checkout/payment abuse protection.
export const checkoutLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

// App-wide floor so no route is completely unthrottled.
export const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
