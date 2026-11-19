import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Choice, GameShell } from "@/components/kit";
import { MathRangePicker } from "@/components/math-controls";
import { countingRound } from "@/lib/name";
import bunny from "@/assets/counting-bunny.png";

export const Route = createFileRoute("/games/count-critters")({
  head: () => ({ meta: [
    { title: "Count the Bunny — Little Learners" },
    { name: "description", content: "Count the bunnies and choose the matching number, from 1 to 20." },
    { property: "og:title", content: "Count the Bunny — Little Learners" },
    { property: "og:description", content: "Count the bunnies and choose the matching number, from 1 to 20." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Critters,
});

function Critters() {
  const [max, setMax] = useState<10 | 20>(10);
  return <GameShell title="Count the Bunny" prompt="How many bunnies?">
    <MathRangePicker value={max} onChange={(value) => { if (value !== 5) setMax(value); }} ranges={[10, 20]} />
    <BunnyGame key={max} max={max} />
  </GameShell>;
}

export function BunnyGame({ max }: { max: 10 | 20 }) {
  const [round, setRound] = useState(() => countingRound(max));
  const [solved, setSolved] = useState(false);
  const [roundId, setRoundId] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  return <>
    <div role="group" aria-label="Bunnies" className="grid grid-cols-4 sm:grid-cols-5 gap-3 w-full max-w-xl">
      {round.critters.map((id) => <img key={id} src={bunny} alt="Bunny" width={816} height={816} className="w-full aspect-square object-contain" />)}
    </div>
    <div className="min-h-24">
      <div key={roundId} role="group" aria-label="Total choices" className="flex gap-3">
        {round.choices.map((n) => <Choice key={n} correct={n === round.total} disabled={solved} className="text-4xl w-20 sm:w-24 h-24 bg-teal text-primary-foreground" onPick={() => {
          setSolved(true);
          timer.current = setTimeout(() => { setRound(countingRound(max)); setSolved(false); setRoundId((id) => id + 1); }, 1000);
        }}>{n}</Choice>)}
      </div>
    </div>
  </>;
}