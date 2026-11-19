import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Choice, GameShell } from "@/components/kit";
import { LogicLevels, logicHead } from "@/components/logic-controls";
import { Picture } from "@/components/logic-art";
import { useLogicFeedback } from "@/components/logic-session";
import { oddRound, type LogicLevel } from "@/lib/name";
export const Route = createFileRoute("/games/odd-one-out")({ head: () => logicHead("Which One Doesn't Belong?", "Find the odd picture and explore familiar categories."), component: Odd });
function Odd() { const [level, setLevel] = useState<LogicLevel>(1); return <GameShell className="logic-game" title="Which One Doesn't Belong?" prompt="Which one is different?"><LogicLevels value={level} onChange={setLevel} /><OddGame key={level} level={level} /></GameShell>; }
function OddGame({ level }: { level: LogicLevel }) {
  const [round, setRound] = useState(() => oddRound(level)); const [roundId, setRoundId] = useState(0);
  const feedback = useLogicFeedback(() => { setRound(oddRound(level)); setRoundId((id) => id + 1); });
  return <><p className="font-display text-xl text-teal">{round.rule}</p><div key={roundId} role="group" aria-label="Odd picture choices" className="odd-choice-grid">{round.items.map((item) => <Choice key={item.id} correct={item.odd} disabled={feedback.won} className="logic-picture-choice bg-card" onPick={feedback.win}><span className="flex flex-col items-center gap-2"><Picture name={item.picture} color={round.rule === "Color" && item.odd ? "text-teal" : "text-tomato"} small={round.rule === "Size" && item.odd} /><span className="sr-only">{item.picture} {item.id + 1}</span></span></Choice>)}</div><div role="status" aria-label="Explanation" className="font-display text-xl text-center min-h-16">{feedback.won ? round.explanation : ""}</div></>;
}