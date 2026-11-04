// ================= SCENES =================
const SKYBG=()=>`<rect x="-300" y="-300" width="1880" height="1300" fill="url(#sky)"/>`;
const FIELD=(sunx)=>SKYBG()+sunC(sunx??1080,120,56)+cloud(220,110,1.1)+cloud(640,80,.8)+hills('#8FD872','#6CC45A');
const HEROES={athos:'athos',porthos:'porthos',aramis:'aramis'};
const SCENES=[];

// ---------- 0 TITLE ----------
SCENES.push({name:'title',dur:5,noFadeIn:false,
 bg:()=>background(),
 actors:[
  {id:'a1',o:'athos',keys:[{t:0,x:330,y:-500},{t:1.2,y:600,d:.35,e:'in'},{t:2.6,cheer:2.4}]},
  {id:'a2',o:'porthos',keys:[{t:0,x:520,y:-500},{t:1.4,y:600,d:.35,e:'in'},{t:2.7,cheer:2.3}]},
  {id:'a3',o:'aramis',keys:[{t:0,x:720,y:-500},{t:1.6,y:600,d:.35,e:'in'},{t:2.8,cheer:2.2}]},
  {id:'a4',o:'dart',keys:[{t:0,x:910,y:-500},{t:1.8,y:600,d:.35,e:'in'},{t:2.9,cheer:2.1}]},
 ],
 hud:t=>{const out=seg(t,4.3,4.9);let g=`<g transform="translate(640,170)" opacity="${1-out}">`;
   g+=`<rect x="-440" y="-82" width="880" height="164" rx="40" fill="#2C2160" opacity="${.85*seg(t,0,.3)}" class="o"/>`;
   // one line, letters spaced by their real Poppins Bold widths (em), a little tracking; "ALL FOR" white, "ONE" gold
   {const fs=104,trk=6,EM={A:.73,L:.56,F:.55,O:.79,R:.64,N:.77,E:.58,' ':.3},txt='ALL FOR ONE';const ws=[...txt].map(ch=>EM[ch]*fs+trk),tot=ws.reduce((a,b)=>a+b,0)-trk;let x=-tot/2;
    [...txt].forEach((ch,ci)=>{const w=ws[ci],cx=x+(w-trk)/2;x+=w;const st=.15+ci*.06;const p=seg(t,st,st+.4);if(p<=0||ch===' ')return;
     g+=`<text class="t" text-anchor="middle" font-size="${fs}" fill="${ci>=8?'#FFC93C':'#FFFFFF'}" stroke="#20163a" stroke-width="7" paint-order="stroke" transform="translate(${cx},${36+(1-back(p))*-70}) scale(${back(p)})">${ch}</text>`})}
   return g+'</g>'+sparkBurst(640,170,t,1.3,'#FFE066')},
 fx:t=>[0,1,2,3].map(i=>{const tl=1.2+i*.2+.35;return tl<t&&t<tl+.5?dust([330,520,720,910][i],600,seg(t,tl,tl+.5),i):''}).join(''),
 sfx:[['whoosh',.1,.6],['fanfare72',.3,.55],['thud',1.55,.8],['thud',1.75,.8],['thud',1.95,.8],['thud',2.15,.8],['sparkle',1.3,.5],['cheer',2.7,.6]],
 music:[[0,5,'march',.8]],
});

