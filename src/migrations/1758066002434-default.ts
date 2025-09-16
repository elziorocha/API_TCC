import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1758066002434 implements MigrationInterface {
    name = 'Default1758066002434'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "aluno_processos" ADD "formulario_educard" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "aluno_processos" ADD "declaracao_matricula" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "aluno_processos" ADD "comprovante_pagamento" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "aluno_processos" ADD "comprovante_residência" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "aluno_processos" ADD "rf_frente_ou_verso" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "aluno_processos" DROP COLUMN "rf_frente_ou_verso"`);
        await queryRunner.query(`ALTER TABLE "aluno_processos" DROP COLUMN "comprovante_residência"`);
        await queryRunner.query(`ALTER TABLE "aluno_processos" DROP COLUMN "comprovante_pagamento"`);
        await queryRunner.query(`ALTER TABLE "aluno_processos" DROP COLUMN "declaracao_matricula"`);
        await queryRunner.query(`ALTER TABLE "aluno_processos" DROP COLUMN "formulario_educard"`);
    }

}
