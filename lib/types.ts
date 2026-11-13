export type Ctx = "T1F" | "T1S" | "T1I" | "T2O" | "T2D" | "T2A" | "T2P" | "T2Q";

export const CTX_LABEL: Record<Ctx, string> = {
  T1F: "Task 1 · Formal letter",
  T1S: "Task 1 · Semi-formal letter",
  T1I: "Task 1 · Informal letter",
  T2O: "Task 2 · Opinion essay",
  T2D: "Task 2 · Discuss both views",
  T2A: "Task 2 · Advantages / disadvantages",
  T2P: "Task 2 · Problem / solution",
  T2Q: "Task 2 · Two-part question",
};

export type Structure = {
  id: string;
  name: string;
  pattern: string;
  when: string;
  where: string[];
  task: "T1" | "T2" | "Both";
  examples: string[];
  mistake: { wrong: string; right: string; why: string };
  detect: RegExp[];
};

/** [situation, model answer, context] */
export type ExerciseTuple = [string, string, Ctx];

export type Exercise = {
  id: string;
  structureId: string;
  situation: string;
  model: string;
  ctx: Ctx;
};

export type ErrorRule = {
  id: string;
  re: RegExp;
  msg: string;
  fix: string;
  /** only flag in these contexts (default: all) */
  only?: "formal";
};

export type FixItem = { wrong: string; right: string[]; tip: string };

export type Vocab = {
  word: string;
  pos: string;
  meaning: string;
  example: string;
  topic: string;
  use: "T1" | "T2" | "Both";
  instead?: string;
  collocations?: string[];
};
