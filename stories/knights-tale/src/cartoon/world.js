// Scenery and effects for The Boy Who Changed His Stars. Everything is drawn in the shot's own coordinates (a
// 1920 x 1080 stage the camera moves over). Far layers are hazier and softer than near ones.
function sky(c, cols) { c.fillStyle = lin(c, 0, -300, 0, 900, cols.map((col, i) => [i / (cols.length - 1), col])); c.fillRect(-2000, -1500, W + 4000, H + 3000); }
const STARS = Array.from({ length: 320 }, (_, i) => ({ x: hash(i, 1) * 3400 - 750, y: hash(i, 2) * 1500 - 600, r: .7 + hash(i, 3) ** 3 * 2.6, k: hash(i, 4) }));
function stars(c, t, a = 1, maxY = 800) {
  for (const s of STARS) { if (s.y > maxY) continue; const tw = .45 + .55 * (.5 + .5 * Math.sin(t * (1 + s.k * 3) + s.k * 40));
    ell(c, s.x, s.y, s.r); c.fillStyle = `rgba(245,240,255,${a * tw})`; c.fill(); if (s.r > 2.4) { c.globalAlpha = a * tw * .5; c.strokeStyle = '#fffbe8'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(s.x - 7, s.y); c.lineTo(s.x + 7, s.y); c.moveTo(s.x, s.y - 7); c.lineTo(s.x, s.y + 7); c.stroke(); c.globalAlpha = 1; } }
}
function moon(c, x, y, r) { glow(c, x, y, r * 6, '190,205,255', .22); glow(c, x, y, r * 2, '255,250,225', .45); ell(c, x, y, r); c.fillStyle = '#fdf6d8'; c.fill();
  ell(c, x - r * .3, y - r * .2, r * .18); c.fillStyle = 'rgba(210,200,160,.5)'; c.fill(); ell(c, x + r * .25, y + r * .3, r * .12); c.fill(); }
