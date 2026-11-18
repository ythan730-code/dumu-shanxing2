let audio,timer;
export function stopSpringSound(){clearTimeout(timer);if(audio){audio.close().catch(()=>{});audio=null;}}
export async function playSpringSound(){
 stopSpringSound();
 const Audio=window.AudioContext||window.webkitAudioContext;
 if(!Audio)return false;
 try{
  const ctx=new Audio();audio=ctx;await ctx.resume();
  if(audio!==ctx)return false;
  for(let phrase=0;phrase<3;phrase++)for(let i=0;i<4;i++){
   const start=ctx.currentTime+.1+phrase*1.35+i*.19;
   const osc=ctx.createOscillator(),gain=ctx.createGain();
   osc.type='sine';osc.frequency.setValueAtTime(1800+i%2*450,start);osc.frequency.exponentialRampToValueAtTime(3300-i*100,start+.045);osc.frequency.exponentialRampToValueAtTime(1900+i*70,start+.13);
   gain.gain.setValueAtTime(0,start);gain.gain.linearRampToValueAtTime(.035,start+.012);gain.gain.exponentialRampToValueAtTime(.001,start+.15);
   osc.connect(gain);gain.connect(ctx.destination);osc.start(start);osc.stop(start+.17);
  }
  timer=setTimeout(stopSpringSound,4600);return true;
 }catch{stopSpringSound();return false;}
}
