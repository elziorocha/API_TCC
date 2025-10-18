import { AlunoProcessoInterface } from "./interfaces.interface";

export function gerarUrlsArquivos(
  processo: AlunoProcessoInterface,
  baseUrl?: string
) {
  const resolveUrl = (caminho?: string | null) => {
    if (!caminho) return null;

    if (caminho.startsWith("http")) return caminho;

    return `${baseUrl}/uploads/${
      caminho.replace(/\\/g, "/").split("uploads/")[1]
    }`;
  };

  return {
    formulario_educard_url: resolveUrl(processo.formulario_educard),
    declaracao_matricula_url: resolveUrl(processo.declaracao_matricula),
    comprovante_pagamento_url: resolveUrl(processo.comprovante_pagamento),
    comprovante_residencia_url: resolveUrl(processo.comprovante_residencia),
    rg_frente_ou_verso_url: resolveUrl(processo.rg_frente_ou_verso),
  };
}
