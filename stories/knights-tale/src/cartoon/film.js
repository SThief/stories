// The Boy Who Changed His Stars, remade as a film (October 2026): the same narration and music (soundtrack.m4a), told
// again with new shots. Each shot is [start, end, light, camera, draw]: camera is { x, y, z } (the point of the stage at
// the centre of the frame, and the zoom) or a function of u (seconds into the shot); draw(c, t, u, cam) draws it.
// Places are built from layers at depths p (0 = the sky, 1 = where the characters stand, > 1 = close to the lens), so
// near things slide faster than far ones when the camera moves. Light follows the feeling: a golden sunset roof, a
// starry night with torch-lit knights, a firelit camp, a glowing forge, a snowy London night, a golden knighting.
const C = cast;
const voice = (t, a, b) => t > a && t < b ? clamp((ENV[Math.floor(t * 30)] || 0) * 1.3) : 0;
const blink = (t, k = 0) => ((t + k * .7) % 3.4) < .13;
const walkTo = (u, a, x0, x1, speed = 250) => { const T = Math.abs(x1 - x0) / speed, k = clamp((u - a) / T); return { x: lerp(x0, x1, k), d: Math.abs(x1 - x0) * k, walk: u > a && k < 1 ? 1 : 0 }; };
const at = (x, y, z = 1) => ({ x, y, z });
const push = (x, y, z0, z1, d, x1 = x, y1 = y) => u => ({ x: lerp(x, x1, ease(u / d)), y: lerp(y, y1, ease(u / d)), z: lerp(z0, z1, ease(u / d)) });
const hop = (t, k = 0) => -Math.abs(Math.sin(t * 6 + k)) * 26;   // cheering: a happy little hop
const wave = (t, k = 0) => ({ armB: -2.3 + Math.sin(t * 8 + k) * .25, bendB: .2 });   // a hand waving up beside the head
const pop = (u, a, b) => u < b ? (u - a) / .4 : 1 - (u - b) / .3;   // a label pops in at a and out at b
function view(cam, p) { const zp = 1 + (cam.z - 1) * p;
  return new DOMMatrix().translate(960, 540).scale(zp).translate(-(960 + (cam.x - 960) * p), -(540 + (cam.y - 540) * p)); }
function layer(c, cam, p, fn) { c.save(); c.setTransform(view(cam, p)); fn(c); c.restore(); }
function blurLayer(c, cam, p, px, fn) { c.save(); c.setTransform(view(cam, p)); c.filter = `blur(${px}px)`; fn(c); c.restore(); }
const flash = (c, a, col = '255,255,255') => { if (a <= 0) return; c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = `rgba(${col},${a})`; c.fillRect(0, 0, W, H); c.restore(); };

// horses and riders
const whiteHorse = (c, p, t) => horse(c, { coat: '#f4f4f8', mane: '#ece4d4', cloth: '#3a76c8', trim: '#f2c23a', ...p }, t);
const brownHorse = (c, p, t) => horse(c, { coat: '#9a5a32', mane: '#4a2a18', cloth: p.cloth ?? '#c8382e', trim: '#f2c23a', ...p }, t);
const blackHorse = (c, p, t) => horse(c, { coat: '#2a2630', mane: '#16141a', cloth: '#5a2050', trim: '#c9a0e0', ...p }, t);
LOOKS.redKnight = { tunic: '#c8382e', trouser: '#8a2a24', boot: '#3a2414', hair: 'bob', hat: 'greathelm', helm: ['#8a2a24', '#e85a4a', '#a8302a'], plume: '#f2c23a', armCol: '#c8382e', handCol: '#c9d2de' };
LOOKS.adhemarRide = { ...LOOKS.adhemar, cape: null, hat: 'greathelm', helm: ['#16141c', '#4a4658', '#22202a'], plume: '#7a2a8a' };
LOOKS.willRide = { ...LOOKS.will, cape: null };
for (const n of ['redKnight', 'adhemarRide', 'willRide']) C[n] = ({ [n]: (c, p, t) => person(c, p, t, LOOKS[n]) })[n];
const HORSE = { wide: 1.7, tall: 1000, foot: 190 };
const ride = (fn, p) => ({ still: true, rider: [fn, p], mood: p.mood });
const gallop = (fn, rider, x, y, s, d, t, flip = false, mood = 'sure', more = {}) =>
  put(cnow, fn, x, y, s, { ...ride(rider, { armB: 1.3, bendB: .35, hold: lance(-.05), mood, bounce: 1, ...more }), run: 1, ph: d / (HSTRIDE * s) }, t, flip, HORSE);
let cnow = null;

