import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1745020527219 implements MigrationInterface {
    name = 'Default1745020527219'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "aluno_responsaveis" ADD CONSTRAINT "UQ_c3edafc928922e4c7bdc1dfb9c5" UNIQUE ("cpf_mae")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "aluno_responsaveis" DROP CONSTRAINT "UQ_c3edafc928922e4c7bdc1dfb9c5"`);
    }

}
