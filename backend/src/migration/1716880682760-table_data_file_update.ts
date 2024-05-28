import {MigrationInterface, QueryRunner} from "typeorm";

export class tableDataFileUpdate1716880682760 implements MigrationInterface {
    name = 'tableDataFileUpdate1716880682760'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user_notifications" ADD CONSTRAINT "UQ_569622b0fd6e6ab3661de985a2b" UNIQUE ("id")`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_8abe9303bccd29799a4d435eb03" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_8abe9303bccd29799a4d435eb03"`);
        await queryRunner.query(`ALTER TABLE "user_notifications" DROP CONSTRAINT "UQ_569622b0fd6e6ab3661de985a2b"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "createdAt"`);
    }

}
