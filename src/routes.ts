import { Router } from "express";
import { AlunoController } from "./controllers/AlunoController";
import { AlunoDocumentoController } from "./controllers/AlunoDocumentoController";

const routes = Router();

routes.post("/api/aluno", new AlunoController().create);
routes.post(
  "/api/aluno/:alunoId/documento",
  new AlunoDocumentoController().create
);

export default routes;
