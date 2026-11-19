import { createFileRoute } from "@tanstack/react-router";
import { Menu } from "@/components/game-menu";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Pick a Game — Little Learners" },
      { name: "description", content: "Choose letter, name, counting, math, shape, pattern, sorting, and spatial learning games." },
      { property: "og:title", content: "Pick a Game — Little Learners" },
      { property: "og:description", content: "Choose letter, name, counting, math, shape, pattern, sorting, and spatial learning games." },
    ],
  }),
  component: Menu,
});

