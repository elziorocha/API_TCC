import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1756938467975 implements MigrationInterface {
    name = 'Default1756938467975'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "alunos" DROP CONSTRAINT "FK_55a68eee09af8a13017f56e8412"`);
        await queryRunner.query(`ALTER TABLE "alunos" DROP CONSTRAINT "UQ_55a68eee09af8a13017f56e8412"`);
        await queryRunner.query(`ALTER TABLE "alunos" DROP COLUMN "aluno_matricula_id"`);
        await queryRunner.query(`ALTER TABLE "aluno_matriculas" ADD "alunoId" integer`);
        await queryRunner.query(`ALTER TABLE "aluno_matriculas" ADD CONSTRAINT "FK_a4f19a7f0f453c85b3c28b00fb0" FOREIGN KEY ("alunoId") REFERENCES "alunos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "aluno_matriculas" DROP CONSTRAINT "FK_a4f19a7f0f453c85b3c28b00fb0"`);
        await queryRunner.query(`ALTER TABLE "aluno_matriculas" DROP COLUMN "alunoId"`);
        await queryRunner.query(`ALTER TABLE "alunos" ADD "aluno_matricula_id" integer`);
        await queryRunner.query(`ALTER TABLE "alunos" ADD CONSTRAINT "UQ_55a68eee09af8a13017f56e8412" UNIQUE ("aluno_matricula_id")`);
        await queryRunner.query(`ALTER TABLE "alunos" ADD CONSTRAINT "FK_55a68eee09af8a13017f56e8412" FOREIGN KEY ("aluno_matricula_id") REFERENCES "aluno_matriculas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
