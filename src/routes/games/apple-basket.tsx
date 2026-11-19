import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Choice, GameShell } from "@/components/kit";
import { Button } from "@/components/ui/button";
import { MathRangePicker } from "@/components/math-controls";
import { appleRound, initialApples, moveApple, type MathOperation, type MathRange } from "@/lib/name";
import apple from "@/assets/counting-apple.png";
import basket from "@/assets/apple-basket.png";

export const Route = createFileRoute("/games/apple-basket")({
  head: () => ({ meta: [
    { title: "Apple Basket — Little Learners" },
    { name: "description", content: "Practice early addition and subtraction by tapping apples into and out of a basket." },
    { property: "og:title", content: "Apple Basket — Little Learners" },
    { property: "og:description", content: "Practice early addition and subtraction by tapping apples into and out of a basket." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: AppleBasket,
});

function AppleBasket() {
  const [max, setMax] = useState<MathRange>(5);
  const [operation, setOperation] = useState<MathOperation>("add");
  return <GameShell className="apple-game-compact" title="Apple Basket" prompt={operation === "add" ? "How many apples altogether?" : "How many apples are left?"}>
    <div className="flex flex-wrap justify-center gap-3">
      <div role="group" aria-label="Math operation" className="flex gap-2">
        <Button variant="tile" className={`tile-sm ${operation === "add" ? "bg-tomato text-primary-foreground" : "bg-card"}`} aria-label="Addition" title="Addition" aria-pressed={operation === "add"} onClick={() => setOperation("add")}>+</Button>
        <Button variant="tile" className={`tile-sm ${operation === "subtract" ? "bg-tomato text-primary-foreground" : "bg-card"}`} aria-label="Subtraction" title="Subtraction" aria-pressed={operation === "subtract"} onClick={() => setOperation("subtract")}>−</Button>
      </div>
      <MathRangePicker value={max} onChange={setMax} />
    </div>
    <AppleGame key={`${max}-${operation}`} max={max} operation={operation} />
  </GameShell>;
}

function AppleGame({ max, operation }: { max: MathRange; operation: MathOperation }) {
  const [round, setRound] = useState(() => appleRound(max, operation));
  const [apples, setApples] = useState(() => initialApples(round));
  const [moving, setMoving] = useState<number | null>(null);
  const [solved, setSolved] = useState(false);
  const [roundId, setRoundId] = useState(0);
  const locked = useRef(false);
  const buttons = useRef(new Map<number, HTMLButtonElement>());
  const startPosition = useRef<{ x: number; y: number } | null>(null);
  const moveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const roundTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (moveTimer.current) clearTimeout(moveTimer.current); if (roundTimer.current) clearTimeout(roundTimer.current); }, []);
  useLayoutEffect(() => {
    if (moving === null || !startPosition.current) return;
    const button = buttons.current.get(moving);
    const position = button?.getBoundingClientRect();
    if (!button || !position) return;
    const { x, y } = startPosition.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced) button.animate([{ transform: `translate(${x - position.x}px, ${y - position.y}px) scale(1.1)` }, { transform: "translate(0, 0) scale(1)" }], { duration: 350, easing: "ease-in-out" });
  }, [moving]);
  const complete = apples.moved.length === round.second;
  const ids = Array.from({ length: round.total }, (_, i) => i);

  function renderApple(id: number) {
    const inside = apples.inside.includes(id);
    const canMove = operation === "add" ? !inside : inside;
    return <Button key={id} variant="ghost" ref={(node) => { if (node) buttons.current.set(id, node); else buttons.current.delete(id); }} aria-label={`${inside ? "Basket" : "Outside"} apple ${id + 1}`} disabled={!canMove || complete || moving !== null || solved} className={`apple-tile relative p-0 ${inside ? "basket-apple" : "size-12 sm:size-16"} ${moving === id ? "z-10" : ""}`} onClick={(event) => {
      if (locked.current) return;
      const next = moveApple(apples, id, round);
      if (next === apples) return;
      locked.current = true;
      const position = event.currentTarget.getBoundingClientRect();
      startPosition.current = { x: position.x, y: position.y };
      setApples(next); setMoving(id);
      moveTimer.current = setTimeout(() => { locked.current = false; setMoving(null); }, 380);
    }}><img src={apple} alt="" width={816} height={816} className="w-full h-full object-contain" /></Button>;
  }

  return <>
    <div aria-label="Apple equation" className="font-display text-4xl sm:text-5xl text-foreground flex items-center gap-3">
      <img src={apple} alt="Apples" width={816} height={816} className="size-10 sm:size-14 object-contain" />
      <span>{round.first} {operation === "add" ? "+" : "−"} {round.second} = ?</span>
    </div>
    <div className="apple-play-area w-full max-w-xl flex flex-col items-center gap-3">
      <section aria-label="Apple basket" className="w-full flex flex-col items-center gap-1">
        <span role="status" aria-label="Apples in basket" className="font-display text-5xl text-teal">{apples.inside.length}</span>
        <div className="basket-scene w-full relative">
          <img src={basket} alt="Basket" width={992} height={672} className="basket-art absolute inset-0 w-full h-full pointer-events-none" />
          <div role="group" aria-label="Basket apples" className="basket-interior absolute grid grid-cols-5 justify-items-center items-center gap-1">
          {ids.filter((id) => apples.inside.includes(id)).map(renderApple)}
          </div>
          <img src={basket} alt="" width={992} height={672} className="basket-art basket-front absolute inset-0 w-full h-full pointer-events-none" />
        </div>
      </section>
      <section aria-label="Apples outside the basket" className="w-full">
        <div role="group" aria-label="Outside apples" className="apple-zone w-full flex flex-wrap justify-center gap-1 min-h-12 px-1 py-1">
          {ids.filter((id) => !apples.inside.includes(id)).map(renderApple)}
        </div>
      </section>
    </div>
    <div className="apple-answer-area min-h-16">
      {complete && moving === null && <div key={roundId} role="group" aria-label="Answer choices" className="flex gap-3">
        {round.choices.map((n) => <Choice key={n} correct={n === round.answer} disabled={solved} className="text-4xl w-20 sm:w-24 h-24 bg-sun" onPick={() => {
          setSolved(true);
          roundTimer.current = setTimeout(() => { const next = appleRound(max, operation); setRound(next); setApples(initialApples(next)); setSolved(false); setRoundId((id) => id + 1); }, 1000);
        }}>{n}</Choice>)}
      </div>}
    </div>
  </>;
}