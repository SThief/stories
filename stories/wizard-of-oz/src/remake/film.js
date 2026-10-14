// The Wizard's Secret, remade: the same story, narration and voices (dialogue.js, the first cartoon's soundtrack), told
// again as a film. Each shot is { a, b, light, cam(u), draw(c, t, u, cam) }: from a to b seconds, a light (see look.js),
// a camera ({ x, y, z }: the point of the stage at the centre of the frame, and the zoom) and the drawing.
// Places are built from layers at depths p (0 = the sky, 1 = where the characters stand, > 1 = close to the lens), so
// when the camera moves, near things move faster than far ones. The colour follows Dorothy's feelings: Kansas is grey,
// Oz bursts into colour, the road glows gold, the Emerald City green, and at the end Kansas is warm and golden too.
const SHOTS = [];
function glow(c, x, y, r, col, a) { if (a <= 0 || r <= 0) return; c.fillStyle = rad(c, x, y, 0, r, [[0, `rgba(${col},${a})`], [.4, `rgba(${col},${a * .35})`], [1, `rgba(${col},0)`]]); c.fillRect(x - r, y - r, r * 2, r * 2); }
const hash = (i, k = 0) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const shot = (a, b, light, cam, draw) => SHOTS.push({ a, b, light, cam: typeof cam === 'function' ? cam : () => cam, draw });
const at = (x, y, z = 1) => ({ x, y, z });
const push = (x, y, z0, z1, d, x1 = x, y1 = y) => u => ({ x: lerp(x, x1, ease(u / d)), y: lerp(y, y1, ease(u / d)), z: lerp(z0, z1, ease(u / d)) });
function view(cam, p) { const zp = 1 + (cam.z - 1) * p;
  return new DOMMatrix().translate(960, 540).scale(zp).translate(-(960 + (cam.x - 960) * p), -(540 + (cam.y - 540) * p)); }
