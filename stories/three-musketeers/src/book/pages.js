// ===== the 15 pages =====
const SIL=(inner)=>`<g filter="url(#cut)">${inner}</g>`;
const WASH=(o=.35)=>`<rect width="1100" height="1100" fill="#fff" filter="url(#wash)" opacity="${o}" style="mix-blend-mode:soft-light"/>`;
const MUSK=(x,y,s,f,extra)=>man({x,y,s,f,sword:'hip',...extra});
const PAGES=[];

// 0 COVER — four friends, swords raised, before a great golden sun
PAGES.push(()=>{let s=`<rect width="1100" height="1100" fill="url(#gDusk)"/>`+WASH()+sunDisc(550,560,250,'#FFD27A','#FFB65C');
 s+=layer('M-40 1140 L-40 760 L60 760 L60 700 L90 700 L90 660 L120 660 L120 740 L200 740 L200 690 L230 650 L260 690 L260 750 L330 750 L330 600 L350 560 L370 600 L370 720 L430 720 L430 700 L520 700 L520 730 L600 730 L600 640 L630 640 L630 600 L660 600 L660 640 L690 640 L690 730 L780 730 L780 690 L860 690 L860 640 L880 600 L900 640 L900 740 L1000 740 L1000 700 L1140 700 L1140 1140Z','#B9729A');
 s+=layer(hillPath(860,30,1),'#7A3F6E');
 s+=SIL([
  MUSK(330,880,1.32,1,{arms:[-20,10,150,10],sword:'front',swordOff:0,legs:[-18,6,14,4],capeW:34,beard:true,hair:'short'}),
  MUSK(470,885,1.42,1,{arms:[-30,20,160,10],sword:'front',legs:[-14,6,10,4],capeW:30,mustache:true,big:true}),
  MUSK(640,885,1.32,-1,{arms:[-20,10,160,8],sword:'front',legs:[-16,6,14,4],capeW:30,hair:'long'}),
  MUSK(780,880,1.28,-1,{arms:[-20,10,150,10],sword:'front',legs:[-20,8,18,4],capeW:38,hair:'long'}),
 ].join(''));
 s+=twinkle(555,310,26)+twinkle(510,340,12)+twinkle(600,330,10)+birds(820,240,4,1.1);
 return s});

// 1 GOODBYE GASCONY
PAGES.push(()=>{let s=`<rect width="1100" height="1100" fill="url(#gDawn)"/>`+WASH()+sunDisc(840,330,90,'#FFE29A','#FFD08A');
 s+=layer(hillPath(640,40,2),'#B8D49A')+layer(hillPath(740,34,4),'#8DBB7A');
 // farmhouse
 s+=`<g filter="url(#paper)"><path d="M120 760 V600 L220 520 L320 600 V760Z" fill="#E9C9A0"/><path d="M100 610 L220 505 L340 610 L320 616 L220 532 L120 616Z" fill="#B5583F"/><rect x="200" y="660" width="44" height="100" rx="20" fill="#6E4A33"/><rect x="140" y="630" width="40" height="40" fill="#F5D987"/><rect x="262" y="630" width="40" height="40" fill="#F5D987"/></g>`;
 s+=layer(hillPath(900,18,7),'#5E9A62');
 s+=SIL(lady({x:150,y:905,s:1.15,f:1,bonnet:true,arms:[10,20,150,20],headTilt:-6})+man({x:270,y:905,s:1.18,f:1,hat:true,plume:false,cape:false,beard:true,arms:[10,10,160,20],legs:[-4,2,4,2]})
  +horse({x:720,y:905,s:1.15,f:1,saddle:true,headUp:10,tail:-6,rider:{arms:[30,40,150,20],plume:true,hair:'long',sword:'hip',capeW:24,f:1}}));
 s+=birds(560,250,5,1.1)+`<path d="M760 340 Q840 280 920 340" stroke="#FFFFFF" stroke-width="3" fill="none" opacity=".0"/>`;
 return s});

