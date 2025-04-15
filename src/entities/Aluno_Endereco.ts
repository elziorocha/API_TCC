import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Aluno } from "./Aluno";

@Entity("aluno_enderecos")
export class Aluno_Endereco {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
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
