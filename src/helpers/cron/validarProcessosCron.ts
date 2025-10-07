import cron from "node-cron";
import { IsNull, LessThan, Not } from "typeorm";
import { AlunoProcessosRepository } from "../../repositories";

export function validarProcessosCron() {
  cron.schedule("0 0 * * *", async () => {
    const processosValidos = await AlunoProcessosRepository.find({
      where: {
        formulario_educard: Not(IsNull()),
        declaracao_matricula: Not(IsNull()),
        comprovante_pagamento: Not(IsNull()),
        comprovante_residencia: Not(IsNull()),
        rg_frente_ou_verso: Not(IsNull()),
      },
    });
  });
}
