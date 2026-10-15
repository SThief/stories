// The remake, pages 9 to 14: the throne room, the Witch, the Wizard behind the screen, goodbye, and home again.
Object.assign(MOODS, { worried: { smile: -.35, brow: .9, big: .4, open: .2, lid: 0, look: 0 }, sure: { smile: .4, brow: -.55, big: 0, open: 0, lid: .14, look: 0 },
  proud: { smile: .9, brow: .1, big: .05, open: 0, lid: .2, look: 0 }, cross: { smile: -.4, brow: -1, big: .1, open: .35, lid: 0, look: 0 } });

// ---------- places ----------
function throneHall(c, cam, t, light = 1) {   // a long green hall of pillars, lit from below
  layer(c, cam, 0, g => { g.fillStyle = lin(g, 0, -400, 0, 1000, [[0, '#04140c'], [.6, '#0e3a22'], [1, '#1e6a3e']]); g.fillRect(-2000, -1500, W + 4000, 2800); });
  for (const [p, n, w, a] of [[.2, 10, 50, .35], [.45, 7, 80, .6], [.8, 5, 130, 1]]) layer(c, cam, p, g => {
    for (let i = -3; i < n + 3; i++) { const x = i * (2200 / n) - 140, y0 = -600, y1 = 860;
      g.fillStyle = lin(g, x - w / 2, 0, x + w / 2, 0, [[0, '#0e4a2a'], [.5, `rgba(127,224,165,${a})`], [1, '#0a3a20']]); g.fillRect(x - w / 2, y0, w, y1 - y0);
      g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(x - w / 2 - 10, y1 - 30, w + 20, 30); } });
  layer(c, cam, 1, g => { g.fillStyle = lin(g, 0, 860, 0, 1300, [[0, '#2a8a52'], [1, '#0e4a2a']]); g.fillRect(-3000, 860, W + 6000, 800);
    g.save(); g.globalCompositeOperation = 'lighter'; glow(g, 960, 860, 900, '120,255,170', .25 * light); g.restore(); });
}
function smoke(c, cam, t, col = '150,255,190', a = .12) { layer(c, cam, .9, g => { for (let i = 0; i < 10; i++) { const q = t * .3 + i; ell(g, 960 + Math.cos(q) * 420, 520 + Math.sin(q * 1.3) * 200, 160, 70); g.fillStyle = `rgba(${col},${a})`; g.fill(); } }); }
function castleStorm(c, cam, t) {   // the Witch's yellow castle under a purple storm
  layer(c, cam, 0, g => { g.fillStyle = lin(g, 0, -400, 0, 800, [[0, '#14082a'], [.6, '#4a2a6a'], [1, '#a8607a']]); g.fillRect(-2000, -1500, W + 4000, 2600);
    for (let i = 0; i < 12; i++) { const x = ((hash(i, 3) * 3000 + t * 50) % 3400) - 700, y = -100 + hash(i, 4) * 400; ell(g, x, y, 320, 70); g.fillStyle = 'rgba(30,14,50,.5)'; g.fill(); } });
  layer(c, cam, .25, g => { g.save(); g.translate(1450, 720); g.beginPath(); g.moveTo(-500, 200); g.quadraticCurveTo(0, -180, 500, 200); g.closePath(); g.fillStyle = '#2a1e44'; g.fill();
    for (const [x, h, w] of [[-90, 160, 60], [0, 240, 70], [90, 160, 60], [-150, 100, 46], [150, 100, 46]]) { g.fillStyle = '#c99a2a'; g.fillRect(x - w / 2, -60 - h, w, h + 60); g.beginPath(); g.moveTo(x - w / 2 - 8, -60 - h); g.lineTo(x, -110 - h); g.lineTo(x + w / 2 + 8, -60 - h); g.fillStyle = '#8a5a1a'; g.fill();
      g.fillStyle = '#ffe9a0'; g.fillRect(x - 7, -h + 10, 14, 22); } g.restore(); });
  layer(c, cam, .6, g => hillsW(g, 300, 800, 34, '#2a3a3a', .003, .1));
  layer(c, cam, 1, g => { g.fillStyle = lin(g, 0, 860, 0, 1300, [[0, '#3a4a3a'], [1, '#1e2a22']]); g.fillRect(-3000, 860, W + 6000, 800); });
}
function bolt(c, t, x = 1300) { const f = (t * 1.3) % 1; if (f > .1) return; dark(c, .45 * (1 - f / .1), '230,220,255');
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.beginPath(); c.moveTo(x, 0); c.lineTo(x - 40, 160); c.lineTo(x + 20, 170); c.lineTo(x - 60, 380); ink(c, 7, '#fff6e0'); c.restore(); }
function castleHall(c, cam, t) {   // inside the castle, by the fire
  layer(c, cam, 0, g => { g.fillStyle = '#3a2a32'; g.fillRect(-2000, -1500, W + 4000, 2800);
    for (let y = -600; y < 860; y += 70) for (let x = -1200 + ((y / 70) % 2) * 80; x < W + 1200; x += 160) { g.fillStyle = hash(x, y) > .5 ? 'rgba(255,220,200,.04)' : 'rgba(0,0,0,.1)'; g.fillRect(x + 3, y + 3, 154, 64); } });
  layer(c, cam, .6, g => { g.fillStyle = '#1e1418'; g.fillRect(260, 180, 260, 360); g.fillStyle = '#4a2a6a'; g.fillRect(280, 200, 220, 320); g.fillStyle = 'rgba(255,255,255,.2)'; g.fillRect(388, 200, 6, 320); });
  layer(c, cam, .85, g => { rr(g, 1520, 380, 400, 480, 20); g.fillStyle = '#2a1e1e'; g.fill(); rr(g, 1570, 600, 300, 260, 14); g.fillStyle = rad(g, 1720, 820, 10, 260, [[0, '#ffe08a'], [.4, '#ff8a3a'], [1, 'rgba(120,40,10,0)']]); g.fill();
    for (let k = 0; k < 4; k++) { const f = Math.sin(t * 9 + k * 2) * 10; g.beginPath(); g.moveTo(1620 + k * 30, 860); g.quadraticCurveTo(1610 + k * 40, 760, 1660 + k * 30 + f, 680 - k * 10); g.quadraticCurveTo(1700 + k * 30, 780, 1700 + k * 30, 860); g.fillStyle = ['#e2443a', '#f2932a', '#ffd84a', '#f2932a'][k]; g.fill(); }
    g.save(); g.globalCompositeOperation = 'lighter'; glow(g, 1720, 760, 900, '255,150,60', .35 + Math.sin(t * 11) * .03); g.restore(); });
  layer(c, cam, 1, g => { g.fillStyle = lin(g, 0, 860, 0, 1300, [[0, '#5a4a40'], [1, '#2e2420']]); g.fillRect(-3000, 860, W + 6000, 800); });
}
function pinkMorning(c, cam, t) {
  layer(c, cam, 0, g => { g.fillStyle = lin(g, 0, -400, 0, 760, [[0, '#a8c8ff'], [.55, '#ffd8ec'], [1, '#fff0d8']]); g.fillRect(-2000, -1500, W + 4000, 2600); sun(g, 200, 100, 700, '255,236,240'); clouds(g, t, CLOUDS, 4, .9, '255,240,248'); });
  layer(c, cam, .2, g => { hillsW(g, 0, 640, 30, '#c8b8f0', .004); emeraldCity(g, 1500, 640, .45, t, .8); });
  layer(c, cam, .45, g => { hillsW(g, 300, 710, 30, '#9cd0a0', .003); tree(g, 260, 760, .9, t, '#7cc070'); tree(g, 1720, 770, .8, t, '#6cb860'); });
  layer(c, cam, 1, g => { g.fillStyle = lin(g, 0, 840, 0, 1300, [[0, '#86cc72'], [1, '#5aa850']]); g.fillRect(-3000, 840, W + 6000, 800); for (const f of FLOWERS) flower(g, f.x * 1.3 - 300, f.y + 40, f.s, Math.sin(t * 2 + f.p), f.col); });
}
function kansasGold(c, cam, t, k = 1) {   // Kansas again, now warm and golden
  layer(c, cam, 0, g => { g.fillStyle = lin(g, 0, -400, 0, 720, [[0, '#4a4a8c'], [.45, '#e8907a'], [.8, '#ffc27a'], [1, '#ffe2a8']]); g.fillRect(-2000, -1500, W + 4000, 2600); sun(g, 1650, 380, 700, '255,214,150');
    for (let i = 0; i < 8; i++) { const x = ((hash(i, 3) * 3000 + t * 6) % 3200) - 600, y = 80 + hash(i, 4) * 360; ell(g, x, y, 260 + hash(i, 5) * 300, 14); g.fillStyle = 'rgba(255,190,170,.45)'; g.fill(); } });
  layer(c, cam, .25, g => { g.fillStyle = '#c99a6a'; g.fillRect(-2500, 688, W + 5000, 40); });
  layer(c, cam, .6, g => { g.fillStyle = lin(g, 0, 700, 0, 1000, [[0, '#e8b860'], [1, '#c8903e']]); g.fillRect(-2500, 700, W + 5000, 2000);
    g.lineCap = 'round'; for (let i = 0; i < 300; i++) { const x = hash(i, 7) * 3600 - 800, y = 720 + hash(i, 8) ** 1.5 * 360, h = 8 + (y - 700) * .06, sw = Math.sin(t * 2 + i) * 3;
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + sw, y - h); g.lineWidth = 2.4; g.strokeStyle = hash(i, 9) < .6 ? 'rgba(160,100,40,.5)' : 'rgba(255,240,190,.6)'; g.stroke(); } });
}

