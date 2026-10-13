// One function per page: scene(c, t, u, d) draws page i at local time u of its d seconds (t = time in the whole film).
const SPARK_CITY = scatter(11, 14, 1290, 1590, 420, 640);
const POP = (() => { const R = rng(8); return Array.from({ length: 170 }, () => ({ x: R() * 3000, y: 600 + R() * 110, r: 5 + R() * 8, p: R() * TAU })); })();
const TUFTS = (() => { const R = rng(9); return Array.from({ length: 40 }, () => ({ x: R() * 3200, s: .7 + R() * .7, p: R() * TAU })); })();
const FLOWERS = (() => { const R = rng(12); const cols = ['#ff8fb8', '#ffd23f', '#8fc9ff', '#ffffff', '#ff9a4a', '#c58fff'];
  return Array.from({ length: 34 }, () => ({ x: R() * W, y: 760 + R() * 300, s: .7 + R() * .9, p: R() * TAU, col: cols[Math.floor(R() * cols.length)] })); })();
const DUST = scatter(21, 30, 0, W, 0, H, 2, 5);
const GLIT = scatter(5, 40, 0, W, 0, 900, 5, 13);

function foreTufts(c, t, off = 0, y = 1100, cols) {
  for (const k of TUFTS) { const x = ((k.x - off) % 3200 + 3200) % 3200 - 200; if (x < -80 || x > W + 80) continue; tuft(c, x, y, k.s * 1.4, Math.sin(t * 2.4 + k.p), ...(cols || [])); }
}
function ozMeadow(c, t, off = 0) {
  sky(c, '#72c3f5', '#bfe6ff', '#fff0c8'); sun(c, 260, 120, 520); clouds(c, t, CLOUDS);
  hills(c, off * .1, 600, 26, '#a9d6a6', .004); hills(c, off * .25, 650, 34, '#86c477', .0032); hills(c, off * .5, 700, 26, '#6cb35a', .0026);
}

