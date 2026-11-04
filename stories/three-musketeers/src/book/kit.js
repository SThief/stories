// Bold modern picture-book kit for The Three Musketeers book (pages 1100x1100).
// Big round heads (~2 heads tall), no outlines, flat colour blocks with one darker crescent for shade,
// grain. Characters face right in local coords (feet at 0,0), turned three-quarters; f = -1 mirrors.
// Order: cape, back hair, far leg, far arm (darker, behind), near leg, body, scabbard, head, near arm LAST.
const W = 1100, H = 1100, cv = document.getElementById('c'); let c = cv.getContext('2d');
const S = Math.sin, C = Math.cos, PI = Math.PI, clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), lerp = (a, b, u) => a + (b - a) * u;
function dark(hex, k = .78) { const n = parseInt(hex.slice(1), 16); const f = v => Math.round(v * k).toString(16).padStart(2, '0'); return '#' + f(n >> 16 & 255) + f(n >> 8 & 255) + f(n & 255); }
function mixc(a, b, k) { const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16); return '#' + [16, 8, 0].map(s => Math.round(lerp((A >> s) & 255, (B >> s) & 255, k)).toString(16).padStart(2, '0')).join(''); }
function rng(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const NOISE = (() => { const k = document.createElement('canvas'); k.width = W; k.height = H; const x = k.getContext('2d'), d = x.createImageData(W, H); for (let i = 0; i < d.data.length; i += 4) { const v = 128 + (Math.random() - .5) * 120; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; } x.putImageData(d, 0, 0); return k; })();
let FX = 1;
const P = { head: 42, torso: 46, leg: 46, arm: 23, sh: 15, cres: 10, shade: .33 };
const INK = '#2A1A1A';
function fsh(fn, col, opt = {}) {   // flat fill + darker crescent away from the light (upper left)
  c.save(); c.beginPath(); fn(); c.fillStyle = col; c.fill();
  if (!opt.flat) { c.clip(); c.fillStyle = dark(col, 1 - (opt.shade ?? P.shade)); c.fillRect(-4000, -4000, 8000, 8000); const k = opt.cres ?? P.cres; c.translate(-k * FX, -k); c.beginPath(); fn(); c.fillStyle = col; c.fill(); }
  c.restore();
}
function line(fn, w = 2.5, col = INK) { c.beginPath(); fn(); c.lineWidth = w; c.strokeStyle = col; c.lineCap = 'round'; c.lineJoin = 'round'; c.stroke(); }
function capsule(p, q, w1, w2) { const a = Math.atan2(q[1] - p[1], q[0] - p[0]); return () => { c.arc(p[0], p[1], w1, a + PI / 2, a + 3 * PI / 2); c.arc(q[0], q[1], w2, a - PI / 2, a + PI / 2); c.closePath(); }; }
const circ = (x, y, r) => () => c.arc(x, y, r, 0, 2 * PI), ellp = (x, y, rx, ry, rot = 0) => () => c.ellipse(x, y, Math.abs(rx), Math.abs(ry), rot, 0, 2 * PI);
const rect = (x, y, w, h, r = 0) => () => c.roundRect(x, y, w, h, r);
function poly(pts) { return () => { c.moveTo(...pts[0]); for (const p of pts.slice(1)) c.lineTo(...p); c.closePath(); }; }
function ik(h, f, l1, l2, pref) {
  let dx = f[0] - h[0], dy = f[1] - h[1], d = Math.hypot(dx, dy); const mx = l1 + l2 - .5; if (d > mx) { f = [h[0] + dx / d * mx, h[1] + dy / d * mx]; d = mx; }
  const a = Math.atan2(f[1] - h[1], f[0] - h[0]), b = Math.acos(clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1));
  const k1 = [h[0] + l1 * C(a + b), h[1] + l1 * S(a + b)], k2 = [h[0] + l1 * C(a - b), h[1] + l1 * S(a - b)];
  return (k1[0] - k2[0]) * pref[0] + (k1[1] - k2[1]) * pref[1] > 0 ? k1 : k2;
}

