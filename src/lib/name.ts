import { CHINESE_THEMES, COMMON_CHINESE, FAMILY_ROLES, type ChineseTheme, type FamilyMember, type FamilyRole } from "./chinese-data";
export const NAME_RE = /^[A-Za-z]{2,15}$/;

export function validateChineseName(raw: string): string | null {
  const name = raw.trim();
  return /^[\p{Script=Han}]{1,4}$/u.test(name) ? null : "Please enter 1–4 Chinese characters only.";
}
export function chineseNameChoices(name: string, index: number, rand = Math.random) {
  const answer = [...name][index];
  if (!answer) return [];
  const characters = [...new Set([...name])];
  const decoys = shuffle(COMMON_CHINESE.filter(c => !characters.includes(c)), rand).slice(0, 4);
  return shuffle([...characters, ...decoys], rand);
}
export function nextChineseCharacter(name: string, filled: number, character: string) {
  return [...name][filled] !== undefined && [...name][filled] === character;
}
export function selectChineseName(name: string, filled: number, character: string) {
  const correct = nextChineseCharacter(name, filled, character);
  const next = correct ? filled + 1 : filled;
  return { correct, filled: next, completed: correct && next === [...name].length };
}
export function siblingRole(age: "elder" | "younger", gender: "brother" | "sister"): FamilyRole {
  return age === "elder" ? (gender === "brother" ? "哥哥" : "姐姐") : (gender === "brother" ? "弟弟" : "妹妹");
}
export function chineseRound(theme: ChineseTheme, remaining: string[] = [], rand = Math.random) {
  const characters = [...(CHINESE_THEMES.find(t => t.id === theme)?.characters ?? "")];
  const deck = remaining.length ? [...remaining] : shuffle(characters, rand);
  const target = deck[0] ?? "一";
  return { target, remaining: deck.slice(1), picturePrompt: rand() < 0.5, choices: shuffle([target, ...shuffle(characters.filter(c => c !== target), rand).slice(0, 3)], rand) };
}
export function familyRelation(role: FamilyRole) { return FAMILY_ROLES.find(m => m.role === role); }
export function familyRound(members: FamilyMember[], rand = Math.random) {
  const unique = members.filter((m, i) => members.findIndex(n => n.role === m.role) === i);
  const target = shuffle(unique, rand)[0];
  return target ? { target, picturePrompt: rand() < 0.5, choices: shuffle([target, ...shuffle(unique.filter(m => m.id !== target.id), rand).slice(0, 3)], rand) } : null;
}

export function validateName(raw: string): string | null {
  const v = raw.trim();
  if (!v) return "Please enter a name.";
  if (!/^[A-Za-z]+$/.test(v)) return "Please use letters A–Z only.";
  if (v.length < 2) return "Names need at least 2 letters.";
  if (v.length > 15) return "Names can have up to 15 letters.";
  return null;
}

export const sameLetter = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();

/** Spelling engine: a tapped letter is correct if it equals the next expected letter (case-insensitive). */
export function isNextLetter(name: string, filled: number, letter: string) {
  const expected = name[filled];
  return expected !== undefined && sameLetter(expected, letter);
}

const POOL = [
  "Leo", "Zara", "Omar", "Bella", "Finn", "Ivy", "Theo", "Ruby", "Max", "Luna",
  "Noah", "Ella", "Kai", "Mia", "Oscar", "Hazel", "Jude", "Nina", "Felix", "Rosa",
  "Quinn", "Tobias", "Wren", "Eli", "Sophie", "Hugo", "Penny", "Arlo", "Daisy", "Benjamin",
];

export function decoyNames(name: string, count = 2, rand = Math.random): string[] {
  const lower = name.toLowerCase();
  const pool = POOL.filter(
    (n) => n.toLowerCase() !== lower && n.charAt(0).toLowerCase() !== lower.charAt(0),
  );
  return shuffle(pool, rand).slice(0, count);
}

export function shuffle<T>(arr: T[], rand = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const left = a[i];
    const right = a[j];
    if (left !== undefined && right !== undefined) { a[i] = right; a[j] = left; }
  }
  return a;
}

export const titleCase = (n: string) => n.charAt(0).toUpperCase() + n.slice(1).toLowerCase();

