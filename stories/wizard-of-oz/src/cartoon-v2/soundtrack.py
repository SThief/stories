# The cartoon's sound: every line in its character's voice at its place in dialogue.json, over the soft harp from
# tools/storytell.
import json, sys, numpy as np, soundfile as sf, importlib.machinery, importlib.util, subprocess
dl_path, tool, out = sys.argv[1:4]
loader = importlib.machinery.SourceFileLoader("storytell", tool); st = importlib.util.module_from_spec(importlib.util.spec_from_loader("storytell", loader)); loader.exec_module(st)
dl = json.load(open(dl_path)); SR = 44100; total = dl["total"]
mix = np.zeros(int(total * SR) + SR * 2)
for sc in dl["scenes"]:
    for l in sc["lines"]:
        v, sr = sf.read(l["wav"])
        if v.ndim > 1: v = v.mean(1)
        if sr != SR: v = np.interp(np.arange(0, len(v), sr / SR), np.arange(len(v)), v)
        s = int((sc["start"] + l["start"]) * SR); mix[s:s + len(v)] += v
st.harp(total, out + ".harp.wav"); h, _ = sf.read(out + ".harp.wav"); h = h[:, 0]
mix[:len(h)] += h[:len(mix)] * .12
mix = mix[:int(total * SR)]
sf.write(out + ".raw.wav", np.stack([mix, mix], 1) * (.9 / np.max(np.abs(mix))), SR)
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", out + ".raw.wav", "-af", "loudnorm=I=-16:TP=-1.5", "-ar", "44100", out], check=True)
print("soundtrack", round(total, 1), "s")
