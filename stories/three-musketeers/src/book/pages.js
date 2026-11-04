// The 15 pages of The Three Musketeers book in the Bold modern look. Text and "Read to me" audio stay as the
// Claude Design session made them; each picture shows the liveliest moment of its page.
const SH_Y = -P.leg - P.torso + 6;                       // shoulder height in local coords
const bwOf = who => P.sh * (CAST[who].big ? 1.25 : 1);
const faceAt = (x0, f, s, X) => (X - x0) / (f * s);      // world x -> local x
const L = (x, y) => [x, y];
function bubble(x, y, text, size = 34, tail = 0) {
  c.save(); c.font = `800 ${size}px Poppins`; const w = c.measureText(text).width + 44, h = size + 30;
  fsh(() => { c.roundRect(x - w / 2, y - h, w, h, 20); c.moveTo(x + tail - 14, y - 2); c.lineTo(x + tail + 10, y + 26); c.lineTo(x + tail + 16, y - 2); }, '#FFFFFF', { flat: true });
  c.fillStyle = '#2A1530'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(text, x, y - h / 2 + 2); c.restore();
}
// swords raised together: each far hand reaches toward the meeting point and the blade ends there
function swordsUp(cast, X, Y, GY, s, mood = 'cheer') {
  for (const [who, x, f, extra] of cast) {
    const sc = s * (CAST[who].big || 1), bw = bwOf(who), shF = [bw * .8, SH_Y];
    const tgt = [(X - x) / (f * sc), (Y - GY) / sc], dx = tgt[0] - shF[0], dy = tgt[1] - shF[1], d = Math.hypot(dx, dy);
    shadow(x, GY, 58 * s / 1.5);
    figure(who, { x, y: GY, s, f, stance: .4, mood, far: [shF[0] + dx / d * P.arm * 1.85, shF[1] + dy / d * P.arm * 1.85], sword: { hand: 'far', tip: [tgt[0] + dx / d * 6, tgt[1] + dy / d * 6] },
      near: [-bw * .5, -P.leg - 8], nearPref: [-1, 0], ...(extra || {}) });
  }
  sparkle(X, Y, 26, '#FFF3B0');
}
function sky(top, bot) { const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, top); g.addColorStop(1, bot); c.fillStyle = g; c.fillRect(0, 0, W, H); }
function ground(y, col, curve = 30) { c.fillStyle = col; c.beginPath(); c.moveTo(-10, y + curve); c.quadraticCurveTo(W / 2, y - curve, W + 10, y + curve); c.lineTo(W + 10, H + 10); c.lineTo(-10, H + 10); c.fill(); }
function houses(y, scale = 1) { const cols = ['#F2A65A', '#F7D26A', '#9ED07A', '#F28FAD', '#8EC5F0', '#B79AE6', '#F5B36B']; for (let i = 0; i < 9; i++) { const x = -40 + i * 140 * scale, w = 128 * scale, h = (180 + (i * 53) % 90) * scale; fsh(rect(x, y - h, w, h + 400), cols[i % 7], { cres: 6 }); fsh(poly([[x - 8, y - h], [x + w / 2, y - h - 60 * scale], [x + w + 8, y - h]]), '#6A4C9C', { cres: 6 }); for (let k = 0; k < 2; k++) for (let j = 0; j < 2; j++) fsh(rect(x + 22 * scale + k * 52 * scale, y - h + 30 * scale + j * 64 * scale, 30 * scale, 40 * scale, 14 * scale), '#FFF4D6', { flat: true }); } }
function bunting(y) { line(() => { c.moveTo(-10, y); c.quadraticCurveTo(W / 2, y + 60, W + 10, y); }, 3, '#5A3A50'); for (let i = 0; i < 16; i++) { const u = (i + .5) / 16, x = u * W, yy = y + 60 * 4 * u * (1 - u) * .5 + 2; fsh(poly([[x - 16, yy], [x + 16, yy], [x, yy + 32]]), ['#F2C14E', '#EF6F8E', '#5DB7E8', '#7BD35A'][i % 4], { flat: true }); } }
function windowArch(x, y, w, h, inside = '#27306A', moon = false) { fsh(() => { c.moveTo(x, y + h); c.lineTo(x, y + w / 2); c.arc(x + w / 2, y + w / 2, w / 2, PI, 0); c.lineTo(x + w, y + h); c.closePath(); }, inside, { flat: true }); c.fillStyle = '#FFFFFF'; for (let i = 0; i < 6; i++) { c.beginPath(); c.arc(x + 14 + (i * 37) % (w - 20), y + 30 + (i * 59) % (h - 40), 2.5, 0, 2 * PI); c.fill(); } if (moon) { fsh(circ(x + w * .62, y + w * .5, w * .2), '#FFF1B8', { flat: true }); fsh(circ(x + w * .7, y + w * .44, w * .17), inside, { flat: true }); } }
function curtain(x, side, col = '#B3263A', h = 760) { fsh(() => { const d = side; c.moveTo(x, 0); c.lineTo(x + d * 150, 0); c.quadraticCurveTo(x + d * 50, h * .5, x + d * 110, h); c.lineTo(x, h); c.closePath(); }, col); }
function candle(x, y, s = 1) { fsh(rect(x - 9 * s, y - 50 * s, 18 * s, 50 * s, 4), '#FFF4E0'); fsh(ellp(x, y - 64 * s, 9 * s, 16 * s), '#FFB72E', { flat: true }); c.save(); c.globalCompositeOperation = 'lighter'; const g = c.createRadialGradient(x, y - 64 * s, 4, x, y - 64 * s, 160 * s); g.addColorStop(0, 'rgba(255,200,110,.45)'); g.addColorStop(1, 'rgba(255,200,110,0)'); c.fillStyle = g; c.fillRect(x - 170 * s, y - 230 * s, 340 * s, 340 * s); c.restore(); }
function table(x, y, w) { fsh(rect(x - w / 2, y, w, 22, 6), '#9A6236'); fsh(rect(x - w / 2 + 20, y + 20, 18, 160), '#7A4A26'); fsh(rect(x + w / 2 - 38, y + 20, 18, 160), '#7A4A26'); }
function notes(seed) { const r = rng(seed); for (let i = 0; i < 7; i++) { const x = 80 + r() * 940, y = 120 + r() * 380; c.save(); c.translate(x, y); c.rotate((r() - .5) * .5); fsh(circ(0, 0, 11), '#7A5AB8', { flat: true }); fsh(rect(8, -46, 5, 46), '#7A5AB8', { flat: true }); fsh(poly([[8, -46], [30, -38], [30, -28], [13, -34]]), '#7A5AB8', { flat: true }); c.restore(); } }
function confetti(seed, n = 90) { const r = rng(seed), cols = ['#2F5FB8', '#F2C14E', '#EF6F8E', '#5DB7E8', '#7BD35A']; for (let i = 0; i < n; i++) { c.save(); c.translate(r() * W, r() * H * .75); c.rotate(r() * 6); c.fillStyle = cols[i % 5]; c.fillRect(-9, -5, 18, 10); c.restore(); } }
function ballroom() { c.fillStyle = '#F3D9A4'; c.fillRect(0, 0, W, H); for (let i = 0; i < 4; i++) { const x = 60 + i * 270; windowArch(x, 200, 150, 400); fsh(() => { c.moveTo(x - 30, 120); c.quadraticCurveTo(x + 6, 380, x - 12, 640); c.lineTo(x - 46, 640); c.lineTo(x - 46, 120); c.closePath(); }, '#8E2A4A'); }
  fsh(rect(-10, 640, W + 20, 20), '#D9A441', { flat: true }); c.fillStyle = '#B9824B'; c.fillRect(0, 660, W, H);
  for (let r = 0; r < 6; r++) for (let k = -2; k < 14; k++) if ((r + k) % 2) { const y0 = 660 + r * r * 9 + r * 22, y1 = 660 + (r + 1) * (r + 1) * 9 + (r + 1) * 22, sk = (y0 - 660) * .4; c.fillStyle = 'rgba(255,235,200,.16)'; c.beginPath(); c.moveTo(k * 100 - sk, y0); c.lineTo(k * 100 + 100 - sk, y0); c.lineTo(k * 100 + 100 - sk - (y1 - y0) * .4, y1); c.lineTo(k * 100 - sk - (y1 - y0) * .4, y1); c.fill(); }
  line(() => { c.moveTo(550, -10); c.lineTo(550, 70); }, 4, '#8A6A2A'); fsh(ellp(550, 92, 130, 20), '#E8B53A'); for (let i = 0; i < 7; i++) { const x = 460 + i * 30; fsh(rect(x - 4, 58, 8, 22), '#FFF8E6', { flat: true }); fsh(ellp(x, 50, 5, 9), '#FFB72E', { flat: true }); } }