// 2 PARIS
PAGES.push(()=>{let s=`<rect width="1100" height="1100" fill="url(#gDay)"/>`+WASH();
 s+=`<g filter="url(#paper)"><path d="M430 780 V420 H480 V380 H510 V420 H560 V780Z M600 780 V420 H650 V380 H680 V420 H730 V780Z M500 780 V500 L580 470 L660 500 V780Z" fill="#B7B4DA"/><path d="M579 470 L579 300" stroke="#B7B4DA" stroke-width="10"/><circle cx="580" cy="560" r="34" fill="#E8E2F6"/></g>`;
 const roofs=(y,col,seed)=>{let d=`M-40 1140 L-40 ${y}`;let x=-40;let k=0;while(x<1140){const w=90+rnd(seed+k)*80,h=rnd(seed+k+9)*90;d+=` L${x} ${y-h} L${x+w*.5} ${y-h-50} L${x+w} ${y-h}`;if(rnd(k+seed)>.5)d+=` L${x+w*.75} ${y-h-20} L${x+w*.75} ${y-h-46} L${x+w*.82} ${y-h-46} L${x+w*.82} ${y-h-14}`;x+=w;k++}return d+` L1140 ${y} L1140 1140Z`};
 s+=layer(roofs(820,0,3).replace(/L-40 820/,'L-40 820'),'#8E88C2');
 s+=layer(roofs(880,0,11),'#5C5592');
 for(let k=0;k<14;k++){const x=40+rnd(k)*1000,y=760+rnd(k+3)*120;s+=`<rect x="${x}" y="${y}" width="16" height="22" rx="7" fill="#F7D774" opacity=".9"/>`}
 s+=`<path d="M-20 300 Q300 400 620 320 Q900 250 1120 330" stroke="${INK}" stroke-width="2.5" fill="none"/>`+[...Array(14)].map((_,k)=>{const p=k/13,x=-20+p*1140,y=300+Math.sin(p*Math.PI)*60*(p<.55?1:.4)-(p>.55?(p-.55)*30:0);return `<path d="M${x} ${y} l14 0 l-7 22Z" fill="${['#E45B5B','#F2C14E','#5BB3D8','#7BC67E'][k%4]}"/>`}).join('');
 s+=`<rect x="0" y="950" width="1100" height="150" fill="#D8C7A6" filter="url(#rough)"/>`;
 s+=SIL(man({x:400,y:960,s:1.35,f:1,lean:22,arms:[40,20,80,30],legs:[-24,8,18,4],hatOff:true,hair:'long',sword:'hip',capeW:26,hold:(fa)=>hatSVG(fa[0]+10,fa[1]+16,1,70,true)})
  +man({x:720,y:960,s:1.42,f:-1,big:true,mustache:true,beard:true,arms:[40,-60,100,0],legs:[-8,4,8,4],sword:'hip',capeW:30}));
 return s});

