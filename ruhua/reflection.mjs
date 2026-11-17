// All 28 characters are equally selectable; no noun boundaries are shown.
export const VERSES=['遠上寒山石徑斜','白雲生處有人家','停車坐愛楓林晚','霜葉紅於二月花'];
const TEXT=VERSES.join('');
const OLD_RANGES={mountain:[2,3],path:[4,5],cloud:[7,8],house:[12,13],maple:[18,19],leaf:[21,22],flower:[25,26,27]};
export const emptyReflection=()=>({version:2,scenery:[],favorite:[]});
const clean=values=>[...new Set((Array.isArray(values)?values:[]).filter(n=>Number.isInteger(n)&&n>=0&&n<28))].sort((a,b)=>a-b);
export function normalizeReflection(raw){
 if(raw?.version===2)return {version:2,scenery:clean(raw.scenery),favorite:clean(raw.favorite)};
 return {version:2,scenery:clean((Array.isArray(raw?.scenery)?raw.scenery:[]).flatMap(id=>OLD_RANGES[id]||[])),favorite:clean(OLD_RANGES[raw?.favorite]||[])};
}
export function pickReflection(raw,index,mode){const s=normalizeReflection(raw);if(!Number.isInteger(index)||index<0||index>=28)return s;const field=mode==='favorite'?'favorite':'scenery';return {...s,[field]:s[field].includes(index)?s[field].filter(n=>n!==index):clean([...s[field],index])};}
export function selectedWords(indices){const groups=[];for(const n of clean(indices)){const last=groups.at(-1);if(last&&last.at(-1)+1===n&&Math.floor(last[0]/7)===Math.floor(n/7))last.push(n);else groups.push([n]);}return groups.map(g=>g.map(n=>TEXT[n]).join('')).join('、');}
export function assessReflection(raw){
 const s=normalizeReflection(raw),has=(range,list)=>range.every(n=>list.includes(n));
 const sceneryWords=Object.values(OLD_RANGES).slice(0,6).flat();
 if(s.scenery.some(n=>[25,26,27].includes(n)))return {status:'retry',reason:'comparison',message:'再讀一讀：你圈出的每一處，都是此次山行看到的景物嗎？有沒有用來比較的景物？'};
 if(s.scenery.some(n=>!sceneryWords.includes(n)))return {status:'retry',reason:'word',message:'看看圈選的字能否組成景物的名稱。有沒有把動作或描述的字也圈進去了？'};
 const maple=has([18,19],s.favorite)&&s.favorite.every(n=>[18,19,20].includes(n));
 const leaf=has([21,22],s.favorite)&&s.favorite.every(n=>[21,22].includes(n));
 if(!maple&&!leaf)return {status:'retry',reason:'favorite',message:'重新讀一讀詩人停下來的那一句。你標上愛心的字，能否組成他最喜歡的景物名稱？'};
 if(![[2,3],[4,5],[7,8],[12,13]].every(r=>has(r,s.scenery))||![[18,19],[21,22]].some(r=>has(r,s.scenery)))return {status:'retry',reason:'missing',message:'再逐句讀一次，檢查是否漏了景物，或少圈了詞語中的字。'};
 // Selected synonyms may both be marked, but each marked name must be complete.
 if(Object.values(OLD_RANGES).slice(0,6).some(r=>r.some(n=>s.scenery.includes(n))&&!has(r,s.scenery)))return {status:'retry',reason:'word',message:'有些景物名稱還沒有圈完整。再看看相鄰的字。'};
 return {status:'correct',reason:'evidence',message:'景物找齊了！你也找到了留住杜牧的秋色。請用詩中的字詞，說說你為甚麼這樣選。'};
}
function feedbackMarkup(raw){const result=assessReflection(raw),correct=result.status==='correct';
 return `<div class="picker-discussion ${correct?'picker-success':'picker-retry'}" role="status"><p class="effect-title">${correct?'煙花送給你！':'再讀一讀，再試一次。'}</p><p>${result.message}</p>${correct?'<p>你從哪些字詞看出杜牧的喜愛？</p>':''}</div>`;
}
export function reflectionMarkup(raw,mode='scenery',shared=false){const s=normalizeReflection(raw);return `
 <div class="poem-picker" aria-label="自由圈選古詩">
 <div class="picker-toolbar"><div class="picker-modes" role="group" aria-label="選擇標記工具">
 <button type="button" data-pick-mode="scenery" aria-pressed="${mode==='scenery'}">① 圈出景物</button>
 <button type="button" data-pick-mode="favorite" aria-pressed="${mode==='favorite'}">② ♥ 標記最愛</button></div>
 <p class="picker-instruction" role="status">${mode==='scenery'?'正在圈出景物：逐字點選，連成詞語。':'正在標記最愛：點選組成景物名稱的字，便會出現愛心。'}再點一次可取消。</p></div>
 <div class="annotation-poem free-annotation" aria-label="山行，杜牧">${VERSES.map((line,row)=>'<p>'+[...line].map((char,col)=>{const index=row*7+col,selected=mode==='favorite'?s.favorite.includes(index):s.scenery.includes(index),heart=s.favorite.includes(index)&&(!s.favorite.includes(index+1)||col===6);return `<button type="button" data-pick-char="${index}" aria-label="第${row+1}句第${col+1}字：${char}" aria-pressed="${selected}" class="${s.scenery.includes(index)?'scenery-picked ':''}${s.favorite.includes(index)?'favorite-picked':''}">${char}${heart?'<span class="favorite-seal" aria-hidden="true">♥</span>':''}</button>`;}).join('')+'</p>').join('')}</div>
 <p class="picker-key"><span>底線＝我圈的景物</span><span>♥＝我標記的最愛</span></p>
 <div class="picker-summary" aria-live="polite"><p>我圈選的景物：${selectedWords(s.scenery)||'尚未圈選'}</p><p>我認為杜牧最喜歡：${selectedWords(s.favorite)||'尚未標記；請先按「② ♥ 標記最愛」'}</p></div>
 <div class="picker-actions"><button type="button" class="primary" data-pick-share ${!s.scenery.length||!s.favorite.length?'disabled':''}>選好了，分享理由</button><button type="button" data-pick-clear>重新圈選</button></div>
 ${shared?feedbackMarkup(s):''}
 </div>`;}
