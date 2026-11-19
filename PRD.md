# Product Requirements Document (PRD): Hi Sunshine: Little Learners
**Project Name:** Free Toddler Minigame / Toddler Mini Games

**Live URL:** https://free-toddler-minigame.lovable.app  
**Target Audience:** Toddlers & Preschoolers (Ages 1.5 – 5), Parents, Bilingual Families  
**Updated:** 18 November 2026
Related documents: [README.md](README.md) · [EVALUATION.md](EVALUATION.md) · [roadmap.md](roadmap.md)
**Cost Model:** 100% Free, Zero In-App Purchases, Zero Tracking Telemetry, Zero Cloud Compute Fees  

---

## 1. Product overview

### 1.1 Problem

A parent of a preschool-aged child wants age-appropriate activities that reinforce the child's current developmental milestones. Existing children's game apps may contain useful exercises, but finding the right activities requires researching and testing multiple products, navigating content that is too easy or too advanced, and switching among apps.

The need is one simple learning app with a focused collection of games suited to specific to the child's developmental stage. A parent should be able to choose the right area to strengthen, such as letter recognition, number ordering, basic arithmetic, logic, or familiar names, without repeatedly searching the market for a different game.

The experience should also be calm and distraction-free: no advertising, account creation, or purchase prompts. The app should work when travelling or without reliable internet access.

### 1.2 Product Principles

Provide a free, illustrated, tap-only, offline-capable collection of short learning games for toddlers and preschoolers. Games are grouped by skill area, allow local personalization, and support repeated practice with a parent nearby.

### 1.3 Product outcome

**1. Relevant, consolidated practice:** Offer several milestone-appropriate learning areas in one easy-to-navigate app rather than an unfocused catalog of games.

**2. Tap-only:** Every game works through discrete taps, including select-then-place sequences; no dragging or precision gesture is required.

**3. Calm, parent-connected play:** Visual prompts and silent feedback let parents give the spoken explanation in a way that matches their child's language and listening comfort. This trades some fully self-directed play for flexibility and parent involvement.

**4. Short and forgiving:** One visible learning task at a time, immediate feedback, unlimited retries, and an easy exit. No timed pressure or failure state.

**5. Celebrate progress without distraction:** Correct completion triggers brief visual delight, without points, currencies, streaks, advertisements, or purchase incentives.

**6. Parent-led judgment:** Parents decide which learning areas are appropriate and how a child is progressing. The app provides practice; it does not use AI or automated scoring to determine readiness.

**7. Private, offline-capable personalization:** Parent-entered names and optional photos remain in device browser storage. Game content runs offline after preparation.

### 1.3 Non-goals

**- Automated developmental assessment:** No AI rating of readiness, mastery prediction, diagnoses, or automated parent progress reports.

**- Accounts and commercial engagement systems:** No registration, cloud profiles, social features, advertisements, in-app purchases, leaderboards, or reward economies.

**- Online-dependent gameplay:** No runtime AI calls, remote gameplay service, or continuous internet connection required once offline assets are ready.

## 2. Users and usage context

**Primary player:** Toddler or preschool child whose attention, motor control, reading ability, and verbal/listening comfort are still developing. Individual games need not suit every child at the same time.

**Primary decision-maker:** Parent or caregiver. The parent chooses the relevant games, adjusts difficulty when available, introduces an activity when needed, and evaluates the child's development through direct observation—not an AI-generated readiness judgment.

**Typical context:** A phone or tablet at home, on a trip, or while waiting. The parent guide alongside the child, explain a visual prompt aloud, and then let the child make the selections independently.

**Core navigation:** Game menu → game / mode → a short sequence of visual questions → completion feedback → replay, mode selection, or menu.

**Parent-only flow:** Pass a simple math gate → Settings or family setup → edit locally saved names, family member details, or photos → return to child-facing play.

**Session model:** An individual mini-game round is intentionally short (usually 1–2 minutes). A child may play multiple rounds or games in one approximately 10-minute play session. There is no timer and no enforced minimum or maximum duration.

## 3. Release scope and inventory

The published v2 home menu has 12 game tiles. Some contain more than one mode; Chinese-name construction is within the name experience rather than an additional top-level tile.

