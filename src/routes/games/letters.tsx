import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Choice, GameShell } from "@/components/kit";
import { letterRound } from "@/lib/name";
import { PHONICS } from "@/lib/phonics";
import pictures from "@/assets/alphabet-pictures.jpg";

export const Route = createFileRoute("/games/letters")({
  head: () => ({ meta: [
    { title: "Letter Match — Little Learners" },
    { name: "description", content: "Match big and little letters with playful alphabet pictures." },
    { property: "og:title", content: "Letter Match — Little Learners" },
    { property: "og:description", content: "Match big and little letters with playful alphabet pictures." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Letters,
});
function Letters() {
  const [round, setRound] = useState(() => letterRound());
  const [solved, setSolved] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const item = PHONICS[round.target.charCodeAt(0) - 65];
  if (!item) return null;
  return <GameShell title="Letter Match" prompt={round.uppercase ? "Find the little letter!" : "Find the big letter!"}>
    <div key={round.target} className="flex flex-col items-center gap-3 animate-pop">
      <div className="flex items-center gap-6">
        <div aria-label="Question letter" className="font-display text-8xl sm:text-9xl text-tomato">{round.uppercase ? round.target : round.target.toLowerCase()}</div>
        <div className={`phonics-picture phonics-${round.target}`} role="img" aria-label={item.word}>
          <img src={pictures} alt="" width={1536} height={1280} />
        </div>
      </div>
      <p className="font-display text-3xl">{item.word}</p>
    </div>
    <div key={round.target + '-choices'} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {round.choices.map((c) => <Choice key={c} disabled={solved} correct={c === round.target} className="text-5xl w-24 h-24" onPick={() => {
        setSolved(true);
        timer.current = setTimeout(() => { setRound(letterRound(round.target, Math.random, round.remaining)); setSolved(false); }, 1000);
      }}>{round.uppercase ? c.toLowerCase() : c}</Choice>)}
    </div>
  </GameShell>;
}
