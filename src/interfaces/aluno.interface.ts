export interface AlunoInterface {
  email: string;
  senha: string;
  nome: string;
  telefone: string;
  data_nascimento: Date;
  tipo_cartao: "EDUCARD" | "VEM";
  criado_em: Date;
}