// ---------- 1 GOODBYE GASCONY ----------
SCENES.push({name:'s1',dur:20,
 bg:()=>FIELD()+`<g transform="translate(250,520)"><rect x="-110" y="-120" width="220" height="120" fill="#FFE6B8" class="o"/><path d="M-130 -120 L0 -210 L130 -120Z" fill="#E8604C" class="o"/><rect x="-24" y="-70" width="48" height="70" rx="20" fill="#8A5A33" class="o"/><rect x="-86" y="-96" width="40" height="40" rx="8" fill="#9CD3FF" class="o"/><rect x="46" y="-96" width="40" height="40" rx="8" fill="#9CD3FF" class="o"/></g>`+treeC(1180,560,1)+treeC(480,470,.7),
 bgDyn:t=>{if(t<12)return'';const lt=t-12;let s=SKYBG()+sunC(1060,120,56)+[0,1,2].map(k=>cloud(((k*600-lt*90)%1800+1800)%1800-200,90+k*30,1.2)).join('')+hillsStrip(lt*130,520,'#9ED98A',700);
   for(let k=0;k<6;k++){const x=((k*340-lt*560)%2040+2040)%2040-300;s+=treeC(x,620,.8+rnd(k)*.4)}
   s+=`<rect x="-300" y="620" width="1880" height="400" fill="#E8C98A"/><path d="M-300 620 H1580" stroke="#20163a" stroke-width="4"/>`;
   for(let k=0;k<26;k++){const x=((k*80-lt*950)%2080+2080)%2080-300;s+=`<ellipse cx="${x}" cy="${660+(k%3)*26}" rx="22" ry="7" fill="#D4AE6A"/>`}return s},
 actors:[
  {id:'mom',o:'mom',keys:[{t:0,x:165,y:618,s:1.3,turn:1,arm:-40,elbow:-50,arm2:-50,elbow2:-35},{t:8.4,wave:3.4},{t:12,op:0,d:0}]},
  {id:'dad',o:'dad',extra:{noSword:true},keys:[{t:0,x:425,y:618,s:1.3,turn:1},{t:.8,talk:2.2},{t:2.6,arm:-78,elbow:-12,d:.3},{t:3.6,arm:-20,elbow:12,d:.3},{t:8.4,wave:3.4},{t:12,op:0,d:0}]},
  {id:'dart',o:'dart',keys:[{t:0,x:690,y:618,s:1.3,turn:1,flip:true},{t:2.8,arm:-72,elbow:-14,d:.3},{t:3.7,arm:30,elbow:-90,d:.35,hop:.7},{t:4.0,talk:1.2,brows:'determined'},{t:4.3,arm:-20,elbow:12,d:.3},{t:5.8,x:880,d:1.6,walk:1.6,e:'lin'},{t:7.4,flip:false},{t:7.5,x:995,y:470,d:.35,hop:.4},{t:7.9,op:0,d:0}]},
  {id:'horse',type:'h',col:'#FFD84D',keys:[{t:0,x:1010,y:620,s:1.05,rider:null},{t:7.9,rider:'dart',open:true},{t:9.0,x:1550,d:2.6,e:'in',run:2.6},{t:12,x:560,y:660,s:1.15,d:0,run:8,spd:950}]},
  {id:'letter',type:'p',svg:`<g transform="rotate(-20)"><rect x="-20" y="-14" width="40" height="28" rx="4" fill="#FFF6E0" class="o"/><path d="M-20 -14 L0 2 L20 -14" fill="none" stroke="#20163a" stroke-width="2.5"/><circle cx="0" cy="2" r="5" fill="#D7263D"/></g>`,
   keys:[{t:0,att:'dad-buckle',ox:0,oy:0,s:.8},{t:2.6,att:'dad-armh',oy:-6,s:1.0},{t:3.15,att:'dart-armh'},{t:4.0,att:'dart-buckle',oy:-4,s:.7},{t:7.9,att:'horse_r-buckle',oy:-6,s:.6}]},
 ],
 fx:t=>say('Be brave, my son!',440,240,t,.8,3.4,{tx:-20})+say('I will, Papa!',690,240,t,4.0,5.6)+pt('Goodbye!',300,230,t,8.6,11.6,'#FF5E7A',-6,60)
   +(t>8.6&&t<11.6?heart(175+Math.sin(t*3)*10,290-((t-8.6)*40)%120,1.5)+heart(440,270-((t-8.9)*40)%120,1.3):'')
   +(t>12?[0,1,2,3].map(k=>`<path d="M${330-((t*900+k*90)%240)} ${440+k*45} h-${80+k*20}" stroke="#fff" stroke-width="9" stroke-linecap="round"/>`).join('')+dust(440,660,(t*2.2)%1,3):''),
 hud:t=>(t>11.6&&t<12.4?wipe(seg(t,11.6,12.4),'#FFC93C'):'')+pt('Off to Paris!',820,170,t,13,16,'#FFFFFF',-4,64),
 sfx:[['birds',.3,.5],['birds',3.2,.4],['pop',2.7,.4],['boing',3.6,.35],['whoosh',5.8,.3],['steps',5.8,1.6],['boing',7.5,.35],['neigh',7.9,.6],['hooves',9,2.6],['whoosh',11.6,.6],['hooves',12,8],['pop',13,.4],['birds',15,.3]],
 music:[[0,9,'waltz',.55],[9,20,'gallop',.75]],
 caps:["Long ago in France, young d'Artagnan says goodbye to his mum and dad.","He rides off on his funny yellow horse with one big dream: to become one of the King's Musketeers!"],
});

// ---------- 2 HELLO PARIS ----------
SCENES.push({name:'s2',dur:20,
 bg:()=>background(),
 actors:[
  {id:'trev',o:'treville',keys:[{t:0,x:840,y:600,s:1.2,turn:1,flip:true},{t:6.5,talk:3},{t:10,arm:-95,elbow:0,d:.3},{t:13.6,arm:-20,elbow:12,d:.4},{t:16,clap:2.5}]},
  {id:'dart',o:'dart',keys:[{t:0,x:-120,y:600,s:1.15},{t:.4,x:470,d:4.2,walk:4.2,e:'lin'},{t:1,look:-6,tilt:-4,d:.4},{t:2.4,look:6,tilt:4,d:.4},{t:4.6,turn:1,flip:false,look:5,tilt:0,d:.3},{t:5.3,lean:18,d:.3},{t:6.2,lean:0,d:.3},{t:13.6,brows:'determined'},{t:14,arm:92,elbow:48,d:.3,talk:1.6},{t:16.2,hop:.9}]},
 ],
 cam:[{t:0,z:1.3,cx:200,cy:420},{t:.6,cx:470,d:4,e:'io'},{t:5,z:1,cx:640,cy:360,d:.8},{t:16,z:1.7,cx:520,cy:400,d:1.2}],
 fx:t=>pt('WOW!',470,280,t,2,4,'#FFC93C',-6,60)+say('Hmm... a brave boy!',820,250,t,6.6,9.6,{tx:30})+say('First, prove yourself!',820,250,t,10.2,13.5,{tx:30})+say('I will!',480,250,t,14.2,16.4)
   +sparkBurst(560,250,t,14.3)+(t>16?[0,1,2,3,4].map(k=>{const a=k*1.25+t*2;return sparkle(470+Math.cos(a)*120,420+Math.sin(a)*80,10+5*Math.sin(t*9+k),'#FFE066')}).join(''):''),
 sfx:[['bells',.3,.5],['steps',.4,4.2],['pop',2,.4],['whoosh',5,.3],['hmm',6.6,.4],['pop',10.2,.4],['swish',14,.7],['sparkle',14.3,.6],['fanfare72',14.5,.5],['boing',16.2,.3],['sparkle',16.3,.4]],
 music:[[0,20,'march',.6]],
 caps:["In busy Paris, d'Artagnan meets Captain Tréville, the leader of the Musketeers.","“You are brave,” says the Captain, “but a Musketeer must also be wise and loyal. First, prove yourself!”"],
});

