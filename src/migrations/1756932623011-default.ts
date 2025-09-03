import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1756932623011 implements MigrationInterface {
    name = 'Default1756932623011'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."aluno_matriculas_grau_scolaridade_enum" AS ENUM('Ensino Fundamental', 'Ensino Médio', 'Ensino Superior', 'Curso Técnico Semestral', 'Curso Técnico Anual', 'CEEBJA e EJAs Fundamental', 'CEEBJA e EJAs Médio')`);
        await queryRunner.query(`CREATE TYPE "public"."aluno_matriculas_turno_enum" AS ENUM('Matutino', 'Vespertino', 'Noturno')`);
        await queryRunner.query(`CREATE TYPE "public"."aluno_matriculas_convenio_enum" AS ENUM('ProUni', 'FIES', 'EducaMais', 'Bolsa')`);
        await queryRunner.query(`CREATE TABLE "aluno_matriculas" ("id" SERIAL NOT NULL, "ano_letivo" integer NOT NULL, "instituicao" character varying NOT NULL, "data_inicio" date NOT NULL, "data_fim" date NOT NULL, "grau_scolaridade" "public"."aluno_matriculas_grau_scolaridade_enum" NOT NULL, "serie_ou_periodo" character(1) NOT NULL, "curso" character varying, "turno" "public"."aluno_matriculas_turno_enum" NOT NULL, "convenio" "public"."aluno_matriculas_convenio_enum", "cgm" character varying, "distancia_instituicao" integer, CONSTRAINT "PK_9101c3325c137d04f8674803965" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "alunos" ADD "aluno_matricula_id" integer`);
        await queryRunner.query(`ALTER TABLE "alunos" ADD CONSTRAINT "UQ_55a68eee09af8a13017f56e8412" UNIQUE ("aluno_matricula_id")`);
        await queryRunner.query(`ALTER TABLE "alunos" ADD CONSTRAINT "FK_55a68eee09af8a13017f56e8412" FOREIGN KEY ("aluno_matricula_id") REFERENCES "aluno_matriculas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "alunos" DROP CONSTRAINT "FK_55a68eee09af8a13017f56e8412"`);
        await queryRunner.query(`ALTER TABLE "alunos" DROP CONSTRAINT "UQ_55a68eee09af8a13017f56e8412"`);
        await queryRunner.query(`ALTER TABLE "alunos" DROP COLUMN "aluno_matricula_id"`);
        await queryRunner.query(`DROP TABLE "aluno_matriculas"`);
        await queryRunner.query(`DROP TYPE "public"."aluno_matriculas_convenio_enum"`);
        await queryRunner.query(`DROP TYPE "public"."aluno_matriculas_turno_enum"`);
        await queryRunner.query(`DROP TYPE "public"."aluno_matriculas_grau_scolaridade_enum"`);
    }

}
