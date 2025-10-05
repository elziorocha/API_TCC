import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1759626871445 implements MigrationInterface {
    name = 'Default1759626871445'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "aluno_processos" ADD "data_criacao" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "aluno_processos" ADD "prazo_final" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "aluno_processos" ALTER COLUMN "formulario_educard" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "aluno_processos" ALTER COLUMN "declaracao_matricula" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "aluno_processos" ALTER COLUMN "comprovante_pagamento" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "aluno_processos" ALTER COLUMN "comprovante_residencia" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "aluno_processos" ALTER COLUMN "rg_frente_ou_verso" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "aluno_processos" ALTER COLUMN "rg_frente_ou_verso" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "aluno_processos" ALTER COLUMN "comprovante_residencia" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "aluno_processos" ALTER COLUMN "comprovante_pagamento" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "aluno_processos" ALTER COLUMN "declaracao_matricula" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "aluno_processos" ALTER COLUMN "formulario_educard" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "aluno_processos" DROP COLUMN "prazo_final"`);
        await queryRunner.query(`ALTER TABLE "aluno_processos" DROP COLUMN "data_criacao"`);
    }

}
