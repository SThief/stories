import cv2, numpy as np, sys, os
src, dst, ap = sys.argv[1:4]; alpha = np.load(ap); y0 = x0 = 860
ring = cv2.morphologyEx((alpha > .05).astype(np.uint8), cv2.MORPH_GRADIENT, np.ones((3, 3), np.uint8))
for f in sorted(x for x in os.listdir(src) if x.endswith('.png')):
    im = cv2.imread(os.path.join(src, f)); m = np.zeros(im.shape[:2], np.uint8)
    m[y0:y0 + ring.shape[0], x0:x0 + ring.shape[1]] = ring * 255
    cv2.imwrite(os.path.join(dst, f), cv2.inpaint(im, m, 2, cv2.INPAINT_TELEA))
