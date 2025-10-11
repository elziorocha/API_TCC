import cron from "node-cron";
import { AlunoRepository } from "../../repositories";
import { IsNull, Not } from "typeorm";

export function limparTipoCartaoCron() {
  cron.schedule("0 0 1 1 *", async () => {
    const alunosComCartao = await AlunoRepository.find({
      where: { tipo_cartao: Not(IsNull()) },
      relations: ["aluno_matricula"],
    });

    for (const aluno of alunosComCartao) {
      const possuiMatriculaAtiva = aluno.aluno_matricula?.some(
        (matricula) => matricula.status_matricula === true
      );

      if (!possuiMatriculaAtiva) {
        aluno.tipo_cartao = null;
        await AlunoRepository.save(aluno);
      }
    }
  });
}
