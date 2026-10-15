// The remake, pages 4 to 8: Glinda, the Scarecrow, the Tin Woodman, the Lion, and the golden road to the Emerald City.

// ---------- places ----------
function pastelLand(c, cam, t) {   // Munchkin country in Glinda's soft light
  layer(c, cam, 0, g => { g.fillStyle = lin(g, 0, -400, 0, 760, [[0, '#8cc4ff'], [.6, '#d8e8ff'], [1, '#ffe8f4']]); g.fillRect(-2000, -1500, W + 4000, 2600); sun(g, 700, -100, 700, '255,236,250'); clouds(g, t, CLOUDS, 5, .9, '255,245,252'); });
  layer(c, cam, .2, g => hillsW(g, 0, 640, 30, '#c4b8ec', .004));
  layer(c, cam, .45, g => { hillsW(g, 300, 700, 30, '#94cc8a', .003); for (let i = 0; i < 5; i++) put(g, munchkin, 1450 + i * 90, 760, .55, { hop: 6, blink: blink(t, i) }, t + i, true); });
  layer(c, cam, 1, g => { g.fillStyle = lin(g, 0, 840, 0, 1300, [[0, '#7cc86a'], [1, '#56a84a']]); g.fillRect(-2000, 840, W + 4000, 1200);
    for (const f of FLOWERS) flower(g, f.x * 1.3 - 300, f.y + 30, f.s, Math.sin(t * 2 + f.p), f.col); });
}
function wideRoad(c, cam, t, sunset = false, glow = 1) {   // the yellow brick road winding away to the Emerald City
  layer(c, cam, 0, g => { g.fillStyle = sunset ? lin(g, 0, -300, 0, 700, [[0, '#3a3a7c'], [.5, '#d8737c'], [.85, '#ffb574'], [1, '#ffe0a8']]) : lin(g, 0, -300, 0, 700, [[0, '#5cb6f2'], [.7, '#bfe6ff'], [1, '#fff3d0']]);
    g.fillRect(-2000, -1500, W + 4000, 2600); sun(g, sunset ? 1300 : 260, sunset ? 600 : 80, 600, sunset ? '255,226,160' : '255,248,210'); if (!sunset) clouds(g, t, CLOUDS); });
  // the road winds across the field, over the hills, and up to the city's gate
  layer(c, cam, .08, g => { hillsW(g, 0, 650, 30, sunset ? '#b39acb' : '#a6c8e8', .004); brickRibbon(g, [[1240, 720], [1250, 690], [1320, 676], [1300, 663]], 16, 7); emeraldCity(g, 1300, 662, .55, t, glow); cityGate(g, 1300, 663, .3); });
  layer(c, cam, .3, g => { hillsW(g, 300, 710, 26, sunset ? '#c98f86' : '#8ccb7a', .005); hillRoad(g, 300, 710, 26, .005, [[1080, 790], [1160, 740], [1230, 700], [1250, 680]], 34, 18); });
  layer(c, cam, .6, g => { hillsW(g, 900, 780, 30, sunset ? '#b19a62' : '#6cb85a', .003); hillRoad(g, 900, 780, 30, .003, [[1250, 860], [1150, 800], [1060, 760], [1040, 730]], 64, 36); });
  layer(c, cam, 1, g => { g.fillStyle = sunset ? '#a99050' : '#5ea84c'; g.fillRect(-2500, 800, W + 5000, 1400);
    for (const p of POP) { const x = p.x * .7 - 200, y = 860 + (p.y - 600) * 3; ell(g, x, y, p.r * .9, p.r * .7); g.fillStyle = sunset ? '#e2483e' : '#ff4a3d'; g.fill(); }   // poppies beside the road, not on it
    g.save(); g.beginPath(); g.rect(-2500, 800, W + 5000, 1400); g.clip(); brickRibbon(g, [[-200, 1320], [560, 1010], [1000, 880], [1260, 820], [1300, 780]], 640, 80); g.restore(); });
}
// the side view of the road for tracking shots: far hills and the city, a cornfield, the road the characters walk on
function sideRoad(c, cam, t, o = {}) {
  const sunset = o.sunset ?? true, cityGlow = o.glow ?? 1;
  layer(c, cam, 0, g => { g.fillStyle = sunset ? lin(g, 0, -300, 0, 760, [[0, '#3a3a7c'], [.48, '#d8737c'], [.8, '#ffb574'], [1, '#ffe0a8']]) : lin(g, 0, -300, 0, 760, [[0, '#4aa6ea'], [.7, '#cbe8ff'], [1, '#fff4d8']]);
    g.fillRect(-2000, -1500, W + 4000, 2600); sun(g, o.sunX ?? 1650, o.sunY ?? 520, 700, sunset ? '255,226,160' : '255,248,220'); });
  layer(c, cam, .04, g => { hillsW(g, 0, 690, 60, sunset ? '#b39acb' : '#a8c4ea', .0035); if (o.city) emeraldCity(g, o.city, 700, .62, t, cityGlow); });
  layer(c, cam, .15, g => hillsW(g, 200, 735, 40, sunset ? '#cf9488' : '#9cc8a0', .005));
  layer(c, cam, .3, g => hillsW(g, 700, 790, 34, sunset ? '#b19a62' : '#7cba6a', .004));
  layer(c, cam, .6, g => { for (let i = -60; i < 260; i++) { const x = i * 16, h = 70 + hash(i) * 60, lean = (hash(i, 1) - .5) * 14 + Math.sin(t * 1.4 + i * .2) * 5;
      g.beginPath(); g.moveTo(x, 862); g.quadraticCurveTo(x + lean * .3, 862 - h * .6, x + lean, 862 - h); g.lineWidth = 4; g.strokeStyle = sunset ? '#7d4f3a' : '#6a8a3a'; g.stroke();
      ell(g, x + lean, 862 - h - 6, 3, 9); g.fillStyle = sunset ? '#ffe6a0' : '#f2d870'; g.fill(); } });
  layer(c, cam, 1, g => { g.fillStyle = sunset ? '#6f6a3a' : '#5ea84c'; g.fillRect(-3000, 846, W + 9000, 600); brickRoadW(g, 852, 1010, cam.x); });
}
const roadBend = x => Math.sin(x * .0019) * 16 + Math.sin(x * .00073 + 1) * 10;   // how far the side road bends toward us (+) or away
function brickRoadW(c, top, bot, cx) {
  const quad = (x0, x1, y0, y1) => { const n = Math.max(1, Math.ceil((x1 - x0) / 40)); c.beginPath();
    for (let i = 0; i <= n; i++) { const x = lerp(x0, x1, i / n); c.lineTo(x, y0 + roadBend(x)); } for (let i = n; i >= 0; i--) { const x = lerp(x0, x1, i / n); c.lineTo(x, y1 + roadBend(x)); } c.closePath(); };
  let y = top; for (let r = 0; r < 7; r++) { const h = (bot - top) / 7, len = h * 3.4 + r * 4, off = (r % 2) * len * .5, x0 = cx - 1800;
    for (let x = Math.floor((x0 - off) / len) * len + off; x < cx + 1800; x += len) { const tone = hash(Math.round(x / len), r) * .14;
      quad(x, x + len, y, y + h); c.fillStyle = lin(c, 0, y + roadBend(x), 0, y + h + roadBend(x), [[0, '#ffdc84'], [1, '#efb646']]); c.fill(); c.fillStyle = `rgba(${tone > .07 ? '255,255,220' : '120,60,20'},${tone})`; c.fill();
      quad(x, x + 2.5, y, y + h); c.fillStyle = 'rgba(150,90,40,.55)'; c.fill(); }
    quad(cx - 1800, cx + 1800, y + h - 1.5, y + h + .5); c.fillStyle = 'rgba(150,90,40,.5)'; c.fill(); y += h; }
  quad(cx - 1800, cx + 1800, top - 4, top + 6); c.fillStyle = 'rgba(255,240,190,.45)'; c.fill();
}
function cornFront(c, cam, t, dx = 0) {   // tall corn passing close to the lens
  blurLayer(c, cam, 1.8, 8, g => { g.fillStyle = 'rgba(46,24,50,.92)';
    for (let i = -3; i < 12; i++) { const x = i * 1100 + 600 + hash(i) * 300 + dx; g.beginPath(); g.moveTo(x - 24, 1400); g.quadraticCurveTo(x - 16, 700, x + 6, 120); g.quadraticCurveTo(x + 2, 700, x + 24, 1400); g.closePath();
      for (let k = 0; k < 7; k++) { const ly = 1260 - k * 150 - hash(i, k) * 40, d = k % 2 ? 1 : -1, L = 240 + hash(i, k + 9) * 160; g.moveTo(x, ly); g.quadraticCurveTo(x + d * L * .55, ly - 130, x + d * L, ly + 40); g.quadraticCurveTo(x + d * L * .5, ly - 76, x, ly + 30); }
      g.fill(); } });
}
function forest(c, cam, t) {   // a deep green wood with shafts of light
  layer(c, cam, 0, g => { g.fillStyle = lin(g, 0, -400, 0, 900, [[0, '#cfe8c0'], [1, '#e8f4d4']]); g.fillRect(-2000, -1500, W + 4000, 2600); });
  // three rows of trees, the far ones pale and hazy: tapered trunks with bark, and leafy crowns overhead
  for (const [p, bark, leaf, n, wmin] of [[.15, '#a8b898', '#a6cc9a', 14, 40], [.35, '#7a7458', '#6ea468', 11, 60], [.65, '#5a4632', '#3f7a44', 8, 90]]) layer(c, cam, p, g => {
    for (let i = -4; i < n + 4; i++) { const x = i * (2400 / n) + hash(i, p * 10) * 120 - 300, w = wmin + hash(i, p * 20) * 40;
      g.beginPath(); g.moveTo(x - w * .7, 900); g.quadraticCurveTo(x - w * .45, 300, x - w * .4, -600); g.lineTo(x + w * .4, -600); g.quadraticCurveTo(x + w * .45, 300, x + w * .7, 900); g.closePath(); g.fillStyle = bark; g.fill();
      g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(x - w * .1, -600, w * .5, 1500); g.strokeStyle = 'rgba(0,0,0,.15)'; g.lineWidth = 3; for (let k = 0; k < 6; k++) { g.beginPath(); g.moveTo(x - w * .3, 100 + k * 130); g.quadraticCurveTo(x, 80 + k * 130, x + w * .2, 110 + k * 130); g.stroke(); } }
    g.fillStyle = bark; g.fillRect(-3000, 840, W + 6000, 1000);
    for (let i = -8; i < 34; i++) { ell(g, i * 120 + hash(i, p * 30) * 80 - 400, -260 + hash(i, p * 40) * 260, 170, 130); g.fillStyle = leaf; g.fill(); ell(g, i * 120 + hash(i, p * 30) * 80 - 430, -300 + hash(i, p * 40) * 260, 90, 60); g.fillStyle = 'rgba(255,255,220,.12)'; g.fill(); } });
  layer(c, cam, .5, g => { g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 7; i++) { const x = 300 + i * 260 + Math.sin(t * .2 + i) * 20;
    g.beginPath(); g.moveTo(x, -300); g.lineTo(x + 90, -300); g.lineTo(x + 360, 1000); g.lineTo(x + 200, 1000); g.closePath(); g.fillStyle = lin(g, 0, -300, 0, 1000, [[0, 'rgba(255,250,210,.22)'], [1, 'rgba(255,250,210,0)']]); g.fill(); } g.restore(); });
  layer(c, cam, 1, g => { g.fillStyle = lin(g, 0, 860, 0, 1300, [[0, '#5a9a4a'], [1, '#3a7034']]); g.fillRect(-3000, 860, W + 6000, 800);
    for (let i = 0; i < 60; i++) { ell(g, hash(i, 51) * 3000 - 600, 880 + hash(i, 52) * 200, 30, 8); g.fillStyle = 'rgba(255,250,200,.18)'; g.fill(); }
    for (const f of FLOWERS.slice(0, 14)) flower(g, f.x * 1.2 - 200, f.y + 80, f.s * .7, Math.sin(t * 2 + f.p), f.col); });
}
function fernsFront(c, cam, t, col = 'rgba(20,50,24,.92)') { blurLayer(c, cam, 1.7, 7, g => { g.fillStyle = col; g.beginPath();
  for (let i = -4; i < 14; i++) { const x = i * 300 + hash(i, 61) * 150; for (let k = -3; k <= 3; k++) { const a = k * .3 + Math.sin(t * 1.5 + i) * .05, L = 260 + hash(i, k + 62) * 120;
    g.moveTo(x, 1300); g.quadraticCurveTo(x + Math.sin(a) * L * .6, 1300 - L * .8, x + Math.sin(a) * L, 1300 - L * .9 + Math.abs(k) * 30); g.quadraticCurveTo(x + Math.sin(a) * L * .5 + 18, 1300 - L * .6, x + 10, 1300); } } g.fill(); }); }