const PAGES = [
  // 0 cover
  () => { sky('#FFB26B', '#FF8E6E'); fsh(circ(550, 640, 300), '#FFD166', { flat: true }); houses(760, .9); ground(800, '#6B4A80', 20);
    swordsUp([['athos', 290, 1], ['porthos', 445, 1], ['aramis', 660, -1], ['dart', 815, -1]], 552, 430, 900, 1.7);
    c.save(); c.font = '800 96px Poppins'; c.textAlign = 'center'; c.lineJoin = 'round'; c.lineWidth = 18; c.strokeStyle = '#2A1530'; c.fillStyle = '#FFFFFF'; c.strokeText('The Three', 550, 120); c.fillText('The Three', 550, 120); c.font = '800 118px Poppins'; c.fillStyle = '#FFD166'; c.strokeText('Musketeers', 550, 240); c.fillText('Musketeers', 550, 240); c.restore(); },
  // 1 goodbye on the farm
  () => { sky('#8ED3F5', '#D8F1FF'); cloud(130, 140, 1.2); cloud(700, 100, .9); fsh(circ(960, 150, 70), '#FFD166', { flat: true });
    ground(640, '#9ED07A', 40); ground(720, '#7BBF5E', 20);
    fsh(rect(70, 380, 260, 220), '#FCE6B9'); fsh(poly([[50, 386], [200, 260], [350, 386]]), '#E9654F'); fsh(rect(220, 470, 66, 130, 8), '#A0643A'); fsh(rect(110, 440, 70, 60, 6), '#8EC5F0', { flat: true });
    shadow(170, 860, 62); figure('mum', { x: 170, y: 860, s: 1.55, f: 1, mood: 'happy', far: [bwOf('mum') * .8 + 26, SH_Y - 52] });
    shadow(330, 870, 62); figure('dad', { x: 330, y: 870, s: 1.55, f: 1, mood: 'cheer', far: [bwOf('dad') * .8 + 28, SH_Y - 50], hat: false, hold: h => looseHat(h[0] + 4, h[1] + 30, 30, CAST.dad, -.3) });
    hearts(420, 600, 3, .9);
    shadow(780, 900, 150); const seat = horse(780, 900, 1.35, '#F6CF45', { gallop: .6 });
    figure('dart', { x: seat[0], y: seat[1], s: 1.45, f: 1, ride: true, mood: 'cheer', near: [-bwOf('dart') * 1.3, SH_Y - P.arm * 1.4], nearPref: [-1, 1], far: [P.arm * 1.6, SH_Y + P.arm * .6], flutter: 1 });
    bubble(300, 560, 'Be brave, my son!', 30, 20); },
  // 2 Paris and Captain Treville
  () => { sky('#9AD6F7', '#E6F6FF'); houses(720); bunting(150); c.fillStyle = '#E8C98A'; c.fillRect(0, 720, W, H); for (let i = 0; i < 40; i++) { const r = rng(i); c.fillStyle = '#D4AE6A'; c.beginPath(); c.ellipse(r() * W, 760 + r() * 320, 26, 9, 0, 0, 2 * PI); c.fill(); }
    shadow(330, 930, 60); figure('dart', { x: 330, y: 930, s: 1.7, f: 1, mood: 'cheer', near: [P.sh * 1.2, SH_Y + 20], far: [P.sh * 1.9, SH_Y + 16], stance: .45 });
    shadow(760, 930, 66); figure('treville', { x: 760, y: 930, s: 1.75, f: -1, mood: 'happy', far: [bwOf('treville') * .8 + 18, SH_Y - P.arm * 1.75], near: [-bwOf('treville') * .4, -P.leg - 6], nearPref: [-1, 0] });
    bubble(780, 360, 'First, prove yourself!', 34, -60); },
  // 3 Oops! Oops! Oops!
  () => { c.fillStyle = '#F2DDB0'; c.fillRect(0, 0, W, H); for (let i = 0; i < 3; i++) { const x = 160 + i * 330; fsh(poly([[x, 60], [x + 90, 60], [x + 90, 250], [x + 45, 220], [x, 250]]), '#2F5FB8'); c.fillStyle = '#fff'; c.fillRect(x + 41, 100, 9, 80); c.fillRect(x + 20, 128, 50, 9); }
    c.fillStyle = '#B77B48'; c.fillRect(0, 760, W, H); fsh(rect(-10, 750, W + 20, 18), '#8A5530', { flat: true });
    shadow(150, 930, 70); figure('porthos', { x: 150, y: 930, s: 1.45, f: 1, mood: 'angry', near: [P.sh * 1.3, SH_Y + 26], far: [P.sh * 1.9, SH_Y + 22], flutter: 1 });
    shadow(520, 930, 60); figure('dart', { x: 520, y: 930, s: 1.55, f: 1, mood: 'shock', lean: .28, far: [P.arm * 1.5, SH_Y - P.arm * 1.3], near: [-P.arm * 1.4, SH_Y - P.arm * .8], nearPref: [-1, 1], legs: [[-30, -40], [18, -4]], sweat: true });
    shadow(720, 930, 60); figure('athos', { x: 720, y: 930, s: 1.55, f: -1, mood: 'angry', lean: -.12, far: [-bwOf('athos') * .2, SH_Y + 8], farPref: [1, 0] });
    shadow(950, 930, 60); figure('aramis', { x: 950, y: 930, s: 1.45, f: -1, mood: 'angry', far: [P.arm * 1.4, SH_Y - P.arm * .9], hold: h => { fsh(rect(h[0] - 18, h[1] - 34, 36, 30, 4), '#FFFFFF', { flat: true }); fsh(ellp(h[0], h[1] - 20, 9, 6), '#8A6A50', { flat: true }); } });
    word('OOPS!', 560, 380, 110, '#FFD166', -.12); },
  // 4 noon: the guards march in
  () => { sky('#9AD6F7', '#E6F6FF'); fsh(rect(760, 80, 170, 500), '#D7C2A0'); fsh(poly([[740, 90], [845, 0], [950, 90]]), '#6A4C9C'); fsh(circ(845, 190, 62), '#FFF8E6'); line(() => { c.moveTo(845, 190); c.lineTo(845, 140); c.moveTo(845, 190); c.lineTo(845, 150); }, 7, INK); for (let i = 0; i < 12; i++) fsh(circ(845 + 50 * S(i * PI / 6), 190 - 50 * C(i * PI / 6), 4), INK, { flat: true });
    ground(700, '#9ED07A', 25);
    for (const [who, x] of [['athos', 110], ['porthos', 250], ['aramis', 390]]) { shadow(x, 930, 50); figure(who, { x, y: 930, s: 1.3, f: 1, mood: 'happy', near: [P.arm * 1.7, SH_Y + 10], sword: { hand: 'near', tip: [P.arm * 1.7 + 90, SH_Y - 30] } }); }
    shadow(540, 940, 56); figure('dart', { x: 540, y: 940, s: 1.45, f: 1, mood: 'cheer', near: [P.arm * 1.7, SH_Y + 6], sword: { hand: 'near', tip: [P.arm * 1.7 + 95, SH_Y - 40] } });
    for (const [x, i] of [[760, 0], [890, 1], [1020, 2]]) { shadow(x, 930, 50); figure('guard', { x, y: 930, s: 1.3, f: -1, mood: 'angry', legs: [[-12 + 8 * i, -4], [16, -12]], far: i === 0 ? [P.arm * 1.3, SH_Y - P.arm * 1.4] : undefined }); }
    bubble(760, 520, 'HALT!', 46, 0); },
  // 5 hats flying, all for one
  () => { sky('#FFC46B', '#FFE3A8'); fsh(circ(300, 420, 200), '#FFE9A0', { flat: true }); ground(720, '#9ED07A', 25);
    swordsUp([['athos', 110, 1], ['porthos', 260, 1], ['aramis', 495, -1], ['dart', 640, -1]], 375, 360, 1010, 1.6);
    for (const [x, i] of [[820, 0], [930, 1], [1040, 2]]) { shadow(x, 950, 50); figure('guard', { x, y: 950 - (i % 2) * 20, s: 1.25, f: 1, mood: 'shock', hat: false, lean: .15, legs: [[-30, -24], [26, -4]], near: [-bwOf('guard') * 1.4, SH_Y - P.arm * 1.4], nearPref: [-1, 1], far: [P.arm * 1.3, SH_Y - P.arm * 1.4] }); }
    for (const [x, y, r] of [[760, 260, .6], [900, 160, -.8], [1010, 300, 1.2]]) looseHat(x, y, 34, CAST.guard, r);
    word('POP!', 900, 470, 90, '#FFFFFF', .1); },
  // 6 the Cardinal whispers to the King
  () => { c.fillStyle = '#5E3F8F'; c.fillRect(0, 0, W, H); windowArch(130, 160, 180, 420, '#27306A', true); windowArch(790, 160, 180, 420); curtain(0, 1); curtain(W, -1); c.fillStyle = '#3A2A5E'; c.fillRect(0, 760, W, H);
    shadow(390, 1040, 76); figure('card', { x: 390, y: 1040, s: 2.0, f: 1, mood: 'sly', lean: .12, far: [P.head * 1.25, SH_Y - P.head * .92 + P.head * .38], near: [P.sh * 1.4, SH_Y + 24] });
    shadow(690, 1040, 80); figure('king', { x: 690, y: 1040, s: 2.05, f: 1, mood: 'shock', look: 2, near: [P.sh * 1.4, SH_Y + 30] });
    fsh(() => { c.ellipse(880, 300, 170, 110, 0, 0, 2 * PI); }, '#FFFFFF', { flat: true }); fsh(circ(760, 420, 18), '#FFFFFF', { flat: true }); fsh(circ(728, 460, 11), '#FFFFFF', { flat: true });
    jewelBox(880, 330, .95, 12); for (let i = 0; i < 3; i++) sparkle(820 + i * 60, 250 - (i % 2) * 20, 12, '#B6ECFF');
    word('psst...', 330, 430, 54, '#FFD166', -.15); },
  // 7 the Queen is worried; d'Artagnan promises
  () => { c.fillStyle = '#2E3366'; c.fillRect(0, 0, W, H); windowArch(110, 150, 170, 400, '#151A3E', true); c.fillStyle = '#3B2F5A'; c.fillRect(0, 760, W, H); table(70, 690, 200); candle(40, 690, 1.0);
    shadow(170, 960, 64); figure('queen', { x: 170, y: 960, s: 1.6, f: 1, mood: 'worried', near: [P.sh * 1.0, SH_Y + 30], far: [P.sh * 1.5, SH_Y + 28] });
    shadow(390, 960, 58); figure('cons', { x: 390, y: 970, s: 1.5, f: 1, mood: 'happy', far: [P.arm * 1.5, SH_Y - P.arm * .3] });
    shadow(640, 960, 60); figure('dart', { x: 640, y: 960, s: 1.6, f: -1, mood: 'happy', near: [P.sh * .4, SH_Y + 14], far: [P.arm * 1.3, SH_Y - P.arm * 1.4] });
    for (const [who, x] of [['athos', 830], ['porthos', 950], ['aramis', 1070]]) { const bw = bwOf(who); shadow(x, 960, 50); figure(who, { x, y: 960, s: 1.25, f: -1, mood: 'cheer', far: [bw * .8 + 20, SH_Y - P.arm * 1.75] }); }
    bubble(900, 470, 'Us too!', 44, 30); },
  // 8 the gallop to the sea: Porthos holds the guards back
  () => { sky('#FFB37A', '#FFE3B0'); fsh(circ(880, 260, 90), '#FFD166', { flat: true }); ground(600, '#C99A5E', 20); c.fillStyle = '#E2C08A'; c.fillRect(0, 760, W, 120);
    for (const x of [90, 330]) { shadow(x, 900, 50); figure('guard', { x, y: 900, s: 1.2, f: 1, mood: 'shock', legs: [[-6, -4], [20, -4]] }); }
    shadow(470, 900, 60); figure('porthos', { x: 470, y: 900, s: 1.35, f: -1, mood: 'cheer', stance: .55, near: [P.arm * 1.8, SH_Y + 6], sword: { hand: 'near', tip: [P.arm * 1.8 + 100, SH_Y - 30] }, far: [P.arm * 1.4, SH_Y - P.arm * 1.4] });
    shadow(820, 900, 150); let seat = horse(820, 900, 1.2, '#F6CF45', { gallop: 1 }); figure('dart', { x: seat[0], y: seat[1], s: 1.3, f: 1, ride: true, mood: 'cheer', near: [P.arm * 1.5, SH_Y + P.arm * .7], far: [P.arm * 1.6, SH_Y + P.arm * .6], flutter: 1 });
    for (let i = 0; i < 4; i++) fsh(circ(640 - i * 40, 880 - i * 8, 24 + i * 8), 'rgba(240,215,170,.7)', { flat: true });
    bubble(470, 470, 'Go on!', 44, 0); },
  // 9 England: only ten diamonds! Milady at the window
  () => { c.fillStyle = '#A9B9D8'; c.fillRect(0, 0, W, H); fsh(() => { c.moveTo(820, 560); c.lineTo(820, 230); c.arc(920, 230, 100, PI, 0); c.lineTo(1020, 560); c.closePath(); }, '#2E2A44', { flat: true });
    figure('milady', { x: 920, y: 640, s: 1.2, f: -1, mood: 'sly', far: [P.arm * 1.4, SH_Y - P.arm * 1.1], hold: h => { line(() => { c.moveTo(h[0], h[1]); c.lineTo(h[0] - 26, h[1] - 18); c.moveTo(h[0], h[1]); c.lineTo(h[0] - 28, h[1] + 4); }, 4, '#C9CED8'); for (const dx of [-36, -50]) { c.save(); c.translate(h[0] + dx, h[1] - 30); c.rotate(PI / 4); c.fillStyle = '#F2FDFF'; c.fillRect(-6, -6, 12, 12); c.restore(); } } });
    fsh(rect(780, 540, 280, 40, 6), '#7D8BAA', { flat: true }); c.fillStyle = '#8A93AE'; c.fillRect(0, 760, W, H);
    table(500, 700, 330); jewelBox(500, 700, 1.45, 10);
    shadow(200, 1040, 76); figure('buck', { x: 200, y: 1040, s: 1.95, f: 1, mood: 'shock', far: [P.arm * 1.8, SH_Y + 10] });
    shadow(820, 1040, 72); figure('dart', { x: 820, y: 1040, s: 1.95, f: -1, mood: 'shock', far: [P.arm * 1.4, SH_Y - P.arm * 1.3], near: [-bwOf('dart') * 1.2, SH_Y - P.arm * 1.3], nearPref: [-1, 1], sweat: true });
    word('Only TEN?!', 430, 300, 84, '#FFD166', -.06); },
  // 10 the jeweler works all night
  () => { c.fillStyle = '#5A3E2A'; c.fillRect(0, 0, W, H); windowArch(820, 120, 170, 360, '#151A3E', true); c.fillStyle = '#3A2818'; c.fillRect(0, 780, W, H);
    const AX = 520, AY = 646, jx = 430, js = 1.75, jy = 840, hit = [(AX - 14 - jx) / js, (AY - 30 - jy) / js];
    figure('jeweler', { x: jx, y: jy, s: js, f: 1, mood: 'happy', look: 2, far: hit, hold: h => { c.save(); c.translate(h[0], h[1]); c.rotate(-.9); fsh(rect(-4, -4, 8, 38, 3), '#8A5A33', { flat: true }); fsh(rect(-16, 30, 32, 16, 4), '#9AA2B1', { flat: true }); c.restore(); } });
    table(430, 700, 460); candle(260, 700, 1.1); fsh(rect(460, 676, 120, 26, 6), '#4A4A55'); fsh(rect(490, 652, 60, 26, 4), '#6A6A78');
    for (let i = 0; i < 2; i++) { c.save(); c.translate(AX - 10 + i * 22, AY); c.rotate(PI / 4); c.fillStyle = '#F2FDFF'; c.fillRect(-7, -7, 14, 14); c.restore(); }
    for (let i = 0; i < 6; i++) { const a = -PI / 2 + (i - 2.5) * .45; line(() => { c.moveTo(AX + 26 * C(a), AY - 6 + 26 * S(a)); c.lineTo(AX + 50 * C(a), AY - 6 + 50 * S(a)); }, 4, '#FFE066'); }
    fsh(rect(790, 860, 120, 20, 6), '#7A4A26'); fsh(rect(800, 878, 14, 80), '#5A3418'); fsh(rect(886, 878, 14, 80), '#5A3418');
    figure('dart', { x: 850, y: 862, s: 1.7, f: -1, ride: true, mood: 'sleep', lean: .18, near: [P.sh * .6, SH_Y + 34], far: [P.sh * 1.2, SH_Y + 34] });
    for (let i = 0; i < 3; i++) word('Z', 930 + i * 40, 520 - i * 50, 44 + i * 10, '#FFFFFF', .2);
    word('tap tap!', 560, 450, 60, '#FFD166', -.1); },
  // 11 the stormy sea
  () => { sky('#1D2342', '#4E5D88'); for (let i = 0; i < 4; i++) cloud(i * 290 - 40, 120 + (i % 2) * 50, 1.6, '#5C6890');
    fsh(poly([[820, 0], [740, 220], [810, 220], [700, 440], [900, 170], [830, 170], [900, 0]]), '#FFF07A', { flat: true });
    c.strokeStyle = 'rgba(200,220,255,.5)'; c.lineWidth = 3; for (let i = 0; i < 60; i++) { const r = rng(i + 5); const x = r() * W, y = r() * H; c.beginPath(); c.moveTo(x, y); c.lineTo(x - 18, y + 46); c.stroke(); }
    const wave = (y, amp, ph, col) => fsh(() => { c.moveTo(-10, H + 10); for (let x = -10; x <= W + 10; x += 20) c.lineTo(x, y + amp * S(x / 120 + ph) + amp * .4 * S(x / 47 + ph * 2)); c.lineTo(W + 10, H + 10); c.closePath(); }, col);
    wave(640, 50, 0, '#2A548F');
    c.save(); c.translate(520, 700); c.rotate(-.22);
    line(() => { c.moveTo(-20, 0); c.lineTo(-20, -330); }, 12, '#5A3A20'); fsh(() => { c.moveTo(-12, -320); c.quadraticCurveTo(130, -220, -12, -70); c.closePath(); }, '#F7F1E3');
    figure('dart', { x: -60, y: -20, s: 1.45, f: 1, mood: 'shock', hat: false, legs: [[-10, -4], [16, -4]], far: [ (40 - -60) / 1.45 * 0, SH_Y - 30 ], near: [ (-20 - -60) / 1.45, SH_Y - 10 ], nearPref: [0, 1], flutter: 1, sweat: true });
    fsh(poly([[-200, -20], [200, -20], [150, 70], [-150, 70]]), '#9A6236'); line(() => { c.moveTo(-180, 0); c.lineTo(180, 0); }, 5, '#6E4322');
    c.restore();
    looseHat(250, 330, 30, CAST.dart, -.8);
    wave(800, 60, 1.6, '#3A6EB0'); wave(950, 40, 3.1, '#5B8FD0');
    word('Hold on!', 760, 520, 70, '#FFFFFF', -.08); },
  // 12 the Royal Ball: the Cardinal giggles... then the Queen walks in
  () => { ballroom(); notes(3);
    fsh(rect(840, 300, 220, 360, 10), '#FFF3C4', { flat: true }); c.save(); c.globalCompositeOperation = 'lighter'; const g = c.createRadialGradient(950, 520, 40, 950, 520, 380); g.addColorStop(0, 'rgba(255,240,180,.6)'); g.addColorStop(1, 'rgba(255,240,180,0)'); c.fillStyle = g; c.fillRect(500, 100, 600, 900); c.restore();
    shadow(190, 1040, 70); figure('card', { x: 190, y: 1040, s: 1.85, f: 1, mood: 'sly', far: [bwOf('card') * .8 + 22, SH_Y - 72], near: [P.sh * 1.4, SH_Y + 26] });
    shadow(470, 1040, 74); figure('king', { x: 470, y: 1040, s: 1.9, f: 1, mood: 'happy', look: 2, near: [P.sh * 1.4, SH_Y + 30] });
    shadow(950, 1040, 78); figure('queen', { x: 950, y: 1040, s: 1.9, f: -1, mood: 'happy', near: [P.sh * .9, SH_Y + 28], far: [P.sh * 1.4, SH_Y + 26], lit: 0 });
    word('Hehehe...', 250, 420, 62, '#FF5E7A', -.1); },
  // 13 all twelve diamonds!
  () => { ballroom(); confetti(13, 60);
    shadow(120, 1040, 64); figure('card', { x: 120, y: 1040, s: 1.7, f: 1, mood: 'angry', red: true, steam: true, near: [P.sh * .6, SH_Y + 40], far: [P.sh * 1.0, SH_Y + 40] });
    shadow(335, 1040, 70); figure('king', { x: 335, y: 1040, s: 1.8, f: 1, mood: 'cheer', far: [bwOf('king') * .8 + 22, SH_Y - P.arm * 1.75], near: [P.sh * 1.6, SH_Y + 20] });
    shadow(590, 1060, 84); figure('queen', { x: 590, y: 1060, s: 2.05, f: -1, mood: 'happy', near: [P.sh * .9, SH_Y + 28], far: [P.sh * 1.5, SH_Y + 26], lit: 12 });
    const bx = 590 + bwOf('queen') * .5 * 2.05, by = 1060 + (SH_Y + 10) * 2.05; c.save(); c.globalCompositeOperation = 'lighter'; const g = c.createRadialGradient(bx, by, 4, bx, by, 70); g.addColorStop(0, 'rgba(220,250,255,.55)'); g.addColorStop(1, 'rgba(220,250,255,0)'); c.fillStyle = g; c.fillRect(bx - 130, by - 130, 260, 260); c.restore();
    for (let i = 0; i < 6; i++) { const a = PI * .15 + i * .55; sparkle(bx + 70 * C(a), by + 55 * S(a), 11 + (i % 2) * 7); }
    shadow(815, 1040, 62); figure('cons', { x: 815, y: 1040, s: 1.65, f: -1, mood: 'cheer', far: [bwOf('cons') * .8 + 20, SH_Y - P.arm * 1.75] });
    shadow(990, 1040, 64); figure('dart', { x: 990, y: 1040, s: 1.7, f: -1, mood: 'cheer', far: [bwOf('dart') * .8 + 20, SH_Y - P.arm * 1.75], hat: false, hold: h => looseHat(h[0], h[1] + 26, 28, CAST.dart, .3) });
    word('ALL TWELVE!', 560, 240, 96, '#FFFFFF', -.04); word('GRRR!', 150, 420, 60, '#FF3B3B', .1); },
  // 14 a true Musketeer: all for one, one for all!
  () => { sky('#FF9E6B', '#FFD08A'); fsh(circ(550, 700, 320), '#FFE29A', { flat: true }); houses(800, .8); ground(830, '#6B4A80', 15); confetti(14, 70);
    swordsUp([['athos', 260, 1], ['porthos', 410, 1], ['aramis', 700, -1], ['dartBlue', 850, -1]], 555, 470, 980, 1.6);
    c.save(); c.font = '800 70px Poppins'; c.textAlign = 'center'; c.lineJoin = 'round'; c.lineWidth = 14; c.strokeStyle = '#2A1530'; c.fillStyle = '#FFFFFF'; c.strokeText('All for one,', 550, 150); c.fillText('All for one,', 550, 150); c.fillStyle = '#FFD166'; c.strokeText('one for all!', 550, 240); c.fillText('one for all!', 550, 240); c.restore(); },
];
window.frame = i => { c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.clearRect(0, 0, W, H); PAGES[i](); grain(); return cv.toDataURL('image/jpeg', .92); };
