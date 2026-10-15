// Oz characters, drawn to match the painted book pictures (Baum's 1900 book, not the film).
// Each draw function puts the feet at (0, 0) and faces right. A pose is
// { ph: walk phase, walk: 0..1 (0 = standing), blink, armF / armB: arm angles (0 = hanging down, + = forward),
//   mouth: 0..1 (talking), mood: 'happy' | 'sad' | 'wow', shoes: 'boots' | 'silver', hold: true (Dorothy carries Toto) }.
const INK = '#5b3b24', SKIN = '#ffd9b8';
const TAU = Math.PI * 2;

function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
  t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
// Who is talking right now (set by cartoon.html from the dialogue), and where each character's head was last drawn,
// in scene coordinates, so the camera can frame whoever speaks.
const SPEAK = { who: null, amp: 0 };
// What the script asks of the scene for the current line: a mood per character ({ lion: 'sad' }) and named cues.
const CUE = { mood: {}, on: {} };
let HEADS = {}, CAM_INV = null, CAM_Z = 1;
function live(name, c, p, hx, hy) {
  if (CAM_INV) { const m = c.getTransform(), q = CAM_INV.transformPoint(m.transformPoint(new DOMPoint(hx, hy)));
    HEADS[name] = { x: q.x, y: q.y, s: Math.hypot(m.a, m.b) / CAM_Z }; }
  const on = SPEAK.who === name;
  return { ...p, ...(CUE.mood[name] ? { mood: CUE.mood[name] } : {}), mouth: on ? SPEAK.amp : 0, bark: on ? SPEAK.amp > .2 : false };
}
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ease = x => { x = clamp(x); return x * x * (3 - 2 * x); };
const lerp = (a, b, k) => a + (b - a) * k;

function ink(c, w = 4) { c.lineWidth = w * .72; c.strokeStyle = INK; c.lineJoin = 'round'; c.lineCap = 'round'; }
function fillStroke(c, fill, w = 4) { c.fillStyle = fill; c.fill(); ink(c, w); c.stroke(); }
function ell(c, x, y, rx, ry, rot = 0) { c.beginPath(); c.ellipse(x, y, Math.max(.1, rx), Math.max(.1, ry), rot, 0, TAU); }
function rr(c, x, y, w, h, r) { c.beginPath(); c.roundRect(x, y, w, h, r); }
function lin(c, x0, y0, x1, y1, stops) { const g = c.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, col]) => g.addColorStop(o, col)); return g; }
function rad(c, x, y, r0, r1, stops) { const g = c.createRadialGradient(x, y, r0, x, y, r1); stops.forEach(([o, col]) => g.addColorStop(o, col)); return g; }

// a limb hanging from (x, y), rotated by a (0 = straight down), with a bend at the middle
function limb(c, x, y, len, a, w, fill, bend = 0) {
  const kx = x + Math.sin(a) * len / 2, ky = y + Math.cos(a) * len / 2;
  const ex = kx + Math.sin(a + bend) * len / 2, ey = ky + Math.cos(a + bend) * len / 2;
  c.beginPath(); c.moveTo(x, y); c.lineTo(kx, ky); c.lineTo(ex, ey);
  ink(c); c.lineWidth = w + 6; c.stroke(); c.lineWidth = w; c.strokeStyle = fill; c.stroke();
  return [ex, ey];
}
function hand(c, x, y, r = 11, col = SKIN) { ell(c, x, y, r, r); fillStroke(c, col, 3); }
function shadow(c, w) { c.save(); c.filter = 'blur(6px)'; ell(c, 0, 4, w, 14); c.fillStyle = 'rgba(60,40,10,.25)'; c.fill(); c.restore(); }

function eyes(c, x, y, gap, r, p, look = 4) {
  for (const s of [-1, 1]) {
    const ex = x + s * gap;
    if (p.blink > .5) { c.beginPath(); c.arc(ex, y + 2, r * .8, .15 * Math.PI, .85 * Math.PI); ink(c, 4); c.stroke(); continue; }
    const big = p.mood === 'wow' ? 1.15 : 1;
    ell(c, ex, y, r * .6 * big, r * .74 * big); fillStroke(c, '#fffaf2', 2.5);
    ell(c, ex + look * .6, y + 1, r * .36, r * .46); c.fillStyle = '#3a2412'; c.fill();
    ell(c, ex + look * .6 + r * .12, y - r * .14, r * .1, r * .1); c.fillStyle = '#fff'; c.fill();
    if (p.mood === 'sad') { c.beginPath(); c.moveTo(ex - r, y - r * 1.25 + (s < 0 ? 4 : -4) * -1); c.lineTo(ex + r, y - r * 1.25 + (s < 0 ? -4 : 4) * -1); ink(c, 4); c.stroke(); }
  }
}
function mouth(c, x, y, w, p) {
  const o = p.mouth || 0;
  if (p.mood === 'wow' || o > .05) { ell(c, x, y + 2, w * (p.mood === 'wow' ? .45 : .6), Math.max(3, w * .55 * Math.max(o, p.mood === 'wow' ? .9 : 0))); fillStroke(c, '#8a2b2b', 3); return; }
  c.beginPath();
  if (p.mood === 'sad') c.arc(x, y + w * .9, w, 1.2 * Math.PI, 1.8 * Math.PI); else c.arc(x, y - w * .25, w, .15 * Math.PI, .85 * Math.PI);
  ink(c, 3.5); c.stroke();
}
function cheeks(c, x, y, gap, r) { for (const s of [-1, 1]) { ell(c, x + s * gap, y, r, r * .7); c.fillStyle = rad(c, x + s * gap, y, 0, r, [[0, 'rgba(255,110,110,.55)'], [1, 'rgba(255,110,110,0)']]); c.fill(); } }
function tear(c, x, y, k) { if (k <= 0) return; ell(c, x, y + k * 30, 5, 8); c.fillStyle = 'rgba(120,190,255,.85)'; c.fill(); }

const PATS = {};
function pattern(c, key, size, paint) {
  if (PATS[key]) return PATS[key];
  const p = document.createElement('canvas'); p.width = p.height = size; paint(p.getContext('2d'), size);
  return PATS[key] = c.createPattern(p, 'repeat');
}
const gingham = c => pattern(c, 'gingham', 26, (g, n) => { g.fillStyle = '#fbfdff'; g.fillRect(0, 0, n, n); g.fillStyle = 'rgba(70,120,210,.5)'; g.fillRect(0, 0, n / 2, n); g.fillRect(0, 0, n, n / 2); });
const checks = c => pattern(c, 'checks', 22, (g, n) => { g.fillStyle = '#9a6a3f'; g.fillRect(0, 0, n, n); g.fillStyle = 'rgba(70,40,15,.45)'; g.fillRect(0, 0, n / 2, n); g.fillRect(0, 0, n, n / 2); });