// ---------- 04 Glinda and the silver shoes ----------
shot(58.8, 64.8, 'glinda', u => ({ x: 960, y: lerp(260, 500, ease((u - 1) / 4)), z: 1.05 }), (c, t, u, cam) => {
  pastelLand(c, cam, t); const gy = lerp(-300, 850, ease((u - .4) / 4.6));
  layer(c, cam, 1, g => { g.save(); g.globalCompositeOperation = 'lighter'; glow(g, 760, gy - 160, 420, '255,200,240', .5); glow(g, 850, gy - 330, 70, '255,250,200', .6); g.restore(); puff(g, 660, gy + 20, 1.5, .95); puff(g, 560, gy + 50, 1.1, .95);
    for (let i = 0; i < 12; i++) sparkle(g, 760 + Math.cos(t * 2 + i) * 200, gy - 160 + Math.sin(t * 2.6 + i) * 200, 14 * Math.abs(Math.sin(t * 3 + i)), t, '#fff0fa'); });
  put(c, glinda, 760, gy, 1, { blink: blink(t, 2) }, t);
  put(c, dor, 1300, 900, .9, { walk: 0, mood: 'wow', blink: false, hold: true, tilt: .28 }, t, true);
});
shot(64.8, 71.6, 'glinda', push(960, 600, 1.25, 1.45, 6.8), (c, t, u, cam) => {
  pastelLand(c, cam, t); layer(c, cam, 1, g => { puff(g, 600, 870, 1.4, .95); puff(g, 520, 900, 1.1, .95); });
  put(c, glinda, 700, 850, 1, { blink: blink(t, 2), mouth: voice('glinda', t), armF: lerp(1.6, 1.0, ease((u - 4) / 1)) }, t);
  put(c, dor, 1180, 900, .9, { walk: 0, mood: u > 4 ? 'wow' : 'calm', blink: blink(t), hold: true, tilt: .12 }, t, true);
  if (u > 4.2) { const k = ease((u - 4.2) / 2.4); for (const o of [0, 30]) { const x = lerp(840, 1180 + o, k), y = lerp(560, 900, k) - Math.sin(k * Math.PI) * 140;
    ell(c, x, y, 20, 10); c.fillStyle = lin(c, x - 20, 0, x + 20, 0, [[0, '#fff'], [.5, '#b9c4da'], [1, '#eef2fa']]); c.fill(); ink(c, 3); c.stroke(); sparkle(c, x + 14, y - 10, 16, t * 3); } }
});
shot(71.6, 75.4, 'glinda', u => ({ x: 1180, y: lerp(880, 680, ease((u - 1.4) / .9)), z: lerp(2.8, 1.9, ease((u - 1.4) / .9)) }), (c, t, u, cam) => {
  pastelLand(c, cam, t);
  put(c, dor, 1180, 900, .9, { walk: 0, mood: u > 1.6 ? 'happy' : 'wow', blink: false, hold: true, shoes: u > .3 ? 'silver' : 'boots', sparkle: u > .3 ? Math.abs(Math.sin(t * 4)) : 0, tilt: u > 2 ? -.12 : 0 }, t, true);
  if (u > .2 && u < 1.4) for (let i = 0; i < 12; i++) { const k = (u - .2) / 1.2, q = i / 12 * TAU; sparkle(c, 1180 + Math.cos(q) * 90 * k, 890 + Math.sin(q) * 40 * k, 22 * (1 - k), t); }
});
shot(75.4, 82.4, 'glinda', u => ({ x: lerp(760, 1040, ease(u / 7)), y: lerp(760, 600, ease(u / 7)), z: lerp(1.5, 1.05, ease(u / 7)) }), (c, t, u, cam) => {
  wideRoad(c, cam, t);
  put(c, glinda, 420, 820, .62, { blink: blink(t, 2), mouth: voice('glinda', t), armF: 1.9 }, t);
  put(c, dor, 560, 1000, .7, { walk: 0, mood: 'happy', blink: blink(t), hold: true, tilt: .1 }, t);
  grassFront(c, cam, t, 'rgba(40,110,40,.85)', 1.6, 8, 9);
});