function sunDisc(c, x, y, r, col = '255,236,180') { glow(c, x, y, r * 5, col, .35); glow(c, x, y, r * 1.6, '255,250,230', .6); ell(c, x, y, r); c.fillStyle = '#fff6d0'; c.fill(); }
function rays(c, x, y, t, col = '255,240,200', a = .07, n = 16, len = 2000) {
  c.save(); c.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) { const ang = i / n * TAU + t * .03 + Math.sin(i * 7.3) * .2, wd = .03 + (i % 3) * .025;
    c.beginPath(); c.moveTo(x, y); c.arc(x, y, len, ang - wd, ang + wd); c.closePath(); c.fillStyle = rad(c, x, y, 20, len * .8, [[0, `rgba(${col},${a})`], [1, `rgba(${col},0)`]]); c.fill(); }
  c.restore();
}
const CLOUDS = Array.from({ length: 8 }, (_, i) => ({ x: i * 420 + hash(i, 5) * 200 - 300, y: 60 + hash(i, 6) * 200, s: .6 + hash(i, 7) * .6 }));
function clouds(c, t, col = '255,255,255', a = .95, speed = 8) {
  for (const k of CLOUDS) { const x = ((k.x + t * speed * k.s) % 3200 + 3200) % 3200 - 600; c.save(); c.translate(x, k.y); c.scale(k.s, k.s);
    c.fillStyle = `rgba(${col},${a})`; for (const [dx, dy, r] of [[0, 0, 48], [50, -18, 58], [104, 0, 46], [52, 18, 50], [-40, 12, 34], [140, 14, 32]]) { ell(c, dx, dy, r, r * .85); c.fill(); }
    c.fillStyle = `rgba(150,160,200,${a * .25})`; ell(c, 50, 30, 120, 18); c.fill(); c.restore(); }
}
function hillsBand(c, y, amp, k, col, off = 0, haze = 0, hazeCol = '200,220,255') {
  c.beginPath(); c.moveTo(-2000, 2000); for (let x = -2000; x <= W + 2000; x += 24) { const u = x + off; c.lineTo(x, y - amp * (.55 * Math.sin(u * k) + .3 * Math.sin(u * k * 2.7 + 1) + .15 * Math.sin(u * k * 6 + 2))); }
  c.lineTo(W + 2000, 2000); c.closePath(); c.fillStyle = col; c.fill();
  if (haze) { c.save(); c.clip(); c.fillStyle = `rgba(${hazeCol},${haze})`; c.fillRect(-2000, y - amp * 2, W + 4000, 3000); c.restore(); }
}
function castle(c, x, y, s, col, lit = 0, flag = true) {
  c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = col;
  for (const [tx, h, w] of [[-130, 170, 60], [0, 250, 80], [130, 170, 60], [-70, 120, 120], [70, 120, 120]]) {
    c.fillRect(tx - w / 2, -h, w, h); if (w < 100) { c.beginPath(); c.moveTo(tx - w / 2 - 8, -h); c.lineTo(tx, -h - w * 1.1); c.lineTo(tx + w / 2 + 8, -h); c.closePath(); c.fill(); }
    if (lit) { c.fillStyle = `rgba(255,210,120,${lit})`; for (let k = 0; k < 2; k++) c.fillRect(tx - 6, -h + 30 + k * 50, 12, 18); c.fillStyle = col; } }
  c.beginPath(); c.arc(0, 0, 26, Math.PI, 0); c.fillStyle = lit ? `rgba(255,200,110,${lit})` : 'rgba(0,0,0,.2)'; c.fill();
  if (flag) { c.strokeStyle = col; c.lineWidth = 4; c.beginPath(); c.moveTo(0, -330); c.lineTo(0, -380); c.stroke(); c.beginPath(); c.moveTo(0, -380); c.lineTo(34, -370); c.lineTo(0, -358); c.fillStyle = '#3a86d8'; c.fill(); }
  c.restore();
}
// a row of town houses with pointed roofs
function houses(c, t, y, s, seed, pal, lit = 0, night = false, x0 = -400, x1 = W + 400) {
  for (let i = 0, x = x0; x < x1; i++) {
    const w = (110 + hash(i, seed) * 70) * s, h = (120 + hash(i, seed + 1) * 110) * s, col = pal.wall[Math.floor(hash(i, seed + 2) * pal.wall.length)], roof = pal.roof[Math.floor(hash(i, seed + 3) * pal.roof.length)];
    c.beginPath(); c.rect(x, y - h, w, h); fs(c, col, 3);
    c.beginPath(); c.moveTo(x - 10 * s, y - h); c.lineTo(x + w / 2, y - h - w * .55); c.lineTo(x + w + 10 * s, y - h); c.closePath(); fs(c, roof, 3);
    for (let k = 0; k < 2; k++) { const on = night ? hash(i * 3 + k, seed + 5) < lit : 0, wx = x + w * (.22 + k * .36), wy = y - h * .62;
      c.beginPath(); c.rect(wx, wy, w * .22, w * .26); c.fillStyle = night ? (on ? '#ffc864' : '#141a3a') : '#8ac4ea'; c.fill(); c.lineWidth = 2.5; c.strokeStyle = 'rgba(30,20,30,.5)'; c.stroke();
      if (on) { c.save(); c.globalCompositeOperation = 'lighter'; glow(c, wx + w * .11, wy + w * .13, w * .45, '255,180,90', .3); c.restore(); } }
    x += w + 14 * s;
  }
}
const TOWN_DAY = { wall: ['#f6e6c8', '#f2d6b0', '#fbeedb', '#eed2b4'], roof: ['#d9553a', '#c94a32', '#e2683e'] };
const TOWN_SUNSET = { wall: ['#f4d2b2', '#f0c4a0', '#f8dcc0'], roof: ['#c94a3a', '#b8402e', '#d9603e'] };
const TOWN_NIGHT = { wall: ['#2a2f6a', '#262a60', '#30357a'], roof: ['#1e2250', '#232860'] };
function roof(c, y, col = '#c0503a') {   // the tiled roof they sit on
  c.beginPath(); c.rect(-800, y, W + 1600, 900); fs(c, col, 0);
  c.strokeStyle = mixCol(col, '#2a1010', .35); c.lineWidth = 3;
  for (let r = 0; r < 8; r++) for (let x = -800 + (r % 2) * 40; x < W + 800; x += 80) { c.beginPath(); c.arc(x + 40, y + 28 + r * 46, 40, .1 * Math.PI, .9 * Math.PI); c.stroke(); }
  c.fillStyle = mixCol(col, '#2a1010', .45); c.fillRect(-800, y - 6, W + 1600, 14);
}
function bush(c, x, y, s, col = '#4aa04a') { c.save(); c.translate(x, y); c.scale(s, s); for (const [dx, dy, r] of [[-60, -40, 60], [40, -50, 70], [-10, -110, 70], [70, -120, 50]]) { ell(c, dx, dy, r); fs(c, col); } c.restore(); }
function meadow(c, t, y, off = 0) {
  hillsBand(c, y - 60, 30, .004, '#a8d890', off * .2, .3); hillsBand(c, y - 10, 24, .003, '#86c46a', off * .5, .12);
  c.fillStyle = lin(c, 0, y, 0, H, [[0, '#7cc060'], [1, '#5aa046']]); c.fillRect(-2000, y + 10, W + 4000, 2000);
  for (let i = 0; i < 70; i++) { const x = ((hash(i, 31) * 3000 - off) % 3000 + 3000) % 3000 - 500, yy = y + 30 + hash(i, 32) * 300, col = ['#ff8fb8', '#ffd23f', '#ffffff', '#c58fff'][i % 4];
    ell(c, x, yy, 5 + hash(i, 33) * 4); c.fillStyle = col; c.fill(); }
}
function tent(c, x, y, s, a = '#ffffff', b = '#3a86d8') {
  c.save(); c.translate(x, y); c.scale(s, s);
  c.beginPath(); c.moveTo(-110, 0); c.lineTo(0, -190); c.lineTo(110, 0); c.closePath(); fs(c, a);
  c.save(); c.clip(); c.fillStyle = b; for (let k = -3; k <= 3; k += 2) { c.beginPath(); c.moveTo(0, -190); c.lineTo(k * 36, 0); c.lineTo((k + 1) * 36, 0); c.closePath(); c.fill(); } c.restore();
  c.beginPath(); c.moveTo(0, -190); c.lineTo(0, -230); ink(c, 4); c.beginPath(); c.moveTo(0, -230); c.lineTo(30, -222); c.lineTo(0, -212); c.fillStyle = b; c.fill(); c.restore();
}
function bunting(c, y, t, x0 = -200, x1 = W + 200) {
  const cols = ['#e2443a', '#f2c23a', '#3a86d8', '#4aa04a', '#8a4ab8'];
  c.beginPath(); c.moveTo(x0, y); for (let x = x0; x <= x1; x += 40) c.lineTo(x, y + Math.sin(x * .008) * 12); ink(c, 2, '#6a4a3a');
  for (let i = 0, x = x0; x < x1; i++, x += 60) { const yy = y + Math.sin(x * .008) * 12, sw = Math.sin(t * 3 + i) * 4; c.beginPath(); c.moveTo(x, yy); c.lineTo(x + 40, yy + 1); c.lineTo(x + 20 + sw, yy + 40); c.closePath(); c.fillStyle = cols[i % 5]; c.fill(); }
}
function arena(c, t, cheer = 0, off = 0, sandY = 470) {   // stands of people, the sand and the fence along the lists
  sky(c, ['#5ab0f0', '#bfe4ff']); clouds(c, t);
  c.save(); c.translate(-((off * .5) % 36), 0); stands(c, t, 150, 6, cheer, -200, W + 200); c.restore();
  c.fillStyle = '#7a4a2e'; c.fillRect(-2000, sandY - 30, W + 4000, 40);
  c.fillStyle = lin(c, 0, sandY, 0, H, [[0, '#ecc88a'], [1, '#d9a866']]); c.fillRect(-2000, sandY, W + 4000, 2000);
  for (let i = 0; i < 60; i++) { const x = ((hash(i, 41) * 2600 - off) % 2600 + 2600) % 2600 - 300; ell(c, x, sandY + 60 + hash(i, 42) * 500, 18, 4); c.fillStyle = 'rgba(160,110,60,.25)'; c.fill(); }
}
function fenceLists(c, y, off = 0, col = '#8a5a32') {
  c.beginPath(); c.rect(-2000, y - 70, W + 4000, 16); fs(c, col, 3); c.beginPath(); c.rect(-2000, y - 30, W + 4000, 14); fs(c, col, 3);
  for (let x = -((off % 140) + 140) % 140 - 140; x < W + 200; x += 140) { rr(c, x, y - 92, 18, 96, 4); fs(c, dark(col, .1), 3); }
}
function pines(c, y, col, seed, s = 1, haze = 0) {
  for (let i = 0; i < 26; i++) { const x = -300 + i * 100 + hash(i, seed) * 60, h = (220 + hash(i, seed + 1) * 160) * s;
    c.beginPath(); c.moveTo(x, y - h); c.lineTo(x - 60 * s, y); c.lineTo(x + 60 * s, y); c.closePath(); c.fillStyle = col; c.fill(); }
  if (haze) { c.fillStyle = `rgba(40,50,110,${haze})`; c.fillRect(-500, y - 500 * s, W + 1000, 500 * s); }
}
function campfire(c, x, y, s, t) {
  c.save(); c.translate(x, y); c.scale(s, s);
  for (const r of [-.4, .4]) { c.save(); c.rotate(r); rr(c, -70, -10, 140, 20, 8); fs(c, '#6b4428', 3); c.restore(); }
  for (let k = 0; k < 3; k++) { const f = Math.sin(t * 9 + k * 2) * 8; c.beginPath(); c.moveTo(-44 + k * 10, -6); c.quadraticCurveTo(-50 + k * 20, -70 - k * 10, f + k * 4, -130 - k * 20 + f); c.quadraticCurveTo(40 - k * 10, -60, 44 - k * 10, -6); c.closePath();
    c.fillStyle = ['#e2443a', '#f2932a', '#ffd84a'][k]; c.fill(); }
  c.restore(); c.save(); c.globalCompositeOperation = 'lighter'; glow(c, x, y - 60 * s, 520 * s, '255,150,60', .4 + Math.sin(t * 11) * .04); c.restore();
}
function ground(c, y, top, bot) { c.fillStyle = lin(c, 0, y, 0, y + 600, [[0, top], [1, bot]]); c.fillRect(-2000, y, W + 4000, 2000); }
function brickWall(c, col, line, y1 = 1080) {
  c.fillStyle = col; c.fillRect(-1000, -600, W + 2000, y1 + 600);
  c.strokeStyle = line; c.lineWidth = 3; for (let y = -600; y < y1; y += 70) { c.beginPath(); c.moveTo(-1000, y); c.lineTo(W + 1000, y); c.stroke();
    for (let x = -1000 + ((y / 70) % 2) * 80; x < W + 1000; x += 160) { c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + 70); c.stroke(); } }
}
function forge(c, t) {   // the blacksmith's: brick wall, a furnace with fire, the anvil
  brickWall(c, '#7a4a32', 'rgba(40,20,10,.35)', 860); ground(c, 860, '#5a3a26', '#3a2416');
  c.beginPath(); c.moveTo(1350, 860); c.lineTo(1350, 420); c.quadraticCurveTo(1540, 300, 1730, 420); c.lineTo(1730, 860); c.closePath(); fs(c, '#9aa0a8');
  c.beginPath(); c.moveTo(1420, 860); c.lineTo(1420, 560); c.quadraticCurveTo(1540, 470, 1660, 560); c.lineTo(1660, 860); c.closePath(); c.fillStyle = '#1a0e0a'; c.fill();
  campfire(c, 1540, 860, 1.1, t);
  anvil(c, 880, 860, 1);
}
function anvil(c, x, y, s, hot = 1) {
  c.save(); c.translate(x, y); c.scale(s, s);
  c.beginPath(); c.moveTo(-60, 0); c.lineTo(-30, -70); c.lineTo(30, -70); c.lineTo(60, 0); c.closePath(); fs(c, '#4a5060');
  c.beginPath(); c.moveTo(-200, -150); c.lineTo(160, -150); c.quadraticCurveTo(200, -130, 160, -110); c.lineTo(60, -110); c.lineTo(40, -70); c.lineTo(-40, -70); c.lineTo(-60, -110); c.lineTo(-170, -110); c.quadraticCurveTo(-230, -130, -200, -150); c.closePath(); fs(c, '#6a7484');
  if (hot) { rr(c, -70, -168, 140, 20, 8); c.fillStyle = `rgba(255,${150 + 80 * hot},60,1)`; c.fill(); c.save(); c.globalCompositeOperation = 'lighter'; glow(c, 0, -158, 160, '255,150,60', .45 * hot); c.restore(); }
  c.restore();
}
function sparks(c, x, y, t, n = 18, s = 1) {
  c.save(); c.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) { const q = ((t * 1.6 + hash(i, 51)) % 1), a = -Math.PI / 2 + (hash(i, 52) - .5) * 2.4, v = (200 + hash(i, 53) * 260) * s;
    const px = x + Math.cos(a) * v * q, py = y + Math.sin(a) * v * q + 500 * q * q * s; glow(c, px, py, 8 * s, '255,190,80', (1 - q) * .9); }
  c.restore();
}
function room(c, t, dark = 0) {   // the father's little room in London
  c.fillStyle = '#6b4a32'; c.fillRect(-1000, -600, W + 2000, 2000);
  for (let x = -1000; x < W + 1000; x += 120) { c.fillStyle = hash(x, 3) > .5 ? 'rgba(0,0,0,.08)' : 'rgba(255,220,180,.05)'; c.fillRect(x, -600, 116, 1460); }
  for (const x of [300, 1500]) { c.beginPath(); c.rect(x, -600, 36, 1460); fs(c, '#4a301e', 3); }
  c.beginPath(); c.rect(1640, 120, 220, 260); c.fillStyle = '#141a3a'; c.fill(); c.lineWidth = 12; c.strokeStyle = '#3a2414'; c.stroke();
  c.save(); c.beginPath(); c.rect(1640, 120, 220, 260); c.clip(); for (let i = 0; i < 20; i++) { ell(c, 1640 + hash(i, 61) * 220, 120 + hash(i, 62) * 260, 1.5 + hash(i, 63) * 1.5); c.fillStyle = '#fff'; c.fill(); } c.restore();
  ground(c, 860, '#5a3e2a', '#3a2818');
  c.beginPath(); c.rect(40, 300, 230, 560); c.fillStyle = '#1e2a5a'; c.fill(); c.lineWidth = 10; c.strokeStyle = '#3a2414'; c.stroke();   // the door
}
function candle(c, x, y, t, s = 1) {
  c.save(); c.translate(x, y); c.scale(s, s); rr(c, -14, -90, 28, 90, 6); fs(c, '#f6efe0', 3);
  const f = Math.sin(t * 9) * 3; c.beginPath(); c.moveTo(-9, -96); c.quadraticCurveTo(-12, -120, f, -140); c.quadraticCurveTo(12, -120, 9, -96); c.closePath(); c.fillStyle = '#ffd84a'; c.fill(); c.restore();
  c.save(); c.globalCompositeOperation = 'lighter'; glow(c, x, y - 118 * s, 700 * s, '255,190,110', .38 + Math.sin(t * 7) * .03); c.restore();
}
function table(c, x, y, s = 1) { c.save(); c.translate(x, y); c.scale(s, s); rr(c, -120, -150, 240, 24, 6); fs(c, '#8a5a32'); for (const lx of [-100, 86]) { rr(c, lx, -130, 16, 130, 4); fs(c, '#6b4428', 3); } c.restore(); }
function bench(c, x, y, s = 1) { c.save(); c.translate(x, y); c.scale(s, s); rr(c, -100, -76, 200, 20, 6); fs(c, '#7a4a2a'); for (const lx of [-86, 70]) { rr(c, lx, -58, 16, 58, 4); fs(c, '#5a3a20', 3); } c.restore(); }
function crowdRow(c, t, y, s, seed, cheer = 0, x0 = -300, x1 = W + 300) {   // people standing in a row, seen from behind the action
  for (let i = 0, x = x0; x < x1; i++, x += 58 * s) { const k = hash(i, seed), j = cheer * Math.abs(Math.sin(t * (5 + k * 4) + k * 9)) * 10 * s;
    rr(c, x - 22 * s, y - 70 * s - j, 44 * s, 80 * s, 18 * s); c.fillStyle = CROWD_COLS[Math.floor(k * 8)]; c.fill();
    ell(c, x, y - 92 * s - j, 22 * s); c.fillStyle = ['#e0a878', '#c4885a', '#f2c8a0', '#8a5a3a'][Math.floor(hash(i, seed + 1) * 4)]; c.fill();
    c.lineWidth = 2.5; c.strokeStyle = 'rgba(40,20,20,.45)'; c.stroke(); }
}
function burst(c, t, cols = ['#ffd84a', '#fff3c0'], n = 24) {   // comic-book rays filling the frame
  c.fillStyle = cols[1]; c.fillRect(-1000, -600, W + 2000, H + 1200);
  c.save(); c.translate(960, 540); c.rotate(t * .4); c.fillStyle = cols[0];
  for (let i = 0; i < n; i++) { c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, 2400, i / n * TAU, (i + .5) / n * TAU); c.closePath(); c.fill(); } c.restore();
}
function popText(c, text, x, y, size, k, col = '#ffd84a', stroke = 'rgba(90,40,10,.7)') {
  if (k <= 0) return; const sc = k < 1 ? .5 + .5 * ease(k) + Math.sin(k * Math.PI) * .2 : 1;
  c.save(); c.translate(x, y); c.scale(sc, sc); c.globalAlpha = clamp(k * 2); c.font = `600 ${size}px Fredoka`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
  c.lineWidth = size * .16; c.strokeStyle = stroke; c.strokeText(text, 0, 0); c.fillStyle = col; c.fillText(text, 0, 0); c.restore();
}
function bubble(c, x, y, text, k, size = 52, tail = [-40, 60], think = false) {
  if (k <= 0) return; c.save(); c.globalAlpha = clamp(k * 3); c.translate(x, y); const sc = .6 + .4 * ease(k * 2); c.scale(sc, sc);
  c.font = `600 ${size}px Fredoka`; const w = text ? c.measureText(text).width + 70 : 240, h = text ? size * 1.7 : 170;
  if (think) { for (const [dx, dy, r] of [[tail[0] * .5, tail[1] * .5 + h / 2, 14], [tail[0], tail[1] + h / 2, 9]]) { ell(c, dx, dy, r); fs(c, '#fffaf0', 4); } }
  else { c.beginPath(); c.moveTo(-20, h / 2 - 4); c.lineTo(tail[0], tail[1] + h / 2); c.lineTo(20, h / 2 - 4); c.closePath(); c.fillStyle = '#fffaf0'; c.fill(); c.strokeStyle = INK; c.lineWidth = 4; c.stroke(); }
  c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, think ? h / 2 : 26); fs(c, '#fffaf0', 6);
  if (text) { c.fillStyle = '#2b1d14'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(text, 0, 4); }
  c.restore();
}
function hearts(c, x, y, t, k, s = 1) {
  for (let j = 0; j < 4; j++) { const q = ((t - j * .45) * .55) % 1; if (q < 0 || k <= 0) continue; const a = clamp(q * 5) * clamp((1 - q) * 2.5) * k;
    c.save(); c.globalAlpha = a; c.translate(x + Math.sin(j * 2.3 + q * 4) * 30 * s, y - q * 220 * s); c.scale(s * (1 + q * .4), s * (1 + q * .4));
    c.beginPath(); c.moveTo(0, 14); c.bezierCurveTo(-26, -2, -14, -24, 0, -10); c.bezierCurveTo(14, -24, 26, -2, 0, 14); c.closePath(); fs(c, '#ff5a7a', 4); c.restore(); }
}
function confetti(c, t, k, seed = 1, n = 120) {
  if (k <= 0) return; const cols = ['#e2443a', '#f2c23a', '#3a86d8', '#4aa04a', '#e86a9a', '#ffffff'];
  for (let i = 0; i < n; i++) { const x = hash(i, seed) * 2200 - 140 + Math.sin(t * 2 + i) * 30, y = ((hash(i, seed + 1) * 1300 + t * (120 + hash(i, seed + 2) * 120)) % 1300) - 150;
    c.save(); c.globalAlpha = k; c.translate(x, y); c.rotate(t * 4 + i); c.fillStyle = cols[i % 6]; c.fillRect(-6, -3, 12, 6); c.restore(); }
}
// the knight-on-a-horse constellation; k draws it in, star by star
const CONST = [[0, 0], [60, -30], [130, -20], [180, -60], [210, -110], [250, -100], [230, -50], [190, 10], [120, 30], [60, 40], [20, 100], [140, 100], [170, 90], [100, -90], [120, -150], [150, -200]];
const CLINKS = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3], [2, 7], [7, 8], [8, 9], [9, 0], [9, 10], [8, 11], [7, 12], [1, 13], [13, 14], [14, 15]];
function constellation(c, x, y, s, k, t) {
  if (k <= 0) return; c.save(); c.translate(x, y); c.scale(s, s);
  CLINKS.forEach(([a, b], i) => { const q = clamp(k * CLINKS.length - i); if (q <= 0) return; const [x0, y0] = CONST[a], [x1, y1] = CONST[b];
    c.beginPath(); c.moveTo(x0, y0); c.lineTo(lerp(x0, x1, q), lerp(y0, y1, q)); c.lineWidth = 2.5 / s; c.strokeStyle = 'rgba(230,240,255,.85)'; c.stroke(); });
  CONST.forEach(([px, py], i) => { const q = clamp(k * CONST.length - i); if (q <= 0) return; c.save(); c.globalCompositeOperation = 'lighter'; glow(c, px, py, 26 / s * q, '220,230,255', .9); c.restore();
    ell(c, px, py, 4 / s * q); c.fillStyle = '#fff'; c.fill(); });
  c.restore();
}
function bigStar(c, x, y, r, rot = 0) {
  c.save(); c.globalCompositeOperation = 'lighter'; glow(c, x, y, r * 3, '255,240,180', .5); c.restore();
  c.save(); c.translate(x, y); c.rotate(rot); c.beginPath(); for (let i = 0; i < 10; i++) { const q = i % 2 ? r * .45 : r; c.lineTo(Math.cos(i * Math.PI / 5 - Math.PI / 2) * q, Math.sin(i * Math.PI / 5 - Math.PI / 2) * q); } c.closePath(); fs(c, '#fff3b0', 6); c.restore();
}
function sparkle(c, x, y, r, rot = 0, col = '#fffbe0') { if (r <= .5) return; c.save(); c.translate(x, y); c.rotate(rot); c.fillStyle = col;
  c.beginPath(); for (let i = 0; i < 8; i++) { const q = i % 2 ? r * .22 : r; c.lineTo(Math.cos(i * Math.PI / 4) * q, Math.sin(i * Math.PI / 4) * q); } c.fill(); c.restore(); }