// Every character faces right, turned three-quarters toward us, so in every pose (standing or walking):
//   - the arm on the BACK shoulder (x < 0) is the near arm: it is drawn IN FRONT of the body;
//   - the arm on the FRONT shoulder (x > 0) is the far arm: it is drawn BEHIND the body;
//   - likewise the near leg hangs from the back hip and is drawn over the far leg.
// armB / armF in a pose are the back-shoulder and front-shoulder arms (0 = hanging down, + = forward).
//
// The walk cycle (ph rising as the character goes forward). For legs, s is +1 for the near leg and -1 for the far one;
// for arms and shoulders, s is the side of the body: -1 the back shoulder, +1 the front. Each leg swings forward with
// its knee bent and its foot off the ground, then pushes back straight along the ground; each arm swings against the leg
// on its own side (the near arm against the near leg). While walking the hips and shoulders pull in toward the middle.
function legsPose(p) {
  const w = p.walk ?? 1, sw = Math.sin(p.ph || 0), cw = Math.cos(p.ph || 0);
  return { w, sw, a: sw * w, bob: -(1 - Math.abs(sw)) * w,
    leg: s => s * sw * w, knee: s => -Math.max(0, s * cw) * w, lift: s => Math.max(0, s * cw) * w,
    arm: s => s * sw * w, hip: (s, x, k = .25) => -s * x * lerp(1, k, w), shoulder: (s, x, k = .65) => s * x * lerp(1, k, w) };
}
// the far limbs a little darker, so it reads which leg and arm are which
const FAR = { skin: '#efc29c', stocking: '#e6ddcc' };

function dorothy(c, p, t = 0) {
  p = live('dorothy', c, p, 4, -272);
  const g = legsPose(p), { bob } = g;
  shadow(c, 62);
  c.save(); c.translate(0, bob * 9);
  // carrying Toto: the near arm cradles him from below, the far hand steadies him from behind
  const armB = p.armB ?? (p.hold ? .63 : g.arm(-1) * .55), armF = p.armF ?? (p.hold ? 1.1 : g.arm(1) * .55);
  const shB = p.armB != null || p.hold ? -30 : g.shoulder(-1, 30), shF = p.armF != null || p.hold ? 30 : g.shoulder(1, 30);
  const elbow = a => lerp(-.25, .35 + Math.max(0, a) * .9, g.w);   // walking: elbow back, hand forward
  const [fhx, fhy] = limb(c, shF, -206, 84, armF, 17, FAR.skin, p.hold ? -1.5 : p.armF != null ? -.25 : elbow(armF));
  hand(c, fhx, fhy, 11, FAR.skin);
  for (const s of [-1, 1]) {
    const [fx, fy] = limb(c, g.hip(s, 11), -120, 108, g.leg(s) * .5, 18, s < 0 && g.w ? FAR.stocking : '#fffaf2', g.knee(s) * .9);
    c.save(); c.translate(fx + 8, fy + 2);
    if (p.shoes === 'silver') {
      ell(c, 0, 0, 21, 11); c.fillStyle = lin(c, -20, -10, 20, 10, [[0, '#ffffff'], [.4, '#c9d3e6'], [.7, '#9aa8c4'], [1, '#eef2fa']]); c.fill(); ink(c, 3.5); c.stroke();
      ell(c, 6, -4, 5, 2.5); c.fillStyle = '#fff'; c.fill();
    } else { rr(c, -16, -26, 28, 30, 7); fillStroke(c, '#8a5530', 3.5); ell(c, 2, 0, 21, 10); fillStroke(c, '#7a4826', 3.5); }
    c.restore();
  }
  // pink bonnet hanging down her back
  c.save(); c.translate(-46, -226); c.rotate(.3 + Math.sin(p.ph || t * 2) * .05);
  ell(c, 0, 0, 30, 36); fillStroke(c, lin(c, -30, -30, 30, 30, [[0, '#ffc2d6'], [1, '#f08bb0']]));
  c.beginPath(); c.arc(0, 0, 30, -.4 * Math.PI, .6 * Math.PI); ink(c, 3); c.strokeStyle = '#d65f8a'; c.stroke(); c.restore();
  // gingham pinafore over a white blouse
  const fl = Math.sin((p.ph || 0) * 2) * 4 * (p.walk ?? 1);
  c.beginPath(); c.moveTo(-34, -218); c.quadraticCurveTo(-40, -170, -68 - fl, -112); c.quadraticCurveTo(0, -98, 68 + fl, -112);
  c.quadraticCurveTo(40, -170, 34, -218); c.quadraticCurveTo(0, -230, -34, -218); c.closePath();
  fillStroke(c, gingham(c));
  c.save(); c.clip(); c.fillStyle = lin(c, -60, 0, 60, 0, [[0, 'rgba(30,40,90,.18)'], [.5, 'rgba(255,255,255,.05)'], [1, 'rgba(30,40,90,.2)']]); c.fillRect(-80, -240, 160, 140); c.restore();
  for (const s of [-1, 1]) { ell(c, s * 34, -206, 16, 14); fillStroke(c, '#ffffff', 3); }   // puffed sleeves
  for (const s of [-1, 1]) { c.beginPath(); c.moveTo(0, -214); c.quadraticCurveTo(s * 28, -222, s * 24, -202); c.quadraticCurveTo(s * 12, -198, 0, -206); fillStroke(c, '#fff', 3); }
  if (p.hold) { c.save(); c.translate(40, -150); c.scale(.82, .82); toto(c, { ph: 0, blink: p.blink, sit: true }, t); c.restore(); }
  const [hx, hy] = limb(c, shB, -206, 84, armB, 17, SKIN, p.hold ? .65 : p.armB != null ? -.25 : elbow(armB));
  hand(c, hx, hy);
  if (p.wand) p.wand(c, hx, hy);
  const hyH = -272 + Math.sin((p.ph || 0) * 2) * 1.5;
  c.save(); c.translate(4, hyH);
  const curls = [[-46, -14, 22], [-40, -38, 22], [-20, -54, 24], [6, -58, 24], [30, -50, 22], [46, -30, 20], [-50, 10, 18], [48, -8, 16], [-44, 30, 14]];
  for (const [x, y, r] of curls) { ell(c, x, y, r, r); fillStroke(c, '#8a4b25', 3.5); }
  ell(c, 0, 0, 50, 48); fillStroke(c, rad(c, -10, -12, 4, 60, [[0, '#ffe6cf'], [1, SKIN]]));
  for (const [x, y, r] of [[-30, -38, 17], [-8, -46, 17], [16, -45, 16], [36, -34, 13]]) { ell(c, x, y, r, r); fillStroke(c, lin(c, 0, -60, 0, -20, [[0, '#a8613a'], [1, '#7c3f1d']]), 3); }
  cheeks(c, 4, 14, 30, 13);
  c.fillStyle = '#c98a62'; for (const [x, y] of [[-30, 8], [-24, 13], [-34, 15], [34, 8], [40, 13], [30, 15]]) { ell(c, x + 4, y, 1.8, 1.8); c.fill(); }
  eyes(c, 4, -2, 18, 11, p, 3);
  mouth(c, 8, 20, 10, p);
  tear(c, -14, 10, p.tears || 0);
  c.restore(); c.restore();
}

