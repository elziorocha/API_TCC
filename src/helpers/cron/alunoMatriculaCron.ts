import cron from "node-cron";
import { AlunoMatriculaRepository } from "../../repositories";

export function cronVerificarAnoLetivo() {
  cron.schedule("0 0 1 1 *", async () => {
    const anoAtual = new Date().getFullYear();

    await AlunoMatriculaRepository.createQueryBuilder()
      .update()
      .set({ status_matricula: false })
      .where("ano_letivo < :anoAtual", { anoAtual })
      .execute();
  });
}
