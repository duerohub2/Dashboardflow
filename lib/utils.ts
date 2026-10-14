import type { Account } from "./types";

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function timeUntilReset(resetHour: number): {
  ms: number;
  text: string;
} {
  const now = new Date();
  const next = new Date();
  next.setHours(resetHour, 0, 0, 0);
  if (now >= next) next.setDate(next.getDate() + 1);
  const d = next.getTime() - now.getTime();
  const h = Math.floor(d / 3_600_000);
  const m = Math.floor((d % 3_600_000) / 60_000);
  return { ms: d, text: `${h}j ${m}m` };
}

export function needsReset(a: Account): boolean {
  const now = new Date();
  const last = new Date(a.creditDate + "T00:00:00");
  last.setHours(a.resetHour, 0, 0, 0);
  if (now < last) last.setDate(last.getDate() - 1);
  const next = new Date(last);
  next.setDate(next.getDate() + 1);
  return now >= next;
}

export function timeAgo(ts: number): string {
  const d = Date.now() - ts;
  const m = Math.floor(d / 60_000);
  if (m < 1) return "baru aja";
  if (m < 60) return `${m}m lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}j lalu`;
  return `${Math.floor(h / 24)}h lalu`;
}

export function shortenUrl(url: string): string {
  try {
    const u = new URL(url);
    return u.hostname + (u.search || "");
  } catch {
    return url;
  }
}

export function statusOf(acc: Account): { label: string } {
  const { limit, credits } = acc;
  if (credits <= 0) return { label: "Habis" };
  if (credits <= limit * 0.2) return { label: "Menipis" };
  if (credits <= limit * 0.5) return { label: "Sedang" };
  return { label: "Aman" };
}
