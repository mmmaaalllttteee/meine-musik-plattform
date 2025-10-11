import type { KPIWidgetProps } from '@/components/kpi-widget';

export const kpiTiles: KPIWidgetProps[] = [
  {
    title: 'Spotify Streams (28d)',
    value: 1245800,
    delta: 12.4,
    points: [
      { label: 'KW1', value: 820000 },
      { label: 'KW2', value: 932000 },
      { label: 'KW3', value: 1050000 },
      { label: 'KW4', value: 1245800 }
    ]
  },
  {
    title: 'YouTube Watchtime',
    value: 84520,
    delta: -3.2,
    points: [
      { label: 'KW1', value: 92000 },
      { label: 'KW2', value: 87000 },
      { label: 'KW3', value: 86000 },
      { label: 'KW4', value: 84520 }
    ]
  },
  {
    title: 'TikTok Views',
    value: 2210000,
    delta: 32.1,
    points: [
      { label: 'KW1', value: 1200000 },
      { label: 'KW2', value: 1500000 },
      { label: 'KW3', value: 1980000 },
      { label: 'KW4', value: 2210000 }
    ]
  },
  {
    title: 'Instagram Reach',
    value: 452000,
    delta: 8.8,
    points: [
      { label: 'KW1', value: 310000 },
      { label: 'KW2', value: 334000 },
      { label: 'KW3', value: 420000 },
      { label: 'KW4', value: 452000 }
    ]
  }
];
