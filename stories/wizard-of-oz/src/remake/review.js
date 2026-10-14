// node review.js <out-dir>: one frame from the middle of every shot (and one near the end of long shots), for review
const { chromium } = require(process.env.PLAYWRIGHT); const path = require('path'), fs = require('fs');
(async () => {
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('pageerror', e => { console.error('PAGE ERROR', e.message); process.exit(1); });
  await p.goto('file://' + path.join(__dirname, 'index.html')); await p.evaluate(() => window.ready);
  const shots = await p.evaluate(() => SHOTS.map(s => [s.a, s.b]));
  const times = []; for (const [a, b] of shots) { times.push((a + b) / 2); if (b - a > 4) times.push(a + (b - a) * .85); }
  for (const t of times) { await p.evaluate(t => frame(t), t - .1); const d = await p.evaluate(t => frame(t), t);
    fs.writeFileSync(path.join(process.argv[2], `${t.toFixed(2).padStart(6, '0')}.jpg`), Buffer.from(d.split(',')[1], 'base64')); }
  console.log(times.length, 'frames');
  await b.close();
})();
