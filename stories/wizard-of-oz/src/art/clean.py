# Remove Gemini's sparkle mark (bottom-right, centred near 904,904 on a 1024 image) by inpainting a star-shaped mask.
import cv2, numpy as np, sys, os
src, dst = sys.argv[1], sys.argv[2]
for f in sorted(os.listdir(src)):
    if not f.endswith('.png'): continue
    im = cv2.imread(os.path.join(src, f)); h, w = im.shape[:2]
    cx, cy, r = int(w * 904 / 1024), int(h * 904 / 1024), int(w * 30 / 1024)
    m = np.zeros((h, w), np.uint8)
    pts = [(cx + (r if i % 2 == 0 else r * .35) * np.cos(i * np.pi / 4 - np.pi / 2), cy + (r if i % 2 == 0 else r * .35) * np.sin(i * np.pi / 4 - np.pi / 2)) for i in range(8)]
    cv2.fillPoly(m, [np.int32(pts)], 255); m = cv2.dilate(m, np.ones((7, 7), np.uint8))
    cv2.imwrite(os.path.join(dst, f), cv2.inpaint(im, m, 6, cv2.INPAINT_TELEA))
    print(f, end=' ')
