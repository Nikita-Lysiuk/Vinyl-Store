import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDatabase1729279090038 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO \`user\` (\`id\`, \`firstName\`, \`lastName\`, \`email\`, \`password\`)
            VALUES 
                (UUID(), 'John', 'Doe', 'john.doe@gmail.com', 'password1'),
                (UUID(), 'Jane', 'Doe', 'jane.doe@gmail.com', 'password2'),
                (UUID(), 'Alice', 'Smith', 'alice.smith@gmail.com', 'password3'),
                (UUID(), 'Bob', 'Smith', 'bob.smith@gmail.com', 'password4'),
                (UUID(), 'Charlie', 'Brown', 'charlie.brown@gmail.com', 'password5'),
                (UUID(), 'Daisy', 'Brown', 'daisy.brown@gmail.com', 'password6'),
                (UUID(), 'Eve', 'Johnson', 'eve.johnson@gmail.com', 'password7'),
                (UUID(), 'Frank', 'Johnson', 'frank.johnson@gmail.com', 'password8'),
                (UUID(), 'Grace', 'Williams', 'grace.williams@gmail.com', 'password9'),
                (UUID(), 'Henry', 'Moore', 'henry.moore@gmail.com', 'password10')
        `);

        await queryRunner.query(`
            INSERT INTO \`post\` (\`id\`, \`title\`, \`description\`, \`date\`, \`userId\`)
            VALUES
            (UUID(), 'Post 1', 'Description for post 1', NOW(), (SELECT \`id\` FROM \`user\` LIMIT 1 OFFSET 0)),
            (UUID(), 'Post 2', 'Description for post 2', NOW(), (SELECT \`id\` FROM \`user\` LIMIT 1 OFFSET 1)),
            (UUID(), 'Post 3', 'Description for post 3', NOW(), (SELECT \`id\` FROM \`user\` LIMIT 1 OFFSET 2)),
            (UUID(), 'Post 4', 'Description for post 4', NOW(), (SELECT \`id\` FROM \`user\` LIMIT 1 OFFSET 3)),
            (UUID(), 'Post 5', 'Description for post 5', NOW(), (SELECT \`id\` FROM \`user\` LIMIT 1 OFFSET 4)),
            (UUID(), 'Post 6', 'Description for post 6', NOW(), (SELECT \`id\` FROM \`user\` LIMIT 1 OFFSET 5)),
            (UUID(), 'Post 7', 'Description for post 7', NOW(), (SELECT \`id\` FROM \`user\` LIMIT 1 OFFSET 6)),
            (UUID(), 'Post 8', 'Description for post 8', NOW(), (SELECT \`id\` FROM \`user\` LIMIT 1 OFFSET 7)),
            (UUID(), 'Post 9', 'Description for post 9', NOW(), (SELECT \`id\` FROM \`user\` LIMIT 1 OFFSET 8)),
            (UUID(), 'Post 10', 'Description for post 10', NOW(), (SELECT \`id\` FROM \`user\` LIMIT 1 OFFSET 9))
        `);

        await queryRunner.query(`
            INSERT INTO \`likes\` (\`userId\`, \`postId\`)
            VALUES
            ((SELECT \`id\` FROM \`user\` WHERE \`email\` = 'john.doe@gmail.com'), (SELECT \`id\` FROM \`post\` WHERE \`title\` = 'Post 1')),
            ((SELECT \`id\` FROM \`user\` WHERE \`email\` = 'jane.doe@gmail.com'), (SELECT \`id\` FROM \`post\` WHERE \`title\` = 'Post 1')),
            ((SELECT \`id\` FROM \`user\` WHERE \`email\` = 'alice.smith@gmail.com'), (SELECT \`id\` FROM \`post\` WHERE \`title\` = 'Post 2')),
            ((SELECT \`id\` FROM \`user\` WHERE \`email\` = 'bob.smith@gmail.com'), (SELECT \`id\` FROM \`post\` WHERE \`title\` = 'Post 2')),
            ((SELECT \`id\` FROM \`user\` WHERE \`email\` = 'charlie.brown@gmail.com'), (SELECT \`id\` FROM \`post\` WHERE \`title\` = 'Post 3')),
            ((SELECT \`id\` FROM \`user\` WHERE \`email\` = 'daisy.brown@gmail.com'), (SELECT \`id\` FROM \`post\` WHERE \`title\` = 'Post 3')),
            ((SELECT \`id\` FROM \`user\` WHERE \`email\` = 'eve.johnson@gmail.com'), (SELECT \`id\` FROM \`post\` WHERE \`title\` = 'Post 4')),
            ((SELECT \`id\` FROM \`user\` WHERE \`email\` = 'frank.johnson@gmail.com'), (SELECT \`id\` FROM \`post\` WHERE \`title\` = 'Post 4')),
            ((SELECT \`id\` FROM \`user\` WHERE \`email\` = 'grace.williams@gmail.com'), (SELECT \`id\` FROM \`post\` WHERE \`title\` = 'Post 5')),
            ((SELECT \`id\` FROM \`user\` WHERE \`email\` = 'henry.moore@gmail.com'), (SELECT \`id\` FROM \`post\` WHERE \`title\` = 'Post 5'))
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DELETE FROM `likes`');
        await queryRunner.query('DELETE FROM `post`');
        await queryRunner.query('DELETE FROM `user`');
    }
}
