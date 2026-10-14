// The cartoon's look: cinematic light, the illustrated drawing style and a little acting, laid over the drawing code
// in chars.js, world.js and scenes.js without changing it. Loaded last; cartoon.html calls LOOK.frame() before each
// frame, LOOK.page(i, camera) before each page and LOOK.finish(g) at the end. ?classic in the URL turns it all off.
//
// - Drawing: every filled shape (fillStroke) gets a painted shadow on the side away from the light, a highlight on the
//   side toward it and a thin line in a darker shade of its own colour; limbs are tapered; each character gets one
//   thick dark outline. Faces are drawn from numbers (smile, brows, eye size, mouth open) that blend when the mood
//   changes, instead of switching in one frame.
// - Light: each page has a light (where its sun, fire or glow is). Characters are tinted for the scene, get a rim of
//   light on the side facing it and cast a long soft shadow away from it. Far hills are hazy, close-ups blur the
//   background, sunny pages get sun rays, and the finished frame gets a soft glow and fine grain.
// - Acting: walkers lean into the walk and settle (with a little overshoot) when they stop, standing characters
//   breathe, a character bounces slightly when their mood changes and sways a little while talking.
const LOOK = { on: !location.search.includes('classic') };

// ---------- each page's light ----------
// sun: where the light is, in the page's own coordinates; rim / hi / shade: colours of the lit edge, the painted
// highlights and shadows; tint: laid over characters; shadowA: how dark cast shadows are; haze: the far-hill colour.
const DAY = { rim: '255,246,214', rimA: .7, tint: 'rgba(60,80,150,.05)', shade: '#4a5a9a', hi: '#fffbe8', shadowA: .32, haze: '200,228,255', rays: true, line: '#2a1626' };
const LIGHTS = [
  { ...DAY, sun: [960, 520], rim: '255,214,150', tint: 'rgba(120,60,80,.08)', shade: '#7a4a6a', hi: '#fff2d0', haze: '255,205,175' },   // 00 title, sunset
  { ...DAY, sun: [1500, 160], rim: '240,236,225', rimA: .35, tint: 'rgba(80,80,90,.07)', shade: '#6a6a78', hi: '#ffffff', shadowA: .2, haze: '222,216,204', rays: false, line: '#3a3438' },   // 01 gray Kansas
  { ...DAY, sun: [700, -200], rim: '190,200,235', rimA: .5, tint: 'rgba(30,30,60,.22)', shade: '#2a2a48', hi: '#c8d0e8', shadowA: .18, haze: '110,110,125', rays: false },   // 02 cyclone
  { ...DAY, sun: [260, 120] },   // 03 landing in colour
  { ...DAY, sun: [900, 0], rim: '255,240,250', tint: 'rgba(70,80,170,.06)' },   // 04 Glinda
  { ...DAY, sun: [1600, 200], rim: '255,226,160', rimA: .75, tint: 'rgba(120,70,60,.05)', shade: '#7a5068', hi: '#fff2cc', haze: '255,225,190' },   // 05 cornfield
  { ...DAY, sun: [960, 0], rim: '245,255,210', tint: 'rgba(40,90,60,.05)', shade: '#3f6a5a', haze: '215,240,210', rays: false },   // 06 forest (has its own rays)
  { ...DAY, sun: [1300, 100], tint: 'rgba(40,90,60,.04)', shade: '#4a6a5a', haze: '215,240,210' },   // 07 the Lion
  { ...DAY, sun: [260, 120] },   // 08 the road
  { ...DAY, sun: [960, 360], rim: '170,255,200', rimA: .8, tint: 'rgba(10,60,30,.2)', shade: '#14402a', hi: '#d0ffe0', shadowA: .28, haze: '100,200,140', rays: false },   // 09 throne room
  { ...DAY, sun: [1500, 600], rim: '255,170,170', rimA: .75, tint: 'rgba(70,40,110,.18)', shade: '#3a2a6a', hi: '#ffd0d8', shadowA: .28, haze: '200,150,200', rays: false },   // 10 dusk, the castle
  { ...DAY, sun: [1680, 740], rim: '255,170,90', rimA: .85, tint: 'rgba(60,30,20,.2)', shade: '#4a2a28', hi: '#ffe0b0', shadowA: .34, haze: '180,140,110', rays: false },   // 11 by the fire
  { ...DAY, sun: [960, -150], rim: '190,255,210', rimA: .6, tint: 'rgba(10,60,30,.16)', shade: '#1a4a30', hi: '#e0ffe8', shadowA: .28, rays: false },   // 12 behind the screen
  { ...DAY, sun: [260, 120] },   // 13 click, click, click
  { ...DAY, sun: [300, 140] },   // 14 home
];
let PAGE_L = LIGHTS[3], CAM_M = new DOMMatrix(), SCENE_DIR = { x: .7, y: -.7 };
LOOK.page = (i, cam) => {
  PAGE_L = LIGHTS[i] || DAY; CAM_M = cam;
  const s = cam.transformPoint(new DOMPoint(...PAGE_L.sun)); SCENE_DIR = unit(s.x - 960, s.y - 540);
  LOOK.dir = SCENE_DIR; LOOK.blurred = false;
};
LOOK.light = (l, cam) => {   // any light (an object like those in LIGHTS) for the current shot (used by the remake)
  PAGE_L = { ...DAY, ...l }; CAM_M = cam;
  const s = cam.transformPoint(new DOMPoint(...PAGE_L.sun)); SCENE_DIR = unit(s.x - 960, s.y - 540);
  LOOK.dir = SCENE_DIR; LOOK.blurred = false;
};
const unit = (x, y) => { const l = Math.hypot(x, y) || 1; return { x: x / l, y: y / l }; };
LOOK.dir = SCENE_DIR;

