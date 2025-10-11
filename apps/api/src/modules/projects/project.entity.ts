import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Organization } from './organization.entity';
import { User } from '../auth/user.entity';

@Entity({ name: 'projects' })
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'org_id', type: 'uuid' })
  orgId!: string;

  @ManyToOne(() => Organization, (organization) => organization.projects)
  organization!: Organization;

  @Column({ type: 'varchar', length: 160 })
  name!: string;

  @Column({ unique: true })
  slug!: string;

  @Column({ default: 'active' })
  status!: string;

  @Column({ type: 'jsonb', nullable: true })
  settings?: Record<string, unknown>;

  @Column({ name: 'created_by', type: 'uuid' })
  createdBy!: string;

  @ManyToOne(() => User)
  creator?: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
