// The drawing kit for The Boy Who Changed His Stars: shapes are drawn with plain canvas paths and filled with fs(),
// which paints them in the illustrated style (a painted shadow on the side away from the shot's light, a highlight on
// the side toward it, a thin line in a darker shade of the fill). put() draws a character on its own layer, lets it
// act (lean into a walk, settle, breathe, blend its face between moods), lights it for the shot (tint, rim of light,
// long soft shadow) and gives it one thick dark outline. Same look as the Oz cartoon (wizard-of-oz/src/cartoon/look.js).
const W = 1920, H = 1080, TAU = Math.PI * 2, INK = '#2b1d1a';
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ease = x => { x = clamp(x); return x * x * (3 - 2 * x); };
const lerp = (a, b, k) => a + (b - a) * k;
const hash = (i, k = 0) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
  t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function ell(c, x, y, rx, ry = rx, rot = 0) { c.beginPath(); c.ellipse(x, y, Math.max(.1, rx), Math.max(.1, ry), rot, 0, TAU); }
function rr(c, x, y, w, h, r) { c.beginPath(); c.roundRect(x, y, w, h, r); }
function lin(c, x0, y0, x1, y1, st) { const g = c.createLinearGradient(x0, y0, x1, y1); st.forEach(([o, s]) => g.addColorStop(o, s)); return g; }
function rad(c, x, y, r0, r1, st) { const g = c.createRadialGradient(x, y, r0, x, y, r1); st.forEach(([o, s]) => g.addColorStop(o, s)); return g; }
function glow(c, x, y, r, col, a) { if (a <= 0 || r <= 0) return; c.fillStyle = rad(c, x, y, 0, r, [[0, `rgba(${col},${a})`], [.4, `rgba(${col},${a * .35})`], [1, `rgba(${col},0)`]]); c.fillRect(x - r, y - r, r * 2, r * 2); }
function ink(c, w = 4, col = INK) { c.lineWidth = w; c.strokeStyle = col; c.lineJoin = 'round'; c.lineCap = 'round'; c.stroke(); }
const unit = (x, y) => { const l = Math.hypot(x, y) || 1; return { x: x / l, y: y / l }; };

// ---------- the shot's light ----------
// sun: where the light is, in the shot's coordinates; rim / hi / shade: colours of the lit edge, painted highlights and
// shadows; tint: laid over characters; shadowA: cast-shadow darkness; line: the outline colour.
const LIGHTS = {
  day: { sun: [1500, 120], rim: '255,246,214', rimA: .65, tint: 'rgba(60,80,150,.04)', shade: '#4a5a9a', hi: '#fffbe8', shadowA: .3, haze: '200,228,255', line: '#2a1626' },
  sunset: { sun: [1500, 300], rim: '255,200,140', rimA: .75, tint: 'rgba(140,60,60,.08)', shade: '#7a3a5a', hi: '#fff0cc', shadowA: .3, haze: '255,190,160', line: '#2a1420' },
  night: { sun: [1500, 160], rim: '170,195,255', rimA: .7, tint: 'rgba(20,28,90,.38)', shade: '#1e2456', hi: '#c8d4ff', shadowA: .3, haze: '60,70,140', line: '#120c22' },
  fire: { sun: [960, 900], rim: '255,170,90', rimA: .85, tint: 'rgba(30,24,70,.32)', shade: '#3a1e3a', hi: '#ffd8a0', shadowA: .35, haze: '60,50,90', line: '#140a14' },
  forge: { sun: [1500, 760], rim: '255,160,80', rimA: .85, tint: 'rgba(70,30,20,.16)', shade: '#4a2420', hi: '#ffe0b0', shadowA: .34, haze: '150,90,60', line: '#1e0e0a' },
  candle: { sun: [1320, 620], rim: '255,200,120', rimA: .8, tint: 'rgba(70,40,20,.2)', shade: '#4a3020', hi: '#ffe8c0', shadowA: .34, haze: '150,110,70', line: '#1e120a' },
  dusk: { sun: [300, 120], rim: '210,200,255', rimA: .55, tint: 'rgba(50,40,90,.16)', shade: '#3a3268', hi: '#e8e0ff', shadowA: .26, haze: '150,140,190', line: '#1a1228' },
  glory: { sun: [1200, 260], rim: '255,240,190', rimA: .8, tint: 'rgba(255,200,120,.04)', shade: '#8a5a4a', hi: '#fffbe0', shadowA: .26, haze: '255,236,190', line: '#2a1a14' },
  sepia: { sun: [1300, 200], rim: '255,240,220', rimA: .3, tint: 'rgba(0,0,0,0)', shade: '#7a6a5a', hi: '#ffffff', shadowA: .2, haze: '230,220,200', line: '#3a2e24' },
};
let L = LIGHTS.day, CAM_M = new DOMMatrix(), DIR = { x: .7, y: -.7 }, CAM_Z = 1;
function setLight(l, cam, z = 1) { L = typeof l === 'string' ? LIGHTS[l] : l; CAM_M = cam; CAM_Z = z;
  const s = cam.transformPoint(new DOMPoint(...L.sun)); DIR = unit(s.x - 960, s.y - 540); KIT.blurred = false; }
