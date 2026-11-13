"use client";
import Link from "next/link";
import { useRef } from "react";
import { EXERCISES } from "@/data/exercises";
import { STRUCTURES } from "@/data/structures";
import { useProgress, exportJson, importJson, resetAll, streak, today } from "@/lib/store";

export default function ProgressPage() {
  const { p } = useProgress();
  const file = useRef<HTMLInputElement>(null);

  const last14 = Array.from({ length: 14 }, (_, k) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - k));
    const key = today(d);
    return { key, n: p.days[key] ?? 0, label: d.toLocaleDateString("en-GB", { weekday: "narrow" }) };
  });
  const max = Math.max(5, ...last14.map((d) => d.n));
  const total = Object.values(p.days).reduce((a, b) => a + b, 0);

  const rows = STRUCTURES.map((s) => {
    const ex = EXERCISES.filter((e) => e.structureId === s.id);
    const cards = ex.map((e) => p.ex[e.id]).filter(Boolean);
    const mastery = ex.reduce((a, e) => a + Math.min(3, p.ex[e.id]?.box ?? 0), 0) / (ex.length * 3);
    const acc = cards.length ? cards.reduce((a, c) => a + c.ok, 0) / cards.reduce((a, c) => a + c.seen, 0) : 0;
    return { s, tried: cards.length, n: ex.length, mastery, acc };
  });

  const download = () => {
    const blob = new Blob([exportJson()], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `grammar-gym-progress-${today()}.json`;
    a.click();
  };

  return (
    <main className="wrap stack">
      <h1>Your progress</h1>
      <section className="grid4">
        <div className="card stat"><b>{total}</b><span>answers</span></div>
        <div className="card stat"><b>{streak(p.days)}🔥</b><span>day streak</span></div>
        <div className="card stat"><b>{Object.keys(p.ex).length}</b><span>sentences tried</span></div>
        <div className="card stat"><b>{Object.values(p.ex).filter((c) => c.box >= 3).length}</b><span>mastered</span></div>
      </section>

      <section className="card">
        <h2>Last 14 days</h2>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 90 }}>
          {last14.map((d) => (
            <div key={d.key} style={{ flex: 1, textAlign: "center" }} title={`${d.key}: ${d.n}`}>
              <div style={{ height: `${(d.n / max) * 70}px`, minHeight: d.n ? 3 : 1, background: d.n ? "var(--accent)" : "var(--line)", borderRadius: 4 }} />
              <div className="small muted">{d.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="card stack">
        <h2>Mastery by structure</h2>
        <p className="small muted">Mastered = reached review box 3 (answered well on several spaced repeats).</p>
        {rows.map(({ s, tried, n, mastery, acc }) => (
          <div key={s.id}>
            <div className="row between small">
              <Link href={`/practice?mode=guided&s=${s.id}`}>{s.name}</Link>
              <span className="muted">{tried}/{n} tried{tried ? ` · ${Math.round(acc * 100)}% good` : ""}</span>
            </div>
            <div className="bar" style={{ marginTop: 4 }}><i style={{ width: `${Math.round(mastery * 100)}%` }} /></div>
          </div>
        ))}
      </section>

      <section className="card stack">
        <h2>Backup</h2>
        <p className="small muted">Progress lives in this browser. Export it to move to another device.</p>
        <div className="row">
          <button className="btn" onClick={download}>Export</button>
          <button className="btn" onClick={() => file.current?.click()}>Import</button>
          <input ref={file} type="file" accept="application/json" hidden onChange={async (e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            try { importJson(await f.text()); } catch { alert("That file isn't a valid backup."); }
          }} />
          <span style={{ flex: 1 }} />
          <button className="btn bad" onClick={() => { if (confirm("Delete all progress on this device?")) resetAll(); }}>Reset</button>
        </div>
      </section>
    </main>
  );
}
