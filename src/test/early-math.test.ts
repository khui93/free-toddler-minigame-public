import { describe, expect, it } from "vitest";
import { appleRound, countCritter, countingRound, initialApples, moveApple, numberFinderRound, type MathRange } from "@/lib/name";

describe("number finder", () => {
  it("covers numerals 1–20 exactly once before repeating", () => {
    let round = numberFinderRound();
    for (let cycle = 0; cycle < 3; cycle++) {
      const seen: number[] = [];
      for (let i = 0; i < 20; i++) {
        seen.push(round.target);
        expect(round.choices).toHaveLength(4);
        expect(new Set(round.choices).size).toBe(4);
        expect(round.choices).toContain(round.target);
        const next = numberFinderRound(round.remaining, round.target);
        expect(next.target).not.toBe(round.target);
        round = next;
      }
      expect(seen.sort((a, b) => a - b)).toEqual(Array.from({ length: 20 }, (_, i) => i + 1));
    }
  });
});

describe("count the critters", () => {
  it("each animal counts once even with repeated taps", () => {
    let counted: number[] = [];
    for (const id of [0, 0, 0, 1, 1, 2, 2]) counted = countCritter(counted, id, 3);
    expect(counted).toEqual([0, 1, 2]);
    expect(countCritter(counted, 3, 3)).toBe(counted);
    expect(countCritter(counted, -1, 3)).toBe(counted);
  });
  it.each([5, 10, 20] as MathRange[])("supports the 1–%i range", (max) => {
    expect(countingRound(max, () => 0).total).toBe(1);
    const round = countingRound(max, () => 0.999);
    expect(round.total).toBe(max);
    expect(new Set(round.critters).size).toBe(max);
    expect(round.choices).toContain(max);
  });
});

describe("apple basket", () => {
  it.each([5, 10, 20] as MathRange[])("addition and subtraction stay within %i", (max) => {
    for (const operation of ["add", "subtract"] as const) for (let i = 0; i < 100; i++) {
      const round = appleRound(max, operation);
      expect(round.answer).toBe(operation === "add" ? round.first + round.second : round.first - round.second);
      expect(round.answer).toBeGreaterThanOrEqual(0);
      expect(round.answer).toBeLessThanOrEqual(max);
      expect(round.choices).toContain(round.answer);
      expect(new Set(round.choices).size).toBe(3);
      expect(Math.min(...round.choices)).toBeGreaterThanOrEqual(0);
      expect(Math.max(...round.choices)).toBeLessThanOrEqual(max);
    }
  });
  it("subtraction can result in zero", () => {
    const round = appleRound(5, "subtract", () => 0.999);
    expect(round.first).toBe(5); expect(round.second).toBe(5); expect(round.answer).toBe(0);
  });
  it("addition moves each apple once and stops after the requested amount", () => {
    const round = appleRound(5, "add", () => 0.999);
    let state = initialApples(round);
    expect(state.inside).toHaveLength(4);
    expect(moveApple(state, 0, round)).toBe(state);
    state = moveApple(state, 4, round);
    expect(state.inside).toHaveLength(5);
    expect(state.moved).toEqual([4]);
    expect(moveApple(state, 4, round)).toBe(state);
  });
  it("subtraction removes one per tap and ignores repeated or invalid taps", () => {
    const round = appleRound(5, "subtract", () => 0.999);
    let state = initialApples(round);
    for (let id = 0; id < 5; id++) {
      state = moveApple(state, id, round);
      const duplicate = moveApple(state, id, round);
      expect(duplicate).toBe(state);
      expect(state.inside).toHaveLength(4 - id);
    }
    expect(state.inside).toHaveLength(0);
    expect(moveApple(state, 5, round)).toBe(state);
  });
});