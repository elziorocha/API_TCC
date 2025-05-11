import { Router } from "express";
import { AlunoController } from "./controllers/AlunoController";
import { AlunoDocumentoController } from "./controllers/AlunoDocumentoController";
import { AlunoEnderecoController } from "./controllers/AlunoEnderecoController";
import { AlunoResponsavelController } from "./controllers/AlunoResponsavelController";

const routes = Router();

routes.post("/api/aluno", new AlunoController().create);
routes.post(
  "/api/aluno/:alunoId/documento",
  new AlunoDocumentoController().create
);
routes.post(
  "/api/aluno/:alunoId/endereco",
  new AlunoEnderecoController().create
);
routes.post(
  "/api/aluno/:alunoId/responsavel",
  new AlunoResponsavelController().create
);

export default routes;
