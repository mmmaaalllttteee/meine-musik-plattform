import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalyticsService {
  private readonly widgets = [
    { id: 'spotify-streams', provider: 'spotify', label: 'Spotify Streams (28d)', value: 1245800, delta: 12.4 },
    { id: 'youtube-watchtime', provider: 'youtube', label: 'Watchtime (h)', value: 84520, delta: -3.2 }
  ];

  list(projectId: string) {
    return { projectId, widgets: this.widgets };
  }
}
