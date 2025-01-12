import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ default: 0 })
  totalViews: number;

  @Column({ default: 'beginner' })
  creatorLevel: 'beginner' | 'bronze' | 'silver' | 'gold';

  @Column({ default: 0 })
  reelsCount: number;
}