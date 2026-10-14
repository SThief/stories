// node poses.js <out-prefix>: William's walk cycle (8 steps), the horse's gallop (8 steps), and sitting, kneeling, riding
const { chromium } = require(process.env.PLAYWRIGHT); const path = require('path'), fs = require('fs');
(async () => {
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('pageerror', e => { console.error('PAGE ERROR', e.message); process.exit(1); });
  await p.goto('file://' + path.join(__dirname, 'cartoon.html')); await p.evaluate(() => window.ready);
  const jobs = [...Array(8)].map((_, k) => ['will', { ph: k * Math.PI / 4, walk: 1, mood: 'calm' }, 1.4])
    .concat([...Array(8)].map((_, k) => ['whiteHorse', { ph: k * Math.PI / 4, run: 1, still: true, rider: ['__will', { armB: 1.3, bendB: .35 }] }, .9]))
    .concat([['father', { sit: 1, mood: 'calm' }, 1.4], ['will', { kneel: 1, mood: 'proud' }, 1.4], ['kate', { armB: 1.6, bendB: -.4, mood: 'sure' }, 1.4], ['adhemar', { ph: 1, walk: 1, mood: 'mean' }, 1.4]]);
  let i = 0; for (const [n, pose, s] of jobs) {
    const d = await p.evaluate(([n, pose, s]) => { if (pose.rider) pose.rider = [C.willArmor, { ...pose.rider[1], hold: lance(-.05) }]; return card(n, pose, s); }, [n, pose, s]);
    fs.writeFileSync(`${process.argv[2]}-${String(i++).padStart(2, '0')}.jpg`, Buffer.from(d.split(',')[1], 'base64')); }
  await b.close();
})();
