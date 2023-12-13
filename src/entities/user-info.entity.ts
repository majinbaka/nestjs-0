import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('user_infos')
export class UserInfo {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  userId: string;

  @Column()
  level: string;

  @Column()
  dateOfBirth: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