// ---------- 09 the Great and Mighty Oz ----------
shot(156.5, 162.2, 'emerald', push(960, 560, 1, 1.3, 5.7, 960, 720), (c, t, u, cam) => {
  throneHall(c, cam, t); smoke(c, cam, t);
  [[lion, -200, .5], [tinWoodman, -80, .5], [scarecrow, 20, .5], [dor, 110, .52], [tot, 190, .62]].forEach(([f, o, s], i) => { const d = u * 40;
    put(c, f, 760 + o + d, 960, s, { walk: 1, ph: f === dor ? d / (STR_D * s) : f === tot ? d / (STR_T * s) : stepPh(f, d, s), mood: 'wow', blink: false, shoes: 'silver' }, t); });
});
shot(162.2, 170.0, 'emerald', u => ({ x: 960 + Math.sin(t0(u) * 30) * 8 * SPEAK.amp, y: 520, z: 1.05 }), (c, t, u, cam) => {
  throneHall(c, cam, t, 1.3);
  layer(c, cam, .9, g => { g.save(); g.translate(960, 870); g.beginPath(); g.moveTo(-130, 0); g.lineTo(-130, -280); g.quadraticCurveTo(0, -380, 130, -280); g.lineTo(130, 0); g.closePath(); g.fillStyle = '#2a9a58'; g.fill(); g.restore();
    for (let k = 0; k < 12; k++) { const f = Math.sin(t * 7 + k) * 20, x = 640 + k * 60; g.beginPath(); g.moveTo(x - 30, 870); g.quadraticCurveTo(x, 760 + f, x + 6, 640 + f); g.quadraticCurveTo(x + 20, 760, x + 30, 870); g.fillStyle = `rgba(${k % 2 ? '120,255,160' : '60,200,110'},.55)`; g.fill(); }
    g.save(); g.translate(960, 380 + Math.sin(t * 1.3) * 14); g.scale(1.15 + SPEAK.amp * .03, 1.15); bigHead(g, t, 1.2); g.restore(); });
  smoke(c, cam, t, '150,255,190', .16);
  [[lion, 620, .62], [tinWoodman, 760, .6], [scarecrow, 880, .6], [dor, 1040, .62], [tot, 1150, .75]].forEach(([f, x, s], i) => put(c, f, x + Math.sin(t * 40 + i) * 2, 960, s, { walk: 0, mood: 'wow', blink: false, shoes: 'silver' }, t));
});
const t0 = u => u;
shot(170.0, 173.1, 'emerald', push(900, 640, 1.4, 1.55, 3.1), (c, t, u, cam) => {
  throneHall(c, cam, t); smoke(c, cam, t);
  [[tinWoodman, 560, .9], [scarecrow, 760, .9], [dor, 980, .92], [lion, 1260, .85]].forEach(([f, x, s], i) => put(c, f, x + Math.sin(t * 45 + i) * 4, 940, s, { walk: 0, mood: 'worried', blink: false, shoes: 'silver', lean: -.05 }, t, x > 1100));
  put(c, tot, 1100 + Math.sin(t * 50) * 3, 960, 1.1, { walk: 0, blink: false }, t);
});
shot(173.1, 174.8, 'emerald', push(1250, 640, 2.2, 2.35, 1.7), (c, t, u, cam) => {
  throneHall(c, cam, t); put(c, lion, 1260 + Math.sin(t * 45) * 3, 940, .85, { walk: 0, mood: 'worried', blink: false, mouth: voice('lion', t) }, t, true);
  if (u > .4) popWord(c, 'gulp!', 1220, 300, 56, '#d0ffe0');
});
shot(174.8, 176.4, 'emerald', push(980, 600, 2.2, 2.35, 1.6), (c, t, u, cam) => {
  throneHall(c, cam, t); put(c, dor, 980, 940, .92, { walk: 0, mood: 'sure', blink: false, shoes: 'silver', talk: voice('dorothy', t), tilt: .1 }, t);
});