| ID | Home-menu tile | Release | Primary skill | Interaction |
| --- | --- | --- | --- | --- |
| F01 | Letter Match | v1 | Uppercase ↔ lowercase matching | Tap an answer |
| F02 | Know My Number | v1 | Number order, 1–20 | Tap missing numbers |
| F03 | Recognize My Name | v1 + v2 extension | English and Chinese name recognition | Tap choices or ordered characters |
| F04 | Count the Bunny | v1 | Quantity recognition, 1–20 | Tap numeral answer |
| F05 | Apple Basket | v1 | Addition and subtraction | Tap apples to add/remove |
| F06 | Shape Sorter & Hunt | v1 | Shape identification and matching | Tap item, then target |
| F07 | Sort the Toys | v1 | Sorting by property and ranking | Tap item, then category/position |
| F08 | Pattern Parade | v1 | Repeating sequences | Tap missing pattern item |
| F09 | Which One Doesn't Belong? | v1 | Classifying an outlier | Tap an object |
| F10 | Where's the Ball? | v1 | Spatial language | Tap object, then position |
| F11 | Picture & Character Match | v2 | Simplified Chinese character ↔ picture recognition | Tap an answer |
| F12 | My Family Tree | v2 | Cantonese kinship and family recognition | Tap a face or relationship |

## 4. Shared gameplay requirements

### 4.1 Interaction and presentation

**G-01:** All player actions are achievable through single taps or an explicit two-tap selection-and-destination flow.

**G-02:** Interactive targets are large and well-spaced; the current design targets approximately 64–88 CSS pixels for prominent tappable controls where layouts allow.

**G-03:** Selected objects visibly highlight; valid completed selections animate into their positions.

**G-04:** Incorrect selections produce gentle visual movement or a hint. The child can retry without a score, penalty, timer, or forced reset.

**G-05:** A correct answer produces brief, clear visual celebration (such as a popping star). Intermediate steps in multi-character name spelling must not falsely signal full completion.

**G-06:** Child-facing play must not depend on audio or require browser audio permission.

**G-07:** Game boards fit supported phone viewports without making answer controls disappear below a scrollable fold. Avoid accidental horizontal scrolling.

**G-08:** Each game offers an accessible route back to the menu; completing a name mode returns to its mode picker rather than unexpectedly to the global menu.

**G-09:** Use locally available illustrations, readable letters/characters, and clear visual differences between answers. Support reduced-motion preferences and avoid flashing effects.

### 4.2 Round behavior
A typical learning activity presents a prompt and visual choices, accepts a tap-based answer, validates the answer deterministically, plays success or retry feedback, and proceeds to the next round or completion screen. Activities may have multiple correct substeps (e.g., assembling a name, filling a number train).
- No account or saved score is required to begin a game.
- Question decks should vary within their supported concept pools where documented.
- Avoid duplicate answer choices that make the intended response ambiguous.
- Wrong taps must not create an irrecoverable state.
- An individual round should be brief, while consecutive rounds support a longer play session. No countdown or session cutoff is enforced.

## 5. Shipped v1 — Foundational literacy and numeracy
**F01 — Letter Match**
**Goal**: Match uppercase and lowercase English letters, A–Z.

**Experience**: A displayed letter is paired with large answer choices. Prompts alternate direction (uppercase to lowercase and vice versa), and an associated illustrated word can provide context.

**Requirements:**
- Cover all 26 letters in an exhaustive, shuffled in-memory deck before repeating.
- Randomize answer positions and avoid duplicate alternatives.
- Use visual success and retry feedback, with no voiceover or synthetic phoneme audio.
- Preserve readable differences between potentially confusing letter shapes.

**Pass condition:** Each letter can appear; both case directions work; the deck does not prematurely repeat before exhausting all 26 targets.

-------------
**F02 — Know My Number**
**Goal:** Recognize and complete ordered number sequences from 1 to 20.
Level	Current documented behavior
Beginner	One missing number in a sequence
Intermediate	Two to three missing numbers

**Advanced:** Number Train	Twenty positions, exactly ten prefilled and ten blank; choices shuffled; completed train departs the screen

**Requirements:** Tap a number choice to fill its intended slot; prevent incorrect placement from locking the task; use a recognizable completion animation for the train.

