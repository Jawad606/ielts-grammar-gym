# IELTS Grammar Gym

Offline-first practice app for IELTS General Training Writing (Task 1 letters and Task 2 essays), focused on **Grammatical Range & Accuracy**.

- **Learn**: 25 band-7+ structures. For each one: when to use it, where it fits in a letter or essay, examples and a common mistake.
- **Practise**: 500 original sentences (20 per structure) across formal/semi-formal/informal letters and all five Task 2 essay types.
  - *Choose the structure* mode hides the target, so you learn **when** to use it.
  - Offline checker: detects which structures you used, and flags ~55 common accuracy errors.
  - Spaced repetition (Leitner boxes 0–5: 0/1/3/7/14/30 days).
- **Type**: copy-type model sentences (WPM + accuracy, structure highlighted) or type them from memory (word-level diff). Works on the 500 structure sentences and the 154 vocabulary examples.
- **Fix it**: 60 error-correction drills.
- **Check**: paste a full letter or essay to see your range, likely errors, sign-off mismatch, word count and overused words.
- **AI check (optional)**: on Practise and Check, send your text to Mistral (`mistral-small-latest`) for a corrected version, error list and GRA band estimate. Paste a free API key from console.mistral.ai; it's stored in this browser only. Needs internet. Or set a default key for everyone: copy `.env.example` to `.env.local` (or add it in Vercel → Settings → Environment Variables) and fill `NEXT_PUBLIC_MISTRAL_API_KEY`. Note: this key is baked into the public JS, so anyone can read it.
- **Words**: 154 band-7+ words and phrases in 13 topics, with a search for weak words ("bad", "traffic"), stars and flashcards.
- **Stats**: mastery by structure, 14-day activity, export/import backup.

Progress is stored in `localStorage` (this device only). Use Export/Import on the Stats page to move it to another device.

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
npm run check-data   # verifies all 500 model answers match their structure and pass the error checker
```

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. In Vercel, click **New Project**, import the repo, and keep the defaults (Framework: Next.js). Deploy.

The app uses `output: "export"`, so it's fully static and needs no environment variables. On a phone, open the site and choose **Add to Home Screen** to install it. It works offline after the first visit.

## Editing content

- Structures and detectors: `data/structures.ts`
- Exercises: `data/ex/*.ts` (tuples: `[situation, model answer, context]`)
- Error rules: `data/errorRules.ts`
- Vocabulary: `data/vocab.ts`
- Fix drills: `data/fixes.ts`

Run `npm run check-data` after editing to catch model answers that the detectors or error rules would mark wrong.
