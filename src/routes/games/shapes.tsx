import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { GameShell } from "@/components/kit";
import { Button } from "@/components/ui/button";
import { LogicLevels, logicHead } from "@/components/logic-controls";
import { ShapeArt } from "@/components/logic-art";
import { LogicReward, useLogicFeedback } from "@/components/logic-session";
import { shapeRound, placeShape, type LogicLevel, type ShapeName } from "@/lib/name";

export const Route = createFileRoute("/games/shapes")({ head: () => logicHead("Shape Sorter & Hunt", "Match shapes to outlines and find shapes in playful scenes."), component: Shapes });
function Shapes() {
  const [level, setLevel] = useState<LogicLevel>(1);
  const [mode, setMode] = useState<"sort" | "hunt">("sort");
  return <GameShell className="logic-game" title="Shape Sorter & Hunt" prompt={mode === "sort" ? "Match each shape to its outline!" : "Find the shape!"}>
    <LogicLevels value={level} onChange={setLevel} />
    <div role="group" aria-label="Shape game" className="flex gap-3">{(["sort", "hunt"] as const).map((m) => <Button key={m} variant="tile" className={`tile-sm ${mode === m ? "bg-leaf" : "bg-card"}`} aria-pressed={mode === m} onClick={() => setMode(m)}>{m === "sort" ? "Sorter" : "Hunt"}</Button>)}</div>
    <ShapeGame key={`${mode}-${level}`} level={level} mode={mode} />
  </GameShell>;
}
function ShapeGame({ level, mode }: { level: LogicLevel; mode: "sort" | "hunt" }) {
  const [round, setRound] = useState(() => shapeRound(level));
  const [selected, setSelected] = useState<ShapeName | null>(null);
  const [placed, setPlaced] = useState<ShapeName[]>([]);
  const [arrived, setArrived] = useState<ShapeName | null>(null);
  const feedback = useLogicFeedback(() => { setRound(shapeRound(level)); setPlaced([]); setSelected(null); setArrived(null); });
  return <>
    {mode === "hunt" ? <>
      <div className="flex gap-3 items-center font-display text-2xl capitalize"><ShapeArt shape={round.target} className="size-14" />{round.target}</div>
      <div role="group" aria-label="Shape hunt scene" className="shape-hunt-scene w-full max-w-xl relative">
        <div className="hunt-ground" />
        <div className="relative z-10 grid grid-cols-3 gap-4 p-5 pt-12">{round.shapes.map((shape, i) => <Button variant="ghost" key={shape} aria-label={`Find ${shape}`} className={`hunt-target ${feedback.wrong ? "animate-wiggle" : ""}`} disabled={feedback.won} onClick={() => shape === round.target ? feedback.win() : feedback.fail()}><ShapeArt shape={shape} rotate={level === 3 && i % 2 === 0} color={["text-tomato", "text-grape", "text-teal", "text-sun"][i % 4]} /></Button>)}</div>
      </div>
    </> : <>
      <div className="shape-round-grid" role="group" aria-label="Shapes">{round.shapes.map((shape, i) => <Button key={shape} variant="tile" aria-label={`Select ${shape}`} aria-pressed={selected === shape} disabled={placed.includes(shape) || feedback.moving || feedback.won} className={`shape-choice ${selected === shape ? "ring-4 ring-teal" : ""} ${placed.includes(shape) ? "opacity-30" : ""}`} onClick={() => { if (!feedback.locked.current) setSelected(shape); }}><ShapeArt shape={shape} rotate={level === 3 && i % 2 === 0} color={["text-tomato", "text-teal", "text-grape"][i % 3]} /></Button>)}</div>
      <div className="shape-round-grid" role="group" aria-label="Shape outlines">{round.outlines.map((shape) => <Button key={shape} variant="tile" aria-label={`Match ${shape} outline`} disabled={placed.includes(shape) || feedback.moving || feedback.won} className={`shape-choice bg-card ${feedback.wrong ? "animate-wiggle" : ""}`} onClick={() => {
        if (feedback.locked.current) return;
        const next = placeShape(placed, selected, shape);
        if (next === placed) { feedback.fail(); return; }
        setPlaced(next); setArrived(shape); setSelected(null);
        feedback.move(() => { if (next.length === round.shapes.length) feedback.win(); });
      }}><ShapeArt shape={shape} outline={!placed.includes(shape)} className={arrived === shape ? "shape-arrive" : ""} /></Button>)}</div>
    </>}
    <LogicReward show={feedback.won} />
  </>;
}