import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';

interface ShareLink {
  id: string;
  token: string;
  resourceType: string;
  resourceId: string;
  scope: 'view' | 'comment' | 'edit';
  expiresAt?: string;
}

@Injectable()
export class SharesService {
  private readonly shares: ShareLink[] = [];

  create(resourceType: string, resourceId: string, scope: ShareLink['scope']) {
    const token = randomBytes(16).toString('hex');
    const share: ShareLink = {
      id: token,
      token,
      resourceType,
      resourceId,
      scope,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString()
    };
    this.shares.push(share);
    return share;
  }

  findByToken(token: string) {
    return this.shares.find((share) => share.token === token);
  }
}
