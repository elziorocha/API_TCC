import { Router } from "express";
import { AlunoController } from "./controllers/AlunoController";
import { AlunoDocumentoController } from "./controllers/AlunoDocumentoController";
import { AlunoEnderecoController } from "./controllers/AlunoEnderecoController";
import { AlunoResponsavelController } from "./controllers/AlunoResponsavelController";

const routes = Router();

routes.post("/api/aluno", new AlunoController().create);
routes.get("/api/aluno", new AlunoController().list);

routes.post(
  "/api/aluno/:alunoId/documento",
  new AlunoDocumentoController().create
);
routes.get(
  "/api/aluno/:alunoId/documento",
  new AlunoDocumentoController().list
);

routes.post(
  "/api/aluno/:alunoId/endereco",
  new AlunoEnderecoController().create
);
routes.get("/api/aluno/:alunoId/endereco", new AlunoEnderecoController().list);

routes.post(
  "/api/aluno/:alunoId/responsavel",
  new AlunoResponsavelController().create
);
routes.get(
  "/api/aluno/:alunoId/responsavel",
  new AlunoResponsavelController().list
);

export default routes;
