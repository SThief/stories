// Shared scenery: skies, hills, houses, plants, sparkles and the caption.
const W = 1920, H = 1080, GROUND = 860;

function sky(c, top, mid, bot) { c.fillStyle = lin(c, 0, 0, 0, 760, [[0, top], [.6, mid], [1, bot]]); c.fillRect(0, 0, W, H); }
function sun(c, x, y, r, col = '255,248,210') { c.fillStyle = rad(c, x, y, r * .1, r, [[0, `rgba(${col},.95)`], [.25, `rgba(${col},.45)`], [1, `rgba(${col},0)`]]); c.fillRect(0, 0, W, H); }
function hills(c, off, base, amp, col, k) {
  c.beginPath(); c.moveTo(0, H);
  for (let x = 0; x <= W; x += 20) { const u = x + off; c.lineTo(x, base - Math.sin(u * k) * amp - Math.sin(u * k * 2.3 + 1) * amp * .4); }
  c.lineTo(W, H); c.closePath(); c.fillStyle = col; c.fill();
  // a soft watercolor shadow along the top of each hill
  c.save(); c.clip(); c.fillStyle = lin(c, 0, base - amp * 1.4, 0, base + 120, [[0, 'rgba(255,255,230,.18)'], [.4, 'rgba(0,40,0,0)'], [1, 'rgba(0,40,0,.12)']]); c.fillRect(0, base - amp * 1.5, W, 260); c.restore();
}
const BLADES = (() => { const R = rng(31); return Array.from({ length: 260 }, () => ({ x: R() * W, v: R(), s: .5 + R() * .9, k: R() })); })();
function ground(c, y, top, bot) {
  c.fillStyle = lin(c, 0, y, 0, H, [[0, top], [1, bot]]); c.fillRect(0, y, W, H - y);
  // painted grass: little strokes in a darker and a lighter shade, thicker toward the front
  c.save(); c.lineCap = 'round';
  for (const b of BLADES) { const yy = y + 10 + b.v * b.v * (H - y), sz = 6 + (yy - y) / (H - y) * 16 * b.s;
    c.strokeStyle = b.k < .7 ? 'rgba(30,60,20,.22)' : 'rgba(255,255,230,.25)'; c.lineWidth = 2 + sz * .12;
    c.beginPath(); c.moveTo(b.x, yy); c.lineTo(b.x - sz * .3, yy - sz); c.moveTo(b.x + 4, yy); c.lineTo(b.x + 6, yy - sz * 1.1); c.moveTo(b.x + 8, yy); c.lineTo(b.x + 14, yy - sz * .8); c.stroke(); }
  c.restore();
}
function puff(c, x, y, s, a = .92, col = '255,255,255') {
  c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = `rgba(${col},${a})`;
  for (const [dx, dy, r] of [[0, 0, 48], [50, -18, 58], [104, 0, 46], [52, 18, 50], [-40, 12, 34], [140, 14, 32]]) { ell(c, dx, dy, r, r * .85); c.fill(); }
  c.restore();
}
function clouds(c, t, list, speed = 8, a = .92, col) { for (const k of list) puff(c, ((k.x + t * speed * k.s) % (W + 500) + W + 500) % (W + 500) - 250, k.y, k.s, a, col); }
const CLOUDS = (() => { const R = rng(3); return Array.from({ length: 7 }, (_, i) => ({ x: i * 420 + R() * 200, y: 80 + R() * 200, s: .6 + R() * .6 })); })();

function sparkle(c, x, y, r, rot = 0, col = '#fffbe0') {
  if (r <= .5) return; c.save(); c.translate(x, y); c.rotate(rot); c.fillStyle = col;
  c.beginPath(); for (let i = 0; i < 8; i++) { const q = i % 2 ? r * .22 : r; c.lineTo(Math.cos(i * Math.PI / 4) * q, Math.sin(i * Math.PI / 4) * q); } c.fill(); c.restore();
}
function twinkles(c, t, list, col) { c.save(); c.globalAlpha *= .55; for (const s of list) sparkle(c, s.x, s.y, Math.max(0, Math.sin(t * 2.2 + s.p)) * s.r * .7, t + s.p, col); c.restore(); }
const scatter = (seed, n, x0, x1, y0, y1, r0 = 6, r1 = 14) => { const R = rng(seed); return Array.from({ length: n }, () => ({ x: lerp(x0, x1, R()), y: lerp(y0, y1, R()), r: lerp(r0, r1, R()), p: R() * TAU })); };

