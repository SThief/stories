# Story Library

A shelf of kids' stories. Each story comes three ways: a cartoon, a storytelling video, and a book you read page by page.

Run it: the `story-library` launch config (port 8260), or `python3 -m http.server 8260` in this folder.

## Add a story

1. Make a folder `stories/<id>/` with `cover.jpg`, `cartoon.mp4`, `storytelling.mp4`, one thumbnail per video, and `book/`.
2. `book/book.json` lists the pages in order: `{ "img": "01.jpg", "text": "...", "audio": "01.mp3" }`. The first page may use `"cover": true`.
3. Add one entry to `stories.json`.

Story 1 was made in `~/Project/knights-tale-kids`, and its build scripts live there.

## Make the storytelling video

`tools/storytell <story-folder> --library <id>` turns a story folder into the Storytelling video and puts it on the
shelf: a painted picture on the left page with a slow zoom, the words on the right page, the storyteller's voice
(Kokoro, the voice named in `story.json`) and a soft harp. The folder needs `story.json` (title, voice, scenes) and
`art/00.png` (cover) plus `art/<id>.png` for each scene. Voices are recorded once and kept in
`<story-folder>/build/storytell/voice/`. About 15 minutes for 15 pages. Proven 2026-09-29: it rebuilt the Knight's
Tale storytelling video at 152.0 s, the same length as the original.

## Publish

This folder is the repo `SThief/stories`, served by GitHub Pages at https://sthief.github.io/stories/. Commit and push; it is live in about a minute.

GitHub refuses any file over 100 MB, and a smaller video also starts faster on a phone. Before adding a video, make a web copy:

```bash
ffmpeg -i big.mp4 -c:v libx264 -preset medium -crf 24 -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart cartoon.mp4
```

The full-size originals stay in the story's own project folder.