function layer(c, cam, p, fn) { c.save(); c.setTransform(view(cam, p)); fn(c); c.restore(); }
function blurLayer(c, cam, p, px, fn) { c.save(); c.setTransform(view(cam, p)); c.filter = `blur(${px}px)`; fn(c); c.restore(); }
// lights for the moments of the story
const LIT = {
  kansas: { sun: [1500, 160], rim: '232,228,215', rimA: .4, tint: 'rgba(90,90,100,.06)', shade: '#6a6a78', hi: '#ffffff', shadowA: .2, haze: '214,208,196', rays: false, line: '#3a3438' },
  storm: { sun: [600, -300], rim: '170,200,230', rimA: .7, tint: 'rgba(20,40,60,.3)', shade: '#1e3040', hi: '#c8e0f0', shadowA: .15, haze: '80,100,110', rays: false, line: '#0e1418' },
  gloom: { sun: [1700, 300], rim: '255,240,210', rimA: .9, tint: 'rgba(30,24,30,.35)', shade: '#2a2028', hi: '#fff0d8', shadowA: .2, haze: '60,50,60', rays: false, line: '#140e12' },
  oz: { sun: [300, 80], rim: '255,248,220', rimA: .7, tint: 'rgba(60,80,150,.03)', shade: '#4a5a9a', hi: '#fffbe8', shadowA: .3, haze: '196,228,255', rays: true, line: '#2a1626' },
  glinda: { sun: [700, -100], rim: '255,225,245', rimA: .8, tint: 'rgba(200,120,200,.06)', shade: '#6a5a9a', hi: '#fff4ff', shadowA: .25, haze: '230,210,255', rays: true, line: '#2a1630' },
  golden: { sun: [1650, 420], rim: '255,200,120', rimA: .8, tint: 'rgba(140,70,60,.07)', shade: '#7a4a6a', hi: '#fff0c8', shadowA: .34, haze: '255,200,160', rays: true, line: '#2a1420' },
  forest: { sun: [1100, -200], rim: '235,255,200', rimA: .7, tint: 'rgba(30,70,40,.1)', shade: '#2e5a46', hi: '#f6ffe0', shadowA: .32, haze: '190,225,190', rays: false, line: '#14241a' },
  emerald: { sun: [960, 900], rim: '150,255,190', rimA: .85, tint: 'rgba(10,60,30,.24)', shade: '#0e3a22', hi: '#c8ffe0', shadowA: .3, haze: '60,160,100', rays: false, line: '#06180e' },
  dusk: { sun: [1500, 500], rim: '255,160,170', rimA: .8, tint: 'rgba(60,30,100,.22)', shade: '#2a1e5a', hi: '#ffd0e0', shadowA: .28, haze: '170,130,200', rays: false, line: '#140a24' },
  fire: { sun: [1700, 760], rim: '255,165,85', rimA: .9, tint: 'rgba(50,25,30,.26)', shade: '#3a1e28', hi: '#ffdcb0', shadowA: .36, haze: '150,100,80', rays: false, line: '#140808' },
  lamp: { sun: [500, 300], rim: '255,215,150', rimA: .8, tint: 'rgba(60,40,10,.12)', shade: '#4a3020', hi: '#fff0d0', shadowA: .3, haze: '200,170,120', rays: false, line: '#1e1208' },
  morning: { sun: [200, 100], rim: '255,240,250', rimA: .7, tint: 'rgba(200,140,180,.05)', shade: '#6a5a8a', hi: '#fffaff', shadowA: .26, haze: '255,226,240', rays: true, line: '#2a1626' },
  home: { sun: [1650, 380], rim: '255,205,130', rimA: .8, tint: 'rgba(150,80,40,.06)', shade: '#7a4a4a', hi: '#fff2cc', shadowA: .34, haze: '255,215,170', rays: true, line: '#2a1410' },
};
// Dorothy and Toto (heroes.js), wrapped so the look's acting (blended faces) and the voice reach them
const dor = (c, p, t) => { const f = p.__face || {}, cross = (f.brow ?? 0) < -.4, sad = (f.smile ?? 0) < -.3;
  // a kind face unless she is cross or sad: brows lifted softly in the middle, eyes open
  dorothy2(c, { ...p, ...f, brow: cross || sad ? f.brow : Math.max(f.brow ?? 0, .35), lid: sad ? f.lid : 0, open: Math.max(f.open || 0, p.talk || 0) }, t); };
const tot = (c, p, t) => toto2(c, { ...p, bark: (p.talk || 0) > .2 }, t);
const STR_D = 108 * .5 * 2 / Math.PI, STR_T = 20;   // foot travel per radian of the walk, at size 1
// who is talking, and how loudly, from the dialogue
const LINES = []; DIALOGUE.scenes.forEach(s => s.lines.forEach(l => LINES.push({ ...l, at: s.start + l.start })));
const voice = (who, t) => { for (const l of LINES) if (l.who === who && t >= l.at && t < l.at + l.dur) return l.env[Math.floor((t - l.at) * 30)] || 0; return 0; };
const blink = (t, k = 0) => ((t + k * .7) % 3.4) < .13;
const walked = (u, a, x0, x1, speed) => { const T = Math.abs(x1 - x0) / speed, k = clamp((u - a) / T); return { x: lerp(x0, x1, k), d: Math.abs(x1 - x0) * k, walk: u > a && k < 1 ? 1 : 0 }; };
function desat(c, k) {   // drain the colour out of what is drawn so far (Kansas): the characters drawn after stay in colour
  const t = TMPC.getContext('2d'); t.setTransform(1, 0, 0, 1, 0, 0); t.clearRect(0, 0, W, H); t.drawImage(c.canvas, 0, 0);
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.filter = `saturate(${k}) sepia(.25)`; c.drawImage(TMPC, 0, 0); c.restore();
}
const TMPC = document.createElement('canvas'); TMPC.width = W; TMPC.height = H;
const dark = (c, a, col = '0,0,0') => { if (a <= 0) return; c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = `rgba(${col},${a})`; c.fillRect(0, 0, W, H); c.restore(); };