// ---------- 10 the Wicked Witch and her Winged Monkeys ----------
shot(176.4, 180.8, 'dusk', push(1120, 520, 1.7, 1.85, 4.4), (c, t, u, cam) => {
  castleStorm(c, cam, t); bolt(c, t, 1500);
  layer(c, cam, 1, g => { rr(g, 860, 760, 520, 80, 8); fillStroke(g, '#8a6a2a'); for (let i = 0; i < 7; i++) { rr(g, 870 + i * 74, 680, 34, 90, 6); fillStroke(g, '#a8803a', 3); } });
  put(c, witch, 1120, 760, 1.1, { armF: 2.3, blink: false, mood: 'wow', mouth: voice('witch', t) }, t, true);
});
shot(180.8, 184.3, 'dusk', at(960, 560, 1.05), (c, t, u, cam) => {
  castleStorm(c, cam, t);
  [[tinWoodman, 560, .8], [scarecrow, 740, .8], [dor, 920, .82], [lion, 1220, .78]].forEach(([f, x, s]) => put(c, f, x, 960, s, { walk: 0, mood: 'wow', blink: false, shoes: 'silver', tilt: .2 }, t, x > 1100));
  put(c, tot, 1040, 975, 1, { walk: 0, blink: false, talk: (t % .5) < .25 ? 1 : 0 }, t);
  for (let i = 0; i < 7; i++) { const k = clamp((u - i * .25) / 2.2), s = lerp(.3, 1.6, k * k); c.save(); c.translate(lerp(1500 - i * 140, 400 + i * 200, k), lerp(-100, 420 + (i % 3) * 60, k) + Math.sin(t * 3 + i) * 20); c.scale(s, s); monkey(c, t, i); c.restore(); }
  bolt(c, t, 300);
});
shot(184.3, 186.7, 'dusk', push(1000, 620, 1.9, 2.05, 2.4), (c, t, u, cam) => {
  castleStorm(c, cam, t);
  put(c, lion, 1000, 940, .95, { walk: 0, mood: 'calm', blink: false, roar: SPEAK.who === 'lion' ? Math.max(.4, SPEAK.amp) : 0, mouth: voice('lion', t), lean: -.04 }, t);
  if (SPEAK.who === 'lion' && u > 1) popWord(c, 'ROAR!', 1100, 240, 110, '#ffd84a');
});
shot(186.7, 191.8, 'dusk', u => ({ x: lerp(900, 1200, ease(u / 5)), y: lerp(560, 420, ease(u / 5)), z: 1 }), (c, t, u, cam) => {
  castleStorm(c, cam, t); const k = ease(u / 5), x = lerp(700, 1420, k), y = lerp(760, 360, k) - Math.sin(k * Math.PI) * 80, s = lerp(.8, .3, k);
  layer(c, cam, 1, g => { g.save(); g.translate(x, y); g.scale(s, s); dorothy(g, { walk: 0, blink: false, mood: 'wow', armF: 2.7, armB: -2.7, shoes: 'silver', hold: true }, t); g.restore();
    for (const dx of [-70, 70]) { g.save(); g.translate(x + dx * s, y - 330 * s); g.scale(s * 1.3, s * 1.3); monkey(g, t, dx > 0 ? 1 : 2); g.restore(); } });
  bolt(c, t, 600);
});
shot(191.8, 197.0, 'dusk', push(900, 690, 1.3, 1.45, 5.2), (c, t, u, cam) => {
  castleStorm(c, cam, t);
  put(c, tinWoodman, 640, 960, .9, { walk: 0, mood: 'sure', blink: blink(t, 3), tilt: .1 }, t);
  put(c, lion, 1220, 960, .85, { walk: 0, mood: 'sure', blink: blink(t, 2) }, t, true);
  put(c, scarecrow, 900, 960, .9, { walk: 0, mood: u > 3 ? 'happy' : 'sure', blink: blink(t, 4), armF: u > 3 ? 2.3 : .3, mouth: voice('scarecrow', t), tilt: .1 }, t);
});

