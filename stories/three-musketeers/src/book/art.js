// ===== Paper-cut silhouette picture-book kit =====
var INK='#1E1A2B';
const R=(a)=>a*Math.PI/180;
function P(x,y){return `${x.toFixed(1)} ${y.toFixed(1)}`}
function end(x,y,len,ang,f){return [x+Math.sin(R(ang))*len*f,y+Math.cos(R(ang))*len]}
function limb(x0,y0,l1,a1,w1,l2,a2,w2,f){const [x1,y1]=end(x0,y0,l1,a1,f);const [x2,y2]=end(x1,y1,l2,a1+a2,f);
  return {svg:`<path d="M${P(x0,y0)} L${P(x1,y1)}" stroke="${INK}" stroke-width="${w1}" stroke-linecap="round"/><path d="M${P(x1,y1)} L${P(x2,y2)}" stroke="${INK}" stroke-width="${w2}" stroke-linecap="round"/>`,knee:[x1,y1],tip:[x2,y2],dir:a1+a2}}
function boot(x,y,f,cuffAt){let s=`<path d="M${P(x-6*f,y-18)} L${P(x+6*f,y-18)} L${P(x+8*f,y-6)} Q${P(x+26*f,y-6)} ${P(x+27*f,y)} L${P(x-9*f,y)}Z" fill="${INK}"/>`;
  if(cuffAt)s+=`<path d="M${P(cuffAt[0]-11,cuffAt[1]-6)} L${P(cuffAt[0]+11,cuffAt[1]-6)} L${P(cuffAt[0]+7,cuffAt[1]+12)} L${P(cuffAt[0]-7,cuffAt[1]+12)}Z" fill="${INK}"/>`;return s}
function swordAt(hx,hy,ang,f,len){const [x2,y2]=end(hx,hy,len,ang,f);const [gx,gy]=end(hx,hy,8,ang,f);const pa=ang+90;const [c1x,c1y]=end(gx,gy,12,pa,f);const [c2x,c2y]=end(gx,gy,-12,pa,f);
  return `<path d="M${P(hx,hy)} L${P(x2,y2)}" stroke="${INK}" stroke-width="3.6" stroke-linecap="round"/><path d="M${P(c1x,c1y)} L${P(c2x,c2y)}" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`}
function hatSVG(cx,cy,f,tilt,plume,flying){
  const t=tilt*f;const HI=window.HATINK||INK;return `<g transform="translate(${cx},${cy}) rotate(${t}) scale(1.15)" fill="${HI}"><ellipse cx="0" cy="0" rx="40" ry="7" fill="${HI}"/><path d="M-18 0 Q-19 -30 0 -31 Q19 -30 18 0Z" fill="${HI}"/>${plume?`<path d="M${-6*f} -20 C${-30*f} -48 ${-62*f} -40 ${-74*f} -12 C${-64*f} -26 ${-46*f} -30 ${-36*f} -18 C${-50*f} -26 ${-30*f} -34 ${-10*f} -14Z" fill="${INK}"/><path d="M${-8*f} -18 C${-34*f} -40 ${-60*f} -30 ${-70*f} -4" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>`:''}</g>`}
