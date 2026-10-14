// Dorothy and Toto for the remake, drawn with the illustrated kit (first made for the style demo, ~/Projects/style-demo).
// Each part is filled, given a painted shadow (side away from I_LIGHT) and highlight (side toward it) and a thin
// coloured line; ioutline() then adds one thick dark line round the whole figure. Uses ell / clamp / lerp / ease / TAU
// from the page.
// Characters face right, turned three-quarters to us, feet at (0, 0): the near arm hangs from the back shoulder and is
// drawn in front of the body, the near leg from the back hip over the far one; far limbs are darker.
// Pose numbers they all take: { ph, walk, crouch, lean, tilt, breath, smile, brow, open, big, lid, look, blink }.
const I_LIGHT = { x: .8, y: -.6 };
function ipart(c, path, col, shade = 7, hi = 3, line = 2.4) {
  const [base, sh, li, ln] = col;
  c.fillStyle = base; c.fill(path);
  c.save(); c.clip(path);
  const big = () => { const q = new Path2D(); q.rect(-5000, -5000, 10000, 10000); return q; };
  if (shade) { const q = big(); q.addPath(path, new DOMMatrix().translate(I_LIGHT.x * shade, I_LIGHT.y * shade)); c.fillStyle = sh; c.fill(q, 'evenodd'); }
  if (hi) { const q = big(); q.addPath(path, new DOMMatrix().translate(-I_LIGHT.x * hi, -I_LIGHT.y * hi)); c.fillStyle = li; c.fill(q, 'evenodd'); }
  c.restore();
  if (line) { c.lineWidth = line; c.strokeStyle = ln; c.lineJoin = 'round'; c.lineCap = 'round'; c.stroke(path); }
}
// a two-part limb as one smooth tapered shape: from (x, y) at angle a (0 = down, + = forward), bending by b
function itaper(x, y, len, a, b, w0, wk, w1) {
  const d1 = [Math.sin(a), Math.cos(a)], d2 = [Math.sin(a + b), Math.cos(a + b)];
  const n1 = [d1[1], -d1[0]], n2 = [d2[1], -d2[0]], s = [n1[0] + n2[0], n1[1] + n2[1]], l = Math.hypot(...s) || 1, nk = [s[0] / l, s[1] / l];
  const k = [x + d1[0] * len / 2, y + d1[1] * len / 2], e = [k[0] + d2[0] * len / 2, k[1] + d2[1] * len / 2];
  const p = new Path2D(), an = v => Math.atan2(v[1], v[0]);
  p.moveTo(x + n1[0] * w0, y + n1[1] * w0);
  p.quadraticCurveTo(k[0] + nk[0] * wk * 1.15, k[1] + nk[1] * wk * 1.15, e[0] + n2[0] * w1, e[1] + n2[1] * w1);
  p.arc(e[0], e[1], w1, an(n2), an(n2) + Math.PI);
  p.quadraticCurveTo(k[0] - nk[0] * wk * 1.15, k[1] - nk[1] * wk * 1.15, x - n1[0] * w0, y - n1[1] * w0);
  p.arc(x, y, w0, an(n1) + Math.PI, an(n1) + 2 * Math.PI); p.closePath();
  return { p, e, dir: d2 };
}
const circ = (x, y, rx, ry = rx, rot = 0) => { const p = new Path2D(); p.ellipse(x, y, rx, ry, rot, 0, TAU); return p; };
// keyframed targets followed by a spring (overshoot and settle come from the spring), and eased blends for faces
function ispring(keys, T, k = 170, d = 14) {
  let x = keys[0][1], v = 0, i = 0; const dt = 1 / 240;
  for (let t = 0; t < T; t += dt) { while (i + 1 < keys.length && keys[i + 1][0] <= t) i++; v += (k * (keys[i][1] - x) - d * v) * dt; x += v * dt; }
  return x;
}
function iblend(keys, T) {
  let i = 0; while (i + 1 < keys.length && keys[i + 1][0] <= T) i++;
  if (i + 1 >= keys.length) return { ...keys[i][1] };
  const [t0, a] = keys[i], [t1, b] = keys[i + 1], k = ease((T - t0) / (t1 - t0));
  return Object.fromEntries([...new Set([...Object.keys(a), ...Object.keys(b)])].map(n => [n, lerp(a[n] ?? 0, b[n] ?? 0, k)]));
}
// the thick dark line round the whole figure layer
function ioutline(fc, fig, tc, tmp, R, col) {
  tc.setTransform(1, 0, 0, 1, 0, 0); tc.globalCompositeOperation = 'source-over'; tc.clearRect(0, 0, fig.width, fig.height);
  for (let k = 0; k < 16; k++) { const a = k / 16 * TAU; tc.drawImage(fig, Math.cos(a) * R, Math.sin(a) * R); }
  tc.globalCompositeOperation = 'source-in'; tc.fillStyle = col; tc.fillRect(0, 0, fig.width, fig.height); tc.globalCompositeOperation = 'source-over';
  fc.save(); fc.setTransform(1, 0, 0, 1, 0, 0); fc.globalCompositeOperation = 'destination-over'; fc.drawImage(tmp, 0, 0); fc.restore();
}
// a face's moving parts. eyes: [[x, y, r], ...]; the face blends through the pose numbers
function ieyes(c, eyes, p, iris = '#4a2a1a', lidCol = '#d99c86', lash = false) {
  const lid = clamp(Math.max(p.lid || 0, p.blink ? 1 : 0)), big = p.big || 0, look = p.look || 0;
  for (const [ex, ey, r] of eyes) {
    const rx = r * (.82 + big * .16), ry = r * (1 + big * .2), eye = circ(ex, ey, rx, ry);
    c.fillStyle = '#fffaf2'; c.fill(eye); c.save(); c.clip(eye);
    ell(c, ex + r * .25, ey + look * r * .4, rx * .64, ry * .68); c.fillStyle = iris; c.fill();
    ell(c, ex + r * .28, ey + look * r * .4, rx * .4, ry * .44); c.fillStyle = '#140a06'; c.fill();
    ell(c, ex + r * .48, ey - r * .32 + look * r * .4, r * .27, r * .27); c.fillStyle = '#fff'; c.fill();
    if (lid > 0) { c.fillStyle = lidCol; c.fillRect(ex - r * 1.3, ey - ry - 1, r * 2.6, ry * 2 * lid + 1); c.beginPath(); c.moveTo(ex - r * 1.3, ey - ry + ry * 2 * lid); c.lineTo(ex + r * 1.3, ey - ry + ry * 2 * lid); c.lineWidth = 3; c.strokeStyle = '#5a2e22'; c.stroke(); }
    c.restore(); c.lineWidth = 2.4; c.strokeStyle = '#4a2418'; c.stroke(eye);
    if (lash && lid < .9) { const o = ex < eyes[eyes.length - 1][0] ? -1 : 1;   // two little lashes at the outer corner
      for (const k of [0, 1]) { c.beginPath(); c.moveTo(ex + o * rx * (.75 + k * .15), ey - ry * (.7 - k * .25)); c.lineTo(ex + o * rx * (1.2 + k * .15), ey - ry * (.95 - k * .3)); c.lineWidth = 2.2; c.strokeStyle = '#3a1a10'; c.stroke(); } }
  }
}
function ibrows(c, eyes, p, col, w = 4.2) {
  const brow = p.brow || 0, big = p.big || 0;
  eyes.forEach(([ex, ey, r], i) => { const y0 = ey - r * 1.72 - big * 5, lift = brow * 5, inner = i === 0 ? 1 : -1;   // the inner ends are between the eyes
    c.beginPath(); c.moveTo(ex - r * .9, y0 + (inner > 0 ? lift * -.3 : -lift)); c.quadraticCurveTo(ex, y0 - 6, ex + r * .9, y0 + (inner > 0 ? -lift : lift * -.3));
    c.lineWidth = w; c.strokeStyle = col; c.lineCap = 'round'; c.stroke(); });
}
function imouth(c, mx, my, w, p) {
  const sm = p.smile || 0, op = p.open || 0;
  const curve = q => { q.moveTo(mx - w, my - sm * w * .45); q.quadraticCurveTo(mx, my + sm * w * 1.2, mx + w, my - sm * w * .45); };
  if (op > .05) {   // open (talking, or surprised): a soft rounded mouth; the feeling shows in the eyes and brows
    const rx = w * (.42 + .12 * Math.max(0, sm)), ry = w * (.18 + op * .55), m = new Path2D(); m.ellipse(mx, my + ry * .6, rx, ry, 0, 0, TAU);
    c.fillStyle = '#7a2430'; c.fill(m); c.save(); c.clip(m); ell(c, mx, my + ry * 1.35, rx * .8, ry * .55); c.fillStyle = '#e06a78'; c.fill(); c.restore();
    c.lineWidth = 2.6; c.strokeStyle = '#5a2020'; c.stroke(m); }
  else { const m = new Path2D(); curve(m); c.lineWidth = 3.2; c.strokeStyle = '#6a2a24'; c.lineCap = 'round'; c.stroke(m); }
}
const iwalk = p => { const w = p.walk ?? 0, sw = Math.sin(p.ph || 0), cw = Math.cos(p.ph || 0); return { w, sw, cw, bob: -(1 - Math.abs(sw)) * w }; };

