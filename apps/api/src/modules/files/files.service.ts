import { Injectable } from '@nestjs/common';

interface FileRecord {
  id: string;
  projectId: string;
  name: string;
  size: number;
  mime: string;
}

@Injectable()
export class FilesService {
  private readonly files: FileRecord[] = [
    { id: 'file-1', projectId: 'demo-project', name: 'presskit.pdf', size: 1_024_000, mime: 'application/pdf' }
  ];

  list(projectId: string) {
    return this.files.filter((file) => file.projectId === projectId);
  }
}