// ---------- places ----------
function hillsW(c, off, base, amp, col, k, haze = clamp((790 - base) / 260) * .42) {   // hills wide enough for any camera, hazier the farther they are
  c.beginPath(); c.moveTo(-2500, 3000); for (let x = -2500; x <= W + 2500; x += 20) { const u = x + off; c.lineTo(x, base - Math.sin(u * k) * amp - Math.sin(u * k * 2.3 + 1) * amp * .4); }
  c.lineTo(W + 2500, 3000); c.closePath(); c.fillStyle = col; c.fill();
  c.save(); c.clip(); c.fillStyle = lin(c, 0, base - amp * 1.4, 0, base + 120, [[0, 'rgba(255,255,230,.18)'], [.4, 'rgba(0,40,0,0)'], [1, 'rgba(0,40,0,.12)']]); c.fillRect(-2500, base - amp * 1.5, W + 5000, 260);
  if (haze > 0) { c.fillStyle = `rgba(${PAGE_L.haze},${haze})`; c.fillRect(-2500, -1000, W + 5000, 4000); } c.restore();
}
function prairie(c, cam, t, wind = 0, skyOn = true) {   // flat gray Kansas under a wide sky
  if (skyOn) layer(c, cam, 0, g => { g.fillStyle = lin(g, 0, -400, 0, 700, [[0, '#8a96a2'], [.6, '#b8b8b2'], [1, '#d8d0c0']]); g.fillRect(-2000, -1500, W + 4000, 2600); sun(g, 1500, 160, 300, '255,250,235');
    for (let i = 0; i < 9; i++) { const x = ((hash(i, 3) * 3000 + t * (6 + wind * 60)) % 3200) - 600, y = 80 + hash(i, 4) * 420; ell(g, x, y, 260 + hash(i, 5) * 300, 14 + hash(i, 6) * 10); g.fillStyle = 'rgba(240,236,228,.5)'; g.fill(); } });
  layer(c, cam, .25, g => { g.fillStyle = '#b4ab98'; g.fillRect(-2500, 688, W + 5000, 40); for (let i = -6; i < 16; i++) { const x = i * 260 + 60; g.fillStyle = 'rgba(120,110,95,.6)'; g.fillRect(x, 640, 4, 50); g.fillRect(x - 14, 646, 32, 3); } });
  layer(c, cam, .6, g => { g.fillStyle = lin(g, 0, 700, 0, 1000, [[0, '#c4b89e'], [1, '#b0a284']]); g.fillRect(-2500, 700, W + 5000, 2000);
    g.lineCap = 'round'; for (let i = 0; i < 260; i++) { const x = hash(i, 7) * 3600 - 800, y = 720 + hash(i, 8) ** 1.5 * 360, h = 6 + (y - 700) * .05, sw = Math.sin(t * 2 + i) * (2 + wind * 10);
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + sw + wind * 8, y - h); g.lineWidth = 2; g.strokeStyle = hash(i, 9) < .6 ? 'rgba(130,115,90,.5)' : 'rgba(230,220,195,.5)'; g.stroke(); } });
}
function dust(c, t, k = 1, col = '200,190,170') {   // dust blowing across the screen (k: how hard the wind blows)
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
  for (let i = 0; i < 40; i++) { const x = ((hash(i, 21) * 2400 + t * (300 + hash(i, 22) * 400) * k) % 2400) - 240, y = 300 + hash(i, 23) * 700 + Math.sin(t * 2 + i) * 30;
    ell(c, x, y, 40 + hash(i, 24) * 120, 6 + hash(i, 25) * 8); c.fillStyle = `rgba(${col},${Math.min(.12, .06 * k)})`; c.fill(); }
  c.restore();
}
function grassFront(c, cam, t, col, p = 1.6, blur = 6, seed = 1, wind = 0) {
  blurLayer(c, cam, p, blur, g => { g.fillStyle = col; g.beginPath();
    for (let i = 0; i < 18; i++) { const x = i * 180 - 400 + hash(i, seed) * 120; for (let k = 0; k < 6; k++) { const bx = x + k * 14, h = 120 + hash(i, k + seed) * 160, l = (k - 3) * 14 + Math.sin(t * 2 + i + k) * (6 + wind * 30);
      g.moveTo(bx - 7, 1250); g.quadraticCurveTo(bx + l * .5, 1180 - h * .5, bx + l, 1150 - h); g.quadraticCurveTo(bx + l * .4 + 6, 1180 - h * .5, bx + 7, 1250); } }
    g.fill(); });
}

