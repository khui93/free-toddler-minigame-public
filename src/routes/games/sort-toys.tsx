import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { GameShell } from "@/components/kit";
import { Button } from "@/components/ui/button";
import { LogicLevels, logicHead } from "@/components/logic-controls";
import { Picture, colorClass } from "@/components/logic-art";
import { LogicReward, useLogicFeedback } from "@/components/logic-session";
import { toyRound, sortToy, rankToy, type LogicLevel, type ToyRule, type ToyItem } from "@/lib/name";
export const Route = createFileRoute("/games/sort-toys")({ head: () => logicHead("Sort the Toys", "Sort toys by color, type, or room, and rank sizes from smallest to biggest."), component: SortToys });
function SortToys() {
  const [level, setLevel] = useState<LogicLevel>(1);
  const [rule, setRule] = useState<ToyRule>("color");
  return <GameShell className="logic-game toy-game" title="Sort the Toys" prompt={rule === "size" ? "Smallest to biggest!" : rule === "room" ? "Put each item in its room!" : `Sort by ${rule}!`}><LogicLevels value={level} onChange={setLevel} /><div role="group" aria-label="Sorting rule" className="flex flex-wrap justify-center gap-2">{(["color", "size", "type", "room"] as const).map((r) => <Button key={r} variant="tile" aria-pressed={rule === r} className={`tile-sm capitalize ${rule === r ? "bg-teal text-primary-foreground" : "bg-card"}`} onClick={() => setRule(r)}>{r === "room" ? "Rooms" : r}</Button>)}</div><ToyGame key={`${level}-${rule}`} level={level} rule={rule} /></GameShell>;
}
function ToyGame({ level, rule }: { level: LogicLevel; rule: ToyRule }) {
  const [round, setRound] = useState(() => toyRound(level, rule));
  const [selected, setSelected] = useState<number | null>(null);
  const [sorted, setSorted] = useState<number[]>([]);
  const [arrived, setArrived] = useState<number | null>(null);
  const feedback = useLogicFeedback(() => { setRound(toyRound(level, rule)); setSorted([]); setSelected(null); setArrived(null); });
  const art = (item: ToyItem) => <span className={item.rank ? `rank-art rank-${item.rank}-of-${item.sizeCount}` : "toy-art"}><Picture name={item.picture} color={colorClass(item.color)} /></span>;
  return <><div role="group" aria-label="Toys" className={`toy-source-grid w-full max-w-2xl ${rule === "size" ? "toy-size-source" : ""}`}>{round.items.map((item) => <Button key={item.id} variant="tile" aria-label={`Select ${item.category} ${item.picture} ${item.id + 1}`} aria-pressed={selected === item.id} disabled={sorted.includes(item.id) || feedback.moving || feedback.won} className={`toy-choice ${selected === item.id ? "ring-4 ring-teal" : ""} ${sorted.includes(item.id) ? "invisible" : ""}`} onClick={() => { if (!feedback.locked.current) setSelected(item.id); }}>{art(item)}</Button>)}</div>
    {rule === "size" && <div className="size-direction font-display"><span>Smallest</span><span aria-hidden="true">→</span><span>Biggest</span></div>}
    <div role="group" aria-label={rule === "size" ? "Size ranks" : "Category bins"} className={`toy-bins w-full max-w-2xl ${rule === "size" ? "size-rank-bins" : ""} ${round.categories.length === 4 ? "four-bins" : ""}`}>{round.categories.map((category, index) => <Button key={category} variant="ghost" aria-label={rule === "size" ? `Position ${category}` : `${category} bin`} disabled={feedback.moving || feedback.won || (rule === "size" && index !== sorted.length)} className={`toy-bin ${rule === "size" && index === sorted.length ? "rank-next" : ""} ${feedback.wrong ? "animate-wiggle" : ""}`} onClick={() => {
      if (feedback.locked.current || selected === null) return;
      const next = rule === "size" ? rankToy(sorted, selected, index + 1, round.items) : sortToy(sorted, selected, category, round.items);
      if (next === sorted) { setSelected(null); feedback.fail(); return; }
      setSorted(next); setArrived(selected); setSelected(null);
      feedback.move(() => { if (next.length === round.items.length) feedback.win(); });
    }}><span className="flex gap-2 items-center justify-center font-display text-lg">{rule === "color" && <span className={`bin-swatch ${colorClass(category)}`} />}{category}</span><span className="flex flex-wrap gap-1 justify-center items-end min-h-20">{round.items.filter((item) => sorted.includes(item.id) && item.category === category).map((item) => <span key={item.id} className={`bin-picture ${arrived === item.id ? "toy-arrive" : ""}`}>{art(item)}</span>)}{rule !== "size" && !sorted.some((id) => round.items.some((item) => item.id === id && item.category === category)) && <span className="bin-picture opacity-40">{art(round.items.find((item) => item.category === category) ?? round.items[0] ?? { id: -1, picture: "cat", category })}</span>}</span></Button>)}</div><LogicReward show={feedback.won} /></>;
}