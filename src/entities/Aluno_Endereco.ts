import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Aluno } from "./Aluno";
import { Length, Matches } from "class-validator";

@Entity("aluno_enderecos")
export class Aluno_Endereco {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  @Length(8, 8, { message: "O CEP deve conter exatamente 8 dígitos." })
  @Matches(/^\d{8}$/, { message: "O CEP deve conter apenas números." })
  cep: string;

  @Column({ nullable: false })
  cidade: string;

  @Column({ nullable: false })
  bairro: string;

  @Column({ nullable: false })
  rua: string;

  @Column({ nullable: false })
  numero: number;

  @OneToOne(() => Aluno, (aluno) => aluno.aluno_endereco)
  aluno: Aluno;
}
