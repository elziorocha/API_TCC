export interface AlunoDocumentoInterface {
  rg: string;
  cpf: string;
  orgao_emissor: string;
  comprovante_matricula: string;
  atestado_frequencia: string;
  tipo_cartao: "EDUCARD" | "VEM";
}
