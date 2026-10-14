// The people and horses of The Boy Who Changed His Stars, drawn like the old cartoon (big round heads, a bulb nose,
// simple bodies) in the illustrated style (kit.js). Every character faces right, turned three-quarters toward us,
// feet at (0, 0): the near arm hangs from the back shoulder and is drawn in front of the body, the far arm from the
// front shoulder behind it; the near leg is drawn over the far one; far limbs are darker. Things held are in the
// near hand and point the way the character faces.
//
// person(c, p, t, look) draws anyone. look: { skin, tunic, trouser, boot, hair, beard, hat, cape, apron, armor, kid,
// headR, body }. Pose p: { ph, walk (0..1), sit (0..1), armB / armF (near / far arm angle, + forward), bendB / bendF,
// hold(c, hx, hy, dir) for something in the near hand, mood, talk, blink, tilt (head up +), cape (radians back) }.
const SKIN = '#e0a878', SKIN_OLD = '#e2b48e';
const dark = (col, k = .22) => mixCol(col, '#140a10', k);
const LEG = 140, AMP = .42, STRIDE = LEG * AMP * 2 / Math.PI;
function person(c, p, t, look) {
  const kid = look.kid ? .66 : 1, g = legsPose(p), kn = p.kneel || 0, sit = Math.max(p.sit || 0, kn), leg = LEG * kid;
  const hipY = lerp(-leg - 10 * kid, -leg * .5, sit) + g.bob * 8 * kid, r = look.headR || 72;
  // cape, behind everything; it flares back while walking
  if (look.cape) { c.save(); c.translate(-6 * kid, hipY - 150 * kid); c.rotate((p.cape ?? .1) + .18 * g.w + Math.sin((p.ph || 0) * 2) * .05 * g.w + Math.sin(t * 1.8) * .02);
    c.beginPath(); c.moveTo(-10, 0); c.quadraticCurveTo(-60 * kid, 80 * kid, -64 * kid - 14 * g.w, 168 * kid * (1 - sit * .4)); c.quadraticCurveTo(-20, 176 * kid * (1 - sit * .4), 14, 150 * kid * (1 - sit * .4)); c.closePath(); fs(c, look.cape); c.restore(); }
  // far arm
  const elbow = a => lerp(-.12, .3 + Math.max(0, a) * .85, g.w), shF = g.shoulder(1, 16 * kid), shB = g.shoulder(-1, 16 * kid), shY = hipY - 140 * kid;
  const aF = p.armF ?? (g.arm(1) * .55 + .05 + sit * .5), [fx, fy, fd] = limb(c, shF, shY, 118 * kid, aF, 22 * kid, dark(look.armCol || look.tunic), p.bendF ?? (elbow(aF) + sit * .3));
  ell(c, fx, fy, 13 * kid); fs(c, dark(look.handCol || look.skin || SKIN, .18));
  // legs: the far leg first
  for (const s of [-1, 1]) {
    if (p.ride && s < 0) continue;   // riding: the far leg is behind the horse
    let a = g.leg(s) * AMP, b = g.knee(s) * .95; if (sit) { a = lerp(a, 1.45, sit); b = lerp(b, -1.45, sit); }
    if (kn && s < 0) { a = lerp(g.leg(s) * AMP, .05, kn); b = lerp(g.knee(s) * .95, -1.62, kn); }   // kneeling: the far knee on the ground, its shin flat behind
    if (p.ride) { a = .5 + Math.sin(t * 9) * .04 * (p.bounce || 0); b = -.32; }
    const hx = g.hip(s, 9 * kid) + (sit ? s * -4 : 0), [x, y] = limb(c, hx, hipY, leg, a, 26 * kid, s < 0 ? dark(look.trouser) : look.trouser, b);
    rr(c, x - 18 * kid, y - 16 * kid, 50 * kid, 22 * kid, 10 * kid); fs(c, s < 0 ? dark(look.boot) : look.boot);
  }
  // body: tunic (or armour), belt, apron
  const top = hipY - 150 * kid, bot = hipY + 12 * kid;
  c.beginPath(); c.moveTo(-32 * kid, top + 4); c.quadraticCurveTo(-42 * kid, (top + bot) / 2, -40 * kid, bot); c.quadraticCurveTo(2, bot + 10 * kid, 44 * kid, bot);
  c.quadraticCurveTo(46 * kid, (top + bot) / 2, 38 * kid, top + 4); c.quadraticCurveTo(4, top - 6, -32 * kid, top + 4); c.closePath();
  fs(c, look.armor ? lin(c, -40 * kid, 0, 46 * kid, 0, [[0, '#8c97a8'], [.4, '#eef3fa'], [.6, '#c3cddb'], [1, '#7b8698']]) : look.tunic);
  if (look.apron) { c.beginPath(); c.moveTo(-8 * kid, top + 30 * kid); c.lineTo(40 * kid, top + 30 * kid); c.lineTo(46 * kid, bot + 30 * kid); c.lineTo(-14 * kid, bot + 30 * kid); c.closePath(); fs(c, look.apron); }
  if (!look.armor && !look.robe) { rr(c, -41 * kid, bot - 40 * kid, 86 * kid, 12 * kid, 4); fs(c, look.belt || '#6b4a2a', 3); }
  if (look.armor) { ell(c, -6 * kid, top + 18 * kid, 30 * kid, 20 * kid); fs(c, '#c9d2de'); }
  if (look.robe) { rr(c, -40 * kid, top + 34 * kid, 86 * kid, 10 * kid, 4); fs(c, '#d9b04a', 3); }
  // head, tilting a little at the neck
  c.save(); c.translate(14 * kid, top - 4); c.rotate(-(p.tilt || 0)); c.translate(6 * kid, -r * kid * .92 + Math.sin((p.ph || 0) * 2) * 2 * g.w); c.scale(kid, kid);
  head(c, p, t, look, r);
  c.restore();
  // near arm, in front of the body, with whatever it holds
  const aB = p.armB ?? (g.arm(-1) * .55 - .05 + sit * .5), [hx, hy, hd] = limb(c, shB, shY, 118 * kid, aB, 22 * kid, look.armCol || (look.armor ? '#c3cddb' : look.tunic), p.bendB ?? (elbow(aB) + sit * .3));
  if (p.hold) p.hold(c, hx, hy, hd, t);
  ell(c, hx, hy, 13 * kid); fs(c, look.handCol || look.skin || SKIN);
}
function head(c, p, t, look, r) {
  if (look.hat === 'greathelm') return greatHelm(c, t, r, look.helm || ['#8c97a8', '#eef3fa', '#8a95a6'], look.plume || '#3a86d8');
  const hair = look.hair, skin = look.skin || SKIN;
  // hair behind the head
  if (hair === 'bob') { ell(c, -r * .42, r * .1, r * .55, r * .78); fs(c, look.hairCol || '#7b4a26'); }
  if (hair === 'long' || hair === 'white') { c.beginPath(); c.moveTo(-r * .2, -r * .9); c.quadraticCurveTo(-r * 1.15, -r * .4, -r * 1.0, r * 1.25); c.lineTo(-r * .35, r * 1.2); c.quadraticCurveTo(-r * .2, 0, -r * .2, -r * .9); fs(c, hair === 'white' ? '#eeeae2' : '#7b4a26'); }
  if (hair === 'bun') { ell(c, -r * .62, -r * .62, r * .32); fs(c, '#6b3a1e'); }
  if (look.hat === 'hood') { c.beginPath(); c.moveTo(-r * 1.05, r * .9); c.quadraticCurveTo(-r * 1.25, -r * 1.1, r * .2, -r * 1.12); c.quadraticCurveTo(r * 1.05, -r * 1.0, r * .95, -r * .3); c.lineTo(r * .5, -r * .5); c.quadraticCurveTo(-r * .5, -r * .6, -r * .5, r * .9); c.closePath(); fs(c, '#5a4a8a'); }
  ell(c, 0, 0, r, r * 1.02); fs(c, skin);
  ell(c, -r * .55, r * .1, r * .17, r * .23); fs(c, dark(skin, .12), 3);
  // hair on top
  const hc = look.hairCol || '#7b4a26';
  if (hair === 'bob' || hair === 'long' || hair === 'bun') { c.beginPath(); c.moveTo(-r * .98, r * .2); c.quadraticCurveTo(-r * 1.05, -r * 1.1, r * .1, -r * 1.08); c.quadraticCurveTo(r * .85, -r * 1.02, r * .95, -r * .45);
    for (let k = 0; k < 6; k++) c.quadraticCurveTo(r * (.8 - k * .2), -r * (.55 - (k % 2) * .12), r * (.7 - k * .22), -r * .42 + (k % 2) * r * .05);
    c.quadraticCurveTo(-r * .5, -r * .4, -r * .62, r * .35); c.closePath(); fs(c, hair === 'bun' ? '#6b3a1e' : hc); }
  if (hair === 'red') { c.beginPath(); c.moveTo(-r * .98, r * .1); for (let k = 0; k <= 10; k++) { const a = Math.PI * (1.05 + k * .09), rr2 = r * (k % 2 ? 1.18 : 1.02); c.lineTo(Math.cos(a) * rr2, Math.sin(a) * rr2 - r * .05); }
    c.quadraticCurveTo(r * .2, -r * .45, -r * .55, r * .3); c.closePath(); fs(c, '#e2642a'); }
  if (hair === 'white') { c.beginPath(); c.moveTo(-r * .98, r * .2); c.quadraticCurveTo(-r * 1.0, -r * 1.05, r * .1, -r * 1.06); c.quadraticCurveTo(r * .7, -r * 1.0, r * .8, -r * .6); c.quadraticCurveTo(-r * .2, -r * .6, -r * .55, r * .3); c.closePath(); fs(c, '#eeeae2'); }
  if (hair === 'black') { c.beginPath(); c.moveTo(-r * 1.02, r * .25); c.quadraticCurveTo(-r * 1.1, -r * 1.12, r * .1, -r * 1.1); c.quadraticCurveTo(r * .95, -r * 1.05, r * .98, -r * .25); c.lineTo(r * .4, -r * .32); c.quadraticCurveTo(-r * .4, -r * .4, -r * .6, r * .3); c.closePath(); fs(c, '#23202c'); }
  if (hair === 'bald') { ell(c, -r * .15, -r * .62, r * .28, r * .12, -.3); c.fillStyle = 'rgba(255,255,255,.35)'; c.fill(); }
  // face
  const eyesAt = [[r * .3, -r * .08, r * .2], [r * .64, -r * .08, r * .19]];
  if (!(look.hat === 'guard')) eyes(c, eyesAt, { ...p, lidCol: dark(skin, .1) });
  ell(c, r * .3, r * .38, r * .2, r * .13); c.fillStyle = 'rgba(235,110,100,.4)'; c.fill();
  if (look.beard) { c.beginPath(); c.moveTo(-r * .5, r * .05); c.quadraticCurveTo(-r * .55, r * 1.3, r * .4, r * 1.25); c.quadraticCurveTo(r * 1.0, r * 1.05, r * .92, r * .45);
    c.quadraticCurveTo(r * .55, r * .62, r * .3, r * .55); c.quadraticCurveTo(0, r * .3, -r * .5, r * .05); c.closePath(); fs(c, look.beard); }
  mouth(c, r * .62, r * .46, r * .2, p);
  if (look.mustache) { c.beginPath(); c.moveTo(r * .9, r * .28); c.quadraticCurveTo(r * .4, r * .22, r * .05, r * .52); c.quadraticCurveTo(r * .5, r * .42, r * .9, r * .38); c.closePath(); fs(c, '#1e1a22', 3); }
  ell(c, r * .9, r * .18, r * .2, r * .19); fs(c, look.nose || '#e88e72', 3);
  // hats
  if (look.hat === 'helmet' || look.hat === 'guard') { c.beginPath(); c.moveTo(-r * 1.04, r * .15); c.quadraticCurveTo(-r * 1.1, -r * 1.15, r * .1, -r * 1.12); c.quadraticCurveTo(r * 1.05, -r * 1.05, r * 1.02, -r * .2);
    c.lineTo(r * .95, look.hat === 'guard' ? r * .02 : -r * .3); c.quadraticCurveTo(0, look.hat === 'guard' ? 0 : -r * .4, -r * .7, r * .3); c.closePath(); fs(c, lin(c, -r, 0, r, 0, [[0, '#8c97a8'], [.45, '#eef3fa'], [1, '#8a95a6']]));
    if (look.hat === 'guard') { rr(c, r * .1, -r * .2, r * .9, r * .1, 3); fs(c, '#4a5060', 2); }
    else { c.beginPath(); c.moveTo(-r * .2, -r * 1.08); c.bezierCurveTo(-r * .6, -r * 1.7, -r * 1.2, -r * 1.5, -r * 1.35 + Math.sin(t * 5) * 4, -r * 1.2); c.quadraticCurveTo(-r * .9, -r * 1.3, -r * .5, -r * .95); c.closePath(); fs(c, '#3a86d8'); } }
  if (look.hat === 'crown') { c.beginPath(); c.moveTo(-r * .55, -r * .82); for (const [x, y] of [[-r * .62, -r * 1.35], [-r * .3, -r * 1.05], [0, -r * 1.45], [r * .3, -r * 1.05], [r * .62, -r * 1.35], [r * .55, -r * .82]]) c.lineTo(x, y); c.closePath(); fs(c, '#f2c23a');
    ell(c, 0, -r * 1.0, r * .08); fs(c, '#e2443a', 2); }
  if (look.hat === 'feather') { c.beginPath(); c.moveTo(-r * 1.0, -r * .2); c.quadraticCurveTo(-r * .95, -r * 1.15, r * .1, -r * 1.1); c.quadraticCurveTo(r * .95, -r * 1.0, r * 1.0, -r * .3); c.quadraticCurveTo(0, -r * .5, -r * 1.0, -r * .2); fs(c, '#3a8a4a');
    c.beginPath(); c.moveTo(-r * .3, -r * 1.0); c.bezierCurveTo(-r * .6, -r * 1.9, -r * 1.3, -r * 2.2, -r * 1.7 + Math.sin(t * 4) * 5, -r * 2.3); c.quadraticCurveTo(-r * 1.0, -r * 1.6, -r * .6, -r * .9); c.closePath(); fs(c, '#f08a2a'); }
}
// a closed jousting helm that covers the whole head, like the knights in the arena: a visor slit facing forward,
// breathing holes, a ridge down the front and a plume streaming back
function greatHelm(c, t, r, [dk, li, md], plume) {
  c.beginPath(); c.moveTo(-r * 1.0, r * .8); c.lineTo(-r * 1.06, -r * .35); c.quadraticCurveTo(-r * .95, -r * 1.2, r * .05, -r * 1.2);
  c.quadraticCurveTo(r * 1.05, -r * 1.18, r * 1.1, -r * .3); c.lineTo(r * 1.12, r * .55); c.quadraticCurveTo(r * .2, r * 1.0, -r * 1.0, r * .8); c.closePath();
  fs(c, lin(c, -r, 0, r * 1.1, 0, [[0, dk], [.55, li], [1, md]]));
  c.beginPath(); c.moveTo(r * .62, -r * 1.12); c.quadraticCurveTo(r * .78, -r * .3, r * .7, r * .78); ink(c, 3, 'rgba(30,30,40,.35)');
  c.beginPath(); c.roundRect(-r * .05, -r * .22, r * 1.17, r * .17, r * .06); c.fillStyle = '#14121a'; c.fill();   // the visor slit
  c.fillStyle = 'rgba(20,18,26,.75)'; for (let i = 0; i < 3; i++) for (let k = 0; k < 2; k++) { ell(c, r * (.82 + k * .14), r * (.2 + i * .14), r * .04); c.fill(); }
  c.beginPath(); c.moveTo(-r * .2, -r * 1.15); c.bezierCurveTo(-r * .7, -r * 1.75, -r * 1.3, -r * 1.55, -r * 1.5 + Math.sin(t * 5) * 5, -r * 1.15);
  c.quadraticCurveTo(-r * 1.0, -r * 1.3, -r * .55, -r * 1.0); c.closePath(); fs(c, plume);
}
// the cast
const LOOKS = {
  willKid: { kid: true, tunic: '#3a76c8', trouser: '#5e3c27', boot: '#4a2c18', hair: 'bob' },
  will: { tunic: '#3a76c8', trouser: '#5e3c27', boot: '#4a2c18', hair: 'bob', cape: '#7a3a24' },
  willArmor: { armor: true, tunic: '#c3cddb', trouser: '#9aa4b4', boot: '#6a7486', hair: 'bob', hat: 'greathelm', handCol: '#c9d2de' },   // in the arena
  willArmorOpen: { armor: true, tunic: '#c3cddb', trouser: '#9aa4b4', boot: '#6a7486', hair: 'bob', hat: 'helmet', handCol: '#c9d2de' },   // his face showing
  father: { tunic: '#2f4a7a', trouser: '#5e3c27', boot: '#3a2414', hair: 'long', beard: '#6b3e1e' },
  fatherOld: { tunic: '#6b8a5a', trouser: '#5e4a34', boot: '#3a2414', hair: 'white', beard: '#f2efe8', skin: SKIN_OLD },
  roland: { tunic: '#4aa04a', trouser: '#5e3c27', boot: '#3a2414', hair: 'bald', skin: '#d29a6a' },
  wat: { tunic: '#e8842a', trouser: '#6b4428', boot: '#3a2414', hair: 'red', headR: 66, body: .9 },
  oldKnight: { tunic: '#b8bcc8', trouser: '#8a8e9a', boot: '#4a4a52', hair: 'bald', beard: '#f2efe8', skin: SKIN_OLD },
  geoff: { tunic: '#4a9a4a', trouser: '#5e3c27', boot: '#3a2414', hair: 'bob', hairCol: '#c9a24a', hat: 'feather' },
  kate: { tunic: '#8a4ab8', trouser: '#5e3c27', boot: '#3a2414', hair: 'bun', apron: '#6b4a2e' },
  adhemar: { tunic: '#2a2834', trouser: '#2a2834', boot: '#16141c', hair: 'black', mustache: true, cape: '#7a2a5a', armCol: '#33313e', handCol: '#9aa0b0' },
  princeHood: { tunic: '#f2ead6', trouser: '#5e3c27', boot: '#3a2414', hair: 'bob', hat: 'hood', cape: '#5a4a8a', robe: true },
  prince: { tunic: '#f2ead6', trouser: '#5e3c27', boot: '#3a2414', hair: 'bob', hat: 'crown', cape: '#c8382e', robe: true },
  guard: { tunic: '#9aa2b2', trouser: '#7a8292', boot: '#3a3a44', hair: 'none', hat: 'guard', armor: true },
};
// a named function per character, so each acts separately and casts its own light
const cast = {};
for (const [n, look] of Object.entries(LOOKS)) cast[n] = ({ [n]: (c, p, t) => person(c, p, t, look) })[n];
const STR = n => STRIDE * (LOOKS[n].kid ? .66 : 1);   // foot travel per radian of the walk, for stepPh

