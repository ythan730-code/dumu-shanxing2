import {emptyReflection,normalizeReflection} from './reflection.mjs';
export const POEM=['遠上寒山石徑斜','白雲生處有人家','停車坐愛楓林晚','霜葉紅於二月花'];
export const STAGES=[
 {id:'visitor',kind:'intro',title:'課本中的來客',speaker:'陌生男子',speech:'這是何處？我怎麼會來到這裏？',next:'你是誰？'},
 {id:'name',kind:'identity',title:'兩張褪色的詩箋',speaker:'陌生男子',speech:'我……記不起來了。身上只剩這兩張詩箋。',next:'確認姓名'},
 {id:'enter',kind:'intro',title:'一座似曾相識的山',speaker:'杜牧',speech:'杜牧……這名字很熟悉。似乎就是我呢！我眼前的這座山也很熟悉，我好像認得它，請陪我進去看看。',next:'走進秋山'},
 {id:'road-material',kind:'quiz',memory:1,title:'上山的路',poem:0,speech:'我記得自己向山上走去……腳下是一條怎樣的路？',question:'請根據本句古詩，哪一條路符合杜牧記憶中的路？',options:['石頭鋪成的小路','滿是泥土的小路','溪流和鮮花環繞的小路'],correct:0,hint:'這個景象還是有些模糊。再看看「石徑」，哪個字告訴我們路的材料？'},
 {id:'road-direction',kind:'quiz',memory:1,title:'石徑通往哪裏？',poem:0,speech:'是石頭路！可是……我記得自己還沿着它往山上走。這條路的走向，好像還沒有恢復。',question:'請根據本句古詩，哪一種走向符合「遠上寒山石徑斜」？',options:['沿山坡蜿蜒曲折地向高處延伸','在山腳的平地上蜿蜒延伸','在山腳的平地上筆直延伸','沿山坡向低處延伸'],correct:0,hint:'再看看「遠上」和「斜」。這條石徑，是沿着山坡向哪裏伸去的？'},
 {id:'road-found',kind:'dialogue',memory:1,title:'石徑恢復了',poem:0,speech:'對了！我沿着這條石徑，漸漸走向高處。抬頭望去，山間似乎還有甚麼……',next:'沿着石徑走'},
 {id:'cloud',kind:'quiz',memory:2,title:'山間的白雲',poem:1,speech:'走着走着，我抬起頭。山的高處，似乎有甚麼正在浮動。',question:'請根據本句古詩，詩句中的山間，應該出現甚麼？',options:['白雲','炊煙','雪花'],correct:0,hint:'先讀一讀這句詩開頭的兩個字，再試一次。'},
 {id:'cloud-found',kind:'dialogue',memory:2,title:'白雲浮現',poem:1,speech:'對，是白雲。雲氣之間，好像還藏着甚麼……',next:'望向白雲深處'},
 {id:'house',kind:'quiz',memory:3,title:'雲間的人家',poem:1,speech:'我彷彿看見了屋頂。那些人家，究竟在哪裏？',question:'請根據本句古詩，把人家放在哪裏，最符合詩句？',options:['山腳的平地上','眼前的路口旁','山上白雲繚繞的地方'],correct:2,hint:'再看看「白雲生處」。這幾個字，告訴了我們人家的位置。'},
 {id:'house-found',kind:'dialogue',memory:3,title:'雲間有人家',poem:1,speech:'想起來了。沿着石徑往上望，白雲間還住着人家。',next:'繼續尋找記憶'},
 {id:'forest',kind:'quiz',memory:4,title:'路旁的樹林',poem:2,speech:'後來，我在一片樹林旁停了下來。那是甚麼樹呢？',question:'請根據本句古詩，哪一片樹林出現在詩中？',options:['柳樹林','楓樹林','竹林'],correct:1,hint:'讀到「愛」字後面，找找樹林的名字。'},
 {id:'forest-found',kind:'dialogue',memory:4,title:'楓林晚景',poem:2,speech:'就是這片楓林。可是，我為甚麼會在這裏停車？',next:'找出停車的原因'},
 {id:'cause',kind:'quiz',memory:5,title:'為甚麼停車？',poem:2,question:'請根據本句古詩，詩人為甚麼停車？',options:['因為喜愛傍晚的楓林','因為想坐在樹下休息','因為馬車壞了'],correct:0,hint:'看看「愛楓林晚」，詩人停車和喜愛楓林有甚麼關係？'},
 {id:'cause-share',kind:'quiz',memory:5,title:'推敲「坐」字',poem:2,question:'請根據詩意猜一猜，在這裡，「坐」是甚麼意思？',options:['坐下','座位','因為'],correct:2,hint:'把三個意思分別放進詩句，讀一讀，哪個最通順？'},
 {id:'cause-found',kind:'dialogue',memory:5,title:'是楓林留住了他',poem:2,speech:'這裏的「坐」是「因為」。原來，是這片晚間的楓林留住了我。',next:'看看他眼中的秋色'},
 {id:'leaf',kind:'quiz',memory:6,title:'最後一抹紅',poem:3,speech:'「二月花」……我的眼前究竟是花，還是葉？',question:'請根據本句古詩，想一想眼前究竟應該恢復哪一種景象？',options:['盛開的二月春花','嫩綠的新葉','經霜的紅葉'],correct:2,hint:'先找出這句詩描寫的是甚麼，再想想「二月花」為甚麼會出現在句中。'},
 {id:'red-share',kind:'share',memory:6,title:'霜葉與春花',poem:3,speech:'是經霜的紅葉。那麼，我為甚麼還要提「二月花」？',next:'確認分享'},
 {id:'red-found',kind:'dialogue',memory:6,title:'秋山恢復了色彩',poem:3,speech:'我想起來了！經霜的葉子，比二月的花還要紅艷。我正是因為喜愛這片秋色，才停下車來。',next:'展開完整的記憶'},
 {id:'result',kind:'summary',title:'尋憶成果',speech:'石徑、白雲、人家，還有讓我停下車的楓林……謝謝你們，陪我找回這段記憶。',next:'進入讀詩圈選'},
 {id:'note',kind:'reflection',title:'讀詩圈選',question:'請再想一想，此次山行，杜牧選擇了哪些景物來描寫？',followup:'他最喜歡甚麼景物？你從哪些字詞看出來？'},
];
export const freshState=()=>({version:1,flowVersion:2,stage:-1,choice:null,scoreStart:-1,responses:{},reflection:emptyReflection(),sharedCause:false,sharedRed:false,draft:{favorite:'',quote:'',image:''},note:null});
export function normalize(raw){const s=freshState();if(!raw||raw.version!==1)return s;
 s.stage=Number.isInteger(raw.stage)&&raw.stage>=-1&&raw.stage<=20?(raw.flowVersion===2?Math.min(raw.stage,19):Math.min(raw.stage,18)):-1;
 // Existing journeys begin scoring here; earlier answers are never invented.
 s.scoreStart=Number.isInteger(raw.scoreStart)&&raw.scoreStart>=-1&&raw.scoreStart<=s.stage?raw.scoreStart:s.stage;
 for(const [i,q] of STAGES.entries())if(q.kind==='quiz'&&i>=s.scoreStart&&i<=s.stage){
  const seen=[];for(const c of Array.isArray(raw.responses?.[q.id])?raw.responses[q.id]:[]){
   if(!Number.isInteger(c)||c<0||c>=q.options.length||seen.includes(c))continue;
   if(c===q.correct&&i>=s.stage)break;
   seen.push(c);if(c===q.correct)break;
  }
  if(seen.length)s.responses[q.id]=seen;
 }
 const t=STAGES[s.stage];s.choice=t?.kind==='quiz'&&Number.isInteger(raw.choice)&&raw.choice>=0&&raw.choice<t.options.length&&!s.responses[t.id]?.includes(raw.choice)?raw.choice:null;
 s.reflection=normalizeReflection(raw.reflection);
 // Restored progress also restores completed oral milestones.
 s.sharedCause=s.stage>=14;s.sharedRed=s.stage>=17;
 for(const key of ['favorite','quote','image'])s.draft[key]=typeof raw.draft?.[key]==='string'?raw.draft[key].slice(0,key==='image'?140:key==='quote'?70:40):'';
 if(raw.note&&['favorite','quote','image'].every(k=>typeof raw.note[k]==='string'&&raw.note[k].trim()))s.note={favorite:raw.note.favorite.slice(0,40),quote:raw.note.quote.slice(0,70),image:raw.note.image.slice(0,140)};
 return s;
}
export function sceneFor(s){const n=s.stage;return {flatRoad:n===4,road:n>=5,clouds:n>=7,houses:n>=9,forest:n>=11,cart:n>=14,leaves:n>=17?'red':n>=16?'pale':'mist',evening:n>=11,full:n>=18,poet:n>=2,poetPlace:n<6?'foot':n<8?'trail':n<10?'high':'maple',gaze:n>=14};}
export function advance(s,poetName){const n={...s,choice:null};const stage=STAGES[s.stage];if(stage?.kind==='identity'&&String(poetName??'').trim()!=='杜牧')return s;if(!stage||stage.kind==='quiz'||stage.kind==='reflection')return s;if(stage.id==='red-share')n.sharedRed=true;n.stage=Math.min(STAGES.length-1,s.stage+1);return n;}
export function questionPoints(s){const t=STAGES[s.stage];return Math.max(0,2-(s.responses?.[t?.id]?.length||0));}
export function scoreSummary(s){
 let points=0,completed=0,firstTry=0,eligible=0,legacy=0;
 for(const [i,t] of STAGES.entries())if(t.kind==='quiz'){
  if(i<(s.scoreStart??-1)){legacy++;continue;}eligible++;
  const attempts=s.responses?.[t.id]||[];
  if(attempts.at(-1)===t.correct){completed++;points+=Math.max(0,3-attempts.length);if(attempts.length===1)firstTry++;}
 }
 return {points,max:eligible*2,completed,firstTry,eligible,legacy};
}
export function answer(s){
 const t=STAGES[s.stage];
 if(t?.kind!=='quiz'||!Number.isInteger(s.choice)||s.choice<0||s.choice>=t.options.length)return {state:s,error:''};
 const previous=s.responses?.[t.id]||[];
 if(previous.includes(s.choice))return {state:s,error:'這個答案已試過，請先讀詩句，再選另一個答案。'};
 const next={...s,choice:null,responses:{...s.responses,[t.id]:[...previous,s.choice]}};
 if(s.choice!==t.correct)return {state:next,error:t.hint};
 return {state:{...next,stage:s.stage+1,sharedCause:s.sharedCause||t.id==='cause-share'},error:''};
}
export const noteText=n=>n?`我最喜歡${n.favorite}。詩中的「${n.quote}」，讓我想像到${n.image.replace(/[。.!！?？]+$/u,'')}。`:'';