// ---------- 11 the Witch's castle ----------
const silverShoe = (c, x, y, t) => { ell(c, x, y, 22, 11); c.fillStyle = lin(c, x - 20, 0, x + 20, 0, [[0, '#fff'], [.5, '#b9c4da'], [1, '#eef2fa']]); c.fill(); ink(c, 3); c.stroke(); sparkle(c, x + 16, y - 12, 14 * Math.abs(Math.sin(t * 4)), t * 3); };
const shoeInHand = (cc, x, y, t) => { silverShoe(cc, x + 4, y - 16, t); spot(cc, 'shoe', x, y); };
shot(197.0, 202.2, 'fire', push(1080, 600, 1.2, 1.35, 5.2), (c, t, u, cam) => {
  castleHall(c, cam, t); const grab = ease((u - 1.8) / 1.2), got = u > 3;
  put(c, dor, 800, 920, .95, { walk: 0, mood: u > 2 ? 'worried' : 'calm', blink: blink(t), shoes: 'silver', tilt: -.05 }, t);
  // she reaches with her near hand; the umbrella stays down in the other
  put(c, witch, 1300, 920, 1.05, { armB: got ? 1.05 : lerp(-.15, 1.05, ease((u - 1.4) / .6)), bendB: .2, blink: false, mood: grab > .5 ? 'wow' : null, item: got ? shoeInHand : (cc, x, y) => spot(cc, 'shoe', x, y) }, t, true);
  if (u > 1.8 && !got) { const S = c.getTransform().transformPoint(new DOMPoint(820, 915)), E = HANDS.shoe, z = cam.z, k = grab;
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.translate(lerp(S.x, E.x, k), lerp(S.y, E.y - 16 * z, k) - Math.sin(k * Math.PI) * 120 * z); c.scale(z, z); silverShoe(c, 0, 0, t); c.restore(); }
});
shot(202.2, 204.6, 'fire', push(1300, 560, 2.1, 2.25, 2.4), (c, t, u, cam) => {
  castleHall(c, cam, t); put(c, witch, 1300, 920, 1.05, { armB: 1.1, bendB: .35, blink: false, mood: 'wow', mouth: voice('witch', t), item: shoeInHand }, t, true);   // the shoe held up in her hand
});
const bucket = tip => (cc, x, y) => { cc.save(); cc.translate(x, y); cc.rotate(tip); cc.translate(22, -6);   // tipping turns its open top toward the way she faces
  cc.beginPath(); cc.moveTo(-34, -26); cc.lineTo(34, -26); cc.lineTo(28, 38); cc.lineTo(-28, 38); cc.closePath(); fillStroke(cc, lin(cc, -34, 0, 34, 0, [[0, '#6e5236'], [.45, '#a07a52'], [1, '#6e5236']]), 3);
  for (const yy of [-6, 20]) { cc.beginPath(); cc.moveTo(-32, yy); cc.lineTo(32, yy); cc.lineWidth = 4; cc.strokeStyle = '#5a5f6a'; cc.stroke(); }
  ell(cc, 0, -26, 34, 8); fillStroke(cc, '#7cc4f0', 3); cc.beginPath(); cc.arc(0, -26, 36, Math.PI * 1.05, Math.PI * 1.95); cc.lineWidth = 3; cc.strokeStyle = '#4a4f5a'; cc.stroke();   // water inside, the handle
  spot(cc, 'bucket', 0, -26); cc.restore(); };
