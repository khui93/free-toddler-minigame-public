import { Button } from "@/components/ui/button";
import type { LogicLevel } from "@/lib/name";
export function LogicLevels({ value, onChange }: { value: LogicLevel; onChange: (level: LogicLevel) => void }) {
  return <div role="group" aria-label="Difficulty" className="flex gap-2 flex-wrap justify-center">{([1, 2, 3] as const).map((level) => <Button key={level} variant="tile" className={`tile-sm text-base ${value === level ? "bg-sun" : "bg-card"}`} aria-pressed={value === level} onClick={() => onChange(level)}>{["Beginner", "Intermediate", "Advanced"][level - 1]}</Button>)}</div>;
}
export function logicHead(title: string, description: string) {
  return { meta: [{ title: `${title} — Little Learners` }, { name: "description", content: description }, { property: "og:title", content: `${title} — Little Learners` }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] };
}