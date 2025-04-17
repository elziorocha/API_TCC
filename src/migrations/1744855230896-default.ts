import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1744855230896 implements MigrationInterface {
    name = 'Default1744855230896'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."aluno_documentos_tipo_cartao_enum" AS ENUM('EDUCARD', 'VEM')`);
        await queryRunner.query(`CREATE TABLE "aluno_documentos" ("id" SERIAL NOT NULL, "rg" character varying NOT NULL, "cpf" character varying NOT NULL, "orgao_emissor" character varying NOT NULL, "comprovante_matricula" character varying NOT NULL, "atestado_frequencia" character varying NOT NULL, "tipo_cartao" "public"."aluno_documentos_tipo_cartao_enum" NOT NULL, CONSTRAINT "UQ_27836b80eb032905f279a75e4e4" UNIQUE ("rg"), CONSTRAINT "UQ_85b0ac0d5b6a1cd0a48591cc597" UNIQUE ("cpf"), CONSTRAINT "PK_be051b688189c869c3d79a3708d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "aluno_responsaveis" ("id" SERIAL NOT NULL, "cpf_mae" character varying NOT NULL, "nome_mae" text NOT NULL, "nome_pai" text NOT NULL, "nome_responsavel" text NOT NULL, CONSTRAINT "PK_0272bbd0b744706557b50e4a04a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "alunos" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "senha" character varying NOT NULL, "nome" text NOT NULL, "data_nascimento" date NOT NULL, "criado_em" TIMESTAMP NOT NULL, "aluno_documento_id" integer, "aluno_endereco_id" integer, "aluno_responsavel_id" integer, CONSTRAINT "UQ_1f9a8f3f4e5a314a2d7f828a605" UNIQUE ("email"), CONSTRAINT "REL_7de9d01dc0215c578c0cd89c0d" UNIQUE ("aluno_documento_id"), CONSTRAINT "REL_067d2ce5fbb92c0e1198e00cb4" UNIQUE ("aluno_endereco_id"), CONSTRAINT "REL_94c7b5ba1893fd634f91ee5f7a" UNIQUE ("aluno_responsavel_id"), CONSTRAINT "PK_0090f2d8573e71e8e4e274db905" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "aluno_enderecos" ("id" SERIAL NOT NULL, "cep" character varying NOT NULL, "cidade" character varying NOT NULL, "bairro" character varying NOT NULL, "rua" character varying NOT NULL, "numero" integer NOT NULL, CONSTRAINT "PK_dfe60aed2caea1d39c4a766fafe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "alunos" ADD CONSTRAINT "FK_7de9d01dc0215c578c0cd89c0d2" FOREIGN KEY ("aluno_documento_id") REFERENCES "aluno_documentos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "alunos" ADD CONSTRAINT "FK_067d2ce5fbb92c0e1198e00cb48" FOREIGN KEY ("aluno_endereco_id") REFERENCES "aluno_enderecos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "alunos" ADD CONSTRAINT "FK_94c7b5ba1893fd634f91ee5f7aa" FOREIGN KEY ("aluno_responsavel_id") REFERENCES "aluno_responsaveis"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "alunos" DROP CONSTRAINT "FK_94c7b5ba1893fd634f91ee5f7aa"`);
        await queryRunner.query(`ALTER TABLE "alunos" DROP CONSTRAINT "FK_067d2ce5fbb92c0e1198e00cb48"`);
        await queryRunner.query(`ALTER TABLE "alunos" DROP CONSTRAINT "FK_7de9d01dc0215c578c0cd89c0d2"`);
        await queryRunner.query(`DROP TABLE "aluno_enderecos"`);
        await queryRunner.query(`DROP TABLE "alunos"`);
        await queryRunner.query(`DROP TABLE "aluno_responsaveis"`);
        await queryRunner.query(`DROP TABLE "aluno_documentos"`);
        await queryRunner.query(`DROP TYPE "public"."aluno_documentos_tipo_cartao_enum"`);
    }

}
