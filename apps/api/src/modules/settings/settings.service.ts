import { Injectable } from '@nestjs/common';

@Injectable()
export class SettingsService {
  updatePreferences(userId: string, preferences: Record<string, unknown>) {
    return { userId, preferences, updatedAt: new Date().toISOString() };
  }
}
