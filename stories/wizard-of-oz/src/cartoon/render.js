// node render.js <out.mp4> <seconds> [still-at-seconds...]
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { spawn } = require('child_process'); const fs = require('fs'); const path = require('path');
(async () => {
  const [out, secs, ...stills] = process.argv.slice(2);
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  p.on('pageerror', e => { console.error('PAGE ERROR', e.message); process.exit(1); });
  await p.goto('file://' + path.join(__dirname, process.env.PAGE || 'index.html')); await p.evaluate(() => window.ready);
  if (stills.length) { for (const s of stills) { const d = await p.evaluate(t => frame(t), +s); fs.writeFileSync(`${out}-${s}.jpg`, Buffer.from(d.split(',')[1], 'base64')); } await b.close(); return; }
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', '30', '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const n = Math.round(secs * 30), t0 = Date.now();
  for (let i = 0; i < n; i++) { const d = await p.evaluate(t => frame(t), i / 30); if (!ff.stdin.write(Buffer.from(d.split(',')[1], 'base64'))) await new Promise(r => ff.stdin.once('drain', r)); }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close();
  console.log(`${n} frames in ${((Date.now() - t0) / 1000).toFixed(1)} s`);
})();
