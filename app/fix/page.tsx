"use client";
import { useEffect, useState } from "react";
import { FIXES } from "@/data/fixes";
import { checkAccuracy } from "@/data/errorRules";
import { useProgress } from "@/lib/store";

const normalise = (s: string) =>
  s.toLowerCase().replace(/[’']/g, "'").replace(/[.,!?;:…"]/g, "").replace(/\s+/g, " ").trim();

function shuffled() {
  const idx = FIXES.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx;
}

export default function Fix() {
  const { p, update } = useProgress();
  const [order, setOrder] = useState<number[]>([]);
  const [k, setK] = useState(0);
  const [text, setText] = useState("");
  const [state, setState] = useState<null | "right" | "close" | "wrong">(null);
  const [score, setScore] = useState({ n: 0, ok: 0 });

  useEffect(() => setOrder(shuffled()), []);
  const idx = order[k];
  const item = idx !== undefined ? FIXES[idx] : undefined;

  useEffect(() => {
    if (item) setText(item.wrong);
  }, [item]);

  const check = () => {
    if (!item) return;
    const n = normalise(text);
    if (item.right.some((r) => normalise(r) === n)) setState("right");
    else if (checkAccuracy(text, true).length === 0 && n !== normalise(item.wrong)) setState("close");
    else setState("wrong");
  };

  const next = () => {
    if (idx === undefined) return;
    const ok = state === "right";
    update((pp) => ({ ...pp, fixes: { ...pp.fixes, [idx]: (pp.fixes[idx] ?? 0) + (ok ? 1 : 0) } }));
    setScore((s) => ({ n: s.n + 1, ok: s.ok + (ok ? 1 : 0) }));
    setState(null);
    if (k + 1 >= order.length) {
      setOrder(shuffled());
      setK(0);
    } else setK(k + 1);
  };

  const fixed = Object.values(p.fixes).filter((v) => v > 0).length;

  return (
    <main className="wrap stack">
      <div className="row between">
        <h1 style={{ margin: 0 }}>Fix the mistake</h1>
        <span className="small muted">{score.ok}/{score.n} this session · {fixed}/{FIXES.length} ever fixed</span>
      </div>
      <p className="muted">Each sentence has one main error, the kind that costs marks for Grammatical Accuracy. Edit it, then check.</p>

      {item && (
        <div className="card stack">
          <div className="small muted">Sentence {k + 1} of {order.length}</div>
          <div className="wrong" style={{ fontSize: "1.1rem" }}>{item.wrong}</div>
          <textarea value={text} onChange={(e) => setText(e.target.value)} disabled={!!state} style={{ minHeight: 80 }}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); state ? next() : check(); } }} />
          {!state ? (
            <div className="row">
              <button className="btn primary" style={{ flex: 1 }} onClick={check}>Check</button>
              <button className="btn" onClick={() => setState("wrong")}>Show answer</button>
            </div>
          ) : (
            <div className="stack">
              {state === "right" && <div className="ok">✓ Correct!</div>}
              {state === "close" && <div className="issue small">Not one of the expected answers, but no common errors were found. Compare it with the model below.</div>}
              {state === "wrong" && <div className="no">✗ Not quite</div>}
              <div className="model">{item.right[0]}</div>
              {item.right.length > 1 && <div className="small muted">Also accepted: {item.right.slice(1).join(" / ")}</div>}
              <div className="small"><b>Rule:</b> {item.tip}</div>
              <button className="btn primary" onClick={next}>Next →</button>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
