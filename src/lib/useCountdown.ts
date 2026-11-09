import { useEffect, useState } from 'react';
import { content } from '../data/content';

const { year, monthIndex, day } = content.birthday;
const TARGET = new Date(year, monthIndex, day, 0, 0, 0).getTime();

export type Left = { days: number; hours: number; minutes: number; seconds: number; done: boolean };

function calc(): Left {
  const diff = TARGET - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  const s = Math.floor(diff / 1000);
  return { days: Math.floor(s / 86400), hours: Math.floor((s % 86400) / 3600), minutes: Math.floor((s % 3600) / 60), seconds: s % 60, done: false };
}

export const pad2 = (n: number) => String(n).padStart(2, '0');

/** Live time left until the birthday (ticks every second, never breaks after the date). */
export function useCountdown(): Left {
  const [left, setLeft] = useState(calc);
  useEffect(() => {
    const id = window.setInterval(() => setLeft(calc()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return left;
}