// ---------- 3 OOPS ----------
const ROOM3=()=>room('#F3D9B1','#C98C5A','#9A6236')+[200,640,1080].map(x=>`<path d="M${x-50} 60 H${x+50} V230 L${x} 200 L${x-50} 230Z" fill="#2C6BE0" class="o"/><path d="M${x} 100 V170 M${x-22} 125 H${x+22}" stroke="#fff" stroke-width="10"/>`).join('');
SCENES.push({name:'s3',dur:20,
 bg:ROOM3, shakes:[[2.0,8],[5.0,8],[8.6,6]],
 actors:[
  {id:'hanky',type:'p',svg:`<path d="M-26 -6 Q0 -16 26 -6 L22 8 Q0 2 -22 8Z" fill="#fff" class="o"/><path d="M-10 -4 l6 6 M6 -6 l4 8" stroke="#3EC1D3" stroke-width="3"/>`,keys:[{t:0,x:1000,y:652},{t:8.6,sy:.5,y:658,d:.15}]},
  {id:'athos',o:'athos',keys:[{t:0,x:330,y:645,s:1.1,turn:1},{t:2.0,lean:-16,eyeS:1.3,open:true,d:.12},{t:2.6,lean:0,open:false,eyeS:1,d:.3},{t:10.5,brows:'angry'},{t:11,arm:-85,elbow:-12,talk:1.8,d:.3}]},
  {id:'dart',o:'dart',keys:[{t:0,x:-150,y:645,s:1.1},{t:.5,x:250,d:1.5,run:1.5,e:'lin'},{t:2.0,x:200,lift:-30,d:.15,eyeS:1.3,open:true,turn:1,flip:false},{t:2.3,lift:0,d:.2},{t:3.6,x:600,d:1.4,run:1.4,e:'lin',eyeS:1,open:false},{t:5.1,shiver:1.6},{t:6.8,x:760,d:.35,hop:.4,eyeS:1.3},{t:7.4,x:930,d:1.2,run:1.2,e:'lin',eyeS:1},{t:8.6,eyeS:1.3,open:true,d:.1},{t:9.6,x:820,d:.6,walk:.6,open:false},{t:10.3,turn:1,flip:true},{t:10.6,eyeS:1.25,pupil:.7,brows:'worried'},{t:13.3,flip:false},{t:15.4,turn:0,d:.3},{t:15.5,shiver:4.5,eyeS:1.4,pupil:.55}]},
  {id:'porthos',o:'porthos',keys:[{t:0,x:640,y:645,s:1.15,turn:1},{t:5.0,cape:45,d:.2,eyeS:1.3,open:true},{t:6.6,cape:0,d:.4,open:false,eyeS:1},{t:10.5,brows:'angry'},{t:12.2,arm:-85,elbow:-12,talk:1.8,d:.3}]},
  {id:'aramis',o:'aramis',keys:[{t:0,x:1010,y:645,s:1.1,turn:1,flip:true},{t:8.7,eyeS:1.3,open:true,d:.1},{t:10.5,brows:'angry',open:false,eyeS:1},{t:13.4,arm:-85,elbow:-12,talk:1.8,d:.3}]},
 ],
 cam:[{t:0,z:1,cx:640,cy:360},{t:15.5,z:2.0,cx:820,cy:450,d:1}],
 fx:t=>pt('OUCH!',330,330,t,2.1,3.4,'#FF5E7A',-8,60)+pt('Oops!',220,380,t,2.4,3.6,'#FFC93C',6,46)+pt('HEY!',640,320,t,5.2,6.6,'#FF5E7A',6,60)+pt('Oops!',640,250,t,5.6,6.8,'#FFC93C',-6,46)
   +say('My hanky!',1010,290,t,8.8,10.4)+pt('Oops!',900,370,t,8.9,10.2,'#FFC93C',4,46)
   +say('Meet me at NOON!',330,300,t,11,13.2,{size:28})+say('At NOON!',640,290,t,12.2,14.4,{size:28})+say('NOON!',1010,300,t,13.4,15.4,{size:28})
   +(t>15.6?pt('Gulp!',820,300,t,16,19.6,'#FFFFFF',-6,56)+`<path d="M${862} ${470-((t*30)%20)} q8 14 0 20 q-8 -6 0 -20Z" fill="#9EE7FF" class="o" style="stroke-width:2"/>`:''),
 hud:t=>t>15.5?`<g opacity="${seg(t,15.5,16)}">${bigClock(1150,110,0,0)}</g>`:'',
 sfx:[['run',.5,1.5],['boing',2.0,.5],['pop',2.1,.4],['run',3.6,1.4],['boing',5.0,.5],['whoosh',5.1,.4],['pop',6.8,.4],['run',7.4,1.2],['squish',8.6,.6],['wahwah',10.5,.5],['pop',11,.35],['pop',12.2,.35],['pop',13.4,.35],['ticks',15.5,4.4],['gulp',16,.6]],
 music:[[0,20,'tiptoe',.6]],
 caps:["Rushing through Tréville's house, d'Artagnan bumps into Athos, tangles in Porthos's cape and steps on Aramis's hanky.","All three are cross, and each one says: “Meet me at noon for a sword contest!” Gulp!"],
});

// ---------- 4 ALL FOR ONE ----------
const H4=[260,420,580,740],G4=[990,1130,1270];
function lungeKeys(i,t0){return [{t:t0,hop:.15},{t:t0+.45,hop:.4},{t:t0,x:H4[i]+170,arm:-100,elbow:0,arm2:80,elbow2:-20,lean:8,open:true,d:.15,e:'out'},{t:t0+.45,x:H4[i],arm:-50,elbow:-72,arm2:38,elbow2:-95,lean:0,open:false,d:.4}]}
function guardKeys(j){const hf=8.25+j*.7+.1;return [{t:0,x:1600+j*140,y:640,flip:true,turn:1,drawn:true,arm:-50,elbow:-72,arm2:-20,elbow2:-60},{t:2.5+j*.15,x:G4[j],d:2,walk:2,e:'lin'},
  {t:hf,eyeS:1.3,pupil:.6,open:true,arm:92,elbow:48,arm2:-92,elbow2:-48,d:.15,hatX:-260,hatY:-520,hatR:-720,e:'out'},{t:hf,hop:.35},{t:hf+.8,hatO:0,d:.3},
  {t:11.5+j*.1,x:G4[j]+1000,d:1.4,e:'in',run:1.5}]}
