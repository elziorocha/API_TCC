import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Aluno } from "./Aluno";

@Entity("aluno_documentos")
export class Aluno_Documento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  rg: string;

  @Column({ unique: true, nullable: false })
  cpf: string;

  @Column({ nullable: false })
  orgao_emissor: string;

  @Column({ nullable: false })
  comprovante_matricula: string;

  @Column({ nullable: false })
  atestado_frequencia: string;

  @Column({
    type: "enum",
    enum: ["EDUCARD", "VEM"],
    nullable: false,
  })
  tipo_cartao: "EDUCARD" | "VEM";

  @OneToOne(() => Aluno, (aluno) => aluno.aluno_documento)
  aluno: Aluno;
}