// ---- man (musketeer / guard / captain / duke / jeweler) ----
// o: x,y,s,f, legs:[aBack,kBack,aFront,kFront], arms:[aBack,eBack,aFront,eFront], sword:'front'|'back'|'hip'|null, hat, plume, cape, capeW, hair:'long'|'short', beard, lean, headTilt, big
function man(o){
  const f=o.f||1,s=o.s||1;const L=o.legs||[-6,4,6,4],A=o.arms||[-8,10,10,14];const w=o.big?1.25:1;
  let g='';
  const hip=[0,-150],sh=[0,-238];
  // cape (behind)
  if(o.cape!==false){const cw=o.capeW??20;g+=`<path d="M${P(-8*f,-254)} C${P(-34*f,-226)} ${P((-36-cw*.8)*f,-180)} ${P((-34-cw)*f,-128)} L${P((-12-cw*.3)*f,-132)} C${P(-20*f,-170)} ${P(-16*f,-210)} ${P(4*f,-248)}Z" fill="${INK}"/>`}
  // back leg & arm
  const lb=limb(hip[0]-3*f,hip[1],76,L[0],26*w,70,L[1],18,f);g+=lb.svg+boot(lb.tip[0],lb.tip[1]+6,f,lb.knee);
  const ab=limb(sh[0]-4*f,sh[1],56,A[0],17,52,A[1],13,f);g+=ab.svg+`<circle cx="${ab.tip[0]}" cy="${ab.tip[1]}" r="9" fill="${INK}"/>`;
  if(o.sword==='back')g+=swordAt(ab.tip[0],ab.tip[1],ab.dir+(o.swordOff||0),f,118);
  // torso + tunic
  g+=`<path d="M${P(7*f,-266)} C${P(30*f*w,-248)} ${P(30*f*w,-210)} ${P(20*f*w,-182)} L${P(22*f*w,-150)} L${P(36*f*w,-116)} L${P(-34*f*w,-116)} L${P(-22*f*w,-150)} C${P(-24*f*w,-190)} ${P(-24*f*w,-228)} ${P(-12*f,-252)} L${P(-7*f,-266)}Z" fill="${INK}"/><path d="M${P(-16*f,-256)} L${P(20*f,-256)} L${P(26*f,-240)} L${P(-18*f,-242)}Z" fill="${INK}"/>`;
  // scabbard
  if(o.sword==='hip'||o.scabbard)g+=`<path d="M${P(-6*f,-146)} L${P(-62*f,-70)}" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`;
  // front leg
  const lf=limb(hip[0]+3*f,hip[1],76,L[2],26*w,70,L[3],18,f);g+=lf.svg+boot(lf.tip[0],lf.tip[1]+6,f,lf.knee);
  // head
  const ht=o.headTilt||0;let h=`<circle cx="${2*f}" cy="-282" r="19"/><path d="M${P(18*f,-290)} L${P(27*f,-279)} L${P(17*f,-275)}Z"/><path d="M${P(4*f,-268)} L${P(18*f,-268)} L${P(12*f,-258)} L${P(-6*f,-262)}Z"/><path d="M${P(-8*f,-272)} L${P(8*f,-270)} L${P(6*f,-258)} L${P(-10*f,-258)}Z"/>`;
  if(o.hair==='long')h+=`<path d="M${P(-14*f,-290)} C${P(-26*f,-270)} ${P(-24*f,-246)} ${P(-14*f,-236)} L${P(-4*f,-252)}Z"/>`;
  if(o.beard)h+=`<path d="M${P(10*f,-268)} L${P(16*f,-252)} L${P(4*f,-262)}Z"/>`;
  if(o.mustache)h+=`<path d="M${P(14*f,-273)} q${8*f} 2 ${12*f} -4 q${-4*f} 8 ${-12*f} 6Z"/>`;
  if(o.bald)h+=`<circle cx="${2*f}" cy="-282" r="17"/>`;
  if(o.glasses)h+=`<circle cx="${12*f}" cy="-284" r="5" fill="none" stroke="${INK}" stroke-width="2"/>`;
  g+=`<g fill="${INK}" transform="rotate(${ht*f},0,-262)">${h}${o.hat!==false&&!o.hatOff?hatSVG(2*f,-296,f,o.hatTilt??-8,o.plume!==false):''}${o.cap?`<path d="M${P(-15*f,-290)} Q${P(2*f,-312)} ${P(19*f,-290)}Z"/>`:''}</g>`;
  // front arm
  const af=limb(sh[0]+4*f,sh[1],56,A[2],17,52,A[3],13,f);g+=af.svg+`<circle cx="${af.tip[0]}" cy="${af.tip[1]}" r="9" fill="${INK}"/><circle cx="${sh[0]+4*f}" cy="${sh[1]+4}" r="13" fill="${INK}"/>`;
  if(o.sword==='front')g+=swordAt(af.tip[0],af.tip[1],af.dir+(o.swordOff||0),f,122);
  if(o.hold)g+=o.hold(af.tip,ab.tip,f);
  return `<g transform="translate(${o.x},${o.y}) scale(${s}) rotate(${(o.lean||0)*f},0,-150)">${g}</g>`;
}
// ---- lady in gown ----
function lady(o){const f=o.f||1,s=o.s||1;const A=o.arms||[10,40,20,50];let g='';
  const sh=[0,-226];
  const ab=limb(sh[0]-4*f,sh[1],50,A[0],12,46,A[1],10,f);g+=ab.svg+`<circle cx="${ab.tip[0]}" cy="${ab.tip[1]}" r="6" fill="${INK}"/>`;
  const sw=o.wide||1;
  g+=`<path d="M${P(4*f,-250)} C${P(16*f,-236)} ${P(14*f,-214)} ${P(9*f,-186)} C${P(40*f*sw,-120)} ${P(66*f*sw,-40)} ${P(74*f*sw,0)} L${P(-70*f*sw,0)} C${P(-62*f*sw,-40)} ${P(-36*f*sw,-120)} ${P(-10*f,-186)} C${P(-14*f,-214)} ${P(-14*f,-236)} ${P(-4*f,-250)}Z" fill="${INK}"/>`;
  g+=`<circle cx="${-2*f}" cy="-224" r="12" fill="${INK}"/>`;
  let h=`<circle cx="${2*f}" cy="-268" r="15.5"/><path d="M${P(15*f,-273)} L${P(21*f,-266)} L${P(14*f,-263)}Z"/><path d="M${P(-4*f,-258)} L${P(6*f,-256)} L${P(3*f,-246)} L${P(-6*f,-246)}Z"/>`;
  if(o.bun)h+=`<circle cx="${-14*f}" cy="-276" r="10"/>`;
  if(o.longHair)h+=`<path d="M${P(-12*f,-282)} C${P(-30*f,-256)} ${P(-26*f,-222)} ${P(-16*f,-196)} L${P(-2*f,-236)}Z"/>`;
  if(o.crown)h+=`<path d="M${P(-12*f,-282)} L${P(-12*f,-298)} L${P(-6*f,-288)} L${P(1*f,-302)} L${P(8*f,-288)} L${P(14*f,-298)} L${P(14*f,-282)}Z"/>`;
  if(o.bonnet)h+=`<path d="M${P(-18*f,-262)} C${P(-22*f,-292)} ${P(14*f,-298)} ${P(20*f,-276)} L${P(10*f,-282)} C${P(0*f,-288)} ${P(-10*f,-282)} ${P(-12*f,-262)}Z"/>`;
  if(o.feather)h+=`<path d="M${P(-10*f,-284)} C${P(-30*f,-310)} ${P(-48*f,-300)} ${P(-52*f,-286)} C${P(-40*f,-296)} ${P(-26*f,-294)} ${P(-14*f,-280)}Z"/>`;
  g+=`<g fill="${INK}" transform="rotate(${(o.headTilt||0)*f},0,-250)">${h}</g>`;
  const af=limb(sh[0]+4*f,sh[1],50,A[2],12,46,A[3],10,f);g+=af.svg+`<circle cx="${af.tip[0]}" cy="${af.tip[1]}" r="6" fill="${INK}"/>`;
  g+=`<circle cx="${4*f}" cy="-224" r="12" fill="${INK}"/>`;
  if(o.hold)g+=o.hold(af.tip,ab.tip,f);
  return `<g transform="translate(${o.x},${o.y}) scale(${s}) rotate(${(o.lean||0)*f},0,-120)">${g}</g>`}