const KIT = { dir: null };

// ---------- colours ----------
function rgbOf(col) {
  if (typeof col !== 'string') return null;
  let m = col.match(/^#([0-9a-f]{6})$/i); if (m) { const n = parseInt(m[1], 16); return [n >> 16, (n >> 8) & 255, n & 255, 1]; }
  m = col.match(/^rgba?\(([^)]+)\)$/); if (m) { const v = m[1].split(',').map(Number); return [v[0], v[1], v[2], v[3] ?? 1]; }
  return null;
}
const mixCol = (a, b, k) => { const A = rgbOf(a), B = rgbOf(b); return `rgba(${[0, 1, 2].map(i => Math.round(lerp(A[i], B[i], k))).join(',')},${A[3]})`; };

// ---------- paths are recorded as they are built, so fs() can shade them ----------
{ const P = CanvasRenderingContext2D.prototype, begin = P.beginPath;
  P.beginPath = function () { this.__p = new Path2D(); return begin.call(this); };
  for (const m of ['moveTo', 'lineTo', 'quadraticCurveTo', 'bezierCurveTo', 'arc', 'arcTo', 'ellipse', 'rect', 'roundRect', 'closePath']) {
    const o = P[m]; P[m] = function (...a) { if (this.__p) try { this.__p[m](...a); } catch (e) {} return o.apply(this, a); }; } }
