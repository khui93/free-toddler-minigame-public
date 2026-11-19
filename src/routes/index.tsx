import { createFileRoute } from "@tanstack/react-router";
import { Menu } from "@/components/game-menu";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Hi Sunshine — Little Learners" },
      { name: "description", content: "Toddler Mini Games v2: silent offline letter, number, Chinese character, family, name, and logic games." },
      { property: "og:title", content: "Hi Sunshine — Little Learners" },
      { property: "og:description", content: "Toddler Mini Games v2: offline Chinese characters, family, names, numbers and playful learning." },
    ],
  }),
  component: Menu,
});
