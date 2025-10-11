import { Body, Controller, Param, Patch } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('users')
export class SettingsController {
  constructor(private readonly settings: SettingsService) {}

  @Patch(':userId/preferences')
  updatePreferences(@Param('userId') userId: string, @Body() body: Record<string, unknown>) {
    return this.settings.updatePreferences(userId, body);
  }
}
