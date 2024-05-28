import { MigrationInterface, QueryRunner } from 'typeorm';

export class dataApp1716886579257 implements MigrationInterface {
  name = 'dataApp1716886579257';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "shared_data" ("id" SERIAL NOT NULL, "title" text NOT NULL, "url" text NOT NULL, "content" text, "created_by_id" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_accd282bee89d94697d4c5d7a18" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "notifications" ("id" SERIAL NOT NULL, "group" text, "ref_id" integer, "ref_code" text, "title" text, "content" text, "url" text, "action" text, "data" jsonb, "created_by_id" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_notifications" ("id" SERIAL NOT NULL, "notification_id" integer NOT NULL, "user_id" integer NOT NULL, "mark_as_read" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_569622b0fd6e6ab3661de985a2b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "shared_data" ADD CONSTRAINT "FK_1010fd5ed69a4d0339740f82abd" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_8abe9303bccd29799a4d435eb03" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_notifications" ADD CONSTRAINT "FK_944431ae979397c8b56a99bf024" FOREIGN KEY ("notification_id") REFERENCES "notifications"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_notifications" DROP CONSTRAINT "FK_944431ae979397c8b56a99bf024"`);
    await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_8abe9303bccd29799a4d435eb03"`);
    await queryRunner.query(`ALTER TABLE "shared_data" DROP CONSTRAINT "FK_1010fd5ed69a4d0339740f82abd"`);
    await queryRunner.query(`DROP TABLE "user_notifications"`);
    await queryRunner.query(`DROP TABLE "notifications"`);
    await queryRunner.query(`DROP TABLE "shared_data"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
