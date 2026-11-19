# Phase 1 MVP — Kids Learning Games

Build Phase 1 only (3 games + parent setup). Later phases are out of scope for this plan but the structure will let them plug in.

## Screens
1. **Welcome / Parent Setup** (`/`) — "What's your child's name?" field (empty, no default), "Let's Play!" button. Validation: 2–15 English letters only, friendly error messages. Capitalization kept as typed.
2. **Game Menu** (`/menu`) — three big colorful tiles: Letter Match, Number Sequence, My Name. Small gear icon in a corner for Parent Settings.
3. **Parent Settings** (`/settings`) — parent gate first (e.g. "Hold this button for 3 seconds" or a simple math question like 7 + 5), then edit the name. Change applies immediately.
4. **Uppercase & Lowercase Matching** (`/games/letters`) — show an uppercase letter, tap the matching lowercase from 3–4 choices. Random A–Z rounds.
5. **Number Sequence** (`/games/numbers`) — a run of numbers 1–20 with one missing (e.g. 4, 5, ?, 7); tap the right number from choices.
6. **My Name** (`/games/my-name`) — mode picker with four modes:
   - A. Find your name among 3 names (decoys differ and look distinct).
   - B. Spell your name — shuffled letter tiles fill slots in order; repeated letters handled by matching on letter value, not tile identity.
   - C. Missing letter — "M — A — ? — A", pick from choices.
   - D. Uppercase vs title case — "MAYA" → pick "Maya".
   - Completion celebration: huge rainbow name, bouncing cartoon animals, cheer sound, spoken "Wonderful! You spelled your name!"

If the name isn't set (e.g. after refresh), every game/menu route sends the user back to the setup screen.

## Shared behavior (all games)
- Tap-only, large touch targets, works on tablets/phones.
- Spoken instructions using the browser's built-in speech (works offline, nothing sent to a server). A replay-instruction speaker button.
- Positive feedback: gentle wiggle + "Try again!" on wrong taps, unlimited retries; sparkle + cheer on correct.
- Sounds generated in-browser (no downloads needed).
- Long names auto-shrink tiles to fit.

## Privacy
- Name lives only in memory for the session (no storage, no backend, no accounts). Refresh = asked again.

## Offline
- No network calls; all assets bundled. Add a simple service worker only for published builds so the app can reopen offline (skipped in the editor preview to avoid caching issues).

## Visual direction
Bright, playful, rounded: warm cream background, candy palette (tomato, sunflower, teal, grape), chunky rounded font (e.g. Fredoka / Baloo 2). Cartoon animal illustrations generated as images for the menu and celebration.

## Technical details
- Session store: React context in `__root` holding `childName` (memory only); `beforeLoad`-style guard in a layout route `_play` that redirects to `/` when empty.
- Shared engine modules in `src/lib/`: `speech.ts` (speechSynthesis wrapper), `sound.ts` (Web Audio tones), `rounds.ts` (choice generation, shuffling), `name.ts` (validation regex `^[A-Za-z]{2,15}$`, case-normalized matching, decoy-name generator from a built-in list excluding the child's name case-insensitively).
- Reusable components: `ChoiceGrid`, `FeedbackOverlay`, `Celebration`, `SpeakButton`, `ParentGate`.
- Each route gets its own head() metadata.
- Vitest tests: name validation (2/15 boundary, non-letters rejected), spelling sequence with repeated letters ("Maya", "Anna"), decoys never equal the name, missing-number rounds within 1–20.
