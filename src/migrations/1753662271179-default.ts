import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1753662271179 implements MigrationInterface {
    name = 'Default1753662271179'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "aluno_documentos" DROP COLUMN "tipo_cartao"`);
        await queryRunner.query(`DROP TYPE "public"."aluno_documentos_tipo_cartao_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."alunos_tipo_cartao_enum" AS ENUM('EDUCARD', 'VEM')`);
        await queryRunner.query(`ALTER TABLE "alunos" ADD "tipo_cartao" "public"."alunos_tipo_cartao_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "alunos" DROP COLUMN "tipo_cartao"`);
        await queryRunner.query(`DROP TYPE "public"."alunos_tipo_cartao_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."aluno_documentos_tipo_cartao_enum" AS ENUM('EDUCARD', 'VEM')`);
        await queryRunner.query(`ALTER TABLE "aluno_documentos" ADD "tipo_cartao" "public"."aluno_documentos_tipo_cartao_enum" NOT NULL`);
    }

}
