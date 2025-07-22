import { Router } from "express";
import { AlunoController } from "./controllers/AlunoController";
import { AlunoDocumentoController } from "./controllers/AlunoDocumentoController";
import { AlunoEnderecoController } from "./controllers/AlunoEnderecoController";
import { AlunoResponsavelController } from "./controllers/AlunoResponsavelController";
import { AuthController } from "./controllers/AuthController";
import { authMiddleware } from "./middlewares/authMiddleware";

const routes = Router();

routes.get("/api/aluno/:alunoId", new AlunoController().list);

routes.post("/api/aluno", new AuthController().create);
routes.post("/login", new AuthController().login);
routes.use(authMiddleware);

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

routes.get("/dashboard", new AuthController().getAluno);

export default routes;
