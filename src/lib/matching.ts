import { records as allRecords, type HospitalId, type TokenizedRecord } from "./data";

export type MatchCategory = "Exact token" | "Approximate name";
export type MatchMode = "exact" | "approximate";

export interface Candidate {
  id: string;
  source: TokenizedRecord;
  target: TokenizedRecord;
  category: MatchCategory;
  confidence: number;
  explanation: string[];
}

export const pairKey = (a: string, b: string) => [a, b].sort().join("::");

/** Compares opaque tokens only. Never sees raw identifiers. */
export function runMatching(
  source: HospitalId,
  target: HospitalId,
  mode: MatchMode,
  records: TokenizedRecord[] = allRecords,
): Candidate[] {
  const src = records.filter((r) => r.hospital === source);
  const tgt = records.filter((r) => r.hospital === target);
  const out: Candidate[] = [];
  for (const s of src) {
    for (const t of tgt) {
      if (s.exactToken === t.exactToken) {
        if (mode === "exact")
          out.push({
            id: pairKey(s.ref, t.ref), source: s, target: t, category: "Exact token", confidence: 0.99,
            explanation: ["Full identity token (name + DOB + sex) is identical"],
          });
      } else if (
        mode === "approximate" &&
        s.phoneticToken === t.phoneticToken &&
        s.dobToken === t.dobToken &&
        s.sex === t.sex
      ) {
        out.push({
          id: pairKey(s.ref, t.ref), source: s, target: t, category: "Approximate name", confidence: 0.82,
          explanation: ["Phonetic name token matches", "Date-of-birth token matches", "Sex matches", "Full identity token differs — possible spelling variant"],
        });
      }
    }
  }
  return out;
}

export const hospitalPairs: [HospitalId, HospitalId][] = [["A", "B"], ["A", "C"], ["B", "C"]];

export function allCandidates(records: TokenizedRecord[] = allRecords): Candidate[] {
  return hospitalPairs.flatMap(([a, b]) => [
    ...runMatching(a, b, "exact", records),
    ...runMatching(a, b, "approximate", records),
  ]);
}

export interface Metrics { tp: number; fp: number; fn: number; precision: number; recall: number; f1: number; }

/** Scores candidates against the synthetic ground truth (truthId). */
export function evaluate(records: TokenizedRecord[] = allRecords): Metrics {
  const found = allCandidates(records);
  const foundKeys = new Set(found.map((c) => c.id));
  const tp = found.filter((c) => c.source.truthId === c.target.truthId).length;
  const fp = found.length - tp;
  let fn = 0;
  for (const [a, b] of hospitalPairs) {
    for (const s of records.filter((r) => r.hospital === a))
      for (const t of records.filter((r) => r.hospital === b))
        if (s.truthId === t.truthId && !foundKeys.has(pairKey(s.ref, t.ref))) fn++;
  }
  const precision = tp + fp ? tp / (tp + fp) : 0;
  const recall = tp + fn ? tp / (tp + fn) : 0;
  const f1 = precision + recall ? (2 * precision * recall) / (precision + recall) : 0;
  return { tp, fp, fn, precision, recall, f1 };
}
