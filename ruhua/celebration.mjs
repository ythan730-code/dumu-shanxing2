// Runs only for a celebration, then releases the canvas, animation and listeners.
let overlay,timer,frame,hideListener,flight;
export function clearCelebration(){clearTimeout(timer);cancelAnimationFrame(frame);flight?.cancel();flight=undefined;overlay?.remove();overlay=undefined;if(hideListener)document.removeEventListener('visibilitychange',hideListener);hideListener=undefined;}
export function celebrate(){
 clearCelebration();if(document.hidden)return;
 overlay=document.createElement('div');overlay.className='screen-fireworks';overlay.setAttribute('aria-hidden','true');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(reduced){overlay.classList.add('fireworks-still');overlay.innerHTML='<span class="still-star">✦ ✧ ✦</span>';document.body.append(overlay);timer=setTimeout(clearCelebration,1400);return;}
 const canvas=document.createElement('canvas');canvas.className='vivid-fireworks';overlay.append(canvas);document.body.append(overlay);
 const width=innerWidth,height=innerHeight,dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
 const ctx=canvas.getContext('2d');if(!ctx){clearCelebration();return;}ctx.scale(dpr,dpr);ctx.lineCap='round';
 const radius=Math.min(width,height)*.27;
 const bursts=[{x:.2,y:.29,t:.25,h:45},{x:.77,y:.24,t:.65,h:320},{x:.49,y:.45,t:1.1,h:185},{x:.16,y:.68,t:1.55,h:275},{x:.84,y:.65,t:1.95,h:35},{x:.36,y:.22,t:2.35,h:145},{x:.65,y:.67,t:2.75,h:305}];
 let particles=[],start,last;
 function explode(b){for(let ring=0;ring<2;ring++)for(let i=0;i<(ring?38:76);i++){
  const count=ring?38:76,angle=i*Math.PI*2/count+(Math.random()-.5)*.04,speed=radius*(ring?.4:1)*(.78+Math.random()*.26),hue=(b.h+(ring?38:0)+(i%5)*3)%360;
  particles.push({x:b.x*width,y:b.y*height,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,age:0,life:1.35+Math.random()*.6,color:`hsl(${hue} 100% 58%)`,size:ring?1.6:2.3,seed:Math.random()*6});
 }}
 function draw(now){if(!overlay)return;if(start===undefined){start=now;last=now;}const t=(now-start)/1000,dt=Math.min((now-last)/1000,.04);last=now;
  ctx.globalCompositeOperation='destination-out';ctx.fillStyle=`rgba(0,0,0,${1-Math.exp(-dt*9)})`;ctx.fillRect(0,0,width,height);ctx.globalCompositeOperation='lighter';
  for(const b of bursts){if(!b.fired&&t>=b.t){b.fired=true;explode(b);}if(!b.fired&&t>=b.t-.28){const p=Math.max(0,(t-b.t+.28)/.28),x=b.x*width,y=height-(height-b.y*height)*p;ctx.strokeStyle=`hsla(${b.h} 100% 78% / .9)`;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y+28);ctx.lineTo(x,y);ctx.stroke();}}
  for(const p of particles){const x=p.x,y=p.y;p.age+=dt;p.vx*=Math.exp(-dt*.72);p.vy=p.vy*Math.exp(-dt*.72)+dt*42;p.x+=p.vx*dt;p.y+=p.vy*dt;
   const fade=Math.pow(Math.max(0,1-p.age/p.life),.7),twinkle=p.age>.8?.55+.45*Math.sin(p.age*24+p.seed):1;ctx.globalAlpha=fade*Math.max(.25,twinkle);
   ctx.strokeStyle=p.color;ctx.lineWidth=p.size;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(p.x,p.y);ctx.stroke();ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.size*.55,0,Math.PI*2);ctx.fill();
  }
  ctx.globalAlpha=1;particles=particles.filter(p=>p.age<p.life);if(t<4.9)frame=requestAnimationFrame(draw);else clearCelebration();
 }
 frame=requestAnimationFrame(draw);timer=setTimeout(clearCelebration,5300);hideListener=()=>{if(document.hidden)clearCelebration();};document.addEventListener('visibilitychange',hideListener);
}

export function tossBomb(){
 clearCelebration();if(document.hidden)return;
 overlay=document.createElement('div');overlay.className='bomb-toss-overlay';overlay.setAttribute('aria-hidden','true');
 const bomb=document.createElement('span');bomb.className='flying-bomb';bomb.textContent='💣';overlay.append(bomb);document.body.append(overlay);
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(reduced){overlay.classList.add('bomb-toss-still');timer=setTimeout(clearCelebration,1200);return;}
 const width=innerWidth,height=innerHeight;
 const keys=Array.from({length:61},(_,i)=>{const t=i/60,first=t<=.6,u=first?t/.6:(t-.6)/.4;
  const x=first?width*(-.14+.64*u):width*(.5+.72*u);
  const y=first?height*(.82-.08*u-.58*Math.sin(Math.PI*u)):height*(.74-.86*u-.14*Math.sin(Math.PI*u));
  const scale=.75+.3*Math.sin(Math.PI*t);
  return {offset:t,transform:`translate(${x}px,${y}px) rotate(${-55+620*t}deg) scale(${scale})`,opacity:t<.94?1:(1-t)/.06};
 });
 flight=bomb.animate(keys,{duration:2400,easing:'linear',fill:'both'});flight.onfinish=clearCelebration;timer=setTimeout(clearCelebration,2600);
 hideListener=()=>{if(document.hidden)clearCelebration();};document.addEventListener('visibilitychange',hideListener);
}
