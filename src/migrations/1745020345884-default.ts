import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1745020345884 implements MigrationInterface {
    name = 'Default1745020345884'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "alunos" ADD "telefone" character varying(11) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "alunos" ADD CONSTRAINT "UQ_157d58fe6dda6fe78fcda194f1f" UNIQUE ("telefone")`);
        await queryRunner.query(`ALTER TABLE "alunos" ALTER COLUMN "criado_em" SET DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "alunos" ALTER COLUMN "criado_em" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "alunos" DROP CONSTRAINT "UQ_157d58fe6dda6fe78fcda194f1f"`);
        await queryRunner.query(`ALTER TABLE "alunos" DROP COLUMN "telefone"`);
    }

}
