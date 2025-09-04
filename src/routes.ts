import { Router } from "express";
import { AlunoController } from "./controllers/AlunoController";
import { AlunoDocumentoController } from "./controllers/AlunoDocumentoController";
import { AlunoEnderecoController } from "./controllers/AlunoEnderecoController";
import { AlunoResponsavelController } from "./controllers/AlunoResponsavelController";
import { AuthController } from "./controllers/AuthController";
import { authMiddleware } from "./middlewares/authMiddleware";
import { AlunoMatriculaController } from "./controllers/AlunoMatriculaController";

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

export default routes;