const BIG = (() => { const q = new Path2D(); q.rect(-6000, -6000, 12000, 12000); return q; })();
function paint(c, path, fill, w = 4, flat = false) {
  c.fillStyle = fill; c.fill(path);
  if (!flat) {
    const rgb = rgbOf(fill), shade = rgb ? mixCol(fill, L.shade, .34) : 'rgba(40,25,70,.26)', hi = rgb ? mixCol(fill, L.hi, .3) : 'rgba(255,248,230,.2)';
    const m = c.getTransform(), det = m.a * m.d - m.b * m.c || 1, d = KIT.dir || DIR, v = unit((m.d * d.x - m.c * d.y) / det, (-m.b * d.x + m.a * d.y) / det);
    c.save(); c.clip(path);
    let q = new Path2D(BIG); q.addPath(path, new DOMMatrix().translate(v.x * 7, v.y * 7)); c.fillStyle = shade; c.fill(q, 'evenodd');
    q = new Path2D(BIG); q.addPath(path, new DOMMatrix().translate(-v.x * 3, -v.y * 3)); c.fillStyle = hi; c.fill(q, 'evenodd');
    c.restore();
  }
  if (w) { c.lineWidth = Math.max(1.6, w * .5); c.strokeStyle = rgbOf(fill) ? mixCol(fill, '#2a1420', .55) : INK; c.lineJoin = 'round'; c.lineCap = 'round'; c.stroke(path); }
}
const fs = (c, fill, w = 4) => paint(c, c.__p, fill, w);
const flatFs = (c, fill, w = 4) => paint(c, c.__p, fill, w, true);
// a limb as one smooth shape tapering toward the hand or foot: from (x, y) at angle a (0 = down, + = forward), bending by b
function limb(c, x, y, len, a, w, fill, bend = 0) {
  const d1 = [Math.sin(a), Math.cos(a)], d2 = [Math.sin(a + bend), Math.cos(a + bend)], n1 = [d1[1], -d1[0]], n2 = [d2[1], -d2[0]];
  const nk = unit(n1[0] + n2[0], n1[1] + n2[1]), k = [x + d1[0] * len / 2, y + d1[1] * len / 2], e = [k[0] + d2[0] * len / 2, k[1] + d2[1] * len / 2];
  const w0 = w / 2 + 2, wk = w / 2 + 1.6, w1 = w / 2 + 1, an = v => Math.atan2(v[1], v[0]), p = new Path2D();
  p.moveTo(x + n1[0] * w0, y + n1[1] * w0); p.quadraticCurveTo(k[0] + nk.x * wk * 1.15, k[1] + nk.y * wk * 1.15, e[0] + n2[0] * w1, e[1] + n2[1] * w1);
  p.arc(e[0], e[1], w1, an(n2), an(n2) + Math.PI);
  p.quadraticCurveTo(k[0] - nk.x * wk * 1.15, k[1] - nk.y * wk * 1.15, x - n1[0] * w0, y - n1[1] * w0);
  p.arc(x, y, w0, an(n1) + Math.PI, an(n1) + 2 * Math.PI); p.closePath();
  paint(c, p, fill, 4);
  return [e[0], e[1], d2];
}
// The walk cycle (ph rises as the character goes forward). Legs: s = +1 the near leg, -1 the far one. Arms: s = -1 the
// back shoulder (the near arm, drawn in front), +1 the front one. A leg swings forward with its knee bent and its foot
// lifted, then pushes back straight along the ground; each arm swings against the leg on its own side.
function legsPose(p) {
  const w = p.walk ?? 0, sw = Math.sin(p.ph || 0), cw = Math.cos(p.ph || 0);
  return { w, sw, bob: -(1 - Math.abs(sw)) * w, leg: s => s * sw * w, knee: s => -Math.max(0, s * cw) * w, arm: s => s * sw * w,
    hip: (s, x) => -s * x * lerp(1, .3, w), shoulder: (s, x) => s * x * lerp(1, .6, w) };
}

// ---------- faces: moods are sets of numbers, and a change of mood slides from one set to the next ----------
const MOODS = { calm: { smile: .55, brow: 0, big: 0, open: 0, lid: 0, look: 0, happy: 0 }, happy: { smile: 1, brow: -.1, big: .1, open: .3, lid: 0, look: 0, happy: 1 },
  sad: { smile: -.75, brow: 1, big: 0, open: 0, lid: .3, look: .55, happy: 0 }, wow: { smile: .1, brow: .55, big: .9, open: .65, lid: 0, look: 0, happy: 0 },
  proud: { smile: .9, brow: .1, big: .05, open: 0, lid: .2, look: 0, happy: 0 }, mean: { smile: .4, brow: -1, big: 0, open: 0, lid: .35, look: 0, happy: 0 },
  sure: { smile: .5, brow: -.4, big: 0, open: 0, lid: .1, look: 0, happy: 0 }, worried: { smile: -.3, brow: .9, big: .4, open: .2, lid: 0, look: 0, happy: 0 },
  shout: { smile: .3, brow: -.6, big: .3, open: .9, lid: 0, look: 0, happy: 0 }, sleep: { smile: .3, brow: 0, big: 0, open: 0, lid: 1, look: 0, happy: 0 } };