// ---------- 05 the Scarecrow, in the golden cornfield ----------
shot(81.4, 86.8, 'golden', u => ({ x: 500 + u * 210 + 260, y: 640, z: 1 }), (c, t, u, cam) => {
  sideRoad(c, cam, t, { sunX: 1500, sunY: 430 });
  layer(c, cam, 1, g => { const px = 2200; rr(g, px - 13, 380, 26, 520, 6); fillStroke(g, '#5a3a22'); rr(g, px - 140, 470, 280, 22, 6); fillStroke(g, '#5a3a22'); });
  put(c, scarecrow, 2200, 790, 1, { walk: 0, blink: true, armF: 1.55, armB: -1.55, mood: 'sad' }, t, true);   // facing the road Dorothy comes along
  const d = u * 210; put(c, dor, 500 + d, 930, 1, { walk: 1, ph: d / STR_D, mood: 'calm', blink: blink(t), shoes: 'silver' }, t);
  put(c, tot, 660 + d, 962, 1.3, { walk: 1, ph: d / (STR_T * 1.3), blink: blink(t, 2) }, t);
  cornFront(c, cam, t);
});
shot(86.8, 89.4, 'golden', push(2200, 520, 2.1, 2.25, 2.6), (c, t, u, cam) => {
  sideRoad(c, cam, t, { sunX: 2300, sunY: 400 });
  layer(c, cam, 1, g => { const px = 2200; rr(g, px - 13, 380, 26, 520, 6); fillStroke(g, '#5a3a22'); rr(g, px - 140, 470, 280, 22, 6); fillStroke(g, '#5a3a22'); });
  put(c, scarecrow, 2200, 790, 1, { walk: 0, blink: blink(t), armF: 1.55, armB: -1.55, mood: 'calm', mouth: voice('scarecrow', t) }, t, true);   // talking to Dorothy, who is to his left
});
shot(89.4, 92.5, 'golden', at(1900, 640, 1.25), (c, t, u, cam) => {
  sideRoad(c, cam, t, { sunX: 2300, sunY: 430 });
  layer(c, cam, 1, g => { const px = 2200; rr(g, px - 13, 380, 26, 520, 6); fillStroke(g, '#5a3a22'); rr(g, px - 140, 470, 280, 22, 6); fillStroke(g, '#5a3a22'); });
  const drop = ease((u - .8) / .9), sx = lerp(2200, 2050, drop), sy = lerp(790, 930, drop) - Math.sin(drop * Math.PI) * 60;
  put(c, dor, 1760, 930, 1, { walk: 0, mood: 'happy', blink: blink(t), shoes: 'silver', armF: u < 1.2 ? 2.4 : .2, bendF: .2, armB: .3, lean: u < 1.2 ? .06 : 0 }, t);   // reaching up with her far hand
  put(c, scarecrow, sx, sy, 1, { walk: 0, blink: blink(t, 2), armF: lerp(1.55, .3, drop), armB: lerp(-1.55, -.3, drop), mood: drop > .9 ? 'happy' : 'wow' }, t, true);
  if (drop > .9 && u < 2.6) for (let i = 0; i < 12; i++) { const k = (u - 1.7) / .9, q = i / 12 * Math.PI; layer(c, cam, 1, g => { g.save(); g.translate(2050 + Math.cos(q) * 120 * k, 930 - Math.sin(q) * 60 * k); g.rotate(q); g.fillStyle = `rgba(232,194,84,${1 - k})`; g.fillRect(-12, -2, 24, 4); g.restore(); }); }
  put(c, tot, 1580, 962, 1.3, { walk: 0, blink: blink(t, 2) }, t);
});
shot(92.5, 95.5, 'golden', push(2050, 640, 2.1, 2.25, 3), (c, t, u, cam) => {
  sideRoad(c, cam, t, { sunX: 2300, sunY: 430 });
  put(c, scarecrow, 2050, 930, 1, { walk: 0, blink: blink(t, 2), armF: u > .8 ? 2.6 : .4, mood: u > .8 ? 'sad' : 'happy', mouth: voice('scarecrow', t) }, t, true);
});
shot(95.5, 98.6, 'golden', push(1900, 640, 1.35, 1.5, 3.1), (c, t, u, cam) => {
  sideRoad(c, cam, t, { sunX: 1900, sunY: 470 });
  put(c, dor, 1760, 930, 1, { walk: 0, mood: 'happy', blink: blink(t), shoes: 'silver', talk: voice('dorothy', t), armB: 1.3, bendB: .2, tilt: .06 }, t);
  put(c, scarecrow, 2050, 930, 1, { walk: 0, blink: blink(t, 2), armF: 1.2, mood: u > 1 ? 'happy' : 'wow' }, t, true);
  put(c, tot, 1580, 962, 1.3, { walk: 0, blink: blink(t, 2) }, t);
  cornFront(c, cam, t, 500);
});

