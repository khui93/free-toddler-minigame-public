import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Choice, GameShell } from "@/components/kit";
import { LogicLevels, logicHead } from "@/components/logic-controls";
import { Picture } from "@/components/logic-art";
import { useLogicFeedback } from "@/components/logic-session";
import { patternRound, type LogicLevel } from "@/lib/name";
export const Route = createFileRoute("/games/pattern-parade")({ head: () => logicHead("Pattern Parade", "Complete repeating animal, fruit, and shape patterns."), component: Patterns });
function Patterns() { const [level, setLevel] = useState<LogicLevel>(1); return <GameShell className="logic-game" title="Pattern Parade" prompt="Which picture is missing?"><LogicLevels value={level} onChange={setLevel} /><PatternGame key={level} level={level} /></GameShell>; }
function PatternGame({ level }: { level: LogicLevel }) {
  const [round, setRound] = useState(() => patternRound(level));
  const [roundId, setRoundId] = useState(0);
  const feedback = useLogicFeedback(() => { setRound(patternRound(level)); setRoundId((id) => id + 1); });
  return <><div className="parade-stage w-full"><div role="group" aria-label="Pattern sequence" className={`parade-track parade-level-${level} ${feedback.won ? "parade-departing" : ""}`}>{round.sequence.map((name, i) => <div key={i} className={`parade-item ${i === round.missingIndex ? "parade-missing" : ""}`} aria-label={i === round.missingIndex && !feedback.won ? `Missing item at position ${i + 1}` : name}>{i === round.missingIndex && !feedback.won ? "?" : <Picture name={name} />}</div>)}</div></div><div key={roundId} role="group" aria-label="Pattern choices" className="flex gap-3">{round.choices.map((name) => <Choice key={name} correct={name === round.answer} disabled={feedback.won} className="logic-picture-choice bg-card" onPick={feedback.win}><span aria-label={name}><Picture name={name} /><span className="sr-only">{name}</span></span></Choice>)}</div></>;
}