// ---- robe man (cardinal / king) ----
function robe(o){const f=o.f||1,s=o.s||1;const A=o.arms||[8,30,14,40];let g='';const sh=[0,-238];
  const sleeve=(a)=>{const r=limb(sh[0],sh[1],54,a[0],16,50,a[1],18,f);return r.svg+`<circle cx="${r.tip[0]}" cy="${r.tip[1]}" r="7" fill="${INK}"/>`};
  if(o.cape)g+=`<path d="M${P(-6*f,-248)} C${P(-50*f,-200)} ${P(-70*f,-80)} ${P(-80*f,0)} L${P(30*f,0)} L${P(10*f,-240)}Z" fill="${INK}"/>`;
  g+=sleeve(A.slice(0,2));
  g+=`<path d="M${P(6*f,-264)} C${P(26*f,-246)} ${P(26*f,-200)} ${P(28*f,-150)} C${P(34*f,-90)} ${P(42*f,-30)} ${P(46*f,0)} L${P(-44*f,0)} C${P(-40*f,-40)} ${P(-30*f,-120)} ${P(-24*f,-180)} C${P(-22*f,-220)} ${P(-16*f,-246)} ${P(-6*f,-264)}Z" fill="${INK}"/>`;
  let h=`<circle cx="${2*f}" cy="-282" r="17"/><path d="M${P(16*f,-288)} L${P(25*f,-278)} L${P(15*f,-275)}Z"/><path d="M${P(-6*f,-270)} L${P(8*f,-268)} L${P(4*f,-258)} L${P(-8*f,-258)}Z"/>`;
  if(o.beard)h+=`<path d="M${P(8*f,-270)} L${P(14*f,-246)} L${P(0,-266)}Z"/>`;
  if(o.mustache)h+=`<path d="M${P(13*f,-273)} q${10*f} 3 ${14*f} -5 q${-4*f} 10 ${-14*f} 7Z"/>`;
  if(o.skullcap)h+=`<path d="M${P(-14*f,-292)} Q${P(2*f,-310)} ${P(18*f,-292)}Z"/>`;
  if(o.wig)h+=[[-14,-292],[-20,-276],[-20,-258],[-16,-242],[-6,-300],[8,-302]].map(([x,y])=>`<circle cx="${x*f}" cy="${y}" r="10"/>`).join('');
  if(o.crown)h+=`<path d="M${P(-14*f,-296)} L${P(-14*f,-314)} L${P(-7*f,-303)} L${P(1*f,-318)} L${P(9*f,-303)} L${P(16*f,-314)} L${P(16*f,-296)}Z"/>`;
  g+=`<g fill="${INK}" transform="rotate(${(o.headTilt||0)*f},0,-262)">${h}</g>`;
  g+=sleeve(A.slice(2,4));
  if(o.hold)g+=o.hold(null,null,f);
  return `<g transform="translate(${o.x},${o.y}) scale(${s}) rotate(${(o.lean||0)*f},0,-120)">${g}</g>`}