// ---------- places, in layers ----------
function grassFront(c, cam, t, col, p = 1.6, blur = 7, seed = 1) {
  blurLayer(c, cam, p, blur, g => { g.fillStyle = col; g.beginPath();
    for (let i = 0; i < 20; i++) { const x = i * 180 - 500 + hash(i, seed) * 120; for (let k = 0; k < 6; k++) { const bx = x + k * 14, h = 120 + hash(i, k + seed) * 160, l = (k - 3) * 14 + Math.sin(t * 2 + i + k) * 6;
      g.moveTo(bx - 7, 1250); g.quadraticCurveTo(bx + l * .5, 1180 - h * .5, bx + l, 1150 - h); g.quadraticCurveTo(bx + l * .4 + 6, 1180 - h * .5, bx + 7, 1250); } }
    g.fill(); });
}
function townRoof(c, cam, t, mood, kStars = 0) {   // the rooftops of William's town: 'sunset' or 'night'; kStars draws the knight in the stars
  const night = mood === 'night';
  layer(c, cam, 0, g => { if (night) sky(g, ['#060a24', '#141c50', '#2a2a6a', '#3a3270']); });
  if (night) layer(c, cam, .3, g => { stars(g, t); g.save(); g.translate(0, -700); stars(g, t + 3); g.restore(); moon(g, 1500, 200, 54); constellation(g, 760, 230, 1.6, kStars, t); });
  layer(c, cam, 0, g => { if (night) {}
    else { sky(g, ['#7a5a9a', '#f08a6a', '#f6b48a', '#ffdcb0']); sunDisc(g, 1520, 520, 60, '255,210,150'); rays(g, 1520, 520, t, '255,220,170', .08); clouds(g, t, '255,226,210', .8, 5); } });
  layer(c, cam, .12, g => { castle(g, 360, 700, 1.1, night ? '#1a1a46' : '#e9cfc4', night ? .7 : 0); hillsBand(g, 712, 18, .004, night ? '#1a1e4e' : '#d8a49a', 0, night ? .3 : .3, night ? '60,70,140' : '255,200,180'); });
  layer(c, cam, .35, g => { houses(g, t, 760, .8, 7, night ? TOWN_NIGHT : TOWN_SUNSET, .5, night, -900, W + 900); if (!night) { g.fillStyle = 'rgba(255,190,160,.25)'; g.fillRect(-900, 400, W + 1800, 400); } });
  layer(c, cam, .65, g => houses(g, t, 820, 1, 3, night ? TOWN_NIGHT : TOWN_SUNSET, .5, night, -900, W + 900));
  layer(c, cam, 1, g => roof(g, 880, night ? '#6a3434' : '#c0503a'));
}
function countryside(c, cam, t, o = {}) {   // morning fields with a far castle
  layer(c, cam, 0, g => { sky(g, o.sky || ['#58aef0', '#bfe4ff', '#fff4dc']); sunDisc(g, o.sx ?? 1500, o.sy ?? 130, 50); rays(g, o.sx ?? 1500, o.sy ?? 130, t); clouds(g, t); });
  layer(c, cam, .1, g => { castle(g, 1300, 660, .7, '#c8d4ea'); hillsBand(g, 670, 26, .004, '#b8d4c8', 0, .35); });
  layer(c, cam, .3, g => { hillsBand(g, 740, 30, .003, '#9ccc8a', 300, .2); for (let i = 0; i < 8; i++) bush(g, -500 + i * 420, 760, .5, '#7cb86a'); });
  layer(c, cam, .6, g => hillsBand(g, 820, 24, .0026, '#7cc060', 900, .08));
  layer(c, cam, 1, g => { g.fillStyle = lin(g, 0, 860, 0, 1300, [[0, '#d9c08a'], [1, '#c4a46a']]); g.fillRect(-3000, 860, W + 6000, 120);
    g.fillStyle = lin(g, 0, 980, 0, 1300, [[0, '#6cb85a'], [1, '#4a9a40']]); g.fillRect(-3000, 980, W + 6000, 600); g.fillStyle = '#6cb85a'; g.fillRect(-3000, 840, W + 6000, 22);
    for (let i = 0; i < 90; i++) { ell(g, hash(i, 31) * 5000 - 1500, 1000 + hash(i, 32) * 120, 5 + hash(i, 33) * 4); g.fillStyle = ['#ff8fb8', '#ffd23f', '#ffffff', '#c58fff'][i % 4]; g.fill(); } });
}
function tourney(c, cam, t, cheer = 1) {   // the tournament: sky, banners, stands of people, the fence and the sand
  layer(c, cam, 0, g => { sky(g, ['#4aa6ea', '#bfe4ff']); sunDisc(g, 300, 120, 50); rays(g, 300, 120, t, '255,248,220', .06); clouds(g, t); });
  layer(c, cam, .2, g => { for (let i = 0; i < 10; i++) tent(g, -600 + i * 380, 470, .7, '#fff', ['#e2443a', '#3a86d8', '#f2c23a', '#4aa04a'][i % 4]); });
  layer(c, cam, .45, g => { stands(g, t, 380, 5, cheer, -1400, W + 1400, 1); bunting(g, 330, t, -1400, W + 1400); });
  layer(c, cam, 1, g => { g.fillStyle = lin(g, 0, 640, 0, 1300, [[0, '#ecc88a'], [1, '#d9a866']]); g.fillRect(-3000, 640, W + 6000, 1000);
    for (let i = 0; i < 70; i++) { ell(g, hash(i, 41) * 6000 - 2000, 680 + hash(i, 42) * 500, 18, 4); g.fillStyle = 'rgba(160,110,60,.25)'; g.fill(); } fenceLists(g, 720, 0); });
}
function campNight(c, cam, t) {
  layer(c, cam, 0, g => { sky(g, ['#060a24', '#141c50', '#2a2a6a']); stars(g, t); moon(g, 300, 160, 40); });
  layer(c, cam, .25, g => pines(g, 840, '#1e2458', 81, 1, .2));
  layer(c, cam, .55, g => pines(g, 880, '#161a40', 83, 1.2));
  layer(c, cam, 1, g => { ground(g, 900, '#262a48', '#141630'); campfire(g, 960, 930, 1, t); });
}
function roadSunset(c, cam, t) {
  layer(c, cam, 0, g => { sky(g, ['#6a4a8a', '#f6a07a', '#ffd4a8', '#ffe8c8']); sunDisc(g, 1450, 470, 56, '255,210,150'); rays(g, 1450, 470, t, '255,220,170', .08); });
  layer(c, cam, .15, g => hillsBand(g, 700, 30, .004, '#c8a0b8', 0, .3, '255,200,180'));
  layer(c, cam, .4, g => { hillsBand(g, 780, 24, .003, '#b8a868', 400, .15, '255,200,180'); for (let i = 0; i < 5; i++) tent(g, -400 + i * 700, 790, .6, '#fff', ['#8a4ab8', '#2ab8b0'][i % 2]); });
  layer(c, cam, 1, g => { g.fillStyle = lin(g, 0, 860, 0, 1300, [[0, '#d8b070'], [1, '#b88a4a']]); g.fillRect(-3000, 860, W + 6000, 800); });
}
function duskStorm(c, cam, t) {
  layer(c, cam, 0, g => { sky(g, ['#1a1438', '#3a2a6a', '#7a5a9a']); for (let i = 0; i < 10; i++) { const x = ((hash(i, 3) * 3000 + t * 30) % 3400) - 700; ell(g, x, 80 + hash(i, 4) * 300, 340, 70); g.fillStyle = 'rgba(20,14,40,.5)'; g.fill(); } });
  layer(c, cam, .3, g => { castle(g, 1500, 820, 1.1, '#141030', .2); flags(g, 900, t, '#1e1a30', -600); });
  layer(c, cam, 1, g => ground(g, 900, '#3a4a40', '#1e2a24'));
}
function square(c, cam, t, cheer = .2) {
  layer(c, cam, 0, g => { sky(g, ['#58aef0', '#bfe4ff']); clouds(g, t); });
  layer(c, cam, .3, g => houses(g, t, 760, 1.15, 11, TOWN_DAY, 0, false, -1200, W + 1200));
  layer(c, cam, 1, g => { ground(g, 760, '#e8d4a8', '#d4b880'); });
  layer(c, cam, .9, g => crowdRow(g, t, 830, 1, 21, cheer, -900, W + 900));
}
function glory(c, cam, t, k = 1) {
  layer(c, cam, 0, g => { sky(g, ['#ffd890', '#fff4d8']); rays(g, 1100, 260, t, '255,220,140', .12 + k * .06, 22); });
  layer(c, cam, .4, g => { castle(g, 1100, 700, 1, '#f4e2c0'); crowdRow(g, t, 760, .8, 31, .5 * k, -900, W + 900); });
  layer(c, cam, 1, g => ground(g, 780, '#8ccb6e', '#5ea84c'));
}
function party(c, cam, t, u, kStars = 0, star = 0) {   // the celebration under the stars, with fireworks; then the knight in the stars and one big star
  layer(c, cam, 0, g => sky(g, ['#060a24', '#1a1e5a', '#3a2a6a']));
  layer(c, cam, .3, g => { stars(g, t); g.save(); g.translate(0, -700); stars(g, t + 3); g.restore(); constellation(g, 760, 150, 1.6, kStars, t); if (star) bigStar(g, 960, 30, 240 * star, t * .2); });
  layer(c, cam, 0, g => { moon(g, 260, 140, 36);
    g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 4; i++) { const q = ((t * .45 + i * .29) % 1), x = 680 + i * 380, y = 150 + (i % 2) * 90;
      for (let k = 0; k < 16; k++) { const a = k / 16 * TAU; glow(g, x + Math.cos(a) * 160 * q, y + Math.sin(a) * 160 * q, 14, ['255,120,150', '120,200,255', '255,220,120', '170,255,150'][i], (1 - q) * .9); } } g.restore(); });
  layer(c, cam, .3, g => castle(g, 960, 790, .9, '#2a2a68', .8));
  layer(c, cam, 1, g => { ground(g, 860, '#1e2448', '#121630'); g.save(); g.globalCompositeOperation = 'lighter'; for (const x of [300, 1620]) { glow(g, x, 700, 360, '255,170,90', .3); } g.restore();
    for (const x of [300, 1620]) { rr(g, x - 6, 700, 12, 160, 4); fs(g, '#5a3a22', 3); campfire(g, x, 712, .3, t); } });
}