SCENES.push({name:'s4',dur:20,
 bg:()=>FIELD(160)+treeC(1200,560,.9),
 actors:[
  {id:'g0',o:'guard',keys:guardKeys(0)},{id:'g1',o:'guard',keys:guardKeys(1)},{id:'g2',o:'guard',keys:guardKeys(2)},
  {id:'athos',o:'athos',keys:[{t:0,x:H4[0],y:640,turn:1,drawn:true,arm:-50,elbow:-72,arm2:-20,elbow2:-60,brows:'angry'},{t:5,brows:'calm'},...lungeKeys(0,8),{t:13,cheer:1.4},{t:14.6,x:420,d:.8,walk:.8},{t:15.5,turn:0,flip:false,d:0},{t:15.6,hop:.6,arm:-150,elbow:0,arm2:125,elbow2:-35,d:.3,open:true}]},
  {id:'porthos',o:'porthos',keys:[{t:0,x:H4[1],y:640,turn:1,drawn:true,arm:-50,elbow:-72,arm2:-20,elbow2:-60,brows:'angry'},{t:5,brows:'calm'},...lungeKeys(1,8.7),{t:13.05,cheer:1.4},{t:14.6,x:555,d:.8,walk:.8},{t:15.5,turn:0,flip:false,d:0},{t:15.65,hop:.6,arm:-150,elbow:0,arm2:125,elbow2:-35,d:.3,open:true}]},
  {id:'aramis',o:'aramis',keys:[{t:0,x:H4[2],y:640,turn:1,drawn:true,arm:-50,elbow:-72,arm2:-20,elbow2:-60,brows:'angry'},{t:5,brows:'calm'},...lungeKeys(2,9.4),{t:13.1,cheer:1.4},{t:14.6,x:725,d:.8,walk:.8},{t:15.5,turn:0,flip:true,d:0},{t:15.7,hop:.6,arm:-150,elbow:0,arm2:125,elbow2:-35,d:.3,open:true}]},
  {id:'dart',o:'dart',keys:[{t:0,x:900,y:640,turn:1,flip:true,drawn:true,arm:-50,elbow:-72,arm2:-20,elbow2:-60,brows:'determined'},{t:5.8,hop:.5,x:H4[3],d:.5,talk:1.2},{t:7.6,flip:false},...lungeKeys(3,10.1),{t:13.15,cheer:1.4},{t:14.6,x:860,d:.8,walk:.8},{t:15.5,turn:0,flip:true,d:0},{t:15.75,hop:.6,arm:-150,elbow:0,arm2:125,elbow2:-35,d:.3,open:true}]},
 ],
 cam:[{t:0,z:1,cx:640,cy:360},{t:7.8,z:1.35,cx:H4[0]+260,cy:430,d:.3},{t:8.6,cx:H4[1]+260,d:.25},{t:9.3,cx:H4[2]+260,d:.25},{t:10,cx:H4[3]+260,d:.25},{t:10.9,z:1,cx:640,cy:360,d:.5},{t:15.8,z:1.12,cx:640,cy:380,d:1}],
 fx:t=>{let s=pt('NOON!',640,140,t,.3,2.4,'#FFC93C',0,72)+say('HALT!',G4[0]-40,330,t,4.4,5.8,{c:'#D7263D',size:44})+say("I'm with you!",740,300,t,6.1,7.8);
   [0,1,2,3].forEach(i=>{const L=8+i*.7;if(t>L+.05&&t<L+.6)s+=swish(H4[i]+250,530,seg(t,L+.05,L+.6),i)});
   [0,1,2].forEach(j=>{const hf=8.35+j*.7;s+=pt(['SWISH!','CLANG!','POP!'][j],H4[j]+330,300,t,hf-.05,hf+.75,'#FFC93C',8,58)});
   s+=pt('Hooray!',640,250,t,13.1,14.5,'#3EC1D3',0,60);
   s+=sparkBurst(640,265,t,16.0,'#FFE066');
   [0,1,2].forEach(j=>{const a=seg(t,11.5+j*.1,12.9+j*.1);if(a>0&&a<1)s+=speedLines(G4[j]+a*a*1000+110,520,a)});
   return s},
 hud:t=>(t<2.6?`<g opacity="${1-seg(t,2.2,2.6)}">${bigClock(1150,110,0,0)}</g>`:'')+bannerAt(t,16.2)+confetti(t,16.1,70),
 sfx:[['bong',.3,.7],['bong',1.0,.5],['march',2.5,2.2],['halt',4.4,.5],['boing',5.8,.4],['pop',6.1,.3],['swish',8,.9],['swish',8.7,.9],['swish',9.4,.9],['swish',10.1,.9],['clang',8.35,.7],['clang',9.05,.7],['clang',9.75,.7],['pop',8.4,.4],['pop',9.1,.4],['pop',9.8,.4],['run',11.5,1.4],['whoosh',11.6,.5],['cheer',13,.6],['clang',15.95,.8],['fanfare72',16.1,.7],['sparkle',16.05,.7],['cheer',16.2,.8]],
 music:[[0,15.8,'march',.75],[15.8,20,'party',.9]],
 caps:["At noon, the Cardinal's guards march in to stop the contest. D'Artagnan doesn't run away. He stands with the three Musketeers!","Together they send the guards' hats flying. Now they are four friends: All for one, one for all!"],
});

