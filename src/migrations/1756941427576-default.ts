import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1756941427576 implements MigrationInterface {
    name = 'Default1756941427576'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "aluno_matriculas" DROP CONSTRAINT "FK_a4f19a7f0f453c85b3c28b00fb0"`);
        await queryRunner.query(`ALTER TABLE "aluno_matriculas" DROP COLUMN "serie_ou_periodo"`);
        await queryRunner.query(`ALTER TABLE "aluno_matriculas" ADD "serie_ou_periodo" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "aluno_matriculas" ALTER COLUMN "alunoId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "aluno_matriculas" ADD CONSTRAINT "FK_a4f19a7f0f453c85b3c28b00fb0" FOREIGN KEY ("alunoId") REFERENCES "alunos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "aluno_matriculas" DROP CONSTRAINT "FK_a4f19a7f0f453c85b3c28b00fb0"`);
        await queryRunner.query(`ALTER TABLE "aluno_matriculas" ALTER COLUMN "alunoId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "aluno_matriculas" DROP COLUMN "serie_ou_periodo"`);
        await queryRunner.query(`ALTER TABLE "aluno_matriculas" ADD "serie_ou_periodo" character NOT NULL`);
        await queryRunner.query(`ALTER TABLE "aluno_matriculas" ADD CONSTRAINT "FK_a4f19a7f0f453c85b3c28b00fb0" FOREIGN KEY ("alunoId") REFERENCES "alunos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
