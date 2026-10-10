import { describe, it, expect } from "vitest";
import { evaluate, runMatching } from "@/lib/matching";

describe("matching on synthetic dataset", () => {
  it("finds exact token matches between A and B", () => {
    expect(runMatching("A", "B", "exact").map((c) => c.id).sort()).toEqual(["HA-1001::HB-2001", "HA-1005::HB-2004"]);
  });
  it("approximate mode excludes exact matches", () => {
    expect(runMatching("A", "B", "approximate").every((c) => c.category === "Approximate name")).toBe(true);
  });
  it("evaluation metrics come from ground truth", () => {
    const m = evaluate();
    expect([m.tp, m.fp, m.fn]).toEqual([8, 1, 2]);
    expect(m.precision).toBeCloseTo(8 / 9);
    expect(m.recall).toBeCloseTo(0.8);
  });
});
