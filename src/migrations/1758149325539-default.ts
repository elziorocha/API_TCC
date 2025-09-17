import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1758149325539 implements MigrationInterface {
    name = 'Default1758149325539'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "aluno_processos" ADD "alunoMatriculaId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "aluno_processos" ADD CONSTRAINT "FK_861026fbb3fbd37024a0b024d2e" FOREIGN KEY ("alunoMatriculaId") REFERENCES "aluno_matriculas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "aluno_processos" DROP CONSTRAINT "FK_861026fbb3fbd37024a0b024d2e"`);
        await queryRunner.query(`ALTER TABLE "aluno_processos" DROP COLUMN "alunoMatriculaId"`);
    }

}
