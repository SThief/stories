// node render.js <script.js> <outprefix> [i...]   renders frame(i) of the given page script
const { chromium } = require(process.env.PLAYWRIGHT); const fs = require('fs'); const path = require('path');
(async () => { const [script, out, ...ids] = process.argv.slice(2);
  fs.writeFileSync(path.join(__dirname, '_page.html'), fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8').replace('PAGE', script));
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1100, height: 1100 } });
  p.on('pageerror', e => { console.error('PAGE ERROR', e.message); process.exit(1); });
  await p.goto('file://' + path.join(__dirname, '_page.html')); await p.evaluate(() => window.ready);
  for (const i of (ids.length ? ids : ['0'])) { const d = await p.evaluate(i => frame(+i), i); fs.writeFileSync(`${out}${ids.length ? i.padStart(2, '0') : ''}.jpg`, Buffer.from(d.split(',')[1], 'base64')); }
  await b.close(); })();
