# Pictures for "There's No Place Like Home" (The Wizard of Oz)

Instructions for Claude in Chrome. Make 15 square pictures in **Google Gemini** (gemini.google.com, the person's own
Google account) and upload them to GitHub. All 15 must look like one book: the same characters, the same faces, the
same clothes and the same painting style on every page.

The characters come from L. Frank Baum's book *The Wonderful Wizard of Oz* (1900), which is free for anyone to use.
They are drawn our own way, from the book's descriptions, and not like the 1939 film: silver shoes (not ruby
slippers), no ribbon pigtails, no bow on the Lion, no green-faced witch and no pink bubble.

## Round 3 (October 13): match page 12 everywhere, keep Dorothy the same

The person's favourite picture is `12.png` (the Wizard behind his screen). Some round-2 pages drifted from it, and
Dorothy's face, age and hair change from page to page. Page `01.png` also gives Dorothy three legs.

**The method: same reference images on every picture, no drifting chat.** For each picture below, start a **new**
Gemini chat (or clear the context) and attach two images:

1. `12.png` (the style and character reference):
   https://raw.githubusercontent.com/SThief/stories/main/stories/wizard-of-oz/art/12.png
2. The current picture being fixed (the layout reference): `https://raw.githubusercontent.com/SThief/stories/main/stories/wizard-of-oz/art/NN.png`

Then ask: "Repaint the second picture as the same scene with the same layout, but in exactly the painting style of the
first picture, and with Dorothy, Toto, the Scarecrow, the Tin Woodman and the Lion looking exactly like they do in
the first picture: same faces, same age, same hair, same clothes. No border: paint to the edges. No text."

| File | Fix |
|---|---|
| `01.png` | Only remove the extra leg: Dorothy has exactly two legs in brown boots. Keep everything else the same (ask Gemini to edit, not repaint). |
| `03.png` | Repaint (Munchkins at the house). Dorothy in brown boots. |
| `04.png` | Repaint (Glinda gives the silver shoes). Dorothy still in brown boots, holding Toto. |
| `05.png` | Repaint (the Scarecrow). Dorothy in silver shoes from here on. |
| `06.png` | Repaint (the Tin Woodman). |
| `07.png` | Repaint (the Lion). |
| `08.png` | Repaint (the road of yellow bricks and poppies). |
| `11.png` | Repaint (the melting Witch). Keep her silly and surprised, not scary. |

Keep `00`, `02`, `09`, `10`, `12`, `13` and `14` as they are. Before saving each picture, check Dorothy against
`12.png` (face, age, long wavy brown hair, pink bonnet on her back, blue gingham dress, the right shoes) and count her
legs and arms. Upload all 8 in one commit over the old files in `art/` on the `claude/wizard-oz-story-2p87i9`
branch. If Gemini's daily limit stops you, upload nothing, and say how many are done.

## Round 2 (October 12): repaint in the style of page 12

The person read the first set and said it looks too much like AI art next to the other books, but that page 12 (the
Wizard behind his screen) looks better, and so does its Wizard head. So:

- **Keep `12.png` as it is** and use it as the style reference. Download it from
  https://raw.githubusercontent.com/SThief/stories/claude/wizard-oz-story-2p87i9/stories/wizard-of-oz/art/12.png and
  attach it to the first message of a **new** Gemini chat with: "Paint every picture in this chat in exactly the style
  of this picture." If attaching a file isn't possible, rely on the STYLE block below.
- Make a new character sheet in that style first, then **repaint `00.png`–`11.png`, `13.png` and `14.png`** with the
  same scenes as below.
- **Shoes:** Dorothy wears plain brown boots on pages 01–04 only. On the cover and on pages 05–14 she wears shining
  silver shoes. The first set got pages 05–07 wrong; check this on every page.
- **The Wizard's giant head (page 09)** must be the head from page 12: a huge head of a wise old man with long wavy
  white hair and a big white beard, floating above the green throne.
