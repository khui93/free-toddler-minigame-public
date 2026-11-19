import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { GameShell } from "@/components/kit";
import { Button } from "@/components/ui/button";
import { LogicLevels, logicHead } from "@/components/logic-controls";
import { Picture } from "@/components/logic-art";
import { LogicReward, useLogicFeedback } from "@/components/logic-session";
import { spatialRound, isSpatialMatch, type LogicLevel, type SpatialRelation } from "@/lib/name";
export const Route = createFileRoute("/games/wheres-ball")({ head: () => logicHead("Where's the Ball?", "Place a ball above, under, inside, and around illustrated boxes."), component: Ball });
function Ball() { const [level, setLevel] = useState<LogicLevel>(1); return <GameShell className="logic-game" title="Where's the Ball?" prompt="Put the ball in its place!"><LogicLevels value={level} onChange={setLevel} /><BallGame key={level} level={level} /></GameShell>; }
function BallGame({ level }: { level: LogicLevel }) {
  const [round, setRound] = useState(() => spatialRound(level)); const [selected, setSelected] = useState(false); const [position, setPosition] = useState<SpatialRelation | null>(null);
  const feedback = useLogicFeedback(() => { setRound(spatialRound(level)); setSelected(false); setPosition(null); });
  return <><p className="font-display text-2xl text-center">{round.target === "between" ? "Between the boxes" : `${round.target.charAt(0).toUpperCase()}${round.target.slice(1)} the box`}</p>
    <div className={`ball-scene relation-${round.target.replaceAll(" ", "-")} w-full max-w-xl`} role="group" aria-label="Ball scene">
      <div className="spatial-box box-back" /><div className="spatial-box box-front" />
      {round.target === "between" && <><div className="spatial-box second-box box-back" /><div className="spatial-box second-box box-front" /></>}
      {!position && <Button variant="ghost" aria-label="Select ball" aria-pressed={selected} className={`ball-home ${selected ? "ring-4 ring-teal" : ""}`} onClick={() => setSelected(true)}><Picture name="ball" /></Button>}
      {round.choices.map((destination) => <Button key={destination} variant="ghost" aria-label={`Place ${destination}`} disabled={!selected || feedback.moving || feedback.won} className={`ball-destination destination-${destination.replaceAll(" ", "-")} ${selected ? "destination-active" : ""} ${position === destination ? "destination-filled" : ""} ${feedback.wrong ? "animate-wiggle" : ""}`} onClick={() => { if (feedback.locked.current) return; if (!isSpatialMatch(round.target, destination)) { feedback.fail(); return; } setPosition(destination); feedback.move(feedback.win); }}>{position === destination ? <span className="ball-arrive"><Picture name="ball" /></span> : <span className="destination-dot" />}</Button>)}
    </div><p role="status" aria-label="Position explanation" className="min-h-8 font-display text-lg">{position ? `The ball is ${position} ${position === "between" ? "the boxes" : "the box"}.` : ""}</p><LogicReward show={feedback.won} /></>;
}