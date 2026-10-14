# How The Boy Who Changed His Stars was made

- `cartoon/`: the cartoon, drawn in code and remade in October 2026 as a new film, with cinematic light, the illustrated drawing
  style and a little acting (the first version's source was lost; its narration and music are kept as
  `soundtrack.m4a`, and every shot is timed to it).
  - `kit.js`: the drawing kit. Shapes are built as plain canvas paths and filled with `fs()`, which paints a shadow on
    the side away from the shot's light and a highlight on the side toward it. `put()` draws a character on its own
    layer, lets it act (leans into a walk and settles when it stops, breathes, slides between moods), lights it for
    the shot (tint, rim of light, long soft shadow) and gives it one thick outline. `LIGHTS` are the shots' lights.
  - `chars.js`: everyone. `person()` draws any person from a look (`LOOKS`) and a pose; `horse()` gallops with its
    rider; `stands()` is the crowd. Walking follows `legsPose`: the near arm hangs from the back shoulder and is drawn
    in front, arms swing against the legs, a leg swings forward with its knee bent and pushes back straight. Time a
    walk's phase from the distance walked (`d / (STRIDE * size)`) so the feet keep pace with the ground.
  - `world.js`: scenery and effects (skies, towns, the tournament, the forge, the scroll, BANG!, memories, stars).
  - `film.js`: the film, shot by shot (`SHOTS`: start, end, light, camera, drawing), remade as a new film with its
    own places in layers, lights and camera moves, and the captions (`CAPS`).
  - `env.js`: the soundtrack's loudness, 30 values a second, for mouths while someone talks.
  - Pictures: `PAGE=cartoon.html node render.js cartoon-silent.mp4 199.2` (`PLAYWRIGHT` from
    `~/Projects/voice-lab/env.sh`); then join it with `soundtrack.m4a` (CRF 27, `-tune animation`, faststart).
  - Checks: `node poses.js <prefix>` draws the walk cycle, the gallop and the other poses on plain cards;
    `node check.js` checks that everyone moving faces the way they go and steps forward.
