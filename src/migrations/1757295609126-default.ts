import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1757295609126 implements MigrationInterface {
    name = 'Default1757295609126'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."aluno_matriculas_turno_enum" RENAME TO "aluno_matriculas_turno_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."aluno_matriculas_turno_enum" AS ENUM('Matutino', 'Vespertino', 'Noturno', 'Integral')`);
        await queryRunner.query(`ALTER TABLE "aluno_matriculas" ALTER COLUMN "turno" TYPE "public"."aluno_matriculas_turno_enum" USING "turno"::"text"::"public"."aluno_matriculas_turno_enum"`);
        await queryRunner.query(`DROP TYPE "public"."aluno_matriculas_turno_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."aluno_matriculas_turno_enum_old" AS ENUM('Matutino', 'Vespertino', 'Noturno')`);
        await queryRunner.query(`ALTER TABLE "aluno_matriculas" ALTER COLUMN "turno" TYPE "public"."aluno_matriculas_turno_enum_old" USING "turno"::"text"::"public"."aluno_matriculas_turno_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."aluno_matriculas_turno_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."aluno_matriculas_turno_enum_old" RENAME TO "aluno_matriculas_turno_enum"`);
    }

}