// ---------- the film ----------
const SHOTS = [
  // the title: from the stars down to a little roof where a boy sits with his father
  [0, 5.5, 'night', u => ({ x: 960, y: lerp(-200, 560, ease((u - .4) / 4)), z: 1.05 }), (c, t, u, cam) => { townRoof(c, cam, t, 'night', 1);
    put(c, C.father, 860, 920, .7, { sit: 1, blink: blink(t), mood: 'calm', tilt: .15 }, t);
    put(c, C.willKid, 1040, 920, .7, { sit: 1, blink: blink(t, 1), mood: 'wow', tilt: .25 }, t, true);
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); popText(c, 'The Boy Who', 960, 380, 90, (u - 1.6) / .6); popText(c, 'Changed His Stars', 960, 500, 120, (u - 2.1) / .6); c.restore(); }],
  // the golden roof at sunset
  [5.5, 10.4, 'sunset', u => ({ x: lerp(760, 1040, ease(u / 4.9)), y: 600, z: lerp(1, 1.08, ease(u / 4.9)) }), (c, t, u, cam) => { townRoof(c, cam, t, 'sunset');
    put(c, C.father, 880, 940, .9, { sit: 1, blink: blink(t), mood: 'calm', armB: .9, bendB: .8 }, t);
    put(c, C.willKid, 1110, 940, .9, { sit: 1, blink: blink(t, 1), mood: 'happy' }, t, true); }],
  [10.4, 13.1, 'sunset', push(900, 650, 1.8, 1.95, 2.7), (c, t, u, cam) => { townRoof(c, cam, t, 'sunset');
    const hit = Math.max(0, Math.sin(t * 8));
    put(c, C.father, 880, 940, .9, { sit: 1, blink: blink(t), mood: 'sure', armB: 1.1 + hit * .5, bendB: .3 - hit * .6, hold: hammer }, t);
    put(c, C.willKid, 1110, 940, .9, { sit: 1, blink: blink(t, 1), mood: 'wow', tilt: .1 }, t, true);
    if (Math.sin(t * 8) < -.8) sparks(c, 1040, 900, t, 10, .6); }],
  [13.1, 17.6, 'sunset', push(990, 660, 1.6, 1.75, 4.5), (c, t, u, cam) => { townRoof(c, cam, t, 'sunset');
    put(c, C.father, 900, 940, .9, { sit: 1, blink: blink(t), mood: 'proud', armB: lerp(.6, 1.45, ease(u / .6)), bendB: .5, lean: .06 }, t);
    put(c, C.willKid, 1060, 940, .9, { sit: 1, blink: blink(t, 1), mood: u > .4 ? 'happy' : 'calm', lean: -.06 }, t, true);
    hearts(c, 990, 640, t, clamp((u - .6) / .4), 1.3); flash(c, clamp((u - 3.6) / .9), '8,10,36'); }],
  // night: knights ride by below with torches
  [17.6, 22.2, 'night', at(960, 600, 1), (c, t, u, cam) => { townRoof(c, cam, t, 'night');
    layer(c, cam, .55, g => { g.fillStyle = '#2e2a44'; g.fillRect(-1200, 860, W + 2400, 40);
      [[C.willArmor, whiteHorse, 0], [C.redKnight, brownHorse, 1.1]].forEach(([r, h, o]) => { const x = -500 + Math.max(0, u - .6 - o) * 480;
        g.save(); g.globalCompositeOperation = 'lighter'; glow(g, x + 120, 600, 260, '255,170,90', .45); g.restore();
        put(g, h, x, 880, .4, { ...ride(r, { armB: 1.5, bendB: .2, hold: (cc, hx, hy) => { cc.save(); cc.translate(hx, hy); rr(cc, -5, -120, 10, 130, 4); fs(cc, '#6a4428', 3); for (let k = 0; k < 3; k++) { const f = Math.sin(t * 11 + k) * 6; cc.beginPath(); cc.moveTo(-14, -120); cc.quadraticCurveTo(-10, -170, f, -200 + k * 10); cc.quadraticCurveTo(10, -170, 14, -120); cc.fillStyle = ['#e2443a', '#f2932a', '#ffd84a'][k]; cc.fill(); } cc.restore(); } }), run: 1, ph: x / (HSTRIDE * .4) }, t, false, { ...HORSE, noShadow: true }); }); });
    layer(c, cam, 1, g => roof(g, 880, '#6a3434'));
    const torch = clamp(1 - Math.abs(u - 2.6) / 2.2);
    put(c, C.father, 760, 960, .9, { sit: 1, blink: blink(t), mood: 'calm', tilt: -.05 }, t, false, { warm: [960, 600, 1200, '255,170,90', .3 * torch] });
    put(c, C.willKid, 1020, 960, .9, { sit: 1, blink: blink(t, 1), mood: u > 1 ? 'wow' : 'calm', tilt: -.08 }, t, false, { warm: [960, 600, 1200, '255,170,90', .4 * torch] }); }],
  [22.2, 25.5, 'night', push(1020, 760, 2.1, 2.25, 3.3), (c, t, u, cam) => { townRoof(c, cam, t, 'night');
    put(c, C.father, 760, 960, .9, { sit: 1, blink: blink(t), mood: 'calm' }, t);
    put(c, C.willKid, 1020, 960, .9, { sit: 1, blink: blink(t, 1), mood: 'wow', tilt: .12, talk: voice(t, 22.4, 25.2) }, t, true, { warm: [1300, 600, 900, '255,170,90', .25] }); }],
  [25.5, 27.6, 'night', push(780, 760, 2.1, 2.25, 2.1), (c, t, u, cam) => { townRoof(c, cam, t, 'night');
    put(c, C.father, 760, 960, .9, { sit: 1, blink: blink(t), mood: u > .4 ? 'proud' : 'calm', tilt: .05 }, t);
    put(c, C.willKid, 1020, 960, .9, { sit: 1, blink: false, mood: 'wow', tilt: .12 }, t, true); }],
  // "You can change your stars": the camera rises into the sky, where a knight is drawn in stars
  [27.6, 33, 'night', u => ({ x: 900, y: lerp(720, -150, ease((u - 1.8) / 2.6)), z: lerp(1.5, 1, ease((u - 1.6) / 2.6)) }), (c, t, u, cam) => { townRoof(c, cam, t, 'night', (u - 2.4) / 2.4);
    put(c, C.father, 760, 960, .9, { sit: 1, blink: blink(t), mood: 'proud', talk: voice(t, 27.7, 31.8), tilt: u > 1.4 ? .3 : .05 }, t);
    put(c, C.willKid, 1020, 960, .9, { sit: 1, blink: blink(t, 1), mood: 'wow', tilt: .3 }, t, true); }],
  // William grew up: from the stars down to a morning road
  [33, 35, 'day', u => ({ x: 900, y: lerp(-150, 600, ease(u / 1.6)), z: 1 }), (c, t, u, cam) => { countryside(c, cam, t);
    const w = walkTo(u, 0, 700, 1180, 240); put(c, C.will, w.x, 900, .85, { ph: w.d / (STRIDE * .85), walk: 1, blink: blink(t), mood: 'happy' }, t);
    flash(c, 1 - clamp(u / .6), '10,14,60'); }],
  [35, 42.6, 'day', u => ({ x: 1000 + Math.min(u * 230, 1100), y: 600, z: 1 }), (c, t, u, cam) => { countryside(c, cam, t);
    const stop = 1100 / 230, d = Math.min(u * 230, 1100), walking = u < stop ? 1 : 0;
    put(c, C.will, 1180 + d, 900, .85, { ph: d / (STRIDE * .85), walk: walking, blink: blink(t), mood: 'happy' }, t);
    const ro = walkTo(u, 1.8, 600, 1960, 400), wa = walkTo(u, 2.0, 450, 1800, 400), sx = x => x - cam.x + 960;
    put(c, C.roland, ro.x, 900, .9, { ph: ro.d / (STRIDE * .9), walk: ro.walk, blink: blink(t, 3), mood: 'happy' }, t);
    put(c, C.wat, wa.x, 905, .78, { ph: wa.d / (STRIDE * .78), walk: wa.walk, blink: blink(t, 4), mood: 'happy' }, t);
    put(c, brownHorse, 2950, 900, .6, { still: true, cloth: null }, t, true, HORSE);
    put(c, C.oldKnight, 2600, 900, .85, { blink: blink(t, 2), mood: 'happy', armB: u > 5.6 ? 1.4 : .2, bendB: .3 }, t, true);
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); popText(c, 'William', sx(1180 + d), 380, 60, pop(u, .3, 3), '#fffaf0'); popText(c, 'Roland', sx(ro.x) + 20, 380, 56, pop(u, 4.8, 7.2), '#fffaf0'); popText(c, 'Wat', sx(wa.x) + 10, 440, 56, pop(u, 5.1, 7.4), '#fffaf0'); c.restore();
    grassFront(c, cam, t, 'rgba(40,110,40,.85)', 1.7, 8, 2); }],
  // the old knight is too old to ride
  [42.6, 46.2, 'candle', push(900, 620, 1.1, 1.2, 3.6), (c, t, u, cam) => {
    layer(c, cam, 0, g => { g.fillStyle = '#c9a272'; g.fillRect(-1000, -800, W + 2000, H + 1600); for (let x = -1000; x < W + 1000; x += 160) { g.fillStyle = 'rgba(120,80,40,.18)'; g.fillRect(x, -800, 80, 1700); }
      g.beginPath(); g.rect(1500, 200, 220, 260); g.fillStyle = '#8ac4ea'; g.fill(); g.lineWidth = 12; g.strokeStyle = '#6b4428'; g.stroke(); });
    layer(c, cam, 1, g => { ground(g, 860, '#8a5a32', '#5a3a20'); armorStand(g, 1460, 880, 1); bed(g, 760, 880); });
    c.save(); c.translate(900, 742); c.rotate(-Math.PI / 2); put(c, C.oldKnight, 0, 0, .7, { mood: 'sleep', still: true, armB: .1 }, t, false, { noShadow: true, tall: 800, wide: 2 }); c.restore();
    layer(c, cam, 1, g => { g.beginPath(); g.moveTo(620, 700); g.quadraticCurveTo(800, 660, 1000, 700); g.lineTo(1010, 770); g.lineTo(610, 770); g.closePath(); fs(g, '#6a8ad0');
      for (let k = 0; k < 3; k++) { const q = (t * .5 + k / 3) % 1; g.save(); g.globalAlpha = Math.sin(q * Math.PI); g.font = '600 54px Fredoka'; g.fillStyle = '#5a6aa0'; g.fillText('z', 520 + q * 60 + k * 10, 560 - q * 200); g.restore(); } });
    candleAt(c, cam, 1250, 860, t); }],
  // the poster, flapping in the wind
  [46.2, 49.4, 'day', push(960, 470, 1.1, 1.35, 3.2), (c, t, u, cam) => {
    layer(c, cam, 0, g => { sky(g, ['#58aef0', '#bfe4ff']); clouds(g, t, '255,255,255', .95, 20); });
    layer(c, cam, .3, g => { for (let i = 0; i < 6; i++) tent(g, -300 + i * 500, 820, 1.2, '#fff', ['#e2443a', '#3a86d8', '#f2c23a'][i % 3]); bunting(g, 80, t, -800, W + 800); });
    layer(c, cam, 1, g => { ground(g, 820, '#7cc060', '#5aa046'); rr(g, 940, 600, 40, 420, 6); fs(g, '#8a5a32');
      g.save(); g.translate(960, 420); g.rotate(-.03 + Math.sin(t * 3) * .02); g.transform(1, 0, Math.sin(t * 4) * .03, 1, 0, 0); rr(g, -300, -230, 600, 460, 18); fs(g, '#fbf0d8', 8);
      g.textAlign = 'center'; g.font = '600 84px Fredoka'; g.fillStyle = '#c8282e'; g.fillText('GRAND', 0, -130); g.font = '600 64px Fredoka'; g.fillStyle = '#2b1d14'; g.fillText('TOURNAMENT', 0, -50);
      g.font = '600 48px Fredoka'; g.fillText('tomorrow!', 0, 190); g.save(); g.translate(-10, 140); put(g, whiteHorse, 0, 0, .3, { ...ride(C.willArmor, { armB: 1.3, bendB: .35, hold: lance(-.2) }) }, t, false, { ...HORSE, noShadow: true }); g.restore(); g.restore(); }); }],
  // William has an idea
  [49.4, 51.8, 'day', push(1000, 610, 2.4, 2.55, 2.4), (c, t, u, cam) => { countryside(c, cam, t);
    put(c, C.will, 960, 900, .85, { blink: blink(t), mood: u > .5 ? 'happy' : 'wow', tilt: u > .5 ? .12 : 0 }, t);
    if (u > .5) sparkle(c, 1110, 470, 40 * ease((u - .5) / .3), t * 2, '#ffd84a'); }],
  // "I will ride in his place!": a low hero shot against the morning sun, his friends looking up
  [51.8, 56.4, 'glory', u => ({ x: 960, y: lerp(700, 560, ease(u / 4.6)), z: 1.3 }), (c, t, u, cam) => {
    layer(c, cam, 0, g => { sky(g, ['#4aa6ea', '#ffe8b0', '#ffd890']); sunDisc(g, 820, 420, 70, '255,230,170'); rays(g, 820, 420, t, '255,236,190', .14, 22); });
    layer(c, cam, .3, g => hillsBand(g, 840, 30, .003, '#c8d8a0', 0, .3, '255,236,190'));
    layer(c, cam, 1, g => ground(g, 900, '#8ccb6e', '#5ea84c'));
    put(c, C.willArmorOpen, 820, 960, 1, { blink: blink(t), mood: 'proud', talk: voice(t, 52, 54.4), armB: 1.75, bendB: 0, tilt: .1, lean: -.04 }, t);
    put(c, C.roland, 1240, 960, .9, { blink: false, mood: 'wow', tilt: .15 }, t, true); put(c, C.wat, 1400, 965, .78, { blink: false, mood: 'wow', tilt: .2 }, t, true); }],
  // the tournament: he climbs on the horse
  [56.4, 59.2, 'day', u => ({ x: lerp(800, 1060, ease(u / 2.8)), y: 580, z: 1.1 }), (c, t, u, cam) => { tourney(c, cam, t, .4);
    const jump = ease((u - .8) / .7);
    if (jump < 1) { put(c, whiteHorse, 1060, 900, .7, { still: true }, t, false, HORSE);
      const x = lerp(820, 1050, jump), y = lerp(900, 720, jump) - Math.sin(jump * Math.PI) * 120; put(c, C.willArmor, x, y, .7, { blink: blink(t), mood: 'sure', sit: jump, armB: jump * 1.4 }, t, false, { noShadow: jump > .1 }); }
    else put(c, whiteHorse, 1060, 900, .7, { ...ride(C.willArmor, { armB: 1.25, bendB: .35, hold: lance(-.4), mood: 'proud' }) }, t, false, HORSE); }],
  // his gauntlet tightens on the long pole
  [59.2, 61, 'day', at(960, 540, 1), (c, t, u, cam) => {
    layer(c, cam, 0, g => { g.fillStyle = '#e8c88a'; g.fillRect(-500, -500, W + 1000, H + 1000); g.save(); g.filter = 'blur(14px)';
      for (let i = 0; i < 30; i++) { ell(g, hash(i, 71) * W, hash(i, 72) * 700, 40 + hash(i, 73) * 70); g.fillStyle = `rgba(${['226,68,58', '58,134,216', '242,194,58', '74,160,74', '138,74,184'][i % 5]},.45)`; g.fill(); } g.restore(); });
    const grip = ease(u / .6);
    layer(c, cam, 1, g => { g.save(); g.translate(960, 560); g.rotate(-.32); g.beginPath(); g.rect(-1300, -16, 2700, 32); fs(g, '#f2c23a', 4); for (let k = 0; k < 16; k++) { g.fillStyle = '#3a76c8'; g.fillRect(-1280 + k * 170, -15, 50, 30); } g.restore();
      g.save(); g.translate(900 + Math.sin(t * 20) * 2 * grip, 560); g.rotate(-.32); rr(g, -110, -90, 200, 180, 50); fs(g, lin(g, -110, 0, 90, 0, [[0, '#8c97a8'], [.5, '#f4f8fc'], [1, '#9aa4b4']]), 6);
        for (let k = 0; k < 4; k++) { rr(g, -96 + k * 46, -100 - (1 - grip) * 30, 40, 70, 18); fs(g, '#d3dbe6', 4); } g.restore(); }); }],
  // the other knight's horse rears
  [61, 62.1, 'day', at(960, 520, 1.25), (c, t, u, cam) => { tourney(c, cam, t, .6);
    const rear = Math.sin(clamp(u / 1.1) * Math.PI) * .4; c.save(); c.translate(1100, 900); c.rotate(rear); c.translate(-1100, -900);
    put(c, brownHorse, 960, 900, .75, { ...ride(C.redKnight, { armB: 1.5, bendB: .2, hold: lance(-1.1), mood: 'mean' }) }, t, true, { ...HORSE, noShadow: true }); c.restore(); }],
  // the charge: tracking beside William, then the other knight thundering at us
  [62.1, 65.3, 'day', u => u < 1.7 ? { x: 900 + u * 520, y: 560, z: 1.15 } : { x: 960, y: 560, z: lerp(1.1, 1.3, ease((u - 1.7) / 1.5)) }, (c, t, u, cam) => { tourney(c, cam, t, 1); cnow = c;
    if (u < 1.7) { const d = u * 520; gallop(whiteHorse, C.willArmor, 700 + d, 940, .66, d, t);
      for (let i = 0; i < 8; i++) { const y = 700 + i * 40, x = 700 + d - 300 - ((t * 900 + i * 130) % 400); layer(c, cam, 1, g => { g.beginPath(); g.moveTo(x, y); g.lineTo(x + 160, y); ink(g, 4, 'rgba(255,255,255,.55)'); }); } }
    else { const k = (u - 1.7) / 1.5, s = lerp(.5, .95, k); gallop(brownHorse, C.redKnight, lerp(1500, 1100, k), 900 + k * 60, s, k * 400, t, true, 'mean'); } }],
  [65.3, 67, 'glory', at(960, 540, 1), (c, t, u, cam) => { cnow = c; burst(c, t); silhouetteRiders(c, t, 66.1); popText(c, 'BANG!', 960, 420, 190, u / .25, '#e2443a', '#fff3c0'); }],
  [67, 70.3, 'glory', u => ({ x: 1000, y: lerp(640, 520, ease(u / 3.3)), z: lerp(1.35, 1.2, ease(u / 3.3)) }), (c, t, u, cam) => { tourney(c, cam, t, 1);
    put(c, whiteHorse, 960, 920, .75, { ...ride(C.willArmor, { armF: 2.1, bendF: .5, armB: 1.25, bendB: .35, hold: lance(-1.4), mood: 'happy' }) }, t, false, HORSE);
    confetti(c, t, 1); c.save(); c.setTransform(1, 0, 0, 1, 0, 0); popText(c, 'William wins!', 960, 160, 100, (u - .1) / .5); c.restore(); flash(c, clamp((u - 2.5) / .8), '8,8,30'); }],
  // around the fire at night
  [70.3, 73.8, 'fire', push(960, 640, 1, 1.12, 3.5), (c, t, u, cam) => { campNight(c, cam, t);
    put(c, C.will, 640, 920, .8, { sit: 1, blink: blink(t), mood: 'calm', tilt: -.06 }, t);
    put(c, C.wat, 1220, 925, .72, { sit: 1, blink: blink(t, 2), mood: 'calm' }, t, true); put(c, C.roland, 1420, 920, .8, { sit: 1, blink: blink(t, 3), mood: 'calm' }, t, true); }],
  [73.8, 77, 'fire', push(700, 690, 2.2, 2.35, 3.2), (c, t, u, cam) => { campNight(c, cam, t);
    put(c, C.will, 640, 920, .8, { sit: 1, blink: blink(t), mood: 'sad', tilt: -.12 }, t);
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); bubble(c, 1400, 260, null, (u - .3) / .5, 52, [-140, 90], true);
    if (u > .5) { c.translate(1400, 260); c.globalAlpha = clamp((u - .5) * 3); rr(c, -100, -38, 200, 76, 10); fs(c, '#c9a06a'); c.font = '600 34px Fredoka'; c.textAlign = 'center'; c.fillStyle = '#4a2a14'; c.fillText('NOBLES', 0, -2); c.fillText('ONLY', 0, 30);
      c.beginPath(); c.moveTo(-90, -60); c.lineTo(90, 60); c.moveTo(90, -60); c.lineTo(-90, 60); ink(c, 12, '#e2443a'); } c.restore(); }],
  [77, 79.6, 'fire', push(1320, 690, 1.9, 2.0, 2.6), (c, t, u, cam) => { campNight(c, cam, t);
    put(c, C.wat, 1220, 925, .72, { sit: 1, blink: blink(t, 2), mood: u > .4 ? 'happy' : 'calm', tilt: .1 }, t, true); put(c, C.roland, 1420, 920, .8, { sit: 1, blink: blink(t, 3), mood: 'happy', armB: 1.2 }, t, true);
    if (u > 1) sparkle(c, 1320, 560, 30 * ease((u - 1) / .3), t * 2, '#ffd84a'); }],
  [79.6, 83.4, 'fire', at(960, 540, 1), (c, t, u, cam) => { campNight(c, cam, t); flash(c, .45, '8,8,30');
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'lighter'; glow(c, 960, 470, 700, '255,170,90', .25); c.restore();
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); scroll(c, 960, 470, clamp(u / .8), [['Let it be known that this knight is', 40, '600', -50, .9], ['Sir Ulrich', 110, 'italic', 70, 1.4]], clamp((u - 2.2) / .4), u); c.restore(); }],
  // on the road at sunset they meet Geoff
  [83.4, 89.1, 'sunset', u => u < 3.6 ? { x: 700 + u * 120, y: 600, z: 1 } : { x: 1300, y: 640, z: 1.75 }, (c, t, u, cam) => { roadSunset(c, cam, t);
    const g2 = ease((u - 2.4) / .5);
    c.save(); c.beginPath(); c.rect(-3000, -3000, 8000, 3910); c.clip();   // he hides behind the haystack: nothing of him below the ground
    put(c, C.geoff, 1360, 900 + (1 - g2) * 260, .85, { blink: blink(t, 5), mood: u > 3.8 ? 'happy' : 'calm', ...(u > 3.8 ? wave(t) : { armB: .2 }), talk: u > 4 ? Math.abs(Math.sin(t * 9)) * .5 : 0 }, t, true, { noShadow: true }); c.restore();
    layer(c, cam, 1, g => haystack(g, 1360, 910, 1.15));
    [[C.roland, 0, .9], [C.will, 160, .85], [C.wat, 300, .78]].forEach(([fn, o, s], i) => { const w = walkTo(u, 0, 200 + o, 800 + o, 220); put(c, fn, w.x, 900 + i * 4, s, { ph: w.d / (STRIDE * s), walk: w.walk, blink: blink(t, i), mood: u > 2.6 ? 'wow' : 'calm' }, t); });
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); popText(c, 'Geoff!', 1180, 300, 64, pop(u, 3.7, 5.4), '#fffaf0'); c.restore(); }],
  [89.1, 91, 'candle', at(960, 540, 1), (c, t, u, cam) => {
    layer(c, cam, 0, g => { g.fillStyle = '#5a3a22'; g.fillRect(-500, -500, W + 1000, H + 1000); for (let y = -500; y < H + 500; y += 60) { g.fillStyle = 'rgba(0,0,0,.1)'; g.fillRect(-500, y, W + 1000, 2); } });
    layer(c, cam, 1, g => { g.save(); g.translate(960, 560); g.rotate(-.04); rr(g, -420, -300, 840, 600, 6); fs(g, '#fbf0d8', 5);
      g.textAlign = 'center'; g.fillStyle = '#4a2a14'; g.font = '600 54px Fredoka'; g.fillText('The Noble Knight', 0, -150);
      const k = clamp((u - .3) / 1.2); g.save(); g.beginPath(); g.rect(-300, -40, 600 * k, 180); g.clip(); g.font = 'italic 120px "Snell Roundhand", "Apple Chancery", serif'; g.fillText('Sir Ulrich', 0, 80); g.restore();
      const qx = -300 + 600 * k, qy = 60 + Math.sin(t * 14) * 14; g.beginPath(); g.moveTo(qx, qy); g.quadraticCurveTo(qx + 60, qy - 160, qx + 140, qy - 260); g.quadraticCurveTo(qx + 40, qy - 120, qx, qy); fs(g, '#ffffff'); g.restore(); });
    candleAt(c, cam, 1560, 900, t, 1.2); }],
  [91, 94.2, 'sunset', push(1000, 470, 1.15, 1.3, 3.2), (c, t, u, cam) => { layer(c, cam, 0, g => stage(g, t));
    put(c, C.geoff, 960, 700, .9, { blink: blink(t), mood: 'shout', ...wave(t), talk: voice(t, 91.6, 93.6) + .3, tilt: .1 }, t);
    layer(c, cam, 1.3, g => crowdRow(g, t, 1180, 1.4, 41, 1));
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); bubble(c, 1360, 230, 'SIR ULRICH!', (u - .5) / .3, 62, [-140, 50]); confetti(c, t, clamp((u - .6) * 2), 3); c.restore(); }],
  // Kate's forge
  [94.2, 99.5, 'forge', push(900, 560, 1, 1.1, 5.3), (c, t, u, cam) => { layer(c, cam, 0, g => forge(g, t));
    const hit = Math.max(0, Math.sin(t * 7)); put(c, C.kate, 640, 870, .85, { blink: blink(t), mood: 'sure', armB: 1.3 + hit * .7, bendB: .1 - hit * .7, hold: hammer }, t, false, { warm: [1540, 760, 900, '255,150,70', .3] });
    if (hit < .15) sparks(c, 860, 700, t, 16); }],
  [99.5, 102.1, 'forge', push(800, 640, 1.9, 2.05, 2.6), (c, t, u, cam) => { layer(c, cam, 0, g => forge(g, t));
    const hit = Math.max(0, Math.sin(t * 7)); put(c, C.kate, 640, 870, .85, { blink: blink(t), mood: 'happy', armB: 1.3 + hit * .7, bendB: .1 - hit * .7, hold: hammer }, t, false, { warm: [1540, 760, 900, '255,150,70', .3] });
    if (hit < .15) sparks(c, 860, 700, t, 16); }],
  [102.1, 107.8, 'forge', push(1060, 560, 1, 1.12, 5.7), (c, t, u, cam) => { layer(c, cam, 0, g => forge(g, t));
    layer(c, cam, 1, g => armorStand(g, 960, lerp(860, 760, ease(u / 1.2)), 1.1, ease(u / .8), t));
    put(c, C.kate, 520, 870, .85, { blink: false, mood: 'proud' }, t);
    const w = walkTo(u, 1.6, 2000, 1420, 300); put(c, C.will, w.x, 870, .85, { ph: w.d / (STRIDE * .85), walk: w.walk, blink: false, mood: 'wow', tilt: .15 }, t, true, { warm: [960, 500, 900, '255,240,200', .35] }); }],
  // William won again and again
  [107.8, 110.7, 'day', u => ({ x: 960, y: 560 - (Math.floor(u) % 2) * 40, z: 1.25 + Math.floor(u) * .12 }), (c, t, u, cam) => {
    layer(c, cam, 0, g => { sky(g, [['#bfe4ff', '#fff0d0', '#d8f0d8'][Math.floor(u) % 3], '#ffffff']); stands(g, t, 120, 7, 1, -400, W + 400, 1.4); ground(g, 600, '#ecc88a', '#d9a866'); trophy(g, 1300, 300, 1.4); });
    put(c, C.willArmor, 960, 1000 + hop(t), .9, { blink: blink(t), mood: 'happy', tilt: .1 }, t);
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); popText(c, 'WIN!', 760, 280, 110, ((u % 1) - .05) / .25); confetti(c, t, 1, 7); c.restore(); }],
  // Count Adhemar: boots first, then a low shot as thunder cracks
  [110.7, 113.7, 'dusk', u => ({ x: 600 + u * 160, y: 860, z: 2.2 }), (c, t, u, cam) => { duskStorm(c, cam, t);
    const w = walkTo(u, 0, 380, 1000, 200); put(c, C.adhemar, w.x, 940, .9, { ph: w.d / (STRIDE * .9), walk: w.walk, mood: 'mean', blink: false }, t); }],
  [113.7, 118.3, 'dusk', u => ({ x: 980, y: lerp(820, 640, ease(u / 1.2)), z: lerp(2.1, 1.7, ease(u / 1.2)) }), (c, t, u, cam) => { duskStorm(c, cam, t);
    put(c, C.adhemar, 1000, 940, .9, { mood: 'mean', blink: blink(t), armB: .9, bendB: 1.4, tilt: .06 }, t);
    if (u < .5) { flash(c, .7 * (1 - u * 2)); c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.beginPath(); c.moveTo(1500, 0); c.lineTo(1460, 140); c.lineTo(1510, 150); c.lineTo(1450, 330); ink(c, 8, '#fffbe0'); c.restore(); }
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); popText(c, 'Count Adhemar', 980, 160, 76, pop(u, .4, 3.4), '#d8c0ff', 'rgba(40,20,60,.7)'); popText(c, 'Hmph!', 1320, 420, 56, pop(u, 2.6, 4.2), '#ffffff', 'rgba(40,20,60,.7)'); c.restore(); }],
  // London, a snowy night
  [118.3, 123.6, 'night', u => ({ x: lerp(560, 1320, ease(u / 5.3)), y: 560, z: 1.05 }), (c, t, u, cam) => { street(c, cam, t, u); }],
  // his father, old and blind, by a candle
  [123.6, 127.3, 'candle', push(1060, 620, 1.4, 1.55, 3.7), (c, t, u, cam) => { fatherRoom(c, cam, t);
    put(c, C.fatherOld, 1000, 880, .9, { sit: 1, mood: 'sleep', tilt: .05 }, t, false, { warm: [1320, 650, 700, '255,190,110', .3] }); candleAt(c, cam, 1320, 730, t, 1, true); }],
  [127.3, 130, 'candle', u => u < 1.6 ? { x: 360, y: 600, z: 1.7 } : { x: 1040, y: 640, z: 2.1 }, (c, t, u, cam) => { fatherRoom(c, cam, t);
    put(c, C.will, 160, 870, .85, { blink: blink(t), mood: 'happy', talk: voice(t, 127.5, 128.9) }, t);
    put(c, C.fatherOld, 1000, 880, .9, { sit: 1, mood: u > 1.7 ? 'happy' : 'sleep', tilt: u > 1.7 ? .12 : 0 }, t, true, { warm: [1320, 650, 700, '255,190,110', .3] }); candleAt(c, cam, 1320, 730, t, 1, true);
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); bubble(c, 460, 220, 'Father... it\'s me.', clamp((u - .2) / .3) * (u < 1.6 ? 1 : 0), 46, [-60, 70]); c.restore(); }],
  [130, 134, 'candle', push(900, 620, 1.3, 1.5, 4), (c, t, u, cam) => { fatherRoom(c, cam, t);
    const w = walkTo(u, 0, 300, 820, 380), hug = clamp((u - 1.4) / .5);
    put(c, C.fatherOld, 1000, 880, .9, { sit: 1, mood: 'happy', armB: hug * 1.3, bendB: .5, lean: -.04 * hug }, t, true, { warm: [1320, 650, 700, '255,190,110', .3] });
    put(c, C.will, w.x, 870, .85, { ph: w.d / (STRIDE * .85), walk: w.walk, mood: hug > .5 ? 'happy' : 'wow', armB: hug * 1.2, bendB: .9 * hug, lean: .08 * hug }, t, false, { warm: [1320, 650, 700, '255,190,110', .3] });
    candleAt(c, cam, 1320, 730, t, 1, true); hearts(c, 900, 420, t, hug, 1.3); }],
  // Count Adhemar tells everyone the truth
  [134, 138.8, 'day', push(1000, 560, 1, 1.08, 4.8), (c, t, u, cam) => { square(c, cam, t);
    layer(c, cam, 1, g => { rr(g, 1260, 840, 200, 60, 6); fs(g, '#8a5a32'); });
    put(c, C.adhemar, 1360, 845, .85, { blink: blink(t), mood: 'mean', armB: u > 2 ? 1.5 : .4 }, t, true);
    put(c, C.will, 600, 900, .85, { blink: blink(t, 1), mood: u > 2.5 ? 'worried' : 'calm' }, t); }],
  [138.8, 142.6, 'day', u => u < 2 ? { x: 1260, y: 600, z: 1.9 } : { x: 640, y: 640, z: 2.1 }, (c, t, u, cam) => { square(c, cam, t);
    layer(c, cam, 1, g => { rr(g, 1260, 840, 200, 60, 6); fs(g, '#8a5a32'); });
    put(c, C.adhemar, 1360, 845, .85, { blink: false, mood: 'shout', armB: 1.55, bendB: .1, talk: voice(t, 139, 142.4) }, t, true);
    put(c, C.will, 600, 900, .85, { blink: false, mood: 'wow' }, t); }],
  [142.6, 147.8, 'day', at(960, 580, 1.15), (c, t, u, cam) => { square(c, cam, t, .6);
    const a = walkTo(u, 0, -200, 760, 330), b = walkTo(u, .2, 2100, 1160, 330), held = u > 3;
    put(c, C.guard, a.x, 900, .85, { ph: a.d / (STRIDE * .85), walk: a.walk, armB: held ? 1.3 : .1, bendB: .3 }, t);
    put(c, C.will, 960, 900, .85, { blink: blink(t), mood: u > 3 ? 'sure' : 'worried', tilt: u > 3 ? .08 : 0 }, t);
    put(c, C.guard, b.x, 900, .85, { ph: b.d / (STRIDE * .85), walk: b.walk, armB: held ? 1.3 : .1, bendB: .3 }, t, true); }],
  [147.8, 152.8, 'glory', push(960, 600, 1.4, 1.6, 5), (c, t, u, cam) => { square(c, cam, t, 0); flash(c, .55, '10,10,30');
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'lighter'; c.beginPath(); c.moveTo(860, -200); c.lineTo(1060, -200); c.lineTo(1200, 1100); c.lineTo(720, 1100); c.closePath(); c.fillStyle = lin(c, 0, -200, 0, 1100, [[0, 'rgba(255,240,200,.35)'], [1, 'rgba(255,240,200,.08)']]); c.fill(); c.restore();
    put(c, C.guard, 760, 900, .85, { armB: 1.3, bendB: .3 }, t); put(c, C.will, 960, 900, .85, { blink: blink(t), mood: 'proud', tilt: .14 }, t, false, { warm: [960, 300, 700, '255,240,200', .3] }); put(c, C.guard, 1160, 900, .85, { armB: 1.3, bendB: .3 }, t, true); }],
  // a hooded man comes forward: the Prince
  [152.8, 155.8, 'glory', u => ({ x: 400 + u * 180, y: 600, z: 1.3 }), (c, t, u, cam) => { glory(c, cam, t, 0);
    const w = walkTo(u, 0, 200, 900, 260); put(c, C.princeHood, w.x, 900, .9, { ph: w.d / (STRIDE * .9), walk: w.walk, blink: blink(t), mood: 'calm' }, t); }],
  [155.8, 157.5, 'glory', at(900, 640, 1.9), (c, t, u, cam) => { glory(c, cam, t, 1);
    put(c, C.will, 540, 900, .9, { mood: 'wow', blink: false }, t);
    put(c, u < .25 ? C.princeHood : C.prince, 960, 900, .9, { mood: 'happy', blink: false }, t, true);
    if (u < .5) for (let i = 0; i < 10; i++) sparkle(c, 960 + Math.cos(i) * 160 * u * 3, 560 + Math.sin(i * 2) * 120 * u * 3, 30 * (1 - u * 2), t);
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); popText(c, 'The Prince!', 960, 160, 76, (u - .2) / .4); c.restore(); }],
  [157.5, 160.7, 'sepia', at(960, 540, 1), (c, t, u, cam) => { glory(c, cam, t, 0);
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); memoryCircle(c, clamp(u / .4) * clamp((3.2 - u) / .3), m => { m.save(); m.filter = 'grayscale(1) sepia(.6)';
      put(m, C.will, 800, 820, .85, { mood: 'happy', armB: 1.3, bendB: .4, hold: (cc, x, y) => { ell(cc, x + 30, y - 6, 34, 20); fs(cc, '#d9a050'); } }, t, false, { noShadow: true });
      put(m, C.princeHood, 1130, 820, .85, { mood: u > 1.6 ? 'happy' : 'sad' }, t, true, { noShadow: true }); m.restore(); hearts(m, 960, 520, t, clamp(u - 1.6), .9); }); c.restore(); }],
  [160.7, 164.3, 'glory', push(960, 600, 1.45, 1.55, 3.6), (c, t, u, cam) => { glory(c, cam, t, 1);
    put(c, C.will, 700, 900, .9, { mood: 'wow', blink: blink(t) }, t);
    put(c, C.prince, 1180, 900, .9, { mood: 'happy', talk: voice(t, 160.9, 163.2), armB: 1.2, bendB: .3, blink: blink(t, 2) }, t, true); }],
  [164.3, 167.8, 'glory', u => u < 1.8 ? { x: 960, y: 640, z: 1.6 } : { x: 960, y: 560, z: 1.2 }, (c, t, u, cam) => { glory(c, cam, t, 1);
    const kneel = clamp(u / .5) * (1 - clamp((u - 1.8) / .4)), tap = Math.sin(clamp((u - .7) / 1) * Math.PI);
    put(c, C.will, 760, 900, .9, { kneel, mood: kneel > .5 ? 'proud' : 'happy', tilt: -.15 * kneel }, t);
    put(c, C.prince, 1130, 900, .9, { mood: 'happy', talk: voice(t, 164.4, 166.2), armB: 1.0 + tap * .5, bendB: .2, hold: sword(-1.3 - tap * .3) }, t, true);
    if (u > 1.8) { c.save(); c.setTransform(1, 0, 0, 1, 0, 0); popText(c, 'Sir William!', 960, 160, 96, (u - 1.9) / .4); confetti(c, t, 1, 11); c.restore(); } }],
  // the last contest: Count Adhemar's trick
  [167.8, 171.6, 'day', push(1000, 640, 1.6, 1.75, 3.8), (c, t, u, cam) => { tourney(c, cam, t, .4);
    put(c, blackHorse, 1000, 920, .8, { ...ride(C.adhemarRide, { armB: 1.5, bendB: .2, hold: lance(-.9), mood: 'mean', talk: Math.abs(Math.sin(t * 8)) * .4 }) }, t, true, HORSE);
    if (u > 1.4) { c.save(); c.setTransform(1, 0, 0, 1, 0, 0); popText(c, 'hee hee!', 1300, 300, 48, (u - 1.5) / .3, '#d8c0ff', 'rgba(40,20,60,.7)'); c.restore(); } }],
  [171.6, 174.9, 'day', at(960, 560, 1), (c, t, u, cam) => { tourney(c, cam, t, 1); cnow = c;
    const a = 200 + u * 220, b = 1720 - u * 220, hit = u > 1.4 && u < 2.6;
    gallop(blackHorse, C.adhemarRide, b, 880, .6, u * 220, t, true, 'mean', { hold: lance(.08) });
    gallop(whiteHorse, C.willArmor, a, 940, .66, u * 220, t, false, hit ? 'worried' : 'sure', { jolt: hit ? -.18 * Math.sin((u - 1.4) * 4) : 0 });
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); popText(c, 'Ow!', 900, 300, 80, (u - 1.4) / .3, '#e2443a', '#fff3c0'); c.restore(); }],
  [174.9, 177.6, 'day', push(1000, 640, 1.8, 1.95, 2.7), (c, t, u, cam) => { tourney(c, cam, t, .6);
    put(c, whiteHorse, 960, 920, .8, { ...ride(C.willArmor, { armB: .9, bendB: .9, mood: u > 1 ? 'sure' : 'worried', tilt: u > 1 ? .08 : -.05 }) }, t, false, HORSE);
    if (u > 1.2) sparkle(c, 1060, 330, 30 * Math.abs(Math.sin(t * 3)), t); }],
  [177.6, 181, 'day', u => ({ x: 900 + u * 560, y: 560, z: 1.12 }), (c, t, u, cam) => { tourney(c, cam, t, 1); cnow = c;
    const d = u * 560; gallop(whiteHorse, C.willRide, 700 + d, 940, .66, d * 1.3, t);
    for (let i = 0; i < 10; i++) { const y = 680 + i * 36, x = 700 + d - 340 - ((t * 1100 + i * 120) % 440); layer(c, cam, 1, g => { g.beginPath(); g.moveTo(x, y); g.lineTo(x + 180, y); ink(g, 4, 'rgba(255,255,255,.6)'); }); } }],
  [181, 182.2, 'glory', at(960, 540, 1), (c, t, u, cam) => { cnow = c; burst(c, t); silhouetteRiders(c, t, 181.4, true); popText(c, 'BANG!', 960, 400, 190, u / .25, '#e2443a', '#fff3c0'); }],
  [182.2, 183.4, 'glory', push(1000, 560, 1.15, 1.25, 1.2), (c, t, u, cam) => { tourney(c, cam, t, 1);
    put(c, whiteHorse, 960, 920, .75, { ...ride(C.willRide, { armF: 2.1, bendF: .5, armB: 1.25, bendB: .35, hold: lance(-1.4), mood: 'happy' }) }, t, false, HORSE);
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); confetti(c, t, 1, 5); popText(c, 'Hooray!', 960, 160, 100, (u - .1) / .4); c.restore(); flash(c, clamp((u - .8) / .4), '8,8,30'); }],
  // everyone together under the stars
  [183.4, 186, 'night', push(960, 600, 1, 1.08, 2.6), (c, t, u, cam) => { party(c, cam, t, u); finale(c, t, u, 0); }],
  [186, 188.6, 'night', push(900, 640, 1.7, 1.8, 2.6), (c, t, u, cam) => { party(c, cam, t, u); finale(c, t, u, 1); }],
  [188.6, 190.9, 'night', push(1420, 640, 1.9, 2.0, 2.3), (c, t, u, cam) => { party(c, cam, t, u); finale(c, t, u, 2); }],
  [190.9, 196.8, 'night', u => ({ x: 960, y: lerp(600, -200, ease((u - .3) / 2.4)), z: 1 }), (c, t, u, cam) => { party(c, cam, t, u, (u - .6) / 2, u > 3 ? ease((u - 3) / 1.2) : 0); finale(c, t, u, 3); }],
  [196.8, 199.3, 'night', at(960, -200, 1), (c, t, u, cam) => { party(c, cam, t, u + 6, 1, 1);
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); popText(c, 'The End', 960, 700, 130, u / .5); c.restore(); }],
];