const faceOf = p => p.__face || MOODS[p.mood] || MOODS.calm;
// eyes on the facing side of a round head: [[x, y, r], ...]
function eyes(c, list, p) {
  const f = faceOf(p), lid = clamp(Math.max(f.lid, p.blink ? 1 : 0)), big = f.big;
  for (const [ex, ey, r] of list) {
    if (f.happy > .5) { c.beginPath(); c.arc(ex, ey + r * .3, r * .7, 1.1 * Math.PI, 1.9 * Math.PI); ink(c, 4); continue; }
    const rx = r * .82 * (1 + big * .15), ry = r * (1 + big * .2), eye = new Path2D(); eye.ellipse(ex, ey, rx, ry, 0, 0, TAU);
    c.fillStyle = '#fffaf2'; c.fill(eye); c.save(); c.clip(eye);
    const px = ex + r * .25, py = ey + f.look * r * .35;
    ell(c, px, py, r * .5, r * .58); c.fillStyle = '#3a2214'; c.fill(); ell(c, px + r * .16, py - r * .2, r * .16); c.fillStyle = '#fff'; c.fill();
    if (lid > 0) { c.fillStyle = p.lidCol || '#d89c78'; c.fillRect(ex - r * 1.2, ey - ry - 1, r * 2.4, ry * 2 * lid + 1); c.beginPath(); c.moveTo(ex - r * 1.2, ey - ry + ry * 2 * lid); c.lineTo(ex + r * 1.2, ey - ry + ry * 2 * lid); ink(c, 3.5); }
    c.restore(); c.lineWidth = 2.6; c.strokeStyle = INK; c.stroke(eye);
  }
  if (Math.abs(f.brow) > .12) list.forEach(([ex, ey, r], i) => { const y0 = ey - r * 1.55 - big * 4, lift = f.brow * r * .4, inner = i === 0 ? 1 : -1;
    c.beginPath(); c.moveTo(ex - r * .8, y0 + (inner > 0 ? 0 : -lift)); c.quadraticCurveTo(ex, y0 - r * .25, ex + r * .8, y0 + (inner > 0 ? -lift : 0)); ink(c, 4.5); });
}
function mouth(c, x, y, w, p) {
  const f = faceOf(p), sm = f.smile, op = Math.max(f.open, (p.talk || 0) * .9);
  const curve = q => { q.moveTo(x - w, y - sm * w * .4); q.quadraticCurveTo(x, y + sm * w * 1.1, x + w, y - sm * w * .4); };
  if (op > .06) {   // open (talking, or surprised): a soft rounded mouth; the feeling shows in the eyes and brows
    const rx = w * (.42 + .12 * Math.max(0, sm)), ry = w * (.18 + op * .55), m = new Path2D(); m.ellipse(x, y + ry * .6, rx, ry, 0, 0, TAU);
    c.fillStyle = '#7a2430'; c.fill(m); c.save(); c.clip(m); ell(c, x, y + ry * 1.35, rx * .8, ry * .55); c.fillStyle = '#e8707e'; c.fill(); c.restore();
    c.lineWidth = 2.6; c.strokeStyle = INK; c.stroke(m); }
  else { const m = new Path2D(); curve(m); c.lineWidth = 3.6; c.strokeStyle = INK; c.lineCap = 'round'; c.stroke(m); }
}