// ---------- 06 the Tin Woodman, in the forest ----------
shot(98.6, 104.2, 'forest', u => ({ x: lerp(700, 1050, ease(u / 5.6)), y: 560, z: lerp(1.05, 1.15, ease(u / 5.6)) }), (c, t, u, cam) => {
  forest(c, cam, t);
  put(c, tinWoodman, 1300, 900, 1.05, { walk: 0, blink: false, rust: 1, armF: 2.3, armB: .3, mood: 'sad' }, t, true);   // stuck, facing the friends who find him
  [[scarecrow, 0, 1], [dor, 160, 1], [tot, 300, 1.3]].forEach(([f, o, s], i) => { const w = walked(u, .4, -300 + o, 520 + o, 210);
    put(c, f, w.x, f === tot ? 935 : 905, s * .95, { walk: w.walk, ph: f === scarecrow ? stepPh(scarecrow, w.d, s * .95) : w.d / ((f === tot ? STR_T : STR_D) * s * .95), mood: u > 3 ? 'wow' : 'calm', blink: blink(t, i), shoes: 'silver' }, t); });
  fernsFront(c, cam, t);
});
shot(104.2, 106.8, 'forest', u => u < 1.3 ? { x: 520, y: 600, z: 2 } : { x: 1180, y: 880, z: 2.6 }, (c, t, u, cam) => {
  forest(c, cam, t);
  put(c, scarecrow, 520, 905, .95, { walk: 0, blink: false, armF: u < 1.3 ? 1.7 : .4, mood: 'happy', mouth: voice('scarecrow', t) }, t);
  layer(c, cam, 1, g => { g.save(); g.translate(1180, 895); g.rotate(.2); rr(g, -18, -30, 36, 48, 8); fillStroke(g, '#c3cddb', 3); g.beginPath(); g.moveTo(0, -30); g.lineTo(-40, -58); ink(g, 6); g.stroke(); g.restore();
    if (u > 1.3) sparkle(g, 1200, 860, 16 * Math.abs(Math.sin(t * 4)), t, '#ffffff'); });
  put(c, tinWoodman, 1300, 900, 1.05, { walk: 0, blink: false, rust: 1, armF: 2.3, armB: .3, mood: 'sad' }, t, true);   // stuck, facing the friends who find him
});
// things held in a hand: drawn by the character (its `item` hook), and they note where their working end is on screen
const HANDS = {};
const spot = (cc, key, x, y) => { HANDS[key] = cc.getTransform().transformPoint(new DOMPoint(x, y)); };
const oilCan = tip => (cc, x, y) => { cc.save(); cc.translate(x + 8, y - 4); cc.rotate(tip);   // the spout points the way she faces; tipping turns it down toward him
  cc.beginPath(); cc.arc(-14, -4, 13, Math.PI * .6, Math.PI * 1.5); cc.lineWidth = 4; cc.strokeStyle = '#7b8698'; cc.stroke();   // handle
  rr(cc, -14, -22, 30, 36, 8); fillStroke(cc, lin(cc, -14, 0, 16, 0, [[0, '#8c97a8'], [.4, '#eef3fa'], [1, '#7b8698']]), 3);
  cc.beginPath(); cc.moveTo(10, -14); cc.lineTo(54, -34); ink(cc, 7); cc.stroke(); cc.beginPath(); cc.moveTo(10, -14); cc.lineTo(54, -34); cc.lineWidth = 3; cc.strokeStyle = '#c3cddb'; cc.stroke();
  spot(cc, 'oil', 56, -35); cc.restore(); };
