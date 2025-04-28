// src/user/user.entity.ts
import { CareSchedule } from 'src/care-schedule/care-schedule.entity';
import { HealthRecord } from 'src/health-record/health-record.entity';
import { Pet } from 'src/pet/pet.entity'; // <-- Import Pet
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany, // <-- Import OneToMany
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ unique: true }) // Email should be unique
  email: string;

  @Column()
  password_hash: string;

  @Column({ nullable: true }) // Make optional
  profile_picture: string;

  @Column({ nullable: true }) // Make optional
  bio: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relasi One-to-Many dengan Pet
  // Satu User bisa memiliki banyak Pet
  @OneToMany(() => Pet, (pet) => pet.user) // <-- Tambahkan relasi
  pets: Pet[]; // <-- Tambahkan properti pets

  @OneToMany(() => CareSchedule, careSchedule => careSchedule.user) // Relasi dengan CareSchedule
    careSchedules: CareSchedule[];

  @OneToMany(() => HealthRecord, healthRecord => healthRecord.user) // Relasi dengan HealthRecord
    healthRecords: HealthRecord[]; 
}