// ---------- the film ----------
// 00 title: the golden road to a far green city
shot(0, 5.4, 'golden', push(960, 560, 1, 1.12, 5.4), (c, t, u, cam) => {
  layer(c, cam, 0, g => { g.fillStyle = lin(g, 0, -300, 0, 700, [[0, '#3a3a7c'], [.5, '#d8737c'], [.85, '#ffb574'], [1, '#ffe0a8']]); g.fillRect(-2000, -1500, W + 4000, 2600); sun(g, 1180, 600, 600, '255,226,160'); });
  layer(c, cam, .1, g => { hillsW(g, 0, 650, 30, '#b39acb', .004); emeraldCity(g, 1180, 660, .8, t, 1.3); });
  layer(c, cam, .4, g => { hillsW(g, 300, 720, 26, '#c98f86', .005); });
  layer(c, cam, 1, g => { g.fillStyle = '#a99050'; g.fillRect(-2000, 760, W + 4000, 1000);
    g.beginPath(); g.moveTo(-200, 1100); g.quadraticCurveTo(700, 900, 1180, 680); g.lineTo(1200, 680); g.quadraticCurveTo(1000, 900, 1100, 1100); g.closePath(); g.fillStyle = lin(g, 0, 1100, 0, 680, [[0, '#efb646'], [1, '#ffe08a']]); g.fill(); });
  [[lion, -150, .2], [tinWoodman, -60, .2], [scarecrow, 20, .2], [dorothy, 90, .2], [toto, 150, .3]].forEach(([f, o, s], i) => { const d = u * 40, x = 820 + o + d * 1.4, y = 820 - d * .6 + o * .05;
    put(c, f, x, y, s, { ph: (f === toto ? d * 1.5 / (12 * s) : stepPh(f, d * 1.5, s)) + i, walk: 1, blink: false, shoes: 'silver' }, t, false); });
  grassFront(c, cam, t, 'rgba(60,30,50,.9)', 1.6, 8, 3);
  const k = ease((u - .6) / 1);
  c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = k; c.textAlign = 'center'; c.font = '600 120px Fredoka'; c.lineWidth = 16; c.lineJoin = 'round'; c.strokeStyle = 'rgba(70,30,30,.55)';
  c.strokeText("The Wizard's Secret", 960, 330 - (1 - k) * 30); c.fillStyle = '#fff4dc'; c.fillText("The Wizard's Secret", 960, 330 - (1 - k) * 30);
  c.font = '600 46px Fredoka'; c.fillStyle = '#ffe8c0'; c.fillText('The Wonderful Wizard of Oz', 960, 410); c.restore();
});
// 01 Kansas: everything gray, except Dorothy
shot(5.4, 13.0, 'kansas', u => ({ x: lerp(700, 1150, ease(u / 7.6)), y: 560, z: 1 }), (c, t, u, cam) => {
  prairie(c, cam, t); layer(c, cam, .7, g => { farmhouse(g, 420, 740, .55, 1, 0); windmill(g, 1600, 740, .55, t); });
  desat(c, .25); dust(c, t, .5);
  put(c, dor, 1090, 760, .42, { walk: 0, mood: 'calm', blink: blink(t), armB: .3 }, t);
  put(c, tot, 1180, 768, .5, { walk: 0, blink: blink(t, 2) }, t);
  grassFront(c, cam, t, 'rgba(110,100,85,.85)', 1.5, 7, 2);
});
shot(13.0, 17.6, 'kansas', push(560, 520, 1.5, 1.6, 4.6, 640), (c, t, u, cam) => {
  prairie(c, cam, t); layer(c, cam, 1, g => { farmhouse(g, 500, 780, 1.05, 1, 0); fence(g, 860, '#8d8576'); });
  put(c, auntEm, 760, 800, .62, { walk: 0, blink: blink(t, 4), arms: .2 }, t);
  desat(c, .2); dust(c, t, .6);
});
shot(17.6, 22.0, 'kansas', push(980, 600, 1.35, 1.5, 4.4), (c, t, u, cam) => {
  prairie(c, cam, t); layer(c, cam, .9, g => { farmhouse(g, 300, 800, 1.2, 1, 0); }); desat(c, .2);
  const jump = ease((u - .6) / .7), held = u > 1.3;
  put(c, dor, 960, 880, .95, { walk: 0, mood: held ? 'happy' : 'calm', blink: blink(t), hold: held, sway: 0 }, t);
  if (!held) put(c, tot, lerp(1300, 1020, jump), 900 - Math.sin(jump * Math.PI) * 160, 1.1, { walk: 1 - jump, ph: u * 12, blink: false }, t, true);
  grassFront(c, cam, t, 'rgba(110,100,85,.85)', 1.5, 7, 4);
});
shot(22.0, 24.6, 'kansas', push(980, 560, 2.2, 2.35, 2.6), (c, t, u, cam) => {
  prairie(c, cam, t); desat(c, .2);
  put(c, dor, 960, 880, .95, { walk: 0, mood: 'happy', blink: false, hold: true, talk: voice('dorothy', t), tilt: .06 + Math.sin(t * 7) * .03 }, t);
});
// 02 the cyclone
const stormSky = (c, cam, t, k) => layer(c, cam, 0, g => {
  g.fillStyle = lin(g, 0, -400, 0, 700, [[0, mixCol('#8a96a2', '#1e2a36', k)], [1, mixCol('#d8d0c0', '#4a5a5e', k)]]); g.fillRect(-2000, -1500, W + 4000, 2600);
  for (let i = 0; i < 14; i++) { const x = ((hash(i, 3) * 3000 + t * (40 + k * 160)) % 3400) - 700, y = -60 + hash(i, 4) * 420; ell(g, x, y, 300 + hash(i, 5) * 300, 60 + hash(i, 6) * 40); g.fillStyle = `rgba(${k > .5 ? '40,52,62' : '150,150,150'},${.25 + k * .4})`; g.fill(); } });
