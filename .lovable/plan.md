# Version 2: Chinese characters and family games

The live site gets the new games. Everything else stays the same: no sound, tap-only play, the "Hi Sunshine" greeting, offline play, and the current games.

## 1. Picture & Character Match (new game)
- Uses the six flashcard sheets you sent. Each sheet becomes one theme the child picks:
  - Family: 爸 妈 爷 奶 男 女 姐 妹 哥 弟 儿 家
  - Numbers: 一 二 三 四 五 六 七 八 九 十 多 少
  - Body: 头 发 眼 眉 鼻 耳 口 牙 舌 心 手 脚
  - Animals: 虫 鸟 牛 马 羊 兔 鱼 龟 猫 狗 虎 象
  - Plants: 花 草 果 叶 桃 梨 豆 竹 菜 瓜 苗 芽
  - Nature: 土 田 水 火 山 石 云 星 木 林 太 阳
- Each round shows one character. The prompt is either the picture (the child taps the matching character) or the character (the child taps the matching picture), from 3–4 choices.
- Only single characters are used, in simplified Chinese like the cards.
- Every character in a theme appears once before any repeats. A correct answer pops a star.
- New picture artwork for each card, in the current art style. Abstract characters (多, 少, 太, 阳) get simple scenes like the ones on the cards.

## 2. My Family Tree (new game)
- Parent setup (inside a parent check): add a photo for each family member: 公公, 婆婆 (mum's side), 爺爺, 嫲嫲 (dad's side), 媽媽, 爸爸, aunts and uncles, the child, and brothers and sisters. Family members can be added or removed.
- Photos are saved on this phone only. They are never uploaded and stay after the app is closed. A "Remove all photos" button is included.
- The tree shows mum's side on one side and dad's side on the other, with the parents, then the child and siblings below. Colour bands label "Mum's side" and "Dad's side".
- Play: show a face, and the child taps what they call that person (e.g. 婆婆). Or show the word, and the child taps the face. Family words use traditional characters as you wrote them.
- Members without a photo use a friendly drawing, so the game works before photos are added.

## 3. Recognize my name: Chinese name
- A new section beside the English name modes. The parent types the child's Chinese name (Chinese characters only, 1–4 characters).
- The child builds the name one character at a time, from a mix of the name's characters and characters from the top 50 on the LTL traditional character list.
- English and Chinese names are saved on the device only, never uploaded, as subsequently requested.

## 4. Publish and update your phone
- Run all tests, check the new games in the browser on phone and tablet sizes, then publish to free-toddler-minigame.lovable.app.
- Your GitHub copy updates automatically through the existing connection.
- To update the copy on your phone: open the home-screen app while online, wait a few seconds, then close it fully and reopen it. If the new games still don't appear, open the site once in Safari or Chrome, then reopen the app. If it is still stuck, delete the home-screen icon and add it again. Photos saved on the phone could be lost if you do that.

## Technical details
- New routes: `games/chinese-match.tsx` and `games/family-tree.tsx`. Chinese name mode goes inside the existing name route.
- Pure rules and tests in the existing game engine: theme deck rotation, choice generation (no duplicates, answer always included), family relation sides, and Chinese name validation and decoys (name characters are never used as decoys).
- Fetch the LTL page once while building and store the 50 characters as a fixed list, so they work offline.
- Photos are stored in IndexedDB on the device, read in effects only, and shrunk to about 512px before saving. Names persist locally with no network transmission.
- New artwork is saved as separate image files and added to the offline cache.
