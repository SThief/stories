const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1100,height:1100}});
p.on('pageerror',e=>console.log('ERR',e.message));
await p.goto('file://'+__dirname+'/page.html');
const ids=process.argv.slice(2).length?process.argv.slice(2).map(Number):[...Array(15).keys()];
for(const i of ids){await p.evaluate(i=>draw(i),i);await p.screenshot({path:`raw/${String(i).padStart(2,'0')}.png`});}
await b.close();})();