**Pass condition**: All missing positions resolve correctly; advanced choices are shuffled; the number train animates only after the complete, correct sequence.

-------------
**F03 — Recognize My Name (English modes)**

**Goal:** Help a child recognize and spell a parent-entered English name. No name is hardcoded as a default.

**Setup:** Parent enters a name of 2–15 English letters, accessible via the name game or parent-gated settings. The name is retained on the device for later sessions.

**Modes:**
1. Find: Tap the child's name among distinct distractor names.
2. Spell: Tap scrambled letters in the correct order; the selected letters fill slots automatically.
3. Missing Letter: Identify the omitted letter.
4. Big vs. Small: Match uppercase and title-case renderings of the same name.

**Requirements:** Handle repeated letters, preserve the configured spelling for display, compare appropriately without case sensitivity, and resize tiles for longer names. Completing a mode returns to the name mode picker. Validation does not depend on pronunciation audio.

**Pass condition:** An arbitrary valid name (including repeated letters and longer names) works across all modes and remains correct after reopening the browser on the same device if local storage is retained.

-------------
**F04 — Count the Bunny**

**Goal**: Recognize quantities of illustrated bunnies.

**Modes:** Number ranges 1–10 and 1–20.

**Requirements:** Render a visible group of bunnies and present answer choices immediately. The player chooses the total with a tap; do not require a separate tap on each bunny. Arrange large groups clearly enough to support visual counting.

**Pass condition:** Correct answer equals the number shown; answer selection is immediately available; no preliminary animal-tapping stage remains.

-------------
**F05 — Apple Basket**

**Modes:** Arithmetic within 5, 10, and 20, according to difficulty.

**Requirements:**
- Tap an apple on the grass to add it; tap an apple in the basket to remove it.
- Animate apples into or out of the basket; show them visually inside the basket rim when added.
- Keep item counts and arithmetic state consistent; no negative-result problems.
- Preserve a compact phone layout so buttons and basket are visible without vertical gameplay scrolling.
Pass condition: Tapped apples change the correct quantity, animation and mathematical state agree, and controls remain visible on phone-size viewports.

-------------
**6. Shipped v1 — Shapes, patterns, and logic**

**F06 — Shape Sorter & Hunt**

**Goal:** Recognize and match common and extended shapes.

**Supported shapes:** Circle, square, triangle, rectangle, oval, star, heart, hexagon, pentagon, octagon.

**Modes:**

**- Sorter**: Tap a shape and then its matching outline.

**- Hunt**: Tap a named target shape within an illustration.

**Requirements**: Use distinct outlines, generous targets, and clear correct/incorrect feedback; no dragging.

-------------
**F07 — Sort the Toys**

**Goal:** Categorize objects and compare size.

**Modes:**

**- Color**: Sort into two, three, or four baskets.

**- Type**: Animals, fruits, vehicles, clothes.

**- Room**: Kitchen, living room, bedroom.

**- Size**: Order three objects at intermediate difficulty or five at advanced difficulty, smallest to largest.

**Requirements:** Tap an object, then its chosen basket or position. Each object must have one valid classification under the active rule. Use individually cropped illustration assets to avoid visible sprite-sheet bleed on high-density screens.

-------------
**F08 — Pattern Parade**

**Goal:** Complete recurring object patterns.
Level	Examples from the current specification
Beginner	Five-position ABABA with a blank at position 3 or 5
Intermediate	Seven-position AABBAAB or ABCABCA with a blank at position 6
Advanced	Longer repeated ABBC and AABC patterns

**Requirements:** Show enough context to infer one next/missing item; randomize answer placement without introducing ambiguous solutions; use gentle celebration when the sequence is completed.

-------------
**F09 — Which One Doesn't Belong?**

**Goal:** Identify the one outlier among four illustrated objects.

**Content:** Animals vs. non-animals, food vs. vehicles, colors, shapes, and similarly clear groupings.

**Requirements:** Show three items that fit the intended rule and one that does not. The distinction must be defensible and obvious at the chosen difficulty. Display a brief visual explanation badge on the correct response.

-------------
**F10 — Where's the Ball?**

**Goal:** Understand spatial positions.

**Concepts:** Above, under, inside, outside, beside, in front of, behind, and between (with two reference objects).

