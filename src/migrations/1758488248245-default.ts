import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1758488248245 implements MigrationInterface {
    name = 'Default1758488248245'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "aluno_processos" RENAME COLUMN "rf_frente_ou_verso" TO "rg_frente_ou_verso"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "aluno_processos" RENAME COLUMN "rg_frente_ou_verso" TO "rf_frente_ou_verso"`);
    }

}