function toto(c, p, t = 0) {
  p = live('toto', c, p, 34, -62);
  const hop = p.sit ? 0 : Math.abs(Math.sin(p.ph || 0)) * 26 * (p.walk ?? 1), wag = Math.sin((p.ph || t * 3) * 4) * .6;
  if (!p.sit) { c.save(); c.scale(1 - hop / 400, 1); shadow(c, 34); c.restore(); }
  c.save(); c.translate(0, -hop);
  if (!p.sit) for (const [x, k] of [[-22, Math.sin(p.ph || 0) * .5], [18, -Math.sin(p.ph || 0) * .5]]) limb(c, x, -26, 26, k * (p.walk ?? 1), 9, '#1b1712');
  c.save(); c.translate(-36, -42); c.rotate(-.9 + wag); c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(-6, -22, 4, -30); ink(c, 13); c.stroke(); c.lineWidth = 7; c.strokeStyle = '#231e18'; c.stroke(); c.restore();
  // scruffy body with a ragged fringe
  c.beginPath(); c.moveTo(-40, -44); c.quadraticCurveTo(-4, -66, 34, -48);
  for (let i = 0; i <= 8; i++) { const x = 34 - i * 9.25; c.quadraticCurveTo(x - 4, -14 + (i % 2) * 7 + Math.sin(t * 6 + i) * 2, x - 9, -22); }
  c.closePath(); fillStroke(c, lin(c, 0, -66, 0, -16, [[0, '#3a332b'], [1, '#14110d']]), 3.5);
  c.save(); c.translate(34, -62);
  for (const [x, r] of [[-12, -.35], [8, .2]]) { c.beginPath(); c.moveTo(x - 7, -12); c.lineTo(x + Math.sin(r) * 6, -36 + Math.sin(t * 5) * 1.5); c.lineTo(x + 8, -12); c.closePath(); fillStroke(c, '#1d1813', 3); }
  ell(c, 0, 0, 23, 20); fillStroke(c, '#221d17', 3.5);
  for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(-14 + i * 6, -16); c.lineTo(-17 + i * 6, -26); ink(c, 3); c.strokeStyle = '#2c251e'; c.stroke(); }
  ell(c, 18, 6, 10, 7); fillStroke(c, '#2a231c', 3);
  ell(c, 25, 4, 4, 3); c.fillStyle = '#0b0907'; c.fill();
  if (p.blink > .5) { c.beginPath(); c.moveTo(2, -4); c.lineTo(11, -4); ink(c, 3); c.strokeStyle = '#ddd'; c.stroke(); }
  else { ell(c, 6, -4, 5, 6); c.fillStyle = '#fff'; c.fill(); ell(c, 7, -3, 3.6, 4.6); c.fillStyle = '#000'; c.fill(); ell(c, 8, -5, 1.4, 1.4); c.fillStyle = '#fff'; c.fill(); }
  if (p.bark) { ell(c, 18, 16, 7, 6); fillStroke(c, '#8a2b2b', 2); } else { ell(c, 14, 16, 4, 6 + Math.abs(Math.sin(t * 8)) * 2); c.fillStyle = '#ff7b93'; c.fill(); }
  c.restore(); c.restore();
}

function scarecrow(c, p, t = 0) {
  p = live('scarecrow', c, p, 6, -282);
  const g = legsPose(p), { bob } = g, flop = Math.sin((p.ph || t * 2) - .8);
  shadow(c, 64);
  c.save(); c.translate(0, bob * 13);
  const straw = (x, y, ang, n = 6) => { for (let i = 0; i < n; i++) { const q = ang + (i - n / 2) * .22 + Math.sin(t * 3 + i) * .05;
    c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.sin(q) * 24, y + Math.cos(q) * 24); c.lineWidth = 4; c.strokeStyle = i % 2 ? '#e8c254' : '#d4a632'; c.stroke(); } };
  const [fx0, fy0] = limb(c, p.armF != null ? 34 : g.shoulder(1, 34), -222, 96, p.armF ?? (g.arm(1) * .7 + .2 - flop * .25), 16, '#6c94c2', p.bendF ?? .4);
  straw(fx0, fy0, -.2 + flop * .2, 5);
  for (const s of [-1, 1]) {
    const [fx, fy] = limb(c, g.hip(s, 13), -128, 118, g.leg(s) * .62, 20, s < 0 && g.w ? '#76552f' : '#8a6440', g.knee(s) * 1.1);
    straw(fx, fy - 10, Math.PI * .5 * s, 4);
    c.save(); c.translate(fx + 8, fy); rr(c, -16, -18, 34, 22, 9); fillStroke(c, '#6b4428', 3.5); rr(c, -14, -24, 26, 10, 4); fillStroke(c, '#5b8fd1', 3); c.restore();
  }
  // patched blue tunic with a rope belt
  c.beginPath(); c.moveTo(-40, -230); c.quadraticCurveTo(-54, -180, -48, -118); c.quadraticCurveTo(0, -106, 48, -118); c.quadraticCurveTo(54, -180, 40, -230); c.quadraticCurveTo(0, -242, -40, -230);
  fillStroke(c, lin(c, -50, 0, 50, 0, [[0, '#5f88b8'], [.5, '#82a9d4'], [1, '#5b83b2']]));
  rr(c, -30, -176, 22, 20, 4); fillStroke(c, '#c9a36b', 3); rr(c, 14, -146, 18, 16, 3); fillStroke(c, '#a77b4c', 3);
  c.beginPath(); c.moveTo(-46, -132); c.quadraticCurveTo(0, -124, 46, -132); c.lineWidth = 6; c.strokeStyle = '#c9a66b'; c.stroke();
  // the near arm is drawn after the head (below), so a raised near arm is always in front of it
  const nearArm = () => { const [hx, hy] = limb(c, p.armB != null ? -34 : g.shoulder(-1, 34), -222, 96, p.armB ?? (g.arm(-1) * .7 - .2 + flop * .25), 16, '#82a9d4', p.bendB ?? .4);
    if (p.item) p.item(c, hx, hy, t); straw(hx, hy, -.4, 6); };
  straw(0, -234, Math.PI, 8);
  c.save(); c.translate(6, -282 + flop * 3); c.rotate(Math.sin(t * 2.4) * .05 + .04);
  ell(c, 0, 0, 46, 50); fillStroke(c, rad(c, -12, -14, 5, 60, [[0, '#f6e2b8'], [1, '#d9bd88']]));
  c.setLineDash([5, 6]); c.beginPath(); c.moveTo(-40, 26); c.quadraticCurveTo(0, 46, 40, 26); ink(c, 2.5); c.stroke(); c.setLineDash([]);
  cheeks(c, 4, 16, 26, 11);
  if (p.blink > .5) { for (const s of [-1, 1]) { c.beginPath(); c.moveTo(4 + s * 16 - 8, -4); c.lineTo(4 + s * 16 + 8, -4); ink(c, 4); c.stroke(); } }
  else for (const s of [-1, 1]) { ell(c, 6 + s * 16, -4, 7, 9 * (p.mood === 'wow' ? 1.2 : 1)); c.fillStyle = '#23324f'; c.fill(); ell(c, 8 + s * 16, -7, 2.5, 2.5); c.fillStyle = '#fff'; c.fill(); }
  c.beginPath(); c.moveTo(4, 6); c.lineTo(10, 10); c.lineTo(3, 12); ink(c, 3); c.stroke();
  if (p.mouth > .05 || p.mood === 'wow') { ell(c, 6, 22, 10, 4 + 8 * Math.max(p.mouth || 0, p.mood === 'wow' ? .8 : 0)); fillStroke(c, '#8a2b2b', 3); }
  else { c.beginPath(); c.arc(6, 14, 18, .1 * Math.PI, .9 * Math.PI); ink(c, 4); c.strokeStyle = '#b8434b'; c.stroke(); }
  c.save(); c.translate(0, -36); c.rotate(-.06 + Math.sin(t * 2.2 - 1.2) * .08);
  ell(c, 0, 0, 72, 16); fillStroke(c, lin(c, 0, -10, 0, 16, [[0, '#7fb0e0'], [1, '#4f86c4']]));
  c.beginPath(); c.moveTo(-34, -4); c.quadraticCurveTo(-14, -60, 10 + Math.sin(t * 2.2 - 1.6) * 10, -104); c.quadraticCurveTo(18, -60, 34, -4); c.quadraticCurveTo(0, 6, -34, -4);
  fillStroke(c, lin(c, -30, 0, 30, 0, [[0, '#5f97d2'], [.5, '#8fc0ee'], [1, '#538cca']]));
  c.restore(); c.restore(); nearArm(); c.restore();
}

