import { Button } from "@/components/ui/button";
import type { MathRange } from "@/lib/name";

export function MathRangePicker({ value, onChange, ranges = [5, 10, 20] }: { value: MathRange; onChange: (value: MathRange) => void; ranges?: readonly MathRange[] }) {
  return <div role="group" aria-label="Number range" className="flex gap-2 sm:gap-3">
    {ranges.map((max) => <Button key={max} variant="tile" aria-pressed={max === value} className={`tile-sm ${max === value ? "bg-sun" : "bg-card"}`} onClick={() => onChange(max)}>1–{max}</Button>)}
  </div>;
}