shot(106.8, 110.1, 'forest', push(1240, 560, 2.1, 2.3, 3.3), (c, t, u, cam) => {
  forest(c, cam, t); const oil = clamp(u / 3.3), pour = .3 + Math.max(0, Math.sin(u * 6)) * .2;
  put(c, tinWoodman, 1300, 900, 1.05, { walk: 0, blink: oil > .6 ? blink(t) : false, rust: 1 - oil, armF: 2.3 - oil * .4 + Math.sin(t * 9) * .03 * oil, armB: .45 + oil * .25, mood: oil > .7 ? 'wow' : 'sad' }, t, true);
  // Dorothy faces him and tips the oil can toward his stiff arm, the spout pointing at him
  put(c, dor, 1105, 905, .95, { walk: 0, mood: 'calm', blink: blink(t), armB: 1.5, bendB: .05, lean: .04, item: oilCan(pour) }, t);
  const z = cam.z, sp = HANDS.oil; c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
  for (let i = 0; i < 4; i++) { const k = (u * 1.8 + i / 4) % 1; ell(c, sp.x + k * 5 * z, sp.y + k * k * 34 * z, 2.6 * z, 3.8 * z); c.fillStyle = 'rgba(214,176,60,.95)'; c.fill(); }
  c.restore();
  if (Math.sin(t * 7) > .7) popWord(c, 'squeak!', 1420, 420, 40);
});
shot(110.1, 113.1, 'forest', push(1220, 520, 1.5, 1.65, 3), (c, t, u, cam) => {
  forest(c, cam, t);
  put(c, tinWoodman, 1300, 900, 1.05, { walk: 0, blink: blink(t), rust: 0, armF: .5 + Math.sin(u * 3) * .4, armB: .3 + Math.sin(u * 3 + 1) * .2, mood: 'happy', mouth: voice('tinWoodman', t) }, t, true);
  put(c, dor, 1020, 905, .95, { walk: 0, mood: 'happy', blink: blink(t), shoes: 'silver' }, t);
  put(c, scarecrow, 820, 905, .95, { walk: 0, mood: 'happy', blink: blink(t, 3) }, t);
  if (u < 1.2) for (let i = 0; i < 6; i++) sparkle(c, 1260 + Math.cos(i) * 140, 520 + Math.sin(i * 2) * 150, 18 * (1 - u / 1.2), t * 2 + i);
});
shot(113.1, 117.7, 'forest', push(1300, 590, 2.3, 2.5, 4.6), (c, t, u, cam) => {
  forest(c, cam, t);
  put(c, tinWoodman, 1300, 900, 1.05, { walk: 0, blink: blink(t), rust: 0, armF: u > .6 && u < 2 ? 1.2 + Math.abs(Math.sin(t * 9)) * .2 : .3, mood: 'sad', tears: u > 2.4 ? ((u * .8) % 1) : 0, mouth: voice('tinWoodman', t) }, t, true);
  if (u > .6 && u < 2 && Math.sin(t * 9) > .8) popWord(c, 'tonk', 1150, 520, 34, '#c3cddb');
});
shot(117.7, 120.1, 'forest', push(1100, 660, 1.4, 1.5, 2.4), (c, t, u, cam) => {
  forest(c, cam, t);
  put(c, scarecrow, 820, 905, .95, { walk: 0, mood: 'happy', blink: blink(t, 3) }, t);
  put(c, dor, 1040, 905, .95, { walk: 0, mood: 'happy', blink: blink(t), shoes: 'silver', talk: voice('dorothy', t), armB: 1.4, bendB: .3 }, t);
  put(c, tinWoodman, 1300, 900, 1.05, { walk: 0, blink: blink(t, 4), rust: 0, mood: 'happy', armF: .4 }, t, true);
  put(c, tot, 1160, 935, 1.25, { walk: 0, blink: blink(t, 2) }, t);
  fernsFront(c, cam, t);
});
function popWord(c, text, x, y, size, col = '#fff3d0') { c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.font = `600 ${size}px Fredoka`; c.textAlign = 'center'; c.lineJoin = 'round'; c.lineWidth = size * .2; c.strokeStyle = 'rgba(60,40,20,.7)'; c.strokeText(text, x, y); c.fillStyle = col; c.fillText(text, x, y); c.restore(); }

