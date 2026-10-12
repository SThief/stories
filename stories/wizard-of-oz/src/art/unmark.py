# Gemini lays a semi-transparent white sparkle at the same spot on every picture: seen = a*255 + (1-a)*true.
# Estimate a per pixel from all pictures (using an inpainted guess of 'true'), then undo the blend exactly.
import cv2, numpy as np, sys, os
src, guess, dst = sys.argv[1:4]
fs = sorted(f for f in os.listdir(src) if f.endswith('.png'))
y0, y1, x0, x1 = 860, 950, 860, 950
obs = np.stack([cv2.imread(os.path.join(src, f)).astype(np.float32)[y0:y1, x0:x1] for f in fs])
bg = np.stack([cv2.imread(os.path.join(guess, f)).astype(np.float32)[y0:y1, x0:x1] for f in fs])
den = 255 - bg; a = np.where(den > 40, (obs - bg) / np.maximum(den, 1), np.nan)
alpha = np.nan_to_num(np.clip(np.nanmedian(a, axis=(0, 3)), 0, .95))
alpha[alpha < .03] = 0
alpha = cv2.GaussianBlur(alpha, (3, 3), 0)
print('peak alpha', alpha.max().round(3), 'pixels', int((alpha > .05).sum()))
for f in fs:
    im = cv2.imread(os.path.join(src, f)).astype(np.float32); r = im[y0:y1, x0:x1]; A = alpha[..., None]
    im[y0:y1, x0:x1] = np.clip((r - A * 255) / (1 - A), 0, 255)
    cv2.imwrite(os.path.join(dst, f), im.astype(np.uint8))
np.save(os.path.join(dst, '..', 'alpha.npy'), alpha)
