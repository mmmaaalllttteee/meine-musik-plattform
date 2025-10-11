import { Injectable } from '@nestjs/common';

interface Task {
  id: string;
  title: string;
  status: string;
  position: number;
  boardId: string;
}

@Injectable()
export class TasksService {
  private readonly tasks: Task[] = [
    { id: '1', title: 'Mastering finalisieren', status: 'In Arbeit', position: 1, boardId: 'demo-board' },
    { id: '2', title: 'Video Shoot planen', status: 'Geplant', position: 1, boardId: 'demo-board' }
  ];

  list(boardId: string) {
    return this.tasks.filter((task) => task.boardId === boardId).sort((a, b) => a.position - b.position);
  }

  move(taskId: string, status: string, position: number) {
    const task = this.tasks.find((item) => item.id === taskId);
    if (!task) return null;
    task.status = status;
    task.position = position;
    return task;
  }
}
