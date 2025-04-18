import { Router } from "express";
import { AlunoController } from "./controllers/AlunoController";

const routes = Router();

routes.post("/api/aluno", new AlunoController().create);

export default routes;