function tinWoodman(c, p, t = 0) {
  p = live('tinWoodman', c, p, 4, -300);
  const g = legsPose(p), { bob } = g, rust = p.rust || 0;
  const tin = (x0, x1) => lin(c, x0, 0, x1, 0, [[0, '#8c97a8'], [.35, '#eef3fa'], [.55, '#c3cddb'], [1, '#7b8698']]);
  const rivet = (x, y) => { ell(c, x, y, 3, 3); c.fillStyle = '#6c778a'; c.fill(); };
  const rusty = () => { if (rust > 0) { c.save(); c.clip(); c.globalAlpha = rust * .55; c.fillStyle = '#b5652e'; c.fillRect(-200, -400, 400, 420); c.restore(); } };
  shadow(c, 62);
  c.save(); c.translate(0, bob * 5);
  // his free arm is the far one, on the front shoulder behind his body; the axe is in his near arm (see below)
  c.save(); c.translate(p.armB != null ? 44 : g.shoulder(1, 44, .5), -232); c.rotate(-(p.armB ?? g.arm(1) * .7)); rr(c, -12, 0, 24, 92, 11); fillStroke(c, tin(-12, 12)); rusty();
  c.fillStyle = 'rgba(40,50,75,.18)'; c.fill(); rivet(0, 46); c.restore();
  for (const s of [-1, 1]) {   // stiff tin legs: no knees, so the swinging leg lifts from the hip
    c.save(); c.translate(g.hip(s, 18), -132 - g.lift(s) * 12); c.rotate(-g.leg(s) * .36); rr(c, -14, 0, 28, 124, 12); fillStroke(c, tin(-14, 14)); rusty();
    if (s < 0 && g.w) { c.fillStyle = 'rgba(40,50,75,.22)'; c.fill(); } rivet(0, 62);
    rr(c, -16, 110, 40, 22, 9); fillStroke(c, tin(-16, 24)); c.restore();
  }
  rr(c, -50, -250, 100, 128, 34); fillStroke(c, tin(-50, 50)); rusty();
  c.save(); rr(c, -50, -250, 100, 128, 34); c.clip(); const gx = ((t * 260) % 900) - 200; c.fillStyle = 'rgba(255,255,255,.55)';
  c.beginPath(); c.moveTo(gx - 60, -260); c.lineTo(gx - 30, -260); c.lineTo(gx - 90, -110); c.lineTo(gx - 120, -110); c.fill(); c.restore();
  for (let i = 0; i < 6; i++) rivet(-40 + i * 16, -236);
  ell(c, 8, -196, 12, 11); fillStroke(c, '#f2b6c4', 3);
  c.save(); c.translate(4, -300 + Math.sin((p.ph || 0) * 2) * 1.2);
  rr(c, -38, -34, 76, 84, 26); fillStroke(c, tin(-38, 38)); rusty();
  cheeks(c, 4, 22, 22, 10);
  eyes(c, 4, 6, 15, 10, p, 2);
  c.beginPath(); c.moveTo(6, 16); c.lineTo(16, 24); c.lineTo(6, 26); ink(c, 3); c.stroke();
  mouth(c, 6, 34, 10, p);
  tear(c, -12, 14, p.tears || 0);
  c.beginPath(); c.moveTo(-34, -30); c.lineTo(34, -30); c.lineTo(10, -70); c.lineTo(-10, -70); c.closePath(); fillStroke(c, tin(-34, 34));
  rr(c, -5, -112, 10, 44, 4); fillStroke(c, tin(-5, 5), 3);
  c.restore();
  // the axe arm: the near arm, on the back shoulder in front of his body (armF is its angle); whatever the arm does,
  // the axe stands up and a little forward from his hand, blade facing forward, clear of his face
  const axeArm = -(p.armF ?? g.arm(-1) * .3) - .9;
  c.save(); c.translate(p.armF != null ? -44 : g.shoulder(-1, 44, .5), -232); c.rotate(axeArm);
  rr(c, -12, 0, 24, 86, 11); fillStroke(c, tin(-12, 12)); rusty();
  if (!p.noAxe) { c.save(); c.translate(0, 86); c.rotate(-2.65 - axeArm); rr(c, -6, -10, 12, 150, 6); fillStroke(c, lin(c, -6, 0, 6, 0, [[0, '#8b5a2b'], [1, '#b47b42']]), 3.5);
    c.beginPath(); c.moveTo(-6, 118); c.quadraticCurveTo(-46, 120, -50, 150); c.quadraticCurveTo(-24, 146, -6, 148); c.closePath(); fillStroke(c, tin(-50, -6), 3.5); c.restore(); }
  ell(c, 0, 86, 13, 13); fillStroke(c, tin(-13, 13), 3); c.restore();
  c.restore();
}

