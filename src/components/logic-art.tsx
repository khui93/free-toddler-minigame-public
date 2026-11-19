import { SHAPES, type PictureName, type ShapeName } from "@/lib/name";
import { Brush, Utensils, RectangleHorizontal } from "lucide-react";
const toyImages = import.meta.glob<string>("/src/assets/toys/*", { eager: true, query: "?url", import: "default" });

export function ShapeArt({ shape, outline = false, rotate = false, color = "", className = "" }: { shape: ShapeName; outline?: boolean; rotate?: boolean; color?: string | undefined; className?: string }) {
  const paths: Record<ShapeName, React.ReactNode> = {
    circle: <circle cx="50" cy="50" r="35" />, square: <rect x="16" y="16" width="68" height="68" rx="2" />,
    triangle: <path d="M50 12 90 84H10Z" />, rectangle: <rect x="6" y="25" width="88" height="50" rx="2" />,
    oval: <ellipse cx="50" cy="50" rx="43" ry="29" />,
    star: <path d="m50 8 12 27 30 3-23 21 7 31-26-16-26 16 7-31L8 38l30-3Z" />,
    heart: <path d="M50 86 15 52C-8 22 29 0 50 28 71 0 108 22 85 52Z" />,
    hexagon: <polygon points="28,12 72,12 94,50 72,88 28,88 6,50" />,
    pentagon: <polygon points="50,8 92,39 76,88 24,88 8,39" />,
    octagon: <polygon points="32,8 68,8 92,32 92,68 68,92 32,92 8,68 8,32" />,
  };
  return <svg viewBox="0 0 100 100" aria-hidden="true" className={`logic-shape ${outline ? "shape-outline" : ""} ${rotate ? "shape-rotated" : ""} ${color || "text-tomato"} ${className}`}>{paths[shape]}</svg>;
}
export function Picture({ name, color, small = false }: { name: PictureName; color?: string; small?: boolean }) {
  if (["Red", "Blue", "Yellow", "Green"].includes(name)) return <ShapeArt shape="circle" color={colorClass(name)} />;
  if ((SHAPES as readonly string[]).includes(name)) return <ShapeArt shape={name as ShapeName} color={color} className={small ? "picture-small" : ""} />;
  const image = toyImages[`/src/assets/toys/${name}.png`] ?? toyImages[`/src/assets/toys/${name}.jpg`];
  if (image) return <span className={`logic-picture ${small ? "picture-small" : ""}`}><img src={image} alt="" width={400} height={400} loading="lazy" /></span>;
  if (name === "ball") return <span className="logic-ball" />;
  if (name === "box") return <span className="logic-box-mini" />;
  if (name === "comb") return <svg viewBox="0 0 100 100" className="logic-shape text-grape" aria-hidden="true"><rect x="10" y="20" width="80" height="16" rx="5" />{[15,25,35,45,55,65,75,85].map((x) => <rect key={x} x={x} y="30" width="5" height="44" rx="2" />)}</svg>;
  if (name === "soap") return <svg viewBox="0 0 100 100" className="logic-shape text-leaf" aria-hidden="true"><rect x="12" y="35" width="76" height="48" rx="16" /><circle cx="28" cy="20" r="10" /><circle cx="56" cy="16" r="8" /></svg>;
  const Icon = name === "toothbrush" ? Brush : name === "spoon" ? Utensils : RectangleHorizontal;
  return <Icon className="size-16 text-teal" aria-hidden="true" />;
}
export const colorClass = (color?: string) => ({ Red: "text-tomato", Blue: "text-teal", Yellow: "text-sun", Green: "text-leaf" }[color ?? ""] ?? "text-tomato");