function scroll(c, x, y, k, lines, seal = 0, tt = 9) {   // a scroll unrolling, its words and a wax seal
  const w = 900 * ease(k); c.save(); c.translate(x, y);
  c.beginPath(); c.rect(-w / 2, -150, w, 300); fs(c, '#fbf0d0'); for (const s of [-1, 1]) { rr(c, s * w / 2 - 22, -175, 44, 350, 20); fs(c, '#e8d6a8'); }
  if (k > .9) { c.save(); c.beginPath(); c.rect(-w / 2, -150, w, 300); c.clip(); c.fillStyle = '#5a3a20'; c.textAlign = 'center';
    lines.forEach(([txt, size, font, yy, a0]) => { const q = clamp((tt - a0) * 2); if (q <= 0) return; c.globalAlpha = q; c.font = `${font} ${size}px ${font === 'italic' ? '"Snell Roundhand", "Apple Chancery", "Hoefler Text", serif' : 'Fredoka'}`; c.fillText(txt, 0, yy); });
    c.restore(); }
  if (seal > 0) { const s = 1 + (1 - ease(seal)) * 1.2; c.save(); c.translate(300, 90); c.scale(s, s); c.globalAlpha = clamp(seal * 2); ell(c, 0, 0, 42); fs(c, '#c8282e'); c.font = 'italic 40px "Snell Roundhand", serif'; c.fillStyle = '#ffd0c0'; c.textAlign = 'center'; c.fillText('U', 0, 14); c.restore(); }
  c.restore();
}
function haystack(c, x, y, s) { c.save(); c.translate(x, y); c.scale(s, s); c.beginPath(); c.moveTo(-170, 0); c.quadraticCurveTo(-150, -230, 0, -250); c.quadraticCurveTo(150, -230, 170, 0); c.closePath(); fs(c, '#e8c24a');
  c.strokeStyle = 'rgba(160,110,30,.5)'; c.lineWidth = 3; for (let i = 0; i < 14; i++) { const a = -150 + i * 22; c.beginPath(); c.moveTo(a, -10); c.lineTo(a * .6 + 6, -200 + Math.abs(a) * .3); c.stroke(); } c.restore(); }