// ---------- the cast (checked against the novel: see cast-notes.md) ----------
const MUSK = { coat: '#2F5FB8', tab: true, cape: '#1E3E8A', breeches: '#3A3550', boots: '#6B4226', hat: '#2A2F55', man: true, sword: true };
const CAST = {
  dart: { skin: '#F5CDA6', hair: '#6B3E1F', hairLen: .45, pony: true, coat: '#D9782E', cape: '#8A4A22', breeches: '#3A3550', boots: '#6B4226', hat: '#5A3B24', plume: '#F2C14E', man: true, sword: true },
  dartBlue: { ...MUSK, skin: '#F5CDA6', hair: '#6B3E1F', hairLen: .45, pony: true, plume: '#F2C14E' },
  athos: { ...MUSK, skin: '#EFC6A0', hair: '#2A2028', hairLen: 1, plume: '#F4F1EA', moustache: 'full', beardCol: '#2A2028' },
  porthos: { ...MUSK, skin: '#F2C29A', hair: '#B5532A', hairLen: 1, plume: '#EF6F8E', moustache: 'curl', beardCol: '#9E4422', baldric: '#E8B53A', big: 1.15, cape: '#B3263A' },
  aramis: { ...MUSK, skin: '#F6D0AE', hair: '#3A2418', hairLen: 1, plume: '#5CBF8A', moustache: 'thin', beardCol: '#3A2418', rosy: true },
  treville: { ...MUSK, skin: '#EBC09A', hair: '#E6E4E2', hairLen: .7, plume: '#F4F1EA', moustache: 'big', goatee: true, beardCol: '#E6E4E2', cape: '#1E3E8A', big: 1.05, sash: '#E8B53A' },
  guard: { skin: '#EFC6A0', hair: '#3A2A20', hairLen: .5, coat: '#C8323A', tab: true, cape: '#7E1F2A', breeches: '#2A2230', boots: '#2A1F1A', hat: '#2A2230', plume: '#2A2230', moustache: 'full', beardCol: '#3A2A20', man: true, sword: true },
  dad: { skin: '#F0C49C', hair: '#E6E4E2', hairLen: .4, coat: '#6E8F4D', breeches: '#5A4632', boots: '#5B3A20', hat: '#4A3A2A', moustache: 'full', goatee: true, beardCol: '#E6E4E2', man: true },
  mum: { skin: '#F4CCA6', hair: '#E2DED8', gown: '#E68FB3', bodice: '#EE9FC0', cap: '#FFFFFF', apron: '#FBF7EE' },
  king: { skin: '#F2C9A4', hair: '#2E2018', hairLen: 1.3, coat: '#2B56B0', trim: '#F2C14E', ermine: true, breeches: '#2B56B0', stockings: '#F3EFE6', shoes: '#2A2230', crown: true, moustache: 'thin', goatee: true, beardCol: '#2E2018', man: true },
  card: { skin: '#EEC4A0', hair: '#E6E4E2', hairLen: .45, robe: '#C42F38', mozzetta: '#B0242E', skullcap: '#C42F38', moustache: 'full', goatee: true, beardCol: '#E6E4E2', man: true },
  queen: { skin: '#F6D2B4', hair: '#A0522D', gown: '#7E4FC0', bodice: '#9467D6', tiara: true, studs: true, lashes: true },
  cons: { skin: '#F5CFAE', hair: '#3A2418', gown: '#3FA5A5', bodice: '#52B8B8', cap: '#FFFFFF', apron: '#F6F1E6', lashes: true },
  milady: { skin: '#F8DCC4', hair: '#F2C75A', gown: '#2E2A44', bodice: '#3A3557', lashes: true, sly: true },
  buck: { skin: '#F2CBA6', hair: '#4A2E1E', hairLen: 1, coat: '#7A3FA8', trim: '#F2E2B0', cape: '#4E2A70', breeches: '#7A3FA8', stockings: '#F3EFE6', shoes: '#2A2230', moustache: 'thin', goatee: true, beardCol: '#4A2E1E', man: true, pearls: true },
  jeweler: { skin: '#EEC6A2', hair: '#EEECEA', hairLen: .35, bald: true, coat: '#6F6A5A', apron: '#9A6B3E', breeches: '#4A4038', boots: '#4A3426', moustache: 'full', beardCol: '#EEECEA', glasses: true, man: true },
};
// o: x, y, s, f, near/far (hand target, local coords) + nearPref/farPref (elbow direction), stance, mood,
// sword {hand, tip}, hold/holdN (fn(hand)), hat (false = no hat), lean, ride (sitting astride), look
function figure(who, o) {
  const k = CAST[who], f = o.f || 1, s = (o.s || 1) * (k.big || 1);
  c.save(); c.translate(o.x, o.y); c.scale(f * s, s); FX = f;
  if (o.lean) { c.translate(0, -P.leg); c.rotate(o.lean); c.translate(0, P.leg); }
  const bw = P.sh * (k.big ? 1.25 : 1), hip = o.ride ? 0 : -P.leg, shY = hip - P.torso, hx = 2, hy = shY - P.head * .92, R = P.head;
  const shN = [-bw * .7, shY + 6], shF = [bw * .8, shY + 6], st = o.stance ?? .3;
  // cape / ermine behind
  if (k.cape) fsh(() => { c.moveTo(-bw, shY + 2); c.lineTo(bw * .7, shY + 2); c.lineTo(bw * .5, hip + 6); c.quadraticCurveTo(-bw * 1.4, hip + 14, -bw * 1.9 - (o.flutter || 0) * 14, hip - 4); c.closePath(); }, k.cape);
  if (k.ermine) { fsh(() => { c.moveTo(-bw * 1.1, shY); c.lineTo(bw * .6, shY); c.lineTo(bw * .3, -2); c.lineTo(-bw * 2.4, -2); c.closePath(); }, '#F6F2EA'); c.fillStyle = '#2A2028'; for (let i = 0; i < 6; i++) c.fillRect(-bw * 1.9 + (i % 3) * bw * .6, shY + 24 + Math.floor(i / 3) * 34 + (i % 2) * 10, 3, 7); fsh(() => { c.moveTo(-bw * 1.05, shY); c.lineTo(-bw * .4, shY); c.lineTo(-bw * 1.2, -4); c.lineTo(-bw * 2.3, -4); c.closePath(); }, '#B0242E'); }
  // back hair (men: shoulder-length where the story gives it; the queen etc: a bun)
  if (!k.gown && k.hairLen && !k.bald) { const L = k.hairLen; fsh(() => { c.moveTo(hx - R * .2, hy - R * .9); c.quadraticCurveTo(hx - R * 1.25, hy - R * .6, hx - R * 1.05, hy + R * (.3 + .6 * L)); c.quadraticCurveTo(hx - R * .6, hy + R * (.5 + .6 * L), hx - R * .2, hy + R * .5); c.closePath(); }, k.hair); }
  if (k.pony) fsh(ellp(hx - R * 1.0, hy + R * .45, R * .2, R * .34, .5), k.hair);
  if (k.gown && !k.cap) { fsh(circ(hx - R * .6, hy - R * .55, R * .42), k.hair); if (k.hair === '#F2C75A' || k.sly) fsh(() => { c.moveTo(hx - R * .5, hy - R * .3); c.quadraticCurveTo(hx - R * 1.3, hy + R * .4, hx - R * .9, hy + R * 1.2); c.quadraticCurveTo(hx - R * .5, hy + R * .9, hx - R * .2, hy + R * .4); c.closePath(); }, k.hair); }
  // legs
  const legs = [];
  const lw = P.leg * .11 * (k.big ? 1.2 : 1);
  if (!k.gown && !k.robe) {
    if (o.ride) legs.push(null, () => { const kn = [P.leg * .55, 10], ft = [P.leg * .35, P.leg * .8]; fsh(capsule([-bw * .2, 0], kn, lw * 1.15, lw), k.breeches); fsh(capsule(kn, ft, lw * 1.2, lw * .9), k.boots || k.stockings); fsh(ellp(ft[0] + lw, ft[1] + 2, lw * 1.7, lw * .8), k.boots || k.shoes); });
    else for (const side of ['far', 'near']) {
      const off = o.legs ? o.legs[side === 'near' ? 0 : 1] : (side === 'near' ? -P.leg * st * .5 : P.leg * st * .5);
      const foot = Array.isArray(off) ? off : [off, -4], hipP = [side === 'near' ? -bw * .35 : bw * .35, hip];
      const dL = Math.hypot(foot[0] - hipP[0], foot[1] - hipP[1]), legL = Math.max(dL * .505, P.leg * .5), knee = ik(hipP, foot, legL, legL, [1, 0]);
      const dk = side === 'far' ? .82 : 1;
      legs.push(() => {
        fsh(capsule(hipP, knee, lw * 1.15, lw), dark(k.breeches, dk));
        if (k.stockings) { fsh(capsule(knee, [foot[0], foot[1] - 2], lw * .8, lw * .7), dark(k.stockings, dk)); fsh(ellp(foot[0] + lw, foot[1], lw * 1.5, lw * .7), dark(k.shoes, dk)); }
        else { fsh(capsule([knee[0], knee[1] - 2], [foot[0], foot[1] - 2], lw * 1.25, lw * .9), dark(k.boots, dk)); fsh(ellp(foot[0] + lw * 1.2, foot[1], lw * 1.8, lw * .8), dark(k.boots, dk * .9)); }
      });
    }
  }
  // arms
  const aw = P.arm * .22, armL = P.arm;
  const reach = (sh, t, pref) => { const d = Math.hypot(t[0] - sh[0], t[1] - sh[1]), h = d > armL * 2 - .5 ? [sh[0] + (t[0] - sh[0]) / d * (armL * 2 - .5), sh[1] + (t[1] - sh[1]) / d * (armL * 2 - .5)] : t; return [ik(sh, h, armL, armL, pref), h]; };
  const sleeve = k.coat || k.robe || k.bodice;
  const drawArm = (sh, t, pref, col, skin) => { const [e, h] = reach(sh, t, pref); fsh(capsule(sh, e, aw * 1.15, aw), col); fsh(capsule(e, h, aw, aw * .85), col); if (k.man && !k.robe) fsh(circ(e[0] + (h[0] - e[0]) * .85, e[1] + (h[1] - e[1]) * .85, aw * .95), '#F6F2EA'); fsh(circ(h[0] + (h[0] - e[0]) * .12, h[1] + (h[1] - e[1]) * .12, aw * 1.05), skin); return h; };
  const restN = [shN[0] - 2, shN[1] + armL * 1.9], restF = [shF[0] + 4, shF[1] + armL * 1.9];
  if (legs[0]) legs[0]();
  const fh = drawArm(shF, o.far || restF, o.farPref || [0, 1], dark(sleeve, .8), dark(k.skin, .9));
  if (o.sword && o.sword.hand === 'far') sword(fh, o.sword.tip);
  if (o.hold) o.hold(fh);
  if (legs[1]) legs[1]();
  // body
  if (k.gown) {
    fsh(() => { c.moveTo(-bw * .9, hip + 4); c.quadraticCurveTo(-bw * 2.4, -20, -bw * 2.9, -2); c.lineTo(bw * 2.9, -2); c.quadraticCurveTo(bw * 2.4, -20, bw * .9, hip + 4); c.closePath(); }, k.gown);
    if (k.apron) fsh(poly([[-bw * .2, hip + 6], [bw * 1.1, hip + 6], [bw * 1.7, -12], [bw * .1, -12]]), k.apron);
    fsh(poly([[-bw * .85, shY + 2], [bw * .9, shY + 2], [bw * .75, hip + 8], [-bw * .7, hip + 8]]), k.bodice);
    fsh(() => { c.moveTo(-bw * .6, shY + 2); c.quadraticCurveTo(bw * .1, shY + 16, bw * .75, shY + 2); c.closePath(); }, k.skin, { flat: true });
    if (k.studs) studsBow(-bw * .5, shY + 8, o.lit ?? 12);
  } else if (k.robe) {
    fsh(poly([[-bw, shY + 2], [bw * .95, shY + 2], [bw * 1.5, -2], [-bw * 1.6, -2]]), k.robe);
    fsh(poly([[-bw * 1.15, shY], [bw * 1.05, shY], [bw * 1.25, shY + P.torso * .55], [-bw * 1.35, shY + P.torso * .55]]), k.mozzetta);
    for (let i = 0; i < 4; i++) fsh(circ(bw * .25, shY + P.torso * .7 + i * P.torso * .24, 2.6), INK, { flat: true });
    fsh(() => { c.moveTo(-bw * .5, shY); c.quadraticCurveTo(bw * .1, shY + 10, bw * .7, shY); c.lineTo(bw * .4, shY - 4); c.lineTo(-bw * .3, shY - 4); c.closePath(); }, '#FFFFFF', { flat: true });
  } else {
    fsh(poly([[-bw, shY + 2], [bw * .95, shY + 2], [bw * 1.05, hip + 16], [-bw * 1.1, hip + 16]]), k.coat);
    if (k.apron) fsh(poly([[-bw * .3, shY + 14], [bw * 1.0, shY + 14], [bw * 1.15, hip + 18], [-bw * .25, hip + 18]]), k.apron);
    if (k.tab) { fsh(poly([[-bw * .4, shY + 4], [bw * .85, shY + 4], [bw * .8, hip + 14], [-bw * .35, hip + 14]]), mixc(k.coat, '#ffffff', .06), { flat: true }); c.fillStyle = k.coat === '#C8323A' ? '#F4E6C8' : '#FFFFFF'; const cx = bw * .22, cy = shY + P.torso * .45; c.fillRect(cx - 3.5, cy - P.torso * .25, 7, P.torso * .52); c.fillRect(cx - P.torso * .16, cy - 3.5, P.torso * .32, 7); }
    if (k.trim) { c.fillStyle = k.trim; c.fillRect(bw * .12, shY + 4, 5, P.torso + 10); for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(-bw * .35, shY + 14 + i * P.torso * .26, 2.8, 0, 2 * PI); c.fill(); } }
    if (k.pearls) for (let i = 0; i < 7; i++) fsh(circ(-bw * .5 + i * bw * .22, shY + 10 + S(i / 6 * PI) * 8, 2.4), '#FFFFFF', { flat: true });
    if (k.sash) fsh(poly([[-bw * .9, shY + 6], [-bw * .5, shY + 2], [bw * 1.0, hip + 6], [bw * .6, hip + 12]]), k.sash);
    fsh(rect(-bw * 1.08, hip - 4, bw * 2.12, P.torso * .12), '#5A3A22', { flat: true });
    if (k.baldric) fsh(poly([[-bw * .9, shY + 4], [-bw * .45, shY + 2], [bw * 1.0, hip + 2], [bw * .6, hip + 6]]), k.baldric);
    fsh(poly([[-bw * .6, shY], [bw * .7, shY], [bw * .5, shY + 9], [-bw * .4, shY + 9]]), '#F6F2EA', { flat: true });
    if (k.sword && !o.ride) { fsh(capsule([-bw * .6, hip], [-bw * 2.4, -P.leg * .3], 3.4, 2.8), '#5A3A22', { flat: true }); if (!o.sword) fsh(circ(-bw * .5, hip - 3, 4.5), '#E8B53A', { flat: true }); }
  }
  head(k, hx, hy, R, o);
  const nh = drawArm(shN, o.near || restN, o.nearPref || [0, 1], sleeve, k.skin);
  if (o.sword && o.sword.hand === 'near') sword(nh, o.sword.tip);
  if (o.holdN) o.holdN(nh);
  c.restore(); FX = 1;
}
function sword(h, tip) { const a = Math.atan2(tip[1] - h[1], tip[0] - h[0]), L = Math.hypot(tip[0] - h[0], tip[1] - h[1]);
  c.save(); c.translate(...h); c.rotate(a); fsh(poly([[6, -3.4], [L, 0], [6, 3.4]]), '#E6EAF0', { flat: true }); fsh(rect(2, -10, 5, 20, 2), '#E8B53A', { flat: true }); fsh(rect(-11, -2.8, 13, 5.6, 2), '#6B4226', { flat: true }); c.restore(); }
