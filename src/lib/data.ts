/**
 * SYNTHETIC DATA ONLY. No real patients.
 *
 * Tokens below are opaque placeholders that represent values a backend would
 * produce with HMAC-SHA-256 and a server-held secret. The browser never computes
 * tokens; it only compares opaque strings it was given.
 *
 * `truthId` is the ground-truth synthetic person id, used solely by the
 * Evaluation page to score matching quality against a known test set.
 */

export type HospitalId = "A" | "B" | "C";

export interface Hospital {
  id: HospitalId;
  name: string;
  city: string;
  status: "connected" | "degraded";
  lastSync: string;
  syncOk: boolean;
}

export interface TokenizedRecord {
  ref: string; // hospital-specific patient reference
  hospital: HospitalId;
  maskedName: string; // synthetic, masked display label
  sex: "F" | "M";
  birthYear: number;
  exactToken: string; // HMAC(name|dob|sex) simulated
  phoneticToken: string; // HMAC(phonetic(name)) simulated
  dobToken: string; // HMAC(dob) simulated
  truthId: string;
}

export const hospitals: Hospital[] = [
  { id: "A", name: "Hospital A — Northside General", city: "Synthetic City North", status: "connected", lastSync: "2026-10-10 06:40 UTC", syncOk: true },
  { id: "B", name: "Hospital B — Riverside Medical", city: "Synthetic City East", status: "connected", lastSync: "2026-10-10 05:12 UTC", syncOk: true },
  { id: "C", name: "Hospital C — Lakeview Clinic", city: "Synthetic City West", status: "degraded", lastSync: "2026-10-09 22:03 UTC", syncOk: false },
];

const r = (
  ref: string, hospital: HospitalId, maskedName: string, sex: "F" | "M", birthYear: number,
  exactToken: string, phoneticToken: string, dobToken: string, truthId: string,
): TokenizedRecord => ({ ref, hospital, maskedName, sex, birthYear, exactToken, phoneticToken, dobToken, truthId });

export const records: TokenizedRecord[] = [
  // Hospital A
  r("HA-1001", "A", "A. Rivera", "F", 1984, "e3f9a1c07e", "pR160", "d84a1", "S01"),
  r("HA-1002", "A", "M. Okafor", "M", 1971, "e71b0d9c2a", "pO216", "d71c3", "S02"),
  r("HA-1003", "A", "L. Chen", "F", 1990, "e0c44f81bd", "pC500", "d90f2", "S03"),
  r("HA-1004", "A", "R. Patel", "M", 1965, "e5a2ee3109", "pP340", "d65b7", "S04"),
  r("HA-1005", "A", "S. Novak", "F", 1999, "e9d8130c6f", "pN120", "d99e4", "S05"),
  r("HA-1006", "A", "J. Haddad", "M", 1958, "e2b67a54c1", "pH330", "d58d1", "S06"),
  r("HA-1007", "A", "K. Ito", "F", 1979, "e48f2c0b93", "pI300", "d79a6", "S07"),
  r("HA-1008", "A", "D. Mensah", "M", 2002, "e6c90b1d27", "pM520", "d02c8", "S08"),
  // Hospital B
  r("HB-2001", "B", "A. Rivera", "F", 1984, "e3f9a1c07e", "pR160", "d84a1", "S01"),
  r("HB-2002", "B", "M. Okafur", "M", 1971, "e8a03fd511", "pO216", "d71c3", "S02"), // typo
  r("HB-2003", "B", "L. Chan", "F", 1990, "e17d5b29ce", "pC500", "d90f2", "S09"), // different person
  r("HB-2004", "B", "S. Novak", "F", 1999, "e9d8130c6f", "pN120", "d99e4", "S05"),
  r("HB-2005", "B", "T. Berg", "M", 1988, "e40ae7b38d", "pB620", "d88b9", "S10"),
  r("HB-2006", "B", "K. Itoh-Lee", "F", 1979, "e5ce9902af", "pI340", "d79a6", "S07"), // name changed
  r("HB-2007", "B", "P. Silva", "F", 1993, "e0f61d4a8b", "pS410", "d93d5", "S11"),
  // Hospital C
  r("HC-3001", "C", "A. Rivera", "F", 1984, "e3f9a1c07e", "pR160", "d84a1", "S01"),
  r("HC-3002", "C", "R. Patel", "M", 1965, "e5a2ee3109", "pP340", "d65b7", "S04"),
  r("HC-3003", "C", "J. Hadad", "M", 1958, "eb93c7012e", "pH330", "d58d1", "S06"), // typo
  r("HC-3004", "C", "N. Abara", "F", 1976, "e72e18f0c4", "pA160", "d76e2", "S12"),
  r("HC-3005", "C", "T. Berg", "M", 1988, "e40ae7b38d", "pB620", "d88b9", "S10"),
  r("HC-3006", "C", "D. Mensah", "M", 2002, "ed41a6b9f0", "pM520", "d02a3", "S08"), // DOB entry error
];

export const recordsFor = (h: HospitalId) => records.filter((x) => x.hospital === h);

export const activity = [
  { day: "Oct 4", runs: 3, candidates: 5 },
  { day: "Oct 5", runs: 2, candidates: 3 },
  { day: "Oct 6", runs: 4, candidates: 7 },
  { day: "Oct 7", runs: 1, candidates: 2 },
  { day: "Oct 8", runs: 5, candidates: 8 },
  { day: "Oct 9", runs: 3, candidates: 4 },
  { day: "Oct 10", runs: 2, candidates: 6 },
];