// ---- horse ----
function horse(o){const f=o.f||1,s=o.s||1;const ph=o.ph;let g='';
  const run=ph!==undefined;
  const leg=(x,y,a1,a2,front)=>{const r=limb(x,y,58,a1,front?22:28,60,a2,13,1);return r.svg+`<path d="M${P(r.tip[0]-6,r.tip[1]-2)} L${P(r.tip[0]+8,r.tip[1]-2)} L${P(r.tip[0]+9,r.tip[1]+7)} L${P(r.tip[0]-7,r.tip[1]+7)}Z" fill="${INK}"/>`};
  const L=run?[[70,-130,18+Math.sin(ph)*42,-(Math.max(0,-Math.cos(ph))*95+4),1],[54,-130,8+Math.sin(ph+.7)*42,-(Math.max(0,-Math.cos(ph+.7))*95+4),1],[-60,-138,-14+Math.sin(ph+2.6)*36,Math.max(0,Math.cos(ph+2.6))*55+12,0],[-76,-138,-6+Math.sin(ph+3.3)*36,Math.max(0,Math.cos(ph+3.3))*55+12,0]]
    :(o.legs||[[70,-130,4,0,1],[54,-130,-6,0,1],[-62,-135,6,-4,0],[-78,-135,-8,-2,0]]);
  g+=L.map(l=>leg(...l)).join('');
  g+=`<path d="M-92 -164 C-102 -200 -40 -206 10 -200 C50 -206 82 -200 96 -180 C106 -160 100 -130 80 -120 C40 -110 -40 -110 -80 -124 C-102 -134 -102 -150 -92 -164Z" fill="${INK}"/>`;
  const nk=o.headUp??0;
  g+=`<g transform="rotate(${-nk},80,-190) translate(80,-190) scale(1.12) translate(-80,190)"><path d="M66 -194 C82 -232 98 -266 120 -288 C136 -302 162 -296 178 -268 C182 -260 180 -252 170 -250 C156 -248 146 -254 136 -248 C122 -232 112 -204 98 -172Z" fill="${INK}"/><path d="M122 -292 L126 -314 L136 -294Z M112 -288 L112 -308 L122 -292Z" fill="${INK}"/>
   <path d="M70 -198 C76 -236 98 -272 118 -292 L104 -282 L100 -262 L90 -258 L88 -238 L78 -236 L76 -214Z" fill="${INK}"/></g>`;
  const tw=o.tail??(run?Math.sin(ph*2)*10:0);
  g+=`<path d="M-92 -160 C${-130} ${-156+tw} ${-142} ${-110+tw} ${-130} ${-60+tw} C-122 -96 -110 -122 -88 -140Z" fill="${INK}"/>`;
  if(o.saddle)g+=`<path d="M-30 -204 Q0 -214 30 -204 L28 -190 L-28 -190Z" fill="${INK}"/>`;
  let rider='';if(o.rider)rider=man({...o.rider,x:-6,y:-48,s:.92,f:1,legs:[40,-60,64,-70]});
  const bob=run?-Math.abs(Math.sin(ph))*10:0;
  return `<g transform="translate(${o.x},${o.y+bob}) scale(${s*f},${s})">${g}${rider}</g>`}
