import "express-async-errors";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { AppDataSource } from "./data-source";
import routes from "./routes";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { cronsDoSistema } from "./helpers/cron/cron";

dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Inicializa conexão com o banco
AppDataSource.initialize()
  .then(() => {
    const app = express();

    // Configura CORS corretamente
    const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || [];

    app.use(
      cors({
        origin: (origin, callback) => {
          // Permite chamadas sem origin (Postman, mobile, curl)
          if (!origin) return callback(null, true);

          if (allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error("Não permitido pelo CORS"));
          }
        },
        credentials: true, // permite envio de cookies/auth
      })
    );

    app.use(express.json());

    // Pasta de uploads
    app.use("/uploads", express.static("uploads"));

    // Rotas da aplicação
    app.use(routes);

    // Middleware de erros
    app.use(errorMiddleware);

    // Crons
    cronsDoSistema();

    // Start do servidor
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Erro ao inicializar o DataSource:", err);
  });
