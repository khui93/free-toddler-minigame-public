import { Link } from "@tanstack/react-router";
import { RequireName, RainbowWord } from "@/components/kit";
import bunny from "@/assets/counting-bunny.png";
import apple from "@/assets/counting-apple.png";
import { OfflineInstall } from "@/components/offline-install";

const GAMES = [
  { to: "/games/letters", label: "Letter Match", icon: "Aa", image: null, cls: "bg-tomato" },
  { to: "/games/numbers", label: "Know my number", icon: "123", image: null, cls: "bg-teal" },
  { to: "/games/my-name", label: "Recognize my name", icon: "⭐", image: null, cls: "bg-grape" },
  { to: "/games/chinese-match", label: "Picture & Character Match", icon: "字", image: null, cls: "bg-teal" },
  { to: "/games/family-tree", label: "My Family Tree", icon: "🌳", image: null, cls: "bg-leaf text-foreground" },
  { to: "/games/count-critters", label: "Count the Bunny", icon: "", image: bunny, cls: "bg-leaf text-foreground" },
  { to: "/games/apple-basket", label: "Apple Basket", icon: "", image: apple, cls: "bg-tomato" },
  { to: "/games/shapes", label: "Shape Sorter & Hunt", icon: "△○", image: null, cls: "bg-sun text-foreground" },
  { to: "/games/sort-toys", label: "Sort the Toys", icon: "🧸", image: null, cls: "bg-teal" },
  { to: "/games/pattern-parade", label: "Pattern Parade", icon: "🐱🐶", image: null, cls: "bg-leaf text-foreground" },
  { to: "/games/odd-one-out", label: "Which One Doesn't Belong?", icon: "🔎", image: null, cls: "bg-grape" },
  { to: "/games/wheres-ball", label: "Where's the Ball?", icon: "⚽", image: null, cls: "bg-tomato" },
] as const;

export function Menu() {
  return (
    <RequireName>
      <main className="min-h-screen px-4 py-8 flex flex-col items-center gap-8">
        <div className="w-full max-w-3xl flex justify-end gap-3">
          <Link to="/settings" className="tile tile-sm bg-card" aria-label="Parent settings">⚙️</Link>
        </div>
        <h1 className="text-5xl text-center"><span className="font-display text-foreground">Hi </span><RainbowWord word="Sunshine" /><span className="text-foreground">.</span></h1>
        <OfflineInstall />
        <span className="text-sm text-muted-foreground">Toddler Mini Games · v2</span>
        <div className="grid gap-6 sm:grid-cols-3 w-full max-w-3xl">
          {GAMES.map((g) => (
            <Link key={g.to} to={g.to} className={`tile ${g.cls} text-primary-foreground flex-col gap-2 py-10`}>
              {g.image ? <img src={g.image} alt="" width={816} height={816} className="size-20 object-contain" /> : <span className="text-6xl h-20 flex items-center">{g.icon}</span>}
              <span className="text-2xl text-center whitespace-normal">{g.label}</span>
            </Link>
          ))}
        </div>
      </main>
    </RequireName>
  );
}