// ---------- 5 CARDINAL'S PLAN ----------
const ROOM5=()=>room('#5E3F8F','#3A2A5E','#C9A227')+windowC(170,90,140,260,moonC(70,80)+starsC(6,3,250))+windowC(970,90,140,260,starsC(8,9,250))+curtain(0,'#C62E4A')+curtain(1280,'#C62E4A',true);
SCENES.push({name:'s5',dur:20,
 bg:ROOM5,
 actors:[
  {id:'shadow',type:'p',svg:`<path d="M-60 0 Q-70 -200 -20 -300 Q0 -360 20 -300 Q70 -200 60 0Z" fill="#20163a" opacity=".28"/>`,keys:[{t:0,x:-200,y:560,s:1.4},{t:.5,x:500,d:4,e:'lin',s:1.9},{t:9.6,x:620,d:.5}]},
  {id:'king',o:'king',keys:[{t:0,x:840,y:645,s:1.3,look:-3},{t:4.4,turn:1,flip:true,d:.4},{t:9.8,tilt:-8,d:.4},{t:11.2,tilt:4,d:.3},{t:11.6,tilt:-6,d:.3},{t:13.5,tilt:0,eyeS:1.2,open:true,d:.2},{t:13.8,talk:2.4},{t:14,clap:2.6,hop:2.4}]},
  {id:'card',o:'cardinal',keys:[{t:0,x:-160,y:645,s:1.25,brows:'sly'},{t:.5,x:560,d:4.2,tiptoe:4.2,e:'lin'},{t:4.75,turn:1,flip:false,arm:-40,elbow:-60,arm2:-52,elbow2:-40,d:.3},{t:9.6,x:660,lean:10,arm:-95,elbow:-40,d:.5,talk:3.6},{t:13.5,lean:0,arm:-40,elbow:-60,d:.4}],
   dyn:t=>(t>4.9&&t<9.6)||t>13.9?{elbow:-60+Math.sin(t*12)*12,elbow2:-40-Math.sin(t*12)*12}:{}},
 ],
 cam:[{t:0,z:1,cx:640,cy:360},{t:16.5,z:1.9,cx:620,cy:430,d:1}],
 fx:t=>{let s='';const cp=seg(t,4.9,5.4),co=seg(t,9.0,9.4);
   if(cp>0&&co<1)s+=thought(`<g transform="translate(-60,-10)">${jewelBox(-28)}${boxStuds(0,0,t,12)}</g><path d="M70 -10 H120 M106 -24 L122 -10 L106 4" stroke="#20163a" stroke-width="6" fill="none" stroke-linecap="round"/><g transform="translate(130,40) scale(.45)"><path d="M-90 -20 H90 L60 30 H-60Z" fill="#9A6236" class="o"/><path d="M0 -20 V-130" stroke="#5A3A20" stroke-width="8"/><path d="M6 -124 Q70 -70 6 -30Z" fill="#F7F1E3" class="o"/></g>`,480,240,back(cp)*(1-co)*.95);
   if(t>9.8&&t<13.4)s+=pt('psst... psst...',700,300,t,9.9,13.3,'#FFE066',-6,42);
   s+=pt('!',860,250,t,13.5,14.4,'#FFC93C',0,90)+say('A ROYAL BALL!',860,250,t,14,16.5,{size:34})+pt('Hehehe...',620,280,t,16.9,19.6,'#FF5E7A',-6,60);
   return s},
 sfx:[['tiptoe',.5,4.2],['whoosh',4.9,.4],['sparkle',5.2,.5],['whisper',9.8,.6],['whisper',11.2,.6],['ding',13.5,.6],['pop',14,.4],['claps',14,2.6],['hehe',16.9,.8],['dundun',17.6,.8]],
 music:[[0,16.5,'tiptoe',.6],[16.5,20,'tense',.45]],
 caps:["The King once gave Queen Anne twelve sparkling diamonds. She gave them to a friend in England as a present.","Sneaky Cardinal Richelieu knows, and whispers to the King: “Ask the Queen to wear her diamonds at the Royal Ball!”"],
});