// ---- scenery ----
function grad(id,stops,vert=true){return `<linearGradient id="${id}" x1="0" y1="0" x2="${vert?0:1}" y2="${vert?1:0}">${stops.map(([o,c])=>`<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient>`}
function layer(d,fill,shadow=true){return `<path d="${d}" fill="${fill}" filter="url(#${shadow?'paper':'rough'})"/>`}
function hillPath(y,amp,seed,w=1100){let d=`M-40 1140 L-40 ${y}`;for(let x=-40;x<=w+40;x+=20){d+=` L${x} ${(y+Math.sin(x/170+seed)*amp+Math.sin(x/63+seed*2)*amp*.25).toFixed(1)}`}return d+` L${w+40} 1140Z`}
function sunDisc(x,y,r,c,glow){return `${glow?`<circle cx="${x}" cy="${y}" r="${r*2.4}" fill="${glow}" opacity=".35" filter="url(#blur)"/>`:''}<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" filter="url(#rough)"/>`}
function stars(n,seed,ymax){let s='';for(let k=0;k<n;k++){const x=rnd(seed+k)*1100,y=rnd(seed+k+77)*ymax,r=1+rnd(k+seed*3)*2.2;s+=`<circle cx="${x}" cy="${y}" r="${r}" fill="#FFF6D5" opacity="${.5+rnd(k)*.5}"/>`}return s}
function rnd(i){const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x)}
function glowAt(x,y,r,c,o=.5){return `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#rglow)" opacity="${o}" style="mix-blend-mode:screen"/>`}
function diamond(x,y,r,lit){return `${lit?`<circle cx="${x}" cy="${y}" r="${r*2.6}" fill="url(#dglow)"/>`:''}<path d="M${x} ${y-r} L${x+r*.8} ${y} L${x} ${y+r} L${x-r*.8} ${y}Z" fill="${lit?'#FFFDF0':'none'}" stroke="${lit?'#E8B64A':'#E45B5B'}" stroke-width="${lit?1.6:2}" ${lit?'':'stroke-dasharray="3 3"'}/>`}
function twinkle(x,y,r,c='#FFF6D5'){return `<path d="M${x} ${y-r} Q${x} ${y} ${x+r} ${y} Q${x} ${y} ${x} ${y+r} Q${x} ${y} ${x-r} ${y} Q${x} ${y} ${x} ${y-r}Z" fill="${c}"/>`}
function birds(x,y,n,s=1){let o='';for(let k=0;k<n;k++){const bx=x+k*34*s+rnd(k)*20,by=y+rnd(k+5)*30-k*6;o+=`<path d="M${bx-10*s} ${by} q${5*s} ${-7*s} ${10*s} 0 q${5*s} ${-7*s} ${10*s} 0" stroke="${INK}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`}return o}
function window_(x,y,w,h,lit){return `<path d="M${x} ${y+h} V${y+w/2} A${w/2} ${w/2} 0 0 1 ${x+w} ${y+w/2} V${y+h}Z" fill="${lit||'#2A2F5E'}"/>`}
