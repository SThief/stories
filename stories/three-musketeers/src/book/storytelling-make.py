import numpy as np, wave, json, sys, subprocess, os
from PIL import Image, ImageDraw, ImageFont, ImageFilter
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)),'../../cartoon/voice')); from lines import BOOK
F = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../cartoon/fonts/')
fb = ImageFont.truetype(F + 'Poppins-Bold.ttf', 64); ft = ImageFont.truetype(F + 'Poppins-Medium.ttf', 33); fs = ImageFont.truetype(F + 'Poppins-Medium.ttf', 22)
W, H = 1280, 720
yy = np.linspace(0, 1, H)[:, None]
bg = (np.array([37, 51, 110]) * (1 - yy[..., None]) + np.array([13, 19, 48]) * yy[..., None]) * np.ones((H, W, 1))
rng = np.random.default_rng(5)
base = Image.fromarray(bg.astype(np.uint8)); d = ImageDraw.Draw(base)
for _ in range(60):
    x, y = rng.random() * W, rng.random() * 110 + 5; r = rng.random() * 1.6 + .6; d.ellipse([x - r, y - r, x + r, y + r], fill=(255, 246, 194))
def wrap(text, font, maxw):
    words = text.split(); lines = []; cur = ''
    for w in words:
        t = (cur + ' ' + w).strip()
        if d.textlength(t, font=font) > maxw: lines.append(cur); cur = w
        else: cur = t
    lines.append(cur); return lines
durs = []
for i, txt in enumerate(BOOK):
    im = base.copy(); dr = ImageDraw.Draw(im)
    pic = Image.open(f'../art/out/{i:02d}.jpg').resize((600, 600), Image.LANCZOS)
    sh = Image.new('RGBA', (640, 640), (0, 0, 0, 0)); ImageDraw.Draw(sh).rounded_rectangle([20, 26, 620, 626], 18, fill=(0, 0, 0, 150)); sh = sh.filter(ImageFilter.GaussianBlur(14))
    im.paste(sh, (40, 40), sh); im.paste(pic, (60, 60))
    if i == 0:
        y = 270
        for ln in ['All for One']:
            dr.text((710, y), ln, font=fb, fill=(244, 197, 66)); y += 80
        dr.text((712, y + 20), 'A storybook for brave kids', font=fs, fill=(207, 196, 176))
    else:
        lines = wrap(txt, ft, 520); y = 360 - len(lines) * 26
        for ln in lines: dr.text((710, y), ln, font=ft, fill=(255, 247, 234)); y += 52
        dr.text((710, 660), f'{i} / 14', font=fs, fill=(207, 196, 176))
    im.save(f'p{i:02d}.png')
    w = wave.open(f'../narration/{i:02d}.wav'); dur = w.getnframes() / w.getframerate(); w.close()
    durs.append(round(dur + 1.6, 2))
json.dump(durs, open('durs.json', 'w')); print(durs, sum(durs))