// 3 OOPS
PAGES.push(()=>{let s=`<rect width="1100" height="1100" fill="#EFD9B4"/>`+WASH(.4);
 s+=`<g filter="url(#paper)">${[160,550,940].map(x=>`<path d="M${x-55} 120 H${x+55} V330 L${x} 300 L${x-55} 330Z" fill="#3E6BB5"/><path d="M${x} 170 V260 M${x-26} 200 H${x+26}" stroke="#F5EBDD" stroke-width="12"/>`).join('')}</g>`;
 s+=`<g filter="url(#paper)"><path d="M0 760 L0 560 L140 560 L140 620 L280 620 L280 680 L420 680 L420 760Z" fill="#B98A5E"/></g>`;
 s+=`<rect x="0" y="900" width="1100" height="200" fill="#A9774F" filter="url(#paper)"/>`;
 s+=`<path d="M890 905 l40 -10 l14 14 l-44 6Z" fill="#FFFFFF" filter="url(#rough)"/>`;
 s+=SIL(man({x:300,y:905,s:1.3,f:1,lean:-14,arms:[150,20,120,40],legs:[-20,6,10,4],beard:true,sword:'hip',hatTilt:-24})
  +man({x:470,y:880,s:1.28,f:1,lean:28,arms:[100,10,120,10],legs:[-50,60,40,10],hair:'long',sword:'hip',capeW:44,hatTilt:20})
  +man({x:690,y:905,s:1.38,f:-1,big:true,mustache:true,arms:[30,80,60,80],legs:[-8,4,8,4],capeW:60,sword:'hip'})
  +man({x:930,y:905,s:1.3,f:-1,hair:'long',arms:[20,40,100,-30],legs:[-10,4,10,4],sword:'hip',headTilt:20}));
 s+=`<g fill="${INK}" opacity=".85">${[[400,560],[420,600],[392,620]].map(([x,y])=>`<path d="M${x} ${y} l-40 -6" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`).join('')}</g>`;
 s+=twinkle(370,520,18,'#F2C14E')+twinkle(820,600,14,'#F2C14E');
 return s});

// 4 NOON — guards arrive, d'Artagnan joins the musketeers
PAGES.push(()=>{let s=`<rect width="1100" height="1100" fill="url(#gNoon)"/>`+WASH()+sunDisc(550,150,60,'#FFF1B8','#FFF6CF');
 s+=`<g filter="url(#paper)"><path d="M820 760 V420 H900 V760Z" fill="#C9B79C"/><path d="M810 430 L860 360 L910 430Z" fill="#A65E4A"/><circle cx="860" cy="500" r="30" fill="#F7EEDC"/><path d="M860 500 V476" stroke="${INK}" stroke-width="4"/></g>`;
 s+=layer(hillPath(720,30,5),'#A9CF8F')+layer(hillPath(900,14,9),'#6FA56C');
 s+=SIL(MUSK(150,905,1.18,1,{beard:true,arms:[-10,10,50,-20],legs:[-10,4,10,4]})+MUSK(290,905,1.25,1,{big:true,mustache:true,arms:[-10,10,40,-10],legs:[-8,4,8,4]})+MUSK(420,905,1.18,1,{hair:'long',arms:[-10,10,50,-20],legs:[-10,4,10,4]})
  +man({x:580,y:905,s:1.2,f:1,hair:'long',arms:[-20,10,96,0],sword:'front',swordOff:-30,legs:[-20,8,26,4],capeW:30})
  +[0,1,2].map(k=>man({x:770+k*120,y:905,s:1.2,f:-1,mustache:true,arms:[-10,10,70,20],sword:'front',swordOff:-40,legs:[-10,4,10,4],plume:true,hatTilt:-4})).join(''));
 s+=birds(140,240,3,1);
 return s});

// 5 SWISH CLANG POP
PAGES.push(()=>{let s=`<rect width="1100" height="1100" fill="url(#gNoon)"/>`+WASH()+layer(hillPath(720,30,6),'#A9CF8F')+layer(hillPath(900,14,8),'#6FA56C');
 s+=SIL(MUSK(170,905,1.2,1,{beard:true,lean:16,arms:[-60,10,90,0],sword:'front',legs:[-40,10,40,10],capeW:40})
  +MUSK(330,905,1.26,1,{big:true,mustache:true,lean:12,arms:[-50,20,100,0],sword:'front',legs:[-36,10,36,10],capeW:40})
  +MUSK(500,905,1.2,1,{hair:'long',lean:16,arms:[-60,20,95,0],sword:'front',legs:[-40,10,40,10],capeW:44})
  +MUSK(640,880,1.22,1,{hair:'long',arms:[-40,20,150,20],sword:'front',legs:[-30,60,40,-30],capeW:46})
  +man({x:850,y:905,s:1.18,f:1,hatOff:true,mustache:true,lean:-12,arms:[150,30,140,30],legs:[-30,10,30,10]})
  +man({x:990,y:905,s:1.18,f:1,hatOff:true,mustache:true,lean:-18,arms:[120,40,160,40],legs:[-44,30,40,10]}));
 s+=`<g filter="url(#cut)">${hatSVG(820,420,1,-60,true)}${hatSVG(980,300,1,40,true)}${hatSVG(700,240,1,160,true)}</g>`;
 s+=[[790,470],[960,360],[690,300]].map(([x,y],k)=>`<path d="M${x-40} ${y+40} q-20 20 -10 40" stroke="#FFFFFF" stroke-width="4" fill="none" opacity=".8" stroke-linecap="round"/>`).join('');
 s+=twinkle(600,560,22,'#FFF6D5')+twinkle(560,600,10,'#FFF6D5');
 return s});

