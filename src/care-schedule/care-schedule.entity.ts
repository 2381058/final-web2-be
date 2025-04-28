import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../user/user.entity'; // Import User entity

export enum CareType {
    VACCINATION = 'Vaccination',
    GROOMING = 'Grooming',
    CHECKUP = 'Checkup',
    // ... tambahkan jenis perawatan lain
}

@Entity('care_schedules')
export class CareSchedule {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.careSchedules) // Relasi dengan User
    user: User;

    @Column()
    petName: string; // Nama hewan peliharaan

    @Column({
        type: 'enum',
        enum: CareType,
    })
    careType: CareType;

    @Column()
    scheduledAt: Date; // Tanggal dan waktu perawatan

    @Column({ nullable: true })
    notes: string; // Catatan tambahan

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}