function lion(c, p, t = 0) {
  p = live('lion', c, p, p.sit ? 40 : 150, p.sit ? -260 : -206);
  const w = p.walk ?? 1, sw = Math.sin(p.ph || 0) * w, cw = Math.cos(p.ph || 0) * w, bob = -Math.abs(sw) * 5, sit = p.sit;
  const up = k => sit ? 0 : Math.max(0, k) * 16;   // a paw lifts while it swings forward
  shadow(c, 150);
  c.save(); c.translate(0, bob);
  const gold = lin(c, 0, -230, 0, -60, [[0, '#f7c35b'], [1, '#d99631']]);
  const leg = (x, k, dark, lift = 0) => { c.save(); c.translate(x, -110 - lift); c.rotate(-k); rr(c, -17, 0, 34, 104, 16); fillStroke(c, dark ? '#c98425' : '#e9a944'); ell(c, 4, 104, 22, 12); fillStroke(c, dark ? '#c98425' : '#f2b552', 3.5); c.restore(); };
  if (!sit) { leg(-90, -sw * .45, true, up(-cw)); leg(78, sw * .45, true, up(cw)); }
  const ta = Math.sin(t * 2.4) * .3;
  c.beginPath(); c.moveTo(-130, -150); c.bezierCurveTo(-190, -150 + ta * 40, -200, -230, -170 + ta * 60, -250);
  ink(c, 18); c.stroke(); c.lineWidth = 10; c.strokeStyle = '#e1a03d'; c.stroke();
  ell(c, -170 + ta * 60, -254, 18, 22, ta); fillStroke(c, '#9b5a1e', 3.5);
  if (sit) { ell(c, -40, -120, 120, 90, -.35); fillStroke(c, gold); ell(c, -60, -30, 70, 34); fillStroke(c, '#e9a944'); }
  else { ell(c, -10, -150, 150, 66); fillStroke(c, gold); ell(c, 10, -112, 100, 22); c.fillStyle = 'rgba(255,236,190,.5)'; c.fill(); }
  if (sit) { leg(10, .05, false); leg(60, -.05, false); } else { leg(-60, sw * .45, false, up(cw)); leg(108, -sw * .45, false, up(-cw)); }
  c.save(); c.translate(sit ? 40 : 150, (sit ? -260 : -206) + Math.sin(t * 4) * 2);
  if (p.paw) { c.save(); c.translate(-20, 30); c.rotate(-.6); rr(c, -16, 0, 32, 70, 15); fillStroke(c, '#f2b552'); c.restore(); }
  const n = 20; for (let i = 0; i < n; i++) { const an = i / n * TAU + Math.sin(t * 2 + i) * .02; ell(c, Math.cos(an) * 66, Math.sin(an) * 70, 30, 30); fillStroke(c, i % 2 ? '#b8661f' : '#c97a2a', 3.5); }
  ell(c, 0, 0, 72, 74); c.fillStyle = '#c4732a'; c.fill();
  for (const s of [-1, 1]) { ell(c, s * 42, -50, 16, 16); fillStroke(c, '#f2b552', 3.5); ell(c, s * 42, -50, 7, 7); c.fillStyle = '#d9824e'; c.fill(); }
  ell(c, 0, 4, 58, 56); fillStroke(c, rad(c, -10, -10, 5, 70, [[0, '#ffd77e'], [1, '#f0b14a']]));
  cheeks(c, 0, 20, 34, 13);
  if (p.mood !== 'happy') for (const s of [-1, 1]) { c.beginPath(); c.moveTo(s * 32, -28); c.quadraticCurveTo(s * 20, -36, s * 8, -40); ink(c, 5); c.stroke(); }
  eyes(c, 2, -12, 21, 12, { ...p, mood: p.mood === 'sad' ? null : p.mood }, 2);
  ell(c, -13, 26, 18, 14); fillStroke(c, '#fff3d9', 3); ell(c, 15, 26, 18, 14); fillStroke(c, '#fff3d9', 3);
  c.beginPath(); c.moveTo(-10, 10); c.lineTo(12, 10); c.lineTo(1, 22); c.closePath(); fillStroke(c, '#6b3a22', 3);
  if (SPEAK.who === 'lion' && SPEAK.roar) p = { ...p, roar: Math.max(.4, SPEAK.amp) };
  if (p.roar) { ell(c, 1, 48, 24, 20 * p.roar); fillStroke(c, '#8a2b2b', 3); for (const s of [-1, 1]) { c.beginPath(); c.moveTo(s * 14, 34); c.lineTo(s * 10, 44); c.lineTo(s * 6, 34); fillStroke(c, '#fff', 2); } }
  else mouth(c, 1, 46, 10, { ...p, mood: p.mood === 'happy' ? 'happy' : 'sad' });
  for (const s of [-1, 1]) tear(c, s * 26, 2, p.tears || 0);
  c.restore(); c.restore();
}