function stage(c, t) {
  sky(c, ['#f6b07a', '#ffe0b0']); sunDisc(c, 1100, 260, 50); clouds(c, t, '255,240,225', .8);
  tent(c, 160, 760, 1.2, '#ffffff', '#8a4ab8'); tent(c, 1780, 760, 1.2, '#ffffff', '#2ab8b0');
  ground(c, 740, '#7cc060', '#5aa046');
  rr(c, 380, 680, 1160, 120, 6); fs(c, '#a8703e'); c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(380, 760, 1160, 40);
  c.beginPath(); c.rect(360, -40, 1200, 50); fs(c, '#a8302a');
  for (const s of [-1, 1]) { const x = s < 0 ? 400 : 1520; c.beginPath(); c.moveTo(x - 60 * s * -1, 0); c.quadraticCurveTo(x + s * 30, 300, x - s * 80, 700); c.lineTo(x + s * 50, 700); c.quadraticCurveTo(x + s * 60, 300, x + s * 60, 0); c.closePath(); fs(c, '#c8382e'); }
  bunting(c, 30, t, 400, 1520);
}
function bed(c, x, y) { c.save(); c.translate(x, y); rr(c, -260, -120, 520, 60, 10); fs(c, '#8a5a32'); for (const lx of [-250, 230]) { rr(c, lx, -150, 22, 150, 6); fs(c, '#6b4428', 3); } c.restore(); }
function armorStand(c, x, y, s = 1, glowK = 0, t = 0) {
  c.save(); c.translate(x, y); c.scale(s, s);
  if (glowK > 0) { rays(c, 0, -250, t, '255,245,210', .12 * glowK, 18, 1400); c.save(); c.globalCompositeOperation = 'lighter'; glow(c, 0, -250, 420, '255,240,200', .6 * glowK); c.restore(); }
  if (!glowK) { rr(c, -8, -260, 16, 260, 4); fs(c, '#5a3a22', 3); rr(c, -60, -10, 120, 14, 4); fs(c, '#5a3a22', 3); }
  c.beginPath(); c.moveTo(-70, -330); c.quadraticCurveTo(-90, -250, -60, -170); c.lineTo(60, -170); c.quadraticCurveTo(90, -250, 70, -330); c.quadraticCurveTo(0, -350, -70, -330); c.closePath();
  fs(c, lin(c, -80, 0, 80, 0, [[0, '#8c97a8'], [.4, '#ffffff'], [.6, '#d3dbe6'], [1, '#7b8698']]));
  for (const sx of [-1, 1]) { ell(c, sx * 78, -318, 30, 22); fs(c, '#c9d2de'); }
  if (!glowK) { c.beginPath(); c.moveTo(-40, -350); c.quadraticCurveTo(-46, -440, 0, -446); c.quadraticCurveTo(46, -440, 40, -350); c.closePath(); fs(c, '#c3cddb'); rr(c, -30, -410, 60, 8, 3); fs(c, '#4a5060', 2); }
  if (glowK) sparkle(c, 60, -330, 30, t * 2);
  c.restore();
}
function trophy(c, x, y, s) { c.save(); c.translate(x, y); c.scale(s, s); c.beginPath(); c.moveTo(-60, -140); c.quadraticCurveTo(-60, -40, 0, -30); c.quadraticCurveTo(60, -40, 60, -140); c.closePath(); fs(c, '#f2c23a');
  for (const sx of [-1, 1]) { c.beginPath(); c.arc(sx * 66, -110, 22, -Math.PI / 2, Math.PI / 2, sx < 0); ink(c, 8, '#d9a830'); } rr(c, -10, -30, 20, 40, 3); fs(c, '#d9a830', 3); rr(c, -40, 8, 80, 18, 4); fs(c, '#a8702a', 3); c.restore(); }
