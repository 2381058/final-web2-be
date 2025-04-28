// src/pet/pet.entity.ts
import { HealthRecord } from 'src/health-record/health-record.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('pets')
export class Pet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string; // e.g., 'Dog', 'Cat', 'Bird'

  @Column()
  age: number;

  @Column({ nullable: true }) // URL or path to the photo
  photoUrl: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;


  @OneToMany(() => HealthRecord, (healthRecord) => healthRecord.pet, {
    cascade: true, // Optional: cascade operations (e.g., delete pet -> delete related health records)
    eager: false,  // Optional: Don't automatically load health records
  })
  healthRecords: HealthRecord[];



  // Relasi Many-to-One dengan User
  // Setiap Pet dimiliki oleh satu User
  @ManyToOne(() => User, (user) => user.pets, { eager: false }) // eager: false agar tidak otomatis load user
  user: User;

  @Column() // Menyimpan user id secara eksplisit untuk query yang lebih mudah
  userId: number;
}