// ---------- characters on their own layer: acting, light, outline ----------
const mkC = (w = W, h = H) => { const o = document.createElement('canvas'); o.width = w; o.height = h; return o; };
const FIG = mkC(), TMP = mkC(), fgc = FIG.getContext('2d'), tpc = TMP.getContext('2d');
const STATE = new Map(); let COUNT = {}, NOW = 0;
const NO_LEAN = new Set(['horse', 'crowd']);
function actor(fn, p, t) {
  const name = fn.name + (p.who || ''), n = COUNT[name] = (COUNT[name] || 0) + 1, key = name + n;
  let st = STATE.get(key); const dt = st ? t - st.t : 0;
  const walking = (p.walk ?? 0) > .05, target = (walking ? .05 * p.walk : 0) + (p.lean || 0), mood = p.mood || 'calm';
  if (!st || dt < 0 || dt > .3) st = { t, lean: target, v: 0, mood, from: MOODS[mood] || MOODS.calm, at: -9 };
  for (let k = 0, steps = Math.round(dt * 240); k < steps; k++) { st.v += (80 * (target - st.lean) - 6.5 * st.v) / 240; st.lean += st.v / 240; }
  if (mood !== st.mood) { st.from = blendFace(st, t); st.mood = mood; st.at = t; }
  st.t = t; STATE.set(key, st);
  const since = t - st.at, pop = since < 1.2 ? .045 * Math.exp(-since * 5) * Math.sin(since * 17) : 0;
  const breath = walking || p.still ? 0 : Math.sin(t * 2.3 + n) * .008;
  return { lean: NO_LEAN.has(fn.name) || p.still ? 0 : st.lean + (p.talk ? Math.sin(t * 6.5) * .014 * p.talk : 0), sy: 1 + pop + breath, sx: 1 - pop * .5, face: blendFace(st, t) };
}
function blendFace(st, t) { const to = MOODS[st.mood] || MOODS.calm, k = ease((t - st.at) / .35); return Object.fromEntries(Object.keys(to).map(n => [n, lerp(st.from[n], to[n], k)])); }
// draw fn's character with its feet at (x, y), scale s, facing right (or left when flip)
function put(c, fn, x, y, s, p, t, flip = false, opt = {}) {
  const M = c.getTransform(), feet = M.transformPoint(new DOMPoint(x, y)), zc = Math.hypot(M.a, M.b) * s, wide = opt.wide || 1;
  if (!KIT.blurred && CAM_Z > 1.45 && !opt.noBlur) { KIT.blurred = true;   // close shots: blur what is behind the first character
    tpc.setTransform(1, 0, 0, 1, 0, 0); tpc.clearRect(0, 0, W, H); tpc.drawImage(c.canvas, 0, 0);
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.filter = `blur(${Math.min(7, (CAM_Z - 1.35) * 5)}px)`; c.drawImage(TMP, 0, 0); c.restore(); }
  const bx = Math.max(0, Math.floor(feet.x - 420 * zc * wide)), by = Math.max(0, Math.floor(feet.y - (opt.tall || 660) * zc)), bw = Math.min(W, Math.ceil(feet.x + 420 * zc * wide)) - bx, bh = Math.min(H, Math.ceil(feet.y + 90 * zc)) - by;
  if (bw <= 0 || bh <= 0) return;
  if (window.CHECK) CHECK.push({ who: fn.name + (COUNT[fn.name] || 0), x, flip, walk: p.walk || p.run || 0, ph: p.ph });   // for check.js
  const A = actor(fn, p, t), sunD = CAM_M.transformPoint(new DOMPoint(...L.sun)), dir = unit(sunD.x - feet.x, sunD.y - (feet.y - 250 * zc));
  // clear the whole layers, not just this box: smoothing reads a pixel past the box edge (a thin line otherwise)
  fgc.setTransform(1, 0, 0, 1, 0, 0); fgc.clearRect(0, 0, W, H); tpc.setTransform(1, 0, 0, 1, 0, 0); tpc.clearRect(0, 0, W, H);
  fgc.setTransform(M); fgc.translate(x, y); fgc.scale(flip ? -s : s, s); fgc.rotate(A.lean); fgc.scale(A.sx, A.sy);
  KIT.dir = dir; fn(fgc, { ...p, __face: A.face }, t); KIT.dir = null; fgc.setTransform(1, 0, 0, 1, 0, 0);
  const region = (ctx, img, dx = 0, dy = 0) => ctx.drawImage(img, bx, by, bw, bh, bx + dx, by + dy, bw, bh);
  if (!opt.noShadow && !opt.silhouette) {   // the long soft shadow on the ground, away from the light, and a dark contact shadow
    tpc.setTransform(1, 0, 0, 1, 0, 0); tpc.globalCompositeOperation = 'source-over'; tpc.clearRect(bx, by, bw, bh); region(tpc, FIG);
    tpc.globalCompositeOperation = 'source-in'; tpc.fillStyle = mixCol(L.shade, '#000000', .5); tpc.fillRect(bx, by, bw, bh); tpc.globalCompositeOperation = 'source-over';
    const low = clamp(1 - Math.abs(dir.y)), cS = dir.x * (.4 + low * 1.1), dS = -(.1 + low * .12), y0 = feet.y;
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = L.shadowA; c.filter = `blur(${Math.max(1.5, 4 * zc)}px)`;
    c.setTransform(1, 0, cS, dS, -cS * y0, y0 - dS * y0); region(c, TMP); c.restore();
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.filter = `blur(${Math.max(1.5, 4 * zc)}px)`; c.globalAlpha = Math.min(.6, L.shadowA * 1.5);
    ell(c, feet.x, feet.y + 2 * zc, (opt.foot || 70) * zc, 10 * zc); c.fillStyle = mixCol(L.shade, '#000000', .55); c.fill(); c.restore();
  }
  if (opt.silhouette) { fgc.globalCompositeOperation = 'source-in'; fgc.fillStyle = opt.silhouette; fgc.fillRect(bx, by, bw, bh); fgc.globalCompositeOperation = 'source-over'; c.save(); c.setTransform(1, 0, 0, 1, 0, 0); region(c, FIG); c.restore(); return; }
  fgc.globalCompositeOperation = 'source-atop'; fgc.fillStyle = L.tint; fgc.fillRect(bx, by, bw, bh);
  if (opt.warm) { fgc.fillStyle = rad(fgc, opt.warm[0], opt.warm[1], 0, opt.warm[2], [[0, `rgba(${opt.warm[3]},${opt.warm[4]})`], [1, `rgba(${opt.warm[3]},0)`]]); fgc.fillRect(bx, by, bw, bh); }
  fgc.globalCompositeOperation = 'source-over';
  const rp = Math.max(1.5, 4.5 * zc);
  tpc.globalCompositeOperation = 'source-over'; tpc.clearRect(bx, by, bw, bh); region(tpc, FIG);
  tpc.globalCompositeOperation = 'destination-out'; region(tpc, FIG, -dir.x * rp, -dir.y * rp);
  tpc.globalCompositeOperation = 'source-in'; tpc.fillStyle = `rgb(${L.rim})`; tpc.fillRect(bx, by, bw, bh); tpc.globalCompositeOperation = 'source-over';
  fgc.globalCompositeOperation = 'source-atop'; fgc.globalAlpha = L.rimA; region(fgc, TMP); fgc.globalAlpha = 1; fgc.globalCompositeOperation = 'source-over';
  const R = Math.max(1.4, 3.4 * zc);
  tpc.clearRect(bx, by, bw, bh); for (let k = 0; k < 12; k++) { const a = k / 12 * TAU; region(tpc, FIG, Math.cos(a) * R, Math.sin(a) * R); }
  tpc.globalCompositeOperation = 'source-in'; tpc.fillStyle = L.line; tpc.fillRect(bx, by, bw, bh); tpc.globalCompositeOperation = 'source-over';
  fgc.globalCompositeOperation = 'destination-over'; region(fgc, TMP); fgc.globalCompositeOperation = 'source-over';
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0); if (opt.alpha != null) c.globalAlpha = opt.alpha; region(c, FIG); c.restore();
}

