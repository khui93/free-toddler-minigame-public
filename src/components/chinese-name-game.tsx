import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { LogicReward, useLogicFeedback } from "@/components/logic-session";
import { chineseNameChoices, selectChineseName } from "@/lib/name";
export function ChineseNameGame({ name, onWin }: { name: string; onWin: () => void }) {
  const [filled, setFilled] = useState(0);
  const [choices, setChoices] = useState(() => chineseNameChoices(name, 0));
  const progress = useRef(0);
  const feedback = useLogicFeedback(onWin);
  return <><div className="text-4xl text-teal" lang="zh">{name}</div><div className="flex gap-3" aria-label="Your name">{[...name].map((c, i) => <span key={i} className={`tile w-16 h-20 text-4xl ${i < filled ? "bg-sun" : "bg-muted"}`}>{i < filled ? c : "?"}</span>)}</div>
    <div className={`grid grid-cols-3 sm:grid-cols-4 gap-3 w-full max-w-lg ${feedback.wrong ? "animate-wiggle" : ""}`}>{choices.map(c => <Button key={c} variant="tile" className="bg-card h-24 text-4xl" disabled={feedback.won || feedback.moving} onClick={() => {
      if (feedback.locked.current) return;
      const result = selectChineseName(name, progress.current, c);
      if (!result.correct) { feedback.fail(); return; }
      progress.current = result.filled; setFilled(result.filled);
      if (result.completed) feedback.win();
      else feedback.move(() => setChoices(chineseNameChoices(name, result.filled)));
    }}>{c}</Button>)}</div><LogicReward show={feedback.won} /></>;
}