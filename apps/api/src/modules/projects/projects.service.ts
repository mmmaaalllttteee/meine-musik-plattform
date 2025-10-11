import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(@InjectRepository(Project) private readonly projects: Repository<Project>) {}

  findAllByOrg(orgId: string) {
    return this.projects.find({ where: { orgId }, order: { createdAt: 'DESC' } });
  }

  async create(orgId: string, userId: string, dto: CreateProjectDto) {
    const project = this.projects.create({
      orgId,
      name: dto.name,
      slug: dto.slug ?? dto.name.toLowerCase().replace(/\s+/g, '-'),
      status: dto.status ?? 'active',
      createdBy: userId,
      settings: {}
    });

    return this.projects.save(project);
  }
}
