import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1758148428929 implements MigrationInterface {
    name = 'Default1758148428929'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "aluno_processos" DROP CONSTRAINT "FK_b73be328e2adff0a08beff26116"`);
        await queryRunner.query(`ALTER TABLE "aluno_processos" RENAME COLUMN "aluno_id" TO "alunoId"`);
        await queryRunner.query(`ALTER TABLE "aluno_processos" ADD CONSTRAINT "FK_93d4cd989ab08310261d92a5e81" FOREIGN KEY ("alunoId") REFERENCES "alunos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "aluno_processos" DROP CONSTRAINT "FK_93d4cd989ab08310261d92a5e81"`);
        await queryRunner.query(`ALTER TABLE "aluno_processos" RENAME COLUMN "alunoId" TO "aluno_id"`);
        await queryRunner.query(`ALTER TABLE "aluno_processos" ADD CONSTRAINT "FK_b73be328e2adff0a08beff26116" FOREIGN KEY ("aluno_id") REFERENCES "alunos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