function studsBow(x, y, n) {
  fsh(() => { c.moveTo(x, y); c.quadraticCurveTo(x - 15, y - 12, x - 17, y + 4); c.quadraticCurveTo(x - 9, y + 9, x, y); c.quadraticCurveTo(x + 15, y - 12, x + 17, y + 4); c.quadraticCurveTo(x + 9, y + 9, x, y); }, '#5DB7E8', { flat: true });
  const pts = []; for (let i = 0; i < 12; i++) pts.push([x - 15 + (i % 6) * 6, y + 2 + Math.floor(i / 6) * 9 - (i < 6 ? S(i / 5 * PI) * 4 : 0)]);
  pts.forEach(([px, py], i) => { c.save(); c.translate(px, py); c.rotate(PI / 4); c.fillStyle = i < n ? '#FFFFFF' : '#7F93AA'; c.fillRect(-2.4, -2.4, 4.8, 4.8); c.restore(); });
}
function head(k, hx, hy, R, o) {
  const mood = o.mood || 'happy', big = mood === 'shock' ? 1.35 : 1;
  fsh(ellp(hx, hy, R * 1.04, R * .98), k.skin);
  fsh(ellp(hx - R * .5, hy + R * .1, R * .16, R * .22), k.skin, { flat: true });
  if (k.hair && !k.skullcap && !k.bald) fsh(() => { c.moveTo(hx - R * .95, hy + R * .15); c.quadraticCurveTo(hx - R * 1.05, hy - R * 1.05, hx + R * .1, hy - R * 1.02); c.quadraticCurveTo(hx + R * .85, hy - R * .95, hx + R * .9, hy - R * .3); c.quadraticCurveTo(hx + R * .35, hy - R * .62, hx - R * .2, hy - R * .45); c.quadraticCurveTo(hx - R * .45, hy - R * .1, hx - R * .38, hy + R * .3); c.closePath(); }, k.hair);
  if (k.bald) fsh(() => { c.moveTo(hx - R * .98, hy + R * .1); c.quadraticCurveTo(hx - R * 1.05, hy - R * .5, hx - R * .6, hy - R * .55); c.lineTo(hx - R * .45, hy + R * .3); c.closePath(); }, k.hair);
  if (k.gown && k.hair && !k.cap) for (const dy of [.2, .5]) fsh(circ(hx - R * .8, hy + R * dy, R * .2), k.hair);
  if (k.skullcap) { fsh(() => { c.moveTo(hx - R * .9, hy + R * .1); c.quadraticCurveTo(hx - R, hy - R * .4, hx - R * .5, hy - R * .3); c.lineTo(hx - R * .4, hy + R * .3); c.closePath(); }, k.hair); fsh(() => { c.ellipse(hx - R * .05, hy - R * .72, R * .62, R * .34, -.1, PI, 2 * PI); c.closePath(); }, k.skullcap); }
  // eyes (front one a touch smaller), nose centred between them, mouth below
  const ex1 = hx + R * .02, ex2 = hx + R * .44, ey = hy - R * .05;
  for (const [ex, sc] of [[ex1, 1], [ex2, .9]]) {
    if (mood === 'sleep') { line(() => { c.arc(ex, ey, R * .1, .15 * PI, .85 * PI); }, 3.2); continue; }
    if (mood === 'shock') fsh(circ(ex, ey, R * .17 * sc), '#FFFFFF', { flat: true });
    fsh(circ(ex + (o.look || 0) * R * .03, ey, R * .1 * sc * (mood === 'shock' ? .8 : 1)), INK, { flat: true }); c.fillStyle = '#fff'; c.beginPath(); c.arc(ex + R * .035, ey - R * .04, R * .035, 0, 2 * PI); c.fill();
    if (k.lashes) line(() => { c.moveTo(ex + R * .08, ey - R * .08); c.lineTo(ex + R * .15, ey - R * .14); }, 2.4);
    if (mood === 'sly' || (k.sly && mood !== 'shock')) fsh(() => { c.ellipse(ex, ey, R * .14, R * .14, 0, PI, 2 * PI); c.closePath(); }, k.skin, { flat: true });
  }
  if (k.glasses) { line(() => { c.arc(ex1, ey, R * .17, 0, 2 * PI); }, 2.6, '#3A3A40'); line(() => { c.arc(ex2, ey, R * .15, 0, 2 * PI); }, 2.6, '#3A3A40'); line(() => { c.moveTo(ex1 + R * .17, ey); c.lineTo(ex2 - R * .15, ey); }, 2.6, '#3A3A40'); }
  const bw = k.man ? 3.6 : 2.8, byy = ey - R * .3 * big;
  const tilt = -({ angry: .14, sly: -.06, shock: -.1, cheer: -.07, happy: -.07, calm: -.03, worried: -.12, sleep: 0 }[mood] || 0);
  for (const [ex, side] of [[ex1, 0], [ex2, 1]]) line(() => { c.moveTo(ex - R * .13, byy + R * tilt * (side ? -1 : 1)); c.quadraticCurveTo(ex, byy - R * .07, ex + R * .13, byy - R * tilt * (side ? -1 : 1)); }, bw, dark(k.hair, .75));
  const nx = (ex1 + ex2) / 2 + R * .03, ny = hy + R * .17;
  fsh(ellp(nx, ny, R * .075, R * .055), dark(k.skin, .86), { flat: true });
  c.fillStyle = mood === 'angry' && o.red ? 'rgba(235,60,60,.5)' : 'rgba(235,105,110,.32)'; c.beginPath(); c.ellipse(hx - R * .12, hy + R * .3, R * .16, R * .1, 0, 0, 2 * PI); c.ellipse(hx + R * .62, hy + R * .28, R * .11, R * .08, 0, 0, 2 * PI); c.fill();
  const mx = hx + R * .25, my = hy + R * .44;
  if (mood === 'cheer') fsh(() => { c.moveTo(mx - R * .2, my - R * .04); c.quadraticCurveTo(mx, my + R * .34, mx + R * .2, my - R * .06); c.closePath(); }, '#8A2E3A', { flat: true });
  else if (mood === 'shock') fsh(ellp(mx, my + R * .05, R * .09, R * .14), '#8A2E3A', { flat: true });
  else if (mood === 'angry') line(() => { c.moveTo(mx - R * .15, my + R * .07); c.quadraticCurveTo(mx, my - R * .05, mx + R * .15, my + R * .07); }, 3);
  else if (mood === 'worried') line(() => { c.moveTo(mx - R * .13, my + R * .06); c.quadraticCurveTo(mx, my - R * .02, mx + R * .13, my + R * .05); }, 3);
  else if (mood === 'sly') line(() => { c.moveTo(mx - R * .18, my); c.quadraticCurveTo(mx, my + R * .1, mx + R * .2, my - R * .1); }, 3);
  else if (mood === 'sleep') fsh(ellp(mx, my + R * .02, R * .05, R * .07), '#8A2E3A', { flat: true });
  else line(() => { c.moveTo(mx - R * .16, my - R * .02); c.quadraticCurveTo(mx, my + R * .14, mx + R * .16, my - R * .03); }, 3);
  const bc = k.beardCol;
  if (k.moustache === 'thin') line(() => { c.moveTo(mx - R * .2, my - R * .11); c.lineTo(mx + R * .2, my - R * .13); }, 4, bc);
  if (k.moustache === 'full') fsh(() => { c.moveTo(mx - R * .26, my - R * .03); c.quadraticCurveTo(mx, my - R * .22, mx + R * .26, my - R * .05); c.quadraticCurveTo(mx, my - R * .09, mx - R * .26, my - R * .03); }, bc, { flat: true });
  if (k.moustache === 'big') fsh(() => { c.moveTo(mx - R * .36, my); c.quadraticCurveTo(mx, my - R * .26, mx + R * .36, my - R * .02); c.quadraticCurveTo(mx, my - R * .06, mx - R * .36, my); }, bc, { flat: true });
  if (k.moustache === 'curl') { fsh(() => { c.moveTo(mx - R * .3, my - R * .03); c.quadraticCurveTo(mx, my - R * .26, mx + R * .3, my - R * .05); c.quadraticCurveTo(mx, my - R * .09, mx - R * .3, my - R * .03); }, bc, { flat: true }); line(() => { c.moveTo(mx - R * .3, my - R * .03); c.quadraticCurveTo(mx - R * .44, my - R * .03, mx - R * .4, my - R * .17); c.moveTo(mx + R * .3, my - R * .05); c.quadraticCurveTo(mx + R * .44, my - R * .05, mx + R * .4, my - R * .19); }, 3, bc); }
  if (k.goatee) fsh(poly([[mx - R * .08, my + R * .2], [mx + R * .02, my + R * .5], [mx + R * .1, my + R * .2]]), bc, { flat: true });
  if (k.cap) fsh(() => { c.ellipse(hx - R * .1, hy - R * .6, R * .8, R * .44, -.1, PI * .9, PI * 2.1); c.closePath(); }, k.cap);
  if (k.hat && o.hat !== false) hat(hx, hy, R, k);
  if (k.crown) crown(hx + R * .05, hy - R * .85, R * .62);
  if (k.tiara) crown(hx + R * .05, hy - R * .9, R * .42);
  if (o.steam) for (const sd of [-1, 1]) for (let i = 0; i < 3; i++) fsh(circ(hx + sd * R * (1.1 + i * .25), hy - R * (.6 + i * .3), R * (.14 + i * .07)), '#FFFFFF', { flat: true });
  if (o.sweat) fsh(() => { const x = hx + R * .95, y = hy - R * .4; c.moveTo(x, y - R * .2); c.quadraticCurveTo(x + R * .14, y, x, y + R * .08); c.quadraticCurveTo(x - R * .14, y, x, y - R * .2); }, '#8FD3F5', { flat: true });
}
function hat(hx, hy, R, k) {
  if (k.plume) fsh(() => { c.moveTo(hx - R * .4, hy - R * 1.02); c.bezierCurveTo(hx - R * 1.3, hy - R * 2.1, hx - R * 2.2, hy - R * 1.6, hx - R * 2.3, hy - R * 1.1); c.bezierCurveTo(hx - R * 1.7, hy - R * 1.35, hx - R * 1.1, hy - R * 1.15, hx - R * .5, hy - R * .82); c.closePath(); }, k.plume);
  fsh(() => { c.moveTo(hx - R * .7, hy - R * .8); c.quadraticCurveTo(hx - R * .7, hy - R * 1.65, hx + R * .05, hy - R * 1.62); c.quadraticCurveTo(hx + R * .75, hy - R * 1.6, hx + R * .75, hy - R * .8); c.closePath(); }, k.hat);
  fsh(ellp(hx + R * .05, hy - R * .82, R * 1.55, R * .28, -.08), k.hat);
}
function looseHat(x, y, r, k, rot = 0) { c.save(); c.translate(x, y); c.rotate(rot); hat(0, 0, r, k); c.restore(); }
function crown(x, y, r) { fsh(poly([[x - r, y + r * .35], [x - r * 1.05, y - r * .6], [x - r * .5, y - r * .05], [x, y - r * .85], [x + r * .5, y - r * .05], [x + r * 1.05, y - r * .6], [x + r, y + r * .35]]), '#F2C14E'); fsh(circ(x, y + r * .05, r * .14), '#D23B3B', { flat: true }); }

