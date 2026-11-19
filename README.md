# Hi Sunshine — Little Learners - Free Toddler Minigame

**A free, offline-friendly collection of tap-only learning games I built for my daughter, inspired by her developmental milestones and our family's everyday life.**

Play the game @ https://free-toddler-minigame.lovable.app

[Product requirements](PRD.md) : Read details of product behavior, requirements and roadmap
[What I learned from testing](EVALUATION.md) : Evaluation and usability findings that led to design changes

**Hi Sunshine** is a personal project. I wanted a simple way for my daughter to practice emerging skills through short, playful activities on a phone or tablet—especially when we're travelling or have a few quiet minutes together. I didn't want another subscription, a noisy app, or a game designed around rewards and screen time. I wanted something shaped by what she was learning, what interested her, and what she could actually use on her own.

It's now a browser-based learning game with bright illustrations, large tap targets, gentle visual celebrations, and no ads or accounts. The current v2 release expands the original English-language learning activities with Chinese characters and family-centered learning inspired by our cultural background.

## The real-life question behind the project

As a parent, I was trying to decide whether my daughter would benefit from preschool before starting public kindergarten, or whether her current childcare experience and learning at home would be enough.

I wanted to make that decision based on our circumstances, not a generic kindergarten checklist. Using **Muse AI**, I researched the curriculum of 4 schools I intended to apply to and compared them with our local school district curriculum. **Muse AI helped organize that research into an interactive kindergarten-readiness evaluation artifact.**

	DM me to get the prompt I used to create the readiness evaluation artifact.

I then assessed my daughter's development and AI helped me structure the information so that I can use those insights to write a PRD and build the first version with Lovable.

**The journey:** Muse AI research → parent-led evaluation (human) → learning-game PRD → Lovable build web app → testing with my daughter (human) → product iterations.

Apart from AI research and code writing, this project does not use AI models or skills because of it's sensitive nature of kid development related.  

## How the game evolved

**V1** — English learning and kindergarten readiness
The first version focused on foundational skills inspired by the curriculum research and my daughter's development. I prioritized letter matching, number sequences, and recognizing her own name, then expanded into counting, arithmetic, shapes, sorting, and patterns.

The goal was not to recreate a preschool curriculum on a screen. It was to make focused, age-appropriate practice accessible through short sessions, simple visual questions, and one easy interaction (tapping).

**V2** — Language, culture, and family connection
Once the foundational games were working (my daughter loves it), I wanted the experience to reflect more than academic readiness. I wanted my daughter to recognize parts of our family's language, relationships, and cultural background.

## Built through real play and iteration

The initial PRD was a starting hypothesis. Watching my daughter use the game led to changes I would not have discovered from a specification alone:
- Drag-and-drop became tap-only after I saw how easily dragging could frustrate young children.
- Counting became more direct when tapping every single animal proved repetitive.
- Number sequencing became a number train to make harder levels more engaging and give completion a playful ending.
- Names started saving on the device so parents wouldn't have to enter them every time they reopened the app.
- Family terms became more precise to reflect actual Cantonese relationships instead of generic family labels.
  
Those decisions are documented in [EVALUATION.md](EVALUATION.md). This project reinforced the importance of working prototype can work exactly as specified and still be wrong for the person using it. User feedback is key!

## Offline play

1. Open **Hi Sunshine** while connected to the internet.
2. Keep the app open until the menu says “Ready for offline play.” The game code, artwork, and fonts are downloaded together; you don't need to open every activity first.
3. Play in the browser without an internet connection, or choose “Play Offline / Add to Home Screen” when supported.
4. On iPhone or iPad, open the site in Safari and select Share → Add to Home Screen.
Installing it to your home screen is convenient but not required for offline play. Browser or device storage cleanup can remove offline files; reconnect and open the site again if needed.

**Updating an installed phone copy**

Open the installed app while online, allow it to update, then fully close and reopen it. The menu should display v2. If necessary, visit the published URL once in Safari or Chrome and reopen the installed app.

## Privacy and parent controls

This was built for my daughter, so keeping family information private was a core requirement from the beginning.
- No accounts, advertisements, or tracking cookies.
- Names stay on the device. Parent-entered English and Chinese names are saved in browser-local storage so they don't need to be re-entered on every visit.
- Family photos stay on the device. Optional photos are resized locally and stored in the device's browser database, not uploaded to an application server.
- Parent-gated editing. A simple adult math gate helps prevent children from changing names, settings, or family-photo setup by accident.
- No saved learning profile. Games can be replayed without scores, progress reports, or a child account.

## Technical bits

The game is a web app that can run offline after its files have been downloaded. Its source code is in this repository. I deliberately kept gameplay simple and self-contained: no login, no cloud-based progress system, and no live AI service required to play.
<details>
<summary>For developers: run the project locally</summary>
Requires Node.js and npm.
git clone https://github.com/khui93/free-toddler-minigame.git
cd free-toddler-minigame
npm install
npm run dev

	Other commands: npm test, npm run lint, and npm run build. Offline caching is designed for the published production build and is disabled in local development and Lovable previews.

The current app uses React, TypeScript, TanStack Start, Vite, Tailwind CSS, and a production-only PWA service worker. See package.json and the source for implementation details.
</details>
