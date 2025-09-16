import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1758065880416 implements MigrationInterface {
    name = 'Default1758065880416'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "aluno_processos" ("id" SERIAL NOT NULL, "liberado" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_e264d35b33f4d921bf6333ebfbe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "aluno_documentos" DROP COLUMN "comprovante_matricula"`);
        await queryRunner.query(`ALTER TABLE "aluno_documentos" DROP COLUMN "atestado_frequencia"`);
        await queryRunner.query(`ALTER TABLE "aluno_documentos" DROP COLUMN "liberado"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "aluno_documentos" ADD "liberado" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "aluno_documentos" ADD "atestado_frequencia" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "aluno_documentos" ADD "comprovante_matricula" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "aluno_processos"`);
    }

}
