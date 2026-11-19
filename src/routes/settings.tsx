import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { RequireName } from "@/components/kit";
import { useChildName } from "@/lib/child-name";
import { validateName } from "@/lib/name";
import { validateChineseName } from "@/lib/name";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Parent Settings — Little Learners" },
      { name: "description", content: "Change your child's name." },
      { property: "og:title", content: "Parent Settings — Little Learners" },
      { property: "og:description", content: "Change your child's name." },
    ],
  }),
  component: Settings,
});

function Settings() {
  const { name, setName, chineseName, setChineseName, clearNames, storageError } = useChildName();
  const [chineseValue, setChineseValue] = useState(chineseName);
  const [unlocked, setUnlocked] = useState(false);
  const [answer, setAnswer] = useState("");
  const [value, setValue] = useState(name);
  useEffect(() => { setValue(name); setChineseValue(chineseName); }, [name, chineseName]);
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();
  const q = useMemo(() => ({ a: 6 + Math.floor(Math.random() * 4), b: 5 + Math.floor(Math.random() * 4) }), []);

  return (
    <RequireName>
      <main className="min-h-screen px-4 py-8 flex flex-col items-center gap-6">
        <div className="w-full max-w-md"><Link to="/menu" className="tile tile-sm bg-card" aria-label="Back">⬅</Link></div>
        <h1 className="font-display text-4xl text-foreground">Parent Settings</h1>
        {!unlocked ? (
          <form className="w-full max-w-md flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); if (Number(answer) === q.a + q.b) setUnlocked(true); else setError("Not quite — grown-ups only!"); }}>
            <label htmlFor="gate" className="text-xl text-center">Grown-ups: what is {q.a} + {q.b}?</label>
            <input id="gate" inputMode="numeric" value={answer} onChange={(e) => setAnswer(e.target.value)} className="rounded-2xl border-[3px] border-border bg-card px-5 py-3 text-2xl text-center" />
            {error && <p className="text-destructive text-center">{error}</p>}
            <Button variant="tile" className="bg-teal text-primary-foreground">Continue</Button>
          </form>
        ) : (
          <form className="w-full max-w-md flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); const err = (value.trim() ? validateName(value) : null) ?? (chineseValue.trim() ? validateChineseName(chineseValue) : null); setError(err); if (!err) { setName(value.trim()); setChineseName(chineseValue.trim()); nav({ to: "/menu" }); } }}>
            <label htmlFor="name" className="text-xl text-center">Child's name</label>
            <input id="name" value={value} maxLength={15} onChange={(e) => setValue(e.target.value)} className="rounded-2xl border-[3px] border-border bg-card px-5 py-3 text-2xl text-center font-display" />
            <label htmlFor="chinese-name" className="text-xl text-center">Chinese name · 中文名字</label>
            <input id="chinese-name" value={chineseValue} maxLength={4} onChange={e => setChineseValue(e.target.value)} className="rounded-lg border-[3px] border-border bg-card px-5 py-3 text-2xl text-center" />
            <p className="text-sm text-muted-foreground text-center">Names and family photos stay on this device only. Clearing browser data removes them.</p>
            {storageError && <p role="alert" className="text-destructive">Names could not be saved on this device.</p>}
            {error && <p className="text-destructive text-center">{error}</p>}
            <Button variant="tile" className="bg-primary text-primary-foreground">Save</Button>
            <Button type="button" variant="outline" onClick={() => { clearNames(); setValue(""); setChineseValue(""); }}>Remove saved names</Button>
          </form>
        )}
      </main>
    </RequireName>
  );
}
