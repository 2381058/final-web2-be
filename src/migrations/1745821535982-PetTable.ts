import { MigrationInterface, QueryRunner } from "typeorm";

export class PetTable1745821535982 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE pets (
                id SERIAL PRIMARY KEY,
                name VARCHAR NOT NULL,
                type VARCHAR NOT NULL,
                age INT NOT NULL,
                "photoUrl" VARCHAR NULL, -- Use quotes if column name has uppercase chars or is reserved keyword
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
                "userId" INT NOT NULL, -- Foreign key column

                CONSTRAINT fk_pets_user -- Naming the foreign key constraint
                    FOREIGN KEY("userId")
                    REFERENCES users(id) -- Assuming the users table is named 'users' and primary key is 'id'
                    ON DELETE CASCADE -- If a user is deleted, their pets are also deleted
                    ON UPDATE CASCADE -- If a user's id is updated, update it here too
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS pets;`);
    }

}
