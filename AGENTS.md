<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- English and Chinese names use context hydrated from device-only localStorage; family photos use device-only IndexedDB and resized JPEGs — private child data must never enter network requests or service-worker caches.
- Game rules (validation, spelling, rounds) live in pure functions in `src/lib/name.ts` with tests in `src/test/` — keeps games testable and reusable for later phases.
- The audio compatibility API is inert and no audio provider or controls are mounted — every game remains silent.
- Shared Choice owns tap locking and visual correct-answer feedback — repeated taps cannot schedule multiple round transitions.
- Letter rounds carry an in-memory shuffled alphabet deck between rounds — every letter is exhausted before refill, independently of question case.
- Number train departure uses completion state with a delayed round reset — the completed sequence stays visible during departure.
- My Name completion resets the local mode rather than navigating — the session and name-game picker remain on the same route.
- Counting and apple state transitions use pure functions with stable item IDs in the shared game engine — repeated taps cannot count or move an item twice.
- Apple movements animate between measured element positions after state updates and lock taps until movement ends; basket apples sit between illustration and foreground-rim layers — tap-only input stays accurate and apples appear inside the basket.
- Bunny counting renders animals without tap state and exposes answer choices on round creation — children can answer by visual counting alone.
- Phase 3 routes share semantic object artwork and transient feedback helpers; their pure generators and validators stay in the existing game engine — each activity remains independently testable and session-only.
- Semantic object artwork uses individually isolated image files, not live sprite offsets — neighboring illustrations cannot bleed into game choices.
- Size ranking validates consecutive positions through pure game rules and renders size using rank classes — children compare the same object while repeated taps cannot skip ranks.
- Spatial placement uses relation-specific destination sets and layered box art — broad concepts such as outside never compete with other valid outside destinations.
- Pattern rounds carry the full sequence and a missing index; the view replaces that slot rather than appending a question — object counts and in-sequence blanks stay consistent with the game rules.
- General games and the menu do not require a name; the name game collects it in React context before showing its modes — name entry never blocks other activities.
- Offline support uses vite-plugin-pwa generateSW after TanStack's SPA-shell post-build; one root-effect wrapper blocks registration in dev/preview and NetworkFirst navigations fall back to the precached client-only shell — every route can open offline without caching child state or mismatched game markup.
- PWA metadata and cache policy share a browser-safe module; fonts are bundled locally — manifest, head tags, tests, and offline assets stay consistent.
- Chinese and family rules stay in the pure game engine with browser-safe curriculum data; original flashcard asset pointers are explicitly precached by Workbox and family cutouts are bundled — new games remain testable and fully offline.
- The shared menu lives outside route modules and is imported by both entry routes — route code splitting must not produce different server/client trees.
