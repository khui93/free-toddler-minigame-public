import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { sounds } from "@/lib/audio";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import animals from "@/assets/animals.png";

export function RequireName({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function SuccessStar() {
  return <span role="status" aria-label="Correct answer" className="inline-flex text-sun animate-pop"><Star className="size-16 fill-current" /></span>;
}

export function GameShell({ title, prompt, children, className = "" }: { title: string; prompt: string; children: ReactNode; className?: string }) {
  return (
    <RequireName>
      <main className={`min-h-screen px-4 py-6 flex flex-col items-center ${className}`}>
        <div className="w-full max-w-3xl flex items-center justify-between gap-3">
          <Link to="/menu" className="tile tile-sm bg-card" aria-label="Back to games">⬅</Link>
          <h1 className="font-display text-2xl sm:text-3xl text-foreground">{title}</h1>
          <span className="size-12 shrink-0" aria-hidden="true" />
        </div>
        <p className="mt-4 font-display text-xl text-muted-foreground text-center">{prompt}</p>
        <div className="mt-8 w-full max-w-3xl flex-1 flex flex-col items-center gap-8">{children}</div>
      </main>
    </RequireName>
  );
}

/** Button that wiggles on wrong taps. */
export function Choice({ onPick, correct, children, className = "", disabled = false }: { onPick: () => void; correct: boolean; children: ReactNode; className?: string; disabled?: boolean }) {
  const [wiggle, setWiggle] = useState(false);
  const [won, setWon] = useState(false);
  const locked = useRef(false);
  return (
    <Button variant="tile"
      disabled={disabled || won}
      className={`relative ${wiggle ? "animate-wiggle" : ""} ${className}`}
      onClick={() => {
        if (locked.current) return;
        if (correct) { locked.current = true; setWon(true); sounds.correct(); onPick(); }
        else { sounds.wrong(); setWiggle(true); setTimeout(() => setWiggle(false), 500); }
      }}
    >
      {children}
      {won && createPortal(
        <div className="correct-answer-pop pointer-events-none fixed inset-0 z-50 flex items-center justify-center" role="status" aria-label="Correct answer">
          <div className="relative text-sun animate-reward-pop">
            <Star className="size-48 sm:size-64 fill-current reward-star" />
            <Star className="absolute -top-7 -left-7 size-10 fill-current text-teal" />
            <Star className="absolute top-2 -right-10 size-12 fill-current text-tomato" />
            <Star className="absolute -bottom-6 right-1 size-8 fill-current text-leaf" />
          </div>
        </div>, document.body
      )}
    </Button>
  );
}


const COLORS = ["text-tomato", "text-sun", "text-teal", "text-grape", "text-leaf"];
export function RainbowWord({ word, className = "" }: { word: string; className?: string }) {
  return (
    <span className={`font-display ${className}`}>
      {word.split("").map((c, i) => (
        <span key={i} className={`${COLORS[i % COLORS.length]} inline-block animate-bounce-letter`} style={{ animationDelay: `${i * 80}ms` }}>{c}</span>
      ))}
    </span>
  );
}

export function Celebration({ word, message }: { word: string; message: string }) {
  useEffect(() => {
    sounds.cheer();
  }, [message]);
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <SuccessStar />
      <RainbowWord word={word} className="text-6xl sm:text-8xl break-all" />
      <img src={animals} alt="Cartoon animals cheering" width={1024} height={640} className="w-full max-w-md animate-cheer" />
      <p className="font-display text-2xl text-foreground">{message}</p>
    </div>
  );
}