// ---------- colours ----------
function rgbOf(col) {
  if (typeof col !== 'string') return null;
  let m = col.match(/^#([0-9a-f]{6})$/i); if (m) { const n = parseInt(m[1], 16); return [n >> 16, (n >> 8) & 255, n & 255, 1]; }
  m = col.match(/^#([0-9a-f]{3})$/i); if (m) return [...m[1]].map(h => parseInt(h + h, 16)).concat(1);
  m = col.match(/^rgba?\(([^)]+)\)$/); if (m) { const v = m[1].split(',').map(Number); return [v[0], v[1], v[2], v[3] ?? 1]; }
  return null;
}
const mixCol = (a, b, k) => { const A = rgbOf(a), B = rgbOf(b); return `rgba(${[0, 1, 2].map(i => Math.round(lerp(A[i], B[i], k))).join(',')},${A[3]})`; };

// ---------- recording paths, so a shape can be shaded after it is built ----------
{ const P = CanvasRenderingContext2D.prototype, begin = P.beginPath;
  P.beginPath = function () { this.__p = new Path2D(); return begin.call(this); };
  for (const m of ['moveTo', 'lineTo', 'quadraticCurveTo', 'bezierCurveTo', 'arc', 'arcTo', 'ellipse', 'rect', 'roundRect', 'closePath']) {
    const o = P[m]; P[m] = function (...a) { if (this.__p) try { this.__p[m](...a); } catch (e) {} return o.apply(this, a); }; } }

// ---------- the illustrated drawing ----------
const _fillStroke = fillStroke, _limb = limb, _eyes = eyes, _mouth = mouth, _put = put, _sun = sun, _hills = hills, _shadow = shadow;
const BIG = (() => { const q = new Path2D(); q.rect(-6000, -6000, 12000, 12000); return q; })();
function paint(c, path, fill, w) {
  c.fillStyle = fill; c.fill(path);
  const rgb = rgbOf(fill), L = PAGE_L;
  const shade = rgb ? mixCol(fill, L.shade, .34) : 'rgba(40,25,70,.26)', hi = rgb ? mixCol(fill, L.hi, .3) : 'rgba(255,248,230,.2)';
  // the light's direction, from the screen into this shape's own coordinates
  const m = c.getTransform(), det = m.a * m.d - m.b * m.c || 1, d = LOOK.dir;
  const v = unit((m.d * d.x - m.c * d.y) / det, (-m.b * d.x + m.a * d.y) / det);
  c.save(); c.clip(path);
  let q = new Path2D(BIG); q.addPath(path, new DOMMatrix().translate(v.x * 7, v.y * 7)); c.fillStyle = shade; c.fill(q, 'evenodd');
  q = new Path2D(BIG); q.addPath(path, new DOMMatrix().translate(-v.x * 3, -v.y * 3)); c.fillStyle = hi; c.fill(q, 'evenodd');
  c.restore();
  c.lineWidth = Math.max(1.6, w * .5); c.strokeStyle = rgb ? mixCol(fill, '#2a1420', .55) : INK; c.lineJoin = 'round'; c.lineCap = 'round'; c.stroke(path);
}
fillStroke = (c, fill, w = 4) => LOOK.on && c.__p ? paint(c, c.__p, fill, w) : _fillStroke(c, fill, w);
// a limb as one smooth shape that tapers toward the hand or foot
limb = (c, x, y, len, a, w, fill, bend = 0) => {
  if (!LOOK.on) return _limb(c, x, y, len, a, w, fill, bend);
  const d1 = [Math.sin(a), Math.cos(a)], d2 = [Math.sin(a + bend), Math.cos(a + bend)], n1 = [d1[1], -d1[0]], n2 = [d2[1], -d2[0]];
  const nk = unit(n1[0] + n2[0], n1[1] + n2[1]), k = [x + d1[0] * len / 2, y + d1[1] * len / 2], e = [k[0] + d2[0] * len / 2, k[1] + d2[1] * len / 2];
  const w0 = w / 2 + 3, wk = w / 2 + 2.6, w1 = w / 2 + 2, an = v => Math.atan2(v[1], v[0]), p = new Path2D();
  p.moveTo(x + n1[0] * w0, y + n1[1] * w0); p.quadraticCurveTo(k[0] + nk.x * wk * 1.15, k[1] + nk.y * wk * 1.15, e[0] + n2[0] * w1, e[1] + n2[1] * w1);
  p.arc(e[0], e[1], w1, an(n2), an(n2) + Math.PI);
  p.quadraticCurveTo(k[0] - nk.x * wk * 1.15, k[1] - nk.y * wk * 1.15, x - n1[0] * w0, y - n1[1] * w0);
  p.arc(x, y, w0, an(n1) + Math.PI, an(n1) + 2 * Math.PI); p.closePath();
  paint(c, p, fill, 4);
  return e;
};
shadow = (c, w) => { if (!LOOK.on) _shadow(c, w); };   // the light casts the shadows now

// faces from numbers: each mood is a set of numbers, and a change of mood slides from one set to the next
const MOODS = { calm: { smile: .55, brow: 0, big: 0, open: 0, lid: 0, look: 0 }, happy: { smile: 1, brow: -.1, big: .1, open: .15, lid: .12, look: 0 },
  sad: { smile: -.75, brow: 1, big: 0, open: 0, lid: .32, look: .55 }, wow: { smile: .1, brow: .55, big: .9, open: .65, lid: 0, look: 0 } };
const faceOf = p => p.__face || MOODS[p.mood] || MOODS.calm;
eyes = (c, x, y, gap, r, p, look = 4) => {
  if (!LOOK.on) return _eyes(c, x, y, gap, r, p, look);
  const f = faceOf(p), big = f.big, lid = clamp(Math.max(f.lid, p.blink > .5 ? 1 : 0));
  for (const s of [-1, 1]) {
    const ex = x + s * gap, rx = r * .64 * (1 + big * .16), ry = r * .78 * (1 + big * .2), eye = new Path2D(); eye.ellipse(ex, y, rx, ry, 0, 0, TAU);
    c.fillStyle = '#fffaf2'; c.fill(eye); c.save(); c.clip(eye);
    const px = ex + look * .6, py = y + 1 + f.look * r * .35;
    ell(c, px, py, r * .42, r * .52); c.fillStyle = '#5a3418'; c.fill(); ell(c, px, py, r * .27, r * .34); c.fillStyle = '#160c06'; c.fill();
    ell(c, px + r * .14, py - r * .18, r * .13, r * .13); c.fillStyle = '#fff'; c.fill();
    if (lid > 0) { c.fillStyle = '#e8b896'; c.fillRect(ex - r, y - ry - 1, r * 2, ry * 2 * lid + 1); c.beginPath(); c.moveTo(ex - r, y - ry + ry * 2 * lid); c.lineTo(ex + r, y - ry + ry * 2 * lid); ink(c, 3.5); c.stroke(); }
    c.restore(); c.lineWidth = 2.4; c.strokeStyle = INK; c.stroke(eye);
    if (Math.abs(f.brow) > .12) { const y0 = y - ry - r * .45 - big * 3, lift = f.brow * r * .35, inner = s < 0 ? 1 : -1;   // inner ends are between the eyes
      c.beginPath(); c.moveTo(ex - r * .7, y0 + (inner > 0 ? 0 : -lift)); c.quadraticCurveTo(ex, y0 - r * .2, ex + r * .7, y0 + (inner > 0 ? -lift : 0)); ink(c, 4); c.stroke(); }
  }
};
mouth = (c, x, y, w, p) => {
  if (!LOOK.on) return _mouth(c, x, y, w, p);
  const f = faceOf(p), sm = f.smile, op = Math.max(f.open, (p.mouth || 0) * .9);
  const curve = q => { q.moveTo(x - w, y - sm * w * .4); q.quadraticCurveTo(x, y + sm * w * 1.1, x + w, y - sm * w * .4); };
  if (op > .06) {   // open (talking, or surprised): a soft rounded mouth; the feeling shows in the eyes and brows
    const rx = w * (.42 + .12 * Math.max(0, sm)), ry = w * (.18 + op * .55), m = new Path2D(); m.ellipse(x, y + ry * .6, rx, ry, 0, 0, TAU);
    c.fillStyle = '#8a2b2b'; c.fill(m); c.save(); c.clip(m); ell(c, x, y + ry * 1.35, rx * .8, ry * .55); c.fillStyle = '#e8707e'; c.fill(); c.restore();
    c.lineWidth = 2.6; c.strokeStyle = INK; c.stroke(m); }
  else { const m = new Path2D(); curve(m); c.lineWidth = 3.4; c.strokeStyle = INK; c.lineCap = 'round'; c.stroke(m); }
};

// ---------- depth in the scenery ----------
hills = (c, off, base, amp, col, k) => {
  _hills(c, off, base, amp, col, k); if (!LOOK.on || !c.__p) return;
  const a = clamp((790 - base) / 260) * .42; if (a <= 0) return;   // the farther the hill, the more it fades into the air
  c.save(); c.clip(c.__p); c.fillStyle = `rgba(${PAGE_L.haze},${a})`; c.fillRect(-500, 0, W + 1000, H); c.restore();
};
sun = (c, x, y, r, col) => {
  _sun(c, x, y, r, col); if (!LOOK.on || !PAGE_L.rays) return;
  c.save(); c.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 16; i++) { const ang = i / 16 * TAU + (LOOK.t || 0) * .02 + Math.sin(i * 7.3) * .25, wd = .03 + (i % 3) * .022;
    c.beginPath(); c.moveTo(x, y); c.arc(x, y, 1800, ang - wd, ang + wd); c.closePath(); c.fillStyle = rad(c, x, y, 30, 1500, [[0, 'rgba(255,240,200,.07)'], [1, 'rgba(255,240,200,0)']]); c.fill(); }
  c.restore();
};

