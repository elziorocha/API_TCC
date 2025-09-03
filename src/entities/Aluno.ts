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
import { IsDate, IsEmail, Length, Matches, MinLength } from "class-validator";
import { Aluno_Matricula } from "./Aluno_Matricula";

@Entity("alunos")
export class Aluno {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  @IsEmail({}, { message: "Insira um endereço de email válido." })
  email: string;

  @Column({ nullable: false })
  @MinLength(6, { message: "A senha deve conter pelo menos 6 caracteres." })
  senha: string;

  @Column({ type: "text", nullable: false })
  @Matches(/^[A-Za-zÀ-ÿ\s]+$/, {
    message: "O nome deve conter apenas letras.",
  })
  nome: string;

  @Column({ length: 11, unique: true, nullable: false })
  @Length(11, 11, { message: "O Telefone deve conter 11 dígitos." })
  @Matches(/^\d+$/, {
    message: "O telefone deve conter apenas números.",
  })
  telefone: string;

  @Column({ type: "date", nullable: false })
  @IsDate({ message: "Data de nascimento deve ser uma data válida." })
  data_nascimento: Date;

  @Column({
    type: "enum",
    enum: ["EDUCARD", "VEM"],
    nullable: true,
  })
  tipo_cartao: "EDUCARD" | "VEM";

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

  @OneToOne(() => Aluno_Matricula, {
    nullable: true,
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: "aluno_matricula_id" })
  aluno_matricula?: Aluno_Matricula;
}
