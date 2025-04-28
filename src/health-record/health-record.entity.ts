import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../user/user.entity'; // Import User entity
import { Pet } from '../pet/pet.entity'; // Import Pet entity (asumsi sudah ada)

export enum HealthIssueType {
    INJURY = 'Injury',
    ILLNESS = 'Illness',
    VACCINATION = 'Vaccination',
    ALLERGY = 'Allergy',
    OTHER = 'Other',
}

@Entity('health_records')
export class HealthRecord {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.healthRecords) // Relasi dengan User
    user: User;

    @ManyToOne(() => Pet, pet => pet.healthRecords) // Relasi dengan Pet
    pet: Pet;

    @Column({
        type: 'enum',
        enum: HealthIssueType,
    })
    issueType: HealthIssueType;

    @Column()
    description: string;

    @Column({ nullable: true })
    diagnosis: string;

    @Column({ nullable: true })
    treatment: string;

    @Column({ type: 'date' }) // Hanya tanggal, tanpa waktu
    recordDate: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}