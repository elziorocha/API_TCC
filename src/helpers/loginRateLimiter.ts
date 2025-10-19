import rateLimit from "express-rate-limit";

export const loginRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: "Muitas tentativas de login. Tente novamente mais tarde.",
  standardHeaders: true,
  legacyHeaders: false,
});
