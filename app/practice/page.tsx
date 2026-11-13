"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { EXERCISES } from "@/data/exercises";
import { STRUCTURES, STRUCTURE_BY_ID, uses, detectStructures } from "@/data/structures";
import { checkAccuracy, type Issue } from "@/data/errorRules";
import { CTX_LABEL, type Exercise } from "@/lib/types";
import { useProgress, rate, load } from "@/lib/store";
import AiCheck from "@/components/AiCheck";

type Mode = "choose" | "guided";
type Task = "all" | "T1" | "T2";

function shuffle<T>(a: T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

function buildQueue(task: Task, sid: string, dueOnly: boolean): Exercise[] {
  const p = load();
  const now = Date.now();
  const pool = EXERCISES.filter(
    (e) => (task === "all" || e.ctx.startsWith(task)) && (!sid || e.structureId === sid),
  );
  const due = shuffle(pool.filter((e) => p.ex[e.id] && p.ex[e.id].due <= now));
  if (dueOnly) return due;
  const unseen = shuffle(pool.filter((e) => !p.ex[e.id]));
  const later = pool.filter((e) => p.ex[e.id] && p.ex[e.id].due > now).sort((a, b) => p.ex[a.id].due - p.ex[b.id].due);
  return [...due, ...unseen, ...later];
}

type Result = { target: boolean; others: string[]; issues: Issue[]; basics: string[] };

export default function Practice() {
  const { p, update } = useProgress();
  const [mode, setMode] = useState<Mode>("choose");
  const [task, setTask] = useState<Task>("all");
  const [sid, setSid] = useState("");
  const [dueOnly, setDueOnly] = useState(false);
  const [queue, setQueue] = useState<Exercise[]>([]);
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [res, setRes] = useState<Result | null>(null);
  const [hint, setHint] = useState(false);
  const [session, setSession] = useState({ n: 0, good: 0 });
  const [inited, setInited] = useState(false);
  const ta = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    setMode((q.get("mode") as Mode) || "choose");
    setTask((q.get("task") as Task) || "all");
    setSid(q.get("s") || "");
    setDueOnly(q.get("due") === "1");
    setInited(true);
  }, []);

  useEffect(() => {
    if (!inited) return;
    setQueue(buildQueue(task, sid, dueOnly));
    setI(0);
    setText("");
    setRes(null);
    setHint(false);
  }, [task, sid, dueOnly, inited]);

  const ex = queue[i];
  const st = ex ? STRUCTURE_BY_ID[ex.structureId] : null;
  const showStructure = mode === "guided" || hint || !!res;

  const check = () => {
    if (!ex || !st || !text.trim()) return;
    const t = text.trim();
    const basics: string[] = [];
    if (!/^[A-Z"'‘“]/.test(t)) basics.push("Start the sentence with a capital letter.");
    if (!/[.!?]["'’”)]?$/.test(t)) basics.push("End the sentence with a full stop (or ? / !).");
    if (t.split(/\s+/).length < 6) basics.push("Very short. Try to write a full, natural sentence.");
    setRes({
      target: uses(st, t),
      others: detectStructures(t).filter((d) => d !== st.id),
      issues: checkAccuracy(t, !ex.ctx.startsWith("T1I")),
      basics,
    });
  };

  const giveUp = () => {
    if (!ex || !st) return;
    setRes({ target: false, others: [], issues: [], basics: ["Skipped. Study the model, then try writing it from memory next time."] });
  };

  const next = (r: 0 | 1 | 2) => {
    if (!ex) return;
    update((pp) => rate(pp, ex.id, r, text.trim()));
    setSession((s) => ({ n: s.n + 1, good: s.good + (r > 0 ? 1 : 0) }));
    if (r === 0) {
      // re-insert a few cards later in this session
      setQueue((q) => {
        const c = [...q];
        c.splice(Math.min(c.length, i + 5), 0, ex);
        return c;
      });
    }
    setI((n) => n + 1);
    setText("");
    setRes(null);
    setHint(false);
    setTimeout(() => ta.current?.focus(), 50);
  };

  const suggested: 0 | 1 | 2 | null = res ? (res.target && res.issues.length === 0 && res.basics.length === 0 ? 1 : 0) : null;
  const card = ex ? p.ex[ex.id] : undefined;
  const structOptions = useMemo(() => STRUCTURES.filter((s) => task === "all" || s.task === task || s.task === "Both"), [task]);

  return (
    <main className="wrap stack">
      <div className="row between">
        <h1 style={{ margin: 0 }}>Practise</h1>
        <span className="small muted">Session: {session.good}/{session.n} ✓</span>
      </div>

      <div className="card stack">
        <div className="chips">
          <button className={`chip ${mode === "choose" ? "on" : ""}`} onClick={() => setMode("choose")}>Choose the structure</button>
          <button className={`chip ${mode === "guided" ? "on" : ""}`} onClick={() => setMode("guided")}>Guided</button>
          <span style={{ width: 8 }} />
          {(["all", "T1", "T2"] as const).map((t) => (
            <button key={t} className={`chip ${task === t ? "on" : ""}`} onClick={() => { setTask(t); setSid(""); }}>
              {t === "all" ? "All tasks" : t === "T1" ? "Task 1" : "Task 2"}
            </button>
          ))}
          <button className={`chip ${dueOnly ? "on" : ""}`} onClick={() => setDueOnly((d) => !d)}>Due only</button>
        </div>
        <select value={sid} onChange={(e) => setSid(e.target.value)} aria-label="Structure">
          <option value="">All structures (mixed)</option>
          {structOptions.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      {!ex ? (
        <div className="card">
          <h2>{dueOnly ? "Nothing due right now 🎉" : "Set complete 🎉"}</h2>
          <p className="muted">Try another filter, or come back later for reviews.</p>
          <Link href="/" className="btn">Home</Link>
        </div>
      ) : (
        <div className="card stack">
          <div className="row between">
            <span className={`tag ${ex.ctx.startsWith("T1") ? "t1" : "t2"}`}>{CTX_LABEL[ex.ctx]}</span>
            <span className="small muted">{i + 1} / {queue.length}{card ? ` · box ${card.box}` : " · new"}</span>
          </div>

          <p style={{ fontSize: "1.1rem", fontWeight: 600, margin: 0 }}>{ex.situation}</p>

          {showStructure && st ? (
            <div>
              <div className="small"><b>Use:</b> <Link href={`/learn#${st.id}`}>{st.name}</Link></div>
              <div className="pattern" style={{ marginTop: 4 }}>{st.pattern}</div>
            </div>
          ) : (
            <p className="small muted" style={{ margin: 0 }}>
              Which structure fits best here? Write one sentence. <button className="chip" onClick={() => setHint(true)}>Show hint</button>
            </p>
          )}

          <textarea
            ref={ta}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your sentence…"
            disabled={!!res}
            onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) check(); }}
            autoCapitalize="sentences"
            spellCheck={false}
          />

          {!res ? (
            <div className="row">
              <button className="btn primary" style={{ flex: 1 }} onClick={check} disabled={!text.trim()}>Check</button>
              <button className="btn" onClick={giveUp}>Show answer</button>
            </div>
          ) : (
            <div className="stack">
              {st && (
                <div className={res.target ? "ok" : "no"}>
                  {res.target ? `✓ You used: ${st.name}` : `✗ Target structure not detected: ${st.name}`}
                </div>
              )}
              {res.others.length > 0 && (
                <div className="small muted">Also used: {res.others.map((o) => STRUCTURE_BY_ID[o].name).join(" · ")}</div>
              )}
              {res.basics.map((b) => <div key={b} className="issue small">{b}</div>)}
              {res.issues.map((is) => (
                <div key={is.id} className="issue bad small">
                  <b>&ldquo;{is.match}&rdquo;</b>: {is.msg} <span className="muted">→ {is.fix}</span>
                </div>
              ))}
              {res.issues.length === 0 && text.trim() && <div className="small ok">No common errors found ✓</div>}
              {text.trim() && <AiCheck text={text.trim()} context={`${CTX_LABEL[ex.ctx]}. Task: ${ex.situation}${st ? ` Target structure: ${st.name}.` : ""}`} />}

              <div>
                <div className="small muted">Model answer</div>
                <div className="model">{ex.model}</div>
              </div>
              {p.answers[ex.id] && (
                <div className="small muted">Last time you wrote: <i>{p.answers[ex.id]}</i></div>
              )}

              <div className="small muted">Compare yours with the model. How did you do?</div>
              <div className="grid2" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
                <button className={`btn bad ${suggested === 0 ? "suggest" : ""}`} onClick={() => next(0)}>Again</button>
                <button className={`btn good ${suggested === 1 ? "suggest" : ""}`} onClick={() => next(1)}>Good</button>
                <button className="btn" onClick={() => next(2)}>Easy</button>
              </div>
            </div>
          )}
          <div className="kbd">Tip: Ctrl/⌘ + Enter to check</div>
        </div>
      )}
    </main>
  );
}