// ---------- pieces used by several shots ----------
function candleAt(c, cam, x, y, t, s = 1, onTable = false) { layer(c, cam, 1, g => { if (onTable) table(g, x, y + 150, 1); candle(g, x, y, t, s); }); }
function fatherRoom(c, cam, t) { layer(c, cam, 0, g => room(g, t)); layer(c, cam, 1, g => bench(g, 1000, 880)); }
function silhouetteRiders(c, t, flyAt, black = false) {   // the BANG! frame: two riders crashing, as dark shapes
  const sil = { ...HORSE, silhouette: 'rgba(90,40,30,.85)' };
  put(c, whiteHorse, 700, 1000, .9, { ...ride(black ? C.willRide : C.willArmor, { armB: 1.25, bendB: .35, hold: lance(-.05) }), run: 1, ph: 1.2 }, t, false, sil);
  const fly = clamp((t - flyAt) / .8), foe = black ? blackHorse : brownHorse, rider = black ? C.adhemarRide : C.redKnight;
  if (fly <= 0) put(c, foe, 1260, 1000, .9, { ...ride(rider, { armB: 1.25, bendB: .35, hold: lance(-.05) }), run: 1, ph: 1.2 }, t, true, sil);
  else { put(c, foe, 1260 - fly * 200, 1000, .9, { run: 1, ph: 1.2 + (fly * 200) / (HSTRIDE * .9), still: true }, t, true, sil);   // it runs on the way it faces
    c.save(); c.translate(1300 + fly * 260, 560 - Math.sin(fly * Math.PI) * 260); c.rotate(fly * 4); put(c, rider, 0, 0, .8, { sit: 1, still: true }, t, true, { noShadow: true, silhouette: 'rgba(90,40,30,.85)' }); c.restore(); }
}
function finale(c, t, u, close = 0) {
  const hug = close === 1, cheer = u > .5 && !hug, up = () => ({}), j = k => cheer ? hop(t, k) : 0;   // cheering is a happy hop
  put(c, C.kate, 380, 900 + j(1), .8, { mood: 'happy', ...up(1), armB: hug ? 1.5 : .1, bendB: .2, blink: blink(t, 1) }, t, false, { warm: [300, 700, 600, '255,170,90', .25] });
  put(c, C.roland, hug ? 700 : 640, 900 + j(2), .85, { mood: 'happy', ...up(2), armB: hug ? 1.5 : .1, bendB: .2, blink: blink(t, 2) }, t);
  put(c, C.will, 960, 900 + j(3), .85, { mood: 'happy', blink: blink(t) }, t);
  put(c, C.wat, hug ? 1150 : 1220, 905 + j(4), .75, { mood: 'happy', ...up(4), armB: hug ? 1.5 : .1, bendB: .2, blink: blink(t, 3) }, t, true);
  put(c, C.fatherOld, 1420, 900, .85, { mood: close === 2 ? 'proud' : 'happy', blink: false, tilt: close === 2 ? .1 : 0 }, t, true);
  put(c, C.geoff, 1640, 900 + j(5), .85, { mood: 'happy', blink: blink(t, 4) }, t, true, { warm: [1620, 700, 600, '255,170,90', .25] });
  if (close === 2) { ell(c, 1452, 610, 6, 10); c.fillStyle = 'rgba(150,200,255,.9)'; c.fill(); hearts(c, 1430, 480, t, 1, 1.2); }
  if (hug) hearts(c, 960, 520, t, 1, 1.2);
}
function street(c, cam, t, u) {   // the London street at night, snowing: houses, the father's little wooden house
  layer(c, cam, 0, g => { sky(g, ['#060a24', '#141c50', '#2a2a6a', '#3a3270']); stars(g, t); moon(g, 1500, 160, 66); });
  for (const [back, p] of [[true, .45], [false, 1]]) layer(c, cam, p, g => { for (let i = 0, x = -900; x < 4400; i++) { const w = 240 + hash(i, 1) * 120, h = 300 + hash(i, 2) * 200; if (hash(i, 4) > .5 !== back) { x += w * (back ? .55 : .8) + 30; continue; }
    const s = back ? .82 : 1, base = 830 - (back ? 40 : 0);
    if (!(x + w > 1560 && x < 2300) || back) { g.beginPath(); g.moveTo(x, base); g.lineTo(x, base - h * s); g.lineTo(x - 26 * s, base - h * s); g.lineTo(x + w * s / 2, base - h * s - 140 * s); g.lineTo(x + w * s + 26 * s, base - h * s); g.lineTo(x + w * s, base - h * s); g.lineTo(x + w * s, base); g.closePath();
      g.fillStyle = back ? '#2c3a6e' : '#1f2c5c'; g.fill(); g.lineWidth = 3; g.strokeStyle = 'rgba(10,12,30,.8)'; g.stroke();
      for (let r = 0; r < 3; r++) for (let k = 0; k < 2; k++) { const wx = x + w * s * (.2 + k * .45), wy = base - h * s + 70 * s + r * 120 * s; if (wy > base - 90) continue; const on = hash(i * 7 + r * 2 + k, 9) < .45;
        g.fillStyle = on ? '#ffb25a' : '#141a3a'; g.fillRect(wx, wy, 56 * s, 66 * s); if (on) { g.save(); g.globalCompositeOperation = 'lighter'; glow(g, wx + 28 * s, wy + 33 * s, 110 * s, '255,170,80', back ? .2 : .3); g.restore(); } }
      if (back) { g.fillStyle = 'rgba(110,120,190,.18)'; g.fill(); } }
    x += w * (back ? .55 : .8) + 30; } });
  const hx = 1680, base = 832;
  layer(c, cam, 1, g => { g.beginPath(); g.rect(hx, base - 330, 560, 330); fs(g, '#7d5233'); g.beginPath(); g.moveTo(hx - 40, base - 330); g.lineTo(hx + 280, base - 500); g.lineTo(hx + 600, base - 330); g.closePath(); fs(g, '#e9eef6');
    g.beginPath(); g.roundRect(hx + 60, base - 230, 110, 230, [55, 55, 0, 0]); fs(g, '#4a2c18'); g.beginPath(); g.rect(hx + 270, base - 250, 170, 130); fs(g, '#ffb860');
    g.save(); g.globalCompositeOperation = 'lighter'; glow(g, hx + 355, base - 185, 420, '255,185,100', .35); g.restore();
    g.fillStyle = '#5a5e84'; g.fillRect(-1000, 828, W + 4000, 22); ground(g, 850, '#2f3460', '#191c3c');
    for (let r = 0; r < 3; r++) for (let x = -600 + (r % 2) * 125; x < 4000; x += 250) { ell(g, x, 892 + r * 92, 104, 30); g.fillStyle = 'rgba(80,90,150,.6)'; g.fill(); g.lineWidth = 3; g.strokeStyle = '#22264a'; g.stroke(); }
    g.save(); g.globalCompositeOperation = 'lighter'; g.translate(hx + 330, 940); g.scale(1, .22); glow(g, 0, 0, 460, '255,180,90', .55); g.restore(); });
  const T_STOP = 4.2, x0 = 300, sp = 250, x = u < T_STOP ? x0 + sp * u : x0 + sp * T_STOP + sp * (Math.min(u - T_STOP, .8) - Math.min(u - T_STOP, .8) ** 2 / 1.6), walk = u < T_STOP ? 1 : 1 - ease((u - T_STOP) / .8);
  put(c, C.will, x, 905, .85, { ph: (x - x0) / (STRIDE * .85), walk, blink: blink(t), mood: u > 4.6 ? 'happy' : 'calm', tilt: u > 4.8 ? .12 : 0 }, t, false, { warm: [hx + 355, base - 185, 900, '255,190,110', clamp(1 - Math.abs(hx - x) / 1600) * .45] });
  blurLayer(c, cam, 1.5, 9, g => { g.fillStyle = '#0b0d1e'; g.fillRect(-200, -800, 44, 2400); });
  blurLayer(c, cam, 1.4, 2, g => { for (let i = 0; i < 160; i++) { const d = hash(i, 33), xx = hash(i, 31) * 4000 - 800, yy = (hash(i, 32) * 1500 + t * (40 + d * 90)) % 1500 - 300; ell(g, xx + Math.sin(t + i) * 20, yy, 1.5 + d * d * 6); g.fillStyle = `rgba(225,232,255,${.35 + d * .5})`; g.fill(); } });
}

