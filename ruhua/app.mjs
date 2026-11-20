import {celebrate,clearCelebration,tossBomb} from './celebration.mjs?v=20261118-fireworks-2s';
import {reflectionMarkup,pickReflection,emptyReflection,assessReflection} from './reflection.mjs?v=20261120-complete-v2';
import {POEM,STAGES,freshState,normalize,sceneFor,advance,answer,noteText,questionPoints,scoreSummary} from './model.mjs?v=20261118-poet-name';
import {createAutumnWorld} from './world.mjs?v=20261101-single-background';
import {createBookOpening} from './opening.mjs';
import {HINTS,newReveal,latestReveal} from './learning-support.mjs?v=20261106-bomb-toss';
const KEY='ruhua-autumn-v1';
let reflectionMode='scenery',reflectionShared=false;
let lastVerse=null,hintLevel=0,revealTimer;
const $=s=>document.querySelector(s),panel=$('#panel'),main=$('#main'),modal=$('#modal');
const opening=createBookOpening($('#intro-art'),panel,$('#task-toggle'));
let state=freshState(),world,error='',home=false,taskCollapsed=false,taskScroll=0;
try{state=normalize(JSON.parse(localStorage.getItem(KEY)));}catch{}
home=state.stage<0;
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function persist(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch{$('#save-status').textContent='此裝置暫時無法儲存，請勿關閉本頁。';}}
function setState(next){const cue=newReveal(state.stage,next.stage);stopReveal(false);state=next;hintLevel=0;error='';taskCollapsed=false;taskScroll=0;persist();render();if(cue)showReveal(cue);}
function stopReveal(restore=true){clearTimeout(revealTimer);const was=main.classList.contains('revealing-scene');main.classList.remove('revealing-scene');$('#reveal-banner').hidden=true;panel.inert=false;$('#task-toggle').inert=false;world?.clearReveal();if(was&&restore)world?.view('wide');}
function showReveal(cue){if(!world||!cue)return;stopReveal(false);$('#reveal-title').textContent=cue.title;$('#reveal-detail').textContent=cue.detail;$('#reveal-quote').textContent='「'+cue.quote+'」';$('#reveal-banner').hidden=false;main.classList.add('revealing-scene');panel.inert=true;$('#task-toggle').inert=true;world.reveal(cue);revealTimer=setTimeout(()=>stopReveal(),5000);}
function syncHint(){const hint=HINTS[STAGES[state.stage]?.id],button=$('#hint-button');if(!hint||!button)return;button.textContent=hintLevel===0?'提示':hintLevel===1?'再給我一點提示':'收起提示';button.setAttribute('aria-expanded',String(hintLevel>0));$('#hint-content').hidden=hintLevel===0;$('#hint-content').innerHTML=hint.steps.slice(0,hintLevel).map(text=>'<p>'+escape(text)+'</p>').join('');const line=panel.querySelector('.poem-line');if(line){const text=POEM[STAGES[state.stage].poem];let markup=escape(text);if(hintLevel)for(const clue of hint.clues)markup=markup.replaceAll(escape(clue),'<mark>'+escape(clue)+'</mark>');line.innerHTML=markup;}}

