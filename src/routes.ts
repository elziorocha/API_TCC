import { Router } from "express";
import { AuthController } from "./controllers/AuthController";
import { authMiddleware } from "./middlewares/authMiddleware";
import { AlunoController } from "./controllers/AlunoController";
import { AlunoDocumentoController } from "./controllers/AlunoDocumentoController";
import { AlunoEnderecoController } from "./controllers/AlunoEnderecoController";
import { AlunoResponsavelController } from "./controllers/AlunoResponsavelController";
import { AlunoMatriculaController } from "./controllers/AlunoMatriculaController";
import { AlunoProcessoController } from "./controllers/AlunoProcessoController";
import { uploadImagem } from "./helpers/multer-config";

const alunoProcessoController = new AlunoProcessoController();

const routes = Router();

routes.post("/api/aluno/registro", new AuthController().create);
routes.post("/api/aluno/login", new AuthController().login);

routes.use(authMiddleware);
routes.get("/api/aluno", new AlunoController().list);
routes.put("/api/aluno/alterar-senha", new AuthController().alterarSenha);

routes.post("/api/aluno/documento", new AlunoDocumentoController().create);
routes.get("/api/aluno/documento", new AlunoDocumentoController().list);

routes.post("/api/aluno/endereco", new AlunoEnderecoController().create);
routes.get("/api/aluno/endereco", new AlunoEnderecoController().list);

routes.post("/api/aluno/responsavel", new AlunoResponsavelController().create);
routes.get("/api/aluno/responsavel", new AlunoResponsavelController().list);

routes.post("/api/aluno/matricula", new AlunoMatriculaController().create);
routes.get("/api/aluno/matricula", new AlunoMatriculaController().list);

routes.post(
  "/api/aluno/processo/iniciar",
  alunoProcessoController.iniciarProcesso.bind(alunoProcessoController)
);

routes.post(
  "/api/aluno/processo",
  uploadImagem.fields([
    { name: "formulario_educard", maxCount: 1 },
    { name: "declaracao_matricula", maxCount: 1 },
    { name: "comprovante_pagamento", maxCount: 1 },
    { name: "comprovante_residencia", maxCount: 1 },
    { name: "rg_frente_ou_verso", maxCount: 1 },
  ]),
  alunoProcessoController.create.bind(alunoProcessoController)
);

routes.get(
  "/api/aluno/processo",
  alunoProcessoController.list.bind(alunoProcessoController)
);

routes.delete(
  "/api/aluno/processo/arquivo/:campo",
  alunoProcessoController.removerArquivo.bind(alunoProcessoController)
);

routes.post("/api/aluno/logout", new AuthController().logout);

export default routes;