// ---------- 6 SECRET MISSION ----------
const ROOM6=()=>room('#3B4A8C','#2A2F5E','#C9A227')+windowC(1000,80,160,280,moonC(80,90)+starsC(8,4,280))+table(640,520,200,'#7A4A22')+candle(640,520,1.3);
SCENES.push({name:'s6',dur:20,
 bg:ROOM6,
 actors:[
  {id:'queen',o:'queen',keys:[{t:0,x:300,y:650,s:1.35,turn:1,brows:'worried',arm:-40,elbow:-50,arm2:-50,elbow2:-35},{t:.4,x:400,d:1.6,walk:1.6},{t:2.4,x:280,d:1.8,walk:1.8},{t:4.4,x:320,d:.6,walk:.6},{t:5.0,flip:false},{t:12.8,brows:'calm'},{t:17.6,wave:2.4,brows:'calm'}]},
  {id:'cons',o:'constance',keys:[{t:0,x:540,y:650,s:1.15,turn:1,flip:true,arm:-40,elbow:-50,arm2:-50,elbow2:-35},{t:5,eyeS:1.2,hop:.5},{t:5.3,talk:2},{t:7.6,x:1450,d:1.3,run:1.3,e:'in'},{t:9.6,x:560,d:1.8,walk:1.8,e:'lin'},{t:11.5,flip:true},{t:17.6,cheer:2.4}]},
  {id:'dart',o:'dart',keys:[{t:0,x:1550,y:650,s:1.2,turn:1,flip:true},{t:9.6,x:840,d:1.9,walk:1.9,e:'lin'},{t:11.6,flip:true,lean:20,d:.3},{t:12.4,lean:0,d:.3,brows:'determined'},{t:12.8,arm:92,elbow:48,talk:1.8,d:.3},{t:17.6,cheer:2.4}]},
  {id:'athos',o:'athos',keys:[{t:0,x:1500,y:650,s:1.05,turn:1,flip:true},{t:15.6,x:1010,d:.6,hop:.6},{t:17.6,cheer:2.4}]},
  {id:'porthos',o:'porthos',keys:[{t:0,x:1600,y:650,s:1.05,turn:1,flip:true},{t:15.75,x:1120,d:.6,hop:.6},{t:17.6,cheer:2.4}]},
  {id:'aramis',o:'aramis',keys:[{t:0,x:1700,y:650,s:1.05,turn:1,flip:true},{t:15.9,x:1230,d:.6,hop:.6},{t:17.6,cheer:2.4}]},
 ],
 fx:t=>say('Oh no... my diamonds!',330,250,t,.8,4.6,{size:30})+pt('!',540,330,t,5,5.9,'#FFC93C',0,80)+say('I know who can help!',560,320,t,5.4,7.6,{size:30})
   +pt('knock knock',1150,300,t,8.9,9.9,'#FFFFFF',8,40)+say("I'll bring them back!",840,280,t,12.9,15.4,{size:30})+pt('Us too!',1120,300,t,16.1,17.9,'#FFC93C',-4,60)+sparkBurst(1120,330,t,15.9,'#FFE066'),
 sfx:[['harp',.3,.5],['sigh',1.0,.4],['ding',5,.6],['pop',5.4,.3],['run',7.6,1.3],['knock',8.9,.8],['steps',9.6,1.9],['swish',12.8,.6],['fanfare72',13,.4],['boing',15.6,.3],['boing',15.75,.3],['boing',15.9,.3],['pop',16.1,.4],['cheer',17.6,.7]],
 music:[[0,15.6,'waltz',.5],[15.6,20,'party',.75]],
 caps:["The Queen is worried. Her kind friend Constance knows just who can help: d'Artagnan!","“I will bring the diamonds back in time!” he promises. And of course, his three friends come too."],
});

// ---------- 7 ROAD TO THE SEA ----------
function stayKeys(x0,t0){return [{t:t0,x:240,d:.9,e:'io'},{t:t0+.6,rDrawn:true,rArm:100,rElbow:0,d:.2},{t:t0+3,x:-450,d:1.4,e:'in'}]}
SCENES.push({name:'s7',dur:20,
 bg:()=>`<rect x="-300" y="-300" width="1880" height="1300" fill="url(#sunset)"/>`,
 bgDyn:t=>{let s=sunC(1080,170,70,'#FFB347')+[0,1].map(k=>cloud(((k*700-t*60)%1700+1700)%1700-200,100+k*40,1,'#FFE8D0')).join('')+hillsStrip(t*130,520,'#E8B76A',700);
   for(let k=0;k<6;k++){const x=((k*340-t*560)%2040+2040)%2040-300;s+=treeC(x,630,.7+rnd(k)*.3)}
   s+=`<rect x="-300" y="630" width="1880" height="400" fill="#C9A06A"/><path d="M-300 630 H1580" stroke="#20163a" stroke-width="4"/>`;
   for(let k=0;k<26;k++){const x=((k*80-t*950)%2080+2080)%2080-300;s+=`<ellipse cx="${x}" cy="${665+(k%3)*24}" rx="22" ry="7" fill="#B48A55"/>`}
   const sp=eout(seg(t,15.5,18.5));if(sp>0)s+=`<g transform="translate(${lerp(1700,1060,sp)},0)"><path d="M0 720 V560 Q200 540 400 560 V720Z" fill="#3E7BC4" class="o"/>${waveP(600,8,40,t*3,'#5A9BE0',true).replace('M-60 900 L-60','M0 900 L0').replace(/L1340 900Z/,'L400 900Z')}<g transform="translate(180,575) rotate(${Math.sin(t*2)*4})"><path d="M-80 -14 H80 L56 22 H-56Z" fill="#9A6236" class="o"/><path d="M-10 -14 V-140" stroke="#5A3A20" stroke-width="7"/><path d="M-4 -134 Q60 -90 -4 -40Z" fill="#F7F1E3" class="o"/></g></g>`;
   return s},
 actors:[
  {id:'g0',o:'guard',keys:[{t:0,x:-300,y:660,s:.95,turn:1,drawn:true,gspd:950},{t:4,x:90,d:1,run:4.4,e:'out'},{t:5,arm:-95,elbow:0,d:.2},{t:7,x:-500,d:1.4,e:'in'}]},
  {id:'g1',o:'guard',keys:[{t:0,x:-300,y:660,s:.95,turn:1,drawn:true,gspd:950},{t:8.5,x:90,d:1,run:4.4,e:'out'},{t:9.5,arm:-95,elbow:0,d:.2},{t:11.5,x:-500,d:1.4,e:'in'}]},
  {id:'g2',o:'guard',keys:[{t:0,x:-300,y:660,s:.95,turn:1,drawn:true,gspd:950},{t:12.5,x:90,d:1,run:4.4,e:'out'},{t:13.5,arm:-95,elbow:0,d:.2},{t:15.5,x:-500,d:1.4,e:'in'}]},
  {id:'hr',type:'h',col:'#A0522D',keys:[{t:0,x:300,y:670,s:.8,rider:'aramis',run:20,spd:950},...stayKeys(300,8.5)]},
  {id:'hp',type:'h',col:'#6E4A2E',keys:[{t:0,x:520,y:670,s:.82,rider:'porthos',run:20,spd:950},...stayKeys(520,4)]},
  {id:'ha',type:'h',col:'#8A5A3B',keys:[{t:0,x:740,y:670,s:.8,rider:'athos',run:20,spd:950},...stayKeys(740,12.5)]},
  {id:'hd',type:'h',col:'#FFD84D',keys:[{t:0,x:960,y:670,s:.82,rider:'dart',run:20,spd:950},{t:15,x:700,d:2.5}]},
 ],
 fx:t=>{let s='';[[5,'Go on!'],[9.5,"Don't stop!"],[13.5,"Go, d'Artagnan!"]].forEach(([a,txt])=>{s+=say(txt,330,300,t,a,a+2.1,{size:30})+pt('CLANG!',170,430,t,a-.1,a+.8,'#FFC93C',8,48)});
   s+=pt('To the sea!',900,200,t,17,19.6,'#FFFFFF',-4,64);
   s+=[0,1,2,3].map(k=>`<path d="M${120-((t*900+k*90)%240)} ${470+k*45} h-${70+k*20}" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity=".8"/>`).join('');return s},
 sfx:[['hooves',0,20],['hooves2',0,20],['run',4,1],['clang',4.95,.7],['pop',5,.3],['run',8.5,1],['clang',9.45,.7],['pop',9.5,.3],['run',12.5,1],['clang',13.45,.7],['pop',13.5,.3],['waves',15.5,4.5],['fanfare67',17,.5]],
 music:[[0,20,'gallop',.8]],
 caps:["The four friends gallop toward the sea, but the Cardinal's guards try to stop them all along the road.","One by one, Porthos, Aramis and Athos stay behind to hold them back. “Go on, d'Artagnan! Don't stop!”"],
});

