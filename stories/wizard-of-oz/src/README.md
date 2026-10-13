# How The Wizard's Secret was made

- `art/`: lifts Gemini's corner sparkle off the pictures. `clean.py` makes an inpainted guess, `unmark.py` works out
  the mark's exact shape from all the pictures and undoes it, and `edge.py` tidies the last thin outline.
  Run them in that order (each takes a source folder and an output folder).
- `cartoon/`: the cartoon, drawn in code. `cartoon.html` draws any moment of the film; `scenes.js` has one scene per
  page, `chars.js` the characters and `world.js` the scenery. `timeline.js` is the first, narrated timing that each
  scene's action was drawn to.
  - Walking: `legsPose` in `chars.js` is the walk cycle for everyone (the arm drawn in front hangs from the back
    shoulder; arms swing against the legs). Time a walk with `since(moment)` (real film seconds, since the narration
    stretches each scene's action clock) and set its phase with `stepPh(character, distance, size)` so the feet keep
    pace with the ground.
  - `script.json` is the cartoon, told like The Boy Who Changed His Stars: the narrator carries the story and the
    characters speak their heart lines. Each line is `[who, words, {options}]`. The options:
    `shot` (`wide`, `mid`, `close`, `two`, or `at` with `x`/`y`/`z`), `on` (who the shot is on), `z`/`dy` (closer,
    lower), `move` (glide there over that many seconds instead of cutting), `track` (follow a moving character),
    `act` (the moment of the scene's action, in `timeline.js` time, that this line lines up with), `mood`
    (`{"lion": "sad"}`), `cue` (`["tinCry"]`), `fx` (`["hearts"]`, with `heartsOn`), `memory` (a sepia circle
    showing another page: `{"page", "u", "cue", "speak"}`) and `pause` (seconds of quiet after the line).
  - Voices: `python voices.py . <kokoro models folder> <voice folder>` records each line in its character's voice
    and writes `dialogue.json`; copy it into `dialogue.js` as `const DIALOGUE = ...;`. A line is re-recorded only
    when its words or voice change.
  - Pictures: `PAGE=cartoon.html node render.js cartoon-silent.mp4 <total seconds from dialogue.json>` (Playwright;
    about 50 minutes on the MacBook, where `PLAYWRIGHT` from `~/Projects/voice-lab/env.sh` points at it).
  - Sound: `python soundtrack.py dialogue.json ../../../../tools/storytell soundtrack.wav` lays the voices over
    the storytelling harp.
  - Then join the two with ffmpeg (CRF 27, `-tune animation`, faststart) as `stories/wizard-of-oz/cartoon.mp4`.
