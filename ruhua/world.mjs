import {SCENE_FRAMES,sceneAssetFor} from './baked-scenes.mjs';
const loadImage=src=>new Promise((resolve,reject)=>{const i=new Image();i.decoding='async';i.onload=()=>i.decode().then(()=>resolve(i),reject);i.onerror=()=>reject(Error(src));i.src=src;});
const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
export function createAutumnWorld(host,status){
 const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
 host.innerHTML=`<div class="paint-lens"><img class="paint-frame" src="${SCENE_FRAMES.bare}" alt="水彩秋山" decoding="async" style="opacity:1"><svg class="focus-svg" viewBox="0 0 1536 1024" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g id="memory-focus" visibility="hidden"><ellipse class="memory-halo" fill="#fff4ba12" stroke="#fff0b6" stroke-width="3" vector-effect="non-scaling-stroke"/><ellipse class="memory-ring" fill="none" stroke="#fff9d3" stroke-width="1.5" stroke-dasharray="7 8" vector-effect="non-scaling-stroke"/></g></svg><div id="paint-poet" class="paint-actor" aria-hidden="true"><div class="poet-shadow"></div><canvas id="paint-poet-canvas" width="512" height="512"></canvas></div></div><div class="paint-dusk" aria-hidden="true"></div><div class="paint-vignette" aria-hidden="true"></div>`;
 const lens=host.querySelector('.paint-lens'),poet=host.querySelector('#paint-poet'),portrait=host.querySelector('#paint-poet-canvas');
 let size={w:host.clientWidth,h:host.clientHeight,lw:lens.clientWidth,lh:lens.clientHeight};
 let atlas,frames,pose=6,drawn=-1,lastStage=null,move=null,raf=0,disposed=false,poetP={x:265,y:930,s:.83},cam={x:0,y:0,z:1},pendingCamera=null,scene={};
 const frame=host.querySelector('.paint-frame'),cache=new Map();let currentAsset=SCENE_FRAMES.bare,frameTicket=0,prefetchTimer;
 function loadFrame(asset){if(!cache.has(asset))cache.set(asset,loadImage(asset));const value=cache.get(asset);while(cache.size>3){const old=[...cache.keys()].find(key=>key!==currentAsset&&key!==asset);if(!old)break;cache.delete(old);}return value;}
 function showFrame(s){const asset=sceneAssetFor(s),ticket=++frameTicket;clearTimeout(prefetchTimer);loadFrame(asset).then(()=>{if(disposed||ticket!==frameTicket)return;if(asset!==currentAsset){frame.src=asset;currentAsset=asset;}host.dataset.sceneFrame=asset;prefetchTimer=setTimeout(()=>{const list=Object.values(SCENE_FRAMES),i=list.indexOf(asset);Promise.allSettled(list.slice(i+1,i+3).map(loadFrame));},250);}).catch(error=>{if(ticket===frameTicket){status.textContent='景物暫時未能載入，請重新整理。';console.error(error);}});}
 const ready=Promise.all([loadImage('assets/dumu-motion-v1.png'),fetch('assets/dumu-motion-v1.json').then(r=>{if(!r.ok)throw Error('人物圖集未能載入');return r.json();}),loadFrame(SCENE_FRAMES.bare)]).then(([a,b])=>{atlas=a;frames=b.frames;drawPoet(pose);host.dataset.assetsReady='true';return portrait;});
 function drawPoet(index){if(!atlas||drawn===index)return;drawn=index;const f=frames[index],s=450/(f.bottom-f.top),ctx=portrait.getContext('2d');ctx.clearRect(0,0,512,512);ctx.drawImage(atlas,f.x,f.y,f.w,f.h,256-f.headX*s,490-f.bottom*s,f.w*s,f.h*s);poet.dataset.frame=String(index);}
 function measure(){size={w:host.clientWidth,h:host.clientHeight,lw:lens.clientWidth,lh:lens.clientHeight};const scale=Math.max(size.lw/1536,size.lh/1024),w=1536*scale,h=1024*scale;Object.assign(frame.style,{width:w+'px',height:h+'px',left:(size.lw-w)/2+'px',top:(size.lh-h)/2+'px'});}
 function place(){const scale=Math.max(size.lw/1536,size.lh/1024),s=scale*poetP.s,x=(size.lw-1536*scale)/2+poetP.x*scale,y=(size.lh-1024*scale)/2+poetP.y*scale;poet.style.transform=`translate(${x-256*s}px,${y-490*s}px) scale(${s})`;}
 function paintCamera(){const w=size.w,h=size.h,paintWidth=Math.max(size.lw,size.lh*1.5)*cam.z;cam.x=clamp(cam.x,-Math.max(0,(paintWidth-w)/2),Math.max(0,(paintWidth-w)/2));cam.y=clamp(cam.y,-Math.max(0,(paintWidth/1.5-h)/2),Math.max(0,(paintWidth/1.5-h)/2));lens.style.transform=`translate(${cam.x}px,${cam.y}px) scale(${cam.z})`;host.dataset.camera=[cam.x,cam.y,cam.z].map(v=>v.toFixed(2)).join(',');}
 function cameraTo(target){pendingCamera=null;if(reduced){cam=target;paintCamera();}else pendingCamera={from:{...cam},to:target,start:performance.now(),duration:850};wake();}
 function view(name){measure();const w=size.w,h=size.h;if(name==='poet'){const z=1.48,scale=Math.max(size.lw/1536,size.lh/1024);cameraTo({x:w*.29-w/2-(poetP.x-768)*scale*z,y:h*.84-h/2-(poetP.y-512)*scale*z,z});}else if(name==='angle'){const next=Math.abs(cam.x)<10?-.17:.02;cameraTo({x:w*next,y:-h*.035,z:1.13});}else if(name==='house')cameraTo({x:-w*.1,y:h*.07,z:1.25});else if(name==='forest')cameraTo({x:-w*.22,y:-h*.015,z:1.55});else cameraTo({x:0,y:0,z:1});}
 function clearReveal(){host.querySelector('#memory-focus').setAttribute('visibility','hidden');host.removeAttribute('data-reveal');}
 function reveal(cue){measure();const focus=host.querySelector('#memory-focus');focus.setAttribute('transform',`translate(${cue.x} ${cue.y})`);for(const ellipse of focus.querySelectorAll('ellipse')){ellipse.setAttribute('rx',String(cue.rx));ellipse.setAttribute('ry',String(cue.ry));}focus.setAttribute('visibility',cue.halo===false?'hidden':'visible');host.dataset.reveal=cue.id;const w=size.w,h=size.h,scale=Math.max(size.lw/1536,size.lh/1024),z=cue.zoom;cameraTo({x:-(cue.x-768)*scale*z,y:h*.02-(cue.y-512)*scale*z,z});}
 function apply(s,stage){if(stage===lastStage)return;const first=lastStage===null;lastStage=stage;scene=s;host.dataset.stage=String(stage);host.dataset.leaves=s.leaves;host.classList.toggle('evening',s.evening);host.classList.toggle('remembered',s.leaves==='red');
  showFrame(s);
  poet.style.opacity=s.poet?'1':'0';pose=s.gaze?7:6;
  // Stage-driven travel only: no independent wandering or changes on a wrong answer.
  const locations={foot:{x:265,y:930,s:.62},trail:{x:650,y:855,s:.52},high:{x:760,y:823,s:.47},maple:{x:700,y:884,s:.48}},target=locations[s.poetPlace]||locations.foot;
  if(reduced||stage<3||first){poetP={...target};move=null;}else if(poetP.x!==target.x||poetP.y!==target.y)move={from:{...poetP},to:target,start:performance.now(),duration:1600};
  const parts=['山體',...(s.flatRoad?['山腳的一段石徑']:[]),...(s.road?['蜿蜒向上的石徑']:[]),...(s.clouds?['高處的白雲']:[]),...(s.houses?['雲間的人家']:[]),...(s.forest?['楓林']:[]),...(s.cart?['停下的馬車']:[]),...(s.leaves==='red'?['鮮紅的霜葉']:s.leaves==='pale'?['淡紅的霜葉']:[])];host.querySelector('.paint-frame').alt='水彩秋山：'+parts.join('、');host.dataset.parts=parts.join('|');
  if(s.full)view('wide');else if(stage===7||stage===9)view('house');else if(stage===14)view('wide');else if(stage===11||stage===16||stage===17)view('forest');else if(stage<3)view('wide');place();if(!move)drawPoet(pose);wake();
 }
 const pointers=new Map();let gesture=null;
 function beginGesture(){const p=[...pointers.values()];gesture={cam:{...cam},points:p.map(v=>({...v})),distance:p.length>1?Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y):0};}
 const down=e=>{if(e.button!==0&&e.pointerType==='mouse')return;pendingCamera=null;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});host.setPointerCapture(e.pointerId);beginGesture();};
 const pointerMove=e=>{if(!pointers.has(e.pointerId))return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});const p=[...pointers.values()];if(p.length===1){cam.x=clamp(gesture.cam.x+p[0].x-gesture.points[0].x,-host.clientWidth*.35,host.clientWidth*.35);cam.y=clamp(gesture.cam.y+p[0].y-gesture.points[0].y,-host.clientHeight*.3,host.clientHeight*.3);}else if(gesture.distance>0){const distance=Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);cam.z=clamp(gesture.cam.z*distance/gesture.distance,1,2.2);}paintCamera();};
 const up=e=>{pointers.delete(e.pointerId);beginGesture();};
 host.addEventListener('pointerdown',down);host.addEventListener('pointermove',pointerMove);host.addEventListener('pointerup',up);host.addEventListener('pointercancel',up);host.addEventListener('wheel',e=>{e.preventDefault();pendingCamera=null;cam.z=clamp(cam.z*Math.exp(-e.deltaY*.001),1,2.2);paintCamera();},{passive:false});
 function wake(){if(!disposed&&!document.hidden&&!raf&&(move||pendingCamera))raf=requestAnimationFrame(tick);}
 function tick(now){raf=0;if(disposed||document.hidden)return;
  if(move){const t=clamp((now-move.start)/move.duration,0,1),v=t*t*(3-2*t);for(const k of ['x','y','s'])poetP[k]=move.from[k]+(move.to[k]-move.from[k])*v;drawPoet(Math.floor((now-move.start)/150)%6);place();if(t===1){move=null;drawPoet(pose);}}
  if(pendingCamera){const t=clamp((now-pendingCamera.start)/pendingCamera.duration,0,1),v=t*t*(3-2*t);for(const k of ['x','y','z'])cam[k]=pendingCamera.from[k]+(pendingCamera.to[k]-pendingCamera.from[k])*v;paintCamera();if(t===1)pendingCamera=null;}
  wake();
 }
 const resize=new ResizeObserver(()=>{measure();place();paintCamera();});resize.observe(host);
 const visibility=()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;}else wake();};document.addEventListener('visibilitychange',visibility);
 measure();place();paintCamera();
 let cartAnimation;
 function comparison(mode){
  cartAnimation?.cancel();
  host.querySelector('[data-layer="houses"]')?.setAttribute('transform',mode==='composition-b'?'translate(-680 65)':'');
  let cart=host.querySelector('#comparison-cart');
  if(!cart){cart=document.createElementNS('http://www.w3.org/2000/svg','g');cart.id='comparison-cart';cart.innerHTML='<svg x="180" y="660" width="400" height="267" style="width:400px;height:267px;overflow:hidden" viewBox="0 0 768 512"><image href="assets/carriage-motion-v1.png" width="1536" height="1024"/></svg>';host.querySelector('.paint-lens>svg').append(cart);}
  cart.style.display=['pass','stop'].includes(mode)?'':'none';
  if(mode==='pass'&&!reduced)cartAnimation=cart.animate([{transform:'translateX(0px)'},{transform:'translateX(280px)'}],{duration:4000,fill:'forwards',easing:'linear'});
  if(mode==='pass'&&reduced)cart.style.transform='translateX(280px)';else cart.style.transform='';
 }
 return {ready,apply,view,reveal,clearReveal,comparison,zoom:factor=>cameraTo({...cam,z:clamp(cam.z/factor,1,2.2)}),dispose:()=>{disposed=true;clearTimeout(prefetchTimer);frameTicket++;cancelAnimationFrame(raf);resize.disconnect();document.removeEventListener('visibilitychange',visibility);host.removeEventListener('pointerdown',down);host.removeEventListener('pointermove',pointerMove);host.removeEventListener('pointerup',up);}};
}
