import { describe, expect, it } from "vitest";
import { decoyNames, isNextLetter, numberRound, validateName } from "@/lib/name";

describe("name rules", () => {
  it("accepts 2 and 15 letters", () => {
    expect(validateName("Al")).toBeNull();
    expect(validateName("A".repeat(15))).toBeNull();
  });
  it("rejects 1 or 16 letters", () => {
    expect(validateName("A")).not.toBeNull();
    expect(validateName("A".repeat(16))).not.toBeNull();
  });
  it("rejects non-letters", () => {
    expect(validateName("Ma1a")).not.toBeNull();
    expect(validateName("Mary Jo")).not.toBeNull();
  });
  it("spells Maya with repeated A in order, case-insensitive", () => {
    expect(["M", "a", "Y", "A"].every((l, i) => isNextLetter("Maya", i, l))).toBe(true);
    expect(isNextLetter("Maya", 0, "a")).toBe(false);
  });
  it("handles Anna's repeated letters", () => {
    expect(["a", "n", "n", "a"].every((l, i) => isNextLetter("Anna", i, l))).toBe(true);
    expect(isNextLetter("Anna", 1, "a")).toBe(false);
  });
  it("decoys never equal the child's name", () => {
    for (let i = 0; i < 50; i++) expect(decoyNames("leo").map((n) => n.toLowerCase())).not.toContain("leo");
  });
  it("number rounds stay within 1–20", () => {
    for (let i = 0; i < 200; i++) {
      const r = numberRound();
      expect(Math.min(...r.seq, ...r.choices)).toBeGreaterThanOrEqual(1);
      expect(Math.max(...r.seq, ...r.choices)).toBeLessThanOrEqual(20);
      expect(r.choices).toContain(r.answer);
    }
  });
});
