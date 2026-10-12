# Pictures for "There's No Place Like Home" (The Wizard of Oz)

Instructions for Claude in Chrome. Make 15 square pictures in **Google Gemini** (gemini.google.com, the person's own
Google account) and upload them to GitHub. All 15 must look like one book: the same characters, the same faces, the
same clothes and the same painting style on every page.

## How to keep every picture the same

1. Do everything in **one Gemini chat**. Don't start a new chat partway through.
2. **First make the character sheet (step 0 below)** and keep it. Every page prompt starts by pointing back to it.
3. Every prompt contains the same **STYLE** block and the **CHARACTERS** block, copied word for word. Don't shorten
   them or reword them.
4. Before saving a page, compare it with the character sheet. Check Dorothy's pigtails and blue gingham dress, the
   ruby slippers, Toto being small and black, the Scarecrow's blue shirt and hat, the Tin Man's funnel hat and the
   Lion's red bow. If any of these is off, or the style has drifted (photo-like, 3D, anime, flat vector), ask Gemini
   to redo the picture: "Same picture, but keep the characters exactly like the character sheet."
5. Pictures must be square (1:1). No words, letters, captions or speech bubbles in any picture.
6. If Gemini says the daily limit is reached, stop. Report how many pages are done, and continue in the same chat
   the next day.

## STYLE (copy into every prompt)

> Warm, glowing children's storybook painting in a soft digital-watercolor style. Rich saturated colors, soft golden
> light, gentle sparkles, rounded friendly characters with big shiny eyes and rosy cheeks. Cozy and happy, never
> scary. Square picture, full scene, no text, no letters, no borders.

## CHARACTERS (copy into every prompt)

> Dorothy: a 10-year-old girl with brown hair in two pigtails tied with blue ribbons, freckles, a blue-and-white
> gingham pinafore dress over a white puffed-sleeve blouse, white socks, and sparkly red ruby slippers (plain black
> shoes before page 4).
> Toto: a small, scruffy black Cairn terrier with perky ears.
> Scarecrow: a floppy, smiling scarecrow with a burlap face, straw poking out of his sleeves and collar, a light-blue
> patched shirt, brown trousers and a pointed brown hat.
> Tin Man: a shiny silver tin man with a funnel hat, round body, kind eyes and an oil can.
> Lion: a big, gentle golden lion with a huge fluffy brown mane and a red bow in his mane, standing on two legs.
> Glinda: a kind good witch with curly golden hair, a tall silver crown, a big sparkly pink gown and a star wand.
> Wicked Witch: a silly, not-too-scary green-faced witch in a black dress and tall pointed black hat, with a broom.
> The Wizard: a kindly, ordinary old man with white hair, a mustache and a green waistcoat.
> Aunt Em and Uncle Henry: a gentle farm couple in plain 1930s farm clothes.

## Prompts

Send each prompt as: **"Using the exact characters and style from the character sheet above: [STYLE] [CHARACTERS]
Scene: …"**. Only the characters named in the scene should be in the picture.

| File | Scene |
|---|---|
| step 0 (keep it, don't upload it) | A character reference sheet: Dorothy, Toto, Scarecrow, Tin Man, Lion, Glinda, the Wicked Witch, the Wizard, Aunt Em and Uncle Henry standing side by side on a plain cream background, full body, facing forward. |
| `00.png` (cover) | Dorothy in her ruby slippers holding Toto, with the Scarecrow, Tin Man and Lion beside her on the yellow brick road. The glowing green Emerald City is far behind them under a rainbow. |
| `01.png` | Dorothy holding Toto by a wooden fence on a dusty, grayish-brown Kansas farm with a small farmhouse and windmill. She looks up dreamily at a faint rainbow in the sky. |
| `02.png` | A dark, swirling gray twister lifting the little wooden farmhouse into the sky. Dorothy and Toto peek out of the window, surprised but safe. |
| `03.png` | Dorothy, holding Toto, steps out of the gray farmhouse door into a land bursting with color: giant flowers, a blue stream, round cottages and tiny smiling Munchkins waving. |
| `04.png` | Glinda floats down inside a shiny pink bubble and gives Dorothy a pair of glittering ruby slippers. The yellow brick road spirals away behind them, and Munchkins watch happily. |
| `05.png` | Dorothy helps the Scarecrow down from his wooden pole in a golden cornfield beside the yellow brick road. Toto wags his tail. |
| `06.png` | Dorothy oils the Tin Man's elbow with his oil can in a sunny apple forest, while the Scarecrow and Toto watch. |
| `07.png` | The Lion sits on the yellow brick road crying and holding his tail, while Dorothy kindly pats his mane. Toto barks, and the Scarecrow and Tin Man peek out from behind a tree. |
| `08.png` | Dorothy, the Scarecrow, the Tin Man and the Lion skip arm in arm down the yellow brick road through a field of red poppies, with Toto running ahead. The shining green Emerald City is ahead of them. |
| `09.png` | In a grand green throne room, a giant glowing green face of the Wizard floats in puffs of smoke. Dorothy, Toto, the Scarecrow, the Tin Man and the Lion huddle together, shaking. |
| `10.png` | At dusk, the Scarecrow, Tin Man and Lion bravely climb a rocky path toward the Wicked Witch's dark castle on a cliff. Cute winged monkeys in little red vests fly in a purple sky. |
| `11.png` | Inside the castle, Dorothy splashes a bucket of water. The Wicked Witch melts into a puddle in a funny, cartoonish way, with only her hat and broom left. The Scarecrow, Tin Man, Lion and Toto cheer. |
| `12.png` | Toto pulls back a green curtain to show the Wizard, an ordinary old man working levers on a funny machine. Dorothy, the Scarecrow, the Tin Man and the Lion look surprised and smile. |
| `13.png` | Dorothy clicks the heels of her ruby slippers together while holding Toto, with sparkles swirling around her feet. The Scarecrow, Tin Man and Lion wave goodbye, and Glinda glows in pink light. |
| `14.png` | Dorothy wakes in her cozy farmhouse bed and hugs Aunt Em and Uncle Henry, with Toto on the quilt and warm morning sun coming through the window. |

## When the pictures are done

Download each picture at full size. Open
https://github.com/SThief/stories/tree/claude/wizard-oz-story-2p87i9/stories/wizard-of-oz/art, choose **Add file →
Upload files**, add all 15 (`00.png` to `14.png`), and choose **Commit directly to the `claude/wizard-oz-story-2p87i9`
branch**. Don't commit to `main`, and don't open a pull request. If a picture has a small Gemini mark in a corner,
leave it; it gets cropped later.
