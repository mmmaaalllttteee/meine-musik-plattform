import { Injectable } from '@nestjs/common';

@Injectable()
export class BoardsService {
  private readonly boards: Record<string, unknown>[] = [
    {
      id: 'demo-board',
      name: 'Album Release',
      columns: ['Geplant', 'In Arbeit', 'Live'],
      projectId: 'demo-project'
    }
  ];

  findByProject(projectId: string) {
    return this.boards.filter((board) => board.projectId === projectId);
  }
}