// held things: a hammer, a lance, a sword, a bread loaf
const hammer = (c, x, y, d, t) => { c.save(); c.translate(x, y); c.rotate(Math.atan2(d[1], d[0]) - Math.PI / 2 - .4); rr(c, -4, -10, 8, 70, 3); fs(c, '#8a5a32', 3); rr(c, -16, 52, 32, 22, 4); fs(c, '#7a8292', 3); c.restore(); };
const lance = (ang = -.05) => (c, x, y) => { c.save(); c.translate(x, y); c.rotate(ang);
  c.beginPath(); c.moveTo(-60, -7); c.lineTo(420, -2); c.lineTo(420, 2); c.lineTo(-60, 7); c.closePath(); fs(c, '#f2c23a', 3);
  for (let k = 0; k < 5; k++) { c.beginPath(); c.rect(-40 + k * 90, -6, 26, 12); c.fillStyle = '#3a76c8'; c.fill(); }
  c.beginPath(); c.moveTo(0, -18); c.lineTo(40, -6); c.lineTo(40, 6); c.lineTo(0, 18); c.closePath(); fs(c, '#c3cddb', 3); c.restore(); };
const sword = ang => (c, x, y) => { c.save(); c.translate(x, y); c.rotate(ang); rr(c, -4, -8, 8, 24, 3); fs(c, '#8a5a32', 3); rr(c, -18, -12, 36, 6, 3); fs(c, '#f2c23a', 3);
  c.beginPath(); c.moveTo(-5, -12); c.lineTo(-4, -230); c.lineTo(0, -246); c.lineTo(4, -230); c.lineTo(5, -12); c.closePath(); fs(c, '#e8eef6', 3); c.restore(); };

