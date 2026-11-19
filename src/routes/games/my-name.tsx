import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Celebration, Choice, GameShell, SuccessStar } from "@/components/kit";
import { useChildName } from "@/lib/child-name";
import { decoyNames, isNextLetter, sameLetter, shuffle, titleCase, validateName } from "@/lib/name";
import { Button } from "@/components/ui/button";
import { sounds } from "@/lib/audio";
import { ChineseNameGame } from "@/components/chinese-name-game";
import { validateChineseName } from "@/lib/name";

export const Route = createFileRoute("/games/my-name")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Recognize my name — Little Learners" },
      { name: "description", content: "Find, spell and complete your own name." },
      { property: "og:title", content: "Recognize my name — Little Learners" },
      { property: "og:description", content: "Find, spell and complete your own name." },
    ],
  }),
  component: MyName,
});

type Mode = "find" | "spell" | "missing" | "case" | "chinese";
const MODES: { id: Mode; label: string; cls: string }[] = [
  { id: "find", label: "Find my name", cls: "bg-tomato" },
  { id: "spell", label: "Spell my name", cls: "bg-teal" },
  { id: "missing", label: "Missing letter", cls: "bg-grape" },
  { id: "case", label: "BIG & small", cls: "bg-leaf" },
];

function MyName() {
  const { name, setName, chineseName, setChineseName, storageError } = useChildName();
  const [language, setLanguage] = useState<"english" | "chinese">("english");
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(name);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode | null>(null);
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!done) return;
    const timer = setTimeout(() => { setMode(null); setDone(false); }, 1800);
    return () => clearTimeout(timer);
  }, [done]);
  const languagePicker = <div className="flex gap-3" role="group" aria-label="Name language">{(["english", "chinese"] as const).map(l => <Button key={l} variant="tile" className={`tile-sm text-xl ${language === l ? "bg-sun" : "bg-card"}`} aria-pressed={language === l} onClick={() => { setLanguage(l); setMode(null); setEditing(false); setValue(l === "english" ? name : chineseName); setError(null); }}>{l === "english" ? "English" : "中文"}</Button>)}</div>;
  const activeName = language === "english" ? name : chineseName;
  if (!activeName || editing) return <GameShell title="Recognize my name" prompt={language === "english" ? "What's your name?" : "你的中文名字？"}>
    {languagePicker}
    <form className="w-full max-w-md flex flex-col gap-4" onSubmit={(e) => {
      e.preventDefault();
      const err = language === "english" ? validateName(value) : validateChineseName(value);
      setError(err);
      if (!err) { if (language === "english") setName(value.trim()); else setChineseName(value.trim()); setEditing(false); }
    }}>
      <input aria-label={language === "english" ? "What's your name?" : "Chinese name"} value={value} onChange={(e) => setValue(e.target.value)} maxLength={language === "english" ? 15 : 4} autoComplete="off" className="rounded-lg border-[3px] border-border bg-card px-5 py-4 text-2xl font-display text-center outline-none focus:border-teal" />
      <p className="text-sm text-muted-foreground text-center">Saved only on this device. Never uploaded.</p>
      {error && <p role="alert" className="text-destructive text-center font-semibold">{error}</p>}
      <Button type="submit" variant="tile" className="bg-primary text-primary-foreground">Let's Play!</Button>
    </form>
  </GameShell>;

  const prompts: Record<Mode, string> = {
    find: "Can you find your name?",
    spell: "Let's spell your name!",
    missing: "Which letter is missing?",
    case: "Which one matches?",
    chinese: "Choose the next character · 选下一个字",
  };

  if (!mode) {
    return (
      <GameShell title="Recognize my name" prompt="Pick a name game!">
        {languagePicker}
        {storageError && <p role="alert" className="text-destructive">This browser cannot save names. You can still play this session.</p>}
        <div className="grid gap-4 sm:grid-cols-2 w-full">
          {language === "chinese" ? <Button variant="tile" className="bg-teal text-primary-foreground py-8" onClick={() => { setMode("chinese"); setDone(false); }}>Build my Chinese name · 中文名字</Button> : MODES.map((m) => (
            <Button variant="tile" key={m.id} className={`tile ${m.cls} text-primary-foreground py-8`} onClick={() => { setMode(m.id); setDone(false); }}>{m.label}</Button>
          ))}
        </div>
        <Button variant="outline" onClick={() => { setValue(activeName); setEditing(true); }}>Change {language === "english" ? "English" : "Chinese"} name</Button>
      </GameShell>
    );
  }

  const win = () => setDone(true);
  const key = `${mode}-${name}`;

  return (
    <GameShell title="Recognize my name" prompt={prompts[mode]}>
      <Button variant="tile" className="tile tile-sm bg-card text-base self-start" onClick={() => setMode(null)}>← Name games</Button>
      {done ? (
        <Celebration word={activeName} message="Wonderful!" />
      ) : mode === "chinese" ? <ChineseNameGame key={chineseName} name={chineseName} onWin={win} /> : mode === "find" ? <Find key={key} name={name} onWin={win} />
        : mode === "spell" ? <Spell key={key} name={name} onWin={win} />
        : mode === "missing" ? <Missing key={key} name={name} onWin={win} />
        : <CaseMatch key={key} name={name} onWin={win} />}
    </GameShell>
  );
}

