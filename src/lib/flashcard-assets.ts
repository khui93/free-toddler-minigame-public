type AssetPointer = { url: string };
const pointers = import.meta.glob<AssetPointer>("../assets/flashcards/*.asset.json", { eager: true, import: "default" });
export const FLASHCARD_ASSETS = Object.fromEntries(Object.entries(pointers).map(([path, asset]) => [path.split("/").pop()?.replace(".jpg.asset.json", ""), asset.url]));
export const FLASHCARD_URLS = Object.values(FLASHCARD_ASSETS);