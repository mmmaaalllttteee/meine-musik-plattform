import { Controller, Get, Param } from '@nestjs/common';
import { BoardsService } from './boards.service';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boards: BoardsService) {}

  @Get('project/:projectId')
  list(@Param('projectId') projectId: string) {
    return this.boards.findByProject(projectId);
  }
}