shot(204.6, 206.2, 'fire', push(820, 600, 2, 2.15, 1.6), (c, t, u, cam) => {
  castleHall(c, cam, t);
  put(c, dor, 800, 920, .95, { walk: 0, mood: 'cross', blink: false, shoes: 'silver', talk: voice('dorothy', t), armB: 1.45, bendB: .35, armF: 1.6, bendF: .35, lean: .05, item: bucket(-.2) }, t);   // the bucket in both hands
});
function water(c, A, B, k, z, t) {   // water thrown from A to B (screen points): a thick tongue at the front, a spray of drops in an arc behind it
  const h = 170 * z, P = q => ({ x: lerp(A.x, B.x, q), y: lerp(A.y, B.y, q) - Math.sin(q * Math.PI) * h });
  const head = Math.min(1, k), tail = clamp(k - .45);
  if (head > tail) { c.beginPath(); const n = 24; for (let i = 0; i <= n; i++) { const q = lerp(tail, head, i / n), p = P(q), w = (6 + 30 * Math.sin(i / n * Math.PI * .5)) * z; c.lineTo(p.x, p.y - w / 2); }
    for (let i = n; i >= 0; i--) { const q = lerp(tail, head, i / n), p = P(q), w = (6 + 30 * Math.sin(i / n * Math.PI * .5)) * z; c.lineTo(p.x, p.y + w / 2); } c.closePath();
    c.fillStyle = 'rgba(120,195,255,.85)'; c.fill(); c.strokeStyle = 'rgba(255,255,255,.6)'; c.lineWidth = 2 * z; c.stroke();
    if (k < 1) { const p = P(head); ell(c, p.x, p.y, 20 * z, 17 * z); c.fillStyle = 'rgba(120,195,255,.9)'; c.fill(); c.stroke(); ell(c, p.x - 6 * z, p.y - 6 * z, 6 * z, 4 * z); c.fillStyle = 'rgba(255,255,255,.75)'; c.fill(); } }
  for (let i = 0; i < 34; i++) { const q = lerp(tail, head, hash(i, 31)), p = P(q), r = (3 + hash(i, 32) * 7) * z, dx = (hash(i, 33) - .5) * 40 * z, dy = (hash(i, 34) - .5) * 40 * z + (k - q) * 30 * z;
    if (head <= tail) continue; ell(c, p.x + dx, p.y + dy, r, r * 1.25); c.fillStyle = 'rgba(140,205,255,.85)'; c.fill(); ell(c, p.x + dx - r * .3, p.y + dy - r * .4, r * .3, r * .3); c.fillStyle = 'rgba(255,255,255,.8)'; c.fill(); }
  const hit = k - 1; if (hit > 0) for (let i = 0; i < 40; i++) {   // the splash: drops bursting off her and falling
    const a = -Math.PI * (.1 + hash(i, 41) * 1.1), v = (200 + hash(i, 42) * 340) * z, q = Math.min(hit, .9), x = B.x + Math.cos(a) * v * q - 30 * z, y = B.y + Math.sin(a) * v * q + 600 * z * q * q, r = (3 + hash(i, 43) * 7) * z * (1 - q * .5);
    ell(c, x, y, r, r * 1.3); c.fillStyle = `rgba(140,205,255,${.9 * (1 - q)})`; c.fill(); }
}
shot(206.2, 207.9, 'fire', at(1060, 620, 1.3), (c, t, u, cam) => {
  castleHall(c, cam, t); const swing = ease(u / .45), k = clamp((u - .3) / .7) * 1 + clamp((u - 1) / .7);   // k: 0..1 the water flies, 1..2 it splashes
  put(c, witch, 1300, 920, 1.05, { armB: 1.05 - clamp(u - 1) * .6, bendB: .2, blink: false, mood: 'wow', item: shoeInHand }, t, true);
  put(c, dor, 800, 920, .95, { walk: 0, mood: 'cross', blink: false, shoes: 'silver', armB: lerp(1.45, 1.75, swing), bendB: .2, armF: lerp(1.6, 1.85, swing), bendF: .2, lean: lerp(.05, .12, swing), item: bucket(lerp(-.2, 1.7, swing)) }, t);
  if (u > .3) { const M = c.getTransform(), B = M.transformPoint(new DOMPoint(1275, 750)); c.save(); c.setTransform(1, 0, 0, 1, 0, 0); water(c, HANDS.bucket, B, k, cam.z, t); c.restore(); }
  if (u > .9) popWord(c, 'Splash!', 1100, 280, 80, '#bfe4ff');
});
shot(207.9, 211.1, 'fire', push(1300, 640, 1.7, 1.4, 3.2), (c, t, u, cam) => {
  castleHall(c, cam, t); const melt = clamp(u / 3);
  put(c, witch, 1300, 920, 1.05, { melt, armF: .6 + Math.sin(t * 6) * .4, blink: false, mood: 'wow', mouth: voice('witch', t) }, t, true);
  for (let i = 0; i < 8; i++) { const q = (t * .6 + i / 8) % 1; ell(c, 1250 + Math.sin(i * 3) * 80, 900 - q * 300, 30 + q * 40); c.fillStyle = `rgba(200,170,240,${.35 * (1 - q) * melt})`; c.fill(); }
  if (u > .4) { const k = ease((u - .4) / .5); silverShoe(c, lerp(1170, 1110, k), lerp(760, 912, k) - Math.sin(k * Math.PI) * 40, t); }   // the shoe drops from her hand
});
shot(211.1, 215.5, 'fire', push(860, 600, 1.15, 1.25, 4.4), (c, t, u, cam) => {
  castleHall(c, cam, t);
  layer(c, cam, .95, g => { g.save(); g.globalCompositeOperation = 'lighter'; g.beginPath(); g.moveTo(80, 300); g.lineTo(300, 300); g.lineTo(700, 1100); g.lineTo(0, 1100); g.closePath(); g.fillStyle = 'rgba(255,240,200,.18)'; g.fill(); g.restore();
    ell(g, 1300, 920, 190, 34); fillStroke(g, '#8a62c0', 3); });
  const run = ease((u - .4) / 1.4);
  [[lion, 0, .85], [tinWoodman, -150, .9], [scarecrow, -280, .9]].forEach(([f, o, s], i) => { const x = lerp(-100 + o, 520 + o, run); put(c, f, x, 930, s, { walk: run < 1 ? 1 : 0, ph: stepPh(f, x + 100 - o, s), mood: 'happy', blink: blink(t, i), mouth: f === lion ? voice('lion', t) : 0 }, t); });
  put(c, dor, lerp(900, 700, ease((u - 2) / .8)), 925, .92, { walk: u > 2 && u < 2.8 ? 1 : 0, ph: u * 6, mood: 'happy', blink: false, shoes: 'silver', talk: voice('dorothy', t), armB: u > 2.6 ? 1.5 : .3, bendB: .4 }, t, true);
  if (u > 3) hearts(c, 4, 0, null, u - 3, 600, 520);
});
function hearts(c, i, k, L, e, x, y) { for (let j = 0; j < 5; j++) { const q = (e - j * .45) / 2.4; if (q < 0) continue; const f = q % 1, a = clamp(f * 5) * clamp((1 - f) * 2.5);
  c.save(); c.globalAlpha = a; heartShape(c, x + Math.sin(j * 2.3 + f * 4) * 46 + (j - 2) * 22, y - f * 230, 18 + j % 3 * 5); c.fillStyle = '#ff6f91'; c.fill(); ink(c, 3); c.stroke(); c.restore(); } }