- **Kid-friendly check (ages 4–8):** the round-2 character sheet is good. Keep the Witch silly rather than spooky
  (no snarl, no scary close-ups), keep the Lion gentle, and let Aunt Em and Uncle Henry smile.
- Upload the new pictures over the old ones in the same `art/` folder on the same branch.

## How to keep every picture the same

1. Do everything in **one Gemini chat**. Don't start a new chat partway through.
2. **First make the character sheet (step 0 below)** and keep it. Every page prompt starts by pointing back to it.
3. Every prompt contains the same **STYLE** block and the **CHARACTERS** block, copied word for word. Don't shorten
   them or reword them.
4. Before saving a page, compare it with the character sheet. Check Dorothy's brown curls, pink sunbonnet and
   blue-and-white checked dress, the silver shoes, Toto being small and black with long silky hair, the Scarecrow's
   blue Munchkin hat, the Tin Woodman's funnel hat and Glinda's red hair and white gown. If any of these is off, or
   the style has drifted from page 12 (glossy, sparkly, photo-like, 3D, anime, flat vector), or anything looks like the 1939 film, ask Gemini to redo
   the picture: "Same picture, but keep the characters exactly like the character sheet."
5. Pictures must be square (1:1). No words, letters, captions or speech bubbles in any picture.
6. If Gemini says the daily limit is reached, stop. Report how many pages are done, and continue in the same chat
   the next day.

## STYLE (copy into every prompt)

> Classic hand-painted children's picture-book illustration in pen-and-ink with watercolor, like the picture of the
> Wizard behind his screen (art/12.png). Fine brown ink outlines, soft natural watercolor washes, visible paper texture,
> warm golden light, and rich, detailed backgrounds full of small lived-in things. Friendly, simple faces drawn like a
> real illustrator would draw them. Not glossy, not airbrushed, not 3D, no oversized shiny eyes, no glowing sparkles,
> no lens flare. Cozy and happy, never scary. Square picture, full scene, no text, no letters, no borders.

## CHARACTERS (copy into every prompt)

> Dorothy: an 8-year-old girl with short, curly chestnut-brown hair, freckles, a pink sunbonnet hanging down her back,
> a simple blue-and-white checked cotton dress with short sleeves and a white collar, and shining silver shoes
> (plain brown boots before page 4).
> Toto: a tiny black dog with long silky hair and small twinkling black eyes.
> Scarecrow: a cheerful scarecrow whose head is a small stuffed sack with a painted face, wearing a tall pointed
> sky-blue hat with a wide brim, a faded blue suit, old blue-topped boots, with straw poking out at the wrists, ankles
> and neck.
> Tin Woodman: a man made entirely of shining tin, with a tin funnel for a hat, riveted joints, a little axe and an
> oil can.
> Lion: a big, gentle, round-faced golden lion on all fours, with a shaggy honey-colored mane and worried eyes. No
> clothes, no bow.
> Glinda: a beautiful, kind good witch with long wavy red hair, blue eyes and a flowing pure-white gown, with a small
> star on a slender silver wand.
> Wicked Witch: a silly, not-too-scary old witch with one big eye and a patch over the other, a long pointy nose, a
> patched purple dress, a floppy purple hat and a striped umbrella.
> The Wizard: a little old man with a bald, shiny head, a fringe of white hair, a wrinkled kind face, round
> spectacles and a brown checked coat. His giant head (page 09) is a huge head of a wise old man with long wavy white
> hair and a big white beard.
> Aunt Em and Uncle Henry: a gentle, gray-haired prairie farm couple in plain, faded farm clothes.
> Munchkins: small round folk in blue, with blue pointed hats with little bells around the brims.

## Prompts

Send each prompt as: **"Using the exact characters and style from the character sheet above: [STYLE] [CHARACTERS]
Scene: …"**. Only the characters named in the scene should be in the picture.

