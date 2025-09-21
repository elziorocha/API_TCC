import { AlunoProcessoInterface } from "./interfaces.interface";

export function gerarUrlsArquivos(
  processo: AlunoProcessoInterface,
  baseUrl: string
) {
  return {
    formulario_educard_url: processo.formulario_educard
      ? `${baseUrl}/uploads/${
          processo.formulario_educard.replace(/\\/g, "/").split("uploads/")[1]
        }`
      : null,
    declaracao_matricula_url: processo.declaracao_matricula
      ? `${baseUrl}/uploads/${
          processo.declaracao_matricula.replace(/\\/g, "/").split("uploads/")[1]
        }`
      : null,
    comprovante_pagamento_url: processo.comprovante_pagamento
      ? `${baseUrl}/uploads/${
          processo.comprovante_pagamento
            .replace(/\\/g, "/")
            .split("uploads/")[1]
        }`
      : null,
    comprovante_residencia_url: processo.comprovante_residencia
      ? `${baseUrl}/uploads/${
          processo.comprovante_residencia
            .replace(/\\/g, "/")
            .split("uploads/")[1]
        }`
      : null,
    rg_frente_ou_verso_url: processo.rg_frente_ou_verso
      ? `${baseUrl}/uploads/${
          processo.rg_frente_ou_verso.replace(/\\/g, "/").split("uploads/")[1]
        }`
      : null,
  };
}
