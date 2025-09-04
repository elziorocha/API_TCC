import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1756955389894 implements MigrationInterface {
    name = 'Default1756955389894'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "alunos" ADD "tokenVersion" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "alunos" DROP COLUMN "tokenVersion"`);
    }

}
