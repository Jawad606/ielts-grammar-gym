import type { Exercise, ExerciseTuple } from "../lib/types.ts";
import { T1A } from "./ex/t1a.ts";
import { T1B } from "./ex/t1b.ts";
import { MIXED } from "./ex/mixed.ts";
import { T2A } from "./ex/t2a.ts";
import { T2B } from "./ex/t2b.ts";

const ALL: Record<string, ExerciseTuple[]> = { ...T1A, ...T1B, ...MIXED, ...T2A, ...T2B };

export const EXERCISES: Exercise[] = Object.entries(ALL).flatMap(([structureId, list]) =>
  list.map(([situation, model, ctx], i) => ({ id: `${structureId}-${i + 1}`, structureId, situation, model, ctx })),
);
