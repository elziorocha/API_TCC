import "express-async-errors";
import cors from "cors";
import express from "express";
import { AppDataSource } from "./data-source";
import routes from "./routes";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { cronsDoSistema } from "./helpers/cron/cron";
import dotenv from "dotenv";

dotenv.config();

AppDataSource.initialize().then(() => {
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

  return app.listen(process.env.PORT);
});
