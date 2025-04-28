import { CareType } from "src/care-schedule/care-schedule.entity";
import { MigrationInterface, QueryRunner } from "typeorm";

export class CareSchedules1745823346711 implements MigrationInterface {
    
    private careTypeEnumName = 'care_schedules_caretype_enum';
    public async up(queryRunner: QueryRunner): Promise<void> {
        const careTypeValues = Object.values(CareType).map(value => `'${value}'`).join(', ');
        // Menggunakan DO $$ BEGIN ... END $$; untuk membuat tipe ENUM secara kondisional
        await queryRunner.query(`DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = '${this.careTypeEnumName}') THEN CREATE TYPE ${this.careTypeEnumName} AS ENUM(${careTypeValues}); END IF; END $$;`);

        // 2. Buat tabel 'care_schedules' menggunakan raw SQL (mirip referensi posts)
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS care_schedules (
                id SERIAL PRIMARY KEY,
                -- Kolom Foreign Key untuk relasi User (INTEGER seperti di referensi)
                "userId" INTEGER NOT NULL,
                -- Kolom untuk nama hewan
                "petName" VARCHAR NOT NULL,
                -- Kolom untuk tipe perawatan, menggunakan ENUM kustom
                "careType" ${this.careTypeEnumName} NOT NULL,
                -- Kolom untuk jadwal (TIMESTAMP WITHOUT TIME ZONE seperti di referensi)
                "scheduledAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
                -- Kolom untuk catatan (TEXT seperti di referensi)
                notes TEXT NULL,
                -- Kolom timestamp pembuatan (TIMESTAMP WITHOUT TIME ZONE seperti di referensi)
                "createdAt" TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
                -- Kolom timestamp pembaruan (TIMESTAMP WITHOUT TIME ZONE seperti di referensi)
                "updatedAt" TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,

                -- Definisi Foreign Key Constraint (nama sederhana seperti di referensi)
                CONSTRAINT fk_care_schedules_user
                    FOREIGN KEY("userId")
                    REFERENCES users(id) -- Pastikan nama tabel 'users' dan kolom 'id' benar
                    ON DELETE CASCADE
                    ON UPDATE CASCADE -- Ditambahkan untuk konsistensi jika diperlukan
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS care_schedules;`);

        await queryRunner.query(`DROP TYPE IF EXISTS ${this.careTypeEnumName};`);
    }

}
