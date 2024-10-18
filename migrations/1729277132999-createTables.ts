import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTables1729277132999 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`user\` (
                \`id\` CHAR(36) PRIMARY KEY NOT NULL,
                \`firstName\` VARCHAR(50) NOT NULL,
                \`lastName\` VARCHAR(50) NOT NULL,
                \`email\` VARCHAR(100) NOT NULL UNIQUE,
                \`password\` VARCHAR(100) NOT NULL
            )
        `);

        await queryRunner.query(`
            CREATE TABLE \`post\` (
                \`id\` CHAR(36) PRIMARY KEY NOT NULL,
                \`title\` VARCHAR(255) NOT NULL,
                \`description\` TEXT NOT NULL,
                \`date\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`userId\` CHAR(36),
                CONSTRAINT \`FK_post_user\` FOREIGN KEY (\`userId\`) REFERENCES \`user\` (\`id\`) ON DELETE CASCADE
            )
        `);

        await queryRunner.query(`
            CREATE TABLE \`likes\` (
                \`userId\` CHAR(36) NOT NULL,
                \`postId\` CHAR(36) NOT NULL,
                PRIMARY KEY (\`userId\`, \`postId\`),
                CONSTRAINT \`FK_likes_user\` FOREIGN KEY (\`userId\`) REFERENCES \`user\` (\`id\`) ON DELETE CASCADE,
                CONSTRAINT \`FK_likes_post\` FOREIGN KEY (\`postId\`) REFERENCES \`post\` (\`id\`) ON DELETE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE `likes`');
        await queryRunner.query('DROP TABLE `post`');
        await queryRunner.query('DROP TABLE `user`');
    }
}
