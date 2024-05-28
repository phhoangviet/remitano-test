import { MigrationInterface, QueryRunner } from 'typeorm';

export class dataAppUpdateTable1716887521471 implements MigrationInterface {
  name = 'dataAppUpdateTable1716887521471';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_notifications" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "user_notifications" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_notifications" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "user_notifications" DROP COLUMN "createdAt"`);
  }
}
