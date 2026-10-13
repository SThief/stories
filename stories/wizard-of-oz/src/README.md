# How The Wizard's Secret was made

- `art/`: lifts Gemini's corner sparkle off the pictures. `clean.py` makes an inpainted guess, `unmark.py` works out
  the mark's exact shape from all the pictures and undoes it, and `edge.py` tidies the last thin outline.
  Run them in that order (each takes a source folder and an output folder).
- `cartoon/`: the cartoon, drawn in code. `cartoon.html` draws any moment of the film; `scenes.js` has one scene per
  page, `chars.js` the characters and `world.js` the scenery. `timeline.json` times each page to its voice
  (0.8 s before the voice, 1.6 s after, 0.6 s crossfades).
  - Pictures: `PAGE=cartoon.html node render.js cartoon-silent.mp4 193.77` (about 40 minutes; it needs Playwright).
  - Sound: `python soundtrack.py timeline.json <voice folder> ../../../../tools/storytell soundtrack.wav`, using
    the page voices tools/storytell recorded and its harp.
  - Then join the two with ffmpeg (CRF 27, `-tune animation`, faststart) as `stories/wizard-of-oz/cartoon.mp4`.
