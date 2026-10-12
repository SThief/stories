# Record every line of script.json in its character's voice, then lay the lines out into dialogue.json:
# when each scene starts, when each line plays, and a loudness curve per line that drives the mouths.
import json, os, subprocess, sys, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
here, models, out = sys.argv[1], sys.argv[2], sys.argv[3]
sc = json.load(open(os.path.join(here, "script.json"))); os.makedirs(out, exist_ok=True)
k = Kokoro(os.path.join(models, "kokoro-v1.0.onnx"), os.path.join(models, "voices-v1.0.bin"))
FX = {"chorus": "chorus=0.6:0.9:50|60:0.4|0.32:0.25|0.4:2|2.3", "tin": "flanger=delay=2:depth=2:regen=20:width=60:speed=0.6,volume=0.95",
      "echo": "aecho=0.8:0.7:120|240:0.35|0.2"}
LEAD, GAP, TAIL, FADE = 0.9, 0.6, 1.4, 0.5
scenes, start = [], 0.0
for si, lines in enumerate(sc["scenes"]):
    t, items = LEAD + (0.6 if si == 0 else 0), []
    for li, (who, text) in enumerate(lines):
        c = sc["cast"][who]; base = os.path.join(out, f"{si:02d}_{li}")
        if not os.path.exists(base + ".wav"):
            a, sr = k.create(text.replace('"', ''), voice=c["voice"], speed=c["speed"], lang=c["lang"])
            sf.write(base + ".raw.wav", a, sr)
            af = []
            if c.get("pitch"): af.append(f"rubberband=pitch={c['pitch']}")
            if c.get("fx"): af.append(FX[c["fx"]])
            af.append("aresample=44100")
            subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", base + ".raw.wav", "-af", ",".join(af), "-ac", "1", base + ".wav"], check=True)
        a, sr = sf.read(base + ".wav"); d = len(a) / sr
        env = [round(float(min(1, np.sqrt(np.mean(a[int(i * sr / 30):int((i + 1) * sr / 30)] ** 2)) * 9)), 2) for i in range(int(d * 30))]
        items.append({"who": who, "text": text, "start": round(t, 3), "dur": round(d, 3), "wav": base + ".wav", "env": env})
        t += d + GAP
    dur = round(t - GAP + TAIL + (0.8 if si == 0 else 0) + (2.5 if si == len(sc["scenes"]) - 1 else 0), 3)
    scenes.append({"start": round(start, 3), "dur": dur, "lines": items}); start += dur - FADE
total = round(scenes[-1]["start"] + scenes[-1]["dur"] + 2.0, 2)
json.dump({"scenes": scenes, "total": total, "fade": FADE, "names": {k2: v["name"] for k2, v in sc["cast"].items()}}, open(os.path.join(here, "dialogue.json"), "w"))
print("total", total, "s;", sum(len(s["lines"]) for s in scenes), "lines")
