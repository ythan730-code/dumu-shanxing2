// Keep the opening transient: revisiting it never changes saved poem progress.
export function createBookOpening(art,panel,toggle){
 let loaded=false,active=false,finished=false,timer;
 const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
 function finish(){finished=true;art.classList.add('opening-done');panel.inert=false;toggle.inert=false;panel.classList.remove('opening-pending');toggle.classList.remove('opening-pending');}
 function sync(isOpening,isRevealed){
  if(!isOpening){clearTimeout(timer);active=false;finished=false;art.classList.remove('opening-play','opening-done');art.classList.toggle('opening-revealed',isRevealed);panel.inert=false;toggle.inert=false;panel.classList.remove('opening-pending');toggle.classList.remove('opening-pending');return;}
  art.classList.remove('opening-revealed');
  if(active)return;
  panel.inert=true;toggle.inert=true;panel.classList.add('opening-pending');toggle.classList.add('opening-pending');
  if(!loaded)return;
  active=true;art.classList.add('opening-play');
  if(reduced)finish();else timer=setTimeout(finish,5600);
 }
 return {sync,ready(){loaded=true;},get finished(){return finished;}};
}
