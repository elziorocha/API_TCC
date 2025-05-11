import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Aluno_Documento } from "./Aluno_Documento";
import { Aluno_Endereco } from "./Aluno_Endereco";
import { Aluno_Responsavel } from "./Aluno_Responsavel";
import { Length, Matches } from "class-validator";

@Entity("alunos")
export class Aluno {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  senha: string;

  @Column({ type: "text", nullable: false })
  @Matches(/^[A-Za-zÀ-ÿ\s]+$/, {
    message: "O campo deve conter apenas letras.",
  })
  nome: string;

  @Column({ length: 11, unique: true, nullable: false })
  @Length(10, 11, { message: "O Telefone deve conter entre 10 e 11 dígitos." })
  telefone: string;

  @Column({ type: "date", nullable: false })
  data_nascimento: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    update: false,
  })
  criado_em: Date;

  @OneToOne(() => Aluno_Documento, {
    nullable: true,
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: "aluno_documento_id" })
  aluno_documento?: Aluno_Documento;

  @OneToOne(() => Aluno_Endereco, {
    nullable: true,
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: "aluno_endereco_id" })
  aluno_endereco?: Aluno_Endereco;

  @OneToOne(() => Aluno_Responsavel, {
    nullable: true,
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: "aluno_responsavel_id" })
  aluno_responsavel?: Aluno_Responsavel;
}