// ---------- characters: drawn on their own layer, lit, outlined, then laid into the scene ----------
const mkC = () => { const o = document.createElement('canvas'); o.width = W; o.height = H; return o; };
const FIG = mkC(), TMP = mkC(), fgc = FIG.getContext('2d'), tpc = TMP.getContext('2d');
const STATE = new Map(), CID = new WeakMap(); let COUNT = {};
LOOK.frame = t => { COUNT = {}; LOOK.t = t; };
const NO_LEAN = new Set(['lion', 'toto', 'munchkin']);
function actor(c, fn, p, t, y) {   // acting, from a little state kept per character between frames
  if (!CID.has(c.canvas)) CID.set(c.canvas, CID.size = (CID.size || 0) + 1);
  const name = fn.name, n = COUNT[name] = (COUNT[name] || 0) + 1, key = CID.get(c.canvas) + name + n;
  let st = STATE.get(key); const dt = st ? t - st.t : 0;
  const walking = p.ph != null && (p.walk ?? 1) > .05 && !NO_LEAN.has(name), target = walking ? .05 * (p.walk ?? 1) : 0;
  const mood = (CUE.mood[name] || p.mood || 'calm');
  if (!st || dt < 0 || dt > .3) st = { t, lean: target, v: 0, mood, from: MOODS[mood] || MOODS.calm, at: -9 };
  for (let k = 0, steps = Math.round(dt * 240); k < steps; k++) { st.v += (80 * (target - st.lean) - 6.5 * st.v) / 240; st.lean += st.v / 240; }
  if (mood !== st.mood) { st.from = blendFace(st, t); st.mood = mood; st.at = t; }
  st.t = t; STATE.set(key, st);
  const since = t - st.at, pop = since < 1.2 ? .045 * Math.exp(-since * 5) * Math.sin(since * 17) : 0;
  const talk = SPEAK.who === name ? Math.sin(t * 6.5) * .014 * SPEAK.amp : 0, breath = walking ? 0 : Math.sin(t * 2.3 + n) * .008;
  return { lean: NO_LEAN.has(name) ? 0 : st.lean + talk, sy: 1 + pop + breath, sx: 1 - pop * .5, face: blendFace(st, t) };
}
function blendFace(st, t) {
  const to = MOODS[st.mood] || MOODS.calm, k = ease((t - st.at) / .35);
  return Object.fromEntries(Object.keys(to).map(n => [n, lerp(st.from[n], to[n], k)]));
}
put = (c, fn, x, y, s, p, t, flip = false) => {
  if (!LOOK.on || !c.canvas || c.canvas.width !== W) return _put(c, fn, x, y, s, p, t, flip);
  const M = c.getTransform(), feet = M.transformPoint(new DOMPoint(x, y)), zc = Math.hypot(M.a, M.b) * s;
  // close shots: blur what is behind the first character (shallow focus)
  if (!LOOK.blurred && typeof CAM_Z !== 'undefined' && CAM_Z > 1.45) { LOOK.blurred = true;
    tpc.setTransform(1, 0, 0, 1, 0, 0); tpc.clearRect(0, 0, W, H); tpc.drawImage(c.canvas, 0, 0);
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.filter = `blur(${Math.min(7, (CAM_Z - 1.35) * 5)}px)`; c.drawImage(TMP, 0, 0); c.restore(); }
  const bx = Math.max(0, Math.floor(feet.x - 400 * zc)), by = Math.max(0, Math.floor(feet.y - 640 * zc)), bw = Math.min(W, Math.ceil(feet.x + 400 * zc)) - bx, bh = Math.min(H, Math.ceil(feet.y + 90 * zc)) - by;
  if (bw <= 0 || bh <= 0) return;
  if (window.CHECK) CHECK.push({ who: fn.name + (COUNT[fn.name] || 0), x, flip, walk: p.walk ?? (p.ph != null ? 1 : 0), ph: p.ph });   // for the walk check
  const A = actor(c, fn, p, t, y);
  // the light's direction from this character's head
  const sunD = CAM_M.transformPoint(new DOMPoint(...PAGE_L.sun)), dir = unit(sunD.x - feet.x, sunD.y - (feet.y - 250 * zc));
  // clear the whole layers, not just this box: smoothing reads a pixel past the box edge, and a leftover piece of the
  // last character there would show as a thin line
  fgc.setTransform(1, 0, 0, 1, 0, 0); fgc.clearRect(0, 0, W, H); tpc.setTransform(1, 0, 0, 1, 0, 0); tpc.clearRect(0, 0, W, H);
  fgc.setTransform(M); fgc.translate(x, y); fgc.scale(flip ? -s : s, s); fgc.rotate(A.lean); fgc.scale(A.sx, A.sy);
  const keepDir = LOOK.dir, keepZ = LOOK.zc; LOOK.dir = dir; LOOK.zc = Math.hypot(M.a, M.b) * s;
  fn(fgc, { ...p, __face: A.face }, t);
  LOOK.dir = keepDir; LOOK.zc = keepZ; fgc.setTransform(1, 0, 0, 1, 0, 0);
  const L = PAGE_L, region = (ctx, img, dx = 0, dy = 0) => ctx.drawImage(img, bx, by, bw, bh, bx + dx, by + dy, bw, bh);
  // the long soft shadow, cast on the ground away from the light (only for those standing on the ground)
  if (y >= 760 && fn !== glinda) {
    tpc.globalCompositeOperation = 'source-over'; tpc.clearRect(bx, by, bw, bh); region(tpc, FIG);
    tpc.globalCompositeOperation = 'source-in'; tpc.fillStyle = mixCol(L.shade, '#000000', .5); tpc.fillRect(bx, by, bw, bh); tpc.globalCompositeOperation = 'source-over';
    const low = clamp(1 - Math.abs(dir.y)), cS = dir.x * (.4 + low * 1.1), dS = -(.1 + low * .12), y0 = feet.y;
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = L.shadowA; c.filter = `blur(${Math.max(1.5, 4 * zc)}px)`;
    c.setTransform(1, 0, cS, dS, -cS * y0, y0 - dS * y0); region(c, TMP); c.restore();
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.filter = `blur(${Math.max(1.5, 4 * zc)}px)`; c.globalAlpha = Math.min(.6, L.shadowA * 1.5);
    ell(c, feet.x, feet.y + 2 * zc, 70 * zc * (fn === toto || fn === munchkin ? .55 : fn === lion ? 2 : 1), 10 * zc); c.fillStyle = mixCol(L.shade, '#000000', .55); c.fill(); c.restore();
  }
  // the scene's tint, and the rim of light on the edge facing it
  fgc.globalCompositeOperation = 'source-atop'; fgc.fillStyle = L.tint; fgc.fillRect(bx, by, bw, bh); fgc.globalCompositeOperation = 'source-over';
  const rp = Math.max(1.5, 4.5 * zc);
  tpc.globalCompositeOperation = 'source-over'; tpc.clearRect(bx, by, bw, bh); region(tpc, FIG);
  tpc.globalCompositeOperation = 'destination-out'; region(tpc, FIG, -dir.x * rp, -dir.y * rp);
  tpc.globalCompositeOperation = 'source-in'; tpc.fillStyle = `rgb(${L.rim})`; tpc.fillRect(bx, by, bw, bh); tpc.globalCompositeOperation = 'source-over';
  fgc.globalCompositeOperation = 'source-atop'; fgc.globalAlpha = L.rimA; region(fgc, TMP); fgc.globalAlpha = 1; fgc.globalCompositeOperation = 'source-over';
  // one thick dark outline round the whole figure
  const R = Math.max(1.4, 3.4 * zc);
  tpc.clearRect(bx, by, bw, bh); for (let k = 0; k < 12; k++) { const a = k / 12 * TAU; region(tpc, FIG, Math.cos(a) * R, Math.sin(a) * R); }
  tpc.globalCompositeOperation = 'source-in'; tpc.fillStyle = L.line; tpc.fillRect(bx, by, bw, bh); tpc.globalCompositeOperation = 'source-over';
  fgc.globalCompositeOperation = 'destination-over'; region(fgc, TMP); fgc.globalCompositeOperation = 'source-over';
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0); region(c, FIG); c.restore();
};

