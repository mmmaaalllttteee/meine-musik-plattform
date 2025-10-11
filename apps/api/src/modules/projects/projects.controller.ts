import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projects: ProjectsService) {}

  @Get('organization/:orgId')
  findAll(@Param('orgId') orgId: string) {
    return this.projects.findAllByOrg(orgId);
  }

  @Post(':orgId')
  create(@Param('orgId') orgId: string, @Body() dto: CreateProjectDto) {
    const userId = 'demo-user';
    return this.projects.create(orgId, userId, dto);
  }
}