const CAPS = [[5.5, 10.4, 'Long ago, in a land of castles, there lived a little boy named William.'], [10.4, 13.1, 'His father fixed roofs.'],
  [13.1, 16.9, 'They were poor, but they loved each other very much.'], [18.6, 22.2, 'William looked at the brave knights riding by.'],
  [22.2, 25.5, '“Father, can I be a knight one day?”'], [25.5, 27.6, 'His father smiled.'], [27.6, 31.8, '“You can change your stars, William. You can be anything.”'],
  [33.6, 35, 'William grew up.'], [35, 42.6, 'He worked for an old knight, together with his two best friends, Roland and Wat.'],
  [42.6, 46.2, 'One day, the old knight could not ride anymore.'], [46.2, 49.4, 'There was a big contest the next day.'], [49.4, 51.8, 'William had an idea.'],
  [51.8, 54.6, '“I will ride in his place!”'], [56.4, 59.2, 'William climbed on the horse.'], [59.2, 62.1, 'He held the long pole tight.'],
  [62.1, 65.3, 'The other knight rode fast at him.'], [65.3, 67, 'Bang!'], [67, 70.3, 'William won!'], [70.3, 73.8, 'William wanted to ride in more contests.'],
  [73.8, 77, 'But only noble knights were allowed.'], [77, 79.6, 'So his friends helped him.'], [79.6, 83.4, 'They gave him a fancy new name, Sir Ulrich.'],
  [85.1, 89.1, 'On the road, they met a funny storyteller named Geoff.'], [89.1, 94.2, 'He wrote the fancy papers, and he shouted William’s name to the crowds.'],
  [96, 99.5, 'They also met Kate, a clever blacksmith.'], [99.5, 102.1, 'She made William new armor.'], [102.1, 106, 'It was light and fast, and it shone like the sun.'],
  [107.8, 110.7, 'William won again and again.'], [110.7, 113.7, 'But one knight did not like him.'], [113.7, 118.3, 'It was Count Adhemar, a proud and mean knight in black armor.'],
  [120.1, 123.6, 'In London, William went to find his father.'], [123.6, 127.3, 'His father was old now, and he could not see.'], [127.3, 130, 'But he knew his son’s voice.'],
  [130, 133.4, 'They hugged for a long, long time.'], [135.1, 138.8, 'But Count Adhemar told everyone the truth.'], [138.8, 142.6, '“He is not a noble! He is the son of a roofer!”'],
  [142.6, 145.5, 'The guards took William away.'], [145.5, 147.8, 'William did not run.'], [147.8, 151, 'He would not hide who he was anymore.'],
  [152.8, 155.5, 'Then a man came forward.'], [156, 157.5, 'It was the Prince!'], [157.5, 160.7, 'William had once been kind to him.'],
  [160.7, 164.3, '“This man is brave and true,” said the Prince.'], [164.3, 167.8, '“Kneel, William. Rise, Sir William!”'],
  [168, 174.9, 'In the last contest, Count Adhemar played a trick and hurt William’s shoulder.'], [174.9, 177.6, 'But William would not give up.'],
  [177.6, 182.2, 'He took off his armor, rode as fast as the wind, and won!'], [183.5, 186, 'Everyone cheered.'], [186, 188.6, 'His friends hugged him.'],
  [188.6, 190.9, 'His father was proud.'], [190.9, 193.8, 'William had changed his stars.'], [193.8, 196.8, 'And you can change yours too.'], [196.8, 199, 'The end.']];
const TOTAL = 199.2;
