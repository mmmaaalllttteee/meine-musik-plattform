import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SharesService } from './shares.service';

@Controller('shares')
export class SharesController {
  constructor(private readonly shares: SharesService) {}

  @Post()
  create(@Body() body: { resourceType: string; resourceId: string; scope: 'view' | 'comment' | 'edit' }) {
    return this.shares.create(body.resourceType, body.resourceId, body.scope);
  }

  @Get(':token')
  resolve(@Param('token') token: string) {
    return this.shares.findByToken(token);
  }
}
