import "express-async-errors";
import express from "express";
import { AppDataSource } from "./data-source";
import routes from "./routes";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { cronsDoSistema } from "./helpers/cron/cron";
import dotenv from "dotenv";
import { corsIndex } from "./helpers/cors";
import helmet from "helmet";

dotenv.config();

AppDataSource.initialize().then(() => {
  const app = express();

  app.use(helmet());
  app.use(corsIndex());
  app.use(express.json());

  app.use(routes);
  app.use(errorMiddleware);

  cronsDoSistema();

  return app.listen(process.env.PORT);
});
