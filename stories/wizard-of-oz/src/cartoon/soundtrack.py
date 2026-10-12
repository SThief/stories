# The cartoon's sound: each page's voice at its place on the timeline, over the same soft harp as the storytelling video.
import json, sys, numpy as np, soundfile as sf, importlib.machinery, importlib.util, subprocess
tl_path, vdir, tool, out = sys.argv[1:5]
loader = importlib.machinery.SourceFileLoader("storytell", tool); st = importlib.util.module_from_spec(importlib.util.spec_from_loader("storytell", loader)); loader.exec_module(st)
tl = json.load(open(tl_path)); SR = 44100; total = tl["total"]
mix = np.zeros(int(total * SR) + SR)
for i, p in enumerate(tl["pages"]):
    v, sr = sf.read(f"{vdir}/{i:02d}.wav")
    if sr != SR: v = np.interp(np.arange(0, len(v), sr / SR), np.arange(len(v)), v)
    s = int((p["start"] + tl["lead"]) * SR); mix[s:s + len(v)] += v
st.harp(total, out + ".harp.wav"); h, _ = sf.read(out + ".harp.wav"); h = h[:, 0]
mix[:len(h)] += h[:len(mix)] * .13
mix = mix[:int(total * SR)]
sf.write(out + ".raw.wav", np.stack([mix, mix], 1) * (.9 / np.max(np.abs(mix))), SR)
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", out + ".raw.wav", "-af", "loudnorm=I=-16:TP=-1.5", "-ar", "44100", out], check=True)
print("soundtrack", round(total, 1), "s")
