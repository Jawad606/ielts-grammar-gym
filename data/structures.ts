import type { Structure } from "../lib/types.ts";

const V3 =
  "(?:been|\\w+ed|\\w+en|told|made|done|gone|seen|paid|bought|sold|found|left|lost|met|read|said|sent|spent|taken|written|forgotten|brought|caught|taught|thought|kept|held|put|set|cut|built|won|understood|led|run|hurt|become|begun|felt|heard|known|shown|grown|drawn|flown|thrown|sat|stood|rung|sung|swung|got|forgotten|slept|woken|chosen|fallen|risen|given|taken|eaten|driven|written|broken|stolen|spoken|worn|torn|sworn|struck|stuck|fought|sought|dealt|meant|lent|bent|sent|dug|hung|shut|quit|spread|upset)";

export const STRUCTURES: Structure[] = [
  // ───────────── TASK 1 ─────────────
  {
    id: "writing-to",
    name: "Stating your purpose",
    pattern: "I am writing to + verb  /  I am writing with regard to + noun",
    when: "The very first sentence of every letter. It tells the reader at once why you are writing.",
    where: ["T1 · Opening"],
    task: "T1",
    examples: [
      "I am writing to complain about the service I received at your Oxford Street branch.",
      "I am writing with regard to the vacancy advertised on your website.",
      "I'm writing to let you know that I've finally moved into my new flat. (informal)",
    ],
    mistake: {
      wrong: "I am writing you this letter regarding my keys.",
      right: "I am writing with regard to some keys I left in my room.",
      why: "In British English you write TO someone. 'This letter' is unnecessary.",
    },
    detect: [
      /\bi(?: am|'m) writing (?:to|with regard to|in (?:connection|response|reference) to|regarding|about|on behalf of|because)\b/i,
    ],
  },
  {
    id: "grateful-if",
    name: "Formal requests",
    pattern: "I would be grateful if you could + verb  /  I would appreciate it if you could + verb",
    when: "Whenever you ask the reader to DO something. Never use 'I want' or 'I need you to'.",
    where: ["T1 · Request paragraph"],
    task: "T1",
    examples: [
      "I would be grateful if you could send the keys to my home address.",
      "I would appreciate it if you could look into this matter urgently.",
      "I'd really appreciate it if you could water my plants while I'm away. (informal)",
    ],
    mistake: {
      wrong: "I want you to give me a refund.",
      right: "I would be grateful if you could arrange a full refund.",
      why: "'I want' sounds like a demand and hurts your tone (Task Achievement).",
    },
    detect: [/\bi(?: would|'d) (?:be (?:most |very |extremely |really )?grateful|(?:really |greatly )?appreciate it) if\b/i],
  },
  {
    id: "would-possible",
    name: "Polite question requests",
    pattern: "Would it be possible (for me) to…? / Could you possibly…? / I was wondering if…",
    when: "When you ask for permission or a favour and want to sound polite rather than demanding.",
    where: ["T1 · Request paragraph"],
    task: "T1",
    examples: [
      "Would it be possible for me to take a day's leave on Friday?",
      "Could you possibly let me know the course fees by the end of the week?",
      "I was wondering if you could lend me your camping tent next month.",
    ],
    mistake: {
      wrong: "Is it possible you give me Friday off?",
      right: "Would it be possible for me to take Friday off?",
      why: "'Would' is more polite, and the pattern needs 'for me to + verb'.",
    },
    detect: [
      /\bwould it be possible\b/i,
      /\bcould you possibly\b/i,
      /\bi was wondering (?:if|whether)\b/i,
      /\bwould you (?:mind|be (?:able|willing) to)\b/i,
    ],
  },
  {
    id: "should-you",
    name: "Formal 'if' with should",
    pattern: "Should you + base verb, please…  /  Should the + noun + be + V3…",
    when: "A very formal way to say 'if'. Perfect for the closing line or for conditions in a request.",
    where: ["T1 · Closing", "T1 · Request"],
    task: "T1",
    examples: [
      "Should you require any further information, please do not hesitate to contact me.",
      "Should the keys be found, I would be grateful if you could call me.",
      "Should you have any questions, I can be reached on 0300 1234567.",
    ],
    mistake: {
      wrong: "If you will require more information, contact me.",
      right: "Should you require any further information, please contact me.",
      why: "No 'will' after 'if', and 'should + subject' sounds more formal.",
    },
    detect: [/(?:^|[.;,!?]\s*)should (?:you|the|a|an|it|there|any|anyone|we|they|this|your|my|our|these)\b/i],
  },
  {
    id: "look-forward",
    name: "Closing line: look forward to",
    pattern: "I look forward to + -ing / noun",
    when: "The last sentence before 'Yours faithfully / sincerely'. Use the -ing form, not the base verb.",
    where: ["T1 · Closing"],
    task: "T1",
    examples: [
      "I look forward to hearing from you at your earliest convenience.",
      "I look forward to your prompt reply.",
      "I'm really looking forward to seeing you all in June. (informal)",
    ],
    mistake: {
      wrong: "I look forward to hear from you.",
      right: "I look forward to hearing from you.",
      why: "'To' here is a preposition, so the verb takes -ing.",
    },
    detect: [/\b(?:look|looking) forward to (?:\w+ing|your|the|our|a|an|meeting|seeing)\b/i],
  },
  {
    id: "upon-ing",
    name: "Upon / On + -ing",
    pattern: "Upon + -ing / noun, …",
    when: "Two actions happen at the same moment: the second follows immediately after the first.",
    where: ["T1 · Background"],
    task: "T1",
    examples: [
      "Upon arriving at the hotel, I was told that my room was not ready.",
      "On opening the parcel, I discovered that the screen was cracked.",
      "Upon arrival, guests are asked to show photo identification.",
    ],
    mistake: {
      wrong: "Upon reaching restaurant, I noticed my wallet was gone.",
      right: "Upon reaching the restaurant, I noticed my wallet was gone.",
      why: "The structure is fine, but don't forget the article.",
    },
    detect: [/(?:^|[.!?;]\s*)(?:upon|on) \w+ing\b/i, /\bupon (?:arrival|receipt|completion|request|return|entry|inspection)\b/i],
  },
  {
    id: "only-when",
    name: "Emphasis: It was only when… that…",
    pattern: "It was only when / after + clause + that + clause",
    when: "For a delayed or surprising realisation in a story: you noticed something LATER.",
    where: ["T1 · Background"],
    task: "T1",
    examples: [
      "It was only when I reached the airport that I realised I had left my keys.",
      "It was only after I had paid that I noticed the price was wrong.",
      "Not until I got home did I discover the damage.",
    ],
    mistake: {
      wrong: "Only when I reached home I noticed the damage.",
      right: "It was only when I reached home that I noticed the damage.",
      why: "Either use the full 'It was only when… that' frame or invert the verb ('did I notice').",
    },
    detect: [/\bit (?:was|is) only (?:when|after|once|then|at|on|later)\b/i, /\bnot until\b/i, /\bonly (?:when|after|once) [^.]*?,? (?:did|was|were|had|do|does) (?:i|we|they|he|she|it|you)\b/i],
  },
  {
    id: "having-v3",
    name: "Having + past participle",
    pattern: "Having + V3, subject + verb  /  Having been + V3, …",
    when: "To show one action finished BEFORE another, in one smooth sentence. Same subject in both parts.",
    where: ["T1 · Background", "T2 · Body"],
    task: "Both",
    examples: [
      "Having travelled to Berlin for Christmas, I stayed at your hotel for nine nights.",
      "Having worked in retail for five years, I am confident in dealing with customers.",
      "Having been a member for over a decade, I was disappointed by the new rules.",
    ],
    mistake: {
      wrong: "Having finished my exams, the holiday started.",
      right: "Having finished my exams, I went on holiday.",
      why: "The subject after the comma must be the person who did the 'having' action.",
    },
    detect: [new RegExp(`(?:^|[.!?;,]\\s*)(?:not )?having (?:not |never |just |already |recently )?(?:been |)${V3}\\b`, "i")],
  },
  {
    id: "third-conditional",
    name: "Third conditional (past that didn't happen)",
    pattern: "If + had + V3, would/could have + V3  /  …; otherwise I would have + V3",
    when: "For an imaginary PAST: what would have happened. Use it to explain consequences in complaints and apologies.",
    where: ["T1 · Problem", "T2 · Body"],
    task: "Both",
    examples: [
      "If I had returned to the hotel, I would have missed my flight.",
      "I took a taxi; otherwise I would have been late for the interview.",
      "Had I known about the roadworks, I would have booked elsewhere.",
    ],
    mistake: {
      wrong: "If I did not take a taxi, I would be late.",
      right: "If I had not taken a taxi, I would have been late.",
      why: "The event is finished, so you need had + V3 and would have + V3.",
    },
    detect: [
      /\bif\b[^.]*\bhad\b[^.]*\b(?:would|could|might)(?: not|n't| never| certainly| definitely| probably| still| easily)? have\b/i,
      /\b(?:would|could|might)(?: not|n't| never| certainly| definitely| probably)? have\b[^.]*\bif\b[^.]*\bhad\b/i,
      /\botherwise,? [^.]*\b(?:would|could|might)(?: not|n't| never| certainly| definitely| probably)? have\b/i,
      /(?:^|[.!?;]\s*)had (?:i|we|you|they|he|she|it|the \w+|my \w+|your \w+|our \w+|their \w+)(?: not| only)? \w+[^.]*\b(?:would|could|might)\b/i,
    ],
  },
  {
    id: "nondefining-relative",
    name: "Relative clauses (, which / , who)",
    pattern: "Noun, which/who/where/whose + clause, …",
    when: "To add extra detail about something already identified: describing items, people and places.",
    where: ["T1 · Describing", "T2 · Body"],
    task: "Both",
    examples: [
      "The bag, which is navy blue with a brown strap, contains my laptop.",
      "My sister, who lives in Berlin, recommended your hotel.",
      "Many young people move to cities, where jobs are easier to find.",
    ],
    mistake: {
      wrong: "I lost blue bag which has laptop inside.",
      right: "I lost a blue bag, which contains my laptop.",
      why: "Use articles before singular nouns; commas around extra information.",
    },
    detect: [/,\s*(?:which|who|whom|whose|where|when)\b/i],
  },
  {
    id: "reason-linkers",
    name: "Reason linkers (beyond 'because')",
    pattern: "as / since + clause  ·  due to / owing to + noun  ·  due to the fact that + clause",
    when: "Whenever you give a reason. Mixing them shows range and avoids repeating 'because'.",
    where: ["T1 · Problem", "T2 · Body"],
    task: "Both",
    examples: [
      "I was unable to return, as my flight was departing at noon.",
      "Owing to a family emergency, I will not be able to attend the meeting.",
      "Due to the fact that public transport is unreliable, many people drive.",
    ],
    mistake: {
      wrong: "Due to it was raining, the match was cancelled.",
      right: "Due to the rain / Due to the fact that it was raining, the match was cancelled.",
      why: "'Due to' is followed by a noun, not a full clause.",
    },
    detect: [
      /\b(?:due to|owing to|on account of|because of|in view of|given that|seeing that|as a result of)\b/i,
      /(?:^|[.!?;,]\s*)(?:as|since) (?:i|we|you|they|he|she|it|the|my|our|this|these|there|many|most|people|children|governments?|a|an|your|their|such)\b/i,
    ],
  },
  {
    id: "purpose",
    name: "Purpose: in order to / so that",
    pattern: "in order (not) to + verb  ·  so as (not) to + verb  ·  so that + can/could/will/would",
    when: "To say WHY someone does something (the aim). Very common in both tasks.",
    where: ["T1 · Background", "T2 · Body"],
    task: "Both",
    examples: [
      "I checked out early in order to catch my flight.",
      "I left a note so as not to disturb my neighbours.",
      "Governments should invest in buses so that fewer people need to drive.",
    ],
    mistake: {
      wrong: "I came here for study English.",
      right: "I came here in order to study English.",
      why: "'For' + verb is wrong; use 'to' / 'in order to' for purpose.",
    },
    detect: [/\b(?:in order (?:not )?to|so as (?:not )?to|in order that|with a view to)\b/i, /\bso that\b/i],
  },
  {
    id: "passive",
    name: "Passive voice",
    pattern: "be (am/is/was/has been/will be…) + V3",
    when: "When the action matters more than who did it, or the doer is unknown. Sounds formal and objective.",
    where: ["T1 · Background / Problem", "T2 · Body"],
    task: "Both",
    examples: [
      "I was informed that the item had already been dispatched.",
      "The heating has not been repaired despite several requests.",
      "Stricter laws should be introduced to protect wildlife.",
    ],
    mistake: {
      wrong: "My car was damage in the car park.",
      right: "My car was damaged in the car park.",
      why: "The passive always needs the past participle (V3).",
    },
    detect: [new RegExp(`\\b(?:am|is|are|was|were|be|been|being)\\s+(?:not\\s+)?(?:\\w+ly\\s+)?(?:${V3.slice(3, -1)}|given|taken|chosen|stolen|broken|driven|eaten|spoken|offered|informed|told)\\b`, "i")],
  },
  {
    id: "past-perfect",
    name: "Past perfect for earlier past",
    pattern: "had + V3 (the earlier action)  +  past simple (the later action)",
    when: "In stories, for an action that happened BEFORE another past action.",
    where: ["T1 · Background"],
    task: "T1",
    examples: [
      "When I opened the box, I realised that I had ordered the wrong size.",
      "By the time the engineer arrived, the water had already damaged the floor.",
      "I had booked the room three months in advance.",
    ],
    mistake: {
      wrong: "When I reached the airport, I realised I left my keys.",
      right: "When I reached the airport, I realised I had left my keys.",
      why: "Leaving the keys happened first, so it needs had + V3.",
    },
    detect: [new RegExp(`\\bhad (?:already |just |never |not |previously |recently |only |since |also )?${V3}\\b`, "i")],
  },
  {
    id: "apology",
    name: "Apologising formally",
    pattern: "I apologise for + -ing / noun  ·  Please accept my apologies for…  ·  I am sorry to have to…",
    when: "Apology letters, or when you cancel, delay or cause inconvenience.",
    where: ["T1 · Opening", "T1 · Closing"],
    task: "T1",
    examples: [
      "I sincerely apologise for missing the meeting on Monday.",
      "Please accept my apologies for any inconvenience this may cause.",
      "I am sorry to have to cancel our appointment at such short notice.",
    ],
    mistake: {
      wrong: "I apologise to miss the meeting.",
      right: "I apologise for missing the meeting.",
      why: "'Apologise for' + -ing (or a noun).",
    },
    detect: [
      /\b(?:i|we) (?:sincerely |deeply |must |truly |really )?apologi[sz]e (?:for|that|to you)\b/i,
      /\b(?:like|wish|want|must|need) to apologi[sz]e\b/i,
      /\b(?:please accept|accept) my (?:sincere |deepest |humble )?apologies\b/i,
      /\bi(?: am|'m) (?:really |very |so |terribly |truly |extremely )?sorry (?:for|about|that|to)\b/i,
      /\bmy (?:sincere |deepest )?apologies for\b/i,
    ],
  },

  // ───────────── TASK 2 (and both) ─────────────
  {
    id: "concession",
    name: "Concession: although / despite",
    pattern: "Although / Even though + clause  ·  Despite / In spite of + noun / -ing",
    when: "To admit the other side before giving your view. Essential for balanced Task 2 arguments.",
    where: ["T2 · Body", "T2 · Conclusion", "T1 · Problem"],
    task: "Both",
    examples: [
      "Although online learning is convenient, it cannot fully replace classroom interaction.",
      "Despite spending millions on roads, the city still suffers from congestion.",
      "Even though I reported the fault twice, nobody has contacted me.",
    ],
    mistake: {
      wrong: "Although it is expensive, but it is worth it.",
      right: "Although it is expensive, it is worth it.",
      why: "Never use 'although' and 'but' in the same sentence.",
    },
    detect: [/\b(?:although|even though|though|despite|in spite of|notwithstanding|even if|admittedly|granted that)\b/i],
  },
  {
    id: "contrast",
    name: "Contrast: whereas / on the other hand",
    pattern: "Clause, whereas + clause  ·  While + clause, …  ·  On the other hand, …",
    when: "To compare two sides directly — perfect for 'discuss both views' and advantages/disadvantages essays.",
    where: ["T2 · Body", "T2 · Introduction"],
    task: "T2",
    examples: [
      "Some people prefer to rent, whereas others believe buying is a better investment.",
      "While cars offer freedom, they also contribute heavily to pollution.",
      "On the other hand, working from home can lead to isolation.",
    ],
    mistake: {
      wrong: "Whereas some people like cities. Others like villages.",
      right: "Whereas some people like cities, others prefer villages.",
      why: "'Whereas' joins two clauses in ONE sentence.",
    },
    detect: [/\b(?:whereas|on the other hand|by contrast|in contrast|conversely|however|nevertheless|nonetheless|on the contrary)\b/i, /(?:^|[.!?;,]\s*)while\b/i],
  },
  {
    id: "not-only",
    name: "Not only… but also",
    pattern: "not only A but also B  ·  Not only + auxiliary + subject + verb, but…",
    when: "To add a second, stronger point. The inverted form at the start of a sentence is very high-band.",
    where: ["T2 · Body", "T1 · Problem"],
    task: "Both",
    examples: [
      "Cycling is not only cheap but also good for your health.",
      "Not only does tourism create jobs, but it also funds local services.",
      "The delay not only cost me money but also caused me considerable stress.",
    ],
    mistake: {
      wrong: "Not only tourism creates jobs but also it funds services.",
      right: "Not only does tourism create jobs, but it also funds services.",
      why: "At the start of a sentence, 'Not only' needs inversion (does + subject + verb).",
    },
    detect: [/\bnot only\b/i],
  },
  {
    id: "first-conditional",
    name: "Real conditional: if / unless / provided that",
    pattern: "If / Unless / Provided that + present, will / can / may + verb",
    when: "For realistic consequences and solutions: 'If X happens, Y will happen'.",
    where: ["T2 · Body", "T2 · Conclusion", "T1 · Request"],
    task: "Both",
    examples: [
      "If governments raise fuel taxes, more people will use public transport.",
      "Unless action is taken now, many species will disappear.",
      "Provided that the room is available, I will arrive on the 12th.",
    ],
    mistake: {
      wrong: "If the government will invest more, crime will fall.",
      right: "If the government invests more, crime will fall.",
      why: "No 'will' in the if-clause; use the present simple.",
    },
    detect: [
      /\b(?:if|unless|provided (?:that)?|providing (?:that)?|as long as|on condition that)\b[^.]*\b(?:will|can|may|is likely to|are likely to|is going to|are going to)\b/i,
      /\b(?:will|can|may)\b[^.]*\b(?:if|unless|provided (?:that)?|as long as)\b(?![^.]*\bwould\b)/i,
    ],
  },
  {
    id: "second-conditional",
    name: "Hypothetical: If… were / would",
    pattern: "If + past simple / were to + verb, would / could + verb",
    when: "For imaginary or unlikely situations now/future — great for 'what would happen if' arguments.",
    where: ["T2 · Body", "T1 · Informal"],
    task: "Both",
    examples: [
      "If public transport were free, far fewer people would drive to work.",
      "Were governments to ban junk-food advertising, obesity rates could fall.",
      "If I had more time, I would happily help with the wedding.",
    ],
    mistake: {
      wrong: "If public transport would be free, people would use it.",
      right: "If public transport were free, people would use it.",
      why: "No 'would' in the if-clause; use past simple or 'were'.",
    },
    detect: [
      /\bif\b[^.,]*,[^.]*\b(?:would|could|might)\b(?!(?: not| never| certainly| definitely| probably| still| easily)? have (?:been|\w+ed|\w+en|done|gone|made|seen|told|had|bought|taken|known|got|met|left|lost|paid|sent|spent|kept|found|become)\b)(?! be grateful)(?! appreciate)/i,
      /\b(?:would|could|might)\b(?!(?: not| never| certainly| definitely| probably| still| easily)? have (?:been|\w+ed|\w+en|done|gone|made|seen|told|had|bought|taken|known|got|met|left|lost|paid|sent|spent|kept|found|become)\b)(?! be grateful)(?! appreciate)[^.]*\bif (?!you could|you would)[^.]*\b(?:were|was|did|had|\w+ed|took|ate|spent|taught|lived|read|went|knew|got|made)\b/i,
      /(?:^|[.!?;,]\s*)were (?:\w+ ){1,2}(?:not )?to\b/i,
    ],
  },
  {
    id: "cleft",
    name: "Cleft sentences (What… is…)",
    pattern: "What + clause + is/was + …  ·  It is X that…  ·  The reason why… is that…",
    when: "To put emphasis on the key idea. Great for topic sentences and strong opinions.",
    where: ["T2 · Body", "T2 · Conclusion", "T1 · Problem"],
    task: "Both",
    examples: [
      "What concerns me most is the lack of safety on the platform.",
      "It is the government, not individuals, that should pay for this.",
      "The main reason why people move abroad is that wages are higher.",
    ],
    mistake: {
      wrong: "What I want to say it is that the service was poor.",
      right: "What I want to say is that the service was poor.",
      why: "The 'what' clause IS the subject — don't add 'it'.",
    },
    detect: [
      /(?:^|[.!?;]\s*)what [^.]*\b(?:is|was|are|were)\b/i,
      /\bit (?:is|was) (?:the|not|only(?! when| after| once| then)|precisely|this|these|parents|teachers|governments?|individuals|people)\b[^.]*?\b(?:that|who)\b/i,
      /\bthe (?:main |real |key |primary |simple |only )?reason (?:why )?[^.]*\b(?:is|was) that\b/i,
      /(?:^|[.!?;]\s*)all (?:i|we) [^.]*\b(?:is|was)\b/i,
    ],
  },
  {
    id: "impersonal",
    name: "Impersonal structures (It is believed that…)",
    pattern: "It is widely believed / argued that…  ·  It is essential that…  ·  There is little doubt that…",
    when: "To sound objective and academic, especially in introductions and when reporting others' views.",
    where: ["T2 · Introduction", "T2 · Body"],
    task: "T2",
    examples: [
      "It is widely believed that technology has made people less sociable.",
      "It is essential that children learn to manage money from an early age.",
      "There is little doubt that air pollution harms public health.",
    ],
    mistake: {
      wrong: "It is believed by many people think that…",
      right: "It is widely believed that… / Many people think that…",
      why: "Choose ONE structure: impersonal passive OR active.",
    },
    detect: [
      /\bit (?:is|was|has been|could be|can be|may be|might be|would be|must be) (?:widely |generally |commonly |often |increasingly |universally |frequently |sometimes )?(?:believed|argued|accepted|thought|said|claimed|recognised|recognized|acknowledged|known|felt|agreed|expected|estimated|reported|suggested|considered|assumed)\b/i,
      /\bit (?:is|seems|appears|would seem|would appear|has become|was)(?: absolutely| clearly| highly| increasingly| particularly| especially)? (?:essential|vital|crucial|important|imperative|clear|evident|undeniable|apparent|likely|unlikely|true|obvious|necessary|advisable|worth noting|undeniable|questionable|debatable|understandable|unfair|unrealistic|reasonable) (?:that|to|for|whether)\b/i,
      /\bthere is (?:little|no|growing|considerable|some|much|strong|clear) (?:doubt|evidence|denying|question|reason)\b/i,
    ],
  },
  {
    id: "the-more",
    name: "The more…, the more…",
    pattern: "The + comparative + clause, the + comparative + clause",
    when: "To show two things change together. Short, memorable and high-band.",
    where: ["T2 · Body", "T2 · Conclusion"],
    task: "T2",
    examples: [
      "The more time children spend online, the less they exercise.",
      "The higher the price of fuel, the fewer people drive.",
      "The earlier a language is learnt, the easier it becomes.",
    ],
    mistake: {
      wrong: "More people drive, more pollution there is.",
      right: "The more people drive, the more pollution there is.",
      why: "Both halves need 'the'.",
    },
    detect: [/\bthe (?:more|less|fewer|greater|higher|lower|longer|shorter|bigger|smaller|better|worse|earlier|later|\w+er)\b[^.]*,\s*the (?:more|less|fewer|greater|higher|lower|longer|shorter|bigger|smaller|better|worse|earlier|later|\w+er)\b/i],
  },
  {
    id: "participle-result",
    name: "Participle clauses (…, resulting in…)",
    pattern: "Clause, resulting in / leading to / causing + noun  ·  Faced with X, subject + verb",
    when: "To link a cause and its result in one sophisticated sentence instead of two short ones.",
    where: ["T2 · Body", "T1 · Problem"],
    task: "Both",
    examples: [
      "Many factories have moved abroad, leading to high unemployment in some regions.",
      "The flight was delayed by six hours, resulting in a missed connection.",
      "Faced with rising rents, many young people are forced to live with their parents.",
    ],
    mistake: {
      wrong: "Many factories closed, it leads to unemployment.",
      right: "Many factories closed, leading to unemployment.",
      why: "Two clauses joined by a comma alone is a comma splice; the participle fixes it.",
    },
    detect: [
      /,\s*(?:thus |thereby )?(?:resulting in|leading to|causing|making|allowing|enabling|forcing|giving|creating|reducing|increasing|preventing|meaning that|contributing to|putting|leaving)\b/i,
      /(?:^|[.!?;]\s*)(?:faced with|confronted with|compared (?:with|to)|left with|driven by|encouraged by|built|designed|used|seen|lacking|living|working|struggling) [^.]*,/i,
    ],
  },
  {
    id: "hedging",
    name: "Hedging: arguably / tend to / to some extent",
    pattern: "arguably · tend to + verb · to some extent · is likely to · may well",
    when: "To avoid over-generalising. Examiners reward cautious, precise claims in Task 2.",
    where: ["T2 · Body", "T2 · Introduction"],
    task: "T2",
    examples: [
      "Arguably, the internet has done more for education than any invention since printing.",
      "Older people tend to be less comfortable with online banking.",
      "To some extent, I agree that advertising encourages waste.",
    ],
    mistake: {
      wrong: "All young people are addicted to their phones.",
      right: "Many young people tend to spend too much time on their phones.",
      why: "Absolute claims ('all', 'always', 'never') weaken your argument.",
    },
    detect: [
      /\b(?:arguably|to (?:some|a certain|a large|a great|a lesser|what) (?:extent|degree)|tends? to|in many cases|it is (?:likely|possible|probable) that|(?:may|might|could) well|(?:is|are) (?:likely|unlikely) to|appears? to|seems? to|in most cases|more often than not|by and large)\b/i,
    ],
  },
];

export const STRUCTURE_BY_ID = Object.fromEntries(STRUCTURES.map((s) => [s.id, s]));

/** normalise abbreviations so '.' only ends sentences */
export function norm(text: string): string {
  return text
    .replace(/\b([ap])\.m\./gi, "$1m")
    .replace(/\b(Mr|Mrs|Ms|Dr|St|etc|e\.g|i\.e)\./gi, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

export function uses(s: Structure, text: string): boolean {
  const t = norm(text);
  return s.detect.some((re) => re.test(t));
}

export function detectStructures(text: string): string[] {
  return STRUCTURES.filter((s) => uses(s, text)).map((s) => s.id);
}