// ---------- the finished frame: glow on the bright parts, vignette, fine grain ----------
const SMALL = mkC(480, 270), smc = SMALL.getContext('2d'), GRAIN = mkC(512, 512);
{ const g = GRAIN.getContext('2d'), im = g.createImageData(512, 512), d = im.data, R = rng(77); for (let i = 0; i < d.length; i += 4) { const v = 128 + (R() - .5) * 90; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; } g.putImageData(im, 0, 0); }
function finish(g, t, bloom = .3) {
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
  smc.clearRect(0, 0, 480, 270); smc.filter = 'brightness(.85) contrast(2.6) blur(5px)'; smc.drawImage(g.canvas, 0, 0, 480, 270); smc.filter = 'none';
  g.globalCompositeOperation = 'screen'; g.globalAlpha = bloom; g.drawImage(SMALL, 0, 0, W, H);
  g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; g.fillStyle = rad(g, 960, 540, 380, 1250, [[0, 'rgba(10,6,20,0)'], [1, 'rgba(10,6,20,.5)']]); g.fillRect(0, 0, W, H);
  g.globalCompositeOperation = 'overlay'; g.globalAlpha = .07; const n = Math.floor(t * 30), ox = (n * 137) % 512, oy = (n * 311) % 512;
  g.fillStyle = g.createPattern(GRAIN, 'repeat'); g.translate(-ox, -oy); g.fillRect(ox, oy, W, H);
  g.restore();
}
