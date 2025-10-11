import { Injectable } from '@nestjs/common';

@Injectable()
export class TemplatesService {
  private readonly templates = [
    { id: 'nda', name: 'NDA (Deutsch)', type: 'contract', version: '1.0.0' },
    { id: 'label-deal', name: 'Label Deal Short Form', type: 'contract', version: '1.1.0' }
  ];

  list() {
    return this.templates;
  }
}
