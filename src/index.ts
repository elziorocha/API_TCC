import "express-async-errors";
import cors from "cors";
import express from "express";
import { AppDataSource } from "./data-source";
import routes from "./routes";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { cronVerificarAnoLetivo } from "./helpers/cron/alunoMatriculaCron";

AppDataSource.initialize().then(() => {
  const app = express();
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
  app.use(express.json());

  app.use(routes);
  app.use("/uploads", express.static("uploads"));
  app.use(errorMiddleware);

  cronVerificarAnoLetivo();

  return app.listen(process.env.PORT);
});
