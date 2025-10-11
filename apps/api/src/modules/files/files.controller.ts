import { Controller, Get, Param } from '@nestjs/common';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly files: FilesService) {}

  @Get('project/:projectId')
  list(@Param('projectId') projectId: string) {
    return this.files.list(projectId);
  }
}
