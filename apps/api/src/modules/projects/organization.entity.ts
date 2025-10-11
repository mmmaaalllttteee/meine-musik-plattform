import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Project } from './project.entity';
import { User } from '../auth/user.entity';

@Entity({ name: 'organizations' })
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string;

  @Column({ name: 'billing_plan', default: 'free' })
  billingPlan!: string;

  @Column({ type: 'jsonb', nullable: true })
  settings?: Record<string, unknown>;

  @OneToMany(() => Project, (project) => project.organization)
  projects?: Project[];

  @OneToMany(() => User, (user) => user.organization)
  users?: User[];
}