function glinda(c, p, t = 0) {
  p = live('glinda', c, p, 0, -292);
  const fl = Math.sin(t * 1.6) * 6;
  c.save(); c.translate(0, fl);
  // long red hair behind
  c.beginPath(); c.moveTo(-50, -330); c.bezierCurveTo(-90, -250, -70, -200, -86 + Math.sin(t * 2) * 6, -150); c.lineTo(80 + Math.sin(t * 2 + 1) * 6, -150); c.bezierCurveTo(70, -220, 90, -260, 50, -330); c.closePath();
  fillStroke(c, lin(c, 0, -340, 0, -150, [[0, '#d9552e'], [1, '#b8401f']]));
  const [hx, hy] = limb(c, 26, -236, 90, p.armF ?? 1.6 + Math.sin(t * 2) * .1, 16, '#eef0f7', p.bendF ?? .2);
  // flowing white gown
  c.beginPath(); c.moveTo(-30, -250); c.bezierCurveTo(-60, -160, -110, -60, -120 + Math.sin(t * 2) * 8, 0); c.quadraticCurveTo(0, 22, 120 + Math.sin(t * 2 + 1) * 8, 0); c.bezierCurveTo(110, -60, 60, -160, 30, -250); c.closePath();
  fillStroke(c, lin(c, -100, 0, 100, 0, [[0, '#e8ecf6'], [.45, '#ffffff'], [1, '#dfe4f2']]));
  c.save(); c.clip(); c.strokeStyle = 'rgba(170,180,210,.5)'; c.lineWidth = 3; for (let i = -3; i <= 3; i++) { c.beginPath(); c.moveTo(i * 8, -230); c.quadraticCurveTo(i * 22, -120, i * 34, 10); c.stroke(); } c.restore();
  hand(c, hx, hy, 10);
  // star wand
  c.save(); c.translate(hx, hy); c.rotate(-.5); c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -80); c.lineWidth = 5; c.strokeStyle = '#c9d3e6'; c.stroke();
  c.translate(0, -88); c.rotate(t); c.beginPath(); for (let i = 0; i < 10; i++) { const r = i % 2 ? 7 : 18; c.lineTo(Math.cos(i * Math.PI / 5) * r, Math.sin(i * Math.PI / 5) * r); } c.closePath(); fillStroke(c, '#fff6b0', 3);
  if (!(typeof LOOK !== 'undefined' && LOOK.on)) { c.fillStyle = 'rgba(255,250,200,.35)'; ell(c, 0, 0, 34 + Math.sin(t * 5) * 4, 34 + Math.sin(t * 5) * 4); c.fill(); }   // the look draws a glow in the scene instead (a see-through glow would get the dark outline)
  c.restore();
  c.save(); c.translate(0, -292);
  ell(c, 0, 0, 44, 46); fillStroke(c, rad(c, -8, -10, 4, 56, [[0, '#fff0e2'], [1, '#ffd9c2']]));
  c.beginPath(); c.moveTo(-46, -6); c.quadraticCurveTo(-40, -60, 0, -54); c.quadraticCurveTo(44, -60, 46, -6); c.quadraticCurveTo(20, -36, -46, -6); fillStroke(c, '#d9552e', 3);
  cheeks(c, 0, 14, 26, 11);
  for (const s of [-1, 1]) { if (p.blink > .5) { c.beginPath(); c.arc(s * 16, 0, 7, .15 * Math.PI, .85 * Math.PI); ink(c, 3); c.stroke(); }
    else { ell(c, s * 16, -2, 7, 9); fillStroke(c, '#fff', 2.5); ell(c, s * 16 + 1, 0, 5, 6); c.fillStyle = '#3c78c8'; c.fill(); ell(c, s * 16 + 2, -2, 1.8, 1.8); c.fillStyle = '#fff'; c.fill(); } }
  mouth(c, 0, 20, 9, p);
  c.restore();
  { const [nx, ny] = limb(c, -26, -236, 90, p.armB ?? -.2, 16, '#fff', p.bendB ?? .1); if (p.item) p.item(c, nx, ny, t); hand(c, nx, ny, 10); }   // near arm, in front
  c.restore();
}

function witch(c, p, t = 0) {
  p = live('witch', c, p, 4, -262);
  const melt = p.melt || 0;
  c.save();
  if (melt > 0) { // a purple puddle grows as she sinks into it
    ell(c, 0, 0, 40 + melt * 150, 10 + melt * 22); fillStroke(c, lin(c, 0, -20, 0, 30, [[0, '#b58ee0'], [1, '#7a52b0']]), 3);
    c.beginPath(); c.rect(-300, -600, 600, 600); c.clip(); c.translate(0, melt * 330); c.scale(1 + melt * .3, 1 - melt * .2);
  }
  shadow(c, 60);
  // striped umbrella in her far hand (front shoulder, behind her dress)
  const [hx, hy] = limb(c, 26, -206, 86, p.armF ?? .6, 15, '#7a4cb0', p.bendF ?? .4);
  c.save(); c.translate(hx, hy); c.rotate(-.3); c.beginPath(); c.moveTo(0, 0); c.lineTo(0, 120); c.lineWidth = 5; c.strokeStyle = '#5a3a1e'; c.stroke();
  c.beginPath(); c.moveTo(-18, 10); c.lineTo(0, 100); c.lineTo(18, 10); c.closePath(); fillStroke(c, '#c95fa0', 3);
  c.beginPath(); c.moveTo(-6, 10); c.lineTo(0, 100); c.lineTo(6, 10); c.closePath(); c.fillStyle = '#ffe36b'; c.fill(); c.restore();
  hand(c, hx, hy, 10, '#e9e2c9');
  // patched purple dress
  c.beginPath(); c.moveTo(-30, -220); c.quadraticCurveTo(-60, -110, -78, 0); c.quadraticCurveTo(0, 14, 78, 0); c.quadraticCurveTo(60, -110, 30, -220); c.closePath();
  fillStroke(c, lin(c, -70, 0, 70, 0, [[0, '#6a3f9a'], [.5, '#8c5cc4'], [1, '#633a92']]));
  rr(c, -36, -90, 26, 24, 4); fillStroke(c, '#b08ad6', 3); rr(c, 20, -60, 22, 20, 4); fillStroke(c, '#5a8a4a', 3);
  c.save(); c.translate(4, -262);
  for (const [x, y, r] of [[-38, 10, 20], [36, 12, 18], [-30, 34, 14], [32, 36, 13]]) { ell(c, x, y, r, r); fillStroke(c, '#c9c9c9', 3); }
  ell(c, 0, 0, 40, 44); fillStroke(c, '#efe6cf');
  // one big eye, a patch on the other, a long pointy nose
  ell(c, 14, -6, 12, 14); fillStroke(c, '#fff', 3); ell(c, 16, -4, 7, 9); c.fillStyle = '#4a7a3a'; c.fill(); ell(c, 18, -7, 2.4, 2.4); c.fillStyle = '#fff'; c.fill();
  ell(c, -14, -6, 12, 11); fillStroke(c, '#2a1d30', 3); c.beginPath(); c.moveTo(-40, -14); c.lineTo(40, -20); ink(c, 3); c.stroke();
  c.beginPath(); c.moveTo(2, 2); c.quadraticCurveTo(40, 14, 26, 22); c.quadraticCurveTo(14, 18, 4, 16); fillStroke(c, '#ead9b8', 3);
  ell(c, 34, 22, 3, 3); c.fillStyle = '#8a6a4a'; c.fill();
  if (melt > 0 || p.mood === 'wow') { ell(c, 4, 30, 9, 9); fillStroke(c, '#5a1f2a', 3); } else { c.beginPath(); c.moveTo(-10, 30); c.quadraticCurveTo(4, 24, 18, 30); ink(c, 3); c.stroke(); }
  // floppy purple hat
  c.save(); c.translate(0, -32); c.rotate(Math.sin(t * 2) * .05);
  ell(c, 0, 0, 70, 16); fillStroke(c, '#5c3488');
  c.beginPath(); c.moveTo(-34, -2); c.quadraticCurveTo(-20, -70, 20, -84); c.quadraticCurveTo(54, -90, 60, -56); c.quadraticCurveTo(30, -66, 34, -2); c.closePath(); fillStroke(c, lin(c, -30, 0, 40, 0, [[0, '#6a3f9a'], [1, '#8c5cc4']]));
  c.restore(); c.restore();
  { const [x, y] = limb(c, -26, -206, 86, p.armB ?? -.15, 15, '#8c5cc4', p.bendB ?? .3); if (p.item) p.item(c, x, y, t); hand(c, x, y, 10, '#e9e2c9'); }   // her near arm, in front
  c.restore();
}