function heartShape(c, x, y, r) { c.beginPath(); c.moveTo(x, y + r * .9); c.bezierCurveTo(x - r * 1.6, y - r * .1, x - r * .8, y - r * 1.3, x, y - r * .45); c.bezierCurveTo(x + r * .8, y - r * 1.3, x + r * 1.6, y - r * .1, x, y + r * .9); c.closePath(); }

// ---------- 12 the little man behind the screen ----------
function wizardRoom(c, cam, t, screenFall) {
  throneHall(c, cam, t, .7);
  layer(c, cam, .95, g => { rr(g, 280, 600, 280, 260, 12); fillStroke(g, '#7a5a3a'); for (let i = 0; i < 5; i++) { rr(g, 310 + i * 50, 540 - (i % 2) * 30, 14, 70, 6); fillStroke(g, '#c9a64a', 3); ell(g, 317 + i * 50, 536 - (i % 2) * 30, 14, 14); fillStroke(g, '#e84a3a', 3); }
    g.save(); g.globalCompositeOperation = 'lighter'; glow(g, 500, 300, 700, '255,215,150', .4); g.restore(); rr(g, 488, 120, 24, 60, 6); fillStroke(g, '#c9a64a', 3); ell(g, 500, 200, 40, 26); fillStroke(g, '#ffe8a8', 3); });
  layer(c, cam, 1, g => { g.save(); g.translate(1000, 860); g.rotate(-screenFall * 1.45);
    for (let i = 0; i < 3; i++) { rr(g, -460 + i * 150, -560, 146, 560, 8); fillStroke(g, lin(g, 0, -560, 0, 0, [[0, '#2f9a5a'], [1, '#1d6a3e']])); rr(g, -440 + i * 150, -520, 106, 480, 6); g.strokeStyle = '#ffd84d'; g.lineWidth = 3; g.stroke(); } g.restore(); });
}
shot(215.5, 220.9, 'lamp', push(960, 560, 1.15, 1.3, 5.4), (c, t, u, cam) => {
  const fall = ease((u - 2.2) / .8); if (u > 2) layer(c, cam, 1, () => {}); wizardRoom(c, cam, t, fall);
  if (fall > .5) put(c, wizardMan, 680, 900, 1.1, { blink: false, mood: 'wow', armF: 2.2 }, t);
  put(c, tot, lerp(1240, 1160, clamp(u / 2)), 960, 1.2, { walk: u < 2 ? 1 : 0, ph: u * 8, blink: false, talk: u < 2.2 && (t % .5) < .25 ? 1 : 0 }, t, true);
  [[dor, 1320, .92], [scarecrow, 1500, .9], [tinWoodman, 1660, .9], [lion, 1880, .82]].forEach(([f, x, s], i) => put(c, f, x, 920, s, { walk: 0, blink: blink(t, i), shoes: 'silver', mood: 'wow' }, t, true));
});
shot(220.9, 225.1, 'lamp', push(700, 620, 1.7, 1.85, 4.2), (c, t, u, cam) => {
  wizardRoom(c, cam, t, 1);
  put(c, wizardMan, 680, 900, 1.1, { blink: blink(t, 2), mood: u > 2 ? 'happy' : 'wow', armF: u < 2 ? 2.2 : .5, mouth: voice('wizardMan', t) }, t);
});
const glowUp = (c, x, y, col, k, t) => { if (k <= 0) return; c.save(); c.globalCompositeOperation = 'lighter'; glow(c, x, y, 260, col, .5 * k); c.restore(); for (let i = 0; i < 8; i++) sparkle(c, x + Math.cos(t * 2 + i) * 130, y + Math.sin(t * 2.4 + i) * 110, 14 * k * Math.abs(Math.sin(t * 3 + i)), t, '#fff6c0'); };
shot(225.1, 227.0, 'lamp', push(700, 560, 2.2, 2.3, 1.9), (c, t, u, cam) => { wizardRoom(c, cam, t, 1); put(c, wizardMan, 680, 900, 1.1, { blink: blink(t, 2), mood: 'happy', armF: .7, mouth: voice('wizardMan', t) }, t); });
shot(227.0, 231.5, 'lamp', push(1500, 690, 2.0, 2.15, 4.5), (c, t, u, cam) => { wizardRoom(c, cam, t, 1);
  put(c, scarecrow, 1500, 920, .9, { walk: 0, blink: blink(t, 3), mood: u > 1.5 ? 'happy' : 'wow', armF: u > 2 ? 2.4 : .3 }, t, true); glowUp(c, 1500, 560, '255,230,140', ease((u - 1.2) / 1), t); });
