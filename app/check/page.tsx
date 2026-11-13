"use client";
import Link from "next/link";
import { useState } from "react";
import { STRUCTURES, detectStructures, norm } from "@/data/structures";
import { checkAccuracy, checkSignOff, type Issue } from "@/data/errorRules";

type Kind = "T1F" | "T1I" | "T2";

export default function Check() {
  const [text, setText] = useState("");
  const [kind, setKind] = useState<Kind>("T1F");
  const [out, setOut] = useState<null | { words: number; used: string[]; perSentence: { s: string; issues: Issue[] }[]; letter: Issue[]; repeated: [string, number][] }>(null);

  const run = () => {
    const t = text.trim();
    if (!t) return;
    const words = t.split(/\s+/).filter(Boolean).length;
    const sentences = norm(t).split(/(?<=[.!?])\s+|\n+/).map((s) => s.trim()).filter((s) => s.length > 2);
    const formal = kind !== "T1I";
    const perSentence = sentences.map((s) => ({ s, issues: checkAccuracy(s, formal) })).filter((x) => x.issues.length);
    const freq: Record<string, number> = {};
    for (const w of t.toLowerCase().match(/\b(very|really|good|bad|big|thing|things|because|also|so|but|important|people|a lot|get|got|nice)\b/g) ?? [])
      freq[w] = (freq[w] ?? 0) + 1;
    const repeated = Object.entries(freq).filter(([, n]) => n >= 3).sort((a, b) => b[1] - a[1]);
    setOut({ words, used: detectStructures(t), perSentence, letter: kind === "T2" ? [] : checkSignOff(t), repeated });
  };

  const target = kind === "T2" ? 250 : 150;
  const relevant = STRUCTURES.filter((s) => (kind === "T2" ? s.task !== "T1" : s.task !== "T2"));

  return (
    <main className="wrap stack">
      <h1>Check my writing</h1>
      <p className="muted">Paste a full letter or essay. You&rsquo;ll see which structures you used (range), likely errors (accuracy) and overused words. This is a heuristic check, not an official band score.</p>
      <div className="chips">
        {([["T1F", "Formal / semi-formal letter"], ["T1I", "Informal letter"], ["T2", "Task 2 essay"]] as const).map(([k, l]) => (
          <button key={k} className={`chip ${kind === k ? "on" : ""}`} onClick={() => setKind(k)}>{l}</button>
        ))}
      </div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} style={{ minHeight: 260 }} placeholder={kind === "T2" ? "Paste your essay…" : "Dear Sir or Madam, …"} />
      <button className="btn primary" onClick={run} disabled={!text.trim()}>Analyse</button>

      {out && (
        <div className="stack">
          <div className="card">
            <div className="row between">
              <b>Word count</b>
              <span className={out.words >= target ? "ok" : "no"}>{out.words} / {target}+</span>
            </div>
            {out.words < target && <p className="small muted" style={{ marginTop: 6 }}>Under the minimum: you lose Task Achievement marks.</p>}
          </div>

          <div className="card stack">
            <h2>Grammatical range: {out.used.length} structures</h2>
            <p className="small muted">For Band 7+, aim for at least 5–6 different complex structures, used naturally.</p>
            <div className="stack" style={{ gap: 4 }}>
              {relevant.map((s) => {
                const on = out.used.includes(s.id);
                return (
                  <div key={s.id} className="row between small" style={{ marginTop: 4 }}>
                    <span className={on ? "ok" : "muted"}>{on ? "✓" : "○"} {s.name}</span>
                    {!on && <Link href={`/practice?mode=guided&s=${s.id}`} className="small">practise</Link>}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card stack">
            <h2>Accuracy: {out.perSentence.reduce((a, x) => a + x.issues.length, 0) + out.letter.length} possible issues</h2>
            {out.letter.map((i) => <div key={i.id} className="issue bad small"><b>Sign-off:</b> {i.msg} → {i.fix}</div>)}
            {out.perSentence.length === 0 && out.letter.length === 0 && <div className="ok small">No common errors detected ✓ (still proofread articles and verb tenses yourself)</div>}
            {out.perSentence.map((x, n) => (
              <div key={n} className="small">
                <div className="muted" style={{ marginBottom: 4 }}>{x.s}</div>
                {x.issues.map((i) => (
                  <div key={i.id} className="issue bad" style={{ marginBottom: 4 }}><b>&ldquo;{i.match}&rdquo;</b>: {i.msg} <span className="muted">→ {i.fix}</span></div>
                ))}
              </div>
            ))}
          </div>

          {out.repeated.length > 0 && (
            <div className="card">
              <h2>Overused words</h2>
              <p className="small">{out.repeated.map(([w, n]) => `${w} ×${n}`).join(" · ")}</p>
              <Link href="/vocab" className="small">Find stronger alternatives in Words →</Link>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
