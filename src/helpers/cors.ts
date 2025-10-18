import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

export function corsIndex() {
  const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || [];

  return cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Não permitido pelo CORS"));
    },
    credentials: true,
  });
}