// ---------- the horse (flat, faces right; legs spread for a gallop) ----------
function horse(x, y, s, col, o = {}) {
  c.save(); c.translate(x, y); c.scale((o.f || 1) * s, s); FX = o.f || 1;
  const g = o.gallop || 0, mane = o.mane || '#8A5528', d = dark(col, .82);
  const leg = (hx, a, cl) => { const kx = hx + 26 * S(a), ky = -36, fx = kx + 18 * S(a * 1.4), fy = g ? -4 - Math.max(0, 14 * S(a)) : -2; fsh(capsule([hx, -64], [kx, ky], 9, 8), cl); fsh(capsule([kx, ky], [fx, fy], 8, 7), cl); fsh(ellp(fx + 3, fy + 1, 10, 6), '#4A3020', { flat: true }); };
  leg(-40, g ? -.9 : 0, d); leg(46, g ? .8 : 0, d);
  fsh(() => { c.moveTo(-70, -84); c.quadraticCurveTo(-118 - 10 * g, -76, -112 - 20 * g, -30 + 10 * g); c.quadraticCurveTo(-98, -50, -72, -64); c.closePath(); }, mane);
  fsh(ellp(0, -84, 80, 38), col);
  fsh(poly([[40, -102], [86, -150], [112, -132], [70, -70]]), col);
  c.save(); c.translate(104, -150); c.rotate(.42); fsh(ellp(0, 0, 32, 22), col); fsh(ellp(24, 8, 18, 15), mixc(col, '#ffffff', .4), { flat: true }); fsh(ellp(-14, -24, 7, 14, -.3), col, { flat: true });
  fsh(circ(-2, -6, 7), '#FFFFFF', { flat: true }); fsh(circ(0, -5, 4), INK, { flat: true }); line(() => { c.moveTo(14, 14); c.quadraticCurveTo(24, 22, 36, 12); }, 3); fsh(circ(30, 4, 2), INK, { flat: true }); c.restore();
  fsh(() => { c.moveTo(44, -96); c.quadraticCurveTo(76, -150, 102, -170); c.quadraticCurveTo(88, -134, 62, -80); c.closePath(); }, mane);
  if (o.saddle !== false) { fsh(rect(-30, -122, 56, 30, 6), o.saddle || '#D8343F'); c.fillStyle = '#F2C14E'; c.fillRect(-28, -98, 52, 4); }
  leg(-52, g ? .7 : 0, col); leg(34, g ? -.7 : 0, col);
  c.restore(); FX = 1;
  return [x - 2 * s * (o.f || 1), y - 118 * s];   // the seat
}

