import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Organization } from '../projects/organization.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'org_id', type: 'uuid', nullable: true })
  orgId!: string | null;

  @ManyToOne(() => Organization, (organization) => organization.users)
  organization?: Organization;

  @Column({ unique: true })
  email!: string;

  @Column({ name: 'password_hash' })
  passwordHash!: string;

  @Column({ type: 'varchar', length: 120 })
  name!: string;

  @Column({ default: 'collaborator' })
  role!: string;

  @Column({ name: 'twofa_secret', nullable: true })
  twoFactorSecret?: string | null;

  @Column({ type: 'jsonb', nullable: true })
  preferences?: Record<string, unknown>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
