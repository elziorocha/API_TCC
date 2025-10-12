import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1760301979625 implements MigrationInterface {
    name = 'Default1760301979625'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "aluno_matriculas" RENAME COLUMN "grau_scolaridade" TO "grau_escolaridade"`);
        await queryRunner.query(`ALTER TYPE "public"."aluno_matriculas_grau_scolaridade_enum" RENAME TO "aluno_matriculas_grau_escolaridade_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."aluno_matriculas_grau_escolaridade_enum" RENAME TO "aluno_matriculas_grau_scolaridade_enum"`);
        await queryRunner.query(`ALTER TABLE "aluno_matriculas" RENAME COLUMN "grau_escolaridade" TO "grau_scolaridade"`);
    }

}
