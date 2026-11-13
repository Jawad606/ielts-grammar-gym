"use client";
import { useMemo, useState } from "react";
import { VOCAB, VOCAB_TOPICS } from "@/data/vocab";
import { useProgress } from "@/lib/store";

export default function VocabPage() {
  const { p, update } = useProgress();
  const [q, setQ] = useState("");
  const [topic, setTopic] = useState("");
  const [filter, setFilter] = useState<"all" | "star" | "new">("all");
  const [flash, setFlash] = useState(false);
  const [fi, setFi] = useState(0);
  const [flip, setFlip] = useState(false);

  const list = useMemo(() => {
    const s = q.toLowerCase().trim();
    return VOCAB.filter(
      (v) =>
        (!topic || v.topic === topic) &&
        (filter === "all" || (filter === "star" ? p.vocab[v.word] === "star" : p.vocab[v.word] !== "known")) &&
        (!s || v.word.toLowerCase().includes(s) || v.meaning.toLowerCase().includes(s) || (v.instead ?? "").toLowerCase().includes(s)),
    );
  }, [q, topic, filter, p.vocab]);

  const mark = (w: string, m: "star" | "known") =>
    update((pp) => {
      const v = { ...pp.vocab };
      if (v[w] === m) delete v[w];
      else v[w] = m;
      return { ...pp, vocab: v };
    });

  const known = Object.values(p.vocab).filter((x) => x === "known").length;
  const card = list[fi % Math.max(1, list.length)];

  return (
    <main className="wrap stack">
      <div className="row between">
        <h1 style={{ margin: 0 }}>Word gallery</h1>
        <span className="small muted">{known}/{VOCAB.length} known</span>
      </div>
      <input type="search" placeholder="Search, e.g. “bad” or “traffic”" value={q} onChange={(e) => { setQ(e.target.value); setFi(0); }} />
      <div className="chips">
        <button className={`chip ${!topic ? "on" : ""}`} onClick={() => { setTopic(""); setFi(0); }}>All topics</button>
        {VOCAB_TOPICS.map((t) => (
          <button key={t} className={`chip ${topic === t ? "on" : ""}`} onClick={() => { setTopic(t); setFi(0); }}>{t}</button>
        ))}
      </div>
      <div className="row">
        {(["all", "new", "star"] as const).map((f) => (
          <button key={f} className={`chip ${filter === f ? "on" : ""}`} onClick={() => { setFilter(f); setFi(0); }}>
            {f === "all" ? "All" : f === "new" ? "Not known yet" : "★ Starred"}
          </button>
        ))}
        <span style={{ flex: 1 }} />
        <button className={`chip ${flash ? "on" : ""}`} onClick={() => { setFlash(!flash); setFlip(false); }}>Flashcards</button>
      </div>

      {flash ? (
        card ? (
          <div className="stack">
            <div className="card flash" onClick={() => setFlip(!flip)}>
              {!flip ? (
                <>
                  <div className="small muted">{card.topic}</div>
                  <h2 style={{ fontSize: "1.5rem" }}>{card.instead ? <>Instead of &ldquo;{card.instead}&rdquo;…</> : card.meaning}</h2>
                  <div className="small muted">Tap to reveal</div>
                </>
              ) : (
                <>
                  <h2 style={{ fontSize: "1.5rem" }}>{card.word} <span className="small muted">({card.pos})</span></h2>
                  <p>{card.meaning}</p>
                  <p className="model" style={{ textAlign: "left" }}>{card.example}</p>
                </>
              )}
            </div>
            <div className="grid2" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
              <button className="btn" onClick={() => { setFi(fi + 1); setFlip(false); }}>Skip</button>
              <button className="btn warn" onClick={() => { mark(card.word, "star"); setFi(fi + 1); setFlip(false); }}>★ Review</button>
              <button className="btn good" onClick={() => { if (p.vocab[card.word] !== "known") mark(card.word, "known"); setFi(fi + 1); setFlip(false); }}>I know it</button>
            </div>
            <div className="small muted">{(fi % list.length) + 1} / {list.length}</div>
          </div>
        ) : <p className="muted">No words match.</p>
      ) : (
        <div className="stack">
          <div className="small muted">{list.length} words</div>
          {list.map((v) => (
            <div key={v.word} className="card" style={{ padding: 14 }}>
              <div className="row between" style={{ flexWrap: "nowrap", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}><b style={{ fontSize: "1.05rem" }}>{v.word}</b> <span className="small muted">{v.pos}</span></div>
                <div className="row" style={{ gap: 4, flexWrap: "nowrap", flexShrink: 0 }}>
                  <button className={`chip ${p.vocab[v.word] === "star" ? "on" : ""}`} onClick={() => mark(v.word, "star")} aria-label="Star">★</button>
                  <button className={`chip ${p.vocab[v.word] === "known" ? "on" : ""}`} onClick={() => mark(v.word, "known")} aria-label="Known">✓</button>
                </div>
              </div>
              <div className="small" style={{ marginTop: 2 }}>{v.meaning}{v.instead && <span className="muted"> · instead of <span className="wrong">{v.instead}</span></span>}</div>
              <div className="small" style={{ marginTop: 6, fontStyle: "italic" }}>{v.example}</div>
              <div style={{ marginTop: 6 }}><span className={`tag ${v.use === "T1" ? "t1" : v.use === "T2" ? "t2" : "both"}`}>{v.use === "Both" ? "T1 + T2" : v.use}</span> <span className="small muted">{v.topic}</span></div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