// ---------- 8 TWO ARE MISSING ----------
const BG8=()=>`<rect x="-300" y="-300" width="1880" height="1300" fill="url(#grey)"/>`+cloud(200,90,1.2,'#F3F6FB')+cloud(900,70,1,'#F3F6FB')
 +`<g transform="translate(220,560)"><path d="M-200 0 V-220 H-170 V-250 H-140 V-220 H-110 V-250 H-80 V-220 H-50 V-330 H-20 V-360 H10 V-330 H40 V-220 H70 V-250 H100 V-220 H130 V-250 H160 V-220 H200 V0Z" fill="#B7C3DC" class="o"/><path d="M-20 0 V-60 Q0 -90 20 -60 V0Z" fill="#6E7B98" class="o"/></g>`
 +`<rect x="-300" y="560" width="1880" height="500" fill="#A8B98F"/><path d="M-300 560 H1580" stroke="#20163a" stroke-width="4"/>`
 +`<g transform="translate(615,0)"><rect x="-120" y="616" width="240" height="14" rx="4" fill="#8A5A33" class="o"/><rect x="-100" y="630" width="12" height="30" fill="#8A5A33" class="o"/><rect x="88" y="630" width="12" height="30" fill="#8A5A33" class="o"/></g>`
 +`<clipPath id="mw"><rect x="1020" y="150" width="180" height="230" rx="90"/></clipPath><rect x="1020" y="150" width="180" height="230" rx="90" fill="#3A2F5E"/>`;
SCENES.push({name:'s8',dur:20,
 bg:BG8,
 actors:[
  {id:'milady',o:'milady',clip:'url(#mw)',keys:[{t:0,x:1110,y:640,s:.85,turn:1,flip:true,look:-4},{t:14.6,y:415,d:.5,e:'out'},{t:15.2,tilt:-8,arm:-80,elbow:40,d:.3},{t:17.6,y:700,d:.6,e:'in'}]},
  {id:'buck',o:'buck',keys:[{t:0,x:800,y:650,s:1.15,turn:1,flip:true},{t:3.2,lean:14,d:.3,talk:2},{t:3.9,lean:0,d:.3},{t:6.2,arm:-70,elbow:-25,d:.3},{t:7.0,arm:-20,elbow:12,d:.3},{t:11.6,eyeS:1.35,pupil:.6,open:true,arm:92,elbow:48,arm2:-92,elbow2:-48,d:.15},{t:18.4,open:false,eyeS:1,pupil:1,brows:'worried',arm:-20,elbow:12,arm2:14,elbow2:-12,d:.3}]},
  {id:'dart',o:'dart',keys:[{t:0,x:-150,y:650,s:1.15},{t:.4,x:440,d:2.6,walk:2.6,e:'lin'},{t:3.0,turn:1,flip:false},{t:3.4,lean:16,d:.3},{t:4.2,lean:0,d:.3},{t:11.6,eyeS:1.35,pupil:.6,open:true,arm:92,elbow:48,arm2:-92,elbow2:-48,d:.15},{t:18.4,open:false,eyeS:1,pupil:1,brows:'worried',arm:-20,elbow:12,arm2:14,elbow2:-12,d:.3}]},
  {id:'twod',type:'p',clip:'url(#mw)',svg:`<path d="M-14 -16 L0 0 L-14 16 L-28 0Z" fill="#EFFFFF" class="o" style="stroke-width:2.5"/><path d="M14 -16 L28 0 L14 16 L0 0Z" fill="#EFFFFF" class="o" style="stroke-width:2.5"/>`,keys:[{t:0,att:'milady-armh',ox:14,oy:-4,s:.7}]},
 ],
 pre:t=>{},
 cam:[{t:0,z:1,cx:640,cy:360},{t:5.6,z:2.3,cx:615,cy:540,d:.8},{t:11.6,z:1,cx:640,cy:360,d:0},{t:14.2,z:2.1,cx:1110,cy:290,d:0},{t:18.3,z:1,cx:640,cy:360,d:0}],
 fx:t=>{const lid=lerp(0,-110,eout(seg(t,6.5,6.9)));const lit=t<7.2?0:Math.min(10,Math.floor((t-7.2)/.3)+1);
   const bx=`<g transform="translate(615,590) scale(.9)">${jewelBox(lid)}${t>6.6?boxStuds(0,0,t,lit,t>10.2?[10,11]:[],t>10.2):''}</g>`;
   let s=bx+say('Welcome, my friend!',780,300,t,3.2,5.4,{size:30})+sparkBurst(615,560,t,6.6,'#FFFFFF');
   if(t>7.2&&t<11.6)s+=`<g transform="translate(615,470)"><circle r="26" fill="#2C2160" class="o"/><text class="t" text-anchor="middle" y="10" font-size="28" fill="#FFC93C">${lit}</text></g>`;
   s+=pt('?!',700,480,t,10.4,11.6,'#FF5E7A',0,50)+pt('Only TEN?!',640,170,t,11.7,14.1,'#FF5E7A',-4,72)+pt('Hee hee hee!',1110,200,t,15.4,17.8,'#B983FF',-6,40);
   s+=`<rect x="1020" y="150" width="180" height="230" rx="90" fill="none" class="o" style="stroke-width:6"/><rect x="1004" y="372" width="212" height="26" fill="#B7C3DC" class="o"/>`;
   return s},
 sfx:[['harp',.2,.4],['steps',.4,2.6],['pop',3.2,.3],['whoosh',5.6,.4],['creak',6.5,.5],['sparkle',6.6,.6],...[...Array(10)].map((_,k)=>['ding'+k,7.2+k*.3,.4]),['wahwah',10.4,.5],['shock',11.6,.6],['whoosh',14.2,.3],['hehehi',15.4,.7],['whoosh',17.6,.4]],
 music:[[0,11.6,'tiptoe',.5],[11.6,20,'tense',.5]],
 caps:["D'Artagnan sails to England and finds the Duke of Buckingham. The Duke opens the box and... oh no! Only ten diamonds!","Sneaky Milady, the Cardinal's spy, has snipped two away! Hee hee hee!"],
});