const SCENES = [
  // 00 title
  (c, t, u, d) => {
    sky(c, '#ffb57a', '#ffd9a0', '#fff1cf'); sun(c, W / 2, 520, 700, '255,236,180'); clouds(c, t, CLOUDS, 6, .8, '255,240,225');
    hills(c, 0, 640, 30, '#a9d6a6', .004); emeraldCity(c, W / 2, 690, 1.15, t); twinkles(c, t, scatter(4, 18, 600, 1320, 260, 640));
    hills(c, 200, 700, 30, '#86c477', .003); hills(c, 500, 780, 24, '#6cb35a', .0026);
    c.save(); c.translate(W / 2, 950); c.scale(.9, .9); c.beginPath(); c.moveTo(-900, 120); c.quadraticCurveTo(-200, -60, 0, -170); c.quadraticCurveTo(200, -60, 900, 120); c.closePath();
    c.fillStyle = lin(c, 0, -170, 0, 120, [[0, '#f5cd4f'], [1, '#d9982a']]); c.fill(); c.restore();
    const k = ease(u / 1.2);
    c.save(); c.globalAlpha = k; c.translate(W / 2, 250 - (1 - k) * 40); c.textAlign = 'center';
    c.font = '600 112px Fredoka'; c.lineWidth = 16; c.strokeStyle = 'rgba(90,45,10,.55)'; c.lineJoin = 'round'; c.strokeText("The Wizard's Secret", 0, 0);
    c.fillStyle = '#fffaf0'; c.fillText("The Wizard's Secret", 0, 0);
    c.font = '600 48px Fredoka'; c.fillStyle = '#5a3418'; c.fillText('The Wonderful Wizard of Oz', 0, 80); c.restore();
    const wk = t * 5.2; [[lion, 640, 0], [tinWoodman, 820, 1.2], [scarecrow, 980, 2.1], [dorothy, 1130, .3], [toto, 1280, 0]].forEach(([f, x, o], i) =>
      put(c, f, x + u * 18, 930, f === toto ? .7 : .48, { ph: wk + o, blink: blinkAt(t, i), shoes: 'silver' }, t));
    vignette(c);
  },
  // 01 gray Kansas
  (c, t, u, d) => {
    sky(c, '#b9b6ae', '#d6d2c8', '#e8e2d2'); sun(c, 1500, 160, 400, '255,245,225'); clouds(c, t, CLOUDS, 5, .5, '235,232,225');
    hills(c, 0, 690, 8, '#b4ab98', .002); ground(c, 700, '#bdb29a', '#a99d84');
    windmill(c, 1500, 720, .9, t); farmhouse(c, 360, 720, .9, 1, 0);
    put(c, uncleHenry, 1340, 740, .62, { walk: 0, blink: blinkAt(t, 3) }, t); put(c, auntEm, 520, 724, .58, { walk: 0, blink: blinkAt(t, 4) }, t);
    fence(c, 800, '#8d8576');
    const laugh = u > 2 && (u % 3) < 1.6;
    put(c, dorothy, 940, GROUND + 20, 1, { walk: 0, blink: blinkAt(t, 1), shoes: 'boots', mouth: laugh ? Math.abs(Math.sin(u * 10)) * .7 : 0, armF: laugh ? 2.4 : .2, armB: laugh ? -2.4 : -.2 }, t);
    const a = u * 2.2, tx = 940 + Math.cos(a) * 260, flip = Math.sin(a) > 0;
    put(c, toto, tx, GROUND + 30 + Math.sin(a) * 30, 1.25, { ph: u * 9, blink: 0, bark: (u % 2) < .3 }, t, flip);
    foreTufts(c, t, 0, 1100, ['#9d9478', '#b2a98c']);
    vignette(c, .04);
  },
  // 02 the cyclone
  (c, t, u, d) => {
    const shake = Math.sin(t * 40) * 6 * clamp(u / 2);
    c.save(); c.translate(shake, Math.cos(t * 37) * 4 * clamp(u / 2));
    sky(c, '#2d3040', '#4a4c5a', '#6c6a68'); clouds(c, t, CLOUDS, 60, .35, '120,120,130');
    hills(c, 0, 720, 8, '#5e5a50', .002); ground(c, 730, '#6d6656', '#4f4a3e');
    // swirling funnel
    c.save(); c.translate(1000, 0);
    for (let i = 0; i < 26; i++) { const y = 60 + i * 30, w = 360 - i * 11 + Math.sin(t * 3 + i) * 14, x = Math.sin(t * 2 + i * .4) * 30 * (i / 26);
      c.beginPath(); c.ellipse(x, y, w, 26, 0, Math.PI * ((t * 3 + i * .3) % 2), Math.PI * ((t * 3 + i * .3) % 2) + 1.6 * Math.PI); c.lineWidth = 12; c.strokeStyle = `rgba(${150 + i * 3},${150 + i * 3},${160 + i * 3},.55)`; c.stroke(); }
    c.restore();
    const rise = ease((u - 1.5) / (d - 2)), hy = lerp(860, 330, rise), spin = Math.sin(t * 2.5) * .25 * rise;
    put(c, uncleHenry, 300 - u * 40, 900, .7, { ph: u * 8, walk: 1, blink: 0, arms: 1.2, wave: 1 }, t);
    bubble(c, 330 - u * 40, 520, 'Cyclone!', clamp(1 - Math.abs(u - 1.2) / 1.2));
    c.save(); c.translate(1000, hy); c.rotate(spin); farmhouse(c, 0, 0, .75, 1, 0);
    // Dorothy and Toto peek out of the window
    c.save(); rr(c, -82, -97, 48, 42, 4); c.clip(); c.fillStyle = '#3a3630'; c.fillRect(-82, -97, 48, 42);
    c.save(); c.translate(-66, -2); c.scale(.28, .28); dorothy(c, { walk: 0, blink: 0, mood: 'wow', armF: 2.6, armB: -2.6, shoes: 'boots' }, t); c.restore();
    c.save(); c.translate(-50, -40); c.scale(.3, .3); toto(c, { sit: true, blink: 0, bark: true }, t); c.restore(); c.restore();
    c.restore();
    for (let i = 0; i < 16; i++) { const q = t * 3 + i * 1.7, r = 260 + (i % 4) * 70; c.save(); c.translate(1000 + Math.cos(q) * r, 500 + Math.sin(q) * 120 - i * 10); c.rotate(q * 2);
      rr(c, -10, -4, 20 + (i % 3) * 10, 8, 2); c.fillStyle = i % 2 ? '#8a7a5a' : '#c9b48e'; c.fill(); c.restore(); }
    c.restore();
    c.fillStyle = 'rgba(20,20,40,.25)'; c.fillRect(0, 0, W, H);
  },
  // 03 landing in color
  (c, t, u, d) => {
    const land = ease(u / .9), bump = u > .9 && u < 1.4 ? Math.sin((u - .9) * 20) * 10 * (1.4 - u) : 0;
    ozMeadow(c, t);
    tree(c, 1580, 760, 1, t, '#5aa84a', true); tree(c, 1800, 780, .8, t, '#4f9e3f', true);
    // a sparkling brook
    c.beginPath(); c.moveTo(W, 700); c.bezierCurveTo(1400, 760, 1500, 900, 1100, 1080); c.lineTo(1300, 1080); c.bezierCurveTo(1650, 900, 1500, 780, W, 740); c.closePath();
    c.fillStyle = lin(c, 1100, 0, W, 0, [[0, '#7cc8f0'], [1, '#b8e6ff']]); c.fill(); twinkles(c, t * 1.5, scatter(7, 10, 1200, 1800, 720, 1050), '#ffffff');
    ground(c, 860, 'rgba(110,180,90,0)', 'rgba(70,140,60,.4)');
    for (const f of FLOWERS) flower(c, f.x, f.y, f.s, Math.sin(t * 2 + f.p), f.col);
    farmhouse(c, 520, lerp(260, 840, land) + bump, .95, 1, clamp((u - 1.8) / .8));
    if (u > .9 && u < 2.2) for (let i = 0; i < 12; i++) { const k = (u - .9) / 1.3, q = i / 12 * Math.PI; ell(c, 520 + Math.cos(q) * (180 + k * 220) * (i % 2 ? 1 : -1), 840 - Math.sin(q) * 30 * k, 40 + k * 30, 20 + k * 10); c.fillStyle = `rgba(220,210,190,${.5 * (1 - k)})`; c.fill(); }
    const out = ease((u - 2.4) / 1.2);
    if (u > 2.2) put(c, dorothy, lerp(560, 820, out), GROUND + 10, .95, { ph: u * 5, walk: out < 1 ? 1 : 0, blink: blinkAt(t, 1), shoes: 'boots', mood: u > 3.6 ? 'wow' : null, hold: true }, t);
    for (let i = 0; i < 5; i++) { const pop = ease((u - 3 - i * .35) / .5); if (pop <= 0) continue;
      put(c, munchkin, 1000 + i * 120, GROUND + 20 + (1 - pop) * 120, .95, { hop: 12, blink: blinkAt(t, i) }, t + i, true); }
    vignette(c);
  },
  // 04 Glinda and the silver shoes
  (c, t, u, d) => {
    sky(c, '#7fb6ff', '#c9e2ff', '#fff4dc'); sun(c, 900, 0, 600); clouds(c, t, CLOUDS, 6);
    hills(c, 0, 640, 30, '#6f9be0', .004); hills(c, 300, 700, 30, '#5d8bd6', .003);
    c.save(); c.beginPath(); c.moveTo(1150, 700); c.bezierCurveTo(1500, 760, 1100, 860, 1500, 1080); c.lineTo(1900, 1080); c.bezierCurveTo(1400, 860, 1800, 760, 1250, 700); c.closePath();
    c.fillStyle = lin(c, 0, 700, 0, 1080, [[0, '#f5cd4f'], [1, '#e2a92a']]); c.fill(); c.restore();
    ground(c, 860, 'rgba(90,140,220,0)', 'rgba(60,100,190,.35)');
    for (let i = 0; i < 4; i++) put(c, munchkin, 1500 + i * 90, 770, .7, { hop: 8, blink: blinkAt(t, i) }, t + i, true);
    const down = ease(u / 2.2), gy = lerp(-200, 760, down);
    puff(c, 420, gy + 30, 1.4, .95); puff(c, 330, gy + 60, 1.1, .95);
    put(c, glinda, 520, gy, 1.02, { blink: blinkAt(t, 2), mouth: talk(u, 3.2, d - 2), armF: lerp(.6, 1.5, ease((u - 2.4) / 1)) }, t);
    const got = u > 5.4;
    put(c, dorothy, 930, GROUND + 20, 1, { walk: 0, blink: blinkAt(t, 1), shoes: got ? 'silver' : 'boots', mood: u > 5.4 && u < 7 ? 'wow' : null, hold: true }, t, true);
    if (u > 2.6 && u < 5.4) { const k = ease((u - 2.6) / 2.8); const sx = lerp(720, 925, k), sy = lerp(600, 840, k) - Math.sin(k * Math.PI) * 120;
      ell(c, sx, sy, 22, 11); c.fillStyle = lin(c, sx - 20, 0, sx + 20, 0, [[0, '#fff'], [.5, '#b9c4da'], [1, '#eef2fa']]); c.fill(); ink(c, 3); c.stroke(); sparkle(c, sx + 16, sy - 12, 16, t * 3); }
    if (u > 5.2 && u < 6.6) for (let i = 0; i < 10; i++) { const k = (u - 5.2) / 1.4, q = i / 10 * TAU; sparkle(c, 930 + Math.cos(q) * 90 * k, 840 + Math.sin(q) * 40 * k, 22 * (1 - k), t); }
    twinkles(c, t, GLIT.slice(0, 18));
    vignette(c);
  },
  // 05 the Scarecrow
  (c, t, u, d) => {
    sky(c, '#ffd9a8', '#ffe9c4', '#fff4d8'); sun(c, 1600, 200, 500); clouds(c, t, CLOUDS, 6, .8);
    hills(c, 0, 640, 24, '#6f9be0', .003);
    for (let row = 0; row < 3; row++) for (let x = -40; x < W + 60; x += 46) { const y = 700 + row * 40, sway = Math.sin(t * 1.6 + x * .02 + row) * 8;
      c.beginPath(); c.moveTo(x, y + 120); c.quadraticCurveTo(x + sway, y + 40, x + sway * 1.6, y); c.lineWidth = 8; c.strokeStyle = row % 2 ? '#d9b23f' : '#e8c454'; c.stroke();
      ell(c, x + sway * 1.6, y - 10, 9, 22, sway * .03); c.fillStyle = '#f2c94c'; c.fill(); ink(c, 2); c.stroke(); }
    brickRoad(c, 0, 880, 1080);
    const drop = ease((u - 4) / .8), onPole = u < 4;
    rr(c, 600, 300, 26, 600, 6); fillStroke(c, '#8a5a32'); rr(c, 470, 400, 290, 22, 6); fillStroke(c, '#8a5a32');
    const sx = onPole ? 612 : lerp(612, 760, drop), sy = onPole ? 700 + Math.sin(t * 2) * 4 : lerp(700, 890, drop) - Math.sin(drop * Math.PI) * 60;
    put(c, scarecrow, sx, sy, 1, { walk: 0, blink: blinkAt(t, 2), armF: onPole ? 1.55 : (u > 5 ? .3 : 1.2), armB: onPole ? -1.55 : -.3, mouth: talk(u, 5.8, 9), mood: onPole && u > 1 && u < 4 ? 'wow' : null }, t);
    put(c, dorothy, 1060, 890, 1, { walk: 0, blink: blinkAt(t, 1), shoes: 'silver', armF: u < 4.4 ? 2.3 : .2, mouth: talk(u, 9.4, d - .8) }, t, true);
    put(c, toto, 1290, 895, 1.2, { walk: 0, ph: 0, blink: blinkAt(t, 4) }, t, true);
    for (let i = 0; i < 3; i++) { const bx = 300 + ((t * 120 + i * 500) % 1600), by = 300 + Math.sin(t * 3 + i) * 30;
      c.save(); c.translate(bx, by); c.fillStyle = '#2a2a2a'; ell(c, 0, 0, 14, 9); c.fill(); c.beginPath(); c.moveTo(-6, 0); c.lineTo(-18, -12 * Math.sin(t * 12 + i)); c.lineTo(6, 0); c.fill(); c.restore(); }
    vignette(c);
  },
  // 06 the Tin Woodman
  (c, t, u, d) => {
    sky(c, '#cfe9c9', '#e8f6dc', '#fff8e0'); sun(c, 960, 0, 700);
    for (let i = 0; i < 9; i++) { c.fillStyle = 'rgba(255,250,220,.12)'; c.beginPath(); c.moveTo(700 + i * 70, 0); c.lineTo(760 + i * 70, 0); c.lineTo(400 + i * 160, 900); c.lineTo(300 + i * 160, 900); c.fill(); }
    hills(c, 0, 700, 20, '#7fbf6a', .003);
    tree(c, 140, 900, 1.5, t, '#4c9a46'); tree(c, 1780, 900, 1.4, t, '#4f9e3f'); tree(c, 1450, 820, 1, t, '#5aa84a');
    ground(c, 840, '#79b862', '#4f9a44');
    for (const f of FLOWERS.slice(0, 14)) flower(c, f.x, f.y + 60, f.s * .8, Math.sin(t * 2 + f.p), f.col);
    const oil = clamp((u - 2.5) / 3.5), free = u > 6;
    put(c, tinWoodman, 820, 860, 1.08, { walk: 0, blink: oil < .3 ? 0 : blinkAt(t, 2), rust: 1 - oil, armF: free ? (.4 + Math.sin(u * 3) * .4) : 1.9, armB: free ? -.2 : .1, mouth: talk(u, 6.4, 9.8), mood: free && u < 7 ? 'wow' : null }, t);
    put(c, dorothy, 1060, 860, 1, { walk: 0, blink: blinkAt(t, 1), shoes: 'silver', armF: u > 2 && u < 6 ? 1.7 + Math.sin(u * 6) * .15 : .2 }, t, true);
    if (u > 2 && u < 6) { c.save(); c.translate(940, 620); c.rotate(-.5); rr(c, -12, -20, 24, 34, 6); fillStroke(c, '#c3cddb', 3); c.beginPath(); c.moveTo(0, -20); c.lineTo(-30, -40); ink(c, 5); c.stroke(); c.restore();
      for (let i = 0; i < 3; i++) { const k = ((u * 1.5 + i / 3) % 1); ell(c, 905, 580 + k * 60, 4, 6); c.fillStyle = 'rgba(200,170,60,.9)'; c.fill(); } }
    if (u <= 2) { c.save(); c.translate(910, 845); c.rotate(.2); rr(c, -14, -22, 28, 36, 6); fillStroke(c, '#c3cddb', 3); c.beginPath(); c.moveTo(0, -22); c.lineTo(-32, -44); ink(c, 5); c.stroke(); c.restore(); }
    put(c, scarecrow, 1300, 860, .95, { walk: 0, blink: blinkAt(t, 3), armF: SPEAK.who === 'scarecrow' ? 1.7 : undefined, mood: free && u < 8 ? 'wow' : null }, t, true);
    put(c, toto, 560, 870, 1.2, { walk: 0, blink: blinkAt(t, 4) }, t);
    if (free && u < 7.5) for (let i = 0; i < 6; i++) sparkle(c, 780 + Math.cos(i) * 120, 530 + Math.sin(i * 2) * 140, 18 * (1 - (u - 6) / 1.5), t * 2 + i);
    twinkles(c, t, DUST.slice(0, 16), 'rgba(255,255,220,.9)');
    vignette(c);
  },
  // 07 the cowardly Lion
  (c, t, u, d) => {
    sky(c, '#cfe9c9', '#e8f6dc', '#fff8e0'); sun(c, 1300, 100, 600);
    hills(c, 0, 700, 20, '#7fbf6a', .003); tree(c, 1650, 860, 1.4, t, '#4f9e3f'); tree(c, 260, 860, 1.2, t, '#5aa84a');
    brickRoad(c, 0, 760, 920); ground(c, 920, '#69b04f', '#4a9440');
    const jump = ease(u / .9), sitK = ease((u - 2.2) / .8);
    const lx = lerp(-200, 640, jump), ly = 860 - Math.sin(jump * Math.PI) * 160;
    put(c, lion, lx, ly, 1, { walk: u < 2.2 ? 0 : 0, sit: u > 2.2, blink: blinkAt(t, 2), roar: u > .4 && u < 2 ? 1 : 0, mood: u > 2.2 ? 'sad' : null, tears: u > 2.6 ? ((u * .8) % 1) : 0, mouth: talk(u, 4.6, 8.6) }, t);
    bubble(c, 540, 380, 'ROAR!', clamp(1 - Math.abs(u - 1.1) / 1), 70);
    put(c, toto, 1020, 900, 1.25, { walk: 0, blink: 0, bark: u > 1 && u < 3.6 && (u % .5) < .25 }, t, true);
    const pat = u > 8.6;
    put(c, dorothy, 1140, 890, 1, { walk: 0, blink: blinkAt(t, 1), shoes: 'silver', armF: pat ? 2 + Math.sin(u * 5) * .2 : .2, mood: u < 2.2 ? 'wow' : null, mouth: talk(u, 9.6, d - .6) }, t, true);
    put(c, scarecrow, 1440, 860, .9, { walk: 0, blink: blinkAt(t, 3), mood: u < 4 ? 'wow' : null }, t, true);
    const tinCry = CUE.on.tinCry;
    put(c, tinWoodman, 1620, 860, .9, { walk: 0, blink: blinkAt(t, 4), mood: u < 4 ? 'wow' : (tinCry ? 'sad' : null), tears: tinCry ? (t * .8) % 1 : 0 }, t, true);
    vignette(c);
  },
  // 08 down the road of yellow bricks
  (c, t, u, d) => {
    const cam = u * 150;
    ozMeadow(c, t, cam); emeraldCity(c, 1440, 700, 1, t); twinkles(c, t, SPARK_CITY);
    hills(c, cam * .45 + 400, 690, 24, '#6cb35a', .0026);
    poppies(c, t, POP, cam * .45);
    c.fillStyle = '#5ea84c'; c.fillRect(0, 712, W, 26); brickRoad(c, cam, 730, 880); ground(c, 880, '#5aa846', '#3f8a34');
    const wk = u * 5.2;
    [[lion, 400, wk * .8, .95], [tinWoodman, 720, wk + 1.2, .97], [scarecrow, 960, wk + 2.1, .98], [dorothy, 1190, wk + .3, 1], [toto, 1420, wk * 1.3, 1.5]].forEach(([f, x, ph, s], i) =>
      put(c, f, x + Math.sin(t * .6 + i) * 14, 828, s * 1.18, { ph, blink: blinkAt(t, i), shoes: 'silver', mood: f === lion ? 'happy' : null }, t));
    foreTufts(c, t, cam * 1.5); butterfly(c, t, 300, 520, '#ff9ed1', 1); butterfly(c, t, 1500, 300, '#ffd84d', .8);
    vignette(c);
  },
  // 09 the great head in the throne room
  (c, t, u, d) => {
    c.fillStyle = lin(c, 0, 0, 0, H, [[0, '#0f3d26'], [.6, '#1f6b40'], [1, '#2d8a52']]); c.fillRect(0, 0, W, H);
    for (const x of [180, 520, 1400, 1740]) { rr(c, x - 50, 0, 100, 900, 10); c.fillStyle = lin(c, x - 50, 0, x + 50, 0, [[0, '#1d7a45'], [.5, '#7fe0a5'], [1, '#17663a']]); c.fill(); ink(c, 3); c.stroke(); }
    rr(c, 0, 840, W, 240, 0); c.fillStyle = lin(c, 0, 840, 0, H, [[0, '#3aa868'], [1, '#1d6a3e']]); c.fill();
    // green marble throne
    const em = lin(c, 800, 0, 1120, 0, [[0, '#1f8a4c'], [.5, '#8ff0b5'], [1, '#1a7040']]);
    c.beginPath(); c.moveTo(830, 840); c.lineTo(830, 560); c.quadraticCurveTo(960, 470, 1090, 560); c.lineTo(1090, 840); c.closePath(); fillStroke(c, em);
    rr(c, 800, 700, 320, 50, 12); fillStroke(c, '#2a9a58'); for (const x of [790, 1090]) { rr(c, x, 660, 40, 180, 10); fillStroke(c, em); }
    ell(c, 960, 560, 26, 30); fillStroke(c, '#c9f7da', 3); rr(c, 780, 820, 360, 30, 6); fillStroke(c, '#f0c24a', 3);
    const appear = ease(u / 1.5);
    c.save(); c.globalAlpha = appear; c.translate(960, 360 + Math.sin(t * 1.3) * 14); c.scale(.95 + Math.sin(t * 9) * .005, .95); live('wizardHead', c, {}, 0, 60); bigHead(c, t); c.restore();
    for (let i = 0; i < 8; i++) { const q = t * .6 + i; ell(c, 960 + Math.cos(q) * 300, 380 + Math.sin(q * 1.3) * 150, 60, 30); c.fillStyle = 'rgba(200,255,220,.08)'; c.fill(); }
    const shiver = u > 2 && u < 10 ? Math.sin(t * 50) * 3 : 0;
    [[scarecrow, 600, .9], [tinWoodman, 760, .9], [dorothy, 1160, .95], [lion, 1400, .85]].forEach(([f, x, s], i) =>
      put(c, f, x + shiver, 930, s, { walk: 0, blink: blinkAt(t, i), shoes: 'silver', mood: 'wow' }, t, x > 960));
    put(c, toto, 1000 + shiver, 940, 1.1, { walk: 0, blink: 0 }, t);
    vignette(c, .02);
  },
  // 10 the Winged Monkeys and the yellow castle
  (c, t, u, d) => {
    sky(c, '#3b2a6a', '#7a5aa8', '#e8a0b0'); sun(c, 1500, 600, 500, '255,190,170');
    hills(c, 0, 640, 30, '#4f4a8a', .003);
    c.save(); c.translate(1450, 520); c.beginPath(); c.moveTo(-300, 200); c.quadraticCurveTo(0, -140, 300, 200); c.closePath(); c.fillStyle = '#5a5a8f'; c.fill();
    for (const [x, h, w] of [[-80, 120, 50], [0, 180, 60], [80, 120, 50], [-130, 80, 40], [130, 80, 40]]) { rr(c, x - w / 2, -40 - h, w, h + 40, 4); fillStroke(c, '#f0c24a', 3);
      c.beginPath(); c.moveTo(x - w / 2 - 8, -40 - h); c.lineTo(x, -80 - h); c.lineTo(x + w / 2 + 8, -40 - h); c.closePath(); fillStroke(c, '#c9902a', 3); rr(c, x - 7, -h, 14, 22, 7); c.fillStyle = '#ffe9a0'; c.fill(); }
    c.restore();
    hills(c, 200, 760, 26, '#3f6a4a', .003); ground(c, 820, '#4f7a4a', '#2f5a3a');
    // monkeys swoop in, take Dorothy and Toto, and fly off to the castle
    const grab = 2.2, away = clamp((u - grab) / 3);
    const dx = u < grab ? 1100 : lerp(1100, 1450, ease(away)), dy = u < grab ? 860 : lerp(860, 300, ease(away)), ds = u < grab ? 1 : lerp(1, .25, ease(away));
    put(c, dorothy, dx, dy, ds, { walk: 0, blink: 0, shoes: 'silver', mood: 'wow', armF: u > grab ? 2.8 : .2, armB: u > grab ? -2.8 : -.2, hold: u <= grab }, t);
    for (let i = 0; i < 6; i++) { const k = ease((u - i * .15) / grab), path = i < 2 ? 1 : 0;
      const mx = u < grab ? lerp(-200 - i * 140, 1000 + i * 60, k) : (path ? dx + (i ? 60 : -60) : lerp(1000 + i * 60, 2200, away)), my = u < grab ? lerp(200, 640 + (i % 3) * 30, k) + Math.sin(t * 3 + i) * 20 : (path ? dy - 330 * ds : lerp(640, 200, away) + Math.sin(t * 3 + i) * 20);
      c.save(); c.translate(mx, my); c.scale(path && u > grab ? ds * 1.2 : .9, path && u > grab ? ds * 1.2 : .9); monkey(c, t, i); c.restore(); }
    if (u < 3) put(c, witch, 1450, 300, .38, { armF: 2.4, blink: blinkAt(t, 5) }, t, true);   // the Witch calls from her tower
    const walkIn = clamp((u - 6) / (d - 6)), moving = u > 6;
    [[scarecrow, 330], [tinWoodman, 510]].forEach(([f, x], i) =>
      put(c, f, x + walkIn * 300, 890, .82, { ph: u * 5 + i, walk: moving ? 1 : 0, blink: blinkAt(t, i), mood: u < 5 ? 'wow' : null }, t));
    // the Lion faces the monkeys and roars to protect Dorothy
    put(c, lion, 860 + walkIn * 300, 890, .82, { ph: u * 5, walk: moving ? 1 : 0, blink: blinkAt(t, 2), mood: u > 6 ? 'happy' : null }, t, !moving);
    bubble(c, 700, 470, 'ROAR!', SPEAK.who === 'lion' ? clamp(SPEAK.amp * 3) : 0, 64);
    twinkles(c, t, scatter(17, 20, 0, W, 0, 400, 3, 7));
    vignette(c, .03);
  },
  // 11 the bucket of water
  (c, t, u, d) => {
    c.fillStyle = lin(c, 0, 0, 0, H, [[0, '#6b5a4a'], [1, '#8a7560']]); c.fillRect(0, 0, W, H);
    for (let y = 0; y < 840; y += 60) for (let x = (y / 60) % 2 * 60; x < W; x += 120) { rr(c, x + 3, y + 3, 114, 54, 6); c.fillStyle = 'rgba(255,240,220,.08)'; c.fill(); }
    rr(c, 1500, 380, 360, 460, 20); fillStroke(c, '#4a3a2e'); c.fillStyle = rad(c, 1680, 760, 10, 200, [[0, '#ffd27a'], [.5, '#ff8a3a'], [1, 'rgba(120,40,10,0)']]); rr(c, 1550, 620, 260, 220, 14); c.fill();
    for (let i = 0; i < 4; i++) { ell(c, 260 + i * 110, 300, 34, 34); fillStroke(c, '#b5652e', 3); }
    rr(c, 0, 840, W, 240, 0); c.fillStyle = lin(c, 0, 840, 0, H, [[0, '#b8a890'], [1, '#8f806a']]); c.fill();
    const throwAt = 4.6, melt = clamp((u - throwAt - .4) / 3);
    if (u < throwAt + .6) { const grabK = ease((u - 1.4) / .8); if (u > 1.4 && u < 3.6) { const sx = lerp(860, 1180, grabK), sy = 880 - Math.sin(grabK * Math.PI) * 60;
      ell(c, sx, sy, 20, 10); c.fillStyle = '#c9d3e6'; c.fill(); ink(c, 3); c.stroke(); } }
    put(c, witch, 1240, 890, 1.05, { melt, armF: u < 3.6 ? 1.2 : .6, mood: u > throwAt ? 'wow' : null }, t, true);
    put(c, dorothy, 820, 890, 1, { walk: 0, blink: blinkAt(t, 1), shoes: 'silver', mood: u < throwAt ? null : 'wow', armF: u > 3.8 && u < throwAt + .6 ? lerp(.2, 2.2, ease((u - 3.8) / .8)) : .3, armB: u > 3.8 && u < throwAt + .6 ? lerp(-.2, 1.2, ease((u - 3.8) / .8)) : -.2, mouth: talk(u, 2.4, 3.6) }, t);
    if (u > 3.8 && u < throwAt + .6) { c.save(); c.translate(890, 690); c.rotate(lerp(0, -1.4, ease((u - 3.8) / .8))); rr(c, -30, -20, 60, 60, 8); fillStroke(c, '#8a6a4a', 3); c.restore(); }
    if (u > throwAt && u < throwAt + 1.2) for (let i = 0; i < 26; i++) { const k = (u - throwAt) / 1.2, q = i / 26; ell(c, lerp(900, 1240, k * (.7 + q * .5)), 690 - Math.sin(k * Math.PI) * 140 + q * 60 * k, 8, 12); c.fillStyle = 'rgba(120,190,255,.8)'; c.fill(); }
    const cheer = u > throwAt + 3;
    put(c, toto, 560, 910 - (cheer ? Math.abs(Math.sin(u * 8)) * 30 : 0), 1.2, { walk: 0, blink: 0, bark: cheer && (u % .5) < .25 }, t);
    put(c, lion, 330, 910 - (cheer ? Math.abs(Math.sin(u * 7)) * 20 : 0), .85, { walk: 0, blink: blinkAt(t, 3), mood: cheer ? 'happy' : 'wow' }, t);
    if (cheer) twinkles(c, t, GLIT.slice(0, 20), '#fff6b0');
    vignette(c, .05);
  },
  // 12 the man behind the screen
  (c, t, u, d) => {
    c.fillStyle = lin(c, 0, 0, 0, H, [[0, '#0f3d26'], [.6, '#1f6b40'], [1, '#2d8a52']]); c.fillRect(0, 0, W, H);
    for (const x of [180, 1740]) { rr(c, x - 50, 0, 100, 900, 10); c.fillStyle = lin(c, x - 50, 0, x + 50, 0, [[0, '#1d7a45'], [.5, '#7fe0a5'], [1, '#17663a']]); c.fill(); ink(c, 3); c.stroke(); }
    rr(c, 0, 840, W, 240, 0); c.fillStyle = lin(c, 0, 840, 0, H, [[0, '#3aa868'], [1, '#1d6a3e']]); c.fill();
    const fall = ease((u - 1.2) / .7);
    // gadgets and the little old man
    rr(c, 300, 600, 240, 260, 12); fillStroke(c, '#7a5a3a'); for (let i = 0; i < 4; i++) { rr(c, 330 + i * 52, 560 - (i % 2) * 30 + Math.sin(t * 3 + i) * (u > 2 ? 0 : 10), 14, 70, 6); fillStroke(c, '#c9a64a', 3); ell(c, 337 + i * 52, 556 - (i % 2) * 30, 14, 14); fillStroke(c, '#e84a3a', 3); }
    put(c, wizardMan, 640, 900, 1.15, { blink: blinkAt(t, 2), mood: u < 3 ? 'wow' : 'happy', mouth: talk(u, 3.4, d - .8), armF: u < 3 ? 2.2 : .5 + Math.sin(u * 2) * .3 }, t);
    // the folding screen tips over
    c.save(); c.translate(820, 850); c.rotate(-fall * 1.45);
    for (let i = 0; i < 3; i++) { rr(c, -420 + i * 140, -520, 136, 520, 8); fillStroke(c, lin(c, 0, -520, 0, 0, [[0, '#2f9a5a'], [1, '#1d6a3e']])); rr(c, -400 + i * 140, -480, 96, 440, 6); c.strokeStyle = '#ffd84d'; c.lineWidth = 3; c.stroke(); }
    c.restore();
    put(c, toto, lerp(900, 860, fall), 960, 1.2, { walk: 0, blink: 0, bark: u < 1.4 }, t, true);
    [[dorothy, 1100], [scarecrow, 1300], [tinWoodman, 1480], [lion, 1720]].forEach(([f, x], i) =>
      put(c, f, x, 910, f === lion ? .8 : .92, { walk: 0, blink: blinkAt(t, i), shoes: 'silver', mood: u < 3.4 ? 'wow' : 'happy' }, t, true));
    if (u > 8) for (let i = 0; i < 3; i++) { const k = clamp((u - 8 - i * 1.4) / 1); if (k <= 0) continue; const x = [1300, 1480, 1720][i];
      for (let j = 0; j < 5; j++) sparkle(c, x + Math.cos(j * 1.3) * 80 * k, 560 + Math.sin(j * 1.3) * 60 * k, 18 * (1 - k), t + j, '#fff6b0'); }
    vignette(c, .03);
  },
  // 13 click, click, click
  (c, t, u, d) => {
    ozMeadow(c, t); tree(c, 200, 860, 1.4, t); tree(c, 1720, 860, 1.4, t);
    ground(c, 860, '#79b862', '#4f9a44'); for (const f of FLOWERS.slice(10, 30)) flower(c, f.x, f.y + 40, f.s * .8, Math.sin(t * 2 + f.p), f.col);
    put(c, glinda, 520, 890, .98, { blink: blinkAt(t, 2), mouth: talk(u, .6, 5) }, t);
    const clicks = [6.4, 7.4, 8.4], lift = clicks.reduce((m, ck) => Math.max(m, clamp(1 - Math.abs(u - ck) / .25)), 0);
    put(c, lion, 1500, 920, .8, { walk: 0, blink: blinkAt(t, 3), mood: 'happy' }, t, true);
    put(c, tinWoodman, 1310, 910, .9, { walk: 0, blink: blinkAt(t, 4), armF: u > 4.6 ? 2.6 + Math.sin(u * 7) * .3 : .3, tears: u > 5 ? (u * .7) % 1 : 0 }, t, true);
    put(c, scarecrow, 1150, 910, .9, { walk: 0, blink: blinkAt(t, 5), armF: u > 4.6 ? 2.6 + Math.sin(u * 7 + 1) * .3 : .3 }, t, true);
    const glow = clamp((u - 6.2) / (d - 6.4));
    put(c, dorothy, 900, 920 - lift * 26, 1, { walk: 0, blink: blinkAt(t, 1), shoes: 'silver', hold: true, mouth: talk(u, 8.8, d - .4) }, t);
    for (const ck of clicks) if (u > ck && u < ck + .9) for (let i = 0; i < 9; i++) { const k = (u - ck) / .9, q = i / 9 * TAU; sparkle(c, 900 + Math.cos(q) * 120 * k, 905 + Math.sin(q) * 40 * k, 24 * (1 - k), t * 3); }
    c.fillStyle = `rgba(255,255,255,${ease(glow) * .9})`; c.fillRect(0, 0, W, H);
    for (let i = 0; i < 20; i++) { const q = t * 2 + i, r = 160 + ((i * 37) % 100); sparkle(c, 900 + Math.cos(q) * r * glow, 820 + Math.sin(q) * r * glow * .6, 18 * glow, q); }
    vignette(c);
  },
  // 14 home again
  (c, t, u, d) => {
    sky(c, '#8fd0ff', '#d8efff', '#fff3d6'); sun(c, 300, 140, 600); clouds(c, t, CLOUDS, 8);
    hills(c, 0, 660, 20, '#9fd38a', .002); ground(c, 700, '#8ccb6e', '#5ea84c');
    windmill(c, 1640, 720, .9, t); farmhouse(c, 1260, 740, .95, 0, 1);
    for (const f of FLOWERS.slice(0, 18)) flower(c, f.x, f.y + 40, f.s * .7, Math.sin(t * 2 + f.p), f.col);
    const flash = 1 - clamp(u / .8);
    const roll = ease(u / 1.4), run = ease((u - 2) / 2.2), hug = u > 4.3;
    const dx = u < 2 ? lerp(160, 380, roll) : lerp(380, 860, run);
    put(c, auntEm, hug ? 960 : lerp(1180, 910, ease((u - 1.6) / 2.4)), 960, 1.05, { ph: u * 6, walk: u > 1.6 && !hug ? 1 : 0, blink: blinkAt(t, 2), arms: hug ? 1.6 : lerp(.3, 1.3, ease((u - 2) / 1)) }, t, true);
    put(c, dorothy, dx, 890 - (u < 1.4 ? Math.abs(Math.sin(u * 7)) * 30 * (1 - roll) : 0), 1, { ph: u * 7, walk: u > 2 && !hug ? 1 : 0, blink: blinkAt(t, 1), shoes: 'boots', armF: hug ? 1.6 : null, mouth: talk(u, 9, d - .6) }, t);
    put(c, uncleHenry, 1480, 800, .72, { walk: 0, blink: blinkAt(t, 3), wave: .8, arms: .2 }, t, true);
    put(c, toto, 640 + Math.sin(u * 2) * 60, 920 - Math.abs(Math.sin(u * 8)) * 26, 1.2, { walk: 0, blink: 0, bark: (u % 1.4) < .3 }, t);
    if (hug) for (let i = 0; i < 4; i++) { const k = ((u - 4.3) * .5 + i / 4) % 1; c.save(); c.globalAlpha = 1 - k; c.translate(910 + Math.sin(i * 2 + u) * 40, 570 - k * 160); c.scale(1.2, 1.2);
      c.beginPath(); c.moveTo(0, 6); c.bezierCurveTo(-18, -8, -8, -22, 0, -12); c.bezierCurveTo(8, -22, 18, -8, 0, 6); c.fillStyle = '#ff6b8a'; c.fill(); c.restore(); }
    butterfly(c, t, 200, 420, '#ff9ed1', 1);
    c.fillStyle = `rgba(255,255,255,${flash})`; c.fillRect(0, 0, W, H);
    vignette(c);
  },
];
