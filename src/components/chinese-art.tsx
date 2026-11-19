import { CHINESE_THEMES, type ChineseTheme, type FamilyMember } from "@/lib/chinese-data";
import { familyRelation } from "@/lib/name";
import { FLASHCARD_ASSETS } from "@/lib/flashcard-assets";
const art = import.meta.glob<string>("../assets/chinese/*.jpg", { eager: true, query: "?url", import: "default" });
export function ChineseArt({ theme, character, className = "size-40" }: { theme: ChineseTheme; character: string; className?: string }) {
  const index = [...(CHINESE_THEMES.find(t => t.id === theme)?.characters ?? "")].indexOf(character);
  return <img src={FLASHCARD_ASSETS[`${theme}-${index}`]} alt="" width={320} height={320} className={`object-contain rounded-lg shrink-0 max-w-full ${className}`} />;
}
export function FamilyArt({ member, className = "size-24" }: { member: FamilyMember; className?: string }) {
  const relation = familyRelation(member.role);
  const relativeIndex = ["公公", "婆婆", "爺爺", "嫲嫲", "媽媽", "爸爸", "姨媽", "舅父", "姑媽", "伯父", "叔叔"].indexOf(member.role === "姨姨" ? "姑媽" : member.role);
  const source = relativeIndex >= 0 ? art[`../assets/chinese/relatives-${relativeIndex}.jpg`] : member.role === "我" ? art["../assets/chinese/relatives-11.jpg"] : art[`../assets/chinese/family-${relation?.picture ?? 4}.jpg`];
  return <img src={member.photo ?? source} alt="" width={384} height={384} className={`rounded-lg object-contain bg-card shrink-0 ${className}`} />;
}