import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Length, Matches } from "class-validator";
import { Aluno } from "./Aluno";

@Entity("aluno_responsaveis")
export class Aluno_Responsavel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  @Length(11, 11, { message: "O CPF deve conter exatamente 11 dígitos" })
  @Matches(/^\d{11}$/, { message: "O CPF deve conter apenas números" })
  cpf_mae: string;

  @Column({ type: "text", nullable: false })
  @Matches(/^[A-Za-zÀ-ÿ\s]+$/, {
    message: "O campo nome da mãe deve conter apenas letras",
  })
  nome_mae: string;

  @Column({ type: "text", nullable: false })
  @Matches(/^[A-Za-zÀ-ÿ\s]+$/, {
    message: "O campo nome do pai deve conter apenas letras",
  })
  nome_pai: string;

  @Column({ type: "text", nullable: false })
  @Matches(/^[A-Za-zÀ-ÿ\s]+$/, {
    message: "O campo nome do responsável deve conter apenas letras",
  })
  nome_responsavel: string;

  @OneToOne(() => Aluno, (aluno) => aluno.aluno_responsavel)
  aluno: Aluno;
}
