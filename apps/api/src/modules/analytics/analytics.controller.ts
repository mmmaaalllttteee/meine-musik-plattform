import { Controller, Get, Param } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  @Get(':projectId/widgets')
  widgets(@Param('projectId') projectId: string) {
    return this.analytics.list(projectId);
  }
}