function funnel(c, x, y, s, t, a = 1) {
  c.save(); c.translate(x, y); c.scale(s, s); c.globalAlpha = a;
  for (let i = 0; i < 30; i++) { const yy = -760 + i * 28, w = 360 - i * 11 + Math.sin(t * 3 + i) * 14, xx = Math.sin(t * 2 + i * .4) * 40 * (i / 30);
    c.beginPath(); c.ellipse(xx, yy, w, 24, 0, Math.PI * ((t * 3 + i * .3) % 2), Math.PI * ((t * 3 + i * .3) % 2) + 1.6 * Math.PI); c.lineWidth = 14; c.strokeStyle = `rgba(${120 + i * 3},${130 + i * 3},${135 + i * 3},.6)`; c.stroke(); }
  c.restore();
}
const lightning = (c, t, k) => { const f = (t * .43 + .3) % 1; if (f > .04) return; dark(c, .5 * k * (1 - f / .04), '220,235,255'); };   // a flash every couple of seconds
shot(24.6, 28.9, 'storm', u => ({ x: 960, y: lerp(700, 560, ease(u / 4.3)), z: lerp(1.6, 1.2, ease(u / 4.3)) }), (c, t, u, cam) => {
  const k = ease(u / 3); stormSky(c, cam, t, k); prairie(c, cam, t, k, false); dark(c, .4 * k, '20,34,44'); layer(c, cam, .4, g => funnel(g, 1500, 700, .6, t, k * .8)); desat(c, .3); dust(c, t, 1 + k * 2, '120,124,120');
  put(c, dor, 900, 900, .9, { walk: 0, mood: u > 1.5 ? 'worried' : 'calm', blink: false, tilt: .2 * k, hold: false }, t);
  put(c, tot, 1080, 905, 1.1, { walk: 0, blink: false, talk: Math.abs(Math.sin(t * 10)) * k }, t);
  grassFront(c, cam, t, 'rgba(60,64,64,.85)', 1.5, 7, 5, k); lightning(c, t, k);
});
shot(28.9, 31.2, 'storm', push(560, 640, 1.8, 1.95, 2.3), (c, t, u, cam) => {
  stormSky(c, cam, t, 1); prairie(c, cam, t, 1, false); dark(c, .4, '20,34,44'); layer(c, cam, .4, g => funnel(g, 1100, 700, .7, t)); desat(c, .3);
  put(c, uncleHenry, 520, 880, .8, { walk: 0, blink: false, arms: 1.1, wave: 1, mood: 'wow' }, t, true);   // turned so his waving arm points at the cyclone dust(c, t, 3, '90,100,104'); lightning(c, t, 1);
});
shot(31.2, 36.1, 'storm', u => ({ x: 500 + u * 330, y: 560, z: 1.15 }), (c, t, u, cam) => {
  stormSky(c, cam, t, 1); prairie(c, cam, t, 1, false); dark(c, .4, '20,34,44'); layer(c, cam, .35, g => funnel(g, 600 + u * 80, 720, .75, t)); desat(c, .3); dust(c, t, 3, '90,100,104');
  const d = u * 330, tx = 980 + u * 380;
  put(c, tot, tx, 905, 1.0, { walk: 1, ph: (tx - 980) / (STR_T * 1.0) + u * 4, blink: false }, t);
  put(c, dor, 500 + d, 880, .9, { walk: 1, ph: d / (STR_D * .9), mood: 'worried', blink: false, armB: 1.6, bendB: .1, lean: .1 }, t);
  grassFront(c, cam, t, 'rgba(60,64,64,.85)', 1.8, 8, 6, 1); lightning(c, t, 1);
});
shot(36.1, 40.0, 'storm', u => ({ x: 960, y: lerp(560, 260, ease(u / 3.9)), z: 1 }), (c, t, u, cam) => {
  stormSky(c, cam, t, 1); prairie(c, cam, t, 1, false); dark(c, .4, '20,34,44'); layer(c, cam, .6, g => funnel(g, 1000, 760, 1.1, t)); desat(c, .3);
  const lift = ease((u - .4) / 3.5), y = lerp(760, 140, lift);
  layer(c, cam, .6, g => { g.save(); g.translate(1000, y); g.rotate(Math.sin(t * 2.5) * .3 * lift + lift * 1.2); farmhouse(g, 0, 0, .55, 1, 0); g.restore();
    for (let i = 0; i < 16; i++) { const q = t * 3 + i * 1.7, r = 260 + (i % 4) * 70; g.save(); g.translate(1000 + Math.cos(q) * r, 500 + Math.sin(q) * 120 - i * 10); g.rotate(q * 2); g.fillStyle = i % 2 ? '#7a6a5a' : '#a99878'; g.fillRect(-12, -4, 24, 8); g.restore(); } });
  dust(c, t, 3, '90,100,104'); lightning(c, t, 1);
});
shot(40.0, 43.5, 'gloom', push(1250, 560, 1.55, 1.7, 3.5), (c, t, u, cam) => {   // inside the spinning house, at the window
  layer(c, cam, 0, g => { g.fillStyle = '#3a3030'; g.fillRect(-1000, -800, W + 2000, H + 1600); for (let x = -1000; x < W + 1000; x += 90) { g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(x, -800, 3, 2000); } });
  layer(c, cam, .9, g => { g.save(); g.beginPath(); g.rect(1240, 160, 420, 360); g.clip(); g.fillStyle = '#2e3e48'; g.fillRect(1240, 160, 420, 360);
    for (let i = 0; i < 10; i++) { const q = (t * 2 + i * .3) % 1; g.save(); g.translate(1240 + q * 500, 200 + hash(i, 1) * 300); g.rotate(q * 9); g.fillStyle = '#6a5a4a'; g.fillRect(-14, -5, 28, 10); g.restore(); }
    lightning(g, t, 1); g.restore(); g.lineWidth = 18; g.strokeStyle = '#5a4434'; g.strokeRect(1240, 160, 420, 360); g.beginPath(); g.moveTo(1450, 160); g.lineTo(1450, 520); g.moveTo(1240, 340); g.lineTo(1660, 340); g.stroke(); });
  c.save(); c.translate(960, 600); c.rotate(Math.sin(t * 3) * .04); c.translate(-960, -600);
  put(c, dor, 1180, 900, .9, { walk: 0, mood: 'worried', blink: false, hold: true, talk: voice('dorothy', t), tilt: .15, lean: .05 }, t); c.restore();
});
// 03 Oz
shot(43.5, 46.4, 'gloom', u => ({ x: 960 + Math.sin(u * 30) * 20 * clamp(1 - u), y: 540, z: 1.2 }), (c, t, u, cam) => {   // bump! the house lands
  layer(c, cam, 0, g => { g.fillStyle = '#2a2224'; g.fillRect(-1000, -800, W + 2000, H + 1600); for (let x = -1000; x < W + 1000; x += 90) { g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(x, -800, 3, 2000); } });
  layer(c, cam, 1, g => { for (let i = 0; i < 30; i++) { const q = clamp(u * 1.2 - hash(i, 2) * .5); ell(g, 200 + hash(i, 3) * 1500, -100 + q * 1100, 3, 3); g.fillStyle = `rgba(200,190,170,${.7 * (1 - q)})`; g.fill(); } });
  put(c, dor, 900, 900, .85, { walk: 0, mood: u < 1 ? 'wow' : 'worried', blink: u > 2, hold: true, tilt: -.05 }, t);
});
shot(46.4, 50.0, 'gloom', push(960, 540, 1.1, 1.25, 3.6), (c, t, u, cam) => {   // the door opens into colour
  const open = ease((u - .5) / 1.2);
  layer(c, cam, 0, g => { g.fillStyle = '#2a2224'; g.fillRect(-1000, -800, W + 2000, H + 1600);
    g.save(); g.beginPath(); g.rect(1180, 220, 360 * open, 640); g.clip(); g.fillStyle = lin(g, 0, 220, 0, 860, [[0, '#7fd0ff'], [.6, '#fff2b0'], [1, '#7ccf5a']]); g.fillRect(1180, 220, 360, 640);
    for (let i = 0; i < 18; i++) { ell(g, 1190 + hash(i, 4) * 340, 760 + hash(i, 5) * 90, 9); g.fillStyle = ['#ff6b8a', '#ffd23f', '#8fc9ff', '#ffffff'][i % 4]; g.fill(); } g.restore();
    g.save(); g.globalCompositeOperation = 'lighter'; g.beginPath(); g.moveTo(1180, 220); g.lineTo(1180 + 360 * open, 220); g.lineTo(1600 * open + 300, 1100); g.lineTo(600, 1100); g.closePath(); g.fillStyle = `rgba(255,240,190,${.35 * open})`; g.fill(); g.restore();
    g.fillStyle = '#4a3a2e'; g.save(); g.translate(1180 + 360 * open, 220); g.scale(1 - open * .9, 1); g.fillRect(0, 0, 360, 640); g.restore(); });
  put(c, dor, 900, 920, .9, { walk: 0, mood: open > .5 ? 'wow' : 'calm', blink: false, hold: true, tilt: .05 }, t, false, { warm: [1300, 500, 900, '255,240,190', .45 * open] });
});
function ozLand(c, cam, t, glow = 0) {   // the Munchkins' bright country
  layer(c, cam, 0, g => { sky(g, '#5cb6f2', '#bfe6ff', '#fff3d0'); sun(g, 300, 80, 560); clouds(g, t, CLOUDS); });
  layer(c, cam, .15, g => { hillsW(g, 0, 600, 34, '#9ed0a4', .004); });
  layer(c, cam, .35, g => { hillsW(g, 200, 650, 40, '#7cc46c', .0032); tree(g, 1500, 680, .7, t, '#5aa84a', true); tree(g, 260, 690, .6, t, '#4f9e3f'); });
  layer(c, cam, .7, g => { hillsW(g, 500, 740, 30, '#62b050', .0026); g.beginPath(); g.moveTo(W + 400, 740); g.bezierCurveTo(1500, 800, 1600, 960, 1200, 1300); g.lineTo(1450, 1300); g.bezierCurveTo(1800, 960, 1650, 820, W + 400, 790); g.closePath(); g.fillStyle = lin(g, 1200, 0, W, 0, [[0, '#7cc8f0'], [1, '#c8ecff']]); g.fill(); twinkles(g, t * 1.5, scatter(7, 10, 1300, 1900, 760, 1100), '#ffffff'); });
  layer(c, cam, 1, g => { g.fillStyle = lin(g, 0, 840, 0, 1300, [[0, '#6cbe56'], [1, '#4a9a40']]); g.fillRect(-2000, 840, W + 4000, 1200); for (const f of FLOWERS) flower(g, f.x * 1.3 - 300, f.y + 20, f.s, Math.sin(t * 2 + f.p), f.col); });
}
shot(50.0, 55.7, 'oz', u => ({ x: lerp(760, 1160, ease(u / 5.7)), y: lerp(700, 520, ease(u / 5.7)), z: lerp(1.25, 1, ease(u / 5.7)) }), (c, t, u, cam) => {
  ozLand(c, cam, t); layer(c, cam, .85, g => farmhouse(g, 380, 850, .9, 1, 1));
  put(c, dor, 700, 900, .85, { walk: 0, mood: 'wow', blink: blink(t), hold: true, tilt: .1 }, t);
  for (let i = 0; i < 6; i++) { const pop = ease((u - 1 - i * .35) / .7); if (pop <= 0) continue; put(c, munchkin, 1050 + i * 120 + (1 - pop) * 700, 920, .9, { hop: 10, blink: blink(t, i) }, t + i, true); }
  grassFront(c, cam, t, 'rgba(40,110,40,.85)', 1.7, 8, 7); butterfly(c, t, 300, 420, '#ff9ed1', 1);
});
shot(55.7, 58.8, 'oz', push(940, 640, 2.1, 2.3, 3.1), (c, t, u, cam) => {
  ozLand(c, cam, t);
  put(c, dor, 900, 900, .9, { walk: 0, mood: 'wow', blink: false, hold: true, talk: voice('dorothy', t), tilt: .14, big: 1 }, t);
  for (let i = 0; i < 8; i++) sparkle(c, 800 + hash(i, 1) * 400, 300 + hash(i, 2) * 300, 12 * Math.abs(Math.sin(t * 3 + i)), t);
});