// 6 CARDINAL'S PLAN
PAGES.push(()=>{let s=`<rect width="1100" height="1100" fill="#4A3474"/>`+WASH(.3);
 s+=`<g filter="url(#paper)">${window_(120,140,180,470,'url(#gNight)')}${window_(800,140,180,470,'url(#gNight)')}</g>`+stars(14,4,0).replace(/./g,(c)=>c);
 s+=`<g>${[0,1,2,3,4,5].map(k=>twinkle(150+rnd(k)*120,220+rnd(k+3)*300,4,'#FFF6D5')+twinkle(830+rnd(k+7)*120,220+rnd(k+9)*300,4,'#FFF6D5')).join('')}<circle cx="240" cy="260" r="30" fill="#FFF3C4"/></g>`;
 s+=`<path d="M0 0 Q160 260 70 700 L0 700Z" fill="#B23A48" filter="url(#paper)"/><path d="M1100 0 Q940 260 1030 700 L1100 700Z" fill="#B23A48" filter="url(#paper)"/>`;
 s+=`<rect x="0" y="860" width="1100" height="240" fill="#2E2150" filter="url(#paper)"/>`;
 s+=`<path d="M300 860 C300 600 360 330 470 300 C540 290 560 420 520 860Z" fill="#20163a" opacity=".35"/>`;
 s+=`<g filter="url(#paper)"><rect x="740" y="760" width="200" height="16" fill="#8A5A33"/><rect x="760" y="776" width="12" height="90" fill="#8A5A33"/><rect x="908" y="776" width="12" height="90" fill="#8A5A33"/><rect x="780" y="728" width="120" height="34" rx="6" fill="#B97A4A"/></g>`+glowAt(840,730,90,'',.6)+[0,1,2,3,4,5].map(k=>diamond(796+k*18,744,6,true)).join('');
 s+=SIL(robe({x:420,y:870,s:1.32,f:1,skullcap:true,beard:true,lean:14,arms:[20,40,120,100]})+robe({x:620,y:870,s:1.42,f:-1,crown:true,wig:true,mustache:true,cape:true,headTilt:-12,arms:[10,20,20,30]}));
 return s});

