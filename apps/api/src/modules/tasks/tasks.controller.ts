import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasks: TasksService) {}

  @Get('board/:boardId')
  list(@Param('boardId') boardId: string) {
    return this.tasks.list(boardId);
  }

  @Post(':taskId/move')
  move(@Param('taskId') taskId: string, @Body() body: { status: string; position: number }) {
    return this.tasks.move(taskId, body.status, body.position);
  }
}