function wizardMan(c, p, t = 0) {
  p = live('wizardMan', c, p, 2, -236);
  shadow(c, 50);
  c.save(); c.translate(0, Math.sin(t * 2) * 1.5);
  { const [x, y] = limb(c, 40, -186, 76, p.armF ?? .5, 16, '#8a5c34', p.bendF ?? .4); hand(c, x, y, 10); }
  for (const s of [1, -1]) limb(c, -s * 12, -96, 92, 0, 18, '#5a4632');
  for (const s of [-1, 1]) { ell(c, s * 12 + 8, -4, 18, 9); fillStroke(c, '#3a2a1c', 3); }
  rr(c, -46, -196, 92, 106, 30); fillStroke(c, checks(c));
  c.beginPath(); c.moveTo(0, -196); c.lineTo(0, -96); ink(c, 3); c.stroke();
  c.save(); c.translate(2, -236);
  ell(c, 0, 0, 40, 42); fillStroke(c, rad(c, -10, -16, 4, 54, [[0, '#fff2e6'], [1, '#f6d2b4']]));
  ell(c, -10, -22, 12, 7, -.4); c.fillStyle = 'rgba(255,255,255,.7)'; c.fill();
  for (const s of [-1, 1]) { ell(c, s * 38, 6, 9, 14); fillStroke(c, '#f6d2b4', 3); }
  for (const s of [-1, 1]) { ell(c, s * 15, -2, 11, 11); ink(c, 3); c.stroke(); ell(c, s * 15, -2, 3.5, 4); c.fillStyle = '#3a2412'; c.fill(); }
  c.beginPath(); c.moveTo(-4, -2); c.lineTo(4, -2); ink(c, 3); c.stroke();
  c.beginPath(); c.moveTo(-18, 18); c.quadraticCurveTo(0, 8, 18, 18); c.quadraticCurveTo(0, 26, -18, 18); fillStroke(c, '#eeeeee', 2.5);
  mouth(c, 0, 26, 8, { ...p, mood: p.mood || 'happy' });
  c.restore();
  { const [x, y] = limb(c, -40, -186, 76, p.armB ?? -.2, 16, '#9a6a3f', p.bendB ?? .4); if (p.item) p.item(c, x, y, t); hand(c, x, y, 10); }   // near arm, in front
  c.restore();
}

function bigHead(c, t, glow = 1) {
  c.save();
  c.fillStyle = rad(c, 0, 0, 40, 260, [[0, `rgba(170,255,190,${.45 * glow})`], [1, 'rgba(170,255,190,0)']]); ell(c, 0, 0, 260, 260); c.fill();
  ell(c, 0, 0, 150, 170); fillStroke(c, rad(c, -40, -60, 10, 190, [[0, '#ffe9d4'], [1, '#f2c49e']]), 6);
  ell(c, -40, -100, 40, 20, -.4); c.fillStyle = 'rgba(255,255,255,.6)'; c.fill();
  // long wavy white hair at the sides, like the head on the Wizard's screen
  for (const s of [-1, 1]) for (let i = 0; i < 6; i++) { ell(c, s * (140 + (i % 2) * 18), -60 + i * 34, 34, 30); fillStroke(c, '#f4f1ea', 4); }
  for (const s of [-1, 1]) { ell(c, s * 150, 10, 24, 40); fillStroke(c, '#f2c49e', 5);
    c.beginPath(); c.moveTo(s * 85, -54); c.quadraticCurveTo(s * 55, -66, s * 26, -44); c.lineWidth = 16; c.strokeStyle = '#f4f1ea'; c.stroke();
    ell(c, s * 55, -6, 26, 22); fillStroke(c, '#fff', 4); ell(c, s * 55 + Math.sin(t) * 6, -4, 13, 14); c.fillStyle = '#3a2412'; c.fill(); }
  c.beginPath(); c.moveTo(0, -10); c.quadraticCurveTo(20, 40, 0, 46); ink(c, 5); c.stroke();
  // a big white beard with the mouth talking inside it
  c.beginPath(); c.moveTo(-130, 30); c.bezierCurveTo(-150, 200, -60, 290, 0, 300); c.bezierCurveTo(60, 290, 150, 200, 130, 30); c.quadraticCurveTo(70, 80, 0, 60); c.quadraticCurveTo(-70, 80, -130, 30); fillStroke(c, '#f6f3ec', 5);
  c.strokeStyle = 'rgba(150,140,125,.5)'; c.lineWidth = 3; for (let i = -4; i <= 4; i++) { c.beginPath(); c.moveTo(i * 24, 90); c.quadraticCurveTo(i * 30, 180, i * 16, 270); c.stroke(); }
  for (const s of [-1, 1]) { c.beginPath(); c.moveTo(0, 62); c.bezierCurveTo(s * 40, 40, s * 90, 60, s * 110, 96); c.bezierCurveTo(s * 70, 90, s * 40, 84, 0, 80); fillStroke(c, '#ffffff', 4); }
  const o = SPEAK.who === 'wizardHead' ? SPEAK.amp : 0; ell(c, 0, 116, 34, 6 + 18 * o); fillStroke(c, '#8a3b3b', 5);
  c.restore();
}

function auntEm(c, p, t = 0) {
  p = live('auntEm', c, p, 2, -270);
  shadow(c, 54);
  c.save(); const g = legsPose(p); c.translate(0, g.bob * 7);
  for (const s of [-1, 1]) { const [x, y] = limb(c, g.hip(s, 12), -100, 96, g.leg(s) * .4, 16, '#6b5544', g.knee(s) * .8); ell(c, x + 6, y, 16, 8); fillStroke(c, '#3a2a1c', 3); }
  // reach: both arms forward (open arms, a hug), from shoulders turned like a walker's
  const swing = p.arms == null && (g.w > 0 || p.reach != null), arm = s => { const [x, y] = swing
    ? limb(c, g.shoulder(s, 34, .4), -220, 86, p.reach != null ? p.reach + s * .15 : lerp(s * .3, 0, g.w) + g.arm(s) * .45, 15, s > 0 ? '#767b8a' : '#8a8f9e', p.reach != null ? .35 : lerp(s * -.3, .35, g.w))
    : limb(c, s * 34, -220, 86, s * (p.arms ?? .3), 15, s > 0 ? '#7e8392' : '#8a8f9e', s * -.3); hand(c, x, y, 10); };
  arm(1);
  c.beginPath(); c.moveTo(-36, -230); c.quadraticCurveTo(-56, -120, -64, -90); c.quadraticCurveTo(0, -80, 64, -90); c.quadraticCurveTo(56, -120, 36, -230); c.closePath(); fillStroke(c, '#8a8f9e');
  c.beginPath(); c.moveTo(-26, -200); c.lineTo(-38, -96); c.quadraticCurveTo(0, -88, 38, -96); c.lineTo(26, -200); c.closePath(); fillStroke(c, '#f3ead6', 3);
  c.save(); c.translate(2, -270);
  ell(c, 0, -46, 22, 18); fillStroke(c, '#bdbdbd', 3);
  ell(c, 0, 0, 42, 44); fillStroke(c, rad(c, -8, -10, 4, 52, [[0, '#ffe8d6'], [1, '#f2c8a8']]));
  c.beginPath(); c.moveTo(-44, 0); c.quadraticCurveTo(-40, -44, 0, -42); c.quadraticCurveTo(40, -44, 44, 0); c.quadraticCurveTo(20, -26, -44, 0); fillStroke(c, '#c4c4c4', 3);
  cheeks(c, 0, 16, 26, 11); eyes(c, 2, 0, 15, 8, p, 1); mouth(c, 2, 20, 9, { ...p, mood: 'happy' });
  c.restore();
  arm(-1);   // the near arm, in front of the head
  c.restore();
}

