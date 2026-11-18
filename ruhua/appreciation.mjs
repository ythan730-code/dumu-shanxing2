import {celebrate,clearCelebration} from './celebration.mjs?v=20261118-fireworks-2s';
import {playSpringSound,stopSpringSound} from './spring-sound.mjs';
import {createAutumnWorld} from './world.mjs?v=20261101-single-background';
import {POEM} from './model.mjs';
import {STEPS,EVIDENCE_STEPS,evidenceVerse,correctEvidenceSelection,SENTENCE_FRAMES,sceneAt,stepIndex} from './appreciation-data.mjs?v=20261118-direct-appreciation';
const $=s=>document.querySelector(s);
let index=0,world,evidenceLevel=0,wordsVisible=false,imagesVisible=false,collapsed=false,overview=false;
let evidenceSelections=[];
function renderJournalAssessment(activities){
 const content=$('#journal-assessment').content.cloneNode(true);
 const prompts=content.querySelector('.journal-prompts');
 for(const prompt of SENTENCE_FRAMES){
  const item=document.createElement('li');
  item.textContent=prompt;
  prompts.append(item);
 }
 activities.replaceChildren(content);
}

const buttons=(items)=>items.map(([id,text])=>`<button id="${id}" type="button">${text}</button>`).join('');
function renderPoem(){
 $('#poem-lines').innerHTML=POEM.map(line=>`<p>${line}</p>`).join('');
}
function figure(title,image,alt,verse='',extra=''){return `<figure><figcaption>${title}</figcaption><img class="compare-image ${extra}" src="${image}" alt="${alt}">${verse?`<p class="compare-verse">${verse}</p>`:''}</figure>`;}
function compare(){
 const box=$('#comparison');box.hidden=!(index===1&&imagesVisible);box.innerHTML='';
 if(index===1&&imagesVisible)box.innerHTML=figure('《山行》 · 杜牧','assets/ruhua-stages/06-red-maples.webp','楓林旁停下的車馬和明亮秋山',wordsVisible?'停車坐愛楓林晚，<br>霜葉紅於二月花。':'')+figure('〈天淨沙·秋思〉 · 馬致遠','assets/qiusi-appreciation-v2.webp','枯藤、老樹、昏鴉、夕陽、孤獨旅人與瘦馬',wordsVisible?'枯藤老樹昏鴉……<br>夕陽西下，斷腸人在天涯。':'');
 $('#poem-dock').hidden=index!==2;
}
function resetSupport(){for(const type of ['hint','summary']){const button=$(`#${type}-toggle`);button.setAttribute('aria-expanded','false');button.textContent=type==='hint'?'顯示提示':'顯示小結';$(`#${type}`).hidden=true;}}
function render(){
 clearCelebration();stopSpringSound();$('#spring-bridge').hidden=true;document.body.classList.remove('is-spring-bridge');
 const s=STEPS[index];evidenceSelections=[];evidenceLevel=0;wordsVisible=false;imagesVisible=false;collapsed=false;overview=false;
 document.body.classList.remove('is-overview');$('#return-discussion').hidden=true;$('#discussion').hidden=false;$('#collapse').textContent='收起任務 ▾';$('#collapse').setAttribute('aria-expanded','true');
 $('#heading').textContent=s.title;$('#chapter').textContent=s.chapter;$('#question').textContent='「'+s.question+'」';$('#counter').textContent=`${index+1} / ${STEPS.length}`;
 $('#hint').textContent=s.hint;$('#summary').textContent=s.summary;resetSupport();
 $('#previous').disabled=index===0;$('#next').textContent=s.next||(index===STEPS.length-1?'完成小記，聽聽遠方 →':'下一步 →');
 $('#hint-toggle').textContent=index===3?'顯示寫作提示':index===0?'顯示追問':'顯示提示';
 const activities=$('#activities');
 activities.innerHTML=index===1?buttons([['show-images','比較兩幅秋景'],['reveal-words','揭示詩曲文字']]):'';
 if(index===3)renderJournalAssessment(activities);
 document.body.classList.toggle('is-evidence',index===0);
 document.body.classList.toggle('is-reading',index===2);
 document.body.classList.toggle('is-assessment-intro',index===3);
 document.body.classList.remove('is-writing');
 $('#assessment-intro').hidden=index!==3;
 $('#restored-reading').hidden=index!==2;
 $('#evidence-board').hidden=index!==0;
 if(index===0)renderEvidence();
 world?.apply({...sceneAt(index),...(index===3?{poet:false}:{})},100+index);world?.view('wide');compare();
 if(index===1)$('#reveal-words').hidden=true;
 $('#show-images')?.addEventListener('click',()=>{imagesVisible=!imagesVisible;wordsVisible=false;$('#show-images').textContent=imagesVisible?'返回秋山':'比較兩幅秋景';$('#reveal-words').hidden=!imagesVisible;$('#reveal-words').textContent='揭示詩曲文字';$('#question').textContent='「'+(imagesVisible?'兩幅秋景給你的感受有甚麼不同？':s.question)+'」';compare();});
 $('#reveal-words')?.addEventListener('click',()=>{wordsVisible=!wordsVisible;$('#reveal-words').textContent=wordsVisible?'收起詩曲文字':'揭示詩曲文字';$('#question').textContent='「'+(wordsVisible?'讀了文字後，你的想法有沒有改變？哪個字詞支持你的看法？':'兩幅秋景給你的感受有甚麼不同？')+'」';compare();});
 if(index===3){
  $('#hint').textContent='可以直接寫出喜愛，也可以用動作或比較讓讀者感受到。寫完後，檢查景物、感受與表達方法是否互相配合。';

 }

}
function renderSelectableVerse(){
 const verse=$('#evidence-board .evidence-verse');
 if(!EVIDENCE_STEPS[evidenceLevel].target){verse.textContent=evidenceVerse(evidenceLevel);return;}
 const selected=evidenceSelections[evidenceLevel]??=new Set();
 const chars=Array.from(evidenceVerse(evidenceLevel));
 verse.replaceChildren();
 for(const [i,char] of chars.entries()){
  if(/[，。]/u.test(char)){verse.append(document.createElement('br'));continue;}
  const button=document.createElement('button');button.type='button';button.className='verse-word';button.textContent=char;button.dataset.charIndex=String(i);button.setAttribute('aria-label','選取「'+char+'」');button.setAttribute('aria-pressed',String(selected.has(i)));verse.append(button);
 }
 function sync(){
  verse.querySelectorAll('.verse-word').forEach(b=>b.setAttribute('aria-pressed',String(selected.has(Number(b.dataset.charIndex)))));
  $('#selected-words').textContent=selected.size?'已選：'+chars.filter((_,i)=>selected.has(i)).join(''):'尚未選取字詞。';
 }
 verse.onclick=e=>{const b=e.target.closest('.verse-word');if(!b)return;clearCelebration();const i=Number(b.dataset.charIndex);selected.has(i)?selected.delete(i):selected.add(i);sync();if(correctEvidenceSelection(evidenceLevel,selected)){celebrate(2000);$('#selected-words').textContent+=' · 找到證據了！請說說你的理由。';}};
 sync();
}
function comparisonVerse(verse,target){
 const start=verse.indexOf(target);
 return Array.from(verse).map((char,index)=>{
  const highlighted=index>=start&&index<start+target.length;
  return '<span class="comparison-cell'+(highlighted?' teacher-keyword':'')+'">'+char+'</span>';
 }).join('');
}
function renderEvidence(){
 clearCelebration();
 const step=EVIDENCE_STEPS[evidenceLevel];
 $('#evidence-board').toggleAttribute('data-comparison',Boolean(step.rewrite));
 $('#evidence-board').innerHTML=`<p class="evidence-kicker">讀懂喜愛 · ${evidenceLevel+1} / ${EVIDENCE_STEPS.length}</p><div class="evidence-progress">${EVIDENCE_STEPS.map((s,i)=>`<span class="${i===evidenceLevel?'current':''}">${s.label}</span>`).join('')}</div><h2>${step.title}</h2><div class="evidence-verse">${evidenceVerse(evidenceLevel)}</div>${step.rewrite?`<div class="evidence-rewrite">${Array.from(step.rewrite).map(c=>`<span class="comparison-cell">${c}</span>`).join('')}<small>（改寫）</small></div>`:''}<div id="word-selection" ${!step.target?'hidden':''}><p class="selection-instruction">點選詩中字詞，再說說你的理由；再點一次可取消。</p><p id="selected-words" role="status" aria-live="polite"></p><button id="clear-word-selection" type="button">清除選擇</button></div><p class="evidence-prompt">${step.prompt}</p><button id="explain-evidence" aria-expanded="false" aria-controls="evidence-explanation">討論後，揭示發現</button><p id="evidence-explanation" hidden></p><div class="evidence-controls"><button id="evidence-back" ${evidenceLevel===0?'disabled':''}>← 上一個發現</button><button id="evidence-next" ${evidenceLevel===EVIDENCE_STEPS.length-1?'disabled':''}>下一個發現 →</button></div>`;
 $('#evidence-explanation').textContent=step.explanation;
 renderSelectableVerse();
 $('#clear-word-selection').addEventListener('click',()=>{clearCelebration();evidenceSelections[evidenceLevel]=new Set();renderSelectableVerse();});
 $('#explain-evidence').addEventListener('click',()=>{const p=$('#evidence-explanation');p.hidden=!p.hidden;if(p.hidden)renderSelectableVerse();else $('#evidence-board .evidence-verse').innerHTML=step.rewrite?comparisonVerse(step.verse,step.target):evidenceVerse(evidenceLevel,true);$('#word-selection').hidden=!p.hidden||!step.target;$('#explain-evidence').setAttribute('aria-expanded',String(!p.hidden));$('#explain-evidence').textContent=p.hidden?'討論後，揭示發現':'收起發現';});
 $('#evidence-back').addEventListener('click',()=>{evidenceLevel--;renderEvidence();});
 $('#evidence-next').addEventListener('click',()=>{evidenceLevel++;renderEvidence();});
}
$('#begin-journal').addEventListener('click',()=>{document.body.classList.remove('is-assessment-intro');document.body.classList.add('is-writing');$('#assessment-intro').hidden=true;$('#heading').focus();});
$('#back-reading').addEventListener('click',()=>{index=2;render();});
async function soundBirds(){const ok=await playSpringSound();$('#bird-status').textContent=ok?'鶯啼聲響起（聲音示意）':'未能播放聲音，請按「再聽鶯啼」重試。';}
function showSpringBridge(){document.body.classList.add('is-spring-bridge');$('#spring-bridge').hidden=false;soundBirds();$('#replay-birds').focus();}
$('#replay-birds').addEventListener('click',soundBirds);
$('#return-journal').addEventListener('click',()=>{stopSpringSound();document.body.classList.remove('is-spring-bridge');$('#spring-bridge').hidden=true;$('#heading').focus();});
window.addEventListener('pagehide',()=>{stopSpringSound();clearCelebration();});
function showOverview(value){stopSpringSound();$('#spring-bridge').hidden=true;document.body.classList.remove('is-spring-bridge');overview=value;document.body.classList.toggle('is-overview',value);$('#return-discussion').hidden=!value;world?.apply(sceneAt(value?0:index),value?200:100+index);world?.view('wide');}
$('#previous').addEventListener('click',()=>{index=stepIndex(index-1);render();$('#heading').focus();});
$('#next').addEventListener('click',()=>{if(index===STEPS.length-1){showSpringBridge();return;}index=stepIndex(index+1);render();$('#heading').focus();});
for(const type of ['hint','summary'])$(`#${type}-toggle`).addEventListener('click',()=>{const content=$(`#${type}`),button=$(`#${type}-toggle`);content.hidden=!content.hidden;button.setAttribute('aria-expanded',String(!content.hidden));button.textContent=(content.hidden?'顯示':'收起')+(type==='hint'?(index===3?'寫作提示':index===0?'追問':'提示'):'小結');});
$('#collapse').addEventListener('click',()=>{collapsed=!collapsed;$('#discussion').hidden=collapsed;$('#collapse').textContent=collapsed?'返回任務 ▴':'收起任務 ▾';$('#collapse').setAttribute('aria-expanded',String(!collapsed));});
$('#overview').addEventListener('click',()=>showOverview(!overview));$('#return-discussion').addEventListener('click',()=>showOverview(false));
renderPoem();render();
try{world=createAutumnWorld($('#world'),$('#scene-status'));await world.ready;render();}catch(error){console.error(error);$('#scene-status').textContent='部分畫面未能載入，請重新整理。提問與詩句仍可使用。';}
