import "express-async-errors";
import cors from "cors";
import express from "express";
import { AppDataSource } from "./data-source";
import routes from "./routes";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { cronsDoSistema } from "./helpers/cron/cron";
import dotenv from "dotenv";

dotenv.config();

// Log da variável de ambiente
console.log("DATABASE_URL:", process.env.DATABASE_URL);

AppDataSource.initialize()
  .then(() => {
    console.log("✅ Data Source has been initialized!");

    const app = express();

    app.use(
      cors({
        origin: process.env.CORS_ORIGIN?.split(",") || "*",
        credentials: true,
      })
    );
    app.use(express.json());

    app.use("/uploads", express.static("uploads"));
    app.use(routes);
    app.use(errorMiddleware);

    cronsDoSistema();

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error during Data Source initialization:", err);
  });
