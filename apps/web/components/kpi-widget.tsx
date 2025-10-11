'use client';

import { ResponsiveContainer, AreaChart, Area, Tooltip, XAxis, YAxis } from 'recharts';
import { formatNumber } from '@/lib/utils';

type ChartPoint = { label: string; value: number };

export interface KPIWidgetProps {
  title: string;
  value: number;
  delta: number;
  points: ChartPoint[];
}

export function KPIWidget({ title, value, delta, points }: KPIWidgetProps) {
  const deltaColor = delta >= 0 ? 'text-emerald-400' : 'text-rose-400';
  const deltaSymbol = delta >= 0 ? '+' : '';

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between text-sm text-slate-200/80">
        <span>{title}</span>
        <span className={`font-medium ${deltaColor}`}>
          {deltaSymbol}
          {delta}%
        </span>
      </header>
      <div className="mt-4 text-3xl font-semibold text-white drop-shadow">
        {formatNumber(value)}
      </div>
      <div className="mt-4 h-32">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={points}>
            <defs>
              <linearGradient id={`kpi-${title}-gradient`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7F5AF0" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#7F5AF0" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="label" hide />
            <YAxis hide />
            <Tooltip cursor={false} formatter={(val: number) => formatNumber(val)} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#7F5AF0"
              fillOpacity={1}
              fill={`url(#kpi-${title}-gradient)`}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