// ---------------- Dorothy ----------------
const DP = { skin: ['#ffd9b8', '#e8ae8e', '#fff0de', '#b07a5a'], skinFar: ['#efc29c', '#d39c7c', '#ffd9b8', '#9a684a'],
  sock: ['#fbf6ee', '#d6cfc6', '#ffffff', '#8a8078'], sockFar: ['#e6ddcc', '#c2b8a8', '#f4ecdc', '#7a7064'],
  boot: ['#8a5530', '#5e3418', '#b07444', '#3a1e0c'], bootFar: ['#6e4224', '#4a2812', '#8a5a34', '#2a1408'],
  silver: ['#dfe6f2', '#9aa8c4', '#ffffff', '#5a6680'], silverFar: ['#b9c4da', '#7e8aa6', '#e6ecf6', '#4a5470'],
  blouse: ['#ffffff', '#d8dbe8', '#ffffff', '#8a8ea8'], hair: ['#8a4b25', '#5e2e14', '#b8703c', '#3e1a08'], bonnet: ['#ffb8d0', '#e0809e', '#ffdbe8', '#b04a70'] };
function dorothy2(c, p, t = 0) {
  const { w, sw, cw, bob } = iwalk(p), cr = p.crouch || 0, drop = 108 * (1 - Math.cos(cr)), hipY = -120 + drop + bob * 9;
  const breath = Math.sin(t * 2.2) * (p.breath ?? 1);
  for (const s of [-1, 1]) {   // legs: far first
    const a = s * sw * w * .5 + cr, b = -Math.max(0, s * cw) * w * .9 - 2 * cr, L = itaper(-s * 11 * lerp(1, .25, w), hipY, 108, a, b, 9.5, 8.5, 7.5);
    ipart(c, L.p, s < 0 && w ? DP.sockFar : DP.sock, 4, 2);
    const bt = new Path2D(), [x, y] = [L.e[0] + 8, L.e[1] + 2]; bt.roundRect(x - 16, y - 26, 28, 30, 7); bt.addPath(circ(x + 2, y, 21, 10));
    ipart(c, bt, p.shoes === 'silver' ? (s < 0 && w ? DP.silverFar : DP.silver) : (s < 0 && w ? DP.bootFar : DP.boot), 4, 2);
    if (p.shoes === 'silver' && p.sparkle) sparkle(c, x + 14, y - 14, 14 * p.sparkle, t * 3);
  }
  c.save(); c.translate(0, hipY); c.rotate(p.lean || 0); c.translate(0, 120 - breath * 1.2);
  const shB = -30 * lerp(1, .65, w), shF = 30 * lerp(1, .65, w), elbow = a => lerp(-.25, .35 + Math.max(0, a) * .9, w);
  // far arm, behind
  const aF = p.armF ?? sw * w * .55, FA = itaper(shF, -206, 84, aF, p.bendF ?? elbow(aF), 8.5, 7.5, 6.5);
  ipart(c, FA.p, DP.skinFar, 4, 2); ipart(c, circ(FA.e[0], FA.e[1], 11), DP.skinFar, 3, 2);
  // pink bonnet hanging down her back, swinging a step behind her
  c.save(); c.translate(-46, -226); c.rotate(.3 + (p.sway || 0) + Math.sin((p.ph || t * 2) - 1) * .07 * w);
  ipart(c, circ(0, 0, 30, 36), DP.bonnet, 7, 3); c.beginPath(); c.arc(0, 0, 30, -.4 * Math.PI, .6 * Math.PI); c.lineWidth = 3; c.strokeStyle = '#d65f8a'; c.stroke(); c.restore();
  // gingham pinafore over a white blouse
  const fl = Math.sin((p.ph || 0) * 2) * 4 * w + (p.skirt || 0);
  const dress = new Path2D(); dress.moveTo(-34, -218); dress.quadraticCurveTo(-40, -170, -68 - fl, -112); dress.quadraticCurveTo(0, -98, 68 + fl, -112);
  dress.quadraticCurveTo(40, -170, 34, -218); dress.quadraticCurveTo(0, -230, -34, -218); dress.closePath();
  ipart(c, dress, [gingham(c), 'rgba(30,40,110,.3)', 'rgba(255,255,255,.22)', '#3c4c8c'], 12, 4);
  c.save(); c.clip(dress); for (const x of [-30, -6, 20, 44]) { c.beginPath(); c.moveTo(x * .4, -200); c.quadraticCurveTo(x * .8, -150, x * 1.4, -100); c.lineWidth = 2; c.strokeStyle = 'rgba(40,50,120,.25)'; c.stroke(); } c.restore();
  for (const s of [-1, 1]) ipart(c, circ(s * 34, -206, 16, 14), DP.blouse, 4, 2);   // puffed sleeves
  for (const s of [-1, 1]) { const col = new Path2D(); col.moveTo(0, -214); col.quadraticCurveTo(s * 28, -222, s * 24, -202); col.quadraticCurveTo(s * 12, -198, 0, -206); col.closePath(); ipart(c, col, DP.blouse, 3, 1); }
  if (p.hold) { c.save(); c.translate(36, -146); c.scale(.82, .82); toto2(c, { walk: 0, blink: p.blink, tilt: .1, ears: Math.sin(t * 3) * .1, wag: t * 7 }, t); c.restore(); }
  // near arm, in front
  const aB = p.armB ?? (p.hold ? .62 : -sw * w * .55), NA = itaper(shB, -206, 84, aB, p.bendB ?? (p.hold ? .9 : elbow(aB)), 8.5, 7.5, 6.5);
  ipart(c, NA.p, DP.skin, 4, 2); ipart(c, circ(NA.e[0], NA.e[1], 11), DP.skin, 3, 2);
  // head, tilting at the neck; curls bounce a beat behind
  c.save(); c.translate(4, -226); c.rotate(-(p.tilt || 0)); c.translate(0, -46 + Math.sin((p.ph || 0) * 2) * 1.5 * w);
  const hb = p.bounce || 0, curls = [[-46, -14, 22], [-40, -38, 22], [-20, -54, 24], [6, -58, 24], [30, -50, 22], [46, -30, 20], [-50, 10, 18], [48, -8, 16], [-44, 30, 14]];
  for (const [x, y, r] of curls) ipart(c, circ(x, y + hb * (y > 0 ? 3 : 1.5), r), DP.hair, 6, 3, 2.6);
  const face = new Path2D(); face.moveTo(-44, -6); face.bezierCurveTo(-48, -44, 0, -52, 30, -42); face.bezierCurveTo(56, -28, 56, 16, 40, 34);
  face.bezierCurveTo(24, 50, -18, 52, -36, 32); face.bezierCurveTo(-48, 18, -46, 4, -44, -6); face.closePath();
  ipart(c, face, DP.skin, 9, 3);
  for (const [x, y, r] of [[-30, -38, 17], [-8, -46, 17], [16, -45, 16], [36, -34, 13]]) ipart(c, circ(x, y + hb, r), DP.hair, 5, 3, 2.4);   // fringe
  ell(c, -26, 14, 13, 9); c.fillStyle = 'rgba(255,110,110,.38)'; c.fill(); ell(c, 34, 14, 10, 8); c.fill();
  c.fillStyle = '#c98a62'; for (const [x, y] of [[-30, 8], [-24, 13], [-34, 15], [34, 8], [40, 13], [30, 15]]) { ell(c, x + 4, y, 1.8, 1.8); c.fill(); }
  const eyes = [[-14, -2, 12], [22, -2, 12]];
  ieyes(c, eyes, p, '#4a3020', DP.skin[1], true); ibrows(c, eyes, p, '#6a3418', 3);
  imouth(c, 8, 22, 10, p);
  c.restore(); c.restore();
}