**Requirements:** Tap the ball and then one of the highlighted positions. Use strong depth cues so front/behind are not ambiguous. All valid target zones must be large enough for a young child to choose without dragging.

-------------
**7. Shipped v2 — Chinese learning and family personalization**

**F11 — Picture & Character Match**

**Goal**: Recognize 72 simplified Chinese characters through picture association, organized into six decks of 12.

**Theme	Characters**

**Family**	爸 妈 爷 奶 男 女 姐 妹 哥 弟 儿 家

**Numbers**	一 二 三 四 五 六 七 八 九 十 多 少

**Body**	头 发 眼 眉 鼻 耳 口 牙 舌 心 手 脚

**Animals**	虫 鸟 牛 马 羊 兔 鱼 龟 猫 狗 虎 象

**Plants**	花 草 果 叶 桃 梨 豆 竹 菜 瓜 苗 芽

**Nature**	土 田 水 火 山 石 云 星 木 林 太 阳

**Modes:**
- Character → picture: Show the character and tap its corresponding illustration.
- Picture → character: Show an illustration and tap the corresponding character.

**Requirements:**
- Alternate directions and present three or four clear choices per question.
- Shuffle within each selected theme; do not repeat a character until all 12 cards in that deck have been used.
- Preserve full character and picture visibility in padded frames, especially on small screens.
- Keep simplified script consistent with the physical source flashcards.
- Follow the shared, silent feedback behavior.
Pass condition: All 72 character items are reachable; matching works both ways; frames do not crop characters or images; a theme completes its 12-card deck before repeating.

**F12 — My Family Tree**

**Goal:** Teach traditional Cantonese family terms and recognition of familiar relatives, with optional local photos.

**Covered roles:**
**Branch	Terms and meanings**
Core / siblings	爸爸 (dad), 媽媽 (mum), 我 (child), 哥哥 (older brother), 姐姐 (older sister), 弟弟 (younger brother), 妹妹 (younger sister)

