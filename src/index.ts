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

  const PORT = process.env.PORT || 3000;
  const server = app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
  );

  // Função para listar todas as rotas
  function listRoutes(stack: any[], prefix = "") {
    stack.forEach((middleware) => {
      if (middleware.route) {
        // rota registrada diretamente
        const methods = Object.keys(middleware.route.methods)
          .map((m) => m.toUpperCase())
          .join(", ");
        console.log(`${methods} ${prefix}${middleware.route.path}`);
      } else if (middleware.name === "router" && middleware.handle.stack) {
        // sub-router
        const newPrefix = middleware.regexp
          .toString()
          .replace(/^\/\^\\/, "/")
          .replace(/\\\/\?\(\?\=\\\/\|\$\)\/i$/, "")
          .replace(/\\\//g, "/");
        listRoutes(middleware.handle.stack, prefix + newPrefix);
      }
    });
  }

  console.log("\nRegistered routes:");
  listRoutes(app._router.stack);
});
