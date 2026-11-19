import { describe, expect, it } from "vitest";
import { levelShapes, shapeRound, placeShape, toyRound, sortToy, rankToy, ROOM_ITEMS, CLOTHES, patternRound, PATTERN_UNITS, oddRound, ODD_BANK, spatialConcepts, spatialRound, isSpatialMatch, type LogicLevel } from "@/lib/name";
describe("shape matching", () => {
  it("beginner uses only circle square triangle", () => expect(levelShapes(1)).toEqual(["circle", "square", "triangle"]));
  it("intermediate adds rectangle and oval", () => expect(levelShapes(2)).toEqual(["circle", "square", "triangle", "rectangle", "oval"]));
  it("advanced adds hexagon pentagon and octagon", () => expect(levelShapes(3)).toEqual(["circle", "square", "triangle", "rectangle", "oval", "star", "heart", "hexagon", "pentagon", "octagon"]));
  it("wrong matches never move and correct matches cannot repeat", () => { const initial: ReturnType<typeof levelShapes> = []; expect(placeShape(initial, "triangle", "square")).toBe(initial); const next = placeShape(initial, "triangle", "triangle"); expect(next).toEqual(["triangle"]); expect(placeShape(next, "triangle", "triangle")).toBe(next); });
  it.each([1,2,3] as LogicLevel[])("every outline matches exactly one shape level %i", (level) => { const round = shapeRound(level); expect([...round.shapes].sort()).toEqual([...round.outlines].sort()); expect(new Set(round.shapes).size).toBe(round.shapes.length); });
});
describe("toy categories", () => {
  it("advanced color uses all four colors", () => expect(toyRound(3,"color").categories.sort()).toEqual(["Blue","Green","Red","Yellow"]));
  it("intermediate ranks exactly three sizes", () => { const r=toyRound(2,"size"); expect(r.categories).toEqual(["1","2","3"]); expect(r.items.map(i=>i.rank).sort()).toEqual([1,2,3]); expect(new Set(r.items.map(i=>i.picture)).size).toBe(1); });
  it("advanced ranks exactly five sizes", () => { const r=toyRound(3,"size"); expect(r.items).toHaveLength(5); expect(r.categories).toEqual(["1","2","3","4","5"]); });
  it("size ranking rejects wrong order skipped positions and repeated items", () => { const r=toyRound(3,"size",()=>.5); let sorted:number[]=[]; const ordered=[...r.items].sort((a,b)=>(a.rank??0)-(b.rank??0)); const first=ordered[0],last=ordered[4]; if(!first||!last)throw Error("Missing sizes"); expect(rankToy(sorted,last.id,1,r.items)).toBe(sorted); expect(rankToy(sorted,first.id,2,r.items)).toBe(sorted); for(const item of ordered){sorted=rankToy(sorted,item.id,sorted.length+1,r.items); expect(rankToy(sorted,item.id,sorted.length+1,r.items)).toBe(sorted);} expect(sorted).toHaveLength(5); });
  it("advanced type uses animals fruits vehicles and clothes", () => { const r=toyRound(3,"type"); expect(r.categories.sort()).toEqual(["Animals","Clothes","Fruits","Vehicles"]); expect(r.items.filter(i=>i.category==="Clothes").every(i=>(CLOTHES as readonly string[]).includes(i.picture))).toBe(true); });
  it("room sorting has kitchen living room and bedroom with exclusive items", () => { const r=toyRound(3,"room"); expect(r.categories.sort()).toEqual(["Bedroom","Kitchen","Living room"]); for(const item of r.items)expect(Object.entries(ROOM_ITEMS).filter(([,pool])=>(pool as readonly string[]).includes(item.picture)).map(([room])=>room)).toEqual([item.category]); });
  it.each(["color","size","type","room"] as const)("%s has exclusive categories and stable IDs", (rule) => { const round=toyRound(3,rule); expect(new Set(round.items.map((i)=>i.id)).size).toBe(round.items.length); let sorted: number[]=[]; for(const item of round.items) { expect(round.categories.filter((c)=>c===item.category)).toHaveLength(1); expect(sortToy(sorted,item.id,"not a category",round.items)).toBe(sorted); sorted=sortToy(sorted,item.id,item.category,round.items); expect(sortToy(sorted,item.id,item.category,round.items)).toBe(sorted); } expect(sorted).toHaveLength(round.items.length); });
});
describe("patterns", () => {
  it("includes color patterns alongside animals fruits and shapes", () => { const round = patternRound(1, () => .99); expect(round.sequence.every((p) => ["Red", "Blue", "Yellow", "Green"].includes(p))).toBe(true); });
  it("beginner has exactly five objects in ABABA order", () => { const r=patternRound(1,()=>.25); expect(r.unit).toBe("AB"); expect(r.sequence).toHaveLength(5); const [a,b]=r.sequence; expect(a).not.toBe(b); expect(r.sequence).toEqual([a,b,a,b,a]); });
  it("beginner hides only position 3 or 5 and offers both", () => { const positions=new Set<number>(); for(let n=0;n<30;n++){const r=patternRound(1,()=>n/30); expect([2,4]).toContain(r.missingIndex); expect(r.answer).toBe(r.sequence[r.missingIndex]); positions.add(r.missingIndex+1);} expect([...positions].sort()).toEqual([3,5]); });
  it("intermediate has seven objects using AABBAAB or ABCABCA", () => { const aabb=patternRound(2,()=>.25); const abc=patternRound(2,()=>.75); expect(aabb.unit).toBe("AABB"); expect(abc.unit).toBe("ABC"); const [a,,,b]=aabb.sequence; expect(aabb.sequence).toEqual([a,a,b,b,a,a,b]); const [x,y,z]=abc.sequence; expect(abc.sequence).toEqual([x,y,z,x,y,z,x]); for(const r of [aabb,abc]){expect(r.sequence).toHaveLength(7); expect(r.missingIndex).toBe(6);} });
  it.each([1,2,3] as LogicLevel[])("level %i follows each specified repeating unit", (level) => { for(let n=0;n<30;n++){const r=patternRound(level,()=>n/30); expect(PATTERN_UNITS[level]).toContain(r.unit); for(let i=r.unit.length;i<r.sequence.length;i++) expect(r.sequence[i]).toBe(r.sequence[i%r.unit.length]); expect(r.answer).toBe(r.sequence[r.missingIndex]); expect(r.choices.filter((p)=>p===r.answer)).toHaveLength(1); expect(new Set(r.choices).size).toBe(3); } });
});
describe("odd pictures", () => {
  it("bank covers seven explicit classifications", () => expect(ODD_BANK.map((q)=>q.rule)).toEqual(["Fruits","Animals","Vehicles","Shapes","Color","Size","Getting ready"]));
  it.each([1,2,3] as LogicLevel[])("level %i has exactly one odd answer and correct picture count", (level) => { for(let i=0;i<ODD_BANK.length;i++){const r=oddRound(level,()=>i/ODD_BANK.length); expect(r.items).toHaveLength(level===1?3:4); expect(r.items.filter((item)=>item.odd)).toHaveLength(1); expect(r.explanation.length).toBeGreaterThan(10); } });
});
describe("spatial placement", () => {
  it("beginner concepts match the brief", () => expect(spatialConcepts(1)).toEqual(["above","under","inside","beside"]));
  it("intermediate adds outside front and behind", () => expect(spatialConcepts(2)).toEqual(["above","under","inside","beside","outside","in front of","behind"]));
  it("advanced supports between", () => expect(spatialConcepts(3)).toContain("between"));
  it("every scene has one target and incorrect destinations retry", () => { for(let i=0;i<8;i++){const r=spatialRound(3,()=>i/8); expect(r.choices.filter((c)=>isSpatialMatch(r.target,c))).toHaveLength(1); expect(isSpatialMatch(r.target,r.target)).toBe(true); } });
  it("outside competes only with inside", () => expect(spatialRound(3,()=>4/8).choices).toEqual(["inside","outside"]));
});