// 7 SECRET MISSION
PAGES.push(()=>{let s=`<rect width="1100" height="1100" fill="#2F3F7A"/>`+WASH(.3);
 s+=`<g filter="url(#paper)">${window_(800,120,200,430,'url(#gNight)')}</g><circle cx="900" cy="250" r="44" fill="#FFF3C4"/>`+[0,1,2,3].map(k=>twinkle(830+rnd(k)*140,320+rnd(k+2)*180,5)).join('');
 s+=`<rect x="0" y="880" width="1100" height="220" fill="#232A55" filter="url(#paper)"/>`;
 s+=glowAt(470,640,320,'',.8)+`<g filter="url(#paper)"><rect x="420" y="720" width="110" height="14" fill="#8A5A33"/><rect x="436" y="734" width="10" height="150" fill="#8A5A33"/><rect x="504" y="734" width="10" height="150" fill="#8A5A33"/><rect x="465" y="660" width="20" height="60" fill="#FFF6E0"/></g><path d="M475 616 Q462 640 475 658 Q488 640 475 616Z" fill="#FFB43A"/>`;
 s+=`<path d="M1040 880 V420 H1100 V880Z" fill="#E8C878" opacity=".5" filter="url(#paper)"/>`;
 s+=SIL(lady({x:220,y:890,s:1.45,f:1,crown:true,bun:true,arms:[20,60,40,70],headTilt:-8,wide:1.1})
  +lady({x:380,y:890,s:1.25,f:1,bonnet:true,arms:[10,30,60,60]})
  +man({x:700,y:890,s:1.32,f:-1,hair:'long',lean:-24,arms:[10,30,40,100],legs:[-80,100,10,4],sword:'hip',capeW:30})
  +[0,1,2].map(k=>man({x:960+k*70,y:890,s:1.05,f:-1,arms:[-10,10,150-k*10,20],legs:[-6,4,6,4],sword:'hip',beard:k==0,mustache:k==1,hair:k==2?'long':'short',capeW:20})).join(''));
 return s});

// 8 ROAD TO THE SEA
PAGES.push(()=>{let s=`<rect width="1100" height="1100" fill="url(#gSunset)"/>`+WASH()+sunDisc(880,520,110,'#FFE0A0','#FFC07A');
 s+=`<rect x="700" y="560" width="440" height="80" fill="#6FA9C9" filter="url(#paper)"/>`;
 s+=layer(hillPath(600,24,3),'#D9926E')+layer(hillPath(700,30,6),'#B26A5E');
 s+=layer('M-40 1140 L-40 780 Q300 700 600 760 Q850 810 1140 720 L1140 1140Z','#6E3B55');
 s+=SIL([[180,820,.62,'porthos',2.6],[380,800,.66,'aramis',1.2],[580,790,.7,'athos',4.1],[800,760,.74,'dart',0.2]].map(([x,y,sc,who,ph])=>horse({x,y,s:sc,f:1,ph,saddle:true,rider:{plume:true,lean:10,arms:[40,40,70,40],hair:who=='aramis'||who=='dart'?'long':'short',big:who=='porthos',beard:who=='athos',sword:'hip',capeW:40}})).join('')
  +[0,1].map(k=>horse({x:-10+k*90,y:850,s:.45,f:1,ph:k*1.7+.5,rider:{plume:false,lean:10,arms:[40,40,90,10],mustache:true,sword:'front',capeW:20}})).join(''));
 s+=birds(420,300,4,1);
 return s});

// 9 ONLY TEN
PAGES.push(()=>{let s=`<rect width="1100" height="1100" fill="url(#gGrey)"/>`+WASH(.35);
 s+=`<g filter="url(#paper)"><path d="M60 760 V420 H110 V380 H150 V420 H200 V380 H240 V420 H300 V300 H330 V260 H370 V300 H400 V420 H460 V760Z" fill="#A9B3CC"/><path d="M230 760 V680 Q260 640 290 680 V760Z" fill="#6E7B98"/></g>`;
 s+=`<g filter="url(#paper)"><path d="M800 760 V200 H1060 V760Z" fill="#B7BFD3"/>${window_(880,300,110,180,'#3A2F5E')}</g>`;
 s+=SIL(lady({x:935,y:500,s:.5,f:-1,longHair:true,feather:true,arms:[10,40,150,30],hold:(fa)=>''}));
 s+=diamond(905,372,7,true)+diamond(925,380,7,true);
 s+=`<rect x="0" y="880" width="1100" height="220" fill="#8FA07E" filter="url(#paper)"/>`;
 s+=SIL(man({x:300,y:890,s:1.32,f:1,hair:'long',lean:-6,arms:[120,40,150,30],legs:[-10,4,10,4],sword:'hip',capeW:24})
  +man({x:690,y:890,s:1.36,f:-1,mustache:true,beard:true,arms:[150,40,140,30],legs:[-8,4,8,4],capeW:30,sword:'hip'}));
 s+=`<g filter="url(#paper)"><rect x="410" y="740" width="200" height="60" rx="10" fill="#8A5A33"/><rect x="410" y="690" width="200" height="50" rx="10" fill="#B97A4A"/><rect x="420" y="752" width="180" height="36" rx="6" fill="#4A2A5E"/></g>`;
 s+=[...Array(12)].map((_,k)=>diamond(432+k*14.5,770,6,k<10)).join('')+glowAt(510,760,120,'',.5);
 return s});

