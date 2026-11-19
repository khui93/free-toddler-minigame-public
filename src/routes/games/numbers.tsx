import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Choice, GameShell, SuccessStar } from "@/components/kit";
import { Button } from "@/components/ui/button";
import { numberLevelRound, numberChoices, type NumberLevel } from "@/lib/name";
import trainEngine from "@/assets/train-engine.png";
export const Route = createFileRoute("/games/numbers")({
  head: () => ({ meta: [
    { title: "Know my number — Little Learners" },
    { name: "description", content: "Complete number sequences in three levels, from 1 to 20." },
    { property: "og:title", content: "Know my number — Little Learners" },
    { property: "og:description", content: "Complete number sequences in three levels, from 1 to 20." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Numbers,
});
function Numbers() {
  const [level, setLevel] = useState<NumberLevel>(1);
  return <GameShell title="Know my number" prompt="Fill the missing numbers in order!">
    <div className="flex gap-3" role="group" aria-label="Number level">
      {([1, 2, 3] as const).map((l) => <Button key={l} variant="tile" className={`tile-sm text-lg ${l === level ? 'bg-sun' : 'bg-card'}`} aria-pressed={l === level} onClick={() => setLevel(l)}>Level {l}</Button>)}
    </div>
    <NumberGame key={level} level={level} />
  </GameShell>;
}
function NumberGame({ level }: { level: NumberLevel }) {
  const [round, setRound] = useState(() => numberLevelRound(level));
  const [filled, setFilled] = useState(0);
  const [waiting, setWaiting] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const active = round.missing[filled];
  const answer = active === undefined ? 1 : round.seq[active] ?? 1;
  const choices = useMemo(() => level === 3 ? round.choices : numberChoices(answer), [answer, level, round]);
  const done = filled === round.missing.length;
  return <>
    <div className="number-train-stage w-full max-w-xl">
    <div aria-label="Number train" role="group" className={`number-train ${done ? 'train-departing' : ''}`}>
      <img className="train-engine" src={trainEngine} width={992} height={672} alt="Train engine" />
      <div aria-label="Number sequence" className={`grid gap-x-2 gap-y-8 w-full ${level === 3 ? 'grid-cols-5' : level === 2 ? 'grid-cols-3 sm:grid-cols-6' : 'grid-cols-4'}`}>
      {round.seq.map((n, i) => {
        const hidden = round.missing.slice(filled).includes(i);
        return <div key={i} aria-label={hidden ? `Missing number ${i + 1}` : `Filled number ${n}`} className={`train-car tile min-w-0 px-1 text-3xl sm:text-4xl ${i === active ? 'bg-sun ring-2 ring-primary' : hidden ? 'bg-muted' : 'bg-teal text-primary-foreground'}`}>{hidden ? '?' : n}</div>;
      })}
      </div>
    </div>
    </div>
    <div className="h-16 flex items-center">{done && <SuccessStar />}</div>
    {!done && <div key={round.seq.join() + '-' + filled} className={`grid gap-3 ${level === 3 ? 'grid-cols-5 w-full max-w-xl' : 'grid-cols-3'}`}>
      {choices.map((n) => <Choice key={n} disabled={waiting || (level === 3 && round.missing.slice(0, filled).some((i) => round.seq[i] === n))} correct={n === answer} className={`bg-teal text-primary-foreground min-w-0 ${level === 3 ? 'text-2xl px-1' : 'text-4xl w-20 sm:w-24 h-24'}`} onPick={() => {
        setWaiting(true);
        timer.current = setTimeout(() => {
          const next = filled + 1;
          setFilled(next); setWaiting(false);
          if (next === round.missing.length) timer.current = setTimeout(() => { setRound(numberLevelRound(level)); setFilled(0); }, 2000);
        }, 650);
      }}>{n}</Choice>)}
    </div>}
  </>;
}
