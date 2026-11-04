import numpy as np, glob, os
from PIL import Image, ImageFilter, ImageDraw, ImageChops
S = 1100; rng = np.random.default_rng(3)
def noise(shape, scale, seed):
    r = np.random.default_rng(seed); small = r.random((shape[0] // scale + 2, shape[1] // scale + 2))
    im = Image.fromarray((small * 255).astype(np.uint8)).resize((shape[1], shape[0]), Image.BICUBIC)
    return np.asarray(im).astype(np.float32) / 255
paper_col = np.array([251, 242, 222], np.float32)
grain = (noise((S, S), 1, 1) * .5 + noise((S, S), 6, 2) * .3 + noise((S, S), 60, 3) * .2)
for f in sorted(glob.glob('raw/*.png')):
    k = int(os.path.basename(f)[:2])
    img = Image.open(f).convert('RGB').resize((S, S), Image.LANCZOS)
    a = np.asarray(img).astype(np.float32)
    # soft storybook grade: lift blacks a touch, warm tint, slight desaturation
    pass
    pass
    a = a * (0.94 + 0.06 * grain[..., None])
    # deckled watercolor edge mask
    m = Image.new('L', (S, S), 0); d = ImageDraw.Draw(m); inset = 34
    d.rounded_rectangle([inset, inset, S - inset, S - inset], radius=46, fill=255)
    m = m.filter(ImageFilter.GaussianBlur(10))
    mm = np.asarray(m).astype(np.float32) / 255
    edge = noise((S, S), 9, 10 + k) * .55 + noise((S, S), 3, 20 + k) * .45
    mm = np.clip((mm - .5 + (edge - .5) * .55) * 7 + .5, 0, 1)
    mm = np.asarray(Image.fromarray((mm * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))).astype(np.float32)[..., None] / 255
    # inner vignette
    yy, xx = np.mgrid[0:S, 0:S]; r = np.sqrt(((xx - S / 2) / (S / 2)) ** 2 + ((yy - S / 2) / (S / 2)) ** 2)
    a = a * (1 - .10 * np.clip(r - .65, 0, 1)[..., None])
    paper = paper_col * (0.95 + 0.05 * grain[..., None])
    out = a * mm + paper * (1 - mm)
    # faint pencil-ish edge line where image meets paper
    line = np.abs(np.gradient(mm[..., 0])[0]) + np.abs(np.gradient(mm[..., 0])[1])
    out = out * (1 - np.clip(line * 1.2, 0, .35)[..., None] * np.array([.5, .55, .6]))
    Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).save(f'out/{k:02d}.jpg', quality=88)
print('ok')
