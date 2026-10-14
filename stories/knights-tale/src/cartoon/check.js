// node check.js: everyone moving (walking people, galloping horses) faces the way they go and steps forward
const { chromium } = require(process.env.PLAYWRIGHT); const path = require('path');
(async () => {
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto('file://' + path.join(__dirname, 'cartoon.html')); await p.evaluate(() => window.ready);
  let prev = {}, bad = 0, n = 0;
  for (let t = 0; t < 199; t += .1) {
    const log = await p.evaluate(t => { window.CHECK = []; frame(t); return CHECK; }, t), now = {};
    for (const e of log) { now[e.who] = e; const q = prev[e.who]; if (!q || !e.walk || q.walk === 0) continue; const dx = e.x - q.x, dph = (e.ph || 0) - (q.ph || 0);
      if (Math.abs(dx) < .5 || Math.abs(dx) > 150) continue; n++;   // still, or a cut to a new shot
      const faces = e.flip ? -1 : 1;
      if (Math.sign(dx) !== faces || dph <= 0) { bad++; if (bad < 15) console.log('BAD', t.toFixed(1), e.who, 'dx', dx.toFixed(1), 'flip', e.flip, 'dph', dph.toFixed(2)); } }
    prev = now;
  }
  console.log(bad ? `${bad} problems in ${n} moving moments` : `walk check passed (${n} moving moments): everyone faces the way they go and steps forward`);
  await b.close();
})();
