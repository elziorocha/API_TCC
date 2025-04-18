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

@Entity("alunos")
export class Aluno {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  senha: string;

  @Column({ type: "text", nullable: false })
  nome: string;

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