export function letterRound(previous?: string, rand = Math.random, remaining: string[] = []) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const deck = remaining.length ? [...remaining] : shuffle(alphabet, rand);
  if (deck[0] === previous && deck.length > 1) {
    const first = deck[0];
    const second = deck[1];
    if (first && second) { deck[0] = second; deck[1] = first; }
  }
  const target = deck[0] ?? "A";
  return { target, remaining: deck.slice(1), uppercase: rand() < 0.5, choices: shuffle([target, ...shuffle(alphabet.filter((l) => l !== target), rand).slice(0, 3)], rand) };
}

export type NumberLevel = 1 | 2 | 3;
export function numberLevelRound(level: NumberLevel, rand = Math.random) {
  const length = level === 3 ? 20 : level === 2 ? 6 : 4;
  const start = level === 3 ? 1 : 1 + Math.floor(rand() * (21 - length));
  const seq = Array.from({ length }, (_, i) => start + i);
  const missingCount = level === 3 ? 10 : level === 2 ? 2 + Math.floor(rand() * 2) : 1;
  const missing = shuffle(seq.map((_, i) => i), rand).slice(0, missingCount).sort((a, b) => a - b);
  const choices = level === 3 ? shuffle(missing.map((i) => seq[i] ?? 1), rand) : [];
  return { seq, missing, choices };
}

export function numberChoices(answer: number, rand = Math.random) {
  return shuffle([answer, ...shuffle(Array.from({ length: 20 }, (_, i) => i + 1).filter((n) => n !== answer), rand).slice(0, 2)], rand);
}

export const nameCompletionDestination = () => "/games/my-name" as const;

/** Number sequence round: 4 consecutive numbers within 1–20, one missing. */
export function numberRound(rand = Math.random) {
  const start = 1 + Math.floor(rand() * 17); // 1..17 so start+3 <= 20
  const seq = [start, start + 1, start + 2, start + 3];
  const missingIndex = Math.floor(rand() * 4);
  const answer = seq[missingIndex] ?? start;
  const opts = new Set<number>([answer]);
  while (opts.size < 3) {
    const d = 1 + Math.floor(rand() * 20);
    opts.add(d);
  }
  return { seq, missingIndex, answer, choices: shuffle([...opts], rand) };
}

export type MathRange = 5 | 10 | 20;
export type MathOperation = "add" | "subtract";

export function numeralChoices(answer: number, max: number, count = 3, min = 1, rand = Math.random) {
  const pool = Array.from({ length: max - min + 1 }, (_, i) => i + min).filter((n) => n !== answer);
  return shuffle([answer, ...shuffle(pool, rand).slice(0, count - 1)], rand);
}

export function numberFinderRound(remaining: number[] = [], previous?: number, rand = Math.random) {
  const deck = remaining.length ? [...remaining] : shuffle(Array.from({ length: 20 }, (_, i) => i + 1), rand);
  if (deck[0] === previous && deck.length > 1) {
    const first = deck[0]; const second = deck[1];
    if (first !== undefined && second !== undefined) { deck[0] = second; deck[1] = first; }
  }
  const target = deck[0] ?? 1;
  return { target, remaining: deck.slice(1), choices: numeralChoices(target, 20, 4, 1, rand) };
}

export function countingRound(max: MathRange, rand = Math.random) {
  const total = 1 + Math.floor(rand() * max);
  return { total, critters: Array.from({ length: total }, (_, id) => id), choices: numeralChoices(total, max, 3, 1, rand) };
}

export function countCritter(counted: number[], id: number, total: number) {
  if (!Number.isInteger(id) || id < 0 || id >= total || counted.includes(id)) return counted;
  return [...counted, id];
}

export function appleRound(max: MathRange, operation: MathOperation, rand = Math.random) {
  const first = operation === "add" ? 1 + Math.floor(rand() * (max - 1)) : 1 + Math.floor(rand() * max);
  const second = 1 + Math.floor(rand() * (operation === "add" ? max - first : first));
  const answer = operation === "add" ? first + second : first - second;
  return { first, second, answer, operation, total: operation === "add" ? answer : first, choices: numeralChoices(answer, max, 3, 0, rand) };
}

export type AppleRound = ReturnType<typeof appleRound>;
export type AppleState = { inside: number[]; moved: number[] };
export function initialApples(round: AppleRound): AppleState {
  return { inside: Array.from({ length: round.first }, (_, i) => i), moved: [] };
}

