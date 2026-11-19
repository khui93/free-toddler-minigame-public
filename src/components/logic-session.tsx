import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Star } from "lucide-react";
import { sounds } from "@/lib/audio";

export function useLogicFeedback(next: () => void) {
  const [won, setWon] = useState(false);
  const [wrong, setWrong] = useState(false);
  const [moving, setMoving] = useState(false);
  const lock = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (fn: () => void, delay: number) => { timers.current.push(setTimeout(fn, delay)); };
  return {
    won, wrong, moving, locked: lock,
    fail: () => { if (lock.current) return; sounds.wrong(); setWrong(true); later(() => setWrong(false), 450); },
    move: (done?: () => void) => { if (lock.current) return; lock.current = true; setMoving(true); later(() => { lock.current = false; setMoving(false); done?.(); }, 420); },
    win: () => { if (lock.current) return; lock.current = true; setWon(true); sounds.correct(); later(() => { next(); setWon(false); lock.current = false; }, 1800); },
  };
}
export function LogicReward({ show }: { show: boolean }) {
  return show ? createPortal(<div role="status" aria-label="Correct answer" className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"><Star className="size-48 sm:size-64 fill-current text-sun reward-star animate-reward-pop" /></div>, document.body) : null;
}