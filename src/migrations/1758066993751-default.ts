import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1758066993751 implements MigrationInterface {
    name = 'Default1758066993751'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "aluno_processos" ADD "aluno_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "aluno_processos" ADD CONSTRAINT "FK_b73be328e2adff0a08beff26116" FOREIGN KEY ("aluno_id") REFERENCES "alunos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "aluno_processos" DROP CONSTRAINT "FK_b73be328e2adff0a08beff26116"`);
        await queryRunner.query(`ALTER TABLE "aluno_processos" DROP COLUMN "aluno_id"`);
    }

}
