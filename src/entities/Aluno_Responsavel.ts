import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Aluno } from "./Aluno";

@Entity("aluno_responsaveis")
export class Aluno_Responsavel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  cpf_mae: string;

  @Column({ type: "text", nullable: false })
  nome_mae: string;

  @Column({ type: "text", nullable: false })
  nome_pai: string;

  @Column({ type: "text", nullable: false })
  nome_responsavel: string;

  @OneToOne(() => Aluno, (aluno) => aluno.aluno_responsavel)
  aluno: Aluno;
}