// ---------- horses ----------
// horse(c, p, t): { coat, mane, cloth (caparison), trim, ph (gallop phase, from distance), run (0..1), rider: [fn, pose] }
const HSTRIDE = 62;
function horse(c, p, t) {
  const run = p.run ?? 0, ph = p.ph || 0, bob = Math.sin(ph * 2) * 8 * run, coat = p.coat || '#f2f2f6', far = dark(coat, .2);
  const legs = [[-118, 0, true], [92, .5, true], [-96, .25, false], [116, .75, false]];   // far pair first; a gallop staggers them
  c.save(); c.translate(0, -bob);
  for (const [x, o, isFar] of legs.slice(0, 2)) hleg(c, x, ph, o, run, isFar ? far : coat);
  // tail
  c.beginPath(); c.moveTo(-160, -268); c.bezierCurveTo(-230, -250 + Math.sin(t * 3) * 10, -250, -170 - run * 40, -232 - run * 50, -120 - run * 40);
  c.quadraticCurveTo(-210, -200, -150, -238); c.closePath(); fs(c, p.mane || '#e8e0d0');
  // neck and head, nodding with the stride
  const nod = Math.sin(ph * 2 + .6) * .06 * run;
  c.save(); c.translate(120, -300); c.rotate(nod);
  c.beginPath(); c.moveTo(-30, 40); c.quadraticCurveTo(10, -60, 60, -110); c.lineTo(110, -90); c.quadraticCurveTo(50, -20, 40, 50); c.closePath(); fs(c, coat);
  c.beginPath(); c.moveTo(56, -126); c.quadraticCurveTo(110, -150, 168, -96); c.quadraticCurveTo(178, -70, 150, -64); c.quadraticCurveTo(120, -70, 96, -76); c.quadraticCurveTo(66, -84, 56, -126); fs(c, coat);
  c.beginPath(); c.moveTo(66, -130); c.lineTo(72, -156); c.lineTo(84, -128); fs(c, coat, 3);
  ell(c, 108, -112, 8, 9); c.fillStyle = '#1a1210'; c.fill(); ell(c, 110, -115, 2.5); c.fillStyle = '#fff'; c.fill();
  ell(c, 160, -78, 4, 3); c.fillStyle = '#5a4a44'; c.fill();
  c.beginPath(); c.moveTo(40, -118); for (let k = 0; k < 6; k++) c.quadraticCurveTo(10 - k * 10 + Math.sin(t * 4 + k) * 3 * (1 + run), -100 + k * 26, 0 - k * 8, -90 + k * 26); c.lineTo(-30, 40); c.lineTo(-10, 30); c.closePath(); fs(c, p.mane || '#e8e0d0');
  c.restore();
  // body with its cloth
  ell(c, -10, -270, 168, 70); fs(c, coat);
  if (p.cloth) { c.beginPath(); c.moveTo(-170, -300); c.quadraticCurveTo(-10, -340, 150, -300); c.lineTo(156, -200);
    for (let k = 0; k <= 8; k++) c.quadraticCurveTo(150 - k * 40 + 20, -186 + Math.sin(t * 6 + k) * 3 * run, 136 - k * 40, -196); c.closePath(); fs(c, p.cloth);
    c.beginPath(); c.moveTo(-172, -212); c.lineTo(158, -212); c.lineWidth = 10; c.strokeStyle = p.trim || '#f2c23a'; c.stroke();
    for (let k = 0; k < 6; k++) { ell(c, -130 + k * 52, -250, 9); c.fillStyle = p.trim || '#f2c23a'; c.fill(); } }
  // the rider, astride
  if (p.rider) { const [fn, rp] = p.rider; c.save(); c.translate(-14, -262 - bob * .3); c.rotate(rp.jolt || 0); fn(c, { sit: 1, ride: true, ...rp, __face: p.__face }, t); c.restore(); }
  for (const [x, o, isFar] of legs.slice(2)) hleg(c, x, ph, o, run, coat);
  c.restore();
}
function hleg(c, x, ph, o, run, col) {   // a leg swings forward with the knee bent, then pushes back straight
  const s = Math.sin(ph + o * TAU), k = Math.cos(ph + o * TAU), a = s * .55 * run, b = -Math.max(0, k) * 1.1 * run;
  const [hx, hy, d] = limb(c, x, -238, 200, a, 30, col, b);
  rr(c, hx - 16, hy - 10, 34, 16, 5); fs(c, '#4a3a34', 3);
}