shot(231.5, 236.6, 'lamp', push(1660, 690, 2.0, 2.15, 5.1), (c, t, u, cam) => { wizardRoom(c, cam, t, 1); const k = ease((u - 1.5) / 1);
  put(c, tinWoodman, 1660, 920, .9, { walk: 0, blink: blink(t, 4), mood: k > .5 ? 'happy' : 'wow', rust: 0 }, t, true);
  if (k > 0) { c.save(); c.globalCompositeOperation = 'lighter'; glow(c, 1655, 745, 90, '255,120,150', .35 * k); c.restore(); heartShape(c, 1655, 745, 26 * k * (1 + Math.sin(t * 6) * .1)); c.fillStyle = '#ff5a7a'; c.fill(); ink(c, 3); c.stroke(); } });
shot(236.6, 241.2, 'lamp', push(1860, 690, 1.9, 2.05, 4.6), (c, t, u, cam) => { wizardRoom(c, cam, t, 1);
  put(c, lion, 1880, 920, .82, { walk: 0, blink: blink(t, 2), mood: u > 1.5 ? 'happy' : 'wow', lean: u > 1.5 ? -.06 : 0 }, t, true); glowUp(c, 1830, 600, '255,200,90', ease((u - 1.3) / 1), t); });
shot(241.2, 245.0, 'lamp', push(700, 560, 2.1, 2.25, 3.8), (c, t, u, cam) => { wizardRoom(c, cam, t, 1); put(c, wizardMan, 680, 900, 1.1, { blink: blink(t, 2), mood: 'happy', armF: 1.2, mouth: voice('wizardMan', t) }, t); });
shot(245.0, 249.8, 'lamp', push(1500, 600, 1.25, 1.4, 4.8), (c, t, u, cam) => { wizardRoom(c, cam, t, 1);
  [[dor, 1260, .92], [scarecrow, 1450, .9], [tinWoodman, 1620, .9], [lion, 1850, .82]].forEach(([f, x, s], i) => put(c, f, x, 920, s, { walk: 0, blink: blink(t, i), shoes: 'silver', mood: 'happy', tilt: .06 }, t, i > 0));
  put(c, tot, 1120, 960, 1.15, { walk: 0, blink: blink(t, 5) }, t); hearts(c, 0, 0, null, u, 1550, 520); });

// ---------- 13 goodbye ----------
shot(248.8, 255.9, 'morning', push(960, 600, 1.2, 1.35, 7.1), (c, t, u, cam) => {
  pinkMorning(c, cam, t); layer(c, cam, 1, g => { g.save(); g.globalCompositeOperation = 'lighter'; glow(g, 640, 600, 500, '255,210,240', .45); g.restore(); });
  put(c, glinda, 640, 900, 1, { blink: blink(t, 2), mouth: voice('glinda', t), armF: 1.5 + Math.sin(t * 2) * .1 }, t);
  put(c, dor, 1100, 920, .92, { walk: 0, mood: 'calm', blink: blink(t), shoes: 'silver', hold: true, tilt: .1 }, t, true);
  [[scarecrow, 1350], [tinWoodman, 1520], [lion, 1760]].forEach(([f, x], i) => put(c, f, x, 920, f === lion ? .82 : .9, { walk: 0, blink: blink(t, i + 3), mood: 'sad' }, t, true));
});
shot(255.9, 259.2, 'morning', push(1300, 600, 1.4, 1.55, 3.3), (c, t, u, cam) => {
  pinkMorning(c, cam, t);
  put(c, scarecrow, 1380, 920, .9, { walk: 0, blink: false, mood: 'happy', armF: 1.4 }, t, true);
  put(c, dor, 1200, 920, .92, { walk: 0, mood: 'happy', blink: false, shoes: 'silver', armB: 1.4, bendB: .9, lean: .08 }, t);
  put(c, tinWoodman, 1560, 920, .9, { walk: 0, blink: blink(t, 4), mood: 'happy', rust: 0 }, t, true); put(c, lion, 1800, 920, .82, { walk: 0, blink: blink(t, 2), mood: 'happy' }, t, true);
  hearts(c, 0, 0, null, u, 1300, 520);
});
shot(259.2, 261.6, 'morning', push(1180, 600, 2.2, 2.35, 2.4), (c, t, u, cam) => { pinkMorning(c, cam, t);
  put(c, dor, 1180, 920, .92, { walk: 0, mood: 'happy', blink: false, shoes: 'silver', talk: voice('dorothy', t), tilt: .1 }, t); sparkle(c, 1150, 610, 12 * Math.abs(Math.sin(t * 3)), t, '#bfe4ff'); });
shot(261.6, 265.1, 'morning', push(1500, 560, 2.2, 2.35, 3.5), (c, t, u, cam) => { pinkMorning(c, cam, t);
  put(c, tinWoodman, 1500, 920, .95, { walk: 0, blink: blink(t, 4), mood: 'sad', rust: 0, tears: (u * .8) % 1, armF: .25 + Math.sin(t * 3) * .05, tilt: .08 }, t, true); });   // axe down, a tear rolling: his arm stays clear of his face