function flags(c, y, t, col = '#2a2834', x0 = -200) {
  for (let i = 0; i < 9; i++) { const x = x0 + i * 300; c.beginPath(); c.rect(x - 4, y - 280, 8, 280); c.fillStyle = col; c.fill();
    c.beginPath(); c.moveTo(x, y - 280); c.quadraticCurveTo(x + 50, y - 270 + Math.sin(t * 3 + i) * 8, x + 90, y - 276); c.lineTo(x + 90, y - 220); c.quadraticCurveTo(x + 40, y - 216 + Math.sin(t * 3 + i + 1) * 8, x, y - 226); c.closePath(); c.fill(); }
}
function memoryCircle(c, k, draw, cx = 960, cy = 460, R = 380) {   // a sepia memory in a circle over a cream veil
  if (k <= 0) return; c.save(); c.globalAlpha = k * .9; c.fillStyle = '#f2e6cc'; c.fillRect(-1000, -600, W + 2000, H + 1200); c.globalAlpha = k;
  c.beginPath(); c.arc(cx, cy, R * (.86 + .14 * ease(k)), 0, TAU); c.save(); c.clip(); c.fillStyle = '#efe2c4'; c.fillRect(cx - R, cy - R, R * 2, R * 2); draw(c); c.restore();
  c.lineWidth = 12; c.strokeStyle = '#8a5a32'; c.stroke(); c.restore();
}