| File | Scene |
|---|---|
| step 0 (keep it, don't upload it) | A character reference sheet: Dorothy, Toto, Scarecrow, Tin Woodman, Lion, Glinda, the Wicked Witch, the Wizard, Aunt Em and Uncle Henry standing side by side on a plain cream background, full body, facing forward. |
| `00.png` (cover) | Dorothy in her silver shoes holding Toto, with the Scarecrow, Tin Woodman and Lion beside her on a road of yellow bricks. A glowing green city with tall spires is far behind them on the horizon. |
| `01.png` | Dorothy holding Toto by a wooden fence on a flat, dusty, gray Kansas prairie with a tiny one-room farmhouse. She looks up dreamily at a soft pink and gold sunset sky. |
| `02.png` | A dark, swirling gray cyclone lifting the tiny one-room farmhouse into the sky. Dorothy and Toto peek out of the window, surprised but safe. |
| `03.png` | Dorothy, holding Toto, steps out of the little gray farmhouse door into a land bursting with color: giant flowers, fruit trees, a sparkling brook and smiling Munchkins in blue waving hello. |
| `04.png` | Glinda floats down on a soft white cloud and hands Dorothy a pair of shining silver shoes. A road of yellow bricks winds away through blue fields behind them, and Munchkins watch happily. |
| `05.png` | Dorothy helps the Scarecrow down from his wooden pole in a golden cornfield beside the road of yellow bricks. Toto wags his tail. |
| `06.png` | Dorothy oils the Tin Woodman's elbow with his oil can in a sunny forest, while the Scarecrow and Toto watch. |
| `07.png` | The Lion sits on the road of yellow bricks crying and rubbing his nose with his paw, while Dorothy kindly pats his mane. Toto barks, and the Scarecrow and Tin Woodman peek out from behind a tree. |
| `08.png` | Dorothy, the Scarecrow, the Tin Woodman and the Lion walk happily together down the road of yellow bricks past a field of red poppies, with Toto running ahead. A shining green city is ahead of them. |
| `09.png` | In a grand green throne room, the enormous head of a wise old man with long wavy white hair and a big white beard floats above a green marble throne; it looks grand and stern but not frightening, more like a grumpy grandfather. Dorothy, Toto, the Scarecrow, the Tin Woodman and the Lion huddle together, wide-eyed. |
| `10.png` | At dusk, the Scarecrow, Tin Woodman and Lion bravely walk toward a yellow castle on a hill, while friendly winged monkeys fly overhead in a purple sky. |
| `11.png` | Inside the castle kitchen, Dorothy splashes a bucket of water. The Wicked Witch melts into a puddle in a funny, cartoonish way, with only her floppy hat and umbrella left. Her face looks surprised and silly, like a cartoon, never snarling or frightening. Toto and the Lion cheer. |
| `12.png` | Toto knocks over a folding screen in the corner of the throne room, showing the Wizard, a little old man, among funny gadgets and a big papier-mâché head. Dorothy, the Scarecrow, the Tin Woodman and the Lion look surprised and smile. |
| `13.png` | Dorothy, in a white sparkle of light, clicks the heels of her silver shoes together while holding Toto. The Scarecrow, Tin Woodman and Lion wave goodbye, and Glinda smiles beside them. |
| `14.png` | Dorothy runs across the green Kansas grass into Aunt Em's open arms beside a brand-new little farmhouse, with Uncle Henry milking a cow nearby and Toto barking happily in warm morning sun. Everyone is smiling. |

## When the pictures are done

Download each picture at full size. Open
https://github.com/SThief/stories/tree/claude/wizard-oz-story-2p87i9/stories/wizard-of-oz/art, choose **Add file →
Upload files**, add all 15 (`00.png` to `14.png`), and choose **Commit directly to the `claude/wizard-oz-story-2p87i9`
branch**. Don't commit to `main`, and don't open a pull request. If a picture has a small Gemini mark in a corner,
leave it; it gets cropped later.
