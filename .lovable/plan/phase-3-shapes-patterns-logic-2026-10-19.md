# Phase 3 — Shapes, Patterns & Logic

## Scope and shared experience
Add five game entries to the existing menu, with two modes inside the shape game. Preserve all existing games and the compact Apple Basket layout.

- Tap-only play, large targets, unlimited retries, popping star rewards, and optional muted non-voice effects.
- **No voiceover:** the uploaded brief's spoken instructions and explanations will become short visible prompts, picture labels, and visual explanations. No narration or welcome speech will return.
- Beginner, Intermediate, and Advanced selectors for each game; start with Beginner.
- Fit complete rounds and choices on screen, without hidden targets or dragging. Respect reduced-motion settings.
- Keep the child's name and progress in session memory only. No accounts, saved child data, Cloud connection, or gameplay network calls.

## 1. Shape Sorter & Shape Hunt
**Shape Sorter:** tap a shape, then its matching outline. Highlight the selection and allow changing it before placement. A correct shape moves into its outline; a wrong match leaves it available for retry. Complete the round after every shape is placed.

**Shape Hunt:** show a colorful, uncluttered illustrated scene and a pictured/named target. Tap its single clearly identifiable match. Avoid extra copies of the target in decorative scenery.

- Beginner: circle, square, triangle.
- Intermediate: add rectangle and oval.
- Advanced: add star and heart, with mixed orientations.
- Recognizable silhouettes and generous invisible hit areas; answers must not depend on color alone.

## 2. Sort the Toys
Tap a toy, then a labeled illustrated bin. Correct objects animate into their bin and remain visible; incorrect placements return to the starting position and allow immediate retry.

- One sorting rule per round: color (red, blue, yellow, green), size (big/small), or type (animals, vehicles, fruits, shapes).
- Beginner: two bins. Intermediate/Advanced: up to three bins when the rule supports them; size remains two bins.
- Each object belongs to exactly one bin. Bins combine words with color swatches, size examples, or category pictures.
- Complete only when every object is correctly sorted; repeated taps cannot sort an object twice.

## 3. Pattern Parade
Show enough cartoon animals, fruits, colors, or shapes to establish a repeating rule, ending in one missing item. Offer three distinct choices. The correct item joins the sequence, then the completed parade marches forward before the next round.

- Beginner: ABAB and AABB, with visually distinct distractors.
- Intermediate: AAB, ABB, ABCABC.
- Advanced: ABBC and longer sequences.
- Treat ABABA as a visible prefix of the repeating AB rule, not a separate repeating cycle.
- Show at least two repetitions of the underlying unit before the missing item, so every question has one intended answer.

## 4. Which One Doesn't Belong?
Show three pictures in Beginner and four in Intermediate/Advanced. Tap the one object that differs under a clear intended rule.

- Categories: animals, fruits, colors, shapes, sizes, vehicles, and familiar everyday functions.
- Use a reviewed question bank with exactly one defensible odd item; avoid cultural assumptions or overlapping alternative rules.
- Wrong answers stay retryable. Correct answers highlight the odd item and show a short picture-supported explanation (for example, “The car isn't a fruit”) before continuing.

## 5. Where's the Ball?
Tap the ball to reveal destination highlights, then tap the requested position. Animate correct placement and briefly reinforce the relationship; wrong destinations leave the ball selectable for immediate retry.

- Beginner: above, under, inside, beside.
- Intermediate: add outside, in front of, behind.
- Advanced: add between and mix previously learned relationships across rounds.
- Use an open cartoon box, clear front/back layering, and two reference objects for “between.”
- Destinations must not overlap or permit multiple answers. For “outside,” avoid competing destinations that also satisfy that broad relationship.

## Technical details
- Add five dedicated TanStack content routes with unique page/sharing metadata; the shape route owns its local Sorter/Hunt mode picker.
- Keep round generation, answer validation, difficulty rules, sorting IDs, and placement state transitions as pure functions in the existing shared game engine, tested under the existing test folder.
- Reuse GameShell, Choice, session audio, and star feedback. Use tap locking during movement and delayed round changes so completed scenes remain visible.
- Create a cohesive set of bundled object/scene artwork. Use precise shape silhouettes and layered scenes where needed for unambiguous matches and spatial relationships.
- Record any new structural conventions in AGENTS.md.

## Completion checks
- Test every supported shape and level, including rotated shapes, selection changes, and wrong-outline retries.
- Test exclusive sorting categories, duplicate-tap protection, and completion only after all toys are sorted.
- Test each pattern unit against concrete sequences and verify exactly one correct choice.
- Validate the odd-one-out bank for one intended answer and explanation; verify wrong-answer retries.
- Test all eight spatial concepts, including two-reference “between” and distinct front/back placement.
- Complete correct and incorrect flows in every game, including mute, return to menu, movement locks, and reduced motion.
- Verify complete playable layouts at the current desktop size and phone/tablet sizes; run existing regression tests plus new rule tests.

**Phase 3 implementation begins only after you approve this plan.**