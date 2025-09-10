import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1757476704776 implements MigrationInterface {
    name = 'Default1757476704776'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."aluno_matriculas_convenio_enum" RENAME TO "aluno_matriculas_convenio_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."aluno_matriculas_convenio_enum" AS ENUM('Sem Convênio', 'ProUni', 'FIES', 'EducaMais', 'Bolsa')`);
        await queryRunner.query(`ALTER TABLE "aluno_matriculas" ALTER COLUMN "convenio" TYPE "public"."aluno_matriculas_convenio_enum" USING "convenio"::"text"::"public"."aluno_matriculas_convenio_enum"`);
        await queryRunner.query(`DROP TYPE "public"."aluno_matriculas_convenio_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."aluno_matriculas_convenio_enum_old" AS ENUM('ProUni', 'FIES', 'EducaMais', 'Bolsa')`);
        await queryRunner.query(`ALTER TABLE "aluno_matriculas" ALTER COLUMN "convenio" TYPE "public"."aluno_matriculas_convenio_enum_old" USING "convenio"::"text"::"public"."aluno_matriculas_convenio_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."aluno_matriculas_convenio_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."aluno_matriculas_convenio_enum_old" RENAME TO "aluno_matriculas_convenio_enum"`);
    }

}