// 10 JEWELER
PAGES.push(()=>{let s=`<rect width="1100" height="1100" fill="#3A2A22"/>`+WASH(.25);
 s+=`<g filter="url(#paper)">${window_(110,140,220,360,'url(#gNight)')}</g><circle cx="230" cy="260" r="36" fill="#FFF3C4"/>`+[0,1,2,3,4].map(k=>twinkle(140+rnd(k)*160,320+rnd(k+3)*150,5)).join('');
 s+=glowAt(560,640,360,'',.85);
 s+=`<rect x="0" y="880" width="1100" height="220" fill="#24170F" filter="url(#paper)"/>`;
 s+=SIL(robe({x:600,y:885,s:1.15,f:1,beard:true,arms:[40,60,150,-20],hold:()=>`<g transform="translate(78,-330) rotate(30)"><rect x="-4" y="0" width="8" height="46"/><rect x="-16" y="-10" width="32" height="14" rx="3"/></g>`})
  +`<path d="M900 712 H1020 V728 H900Z M910 728 H924 V884 H910Z M1000 728 H1014 V884 H1000Z M1006 712 H1022 V560 Q1014 548 1006 560Z" fill="${INK}"/>`
  +man({x:960,y:880,s:1.15,f:-1,hair:'long',lean:-14,headTilt:34,arms:[10,40,30,60],legs:[80,-80,70,-70],sword:'hip',capeW:10}));
 s+=`<g filter="url(#paper)"><rect x="380" y="700" width="460" height="22" fill="#7A4E2E"/><rect x="400" y="722" width="18" height="160" fill="#7A4E2E"/><rect x="800" y="722" width="18" height="160" fill="#7A4E2E"/><rect x="420" y="640" width="22" height="60" fill="#FFF6E0"/></g><path d="M431 596 Q418 620 431 638 Q444 620 431 596Z" fill="#FFB43A"/>`;
 s+=`<path d="M740 700 h60 l-8 -12 h-44Z" fill="#555" filter="url(#rough)"/>`+diamond(760,670,12,true)+diamond(796,670,12,true)+[0,1,2,3,4].map(k=>`<path d="M${770+Math.cos(k*1.3)*50} ${640-Math.abs(Math.sin(k*1.3))*50} l${Math.cos(k*1.3)*16} ${-Math.abs(Math.sin(k*1.3))*16}" stroke="#FFD25A" stroke-width="3" stroke-linecap="round"/>`).join('');
 s+=`<text x="1000" y="560" font-family="Georgia,serif" font-size="40" fill="#F5E6C8" opacity=".85" font-style="italic">z</text><text x="1030" y="510" font-family="Georgia,serif" font-size="54" fill="#F5E6C8" opacity=".7" font-style="italic">z</text>`;
 return s});

