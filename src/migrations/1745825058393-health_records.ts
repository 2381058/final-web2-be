import { HealthIssueType } from "src/health-record/health-record.entity";
import { MigrationInterface, QueryRunner } from "typeorm";

export class HealthRecords1745825058393 implements MigrationInterface {
    private healthIssueTypeEnumName = 'health_records_issuetype_enum';

    public async up(queryRunner: QueryRunner): Promise<void> {
        const issueTypeValues = Object.values(HealthIssueType).map(value => `'${value}'`).join(', ');
        // Menggunakan DO $$ BEGIN ... END $$; untuk membuat tipe ENUM secara kondisional
        await queryRunner.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = '${this.healthIssueTypeEnumName}') THEN CREATE TYPE ${this.healthIssueTypeEnumName} AS ENUM(${issueTypeValues}); END IF; END $$;`);

        // 2. Buat tabel 'health_records' menggunakan raw SQL (mirip referensi posts)
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS health_records (
                id SERIAL PRIMARY KEY,
                -- Kolom Foreign Key untuk relasi User (INTEGER seperti di referensi)
                "userId" INTEGER NOT NULL,
                -- Kolom Foreign Key untuk relasi Pet (INTEGER)
                "petId" INTEGER NOT NULL,
                -- Kolom untuk tipe masalah kesehatan, menggunakan ENUM kustom
                "issueType" ${this.healthIssueTypeEnumName} NOT NULL,
                -- Kolom untuk deskripsi (TEXT seperti di referensi)
                description TEXT NOT NULL,
                -- Kolom untuk diagnosis (nullable, TEXT)
                diagnosis TEXT NULL,
                -- Kolom untuk perawatan (nullable, TEXT)
                treatment TEXT NULL,
                -- Kolom untuk tanggal pencatatan (tipe DATE)
                "recordDate" DATE NOT NULL,
                -- Kolom timestamp pembuatan (TIMESTAMP WITHOUT TIME ZONE seperti di referensi)
                "createdAt" TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
                -- Kolom timestamp pembaruan (TIMESTAMP WITHOUT TIME ZONE seperti di referensi)
                "updatedAt" TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,

                -- Definisi Foreign Key Constraint untuk User (nama sederhana seperti di referensi)
                CONSTRAINT fk_health_records_user
                    FOREIGN KEY("userId")
                    REFERENCES users(id) -- Pastikan nama tabel 'users' dan kolom 'id' benar
                    ON DELETE CASCADE, -- ON DELETE seperti di referensi

                -- Definisi Foreign Key Constraint untuk Pet
                CONSTRAINT fk_health_records_pet
                    FOREIGN KEY("petId")
                    REFERENCES pets(id) -- Pastikan nama tabel 'pets' dan kolom 'id' benar
                    ON DELETE CASCADE -- ON DELETE seperti di referensi
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS health_records;`);

        await queryRunner.query(`DROP TYPE IF EXISTS ${this.healthIssueTypeEnumName};`);
    }

}