// ---------- crowds in the stands ----------
const CROWD_COLS = ['#e2443a', '#3a86d8', '#f2c23a', '#4aa04a', '#8a4ab8', '#e8842a', '#2ab8b0', '#e86a9a'];
function stands(c, t, y0, rows = 4, cheer = 0, x0 = -100, x1 = W + 100, s = 1) {
  c.fillStyle = '#8a5a3a'; c.fillRect(x0, y0 - 30 * s, x1 - x0, rows * 46 * s + 60 * s);
  for (let r = 0; r < rows; r++) for (let i = 0; x0 + i * 36 * s < x1; i++) {
    const x = x0 + i * 36 * s + (r % 2) * 18 * s, y = y0 + r * 46 * s, k = hash(i, r), j = cheer * Math.abs(Math.sin(t * (6 + k * 4) + k * 9)) * 10 * s;
    c.fillStyle = CROWD_COLS[Math.floor(k * 8)]; rr(c, x - 14 * s, y - j, 28 * s, 40 * s, 10 * s); c.fill();
    ell(c, x, y - 14 * s - j, 12 * s); c.fillStyle = ['#e0a878', '#c4885a', '#f2c8a0', '#8a5a3a'][Math.floor(hash(i, r + 9) * 4)]; c.fill();
    if (cheer > .5 && k > .5) { c.strokeStyle = CROWD_COLS[Math.floor(k * 8)]; c.lineWidth = 6 * s; c.lineCap = 'round'; c.beginPath(); c.moveTo(x - 10 * s, y - j); c.lineTo(x - 18 * s, y - 34 * s - j); c.moveTo(x + 10 * s, y - j); c.lineTo(x + 18 * s, y - 34 * s - j); c.stroke(); }
  }
}
