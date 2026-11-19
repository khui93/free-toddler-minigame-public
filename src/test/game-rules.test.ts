import { describe, expect, it } from "vitest";
import { letterRound, numberLevelRound, nameCompletionDestination } from "@/lib/name";
import { PHONICS } from "@/lib/phonics";
describe("updated learning rules", () => {
  it("the letter changes even with the same random draw", () => {
    for (const letter of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') expect(letterRound(letter).target).not.toBe(letter);
  });
  it("shows all 26 letters before repeating, across multiple decks", () => {
    let round = letterRound();
    for (let cycle = 0; cycle < 3; cycle++) {
      const targets: string[] = [];
      for (let i = 0; i < 26; i++) {
        targets.push(round.target);
        const next = letterRound(round.target, Math.random, round.remaining);
        expect(next.target).not.toBe(round.target);
        round = next;
      }
      expect([...targets].sort().join('')).toBe('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    }
  });
  it("supports uppercase and lowercase questions", () => {
    expect(letterRound(undefined, () => 0).uppercase).toBe(true);
    expect(letterRound(undefined, () => 0.99).uppercase).toBe(false);
  });
  it("level 1 has exactly one missing number", () => expect(numberLevelRound(1).missing).toHaveLength(1));
  it("level 2 has two or three missing numbers", () => {
    expect(numberLevelRound(2, () => 0).missing).toHaveLength(2);
    expect(numberLevelRound(2, () => 0.99).missing).toHaveLength(3);
  });
  it("level 3 completes 1–20 with exactly ten blanks and ten hints", () => {
    const r = numberLevelRound(3);
    expect(r.seq).toEqual(Array.from({ length: 20 }, (_, i) => i + 1));
    expect(r.missing).toHaveLength(10);
    expect(new Set(r.missing).size).toBe(10);
  });
  it("all number sequences stay inside 1–20", () => {
    
    for (const level of [1, 2, 3] as const) for (let i = 0; i < 50; i++) {
      const r = numberLevelRound(level);
      expect(Math.min(...r.seq)).toBeGreaterThanOrEqual(1);
      expect(Math.max(...r.seq)).toBeLessThanOrEqual(20);
    }
  });
  it("each name game completes to the name-game menu", () => expect(nameCompletionDestination()).toBe('/games/my-name'));
  it("level 3 shuffles only the ten missing numbers without duplicates", () => {
    const round = numberLevelRound(3, () => 0);
    expect(round.choices).toHaveLength(10);
    expect(new Set(round.choices).size).toBe(10);
    expect([...round.choices].sort((a, b) => a - b)).toEqual(round.missing.map((i) => round.seq[i]));
    expect(round.choices).not.toEqual(round.missing.map((i) => round.seq[i]));
    expect(numberLevelRound(3, () => 0.5).choices).not.toEqual(round.choices);
  });
  it("every alphabet picture word begins with its letter", () => {
    expect(PHONICS).toHaveLength(26);
    PHONICS.forEach((item, i) => expect(item.word[0]).toBe(String.fromCharCode(97 + i)));
  });
});
