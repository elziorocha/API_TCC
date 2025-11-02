import rateLimit from "express-rate-limit";
import { TooManyRequestsError } from "../helpers/api-errors";

export const loginRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(
      new TooManyRequestsError(
        "Muitas tentativas de login. Tente novamente mais tarde."
      )
    );
  },
});