// ---------- 07 the cowardly Lion ----------
function deepWood(c, cam, t) { forest(c, cam, t); layer(c, cam, 1, g => { g.fillStyle = 'rgba(20,40,30,.25)'; g.fillRect(-3000, -1000, W + 6000, 3000); }); }
shot(120.1, 122.3, 'forest', u => ({ x: 960 + Math.sin(u * 40) * 14 * clamp(u - .9), y: 540, z: lerp(1.6, 1.25, ease(u / .5)) }), (c, t, u, cam) => {
  deepWood(c, cam, t); const leap = ease(u / .7);
  layer(c, cam, 1, g => { for (const [x, s] of [[700, 1.4], [1250, 1.2]]) { g.save(); g.translate(x, 940); g.scale(s, s); for (const [dx, dy, r] of [[-80, -60, 90], [40, -80, 100], [-10, -150, 90], [90, -150, 70]]) { ell(g, dx, dy, r); fillStroke(g, '#3f7a3a'); } g.restore(); } });
  put(c, lion, lerp(1100, 1000, leap), 940 - Math.sin(leap * Math.PI) * 120, lerp(.8, 1.15, leap), { walk: 0, blink: false, roar: u > .5 ? 1 : 0, mood: 'wow' }, t, true);   // leaping at the friends, who are to the left
  if (u > .9) popWord(c, 'ROAR!', 960, 260, 120, '#ffd84a');
});
shot(122.3, 126.8, 'forest', at(900, 640, 1.2), (c, t, u, cam) => {
  deepWood(c, cam, t);
  put(c, lion, 1350, 900, 1, { walk: 0, blink: false, roar: Math.max(0, Math.sin(t * 3)) * .6, mood: 'wow' }, t, true);
  put(c, tot, 980, 935, 1.4, { walk: 0, blink: false, talk: (t % .5) < .25 ? 1 : 0, lean: .1 }, t);
  for (const [f, x, s] of [[scarecrow, 520, .95], [dor, 700, .95], [tinWoodman, 300, 1]]) put(c, f, x, 905, s, { walk: 0, blink: false, mood: 'wow', shoes: 'silver', lean: -.06, armF: f === dor ? 1.2 : undefined }, t);
  if ((t % .5) < .25) popWord(c, 'woof!', 1060, 640, 48);
});
shot(126.8, 131.1, 'forest', push(1200, 600, 1.35, 1.5, 4.3), (c, t, u, cam) => {
  deepWood(c, cam, t); const sitK = ease(u / .8);
  put(c, lion, 1250, 900, 1, { walk: 0, sit: u > .4, blink: blink(t), mood: 'sad', tears: u > 1.6 ? ((u * .8) % 1) : 0 }, t, true);
  put(c, tot, 900, 935, 1.4, { walk: 0, blink: blink(t, 2), tilt: .15 }, t);
});
shot(131.1, 135.3, 'forest', push(1180, 600, 2.2, 2.4, 4.2), (c, t, u, cam) => {
  deepWood(c, cam, t);
  put(c, lion, 1250, 900, 1, { walk: 0, sit: true, blink: blink(t), mood: 'sad', tears: (u * .8) % 1, mouth: voice('lion', t) }, t, true);
});
shot(135.3, 138.3, 'forest', push(1000, 560, 2.2, 2.35, 3), (c, t, u, cam) => {
  deepWood(c, cam, t);
  put(c, tinWoodman, 1000, 900, 1.05, { walk: 0, blink: blink(t), rust: 0, mood: 'sad', tears: (t * .8) % 1 }, t);
});
shot(138.3, 142.1, 'forest', push(1170, 640, 1.7, 1.85, 3.8), (c, t, u, cam) => {
  deepWood(c, cam, t);
  put(c, lion, 1250, 900, 1, { walk: 0, sit: true, blink: blink(t), mood: u > 2 ? 'calm' : 'sad', tears: u < 2 ? (u * .8) % 1 : 0 }, t, true);
  put(c, dor, 1130, 905, .95, { walk: 0, mood: 'calm', blink: blink(t), shoes: 'silver', armF: 2.1 + Math.sin(t * 4) * .12, bendF: .2, armB: .2, lean: .06 }, t);   // her far hand on his mane
});
shot(142.1, 146.3, 'forest', push(980, 580, 1.15, 1.3, 4.2), (c, t, u, cam) => {
  deepWood(c, cam, t);
  put(c, tinWoodman, 300, 900, 1, { walk: 0, blink: blink(t, 4), rust: 0, mood: 'happy' }, t);
  put(c, scarecrow, 520, 905, .95, { walk: 0, blink: blink(t, 3), mood: 'happy' }, t);
  put(c, dor, 860, 905, .95, { walk: 0, mood: 'happy', blink: blink(t), shoes: 'silver', talk: voice('dorothy', t), armB: 1.3, bendB: .3 }, t);
  put(c, lion, 1250, 900, 1, { walk: 0, sit: u < 2.4, blink: blink(t), mood: u > 2.2 ? 'happy' : 'calm', mouth: voice('lion', t) }, t, true);
  put(c, tot, 1020, 935, 1.3, { walk: 0, blink: blink(t, 2) }, t);
});