// 11 STORM
PAGES.push(()=>{let s=`<rect width="1100" height="1100" fill="url(#gStorm)"/>`+WASH(.4);
 s+=`<path d="M760 0 L690 240 L760 240 L660 470 L860 200 L780 200 L850 0Z" fill="#FFF07A" filter="url(#rough)"/>`+glowAt(760,240,300,'',.4);
 s+=layer(hillPath(640,40,2),'#2E4F86');
 s+=`<g transform="translate(470,640) rotate(-12)" filter="url(#cut)"><path d="M-220 -30 H220 L170 60 H-170Z" fill="${INK}"/><path d="M-40 -30 V-420" stroke="${INK}" stroke-width="12"/><path d="M-30 -410 Q140 -280 -30 -100Z" fill="#F2EAD8"/>${man({x:60,y:-30,s:1.05,f:1,hair:'long',lean:-10,arms:[160,20,170,10],legs:[-30,10,30,6],capeW:60,sword:'hip'})}</g>`;
 s+=layer(hillPath(760,50,5),'#3E6DAE')+layer(hillPath(880,40,8),'#5B8FCB');
 for(let k=0;k<26;k++){const x=rnd(k)*1100,y=740+rnd(k+4)*200;s+=`<circle cx="${x}" cy="${y}" r="${6+rnd(k)*8}" fill="#EAF4FF" opacity=".85"/>`}
 for(let k=0;k<90;k++){const x=rnd(k+50)*1200-50,y=rnd(k+90)*1000;s+=`<path d="M${x} ${y} l-14 36" stroke="#CFE0FF" stroke-width="2.5" opacity=".6" stroke-linecap="round"/>`}
 return s});

// 12 BALL — the Cardinal giggles, the Queen arrives
PAGES.push(()=>{let s=`<rect width="1100" height="1100" fill="#F2D18C"/>`+WASH(.35);
 s+=`<g filter="url(#paper)">${[0,1,2,3].map(k=>window_(40+k*280,180,140,420,'url(#gNight)')).join('')}</g>`+[0,1,2,3].map(k=>`<rect x="${210+k*280-40}" y="120" width="44" height="680" fill="#FFE7B3" filter="url(#paper)"/>`).join('');
 s+=`<path d="M300 0 V60 M300 60 Q550 160 800 60" stroke="#C9A227" stroke-width="8" fill="none"/>`+[360,450,550,650,740].map(x=>glowAt(x,100,60,'',.7)+`<rect x="${x-5}" y="96" width="10" height="24" fill="#FFF6E0"/>`).join('');
 s+=`<rect x="0" y="860" width="1100" height="240" fill="#9A3A30" filter="url(#paper)"/>`;
 s+=`<path d="M760 860 V430 A110 110 0 0 1 980 430 V860Z" fill="#FFF3D0" filter="url(#paper)"/>`+glowAt(870,560,300,'',.9);
 s+=SIL(lady({x:370,y:860,s:.75,f:1,arms:[100,30,60,40],bun:true})+man({x:430,y:860,s:.75,f:-1,arms:[90,30,40,40],cape:false,plume:true})
  +lady({x:560,y:860,s:.72,f:-1,arms:[110,20,60,40],longHair:true})+man({x:500,y:860,s:.72,f:1,arms:[100,30,40,40],cape:false})
  +lady({x:870,y:870,s:1.25,f:-1,crown:true,bun:true,arms:[10,60,20,70],wide:1.1})
  +robe({x:200,y:900,s:1.5,f:1,skullcap:true,beard:true,arms:[20,80,30,90],headTilt:-10}));
 s+=[0,1,2,3,4,5,6].map(k=>`<g transform="translate(${400+k*40},${380-Math.sin(k)*40})" fill="#6A4C9C" opacity=".6"><path d="M0 0 V-30 L16 -36 V-6" stroke="#6A4C9C" stroke-width="3" fill="none"/><circle cx="-4" cy="0" r="6"/><circle cx="12" cy="-6" r="6"/></g>`).join('');
 return s});

