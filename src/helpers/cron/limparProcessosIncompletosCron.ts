import cron from "node-cron";
import { LessThan } from "typeorm";
import { AlunoProcessosRepository } from "../../repositories";

export function limparProcessosIncompletosCron() {
  cron.schedule("0 0 * * *", async () => {
    const dataAtual = new Date();

    const processosVencidos = await AlunoProcessosRepository.find({
      where: { prazo_final: LessThan(dataAtual) },
    });

    for (const processo of processosVencidos) {
      const processoIncompleto =
        !processo.formulario_educard ||
        !processo.declaracao_matricula ||
        !processo.comprovante_pagamento ||
        !processo.comprovante_residencia ||
        !processo.rg_frente_ou_verso;

      if (processoIncompleto) {
        await AlunoProcessosRepository.remove(processo);
      }
    }
  });
}