// ---------------- Toto ----------------
const TP = { fur: ['#2e2820', '#18140f', '#5a4e40', '#0a0806'], furFar: ['#1e1a14', '#0e0c08', '#3a3228', '#060504'] };
function toto2(c, p, t = 0) {
  const w = p.walk ?? 1, ph = p.ph || 0, hop = Math.abs(Math.sin(ph)) * 9 * w;
  c.save(); c.translate(0, -hop);
  // legs: far pair first (darker), a trot (diagonal legs together)
  for (const [x, o, far] of [[-18, Math.PI, true], [22, 0, true], [-24, 0, false], [16, Math.PI, false]]) {
    const L = itaper(x, -30, 28 + hop, Math.sin(ph + o) * .55 * w, -Math.max(0, Math.cos(ph + o)) * .6 * w, 5.5, 5, 4.5);
    ipart(c, L.p, far ? TP.furFar : TP.fur, 2, 1, 2);
  }
  c.save(); c.translate(-36, -42); c.rotate(-.9 + Math.sin((p.wag ?? t * 9)) * .5);   // tail
  const tail = new Path2D(); tail.moveTo(-5, 0); tail.quadraticCurveTo(-12, -22, 2, -32); tail.quadraticCurveTo(4, -18, 6, 0); tail.closePath(); ipart(c, tail, TP.fur, 2, 1, 2); c.restore();
  // scruffy body with a ragged fringe
  const body = new Path2D(); body.moveTo(-40, -44); body.quadraticCurveTo(-4, -68, 34, -48);
  for (let i = 0; i <= 8; i++) { const x = 34 - i * 9.25; body.quadraticCurveTo(x - 4, -14 + (i % 2) * 7 + Math.sin(t * 6 + i) * 2, x - 9, -22); }
  body.closePath(); ipart(c, body, TP.fur, 6, 3, 2);
  c.save(); c.translate(34, -62); c.rotate(-(p.tilt || 0));
  const flop = p.ears ?? Math.sin(ph * 2 - 1) * .2 * w;
  for (const [x, r] of [[-12, -.35], [8, .2]]) { const e = new Path2D(); e.moveTo(x - 7, -12); e.lineTo(x + Math.sin(r + flop) * 8, -36); e.lineTo(x + 8, -12); e.closePath(); ipart(c, e, TP.fur, 3, 2, 2); }
  ipart(c, circ(0, 0, 23, 20), TP.fur, 5, 3, 2);
  for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(-14 + i * 6, -16); c.lineTo(-17 + i * 6, -26); c.lineWidth = 3; c.strokeStyle = '#4a4034'; c.stroke(); }
  ipart(c, circ(18, 6, 11, 8), TP.fur, 3, 2, 2);
  ell(c, 26, 3, 4.5, 3.5); c.fillStyle = '#050403'; c.fill(); ell(c, 27, 2, 1.5, 1); c.fillStyle = '#666'; c.fill();
  if (p.blink) { c.beginPath(); c.moveTo(2, -4); c.lineTo(12, -4); c.lineWidth = 3; c.strokeStyle = '#ccc'; c.stroke(); }
  else { ell(c, 7, -4, 6, 7); c.fillStyle = '#fff'; c.fill(); ell(c, 8.5, -3, 4.2, 5.2); c.fillStyle = '#000'; c.fill(); ell(c, 10, -5.5, 1.6, 1.6); c.fillStyle = '#fff'; c.fill(); }
  ell(c, 15, 17, 4.5, 6.5 + Math.abs(Math.sin(t * 8)) * 2); c.fillStyle = '#ff7b93'; c.fill();
  c.restore(); c.restore();
}

