"use client";
import { useEffect, useState, useCallback } from "react";

export type Card = { box: number; due: number; seen: number; ok: number; last?: string };
export type Progress = {
  ex: Record<string, Card>;
  vocab: Record<string, "star" | "known">;
  fixes: Record<string, number>;
  days: Record<string, number>; // yyyy-mm-dd -> answers
  answers: Record<string, string>; // last answer per exercise
  typing: { n: number; best: number; wpmSum: number; accSum: number; memN: number; memAccSum: number };
};

const KEY = "ielts-grammar-gym:v1";
const EMPTY_TYPING = { n: 0, best: 0, wpmSum: 0, accSum: 0, memN: 0, memAccSum: 0 };
const EMPTY: Progress = { ex: {}, vocab: {}, fixes: {}, days: {}, answers: {}, typing: EMPTY_TYPING };
const DAY = 86_400_000;
export const INTERVALS = [0, 1, 3, 7, 14, 30]; // days per Leitner box

export function load(): Progress {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw);
    return { ...EMPTY, ...parsed, typing: { ...EMPTY_TYPING, ...(parsed.typing ?? {}) } };
  } catch {
    return EMPTY;
  }
}

function save(p: Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {}
  window.dispatchEvent(new Event("igg-progress"));
}

export function today(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

export function useProgress() {
  const [p, setP] = useState<Progress>(EMPTY);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setP(load());
    setReady(true);
    const on = () => setP(load());
    window.addEventListener("igg-progress", on);
    window.addEventListener("storage", on);
    return () => {
      window.removeEventListener("igg-progress", on);
      window.removeEventListener("storage", on);
    };
  }, []);
  const update = useCallback((fn: (p: Progress) => Progress) => {
    const next = fn(load());
    save(next);
    setP(next);
  }, []);
  return { p, update, ready };
}

/** rating: 0 = again, 1 = good, 2 = easy */
export function rate(p: Progress, id: string, rating: 0 | 1 | 2, answer: string): Progress {
  const prev = p.ex[id] ?? { box: 0, due: 0, seen: 0, ok: 0 };
  const box = rating === 0 ? 0 : Math.min(5, prev.box + rating);
  const due = rating === 0 ? Date.now() + 10 * 60_000 : Date.now() + INTERVALS[box] * DAY;
  const t = today();
  return {
    ...p,
    ex: { ...p.ex, [id]: { box, due, seen: prev.seen + 1, ok: prev.ok + (rating > 0 ? 1 : 0), last: t } },
    days: { ...p.days, [t]: (p.days[t] ?? 0) + 1 },
    answers: { ...p.answers, [id]: answer },
  };
}

export function logTyping(p: Progress, r: { wpm?: number; acc: number; memory: boolean }): Progress {
  const t = today();
  const ty = { ...p.typing };
  if (r.memory) {
    ty.memN += 1;
    ty.memAccSum += r.acc;
  } else {
    ty.n += 1;
    ty.accSum += r.acc;
    ty.wpmSum += r.wpm ?? 0;
    ty.best = Math.max(ty.best, r.wpm ?? 0);
  }
  return { ...p, typing: ty, days: { ...p.days, [t]: (p.days[t] ?? 0) + 1 } };
}

export function streak(days: Record<string, number>): number {
  let n = 0;
  const d = new Date();
  if (!days[today(d)]) d.setDate(d.getDate() - 1);
  while (days[today(d)]) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

export function exportJson(): string {
  return JSON.stringify(load(), null, 2);
}
export function importJson(s: string) {
  const parsed = JSON.parse(s);
  save({ ...EMPTY, ...parsed });
}
export function resetAll() {
  save(EMPTY);
}
