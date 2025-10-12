import { AlunoMatriculaInterface } from "../helpers/interfaces.interface";
import { GrauEscolaridade } from "../helpers/entities-enum";

export function optionCamposPorGrau(
  alunoMatriculaData: AlunoMatriculaInterface
): AlunoMatriculaInterface {
  const dadosProcessados = { ...alunoMatriculaData };

  const grausComCGM = [
    GrauEscolaridade.CEEBJA_EJA_FUNDAMENTAL,
    GrauEscolaridade.CEEBJA_EJA_MEDIO,
  ];

  const grausComCurso = [
    GrauEscolaridade.SUPERIOR,
    GrauEscolaridade.TECNICO_SEMESTRAL,
    GrauEscolaridade.TECNICO_ANUAL,
  ];

  if (!grausComCGM.includes(dadosProcessados.grau_escolaridade)) {
    dadosProcessados.cgm = undefined;
    dadosProcessados.distancia_instituicao = undefined;
  }

  if (!grausComCurso.includes(dadosProcessados.grau_escolaridade)) {
    dadosProcessados.curso = undefined;
  }

  return dadosProcessados;
}
