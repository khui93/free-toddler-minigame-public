import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { GameShell } from "@/components/kit";
import { Button } from "@/components/ui/button";
import { ChineseArt } from "@/components/chinese-art";
import { logicHead } from "@/components/logic-controls";
import { LogicReward, useLogicFeedback } from "@/components/logic-session";
import { CHINESE_THEMES, type ChineseTheme } from "@/lib/chinese-data";
import { chineseRound } from "@/lib/name";
export const Route = createFileRoute("/games/chinese-match")({ head: () => logicHead("Picture & Character Match", "Match pictures and Chinese characters across six learning themes, online or offline."), component: ChineseMatch });
function ChineseMatch() {
  const [theme, setTheme] = useState<ChineseTheme | null>(null);
  return <GameShell title="Picture & Character Match" prompt={theme ? "Find the matching pair!" : "Pick a theme · 选一个主题"}>
    {theme ? <><Button variant="tile" className="tile-sm self-start bg-card text-base" onClick={() => setTheme(null)}>← Themes</Button><Match key={theme} theme={theme} /></> : <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">{CHINESE_THEMES.map(t => <Button key={t.id} variant="tile" className="bg-card w-full h-auto min-h-52 flex-col p-5 gap-4 whitespace-normal text-xl" onClick={() => setTheme(t.id)}><ChineseArt theme={t.id} character={[...t.characters][0] ?? ""} className="size-24" /><span className="block text-center leading-normal">{t.label}</span></Button>)}</div>}
  </GameShell>;
}
function Match({ theme }: { theme: ChineseTheme }) {
  const [round, setRound] = useState(() => chineseRound(theme));
  const feedback = useLogicFeedback(() => setRound(r => chineseRound(theme, r.remaining)));
  return <><div className="size-52 sm:size-60 shrink-0 flex items-center justify-center rounded-lg border-[3px] border-border bg-card p-6">{round.picturePrompt ? <ChineseArt theme={theme} character={round.target} className="size-36 sm:size-40" /> : <span className="text-8xl leading-normal text-teal" lang="zh-Hans">{round.target}</span>}</div>
    <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 w-full ${feedback.wrong ? "animate-wiggle" : ""}`}>{round.choices.map(c => <Button key={c} variant="tile" disabled={feedback.won} className="bg-card w-full min-w-0 min-h-44 h-48 p-5 text-5xl leading-normal" aria-label={round.picturePrompt ? c : `Picture ${c}`} onClick={() => { if (c === round.target) feedback.win(); else feedback.fail(); }}>{round.picturePrompt ? <span lang="zh-Hans">{c}</span> : <ChineseArt theme={theme} character={c} className="size-28" />}</Button>)}</div><LogicReward show={feedback.won} /></>;
}