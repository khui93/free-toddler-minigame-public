import { describe, expect, it } from "vitest";
import { CHINESE_THEMES, COMMON_CHINESE, INITIAL_FAMILY } from "@/lib/chinese-data";
import { chineseRound, chineseNameChoices, validateChineseName, nextChineseCharacter, selectChineseName, siblingRole, familyRelation, familyRound } from "@/lib/name";
import { NAME_STORAGE_KEY, readDeviceNames, writeDeviceNames } from "@/lib/device-data";
describe("Chinese matching", () => {
  it("includes each sheet's 12 characters and exhausts every theme before repeating", () => {
    expect(CHINESE_THEMES).toHaveLength(6);
    for (const theme of CHINESE_THEMES) {
      expect([...theme.characters]).toHaveLength(12);
      let remaining: string[] = []; const seen: string[] = [];
      for (let i = 0; i < 12; i++) {
        const round = chineseRound(theme.id, remaining);
        seen.push(round.target); remaining = round.remaining;
        expect(round.choices).toContain(round.target);
        expect(new Set(round.choices).size).toBe(4);
      }
      expect(new Set(seen).size).toBe(12); expect(remaining).toEqual([]);
    }
  });
  it("supports both picture and character prompts", () => {
    expect(chineseRound("animals", [], () => 0.2).picturePrompt).toBe(true);
    expect(chineseRound("animals", [], () => 0.8).picturePrompt).toBe(false);
  });
});
describe("Chinese names", () => {
  it("rewards only after the whole name is correct", () => {
    expect(selectChineseName("陳小小", 0, "陳")).toEqual({ correct: true, filled: 1, completed: false });
    expect(selectChineseName("陳小小", 1, "小").completed).toBe(false);
    expect(selectChineseName("陳小小", 2, "陳").completed).toBe(false);
    expect(selectChineseName("陳小小", 2, "小").completed).toBe(true);
  });
  it("accepts 1–4 Chinese characters only", () => {
    for (const name of ["明", "陳小明", "陳小小明"]) expect(validateChineseName(name)).toBeNull();
    for (const name of ["", "Maya", "陳1", "陳 小明", "陳小小小明"]) expect(validateChineseName(name)).not.toBeNull();
  });
  it("uses the requested top 50 pool with no duplicate answers or name-character decoys", () => {
    expect(COMMON_CHINESE).toHaveLength(50); expect(COMMON_CHINESE.slice(0, 10).join("")).toBe("的一是不了人我在有他");
    for (let i = 0; i < 3; i++) {
      const choices = chineseNameChoices("陳小小", i);
      expect(choices).toContain([ ..."陳小小"][i]);
      expect(new Set(choices).size).toBe(choices.length);
      expect(choices.filter(c => !"陳小小".includes(c)).every(c => COMMON_CHINESE.includes(c))).toBe(true);
    }
  });
  it("requires name characters in order, including repeated characters", () => {
    expect(nextChineseCharacter("陳小小", 0, "小")).toBe(false);
    expect(nextChineseCharacter("陳小小", 0, "陳")).toBe(true);
    expect(nextChineseCharacter("陳小小", 1, "小")).toBe(true);
    expect(nextChineseCharacter("陳小小", 2, "小")).toBe(true);
    expect(nextChineseCharacter("陳小小", 3, "小")).toBe(false);
  });
});
describe("Family relations", () => {
  it("distinguishes mum's younger sister 姨姨 from her older sister 姨媽", () => {
    expect(familyRelation("姨姨")).toMatchObject({ side: "mum", generation: 1, age: "younger" });
    expect(familyRelation("姨媽")).toMatchObject({ side: "mum", generation: 1, age: "older" });
  });
  it("assigns elder and younger siblings to the correct Chinese family relation", () => {
    expect(siblingRole("elder", "brother")).toBe("哥哥"); expect(siblingRole("younger", "brother")).toBe("弟弟");
    expect(siblingRole("elder", "sister")).toBe("姐姐"); expect(siblingRole("younger", "sister")).toBe("妹妹");
  });
  it("places 公公 and 婆婆 on mum's side and 爺爺 and 嫲嫲 on dad's side", () => {
    expect(familyRelation("公公")?.side).toBe("mum"); expect(familyRelation("婆婆")?.side).toBe("mum");
    expect(familyRelation("爺爺")?.side).toBe("dad"); expect(familyRelation("嫲嫲")?.side).toBe("dad");
  });
  it("always offers the matching family member without duplicate relation answers", () => {
    const round = familyRound(INITIAL_FAMILY);
    expect(round?.choices).toContainEqual(round?.target);
    expect(new Set(round?.choices.map(m => m.role)).size).toBe(4);
    expect(familyRound([])).toBeNull();
  });
});
describe("Device-only name persistence", () => {
  it("saves both names locally, restores them, and removes them together", () => {
    localStorage.clear(); writeDeviceNames(localStorage, "Maya", "陳小明");
    expect(readDeviceNames(localStorage)).toEqual({ name: "Maya", chineseName: "陳小明" });
    writeDeviceNames(localStorage, "", ""); expect(localStorage.getItem(NAME_STORAGE_KEY)).toBeNull();
  });
  it("rejects invalid saved names and recovers from damaged device data", () => {
    localStorage.setItem(NAME_STORAGE_KEY, JSON.stringify({ name: "123", chineseName: "Maya" }));
    expect(readDeviceNames(localStorage)).toEqual({ name: "", chineseName: "" });
    localStorage.setItem(NAME_STORAGE_KEY, "bad json"); expect(readDeviceNames(localStorage)).toEqual({ name: "", chineseName: "" });
  });
});