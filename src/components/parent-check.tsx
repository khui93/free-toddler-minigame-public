import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
export function ParentCheck({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  if (unlocked) return <>{children}</>;
  return <form className="flex flex-col gap-4 w-full max-w-sm" onSubmit={e => { e.preventDefault(); if (Number(value) === 15) setUnlocked(true); else setError(true); }}>
    <label htmlFor="parent-check" className="text-xl text-center">Grown-ups: what is 8 + 7?</label>
    <input id="parent-check" inputMode="numeric" value={value} onChange={e => setValue(e.target.value)} className="border-2 border-border rounded-lg bg-card px-4 py-3 text-2xl text-center" />
    {error && <p role="alert" className="text-destructive">Not quite — grown-ups only!</p>}
    <Button variant="tile" type="submit" className="bg-teal text-primary-foreground">Continue</Button>
  </form>;
}