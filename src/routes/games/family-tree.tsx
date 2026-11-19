import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { GameShell } from "@/components/kit";
import { Button } from "@/components/ui/button";
import { FamilyArt } from "@/components/chinese-art";
import { ParentCheck } from "@/components/parent-check";
import { logicHead } from "@/components/logic-controls";
import { LogicReward, useLogicFeedback } from "@/components/logic-session";
import { FAMILY_ROLES, INITIAL_FAMILY, type FamilyMember, type FamilyRole } from "@/lib/chinese-data";
import { familyRelation, familyRound, siblingRole } from "@/lib/name";
import { readFamily, resizeFamilyPhoto, saveFamily } from "@/lib/device-data";
export const Route = createFileRoute("/games/family-tree")({ head: () => logicHead("My Family Tree", "Learn Cantonese family names with a family tree and photos saved only on this device."), component: FamilyTree });
function FamilyTree() {
  const [members, setMembers] = useState<FamilyMember[]>(INITIAL_FAMILY);
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState<"tree" | "play" | "setup">("tree");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => { let active = true; readFamily().then(data => { if (active && data) setMembers(data); }).catch(() => { if (active) setError("Photos cannot be saved in this browser. Drawings are still available."); }).finally(() => { if (active) setLoaded(true); }); return () => { active = false; }; }, []);
  async function update(next: FamilyMember[]) {
    setBusy(true);
    try { await saveFamily(next); setMembers(next); setError(""); }
    catch { setError("Could not save on this device. Please check available storage."); }
    finally { setBusy(false); }
  }
  return <GameShell title="My Family Tree" prompt={view === "play" ? "Who is this? · 这是谁？" : view === "setup" ? "Family photos" : "My family · 我的家人"}>
    <div className="flex gap-2 flex-wrap justify-center">{(["tree", "play", "setup"] as const).map(v => <Button key={v} variant="tile" className={`tile-sm text-base ${view === v ? "bg-sun" : "bg-card"}`} disabled={!loaded || busy || (v === "play" && members.length < 2)} onClick={() => setView(v)}>{v === "tree" ? "Family tree" : v === "play" ? "Let's match!" : "Parent setup"}</Button>)}</div>
    {error && <p role="alert" className="text-destructive text-center">{error}</p>}
    {!loaded ? <p role="status">Opening family…</p> : view === "play" ? <FamilyMatch key={members.map(m => m.id).join("-")} members={members} /> : view === "setup" ? <ParentCheck><FamilySetup members={members} busy={busy} update={update} reportError={setError} /></ParentCheck> : <div className="w-full grid grid-cols-2 gap-x-3 gap-y-5">
      {(["mum", "dad"] as const).map(side => <section key={side} className="min-w-0 flex flex-col items-center gap-4"><h2 className={`w-full rounded-lg py-3 text-center font-display text-xl ${side === "mum" ? "bg-grape text-primary-foreground" : "bg-teal text-primary-foreground"}`}>{side === "mum" ? "Mum's side" : "Dad's side"}</h2>{[0, 1].map(generation => <div key={generation} className="w-full flex flex-wrap justify-center gap-3 border-b-2 border-border pb-4">{members.filter(m => { const r = familyRelation(m.role); return r?.side === side && r.generation === generation; }).map(m => <figure key={m.id} className="flex flex-col items-center gap-2"><FamilyArt member={m} className="size-20 sm:size-24" /><figcaption className="text-xl" lang="zh-Hant">{m.role}</figcaption></figure>)}</div>)}</section>)}
      <section className="col-span-2 border-t-2 border-border pt-4 flex flex-wrap justify-center gap-5">{members.filter(m => familyRelation(m.role)?.side === "children").map(m => <figure key={m.id} className="flex flex-col items-center gap-2"><FamilyArt member={m} /><figcaption className="text-xl" lang="zh-Hant">{m.role}</figcaption></figure>)}</section>
    </div>}
  </GameShell>;
}
function FamilyMatch({ members }: { members: FamilyMember[] }) {
  const [round, setRound] = useState(() => familyRound(members));
  const feedback = useLogicFeedback(() => setRound(familyRound(members)));
  if (!round) return null;
  return <><div className="h-44 flex items-center justify-center">{round.picturePrompt ? <FamilyArt member={round.target} className="size-44" /> : <span lang="zh-Hant" className="text-6xl text-teal">{round.target.role}</span>}</div>
    <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 w-full ${feedback.wrong ? "animate-wiggle" : ""}`}>{round.choices.map(m => <Button key={m.id} variant="tile" className="bg-card h-36 text-3xl" disabled={feedback.won} aria-label={round.picturePrompt ? m.role : `Photo ${m.role}`} onClick={() => m.id === round.target.id ? feedback.win() : feedback.fail()}>{round.picturePrompt ? <span lang="zh-Hant">{m.role}</span> : <FamilyArt member={m} className="size-28" />}</Button>)}</div><LogicReward show={feedback.won} /></>;
}
function FamilySetup({ members, update, busy, reportError }: { members: FamilyMember[]; update: (next: FamilyMember[]) => Promise<void>; busy: boolean; reportError: (message: string) => void }) {
  const [memberName, setMemberName] = useState("");
  const [role, setRole] = useState<FamilyRole>("姐姐");
  const [kind, setKind] = useState<"sibling" | "relative">("sibling");
  const [age, setAge] = useState<"elder" | "younger">("elder");
  const [gender, setGender] = useState<"brother" | "sister">("sister");
  return <div className="w-full flex flex-col gap-5">
    <p className="text-center text-muted-foreground">Photos stay on this device only. They are never uploaded.</p>
    <div className="grid sm:grid-cols-2 gap-4">{members.map(m => <div key={m.id} className="border border-border bg-card rounded-lg p-4 flex items-center gap-4"><FamilyArt member={m} className="size-24 shrink-0" /><div className="min-w-0 flex flex-col gap-2 flex-1"><span className="text-2xl" lang="zh-Hant">{m.role}</span>{m.name && <span className="text-base break-words">{m.name}</span>}<PhotoLink member={m} busy={busy} onPhoto={async file => { try { const photo = await resizeFamilyPhoto(file); await update(members.map(n => n.id === m.id ? { ...n, photo } : n)); } catch (error) { reportError(error instanceof Error ? error.message : "Could not open this photo."); } }} /><div className="flex flex-wrap gap-2">{m.photo && <Button variant="outline" size="sm" disabled={busy} onClick={() => void update(members.map(n => n.id === m.id ? { id: n.id, role: n.role, ...(n.name ? { name: n.name } : {}) } : n))}>Remove photo</Button>}<Button variant="outline" size="sm" disabled={busy} onClick={() => void update(members.filter(n => n.id !== m.id))}>Remove member</Button></div></div></div>)}</div>
    <form className="flex flex-col gap-4 max-w-md w-full self-center border-t-2 border-border pt-5" onSubmit={e => { e.preventDefault(); const name = memberName.trim(); if (!name) return; const selectedRole = kind === "sibling" ? siblingRole(age, gender) : role; void update([...members, { id: crypto.randomUUID(), name, role: selectedRole }]).then(() => setMemberName("")); }}>
      <label className="text-xl" htmlFor="member-name">Family member's name</label><input id="member-name" required maxLength={30} autoComplete="off" value={memberName} onChange={e => setMemberName(e.target.value)} className="rounded-lg border-2 border-border bg-card p-3 text-xl" />
      <div role="group" aria-label="Member type" className="flex gap-2">{(["sibling", "relative"] as const).map(k => <Button key={k} type="button" variant="tile" className={`tile-sm text-base ${kind === k ? "bg-sun" : "bg-card"}`} aria-pressed={kind === k} onClick={() => setKind(k)}>{k === "sibling" ? "Sibling" : "Other relative"}</Button>)}</div>
      {kind === "sibling" ? <><div role="group" aria-label="Sibling age" className="flex gap-2">{(["elder", "younger"] as const).map(a => <Button key={a} type="button" variant="tile" className={`tile-sm text-base ${age === a ? "bg-sun" : "bg-card"}`} aria-pressed={age === a} onClick={() => setAge(a)}>{a === "elder" ? "Elder sibling" : "Younger sibling"}</Button>)}</div><div role="group" aria-label="Sibling relation" className="flex gap-2">{(["brother", "sister"] as const).map(g => <Button key={g} type="button" variant="tile" className={`tile-sm text-base ${gender === g ? "bg-sun" : "bg-card"}`} aria-pressed={gender === g} onClick={() => setGender(g)}>{g === "brother" ? "Brother" : "Sister"}</Button>)}</div></> : <label className="flex flex-col gap-2">Relationship<select aria-label="Relationship" className="rounded-lg border-2 border-border bg-card p-3 text-xl" value={role} onChange={e => { const next = FAMILY_ROLES.find(r => r.role === e.target.value); if (next) setRole(next.role); }}>{FAMILY_ROLES.map(r => <option key={r.role} value={r.role}>{r.role}{"age" in r ? ` (${r.age})` : ""} · {r.side === "mum" ? "Mum's side" : r.side === "dad" ? "Dad's side" : "Children"}</option>)}</select></label>}
      <Button variant="tile" type="submit" disabled={busy} className="tile-sm bg-teal text-primary-foreground">Add member</Button>
    </form>
    <Button variant="outline" disabled={busy || !members.some(m => m.photo)} onClick={() => { if (window.confirm("Remove every saved family photo from this device?")) void update(members.map(m => ({ id: m.id, role: m.role, ...(m.name ? { name: m.name } : {}) }))); }}>Remove all photos</Button>
  </div>;
}
function PhotoLink({ member, busy, onPhoto }: { member: FamilyMember; busy: boolean; onPhoto: (file: File) => Promise<void> }) {
  const input = useRef<HTMLInputElement>(null);
  return <><Button type="button" variant="link" disabled={busy} className="underline text-teal justify-start px-0 self-start text-base" onClick={() => input.current?.click()}>Choose photo</Button><input ref={input} aria-label={`Photo for ${member.role}${member.name ? ` ${member.name}` : ""}`} type="file" accept="image/*" disabled={busy} className="hidden" onChange={e => { const file = e.target.files?.[0]; e.target.value = ""; if (file) void onPhoto(file); }} /></>;
}