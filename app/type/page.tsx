"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { EXERCISES } from "@/data/exercises";
import { STRUCTURES, STRUCTURE_BY_ID } from "@/data/structures";
import { VOCAB, VOCAB_TOPICS } from "@/data/vocab";
import { CTX_LABEL, type Ctx } from "@/lib/types";
import { useProgress, logTyping } from "@/lib/store";

type Source = "structures" | "words";
type Mode = "copy" | "memory";
type Item = { id: string; text: string; prompt: string; label: string; hl: [number, number] | null; ctx?: Ctx; pattern?: string };

/* ── helpers ── */
const canon = (c: string) => (c === "’" || c === "‘" ? "'" : c === "“" || c === "”" ? '"' : c === "—" || c === "–" ? "-" : c);
const same = (want: string, got: string) => canon(want) === canon(got) || (want.charCodeAt(0) > 127 && !/[’‘“”—–]/.test(want));

function structureRange(text: string, sid: string): [number, number] | null {
  for (const re of STRUCTURE_BY_ID[sid].detect) {
    const m = new RegExp(re.source, re.flags.replace("g", "")).exec(text);
    if (m) {
      let s = m.index;
      let e = m.index + m[0].length;
      while (s < e && /[\s.,;!?]/.test(text[s])) s++;
      while (e > s && /[\s,]/.test(text[e - 1])) e--;
      return [s, e];
    }
  }
  return null;
}
function wordRange(text: string, word: string): [number, number] | null {
  const low = text.toLowerCase();
  let i = low.indexOf(word.toLowerCase());
  if (i >= 0) return [i, i + word.length];
  const parts = word.split(/\s+/).filter((w) => w.length >= 4).sort((a, b) => b.length - a.length);
  for (const w of parts) {
    const stem = w.toLowerCase().slice(0, Math.max(4, w.length - 2));
    i = low.indexOf(stem);
    if (i >= 0) {
      let e = i;
      while (e < text.length && /[\w'-]/.test(text[e])) e++;
      return [i, e];
    }
  }
  return null;
}
function shuffle<T>(a: T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}
const wnorm = (w: string) => canon(w).toLowerCase().replace(/[^\w'£-]/g, "");
/** LCS word diff: returns flags for target words (hit/miss) and extra typed words */
function wordDiff(target: string, typed: string) {
  const a = target.split(/\s+/).filter(Boolean);
  const b = typed.split(/\s+/).filter(Boolean);
  const A = a.map(wnorm), B = b.map(wnorm);
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--)
    for (let j = b.length - 1; j >= 0; j--)
      dp[i][j] = A[i] === B[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const hit = new Array(a.length).fill(false);
  const extra: string[] = [];
  let i = 0, j = 0;
  while (i < a.length && j < b.length) {
    if (A[i] === B[j]) { hit[i] = true; i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
    else { extra.push(b[j]); j++; }
  }
  while (j < b.length) extra.push(b[j++]);
  const exact = canon(target.trim()) === canon(typed.trim().replace(/\s+/g, " "));
  return { words: a, hit, extra, acc: a.length ? hit.filter(Boolean).length / a.length : 0, exact };
}

export default function TypePage() {
  const { p, update } = useProgress();
  const [source, setSource] = useState<Source>("structures");
  const [mode, setMode] = useState<Mode>("copy");
  const [task, setTask] = useState<"all" | "T1" | "T2">("all");
  const [sid, setSid] = useState("");
  const [topic, setTopic] = useState("");
  const [queue, setQueue] = useState<Item[]>([]);
  const [k, setK] = useState(0);
  const [typed, setTyped] = useState("");
  const [start, setStart] = useState<number | null>(null);
  const [phase, setPhase] = useState<"study" | "type" | "done">("type");
  const [result, setResult] = useState<null | { wpm?: number; acc: number; diff?: ReturnType<typeof wordDiff> }>(null);
  const [session, setSession] = useState({ n: 0, wpm: 0, acc: 0 });
  const input = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.get("s")) setSid(q.get("s")!);
    if (q.get("mode") === "memory") setMode("memory");
    if (q.get("src") === "words") setSource("words");
  }, []);

  const items: Item[] = useMemo(() => {
    if (source === "structures") {
      return EXERCISES.filter((e) => (task === "all" || e.ctx.startsWith(task)) && (!sid || e.structureId === sid)).map((e) => {
        const st = STRUCTURE_BY_ID[e.structureId];
        return { id: e.id, text: e.model, prompt: e.situation, label: st.name, pattern: st.pattern, hl: structureRange(e.model, e.structureId), ctx: e.ctx };
      });
    }
    return VOCAB.filter((v) => !topic || v.topic === topic).map((v) => ({
      id: v.word, text: v.example, prompt: `Use “${v.word}” (${v.meaning})${v.instead ? ` instead of “${v.instead}”` : ""}.`, label: v.word, hl: wordRange(v.example, v.word),
    }));
  }, [source, task, sid, topic]);

  useEffect(() => {
    setQueue(shuffle(items));
    setK(0);
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, mode]);

  const item = queue[k];

  function reset() {
    setTyped("");
    setStart(null);
    setResult(null);
    setPhase(mode === "memory" ? "study" : "type");
    setTimeout(() => input.current?.focus(), 30);
  }

  const finishCopy = (value: string) => {
    if (!item) return;
    const t = item.text;
    let ok = 0;
    for (let i = 0; i < t.length; i++) if (value[i] !== undefined && same(t[i], value[i])) ok++;
    const acc = ok / Math.max(t.length, value.length);
    const mins = start ? (Date.now() - start) / 60000 : 0;
    const wpm = mins > 0 ? Math.round(value.length / 5 / mins) : 0;
    setResult({ wpm, acc });
    setPhase("done");
    update((pp) => logTyping(pp, { wpm, acc, memory: false }));
    setSession((s) => ({ n: s.n + 1, wpm: s.wpm + wpm, acc: s.acc + acc }));
  };

  const finishMemory = () => {
    if (!item || !typed.trim()) return;
    const diff = wordDiff(item.text, typed);
    setResult({ acc: diff.acc, diff });
    setPhase("done");
    update((pp) => logTyping(pp, { acc: diff.acc, memory: true }));
    setSession((s) => ({ n: s.n + 1, wpm: s.wpm, acc: s.acc + diff.acc }));
  };

  const next = () => {
    if (k + 1 >= queue.length) { setQueue(shuffle(items)); setK(0); }
    else setK(k + 1);
    reset();
  };

  const onChange = (v: string) => {
    if (phase !== "type" || !item) return;
    v = v.replace(/\n/g, "");
    if (!start && v.length) setStart(Date.now());
    setTyped(v);
    if (mode === "copy" && v.length >= item.text.length) {
      const allOk = [...item.text].every((c, i) => same(c, v[i]));
      if (allOk || v.length > item.text.length) finishCopy(v);
    }
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    if (phase === "done") next();
    else if (phase === "study") { setPhase("type"); setTimeout(() => input.current?.focus(), 30); }
    else if (mode === "memory") finishMemory();
    else if (typed.length >= Math.min(5, item?.text.length ?? 0)) finishCopy(typed);
  };

  // Enter works in the study phase too (no textarea is focused then)
  useEffect(() => {
    if (phase !== "study") return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        setPhase("type");
        setTimeout(() => input.current?.focus(), 30);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [phase]);

  const live = useMemo(() => {
    if (!item || mode !== "copy" || !typed) return { wpm: 0, errors: 0 };
    let errors = 0;
    for (let i = 0; i < typed.length; i++) if (!same(item.text[i] ?? "", typed[i])) errors++;
    const mins = start ? (Date.now() - start) / 60000 : 0;
    return { wpm: mins > 0.02 ? Math.round(typed.length / 5 / mins) : 0, errors };
  }, [typed, item, mode, start]);

  const avgWpm = p.typing.n ? Math.round(p.typing.wpmSum / p.typing.n) : 0;
  const avgAcc = p.typing.n ? Math.round((p.typing.accSum / p.typing.n) * 100) : 0;
  const memAcc = p.typing.memN ? Math.round((p.typing.memAccSum / p.typing.memN) * 100) : 0;
  const structOptions = STRUCTURES.filter((s) => task === "all" || s.task === task || s.task === "Both");

  return (
    <main className="wrap stack">
      <div className="row between">
        <h1 style={{ margin: 0 }}>Type to learn</h1>
        <span className="small muted">{session.n} this session</span>
      </div>
      <p className="muted small" style={{ margin: 0 }}>
        Typing correct sentences builds muscle memory for structures and natural word combinations.
        <b> Copy</b> trains speed and accuracy; <b>Memory</b> makes you recall the whole sentence.
      </p>

      <div className="card stack">
        <div className="chips">
          <button className={`chip ${mode === "copy" ? "on" : ""}`} onClick={() => setMode("copy")}>Copy</button>
          <button className={`chip ${mode === "memory" ? "on" : ""}`} onClick={() => setMode("memory")}>Memory</button>
          <span style={{ width: 8 }} />
          <button className={`chip ${source === "structures" ? "on" : ""}`} onClick={() => setSource("structures")}>Structures (500)</button>
          <button className={`chip ${source === "words" ? "on" : ""}`} onClick={() => setSource("words")}>Vocabulary ({VOCAB.length})</button>
        </div>
        {source === "structures" ? (
          <div className="row" style={{ flexWrap: "nowrap" }}>
            <select value={task} onChange={(e) => { setTask(e.target.value as typeof task); setSid(""); }} style={{ width: "auto" }} aria-label="Task">
              <option value="all">All tasks</option><option value="T1">Task 1</option><option value="T2">Task 2</option>
            </select>
            <select value={sid} onChange={(e) => setSid(e.target.value)} aria-label="Structure">
              <option value="">All structures</option>
              {structOptions.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        ) : (
          <select value={topic} onChange={(e) => setTopic(e.target.value)} aria-label="Topic">
            <option value="">All topics</option>
            {VOCAB_TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        )}
      </div>

      {item && (
        <div className="card stack">
          <div className="row between">
            {item.ctx ? <span className={`tag ${item.ctx.startsWith("T1") ? "t1" : "t2"}`}>{CTX_LABEL[item.ctx]}</span> : <span className="tag both">Vocabulary</span>}
            <span className="small muted">{k + 1} / {queue.length}</span>
          </div>

          <div className="small"><b>{source === "structures" ? "Structure" : "Word"}:</b> <span className="hl-label">{item.label}</span></div>

          {/* target sentence */}
          {(mode === "copy" || phase !== "type") && (
            <div className="typetext" aria-label="Sentence to type">
              {mode === "copy" ? (
                [...item.text].map((c, i) => {
                  const inHl = item.hl && i >= item.hl[0] && i < item.hl[1];
                  const t = typed[i];
                  const cls = t === undefined ? (i === typed.length && phase === "type" ? "cur" : "") : same(c, t) ? "okc" : "bad";
                  return <span key={i} className={`${cls} ${inHl ? "hl" : ""}`}>{c}</span>;
                })
              ) : phase === "done" && result?.diff ? (
                result.diff.words.map((w, i) => {
                  const off = item.text.split(/\s+/).slice(0, i).join(" ").length + (i ? 1 : 0);
                  const inHl = item.hl && off >= item.hl[0] && off < item.hl[1];
                  return <span key={i}><span className={`${result.diff!.hit[i] ? "okc" : "miss"} ${inHl ? "hl" : ""}`}>{w}</span> </span>;
                })
              ) : (
                <Highlighted text={item.text} hl={item.hl} />
              )}
            </div>
          )}

          {mode === "memory" && phase === "type" && (
            <div className="stack" style={{ gap: 6 }}>
              <p style={{ margin: 0, fontWeight: 600 }}>{item.prompt}</p>
              {item.pattern && <div className="pattern">{item.pattern}</div>}
              <p className="small muted" style={{ margin: 0 }}>Type the sentence from memory, then press Enter.</p>
            </div>
          )}

          {phase === "study" ? (
            <button className="btn primary" onClick={() => { setPhase("type"); setTimeout(() => input.current?.focus(), 30); }}>
              I&rsquo;ve memorised it. Hide and type (Enter)
            </button>
          ) : (
            <textarea
              ref={input}
              className="typein"
              value={typed}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={onKey}
              readOnly={phase === "done"}
              placeholder={mode === "copy" ? "Start typing…" : "Type the full sentence…"}
              autoComplete="off" autoCorrect="off" spellCheck={false} autoCapitalize="sentences"
              rows={2}
            />
          )}

          {mode === "copy" && phase === "type" && (
            <div className="row small muted" style={{ gap: 16 }}>
              <span>{live.wpm} wpm</span>
              <span className={live.errors ? "no" : ""}>{live.errors} error{live.errors === 1 ? "" : "s"}</span>
              <span>{typed.length}/{item.text.length}</span>
            </div>
          )}

          {phase === "done" && result && (
            <div className="stack">
              <div className="grid2" style={{ gridTemplateColumns: mode === "copy" ? "1fr 1fr" : "1fr" }}>
                {mode === "copy" && <div className="card stat" style={{ padding: 12 }}><b>{result.wpm}</b><span>words / min</span></div>}
                <div className="card stat" style={{ padding: 12 }}>
                  <b className={result.acc >= 0.95 ? "ok" : result.acc >= 0.8 ? "" : "no"}>{Math.round(result.acc * 100)}%</b>
                  <span>{mode === "copy" ? "accuracy" : result.diff?.exact ? "perfect recall ✓" : "words recalled"}</span>
                </div>
              </div>
              {mode === "memory" && result.diff && result.diff.extra.length > 0 && (
                <div className="small"><span className="muted">Not in the model:</span> <span className="wrong">{result.diff.extra.join(" ")}</span></div>
              )}
              {mode === "memory" && result.diff && !result.diff.exact && (
                <div className="small muted">Words in <span className="miss">red</span> were missed or changed. Check punctuation and capitals too.</div>
              )}
              <div className="row">
                <button className="btn" onClick={reset}>Again</button>
                <button className="btn primary" style={{ flex: 1 }} onClick={next}>Next (Enter)</button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid4">
        <div className="card stat"><b>{p.typing.n}</b><span>copied</span></div>
        <div className="card stat"><b>{avgWpm}</b><span>avg wpm · best {p.typing.best}</span></div>
        <div className="card stat"><b>{avgAcc}%</b><span>copy accuracy</span></div>
        <div className="card stat"><b>{memAcc}%</b><span>memory recall · {p.typing.memN}</span></div>
      </div>
      <p className="small muted">Tip: the highlighted part is the structure (or word) to learn. Say it in your head as you type.</p>
    </main>
  );
}

function Highlighted({ text, hl }: { text: string; hl: [number, number] | null }) {
  if (!hl) return <>{text}</>;
  return (
    <>
      {text.slice(0, hl[0])}
      <span className="hl">{text.slice(hl[0], hl[1])}</span>
      {text.slice(hl[1])}
    </>
  );
}
