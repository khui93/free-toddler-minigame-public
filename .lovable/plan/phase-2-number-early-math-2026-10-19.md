# Phase 2 — Number & Early Math

## Scope
Add three tap-only games to the existing game menu, preserving the current letter, number train, and name games.

**Audio decision:** Your latest request to remove all voiceover takes priority over the pasted narrated-feedback criterion. Phase 2 uses visual counting, numerals, stars, and optional non-voice sound effects only. No welcome speech or narration will be reintroduced.

## New games

### 1. Number Finder
- Recognize numerals 1–20: show a target numeral and choose its match from shuffled numeral tiles.
- Use four large choices, one correct answer, and unlimited retries.
- Cycle through all 20 target numbers before repeating; show a star before advancing.

### 2. Count the Critters
- Show a group of clearly separated cartoon animals, with selectable ranges 1–5, 1–10, and 1–20.
- Each animal counts only once: tapping adds a visible numbered badge and changes its appearance.
- Keep the running total visible. After every animal is counted, choose the matching numeral from three choices.
- A correct total earns a star and starts the next group; wrong totals allow another try.

### 3. Apple Basket
- Addition and subtraction modes, with ranges up to 5, 10, and 20; start within 5.
- Show a picture-supported equation, such as 2 + 3 = ? or 5 − 2 = ?.
- For addition, begin with the first quantity in the basket. Tap individual apples outside the basket to move them in automatically.
- For subtraction, begin with the first quantity in the basket. Tap individual basket apples to move them out automatically.
- Every apple action moves exactly one apple, with a short animation and protection against repeated taps during movement.
- After the requested number of moves, choose the final total from three numerals. Reward correct answers with a star.
- Allow zero as a subtraction result; never generate negative results or totals above the selected range.

## Look and navigation
- Keep the existing playful palette, type, large tap targets, mute control, and star rewards.
- Add cohesive bundled critter, apple, and basket artwork, with distinct menu tiles for the new games.
- Keep all objects visible and individually tappable on phones and tablets; no dragging or hidden off-screen targets.
- Each game can return to the game menu. Successful rounds continue within their game.
- Reduce or skip motion when the device requests reduced motion.

## Privacy
- No accounts, Cloud connection, saved child data, or external calls for gameplay.
- The child's name and progress remain in session memory only; refreshing clears them.

## Technical details
- Add dedicated TanStack content routes for Number Finder, Count the Critters, and Apple Basket, each with unique page and sharing metadata.
- Keep round generation and counting/arithmetic validation in pure, browser-safe game-rule functions alongside the existing engine, with tests in the existing test folder.
- Reuse GameShell, Choice, session audio controls, and visual rewards; keep animal/apple identities separate from their values to prevent double counting.
- Record shared structural conventions in AGENTS.md and bundle all new visual assets locally.

## Completion checks
- Number Finder covers 1–20 with valid, unique choices and no repeat until its target deck is exhausted.
- Critters cannot be counted twice, even with rapid taps; the displayed total matches distinct counted animals.
- Apple Basket moves one apple per tap, handles addition and subtraction, supports zero, and obeys all range limits.
- Complete correct and incorrect-answer flows for every game, including rapid taps, mute, navigation, and phone/tablet layouts.
- Run the existing regression tests and new rule tests; confirm the Phase 1 updates still work.

**Implementation starts after this plan is approved.**