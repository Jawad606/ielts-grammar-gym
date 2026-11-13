"use client";
import Link from "next/link";
import { EXERCISES } from "@/data/exercises";
import { STRUCTURES } from "@/data/structures";
import { VOCAB } from "@/data/vocab";
import { useProgress, streak, today } from "@/lib/store";

export default function Home() {
  const { p, ready } = useProgress();
  const cards = Object.values(p.ex);
  const now = Date.now();
  const due = cards.filter((c) => c.due <= now).length;
  const mastered = cards.filter((c) => c.box >= 3).length;
  const done = cards.length;
  const s = streak(p.days);
  const todayCount = p.days[today()] ?? 0;

  const weakest = STRUCTURES.map((st) => {
    const list = EXERCISES.filter((e) => e.structureId === st.id);
    const score = list.reduce((a, e) => a + (p.ex[e.id]?.box ?? 0), 0) / (list.length * 5);
    return { st, score };
  }).sort((a, b) => a.score - b.score)[0];

  return (
    <main className="wrap stack">
      <header>
        <h1>IELTS Grammar Gym</h1>
        <p className="muted">
          {EXERCISES.length} practice sentences · {STRUCTURES.length} band-7+ structures · {VOCAB.length} words. Works offline.
        </p>
      </header>

      <section className="grid4">
        <div className="card stat"><b>{ready ? done : "–"}</b><span>of {EXERCISES.length} tried</span></div>
        <div className="card stat"><b>{ready ? mastered : "–"}</b><span>mastered</span></div>
        <div className="card stat"><b>{ready ? due : "–"}</b><span>due for review</span></div>
        <div className="card stat"><b>{ready ? s : "–"}🔥</b><span>day streak · {todayCount} today</span></div>
      </section>

      <section className="card stack">
        <h2>Start a session</h2>
        <div className="grid2">
          <Link className="btn primary" href="/practice?mode=choose">Mixed: choose the structure</Link>
          <Link className="btn" href="/practice?mode=guided">Guided practice</Link>
          <Link className="btn" href="/practice?mode=choose&task=T1">Task 1 letters only</Link>
          <Link className="btn" href="/practice?mode=choose&task=T2">Task 2 essays only</Link>
          <Link className="btn" href="/type">Typing: copy sentences</Link>
          <Link className="btn" href="/type?mode=memory">Typing: from memory</Link>
        </div>
        {due > 0 && (
          <Link className="btn good block" href="/practice?mode=choose&due=1">
            Review {due} due sentence{due === 1 ? "" : "s"}
          </Link>
        )}
        {weakest && ready && done > 0 && (
          <p className="small muted">
            Weakest area: <Link href={`/practice?mode=guided&s=${weakest.st.id}`}>{weakest.st.name}</Link>
          </p>
        )}
      </section>

      <section className="card">
        <h2>How to use it</h2>
        <ol className="small" style={{ paddingLeft: 18, margin: 0 }}>
          <li><b>Learn</b>: read when and where each structure fits in a letter or essay.</li>
          <li><b>Practise</b>: the &ldquo;Choose&rdquo; mode hides the structure, so you decide which one fits. That&rsquo;s how you learn <i>when</i> to use it.</li>
          <li><b>Type</b>: copy or recall model sentences to build muscle memory for structures and natural vocabulary.</li>
          <li><b>Fix it</b>: correct common errors (Grammatical Accuracy).</li>
          <li><b>Check</b>: paste a full letter or essay to see your range and possible errors.</li>
          <li>Rate yourself honestly. Sentences come back on a spaced-repetition schedule.</li>
        </ol>
      </section>

      <p className="small muted">
        All sentences are original, written around the themes and letter types that appear in past IELTS GT papers.
        Progress is saved on this device; export it from Stats.
      </p>
    </main>
  );
}