export function moveApple(state: AppleState, id: number, round: AppleRound): AppleState {
  if (!Number.isInteger(id) || id < 0 || id >= round.total || state.moved.includes(id) || state.moved.length >= round.second) return state;
  const inside = state.inside.includes(id);
  if ((round.operation === "add" && inside) || (round.operation === "subtract" && !inside)) return state;
  return {
    inside: round.operation === "add" ? [...state.inside, id] : state.inside.filter((n) => n !== id),
    moved: [...state.moved, id],
  };
}

export type LogicLevel = 1 | 2 | 3;
export const SHAPES = ["circle", "square", "triangle", "rectangle", "oval", "star", "heart", "hexagon", "pentagon", "octagon"] as const;
export type ShapeName = typeof SHAPES[number];
export function levelShapes(level: LogicLevel): ShapeName[] { return SHAPES.slice(0, level === 1 ? 3 : level === 2 ? 5 : SHAPES.length); }
export function shapeRound(level: LogicLevel, rand = Math.random) {
  const shapes = shuffle(levelShapes(level), rand);
  return { shapes, outlines: shuffle(shapes, rand), target: shapes[0] ?? "circle" };
}
export function placeShape(placed: ShapeName[], selected: ShapeName | null, outline: ShapeName) {
  return selected === outline && !placed.includes(outline) ? [...placed, outline] : placed;
}
export const OBJECTS = ["cat", "dog", "bunny", "elephant", "apple", "banana", "grapes", "orange", "car", "bus", "plane", "train"] as const;
export const CLOTHES = ["shirt", "shorts", "dress", "shoes"] as const;
export const ROOM_ITEMS = { Kitchen: ["kettle", "pan", "plate", "kitchen-spoon"], "Living room": ["sofa", "television", "armchair", "coffee-table"], Bedroom: ["bed", "pillow", "wardrobe", "nightstand"] } as const;
export type PictureName = typeof OBJECTS[number] | typeof CLOTHES[number] | typeof ROOM_ITEMS[keyof typeof ROOM_ITEMS][number] | ShapeName | "ball" | "box" | "toothbrush" | "comb" | "soap" | "spoon" | "Red" | "Blue" | "Yellow" | "Green";
export type ToyRule = "color" | "size" | "type" | "room";
export type ToyItem = { id: number; picture: PictureName; category: string; color?: string | undefined; size?: string | undefined; rank?: number; sizeCount?: number };
export const TOY_COLORS = ["Red", "Blue", "Yellow", "Green"];
export function toyRound(level: LogicLevel, rule: ToyRule, rand = Math.random) {
  const count = level === 1 ? 2 : level === 2 ? 3 : 4;
  if (rule === "size") {
    const sizeCount = level === 1 ? 2 : level === 2 ? 3 : 5;
    const categories = Array.from({ length: sizeCount }, (_, i) => String(i + 1));
    const picture = OBJECTS[Math.floor(rand() * 4)] ?? "bunny";
    const items: ToyItem[] = categories.map((category, id) => ({ id, picture, category, rank: id + 1, sizeCount }));
    return { categories, items: shuffle(items, rand), rule };
  }
  const categories = shuffle(rule === "color" ? TOY_COLORS : rule === "room" ? Object.keys(ROOM_ITEMS) : ["Animals", "Vehicles", "Fruits", "Clothes"], rand).slice(0, rule === "room" && level > 1 ? 3 : count);
  const pools: Record<string, readonly PictureName[]> = { Animals: OBJECTS.slice(0, 4), Fruits: OBJECTS.slice(4, 8), Vehicles: OBJECTS.slice(8), Clothes: CLOTHES, ...ROOM_ITEMS };
  const pictures = new Map(categories.map(category => [category, shuffle<PictureName>([...(pools[category] ?? ["cat"])], rand)]));
  const items: ToyItem[] = categories.flatMap((category, c) => Array.from({ length: 2 }, (_, i) => {
    return { id: c * 2 + i, category, picture: rule === "color" ? SHAPES[i] ?? "circle" : pictures.get(category)?.[i] ?? "cat", color: rule === "color" ? category : undefined };
  }));
  return { categories, items: shuffle(items, rand), rule };
}
export function sortToy(sorted: number[], id: number, category: string, items: ToyItem[]) {
  const item = items.find((item) => item.id === id);
  return item?.category === category && !sorted.includes(id) ? [...sorted, id] : sorted;
}
export function rankToy(sorted: number[], id: number, position: number, items: ToyItem[]) {
  const item = items.find((item) => item.id === id);
  return position === sorted.length + 1 && item?.rank === position && !sorted.includes(id) ? [...sorted, id] : sorted;
}
export const PATTERN_UNITS = { 1: ["AB"], 2: ["AABB", "ABC"], 3: ["ABBC", "AABC", "ABAC"] } as const;
export function patternRound(level: LogicLevel, rand = Math.random) {
  const units = PATTERN_UNITS[level];
  const unit = units[Math.floor(rand() * units.length)] ?? "AB";
  const pools: PictureName[][] = [OBJECTS.slice(0, 4), OBJECTS.slice(4, 8), [...SHAPES.slice(0, 4)], ["Red", "Blue", "Yellow", "Green"]];
  const pool = shuffle(pools[Math.floor(rand() * pools.length)] ?? pools[0] ?? [], rand);
  const symbols = [...new Set(unit.split(""))];
  const map = new Map(symbols.map((s, i) => [s, pool[i] ?? "cat"]));
  const length = level === 1 ? 5 : level === 2 ? 7 : unit.length * 2 + 2;
  const sequence = Array.from({ length }, (_, i) => map.get(unit[i % unit.length] ?? "A") ?? "cat");
  const missingIndex = level === 1 ? (rand() < 0.5 ? 2 : 4) : length - 1;
  const answer = sequence[missingIndex] ?? "cat";
  return { unit, sequence, missingIndex, answer, choices: shuffle([answer, ...pool.filter((p) => p !== answer).slice(0, 2)], rand) };
}
export const ODD_BANK: { rule: string; common: PictureName[]; odd: PictureName; explanation: string }[] = [
  { rule: "Fruits", common: ["apple", "banana", "orange"], odd: "car", explanation: "The car isn't a fruit." },
  { rule: "Animals", common: ["cat", "dog", "bunny"], odd: "bus", explanation: "The bus isn't an animal." },
  { rule: "Vehicles", common: ["car", "bus", "train"], odd: "apple", explanation: "The apple isn't a vehicle." },
  { rule: "Shapes", common: ["circle", "triangle", "square"], odd: "cat", explanation: "The cat isn't a geometric shape." },
  { rule: "Color", common: ["circle", "circle", "circle"], odd: "circle", explanation: "This circle is blue. The others are red." },
  { rule: "Size", common: ["bunny", "bunny", "bunny"], odd: "bunny", explanation: "This bunny is small. The others are big." },
  { rule: "Getting ready", common: ["toothbrush", "comb", "soap"], odd: "car", explanation: "The car is for travel, not washing or grooming." },
];
export function oddRound(level: LogicLevel, rand = Math.random) {
  const question = ODD_BANK[Math.floor(rand() * ODD_BANK.length)] ?? ODD_BANK[0];
  if (!question) throw new Error("Question bank is empty");
  const items = question.common.slice(0, level === 1 ? 2 : 3).map((picture, id) => ({ id, picture, odd: false }));
  return { ...question, items: shuffle([...items, { id: 3, picture: question.odd, odd: true }], rand) };
}
export const SPATIAL = ["above", "under", "inside", "beside", "outside", "in front of", "behind", "between"] as const;
export type SpatialRelation = typeof SPATIAL[number];
export function spatialConcepts(level: LogicLevel): SpatialRelation[] { return SPATIAL.slice(0, level === 1 ? 4 : level === 2 ? 7 : 8); }
export function spatialRound(level: LogicLevel, rand = Math.random) {
  const pool = spatialConcepts(level);
  const target = pool[Math.floor(rand() * pool.length)] ?? "inside";
  const choices: SpatialRelation[] = target === "outside" ? ["inside", "outside"] : target === "between" ? ["beside", "between", "above"] : target === "in front of" || target === "behind" ? ["in front of", "behind", "inside"] : ["above", "under", "inside", "beside"];
  return { target, choices };
}
export function isSpatialMatch(target: SpatialRelation, destination: SpatialRelation) { return target === destination; }