shot(265.1, 267.5, 'morning', at(1100, 890, 2.8), (c, t, u, cam) => { pinkMorning(c, cam, t);
  const clicks = [.2, .9, 1.6], lift = clicks.reduce((m, k) => Math.max(m, clamp(1 - Math.abs(u - k) / .22)), 0);
  put(c, dor, 1100, 920 - lift * 18, .92, { walk: 0, mood: 'calm', blink: false, shoes: 'silver', sparkle: lift }, t);
  for (const k of clicks) if (u > k && u < k + .7) for (let i = 0; i < 9; i++) { const q = (u - k) / .7, a = i / 9 * TAU; sparkle(c, 1100 + Math.cos(a) * 130 * q, 905 + Math.sin(a) * 50 * q, 26 * (1 - q), t * 3); }
  const n = clicks.filter(k => u > k).length; if (n) popWord(c, 'click!'.repeat(1), 960 + n * 120, 380, 54, '#fff6c0');
});
shot(267.5, 270.6, 'morning', push(1100, 560, 1.5, 1.8, 3.1), (c, t, u, cam) => { pinkMorning(c, cam, t);
  const up = ease((u - .5) / 2.4), spin = Math.min(1, u / 2.6);
  put(c, dor, 1100, 920 - up * 220, .92, { walk: 0, mood: 'happy', blink: false, shoes: 'silver', talk: voice('dorothy', t), hold: true, tilt: .15 }, t, false, { noShadow: true });
  for (let i = 0; i < 40; i++) { const a = t * 4 + i * .6, r = 160 + (i % 5) * 30 - spin * 60; sparkle(c, 1100 + Math.cos(a) * r, 780 - up * 220 + Math.sin(a) * r * .4 - i * 6, 14, t * 3 + i, ['#fff6c0', '#ffd0f0', '#c0f0ff'][i % 3]); }
  dark(c, ease((u - 2.3) / .7), '255,255,255');
});

// ---------- 14 home, and Kansas is golden now ----------
shot(270.6, 275.1, 'home', push(960, 600, 1.35, 1.5, 4.5), (c, t, u, cam) => {
  kansasGold(c, cam, t); layer(c, cam, .8, g => { farmhouse(g, 1500, 820, .85, 0, 0); windmill(g, 1780, 820, .7, t); });
  const roll = ease(u / 1.4);
  c.save(); c.translate(lerp(500, 900, roll), 0); c.rotate(0);
  put(c, dor, 0, 930 - Math.abs(Math.sin(u * 7)) * 40 * (1 - roll), .95, { walk: 0, mood: u > 2 ? 'wow' : 'happy', blink: false, shoes: 'boots', sit: 0, tilt: u > 2 ? .15 : 0 }, t);
  c.restore(); dark(c, 1 - clamp(u / .6), '255,255,255');
  put(c, tot, 1100, 960, 1.1, { walk: 0, blink: false, talk: (u % 1.4) < .3 ? 1 : 0 }, t);
});
shot(275.1, 278.7, 'home', at(1150, 600, 1.05), (c, t, u, cam) => {
  kansasGold(c, cam, t); layer(c, cam, .8, g => { farmhouse(g, 1600, 820, .85, 0, 1); windmill(g, 1850, 820, .7, t); });
  put(c, dor, 820, 930, .9, { walk: 0, mood: 'wow', blink: false, shoes: 'boots' }, t);
  const w = walked(u, .3, 1500, 1120, 220); put(c, auntEm, w.x, 930, .9, { ph: stepPh(auntEm, w.d, .9), walk: w.walk, blink: blink(t, 2), reach: 1.2 }, t, true);
  put(c, uncleHenry, 1700, 900, .72, { walk: 0, blink: blink(t, 3), wave: .8, arms: .2 }, t, true);
});
shot(278.7, 285.8, 'home', push(1000, 600, 1.7, 1.85, 7.1), (c, t, u, cam) => {
  kansasGold(c, cam, t);
  put(c, dor, 940, 930, .92, { walk: 0, mood: 'happy', blink: false, shoes: 'boots', armB: 1.3, bendB: .9, lean: .06 }, t);
  put(c, auntEm, 1060, 935, .95, { walk: 0, blink: false, reach: 1.25, mouth: voice('auntEm', t) }, t, true);
  hearts(c, 0, 0, null, u, 1000, 560);
});
shot(285.8, 290.5, 'home', push(960, 600, 2.2, 2.35, 4.7), (c, t, u, cam) => {
  kansasGold(c, cam, t); put(c, dor, 960, 930, .92, { walk: 0, mood: 'happy', blink: blink(t), shoes: 'boots', talk: voice('dorothy', t), tilt: .08, hold: true }, t);
});
shot(290.5, 301.4, 'home', u => ({ x: lerp(1000, 1100, ease(u / 10)), y: lerp(620, 470, ease(u / 10)), z: lerp(1.4, .9, ease(u / 10)) }), (c, t, u, cam) => {
  kansasGold(c, cam, t); layer(c, cam, .85, g => { farmhouse(g, 1500, 860, .8, 0, 1); windmill(g, 1780, 860, .66, t); });
  put(c, uncleHenry, 1300, 930, .72, { walk: 0, blink: blink(t, 3), arms: .2 }, t, true);
  put(c, auntEm, 1080, 935, .8, { walk: 0, blink: blink(t, 2), arms: .3 }, t, true);
  put(c, dor, 950, 935, .78, { walk: 0, mood: 'happy', blink: blink(t), shoes: 'boots', hold: true }, t);
  for (let i = 0; i < 3; i++) layer(c, cam, 0, g => { g.save(); g.globalCompositeOperation = 'lighter'; glow(g, 1650, 380, 300 + i * 200, '255,200,140', .1); g.restore(); });
});