const sizeFor = (len: number) => (len > 10 ? "min-w-10 min-h-12 text-xl px-1" : len > 6 ? "min-w-14 min-h-16 text-3xl px-2" : "min-w-20 min-h-20 text-5xl");

function Find({ name, onWin }: { name: string; onWin: () => void }) {
  const opts = useMemo(() => shuffle([name, ...decoyNames(name)]), [name]);
  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      {opts.map((o) => <Choice key={o} correct={o === name} onPick={onWin} className="w-full text-4xl">{o}</Choice>)}
    </div>
  );
}

function Spell({ name, onWin }: { name: string; onWin: () => void }) {
  const tiles = useMemo(() => shuffle(name.split("").map((c, i) => ({ c, id: i }))), [name]);
  const [filled, setFilled] = useState(0);
  const [used, setUsed] = useState<number[]>([]);
  const [wrong, setWrong] = useState<number | null>(null);
  const size = sizeFor(name.length);
  return (
    <>
      <div className="h-16">{filled > 0 && <SuccessStar key={filled} />}</div>
      <div className="flex flex-wrap justify-center gap-2">
        {name.split("").map((c, i) => (
          <div key={i} className={`tile ${size} ${i < filled ? "bg-sun animate-pop" : "bg-muted border-dashed"}`}>{i < filled ? c : ""}</div>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {tiles.map((t) => used.includes(t.id) ? <div key={t.id} className={`${size} invisible`} /> : (
          <Button variant="tile" disabled={filled === name.length} key={t.id} className={`tile ${size} bg-card ${wrong === t.id ? "animate-wiggle" : ""}`}
            onClick={() => {
              if (isNextLetter(name, filled, t.c)) {
                sounds.correct();
                const next = filled + 1;
                setFilled(next); setUsed((u) => [...u, t.id]);
                if (next === name.length) setTimeout(onWin, 500);
              } else {
                sounds.wrong(); setWrong(t.id); setTimeout(() => setWrong(null), 450);
              }
            }}>{t.c}</Button>
        ))}
      </div>
    </>
  );
}

function Missing({ name, onWin }: { name: string; onWin: () => void }) {
  const { idx, choices } = useMemo(() => {
    const idx = Math.floor(Math.random() * name.length);
    const target = name.charAt(idx);
    const pool = "abcdefghijklmnopqrstuvwxyz".split("").filter((l) => !sameLetter(l, target));
    const others = shuffle(pool).slice(0, 2).map((l) => (target === target.toUpperCase() ? l.toUpperCase() : l));
    return { idx, choices: shuffle([target, ...others]) };
  }, [name]);
  const [solved, setSolved] = useState(false);
  const size = sizeFor(name.length);
  return (
    <>
      <div className="flex flex-wrap justify-center gap-2">
        {name.split("").map((c, i) => (
          <div key={i} className={`tile ${size} ${i === idx && !solved ? "bg-sun" : "bg-card"}`}>{i === idx && !solved ? "?" : c}</div>
        ))}
      </div>
      <div className="flex gap-4">
        {choices.map((c, i) => <Choice key={i} correct={sameLetter(c, name.charAt(idx))} className="bg-grape text-primary-foreground text-5xl w-24 h-24" onPick={() => { setSolved(true); onWin(); }}>{c}</Choice>)}
      </div>
    </>
  );
}

function CaseMatch({ name, onWin }: { name: string; onWin: () => void }) {
  const target = titleCase(name);
  const opts = useMemo(() => shuffle([target, ...decoyNames(name).map(titleCase)]), [name, target]);
  return (
    <>
      <div className="font-display text-6xl sm:text-7xl text-teal break-all text-center animate-pop">{name.toUpperCase()}</div>
      <div className="flex flex-col gap-4 w-full max-w-md">
        {opts.map((o) => <Choice key={o} correct={o === target} onPick={onWin} className="w-full text-4xl">{o}</Choice>)}
      </div>
    </>
  );
}
