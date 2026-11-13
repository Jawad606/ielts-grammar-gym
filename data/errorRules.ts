import type { ErrorRule } from "../lib/types.ts";

/**
 * Offline accuracy checker. Each rule targets a common learner error
 * (many common among South-Asian English speakers). Heuristic: it flags,
 * it doesn't prove.
 */
export const ERROR_RULES: ErrorRule[] = [
  // ── verb forms & modals ──
  { id: "could-able", re: /\bcould(?: not|n't)? be able to\b/i, msg: "'Could' and 'be able to' mean the same thing — use one.", fix: "I was unable to… / I could not…" },
  { id: "can-able", re: /\bcan(?:not|'t)? (?:be )?able to\b/i, msg: "Don't combine 'can' and 'able to'.", fix: "I can… / I am able to…" },
  { id: "will-can", re: /\b(?:will|would|should|must|might|may) can\b/i, msg: "Two modals can't go together.", fix: "will be able to…" },
  { id: "did-past", re: /\b(?:did|didn't|did not|does|doesn't|does not|do not|don't) (?!need\b|seed\b|feed\b|bleed\b|proceed\b|succeed\b|exceed\b|speed\b|breed\b|embed\b|shed\b|wed\b|bed\b|heed\b|plead\b|shred\b|weed\b)\w+ed\b/i, msg: "After did/does/do, use the base verb.", fix: "did not receive (not 'did not received')" },
  { id: "look-forward-base", re: /\blook(?:ing)? forward to (?:hear|see|meet|receive|get|work|welcome|discuss|visit|speak|talk|catch)\b/i, msg: "'Look forward to' takes the -ing form.", fix: "I look forward to hearing from you." },
  { id: "would-have-if", re: /\bif (?:i|we|you|he|she|they|it) would have\b/i, msg: "No 'would have' in the if-clause.", fix: "If I had known…, I would have…" },
  { id: "if-will", re: /\bif (?:the \w+|i|we|you|he|she|they|it|people|governments?) will (?!be so kind)\b/i, msg: "Usually no 'will' after 'if' — use the present simple.", fix: "If the government invests…, crime will fall." },
  { id: "if-would", re: /\bif (?:the \w+|i|we|you|he|she|they|it|people|governments?|public transport) would (?!you|be so kind|like)\b/i, msg: "No 'would' in the if-clause — use past simple or 'were'.", fix: "If public transport were free, people would…" },
  { id: "he-dont", re: /\b(?:he|she|it) don't\b/i, msg: "Third person singular: 'doesn't'.", fix: "He doesn't…" },
  { id: "suggest-to", re: /\b(?:suggest|recommend)(?:ed|s)? (?:him|her|me|them|you|us) to\b/i, msg: "'Suggest/recommend someone to do' is incorrect.", fix: "I suggest that you visit… / I recommend visiting…" },
  { id: "explain-me", re: /\b(?:explain|describe|say)(?:ed|s)? (?:me|him|her|us|them)\b/i, msg: "Explain/describe/say something TO someone.", fix: "Could you explain to me…" },
  { id: "discuss-about", re: /\b(?:discuss|discussed|discussing|emphasi[sz]e[sd]?|stress(?:ed)?)\s+about\b/i, msg: "This verb takes a direct object — no 'about'.", fix: "discuss the issue / emphasise the point" },
  { id: "reach-to", re: /\b(?:reach|reached|reaching|contact|contacted|contacting|enter|entered|entering)\s+to\b/i, msg: "This verb takes a direct object — no 'to'.", fix: "reach the airport / contact the manager" },
  { id: "return-back", re: /\b(?:return|revert|repeat|reply)(?:ed|ing|s)? back\b/i, msg: "'Back' is redundant here.", fix: "return / revert / reply" },
  { id: "cope-up", re: /\bcope up\b/i, msg: "The phrase is 'cope with'.", fix: "cope with stress" },
  { id: "married-with", re: /\b(?:married|engaged) with\b/i, msg: "Married/engaged TO someone.", fix: "She is married to…" },
  { id: "checkout-from", re: /\bchecked? out from\b/i, msg: "You check out OF a hotel.", fix: "I checked out of the hotel." },
  { id: "for-to", re: /\bfor to\b/i, msg: "'For to' is not correct English.", fix: "in order to…" },
  { id: "for-verb", re: /\b(?:came|come|went|go|moved|move|travelled|traveled) (?:here |there )?for (?:study|work|learn|improve|earn|meet|visit|see)\b/i, msg: "Purpose uses 'to + verb', not 'for + verb'.", fix: "I came here to study…" },
  { id: "am-agree", re: /\b(?:i|we|they) (?:am|are) (?:agree|disagree)\b/i, msg: "'Agree' is a verb, not an adjective.", fix: "I agree… / I disagree…" },
  { id: "prepone", re: /\bprepone/i, msg: "'Prepone' isn't standard British English.", fix: "bring forward the meeting" },
  { id: "do-needful", re: /\bdo the needful\b/i, msg: "Outdated Indian/Pakistani English expression.", fix: "I would be grateful if you could…" },
  { id: "revert", re: /\bplease revert\b/i, msg: "'Revert' means 'go back to a previous state', not 'reply'.", fix: "Please reply / Please get back to me." },

  // ── nouns & articles ──
  { id: "uncountable-plural", re: /\b(?:advices|informations|furnitures|equipments|luggages|baggages|knowledges|homeworks|feedbacks|evidences|accommodations|staffs|trafics|traffics|sceneries|vocabularies)\b/i, msg: "This noun is uncountable — no plural -s.", fix: "advice, information, furniture, luggage, feedback…" },
  { id: "a-uncountable", re: /\b(?:a|an) (?:advice|information|furniture|equipment|luggage|baggage|news|homework|research|knowledge|feedback|evidence|accommodation|leave|traffic)\b/i, msg: "Uncountable noun — no 'a/an'.", fix: "a piece of advice / some information / a day's leave" },
  { id: "peoples", re: /\bpeoples\b/i, msg: "'People' is already plural.", fix: "people" },
  { id: "this-plural", re: /\bthis (?:people|problems|issues|days|things|children|students|countries|reasons|kinds)\b/i, msg: "'This' + singular; 'these' + plural.", fix: "these people / these problems" },
  { id: "these-kind", re: /\bthese (?:kind|type|sort) of\b/i, msg: "Use 'this kind of' or 'these kinds of'.", fix: "this kind of problem / these kinds of problems" },
  { id: "much-people", re: /\bmuch (?:people|students|cars|children|countries|jobs|problems|tourists|vehicles)\b/i, msg: "'Much' is for uncountable nouns; use 'many' with countable plurals.", fix: "many people" },
  { id: "less-people", re: /\bless (?:people|students|cars|children|jobs|vehicles|tourists|accidents|crimes)\b/i, msg: "'Fewer' for countable nouns.", fix: "fewer people" },
  { id: "missing-the-place", re: /\b(?:at|reach|reached|reaching|arrive at|arrived at|in|into|to|from|near) (?:airport|hotel|restaurant|station|cinema|bank|library|gym|museum|office|supermarket|shop|mall|post office|venue)\b/i, msg: "This place probably needs an article (the/a).", fix: "at the airport / reached the restaurant" },
  { id: "missing-article-adj", re: /\b(?:i|we|he|she|they) (?:lost|bought|ordered|booked|found|left) (?:blue|red|black|white|green|brown|grey|gray|new|old|small|big|large|expensive|cheap|leather|silver|gold) (?!and\b)\w+(?<!s)\b/i, msg: "Singular noun — add an article or possessive.", fix: "I lost a blue bag / my black wallet" },
  { id: "the-society", re: /\bthe (?:society|nature|mankind|humanity)\b(?! of| that| which| in| we)/i, msg: "Used in a general sense, these nouns take no article.", fix: "society, nature" },
  { id: "a-vowel", re: /\ba (?!one\b|once\b|uni\w*|use\w*|usu\w*|euro\w*|eu\w*|ewe\b|u\b|util\w*|us\b)[aeiou]\w*/i, msg: "Use 'an' before a vowel sound.", fix: "an apple, an hour, an issue" },
  { id: "an-consonant", re: /\ban (?!hour|honest|honour|honor|heir|herb|mba|mp|mri|nhs|sos|x-ray|fbi|sms|ngo|ma\b|mot\b)[bcdfgjklmnpqrstvwxyz]\w*/i, msg: "Use 'a' before a consonant sound.", fix: "a car, a university" },

  // ── comparatives & linking ──
  { id: "double-comparative", re: /\b(?:more|most) (?:better|worse|bigger|smaller|easier|cheaper|faster|higher|lower|older|younger|larger|happier|healthier|safer|best|worst|biggest|easiest|cheapest)\b/i, msg: "Double comparative.", fix: "better / easier / the cheapest" },
  { id: "although-but", re: /\b(?:although|even though|though)\b[^.]*,\s*but\b/i, msg: "Don't use 'although' and 'but' together.", fix: "Although it is expensive, it is worth it." },
  { id: "despite-of", re: /\bdespite of\b/i, msg: "'Despite' has no 'of' (but 'in spite of' does).", fix: "despite the rain / in spite of the rain" },
  { id: "due-to-clause", re: /\bdue to (?:i|we|you|he|she|they|it) \w+/i, msg: "'Due to' + noun, not a clause.", fix: "due to the fact that it was raining / due to the rain" },
  { id: "because-of-clause", re: /\bbecause of (?:i|we|you|he|she|they) \w+/i, msg: "'Because of' + noun; 'because' + clause.", fix: "because I was ill / because of my illness" },
  { id: "alone-with", re: /\balone with\b/i, msg: "Did you mean 'along with'?", fix: "my car key along with my house keys" },
  { id: "in-these-days", re: /\bin (?:these days|now a days|nowadays)\b/i, msg: "Use 'these days' or 'nowadays' without 'in'.", fix: "Nowadays, …" },
  { id: "nowadays-split", re: /\bnow a days\b/i, msg: "One word.", fix: "nowadays" },
  { id: "on-yesterday", re: /\b(?:on|in|at) (?:yesterday|tomorrow|last (?:week|month|year|night)|next (?:week|month|year))\b/i, msg: "No preposition before yesterday / tomorrow / last / next.", fix: "last week, I…" },
  { id: "since-duration", re: /\bsince (?:\d+|one|two|three|four|five|six|seven|eight|nine|ten|many|several|a few) (?:years|months|weeks|days|hours)\b/i, msg: "'Since' + point in time; 'for' + period.", fix: "for three years / since 2021" },
  { id: "what-it-is", re: /\bwhat [^.]{3,40}\b it is that\b/i, msg: "In a cleft sentence, don't add 'it'.", fix: "What I want to say is that…" },
  { id: "not-only-noinv", re: /(?:^|[.!?]\s*)not only (?:i|we|you|he|she|they|it|the \w+|people|tourism|technology) (?!does|do|did|is|are|was|were|has|have|had|can|will|would)\w+/i, msg: "At the start of a sentence, 'Not only' needs inversion.", fix: "Not only does tourism create jobs, but…" },

  // ── register (formal letters & essays) ──
  { id: "contraction", re: /\b\w+(?:n't|'re|'ve|'ll|'m|'d)\b/i, msg: "Avoid contractions in formal letters and essays.", fix: "do not, I am, I would", only: "formal" },
  { id: "i-want", re: /\bi (?:want|need) (?:you to|a|an|the|to request|to ask)\b/i, msg: "'I want…' sounds like a demand.", fix: "I would be grateful if you could…", only: "formal" },
  { id: "writing-you", re: /\bwriting you\b/i, msg: "In British English, write TO someone.", fix: "I am writing to you / I am writing to…" },
  { id: "informal-words", re: /\b(?:gonna|wanna|gotta|kids|guys|stuff|lots of|okay|ok|awesome|cool|pretty good|super)\b/i, msg: "Too informal for this register.", fix: "children / things / a great deal of / many", only: "formal" },
  { id: "etc", re: /\betc\.?/i, msg: "Avoid 'etc.' in IELTS — give a specific example instead.", fix: "such as… / for example…", only: "formal" },
];

export type Issue = { id: string; msg: string; fix: string; match: string };

export function checkAccuracy(text: string, formal: boolean): Issue[] {
  const out: Issue[] = [];
  for (const r of ERROR_RULES) {
    if (r.only === "formal" && !formal) continue;
    const m = text.match(r.re);
    if (m) out.push({ id: r.id, msg: r.msg, fix: r.fix, match: m[0] });
  }
  return out;
}

/** Letter-level checks: greeting/sign-off mismatch */
export function checkSignOff(text: string): Issue[] {
  const t = text.toLowerCase();
  const out: Issue[] = [];
  const sirMadam = /dear (sir|madam|sir or madam|sir\/madam)/.test(t);
  const named = /dear (mr|mrs|ms|miss|dr)\.? \w+/.test(t);
  if (sirMadam && /yours sincerely|best regards|kind regards|regards,/.test(t))
    out.push({ id: "signoff", msg: "'Dear Sir or Madam' must end with 'Yours faithfully'.", fix: "Yours faithfully,", match: "sign-off" });
  if (named && /yours faithfully/.test(t))
    out.push({ id: "signoff2", msg: "'Dear Mr/Ms + name' ends with 'Yours sincerely'.", fix: "Yours sincerely,", match: "sign-off" });
  return out;
}
