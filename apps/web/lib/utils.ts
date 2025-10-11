import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatNumber = (value: number) =>
  new Intl.NumberFormat('de-DE', { notation: 'compact', maximumFractionDigits: 1 }).format(value);

export const formatDate = (date: string | Date) =>
  new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium' }).format(new Date(date));