function syncScore(){const summary=scoreSummary(state),el=$('#score-badge');el.hidden=home||state.stage<3;el.textContent=summary.max?`尋憶積分 ${summary.points} / ${summary.max}`:'重新尋憶可開始計分';}
function scoreCard(){const s=scoreSummary(state);if(!s.max)return '<div class="score-card"><p>這段記憶已在舊版完成，尚未計分。</p><p>重新尋憶可挑戰全部 8 題，滿分 16 分。</p></div>';return `<div class="score-card"><p>尋憶積分 <strong>${s.points} / ${s.max}</strong></p><p>首次答對 ${s.firstTry} / ${s.eligible} 題</p>${s.points===16?'<p class="classdojo-reward">Classdojo+3！</p>':''}${s.legacy?'<p>舊進度不補計分；重新尋憶可挑戰全部 8 題。</p>':''}</div>`;}
function speech(text,speaker='杜牧'){return text?`<p class="speaker">${escape(speaker)}</p><p class="speech">「${escape(text.replaceAll('「','『').replaceAll('」','』'))}」</p>`:'';}
function syncTaskVisibility(){const available=!home&&STAGES[state.stage]?.kind!=='free',button=$('#task-toggle');button.hidden=!available;button.textContent=taskCollapsed?'展開任務 ▴':'收起任務 ▾';button.setAttribute('aria-expanded',String(!taskCollapsed));panel.hidden=!available||taskCollapsed;main.classList.toggle('task-collapsed',available&&taskCollapsed);}
function render(){clearCelebration();const t=STAGES[state.stage];main.className=home?'home-mode':state.stage<2?'intro-mode':t?.kind==='free'?'free-mode':'';$('#home').hidden=!home;$('#intro-art').hidden=home||state.stage>=2;$('#views').hidden=home||state.stage<2;$('#progress').textContent=t?.memory?`記憶 ${t.memory} / 6`:state.stage>=18?'六段記憶已尋回':'';
 syncScore();
 world?.apply(sceneFor({...state,stage:home?-1:state.stage}),home?-1:state.stage);
 syncTaskVisibility();
 $('#scene-replay').hidden=home||state.stage<4||!latestReveal(state.stage);
 opening.sync(!home&&state.stage===0,!home&&state.stage===1);
 if(home){lastVerse=null;return;}
 if(t.poem!==undefined&&t.poem!==lastVerse){lastVerse=t.poem;$('#verse-title').textContent=POEM[t.poem];if(!$('#verse-screen').open)$('#verse-screen').showModal();}else if(t.poem===undefined)lastVerse=null;
 let html=`<p class="kicker">${t.memory?`記憶${['','一','二','三','四','五','六'][t.memory]}`:state.stage<3?'開場':state.stage>=18?'第一章・秋山歸憶':''}</p><h2>${escape(t.title)}</h2>`;
 if(t.poem!==undefined)html+=`<blockquote class="poem-line">${POEM[t.poem]}</blockquote>`;
 

 html+=speech(t.speech,t.speaker);
 if(t.narration)html+=`<p class="narration">${escape(t.narration)}</p>`;
 if(t.extraNarration)html+=`<p class="narration">${escape(t.extraNarration)}</p>`;
 if(t.extra)html+=speech(t.extra);
 if(HINTS[t.id])html+='<div class="hint-area"><button id="hint-button" type="button" aria-expanded="false" aria-controls="hint-content">提示</button><div id="hint-content" role="status" hidden></div></div>';
 if(t.kind==='identity'){
 html+='<form id="poet-name-form"><label class="task" for="poet-name">你認為這位詩人是誰？</label><input id="poet-name" name="poet-name" type="text" placeholder="請輸入詩人姓名" autocomplete="off" autocapitalize="off" spellcheck="false" maxlength="20" aria-describedby="name-feedback"><p id="name-feedback" class="feedback" role="status" aria-live="polite"></p><div class="actions"><button type="submit" class="primary">確認姓名</button></div></form>';
 }else if(t.kind==='quiz'){
 html+=`<fieldset><legend>${escape(t.question)}</legend>${t.options.map((v,i)=>`<label class="choice"><input type="radio" name="answer" value="${i}" ${state.choice===i?'checked':''} ${state.responses[t.id]?.includes(i)?'disabled':''}><span>${escape(v)}</span></label>`).join('')}</fieldset><p class="question-score">本題答對可得 ${questionPoints(state)} 分 · 如果你覺得有困難，可以使用提示，使用提示不扣分</p><p class="feedback" role="status">${escape(error)}</p><div class="actions"><button id="confirm" class="primary" ${state.choice===null?'disabled':''}>喚回記憶</button></div>`;
 }else if(t.kind==='share')html+=`${t.frame?`<p class="frame">${escape(t.frame)}</p>`:''}<p class="share-hint">先與同伴討論，再分享你的理由。</p><div class="actions"><button id="next" class="primary">${t.next}</button></div>`;
 else if(t.kind==='summary')html+=scoreCard()+`<div class="actions"><button id="next" class="primary">${t.next}</button></div>`;
 else if(t.kind==='reflection')html+=`<p class="task">${escape(t.question)}</p><p class="task">${escape(t.followup)}</p><p class="share-hint">先圈選，再與同伴討論，並用詩中的字詞分享你的想法。</p><div id="reflection-picker">${reflectionMarkup(state.reflection,reflectionMode,reflectionShared)}</div>`;
 else if(t.kind==='free')html+='<p>拖曳看景、雙指縮放，從不同角度看看秋山。</p>';
 else html+=`<div class="actions"><button id="next" class="primary">${escape(t.next)}</button></div>`;
 if(state.stage>=18)html+='<div class="memory-end-actions"><button id="revisit-mountain" type="button">再賞秋山</button><a class="primary" href="./appreciation.html" target="_blank" rel="noopener noreferrer">教師帶領賞詩 ↗</a></div>';
 panel.innerHTML=html;panel.scrollTop=0;syncHint();
 $('#reflection-picker')?.addEventListener('click',e=>{
  const button=e.target.closest('button');if(!button||button.disabled)return;
  if(button.dataset.pickMode){reflectionMode=button.dataset.pickMode;reflectionShared=false;}
  else if(button.dataset.pickChar){state={...state,reflection:pickReflection(state.reflection,Number(button.dataset.pickChar),reflectionMode)};reflectionShared=false;persist();}
  else if(button.hasAttribute('data-pick-clear')){state={...state,reflection:emptyReflection()};reflectionMode='scenery';reflectionShared=false;persist();}
  else if(button.hasAttribute('data-pick-share'))reflectionShared=true;
  const wrap=$('#reflection-picker'),scroll=panel.scrollTop;wrap.innerHTML=reflectionMarkup(state.reflection,reflectionMode,reflectionShared);panel.scrollTop=scroll;
  // Restore keyboard focus after updating just the annotation area.
  const selector=button.dataset.pickMode?`[data-pick-mode="${button.dataset.pickMode}"]`:button.dataset.pickChar?`[data-pick-char="${button.dataset.pickChar}"]`:button.hasAttribute('data-pick-clear')?'[data-pick-clear]':'[data-pick-share]';
  wrap.querySelector(selector)?.focus({preventScroll:true});
  if(reflectionShared){wrap.querySelector('.picker-discussion')?.scrollIntoView({block:'nearest',behavior:'instant'});if(assessReflection(state.reflection).status==='correct'){
   celebrate();
   const invitation=document.createElement('section');invitation.className='poet-invitation';invitation.setAttribute('aria-label','杜牧的邀請');
   invitation.innerHTML='<img src="assets/poet.png" alt="杜牧現身"><div><p class="speaker">杜牧</p><p class="speech">「你知道我為甚麼選這些景物嗎？」</p><p>帶着你找到的詩句，寫下自己的發現。</p><a class="primary" href="./activities.html">回憶小記與課後溫習 →</a></div>';
   wrap.append(invitation);
  }else tossBomb();}else clearCelebration();
 });
 $('#revisit-mountain')?.addEventListener('click',()=>{taskCollapsed=true;syncTaskVisibility();world?.view('wide');});
 $('#hint-button')?.addEventListener('click',()=>{hintLevel=(hintLevel+1)%3;syncHint();});
 panel.querySelectorAll('input[name=answer]').forEach(el=>el.addEventListener('change',()=>{state={...state,choice:Number(el.value)};error='';persist();$('#confirm').disabled=false;$('.feedback').textContent='';}));
 $('#confirm')?.addEventListener('click',()=>{const r=answer(state);if(r.error){state=r.state;error=r.error;persist();panel.querySelectorAll('input[name=answer]').forEach(el=>{el.checked=false;el.disabled=!!state.responses[STAGES[state.stage].id]?.includes(Number(el.value));});$('#confirm').disabled=true;$('.feedback').textContent=error;$('.question-score').textContent=`本題答對可得 ${questionPoints(state)} 分 · 如果你覺得有困難，可以使用提示，使用提示不扣分`;syncScore();}else setState(r.state);});
 $('#poet-name-form')?.addEventListener('submit',e=>{
  e.preventDefault();
  const input=$('#poet-name');
  if(e.isComposing)return;
  const next=advance(state,input.value);
  if(next===state){
   input.setAttribute('aria-invalid','true');
   $('#name-feedback').textContent=input.value.trim()?'再看看書中的詩句，想一想作者是誰。':'請先輸入詩人姓名。';
   input.focus();
   return;
  }
  setState(next);
 });
 $('#poet-name')?.addEventListener('input',e=>{e.target.removeAttribute('aria-invalid');$('#name-feedback').textContent='';});
 $('#next')?.addEventListener('click',()=>setState(advance(state)));
}
function showModal(kind){stopReveal();let html='';if(kind==='poem')html=`<p class="kicker">重讀詩句，找出線索</p><h2 style="text-align:center">山行</h2><p class="author">〔唐〕杜牧</p><div class="poem-text">${POEM.map(l=>`<div>${l}</div>`).join('')}</div>`;
 if(kind==='help')html='<h2>玩法與計分</h2><p>每題第一次答對得 2 分，第二次得 1 分，第三次起答對不加分。答錯仍可繼續嘗試；使用提示不扣分，口頭討論不計分。</p><p>讀詩，找出線索，再選擇符合詩意的景物。</p><p>每找回一段記憶，秋山便會多一分清楚。</p><p>遇到說明任務時，請先與同伴討論，再分享你的理由。</p><p>拖曳看景・雙指縮放<br>也可以按「換個角度」及「＋／−」觀看。</p>';
 if(kind==='journal'){const parts=sceneFor(state);html=`<h2>尋憶手記</h2><ol class="journal-list">${[['石徑',parts.road],['白雲',parts.clouds],['人家',parts.houses],['楓林',parts.forest],['停車的原因',state.sharedCause],['最後一抹紅',state.sharedRed]].map(([name,yes])=>`<li>${name}　${yes?'已尋回':'待尋回'}</li>`).join('')}</ol>${state.note?`<p class="journal-note">${escape(noteText(state.note))}</p><button id="download-note">下載手記</button>`:'<p>走過秋山後，回看詩中的景物，想想杜牧最喜歡甚麼。</p>'}`;}
 if(kind==='reset')html='<h2>要重新開始這段旅程嗎？</h2><p>本章進度、分數與手記將會清除。</p><div class="actions"><button id="keep">保留記憶</button><button id="restart" class="primary">重新開始</button></div>';
 $('#modal-content').innerHTML=html;modal.showModal();$('#keep')?.addEventListener('click',()=>modal.close());$('#restart')?.addEventListener('click',()=>{state=freshState();reflectionMode='scenery';reflectionShared=false;home=true;error='';taskCollapsed=false;taskScroll=0;persist();modal.close();render();});$('#download-note')?.addEventListener('click',()=>{const url=URL.createObjectURL(new Blob(['入畫｜秋山歸憶\n\n'+noteText(state.note)],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='秋山歸憶-尋憶手記.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
}
document.addEventListener('click',e=>{const tool=e.target.closest('[data-modal]');if(tool)showModal(tool.dataset.modal);const view=e.target.closest('[data-view]');if(view)world?.view(view.dataset.view);const zoom=e.target.closest('[data-zoom]');if(zoom)world?.zoom(Number(zoom.dataset.zoom));});
$('#scene-replay').addEventListener('click',()=>showReveal(latestReveal(state.stage)));
$('#reveal-continue').addEventListener('click',()=>stopReveal());
$('#enter-verse').addEventListener('click',()=>$('#verse-screen').close());
$('#task-toggle').addEventListener('click',()=>{if(!taskCollapsed)taskScroll=panel.scrollTop;taskCollapsed=!taskCollapsed;syncTaskVisibility();if(!taskCollapsed)panel.scrollTop=taskScroll;});
$('#start').addEventListener('click',()=>{home=false;taskCollapsed=false;if(state.stage<0)state.stage=0;persist();render();});$('#brand').addEventListener('click',e=>{e.preventDefault();stopReveal(false);home=true;taskCollapsed=false;render();});$('#reset').addEventListener('click',()=>showModal('reset'));$('#close-modal').addEventListener('click',()=>modal.close());modal.addEventListener('click',e=>{if(e.target===modal){const r=modal.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)modal.close();}});
render();
try{world=createAutumnWorld($('#world'),$('#scene-status'));world.apply(sceneFor(state),state.stage);const portrait=await world.ready;$('#visitor').src=portrait.toDataURL();opening.ready();render();}catch(e){opening.ready();console.error('秋山場景載入失敗',e);$('#scene-status').textContent='水彩秋山未能完整載入。請重新整理，或稍後再試。已保存的進度與手記不受影響。';}
