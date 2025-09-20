import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1758328329026 implements MigrationInterface {
    name = 'Default1758328329026'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "aluno_processos" RENAME COLUMN "comprovante_residência" TO "comprovante_residencia"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "aluno_processos" RENAME COLUMN "comprovante_residencia" TO "comprovante_residência"`);
    }

}