function uncleHenry(c, p, t = 0) {
  p = live('uncleHenry', c, p, 2, -282);
  shadow(c, 54);
  c.save(); const g = legsPose(p); c.translate(0, g.bob * 7);
  for (const s of [-1, 1]) { const [x, y] = limb(c, g.hip(s, 14), -110, 106, g.leg(s) * .4, 20, '#4f6f9a', g.knee(s) * .8); ell(c, x + 6, y, 18, 9); fillStroke(c, '#3a2a1c', 3); }
  const swing = p.arms == null && g.w > 0, arm = s => { const wave = s > 0 ? Math.sin(t * 6) * (p.wave || 0) : 0, [x, y] = swing
    ? limb(c, g.shoulder(s, 40, .4), -226, 90, lerp(s * .2, 0, g.w) + g.arm(s) * .45 + wave, 16, s > 0 ? '#b39f7a' : '#c9b48e', lerp(s * -.3, .35, g.w))
    : limb(c, s * 40, -226, 90, s * (p.arms ?? .2) + wave, 16, s > 0 ? '#b8a37f' : '#c9b48e', s * -.3); hand(c, x, y, 11); };
  arm(1);
  rr(c, -42, -240, 84, 140, 24); fillStroke(c, '#c9b48e');
  rr(c, -32, -190, 64, 96, 10); fillStroke(c, '#4f6f9a', 3);
  for (const s of [-1, 1]) { c.beginPath(); c.moveTo(s * 24, -190); c.lineTo(s * 28, -236); ink(c, 6); c.strokeStyle = '#4f6f9a'; c.stroke(); }
  c.save(); c.translate(2, -282);
  ell(c, 0, 0, 40, 44); fillStroke(c, rad(c, -8, -10, 4, 52, [[0, '#ffe2cc'], [1, '#eebd98']]));
  c.beginPath(); c.moveTo(-34, 10); c.quadraticCurveTo(-30, 64, 0, 66); c.quadraticCurveTo(30, 64, 34, 10); c.quadraticCurveTo(0, 30, -34, 10); fillStroke(c, '#d0d0d0', 3);
  eyes(c, 2, -4, 15, 8, p, 1);
  c.save(); c.translate(0, -34); ell(c, 0, 0, 64, 12); fillStroke(c, '#e2c27a', 3); rr(c, -34, -36, 68, 38, 14); fillStroke(c, '#e8cb86', 3); c.restore();
  c.restore();
  arm(-1);   // the near arm, in front of the head
  c.restore();
}

function munchkin(c, p, t = 0, hue = 0) {
  p = live('munchkin', c, p, 0, -130);
  const hop = Math.abs(Math.sin(t * 5 + hue)) * (p.hop ?? 10);
  shadow(c, 30);
  c.save(); c.translate(0, -hop); c.scale(.62, .62);
  for (const s of [-1, 1]) { const [x, y] = limb(c, s * 10, -80, 74, 0, 14, '#2f5fa8'); ell(c, x + 4, y, 14, 7); fillStroke(c, '#5a3a1e', 3); }
  { const [x, y] = limb(c, 32, -160, 64, Math.PI * .9 + Math.sin(t * 8 + hue) * .3, 13, '#3568b8', 0); hand(c, x, y, 9); }
  rr(c, -36, -170, 72, 100, 30); fillStroke(c, lin(c, -36, 0, 36, 0, [[0, '#3f73c4'], [1, '#2a5aa6']]));
  { const [x, y] = limb(c, -32, -160, 64, -.2, 13, '#3f73c4', 0); hand(c, x, y, 9); }
  c.save(); c.translate(0, -204);
  ell(c, 0, 0, 34, 34); fillStroke(c, rad(c, -6, -8, 3, 42, [[0, '#ffe6cf'], [1, '#f6c9a6']]));
  cheeks(c, 0, 12, 20, 9); eyes(c, 2, 0, 12, 7, p, 1); mouth(c, 2, 16, 8, { mood: 'happy' });
  c.beginPath(); c.moveTo(-38, -16); c.quadraticCurveTo(0, -30, 38, -16); c.lineTo(8, -90); c.closePath(); fillStroke(c, lin(c, -30, 0, 30, 0, [[0, '#2f66b8'], [1, '#5c92e0']]));
  for (let i = -3; i <= 3; i++) { ell(c, i * 11, -18 + Math.abs(i) * -1, 4, 4); fillStroke(c, '#ffd84d', 2); }
  c.restore(); c.restore();
}

function monkey(c, t, k = 0) {
  const flap = Math.sin(t * 10 + k);
  c.save();
  for (const s of [-1, 1]) { c.save(); c.scale(s, 1); c.rotate(-.3 - flap * .45);
    c.beginPath(); c.moveTo(10, -10); c.quadraticCurveTo(70, -70, 110, -40); c.quadraticCurveTo(80, -20, 90, 0); c.quadraticCurveTo(50, -6, 10, 4); fillStroke(c, '#f2eee6', 3); c.restore(); }
  ell(c, 0, 10, 26, 30); fillStroke(c, '#9a6a3f'); rr(c, -22, -6, 44, 30, 10); fillStroke(c, '#c94a3a', 3);
  ell(c, 0, -30, 24, 22); fillStroke(c, '#9a6a3f'); ell(c, 2, -26, 15, 13); fillStroke(c, '#f2d2b0', 3);
  for (const s of [-1, 1]) { ell(c, s * 24, -32, 7, 8); fillStroke(c, '#f2d2b0', 3); ell(c, s * 6 + 2, -30, 3, 3.5); c.fillStyle = '#2a1a0e'; c.fill(); }
  c.beginPath(); c.arc(2, -24, 6, .2 * Math.PI, .8 * Math.PI); ink(c, 2.5); c.stroke();
  c.beginPath(); c.moveTo(-10, 36); c.quadraticCurveTo(-40, 60, -26, 80); ink(c, 6); c.stroke();
  c.restore();
}