**Maternal** — 媽媽邊	公公 (grandfather), 婆婆 (grandmother), 姨媽 (mother's older sister), 姨姨 (mother's younger sister), 舅父 (mother's brother)

**Paternal** — 爸爸邊	爺爺 (grandfather), 嫲嫲 (grandmother), 姑媽 (father's sister), 伯父 (father's older brother), 叔叔 (father's younger brother)

**Parent setup:**
- Access setup behind a simple parent math gate.
- Enter custom family-member names and select sibling age/relationship categories.
- Choose optional family photos from the device; resize locally to at most 512 pixels on the longest dimension and store as JPEG in IndexedDB.
- Use illustrated avatars when a photo is absent.
- Provide controls to remove a saved photo.

**Modes:** Face → relationship and relationship → face matching.

**Requirements**: Preserve maternal/paternal distinctions and older/younger sibling/aunt distinctions, rather than collapsing relatives into generic labels. Do not upload photos.

**Pass condition**: A family member can be configured, recognized in either matching direction, and represented by either a saved photo or fallback avatar; 姨媽 and 姨姨 remain distinct.
Chinese-name mode within F03 — Recognize My Name

**Goal**: Build a child's Traditional Chinese name through sequential tapping.

**Setup**: Parent enters a name of 1–4 Chinese characters, separate from the English name.

**Gameplay**: Show target-name characters alongside four decoys drawn from a curated set of 50 common Traditional Chinese characters. The child taps each intended character in sequence; each correct intermediate selection fills a slot without a full-screen completion reward.

**Requirements:**
- Support repeated characters and valid one- through four-character names.
- Use Traditional Chinese for this feature.
- Show the full popping-star celebration only after the entire name is correct.
- Retain the name locally on the device until it is changed, removed, or browser data is cleared.
Pass condition: Intermediate correct taps do not trigger final celebration, repeated characters work, and completion feedback triggers exactly once after the last character.

## 8. Parent settings, data, and privacy

**8.1 Local persistence**

| Data | Mechanism | Implementation reference |
| --- | --- | --- |
| English and Chinese child names | Browser `localStorage` | `toddler-device-names-v2` |
| Resized family photos | Browser `IndexedDB` | `toddler-family-v2` |
| Game content and static assets | Workbox-backed offline cache | Service worker precache / configured runtime caches |

**Requirements:**
- Store names and family photos in the device's browser storage, not in a server-side child profile.
- Exclude personal names and family photos from precached application assets.
- Provide explicit controls to remove saved names and family photos.
- Parent-only configuration is protected by a simple math gate (designed to discourage accidental toddler access, not strong authentication).
- Do not introduce advertising or tracking libraries in the child-facing experience.
- Do not infer that the math gate provides confidentiality against an adult with device access.
- Do not promise permanent storage: site-data clearing, browser eviction, or device reset can delete data.
  
**8.2 Privacy limitations**
The intended architecture does not upload names or family photos as part of the app's features. This is a product requirement and design description, not a substitute for independent security/privacy auditing. Browser and operating-system backup behavior are outside the app's control.

## 9. Offline architecture and release lifecycle

**Stack:** React 19, TypeScript, TanStack Start, Vite, Tailwind CSS v4, vite-plugin-pwa, Workbox. No dedicated gameplay backend or remote game-state service is required.

**Offline readiness:**
1. Child/parent loads the published app while online.
2. App code, art, and fonts are cached as a single offline package.
3. Menu reports “Ready for offline play” when the package is prepared.
4. The user may then close and reopen the app offline or optionally add it to the home screen.
Service worker scope: Production only. It is intentionally disabled in development and Lovable previews.

**Updates:** Check at launch, when connectivity returns, and on app foregrounding. Do not forcibly reload an active game. An installed app may need a full close/reopen after downloading an update.

**Privacy boundary:** Cached public app assets are distinct from device-private names and photos. Do not store private uploads in Workbox caches.

**Failure/recovery states:**
- If the app has not finished caching, do not falsely report offline readiness.
- If caches are evicted, require an online visit to rebuild the offline package.
- If local names/photos are deleted, show appropriate setup/fallback UI rather than crashing.
- If an offline update check fails, continue playing the last fully cached version.

## 10. Quality, accessibility, and performance
| Area | Requirement |
| --- | --- |
| Input | Tap-only on touchscreens; clickable with mouse where applicable |
| Visual hierarchy | Large, spaced choices; legible English and Chinese text; no clipped illustrated assets |
| Layout | Responsive phone (about 390px), tablet (768/1024px), desktop (1280px+) |
| Scrolling | No accidental board scrolling to reach current answer choices |
| Feedback | Celebration on completion, gentle retries, no punitive scoring |
| Motion | No rapid flashing; respect reduced-motion preferences where feasible |
| Contrast | Aim for WCAG AA text contrast on the warm cream UI background |
| Performance | Keep production bundle and asset delivery lightweight; original target was a first load below 2.5 MB, subject to measurement |
| Network | No runtime gameplay network request required after successful offline preparation |
| Local data | Names and photo flows must work without an account or upload |

**Accessibility consideration:** Visual cues must remain clear for pre-readers; a parent can explain instructions verbally. Any future audio option would need reliable offline pronunciation and separate testing.

## 11. Success metrics, acceptance criteria, and evaluation

**11.1 Product success measures**
These measures reflect whether the product is genuinely useful to a family, not whether the child has met an academic readiness threshold. They are evaluated through parent observation and voluntary feedback, with no automatic collection of child behavior or persistent activity history.

| Dimension | Target / evidence of success | How to evaluate without tracking |
| --- | --- | --- |
| **Child enjoyment / parent satisfaction** | Parent rates the experience **4/5 or higher** for ease of use and enjoyment; child willingly returns to activities | Short parent rating after several observed play sessions |
| **Sustained engagement** | Child can enjoy **approximately 10 minutes in a play session**, across one or more short games, without forced prompts or rewards | Parent observes session length and whether the child wants to continue; no timer in the app |
| **Independent interaction** | After an initial introduction where needed, child can **complete at least 4 of 5 age-appropriate rounds** by tapping without repeated help with the controls | Parent watches a sample of five rounds and notes control-related assistance |
| **Offline reliability** | All available game areas open, respond, and complete while the device is in airplane mode after offline readiness is confirmed | Manual phone and tablet offline test, including reopening the app |
| **Repeat usage** | Child voluntarily chooses to play on **three or more separate days over two weeks** | Parent records a simple yes/no observation outside the app |

**Interpretation:** Ten minutes is an engagement goal, not a mandatory game length. Parent prompts are compatible with success; independent interaction measures the child's ability to operate a game, not an expectation to learn without adult involvement. A small family pilot provides directional feedback rather than a statistically validated educational outcome.

**11.2 Core regression checklist**
| ID | Acceptance criterion |
| --- | --- |
| AC-01 | The published v2 menu exposes the documented 12 tiles without broken navigation. |
| AC-02 | No gameplay mechanic requires dragging, swiping, or long-pressing. |
| AC-03 | No gameplay path depends on audio; no unexpected greeting, phonics TTS, or sound effect plays. |
| AC-04 | Incorrect answers remain retryable without punitive score, loss screen, or lockout. |
| AC-05 | Correct completion produces the intended visual celebration. |
| AC-06 | Letter Match can exhaust all 26 uppercase/lowercase target letters before repeating. |
| AC-07 | Number Train Level 3 presents 10 prefilled and 10 missing values, shuffles choices, and departs on success. |
| AC-08 | Recognize My Name handles arbitrary valid English names, repeated letters, and longer-name layouts. |
| AC-09 | Chinese-name mode accepts 1–4 Chinese characters and celebrates only on full completion. |
| AC-10 | Count the Bunny presents immediate answer options with no mandatory tap-to-count step. |
| AC-11 | Apple Basket addition/removal updates quantities correctly and stays inside the phone viewport. |
| AC-12 | Shape Sorter, sorting, patterns, odd-one-out, and spatial tasks have unambiguous valid answers. |
| AC-13 | All six Chinese decks contain 12 characters, with readable image/character frames and bidirectional matching. |
| AC-14 | Family Tree distinguishes maternal/paternal and older/younger relationships, including 姨媽 vs. 姨姨. |
| AC-15 | Names remain in local storage across app restarts until removed or browser data is cleared. |
| AC-16 | Optional photos are resized and retained locally, have avatar fallbacks, and can be removed. |
| AC-17 | Child names and family photos are excluded from the app asset/service-worker caches. |
| AC-18 | After published offline readiness, every tile can open and complete a session in airplane mode. |
| AC-19 | Offline updates do not interrupt an active game; reopening after an online update loads the new release. |
| AC-20 | Child-facing UI has no advertising, purchase flow, or remote profile registration. |

**11.2 Test strategy**

**Deterministic tests:** Letter-deck exhaustion, number-train placement, arithmetic state, name spelling/repeated letters, pattern generation, and mode transitions. Use the repository's Vitest test command for automated checks.

**Browser/device tests:** Small-phone viewport clipping, retina image cropping, iOS Safari and Android Chrome tap behavior, offline installation/reopen, cache eviction recovery, photo selection/removal, and name data persistence.

**Human evaluation:** Observe enjoyment, willingness to return, approximately 10-minute engagement across rounds, ability to complete familiar activities with limited control help, and the amount of parent support needed. Parents interpret the observations and decide what is developmentally appropriate. Keep usability findings and product pivots in [EVALUATION.md](EVALUATION.md).

**Release gate:** Critical functionality and privacy/offline checks pass before public release; record failures and fixes rather than claiming an unexecuted test has passed.

## 12. Roadmap — future learning games
| Priority grouping | Candidate | Learning objective | Proposed tap-only mechanic |
| --- | --- | --- | --- |
| Language | Rhyme Time | Recognize rhyming words | Tap a matching picture or yes/no choice |
| Language | Sound Train | Construct simple three-letter words | Tap letter cars in sequence, then animate the train |
| Language | Word Pop | Recognize early sight words | Tap the indicated word bubble |
| Language | Letter Catch / phonics | Associate letters with sounds | Tap a letter; any sound-based mode would require validated, offline audio and a separate product decision |
| Our World | Seven Continents | Recognize continent shapes and names | Tap a continent on a simplified map or match a silhouette |
| Our World | Weather Watch | Recognize weather and suitable clothing | Tap a weather card, then clothing choices |
| Life Skills | Who Can Help? | Identify community helpers and safe responses | Tap the relevant helper or safety action |
| Later phase: storytelling | Story Puzzle | Understand and order a simple story | Tap three illustrated events in chronological order |