// ---------- 08 side by side down the golden road, and the Emerald City ----------
shot(146.3, 152.1, 'golden', u => ({ x: 700 + u * 200 + 260, y: 640, z: 1 }), (c, t, u, cam) => {
  sideRoad(c, cam, t, { city: 1560, glow: .8 });
  const d = u * 200;
  [[lion, 120, .78], [tinWoodman, 400, .8], [scarecrow, 620, .82], [dor, 840, .84], [tot, 1020, 1.1]].forEach(([f, o, s], i) => {
    const x = 400 + o + d, y = f === tot ? 960 : 932;
    put(c, f, x, y, s, { walk: 1, ph: f === dor ? d / (STR_D * s) : f === tot ? d / (STR_T * s) : stepPh(f, d, s), mood: f === lion ? 'happy' : 'calm', blink: blink(t, i), shoes: 'silver' }, t); });
  cornFront(c, cam, t, 400);
});
shot(152.1, 157.5, 'emerald', u => u < 2.4 ? { x: 1060, y: 700, z: lerp(1.5, 1.62, u / 2.4) } : { x: lerp(1040, 1100, ease((u - 2.4) / 3)), y: 600, z: lerp(1.15, 1.05, ease((u - 2.4) / 3)) }, (c, t, u, cam) => {
  if (u < 2.4) {   // their faces turn green in the city's light
    sideRoad(c, cam, t, { sunX: 1700, sunY: 560 });
    layer(c, cam, 0, g => { g.save(); g.globalCompositeOperation = 'lighter'; glow(g, 1700, 560, 900, '120,255,170', .35 * ease(u / 1.2)); g.restore(); });
    [[tinWoodman, 640, .8], [scarecrow, 830, .82], [dor, 1020, .84], [lion, 1290, .78]].forEach(([f, x, s], i) => put(c, f, x, 932, s, { walk: 0, mood: 'wow', blink: false, shoes: 'silver', tilt: .1 }, t, false, { warm: [1700, 560, 1400, '120,255,170', .35 * ease(u / 1.2)] }));
  } else {
    wideRoad(c, cam, t, true, 1.6);
    [[lion, -150], [tinWoodman, -60], [scarecrow, 20], [dor, 90], [tot, 150]].forEach(([f, o], i) => put(c, f, 560 + o, 1000, f === tot ? .3 : .24, { walk: 0, blink: false, shoes: 'silver', mood: 'wow' }, t));
  }
});