function farmhouse(c, x, y, s, gray = 1, door = 0) {
  c.save(); c.translate(x, y); c.scale(s, s);
  const wall = gray > .5 ? '#9b9a94' : '#d9cfb8', roof = gray > .5 ? '#6f6c66' : '#8a5a3a';
  c.beginPath(); c.moveTo(-150, 0); c.lineTo(-150, -170); c.lineTo(150, -170); c.lineTo(150, 0); c.closePath(); fillStroke(c, wall);
  c.strokeStyle = 'rgba(60,50,40,.25)'; c.lineWidth = 2; for (let yy = -150; yy < 0; yy += 22) { c.beginPath(); c.moveTo(-150, yy); c.lineTo(150, yy); c.stroke(); }
  c.beginPath(); c.moveTo(-180, -164); c.lineTo(0, -290); c.lineTo(180, -164); c.closePath(); fillStroke(c, roof);
  rr(c, 70, -310, 34, 80, 4); fillStroke(c, roof);
  rr(c, -110, -130, 64, 56, 6); fillStroke(c, gray > .5 ? '#c9c4b0' : '#ffe9a8');
  c.beginPath(); c.moveTo(-78, -130); c.lineTo(-78, -74); c.moveTo(-110, -102); c.lineTo(-46, -102); ink(c, 3); c.stroke();
  rr(c, 20, -120, 70, 120, 6); fillStroke(c, '#3a2e26');
  c.save(); c.translate(20, -120); c.scale(Math.cos(door * Math.PI * .45), 1); rr(c, 0, 0, 70, 120, 6); fillStroke(c, gray > .5 ? '#7c7a74' : '#b07a4a'); ell(c, 58, 64, 5, 5); c.fillStyle = INK; c.fill(); c.restore();
  c.restore();
}
function windmill(c, x, y, s, t) {
  c.save(); c.translate(x, y); c.scale(s, s);
  c.beginPath(); c.moveTo(-30, 0); c.lineTo(-6, -260); c.lineTo(6, -260); c.lineTo(30, 0); ink(c, 6); c.stroke();
  c.translate(0, -262); c.rotate(t * 1.2); for (let i = 0; i < 8; i++) { c.rotate(TAU / 8); rr(c, -6, 0, 12, 80, 4); fillStroke(c, '#8f8c86', 3); }
  ell(c, 0, 0, 10, 10); fillStroke(c, '#5f5c56', 3); c.restore();
}
function fence(c, y, col = '#8d7a62') {
  for (let x = -20; x < W + 60; x += 160) { rr(c, x, y - 110, 18, 116, 4); fillStroke(c, col, 3); }
  for (const yy of [y - 90, y - 50]) { rr(c, -20, yy, W + 60, 14, 4); fillStroke(c, col, 3); }
}
function flower(c, x, y, s, sway, petal, center = '#ffcc33') {
  c.save(); c.translate(x, y); c.scale(s, s);
  c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(sway * 6, 20, 0, 44); c.strokeStyle = '#3f8a3a'; c.lineWidth = 4; c.stroke();
  c.translate(sway * 5, 0); for (let i = 0; i < 6; i++) { const q = i / 6 * TAU; ell(c, Math.cos(q) * 12, Math.sin(q) * 12, 11, 8, q); c.fillStyle = petal; c.fill(); ink(c, 2); c.stroke(); }
  ell(c, 0, 0, 7, 7); c.fillStyle = center; c.fill(); c.restore();
}
function tuft(c, x, y, s, sway, col1 = '#4f9e3f', col2 = '#69b64f') {
  c.save(); c.translate(x, y); c.scale(s, s);
  for (let i = -3; i <= 3; i++) { c.beginPath(); c.moveTo(i * 6, 0); c.quadraticCurveTo(i * 9 + sway * 10, -30, i * 12 + sway * 18, -54 + Math.abs(i) * 4);
    c.lineWidth = 7; c.strokeStyle = i % 2 ? col1 : col2; c.lineCap = 'round'; c.stroke(); }
  c.restore();
}
function tree(c, x, y, s, t, leaf = '#5aa84a', apples = false) {
  c.save(); c.translate(x, y); c.scale(s, s);
  c.beginPath(); c.moveTo(-26, 0); c.quadraticCurveTo(-14, -120, -20, -220); c.lineTo(20, -220); c.quadraticCurveTo(14, -120, 26, 0); c.closePath(); fillStroke(c, '#8a5a32');
  c.rotate(Math.sin(t * .8 + x) * .015);
  for (const [dx, dy, r] of [[-90, -250, 90], [0, -320, 110], [90, -250, 90], [-40, -200, 80], [50, -200, 80]]) { ell(c, dx, dy, r, r * .9); fillStroke(c, leaf); }
  for (const [dx, dy, r] of [[-60, -290, 40], [30, -360, 46], [100, -280, 34]]) { ell(c, dx, dy, r, r * .8); c.fillStyle = 'rgba(255,255,220,.25)'; c.fill(); }
  if (apples) for (const [dx, dy] of [[-70, -230], [40, -300], [100, -220], [-10, -260], [60, -200]]) { ell(c, dx, dy, 11, 11); fillStroke(c, '#e8463a', 2.5); }
  c.restore();
}
function brickRoad(c, off, top, bot) {
  c.fillStyle = lin(c, 0, top, 0, bot, [[0, '#f5cd4f'], [1, '#e2a92a']]); c.fillRect(0, top, W, bot - top);
  const rows = 4; for (let r = 0; r < rows; r++) {
    const y0 = top + (bot - top) * r / rows, hgt = (bot - top) / rows, bw = 74 + r * 10, sh = (r % 2) * bw / 2;
    for (let x = -bw - (((off + sh) % bw) + bw) % bw; x < W + bw; x += bw) {
      rr(c, x + 3, y0 + 3, bw - 6, hgt - 6, 6); c.fillStyle = lin(c, 0, y0, 0, y0 + hgt, [[0, '#ffe07a'], [1, '#eab53a']]); c.fill();
      c.strokeStyle = 'rgba(150,95,20,.35)'; c.lineWidth = 2; c.stroke();
    }
  }
  c.fillStyle = 'rgba(255,255,255,.25)'; c.fillRect(0, top, W, 5);
}
function emeraldCity(c, x, y, s, t, glow = 1) {
  c.save(); c.translate(x, y); c.scale(s, s);
  c.fillStyle = rad(c, 0, -80, 10, 320, [[0, `rgba(170,255,190,${.55 * glow})`], [1, 'rgba(170,255,190,0)']]); c.fillRect(-340, -420, 680, 460);
  for (const [tx, h, w] of [[-150, 120, 34], [-100, 190, 40], [-48, 150, 30], [0, 260, 48], [52, 170, 34], [104, 210, 38], [150, 120, 30]]) {
    c.beginPath(); c.moveTo(tx - w / 2, 0); c.lineTo(tx - w / 2, -h); c.lineTo(tx, -h - w * 1.6); c.lineTo(tx + w / 2, -h); c.lineTo(tx + w / 2, 0); c.closePath();
    c.fillStyle = lin(c, tx - w / 2, 0, tx + w / 2, 0, [[0, '#3fae6a'], [.45, '#a6f0bd'], [1, '#2f8f55']]); c.fill(); c.strokeStyle = 'rgba(30,90,50,.5)'; c.lineWidth = 2; c.stroke();
    c.fillStyle = 'rgba(255,255,210,.8)'; for (let yy = -h + 30; yy < -10; yy += 34) { rr(c, tx - 5, yy, 10, 14, 5); c.fill(); }
  }
  c.restore();
}
function poppies(c, t, list, off = 0) {
  for (const p of list) { const x = ((p.x - off) % 3000 + 3000) % 3000 - 200; if (x < -40 || x > W + 40) continue;
    c.save(); c.translate(x, p.y); c.scale(p.r / 10, p.r / 10);
    const sway = Math.sin(t * 2 + p.p); c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(sway * 6, 14, 0, 30); c.strokeStyle = '#3f8a3a'; c.lineWidth = 3; c.stroke();
    c.translate(sway * 4, 0); for (let i = 0; i < 5; i++) { const q = i / 5 * TAU; ell(c, Math.cos(q) * 7, Math.sin(q) * 6, 8, 7, q); c.fillStyle = i % 2 ? '#e8332e' : '#ff4a3d'; c.fill(); }
    ell(c, 0, 0, 3.5, 3.5); c.fillStyle = '#2a1a12'; c.fill(); c.restore(); }
}
function butterfly(c, t, x0, y0, col, k) {
  const x = (x0 + t * 70 * k) % (W + 200) - 100, y = y0 + Math.sin(t * 1.7 * k) * 40, f = Math.abs(Math.sin(t * 14));
  c.save(); c.translate(x, y); c.rotate(Math.sin(t * 2) * .2);
  for (const s of [-1, 1]) { c.save(); c.scale(s * (.3 + f * .7), 1); ell(c, 12, -6, 13, 10, .4); c.fillStyle = col; c.fill(); ell(c, 9, 8, 8, 7, -.4); c.fill(); c.restore(); }
  ell(c, 0, 0, 2.5, 10); c.fillStyle = '#3b2618'; c.fill(); c.restore();
}
function bubble(c, x, y, text, a = 1, size = 54) {
  if (a <= 0) return; c.save(); c.globalAlpha = a; c.translate(x, y); c.scale(.6 + .4 * ease(a * 1.4), .6 + .4 * ease(a * 1.4));
  c.font = `600 ${size}px Fredoka`; const w = c.measureText(text).width + 50;
  c.beginPath(); for (let i = 0; i < 16; i++) { const q = i / 16 * TAU, r = i % 2 ? .82 : 1; c.lineTo(Math.cos(q) * w * .62 * r, Math.sin(q) * size * 1.1 * r); } c.closePath(); fillStroke(c, '#fff7d6', 4);
  c.fillStyle = '#c0392b'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(text, 0, 4); c.restore();
}
function vignette(c, warm = .07) {
  c.fillStyle = `rgba(255,200,120,${warm})`; c.fillRect(0, 0, W, H);
  c.fillStyle = rad(c, W / 2, H / 2, 600, 1150, [[0, 'rgba(40,20,0,0)'], [1, 'rgba(40,20,0,.28)']]); c.fillRect(0, 0, W, H);
}
function caption(c, text, a) {
  if (a <= 0 || !text) return;
  c.save(); c.globalAlpha = a; c.font = '600 34px Fredoka';
  const words = text.split(' '), lines = []; let line = '';
  for (const w of words) { const tryL = line ? line + ' ' + w : w; if (c.measureText(tryL).width > 1780) { lines.push(line); line = w; } else line = tryL; }
  lines.push(line);
  const bw = Math.max(...lines.map(l => c.measureText(l).width)) + 80, bh = lines.length * 44 + 24, bx = (W - bw) / 2, by = H - bh - 20;
  c.shadowColor = 'rgba(40,20,0,.35)'; c.shadowBlur = 24; rr(c, bx, by, bw, bh, 28); c.fillStyle = 'rgba(255,250,238,.94)'; c.fill(); c.shadowBlur = 0;
  c.fillStyle = '#4a2f1c'; c.textAlign = 'center'; c.textBaseline = 'top';
  lines.forEach((l, i) => c.fillText(l, W / 2, by + 14 + i * 44)); c.restore();
}
// put a character at (x, y), scaled, optionally facing left
function put(c, fn, x, y, s, p, t, flip = false) { c.save(); c.translate(x, y); c.scale(flip ? -s : s, s); fn(c, p, t); c.restore(); }
// Film seconds since the scene's action reached moment `o` (negative before it). The narration stretches or squeezes
// each scene's action, so a walk timed in action time plays in slow motion or fast forward; walks are timed with this
// instead so they always go at a real walking pace. cartoon.html sets it for the scene being drawn.
let since = o => 0;
// The walk phase for having gone `dist` (in scene pixels) at size `s`, so the foot on the ground keeps pace with it.
const STRIDE = { dorothy: 34, scarecrow: 47, tinWoodman: 28, auntEm: 24, uncleHenry: 27, lion: 30 };
const stepPh = (f, dist, s) => dist / (STRIDE[f.name] * s);
const blinkAt = (t, k) => ((t + k * .7) % 3.4) < .14 ? 1 : 0;
const talk = (u, a, b) => (u > a && u < b) ? Math.abs(Math.sin(u * 13)) * .8 : 0;
