"use client";
import Link from "next/link";
import { useState } from "react";
import { STRUCTURES } from "@/data/structures";
import { EXERCISES } from "@/data/exercises";
import { useProgress } from "@/lib/store";

const MAP: [string, string, string[]][] = [
  ["Opening", "Say why you're writing", ["writing-to", "apology"]],
  ["Background", "Tell what happened, in order", ["having-v3", "upon-ing", "only-when", "past-perfect", "passive"]],
  ["Problem / explanation", "Reasons and consequences", ["reason-linkers", "third-conditional", "participle-result", "not-only", "concession"]],
  ["Describing", "Add detail about things and people", ["nondefining-relative"]],
  ["Request", "Ask for action politely", ["grateful-if", "would-possible", "first-conditional"]],
  ["Closing", "Offer contact, end politely", ["should-you", "look-forward"]],
];
const MAP2: [string, string, string[]][] = [
  ["Introduction", "Paraphrase and give your position", ["impersonal", "contrast", "hedging"]],
  ["Body: main idea", "Strong, emphasised topic sentence", ["cleft", "not-only", "hedging"]],
  ["Body: support", "Reasons, results, examples", ["reason-linkers", "participle-result", "the-more", "nondefining-relative", "passive"]],
  ["Body: the other side", "Admit and answer the opposing view", ["concession", "contrast"]],
  ["Body: hypotheticals", "What would / will happen", ["first-conditional", "second-conditional", "third-conditional"]],
  ["Conclusion", "Restate your view, suggest solutions", ["purpose", "first-conditional", "concession"]],
];

const byId = Object.fromEntries(STRUCTURES.map((s) => [s.id, s]));

export default function Learn() {
  const [task, setTask] = useState<"all" | "T1" | "T2">("all");
  const { p } = useProgress();
  const list = STRUCTURES.filter((s) => task === "all" || s.task === task || s.task === "Both");

  return (
    <main className="wrap stack">
      <h1>Learn the structures</h1>
      <p className="muted">Each structure has a natural place. Learn the place, and you&rsquo;ll know when to use it.</p>

      <details className="card" open>
        <summary><h2 style={{ margin: 0 }}>Where they fit: Task 1 letter ▾</h2></summary>
        <FitTable rows={MAP} />
      </details>
      <details className="card">
        <summary><h2 style={{ margin: 0 }}>Where they fit: Task 2 essay ▾</h2></summary>
        <FitTable rows={MAP2} />
      </details>

      <div className="chips" role="tablist">
        {(["all", "T1", "T2"] as const).map((t) => (
          <button key={t} className={`chip ${task === t ? "on" : ""}`} onClick={() => setTask(t)}>
            {t === "all" ? "All" : t === "T1" ? "Task 1 letters" : "Task 2 essays"}
          </button>
        ))}
      </div>

      {list.map((s, i) => {
        const ex = EXERCISES.filter((e) => e.structureId === s.id);
        const m = ex.filter((e) => (p.ex[e.id]?.box ?? 0) >= 3).length;
        return (
          <details key={s.id} id={s.id} className="card">
            <summary>
              <div className="row between">
                <h3 style={{ margin: 0 }}>{i + 1}. {s.name}</h3>
                <span className={`tag ${s.task === "T1" ? "t1" : s.task === "T2" ? "t2" : "both"}`}>{s.task === "Both" ? "T1 + T2" : s.task}</span>
              </div>
              <div className="small muted" style={{ marginTop: 4 }}>{m}/{ex.length} mastered</div>
            </summary>
            <div className="stack" style={{ marginTop: 12 }}>
              <div className="pattern">{s.pattern}</div>
              <p><b>When:</b> {s.when}</p>
              <p className="small"><b>Where:</b> {s.where.join(" · ")}</p>
              <div>
                <b className="small">Examples</b>
                <ul style={{ margin: "4px 0 0", paddingLeft: 18 }}>
                  {s.examples.map((e) => <li key={e}>{e}</li>)}
                </ul>
              </div>
              <div className="issue bad small">
                <div className="wrong">{s.mistake.wrong}</div>
                <div><b>✓ {s.mistake.right}</b></div>
                <div className="muted">{s.mistake.why}</div>
              </div>
              <div className="row">
                <Link className="btn primary" style={{ flex: 1 }} href={`/practice?mode=guided&s=${s.id}`}>Practise this ({ex.length})</Link>
                <Link className="btn" href={`/type?s=${s.id}`}>Type it</Link>
              </div>
            </div>
          </details>
        );
      })}
    </main>
  );
}

function FitTable({ rows }: { rows: [string, string, string[]][] }) {
  return (
    <table style={{ marginTop: 10 }}>
      <thead><tr><th>Part</th><th>Use</th></tr></thead>
      <tbody>
        {rows.map(([part, what, ids]) => (
          <tr key={part}>
            <td><b>{part}</b><div className="small muted">{what}</div></td>
            <td className="small">
              {ids.map((id) => (
                <div key={id}><a href={`#${id}`} onClick={() => { const d = document.getElementById(id) as HTMLDetailsElement | null; if (d) d.open = true; }}>{byId[id].name}</a></div>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
