export interface ProjectSummary {
  id: string;
  name: string;
  slug: string;
  status: string;
}

export interface ShareLink {
  token: string;
  resourceType: string;
  resourceId: string;
  scope: 'view' | 'comment' | 'edit';
  expiresAt?: string;
}

export interface KPITile {
  id: string;
  label: string;
  value: number;
  delta: number;
}