// ---------- props & helpers ----------
function grain() { c.save(); c.globalAlpha = .07; c.globalCompositeOperation = 'overlay'; c.drawImage(NOISE, 0, 0); c.restore(); }
function shadow(x, y, w, a = .2) { c.save(); c.globalAlpha = a; c.fillStyle = '#2A1530'; c.beginPath(); c.ellipse(x, y + 4, w, w * .16, 0, 0, 2 * PI); c.fill(); c.restore(); }
function word(t, x, y, size, col, rot = 0) { c.save(); c.translate(x, y); c.rotate(rot); c.font = `800 ${size}px Poppins`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round'; c.lineWidth = size * .2; c.strokeStyle = '#2A1530'; c.strokeText(t, 0, 0); c.fillStyle = col; c.fillText(t, 0, 0); c.restore(); }
function sparkle(x, y, r, col = '#FFFFFF') { c.save(); c.translate(x, y); c.fillStyle = col; c.beginPath(); for (let i = 0; i < 8; i++) { const a = i * PI / 4, rr = i % 2 ? r * .35 : r; c.lineTo(rr * C(a), rr * S(a)); } c.closePath(); c.fill(); c.restore(); }
function cloud(x, y, s, col = '#FFFFFF') { c.fillStyle = col; c.beginPath(); for (const [dx, dy, r] of [[0, 0, 30], [36, -16, 38], [74, 0, 28], [36, 8, 30]]) c.arc(x + dx * s, y + dy * s, r * s, 0, 2 * PI); c.fill(); }
function hearts(x, y, n, s = 1) { for (let i = 0; i < n; i++) { const hx = x + i * 40 * s, hy = y - (i % 2) * 30 * s; fsh(() => { c.moveTo(hx, hy + 12 * s); c.bezierCurveTo(hx - 24 * s, hy - 4 * s, hx - 14 * s, hy - 26 * s, hx, hy - 12 * s); c.bezierCurveTo(hx + 14 * s, hy - 26 * s, hx + 24 * s, hy - 4 * s, hx, hy + 12 * s); }, '#FF6F9E', { flat: true }); } }
function jewelBox(x, y, s, n, open = true) {
  c.save(); c.translate(x, y); c.scale(s, s);
  if (open) fsh(poly([[-70, -40], [70, -40], [80, -110], [-80, -110]]), '#7A3FA8');
  fsh(rect(-80, -40, 160, 54, 8), '#8E4FC0'); fsh(rect(-70, -36, 140, 34, 6), '#3A2050', { flat: true });
  for (let i = 0; i < 12; i++) { const px = -60 + i * 11, py = -19; if (i < n) { c.save(); c.translate(px, py); c.rotate(PI / 4); c.fillStyle = '#F2FDFF'; c.fillRect(-4, -4, 8, 8); c.restore(); } else { c.fillStyle = '#1E1030'; c.beginPath(); c.arc(px, py, 4, 0, 2 * PI); c.fill(); } }
  fsh(rect(-10, -4, 20, 14, 3), '#E8B53A', { flat: true });
  c.restore();
}
