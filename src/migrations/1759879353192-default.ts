import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1759879353192 implements MigrationInterface {
    name = 'Default1759879353192'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "aluno_processos" ADD "formulario_educard_validado" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "aluno_processos" ADD "declaracao_matricula_validado" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "aluno_processos" ADD "comprovante_pagamento_validado" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "aluno_processos" ADD "comprovante_residencia_validado" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "aluno_processos" ADD "rg_frente_ou_verso_validado" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "aluno_processos" DROP COLUMN "rg_frente_ou_verso_validado"`);
        await queryRunner.query(`ALTER TABLE "aluno_processos" DROP COLUMN "comprovante_residencia_validado"`);
        await queryRunner.query(`ALTER TABLE "aluno_processos" DROP COLUMN "comprovante_pagamento_validado"`);
        await queryRunner.query(`ALTER TABLE "aluno_processos" DROP COLUMN "declaracao_matricula_validado"`);
        await queryRunner.query(`ALTER TABLE "aluno_processos" DROP COLUMN "formulario_educard_validado"`);
    }

}
