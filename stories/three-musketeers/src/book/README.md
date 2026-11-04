# Storybook source

The paper-cut storybook (15 square pages, 1100×1100) and the storytelling video (3 min 34 s) made from it.

## Folders

| Path | What it is |
|---|---|
| `art/art.js` | The drawing kit: paper-cut figures, scenery, textures. |
| `art/pages.js` | The 15 pages: what each page draws and its text. |
| `art/page.html` | Loads `art.js` and `pages.js`; `draw(i)` draws page *i*. |
| `art/shoot.js` | Saves each page as a PNG in `art/raw/`. |
| `art/frame.py` | Adds the paper grain and finish and saves the final pages to `art/out/NN.jpg`. |
| `art/out/` | The finished pages (the same ones used in the library package). |
| `narration/NN.wav` | The narrator reading each page (Kokoro voice `af_heart`, US English, speed 0.88). |
| `storytelling-video/` | Turns the pages and narration into the storytelling video. `story.wav` is its soundtrack and the MP4 is the finished video. |
| `style-options/` | The other art styles I showed you (collage, stained glass, illustrated and others) with their sample sheets. Not used in the final book. |

The page text is in `art/pages.js`. The narration text is the `BOOK` list in `../cartoon/voice/lines.py`, read with the same voice tools as the cartoon (see the cartoon README, step 2b).

## Rebuild, in order

```bash
cd art
mkdir -p raw out
node shoot.js           # all pages; or e.g. node shoot.js 0 5 for single pages
python3 frame.py        # finished pages into out/

cd ../storytelling-video
python3 make.py         # page frames p00–p14.png and durs.json (page lengths follow the narration)
python3 audio.py        # story.wav (narration with soft music, uses ../../cartoon/movie/synth.py)
bash film.sh            # one clip per page, joined into story_video.mp4
ffmpeg -y -i story_video.mp4 -i story.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart The-Three-Musketeers-storytelling.mp4
```

These use the same tools as the cartoon (Node with Playwright, Python with NumPy, SciPy and Pillow, and ffmpeg).

For the library site, the book pages are `art/out/NN.jpg` and the audio is each `narration/NN.wav` converted to MP3 (`ffmpeg -i narration/00.wav -b:a 96k 00.mp3`). They go with `book/book.json` in the library package.