// 13 ALL TWELVE
PAGES.push(()=>{let s=`<rect width="1100" height="1100" fill="#F2D18C"/>`+WASH(.35)+glowAt(560,520,520,'',.9);
 s+=`<g filter="url(#paper)">${[0,1,2,3].map(k=>window_(40+k*280,180,140,420,'url(#gNight)')).join('')}</g>`+[0,1,2,3].map(k=>`<rect x="${210+k*280-40}" y="120" width="44" height="680" fill="#FFE7B3" filter="url(#paper)"/>`).join('');
 s+=`<rect x="0" y="880" width="1100" height="220" fill="#9A3A30" filter="url(#paper)"/>`;
 s+=SIL(robe({x:170,y:900,s:1.25,f:1,skullcap:true,beard:true,arms:[150,100,150,100],lean:-8})
  +robe({x:350,y:900,s:1.35,f:1,crown:true,wig:true,mustache:true,cape:true,arms:[150,10,160,10]})
  +lady({x:570,y:900,s:1.5,f:-1,crown:true,bun:true,arms:[20,50,40,60],wide:1.12})
  +lady({x:790,y:900,s:1.15,f:-1,bonnet:true,arms:[150,10,160,10]})
  +man({x:930,y:900,s:1.22,f:-1,hair:'long',arms:[-10,10,160,0],sword:'front',legs:[-10,4,10,4],capeW:24}));
 const nx=570,ny=900-1.5*222;s+=[...Array(12)].map((_,k)=>{const a=(k/11-.5)*2.4;return diamond(nx+Math.sin(a)*1.5*26*-1,ny+Math.cos(a)*1.5*14,7,true)}).join('');
 s+=[0,1,2,3,4,5,6,7].map(k=>twinkle(520+Math.cos(k*.8)*130,560+Math.sin(k*.8)*90-180,10+rnd(k)*8,'#FFFFFF')).join('');
 return s});

// 14 THE END — friends forever under the stars
PAGES.push(()=>{let s=`<rect width="1100" height="1100" fill="url(#gTwilight)"/>`+WASH(.3)+stars(70,9,560);
 s+=[[250,220,'#F2C14E'],[820,180,'#E45B5B'],[560,120,'#7BC0E8']].map(([x,y,c])=>[...Array(14)].map((_,k)=>{const a=k/14*Math.PI*2;return `<path d="M${x+Math.cos(a)*20} ${y+Math.sin(a)*20} L${x+Math.cos(a)*70} ${y+Math.sin(a)*70}" stroke="${c}" stroke-width="4" stroke-linecap="round" opacity=".9"/>`}).join('')+`<circle cx="${x}" cy="${y}" r="10" fill="#FFF6D5"/>`).join('');
 s+=layer('M-40 1140 L-40 700 L80 700 L80 640 L110 640 L110 610 L140 610 L140 690 L260 690 L260 600 L300 520 L340 600 L340 690 L420 690 L420 560 L450 560 L450 500 L480 500 L480 560 L510 560 L510 680 L620 680 L620 640 L700 640 L700 690 L780 690 L780 560 L800 520 L820 560 L820 700 L940 700 L940 650 L1140 650 L1140 1140Z','#3A3470');
 for(let k=0;k<20;k++){s+=`<rect x="${30+rnd(k+40)*1040}" y="${640+rnd(k+60)*70}" width="10" height="14" rx="4" fill="#F7D774"/>`}
 s+=layer(hillPath(860,26,4),'#241E4A');
 s+=SIL(MUSK(380,870,1.2,1,{beard:true,arms:[-20,10,150,10],sword:'front',legs:[-14,6,14,4]})+MUSK(500,870,1.28,1,{big:true,mustache:true,arms:[-20,10,160,10],sword:'front',legs:[-10,4,10,4]})
  +MUSK(640,870,1.22,-1,{hair:'long',arms:[-20,10,160,8],sword:'front',legs:[-14,6,14,4]})+MUSK(760,870,1.2,-1,{hair:'long',arms:[-20,10,150,10],sword:'front',legs:[-14,6,14,4]}));
 s+=twinkle(570,450,20)+twinkle(540,480,9);
 return s});