// ---------- 9 JEWELER ----------
SCENES.push({name:'s9',dur:20,
 bg:()=>room('#5A3E2A','#3A2818','#8A5A33'),
 bgDyn:t=>windowC(140,70,160,260,moonC(lerp(20,140,t/11),lerp(140,60,t/11))+starsC(10,7,260)),
 actors:[
  {id:'jew',o:'jeweler',extra:{hold:`<g transform="translate(0,30) rotate(40)"><rect x="-4" y="0" width="8" height="40" fill="#8A5A33" class="o"/><rect x="-16" y="36" width="32" height="16" rx="4" fill="#9AA2B1" class="o"/></g>`},keys:[{t:0,x:600,y:650,s:1.3,turn:1},{t:0,hammer:11.3},{t:11.5,arm:92,elbow:48,arm2:-30,elbow2:-20,d:.3,open:true},{t:13,cheer:3},{t:16.5,arm:-20,elbow:12,arm2:14,elbow2:-12,open:false,d:.3}]},
  {id:'dart',o:'dart',keys:[{t:0,x:1080,y:650,s:1.1,turn:1,flip:true},{t:.5,sleepy:11.3},{t:12.2,eyeS:1.3,hop:.5},{t:12.8,cheer:3.4},{t:16.5,eyeS:1,d:.2}]},
 ],
 cam:[{t:0,z:1,cx:640,cy:360},{t:14.6,z:2.4,cx:900,cy:500,d:.8}],
 fx:t=>{let s=table(700,560,540,'#9A6236')+candle(450,560,1)+`<path d="M770 560 h70 l-8 -14 h-54Z" fill="#6B6F7A" class="o"/>`;
   const hp=(t*2.2)%1;if(t<11.3&&hp<.25)s+=[0,1,2,3,4].map(k=>`<circle cx="${805+Math.cos(k*1.3)*hp*120}" cy="${540-Math.abs(Math.sin(k*1.3))*hp*120}" r="${5*(1-hp*3)}" fill="#FFE066"/>`).join('');
   if(t>11.5)s+=(t<12.6?burst(805,500,seg(t,11.5,12.4),'#FFE066'):'');
   s+=`<g transform="translate(920,546) scale(.55)">${jewelBox(-110)}${boxStuds(0,0,t,t>11.6?12:10)}</g>`;
   if(t<11.6)s+=studC(790,530,14)+studC(822,530,14);
   s+=pt('tap tap tap!',820,330,t,1,3.6,'#FFE066',6,52)+pt('tap tap tap!',820,330,t,6,8.6,'#FFE066',-4,52);
   if(t>3&&t<11.4)s+=[0,1,2].map(k=>{const p=((t-3)*.5+k/3)%1;return `<text class="t" font-size="${30+p*20}" fill="#FFFFFF" opacity="${1-p}" x="${1110+p*60}" y="${380-p*100}">Z</text>`}).join('');
   s+=pt('TA-DA!',920,360,t,11.8,14.2,'#FFC93C',0,64)+pt('Twelve again!',920,440,t,15.4,19.6,'#FFFFFF',-4,34);
   if(t>15.2)s+=sparkBurst(920,520,t,15.2,'#FFFFFF');
   return s},
 hud:t=>t<11.4?`<g transform="scale(.7) translate(1680,140)">${bigClock(0,0,t,900)}</g>`:'',
 sfx:[['taps',0,11.3],['snore',3,8.2],['fanfare72',11.8,.6],['boing',12.2,.3],['cheer',12.8,.4],['sparkle',15.2,.7],['sparkle',16.4,.4]],
 music:[[0,11.5,'tiptoe',.45],[11.8,20,'party',.65]],
 caps:["The Duke's jeweler works all night long, tap-tap-tapping by candlelight.","By morning, two new diamonds sparkle just like the others. Now there are twelve again!"],
});
