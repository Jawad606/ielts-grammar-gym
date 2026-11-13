"use client";
import { useState } from "react";

// Free key: https://openrouter.ai/keys. Stored on this device only.
const KEY = "ielts-grammar-gym:openrouter-key";
// openrouter/free = any available free model; pin one (e.g. google/gemma-4-31b-it:free) via env.
const MODEL = process.env.NEXT_PUBLIC_OPENROUTER_MODEL || "openrouter/free";

const SYSTEM = `You are an IELTS General Training writing examiner focused on Grammatical Range & Accuracy.
Reply in plain text (no markdown headings), in this exact shape:
Corrected: <the corrected text; if it is already correct, repeat it>
Errors:
- "<wrong part>" → "<fix>": <short reason>
(write "- None" if there are no errors)
Range: <one sentence on which complex structures were used and one to add>
Band (GRA): <estimate like 6.5>
Keep the learner's meaning and style. Be brief.`;

// ponytail: env key is inlined into the public bundle; move to a server proxy if abuse matters.
const ENV_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY ?? "";

function getKey() {
  try { return localStorage.getItem(KEY) || ENV_KEY; } catch { return ENV_KEY; }
}

export default function AiCheck({ text, context }: { text: string; context: string }) {
  const [key, setKey] = useState(getKey);
  const [editing, setEditing] = useState(false);
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const saveKey = (k: string) => {
    setKey(k.trim() || ENV_KEY);
    try { localStorage.setItem(KEY, k.trim()); } catch {}
    setEditing(false);
  };

  const run = async () => {
    setBusy(true); setErr(""); setOut("");
    try {
      const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}`, "X-Title": "IELTS Grammar Gym" },
        body: JSON.stringify({
          model: MODEL,
          temperature: 0.2,
          messages: [
            { role: "system", content: SYSTEM },
            { role: "user", content: `Context: ${context}\n\nText:\n${text}` },
          ],
        }),
      });
      if (r.status === 401) throw new Error("Invalid API key.");
      if (r.status === 429) throw new Error("Free-model rate limit hit. Wait a minute and try again.");
      if (!r.ok) throw new Error(`OpenRouter error ${r.status}`);
      const j = await r.json();
      setOut(j.choices?.[0]?.message?.content ?? "No answer.");
    } catch (e) {
      setErr(e instanceof Error && e.message !== "Failed to fetch" ? e.message : "Network error (are you offline?).");
    } finally {
      setBusy(false);
    }
  };

  if (!key || editing)
    return (
      <form className="row" onSubmit={(e) => { e.preventDefault(); saveKey(new FormData(e.currentTarget).get("k") as string); }}>
        <input name="k" type="password" defaultValue={key === ENV_KEY ? "" : key} placeholder="OpenRouter API key (free at openrouter.ai/keys)" style={{ flex: 1 }} aria-label="OpenRouter API key" />
        <button className="btn" type="submit">Save</button>
      </form>
    );

  return (
    <div className="stack">
      <div className="row">
        <button className="btn" style={{ flex: 1 }} onClick={run} disabled={busy || !text.trim()}>
          {busy ? "Asking AI…" : "✨ AI check"}
        </button>
        <button className="chip" onClick={() => setEditing(true)}>Key</button>
      </div>
      {err && <div className="issue bad small">{err}</div>}
      {out && <div className="model small" style={{ whiteSpace: "pre-wrap" }}>{out}</div>}
    </div>
  );
}
