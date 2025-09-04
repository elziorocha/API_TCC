import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1756954598174 implements MigrationInterface {
    name = 'Default1756954598174'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "aluno_matriculas" ADD "status_matricula" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "aluno_matriculas" DROP COLUMN "status_matricula"`);
    }

}