// ---------- the finished frame: a soft glow on the bright parts and fine grain ----------
const SMALL = document.createElement('canvas'); SMALL.width = 480; SMALL.height = 270; const smc = SMALL.getContext('2d');
const GRAIN = document.createElement('canvas'); GRAIN.width = GRAIN.height = 512;
{ const g = GRAIN.getContext('2d'), im = g.createImageData(512, 512), d = im.data, R = rng(77); for (let i = 0; i < d.length; i += 4) { const v = 128 + (R() - .5) * 90; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; } g.putImageData(im, 0, 0); }
LOOK.finish = (g, t) => {
  if (!LOOK.on) return;
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
  smc.clearRect(0, 0, 480, 270); smc.filter = 'brightness(.85) contrast(2.6) blur(5px)'; smc.drawImage(g.canvas, 0, 0, 480, 270); smc.filter = 'none';
  g.globalCompositeOperation = 'screen'; g.globalAlpha = .28; g.drawImage(SMALL, 0, 0, W, H);
  g.globalCompositeOperation = 'overlay'; g.globalAlpha = .07; const n = Math.floor(t * 30), ox = (n * 137) % 512, oy = (n * 311) % 512;
  g.fillStyle = g.createPattern(GRAIN, 'repeat'); g.translate(-ox, -oy); g.fillRect(ox, oy, W, H);
  g.restore();
};
