export const STEPS=[
 {title:'與杜牧談詩',chapter:'一 · 賞析',question:'你知道我最喜歡的是甚麼景物嗎？你怎麼知道的？',hint:'除了「愛」字，還有哪些動作或比較讓你感受到他的喜愛？',summary:'「愛」直接表達喜愛；「停車」以動作寫出留戀；「紅於二月花」借春花作比較，突出霜葉的鮮艷，傳達讚美。\n表達感情，可以直接抒情，也可以透過動作、比較等方法間接表達。'},
 {title:'同樣的秋天，不同的感受',chapter:'一 · 賞析',question:'杜牧對秋天的感受是怎樣的？',hint:'看見甚麼景物？哪些字詞支持你的想法？人物正在賞景，還是遠行在外？',summary:'杜牧喜愛秋色，因楓林而停車；〈秋思〉的遠行者身在天涯，流露孤寂與思鄉。\n同樣是秋天，景物與人物處境不同，感受也可能不同。「一切景語皆情語」：描寫景物的文字，也寄託着作者的感情。'},
 {title:'帶着喜愛，再讀《山行》',chapter:'二 · 全班朗讀',question:'讓我們一起朗讀全詩，再次體會我對秋天的喜愛。',hint:'讀到「停車」「愛」「紅於」時，想想其中的留戀與讚美。',summary:'把我們對景物和感情的理解，融入朗讀。',next:'寫下回憶小記 →'},
 {title:'回憶小記',chapter:'三 · 總結性評估',question:'謝謝你幫我找回秋山的記憶。為了防止我再忘記，請留下你的發現，再運用今天學到的一種方法，寫出你對景物的喜愛。',hint:'',summary:'選擇景物，表達感受；運用直接抒情、動作或比較，讓讀者感受到你的喜愛。'}
];
export const SENTENCE_FRAMES=[
 '杜牧曾在秋天乘車登山，他看到了＿＿＿＿。他特別喜愛＿＿，還特別寫了一句詩「＿＿＿＿」。',
 '於我而言，秋天是＿＿（感受）的，我會選＿＿（景物）來創作，因為＿＿。',
 '以下是我的創作：＿＿＿＿。（選用上一題中一處你喜愛的景物，運用今天學到的一種方法，寫一至兩句，讓讀者感受到你的喜愛。）'
];
export const FULL_SCENE={road:true,clouds:true,houses:true,forest:true,cart:true,leaves:'red',evening:true,full:true,poet:true,poetPlace:'maple',gaze:true};
export function sceneAt(){return {...FULL_SCENE};}
export function stepIndex(n){return Math.max(0,Math.min(STEPS.length-1,Number.isFinite(n)?Math.trunc(n):0));}

export const EVIDENCE_STEPS=[
 {label:'找字詞',target:'愛',title:'哪個字直接寫出喜愛？',verse:'停車坐愛楓林晚，霜葉紅於二月花。',revealedVerse:'停車坐<mark>愛</mark>楓林晚，霜葉紅於二月花。',prompt:'如果只選一個字，你會選哪個？',explanation:'「愛」直接說出對楓林的喜愛。這是直接抒情。'},
 {label:'看動作',target:'停車',title:'甚麼動作讓你感到留戀？',verse:'停車坐愛楓林晚，霜葉紅於二月花。',revealedVerse:'<mark>停車</mark>坐愛楓林晚，霜葉紅於二月花。',prompt:'詩中寫了甚麼動作？這個動作讓你感受到詩人怎樣的心情？',explanation:'杜牧因喜愛楓林而停車欣賞。用「停車」這個動作，讓讀者感受到他的留戀，是間接表達感情。'},
 {label:'作比較',target:'紅於',rewrite:'霜葉紅如二月花',title:'「紅於」換成「紅如」，一樣嗎？',verse:'霜葉紅於二月花',revealedVerse:'霜葉<mark>紅於</mark>二月花',prompt:'「霜葉紅於二月花」與「霜葉紅如二月花」，哪一句更能突出霜葉的紅？為甚麼？',explanation:'「紅如」是像春花一樣紅；「紅於」是比春花更紅。杜牧借鮮艷的春花作比較，突出霜葉更紅艷，流露對秋色的讚美。'},
 {
  label:'換字推敲',
  target:'霜',
  title:'換一個字，少了甚麼？',
  verse:'霜葉紅於二月花',
  rewrite:'紅葉紅於二月花',
  revealedVerse:'<mark>霜</mark>葉紅於二月花',
  prompt:'兩句都寫葉子比春花更紅。換字後，哪一層意思不見了？你從哪個字看出來？',
  explanation:'「紅葉」只寫出葉子的顏色。「霜葉」讓我們想到，楓葉經過秋霜，仍然紅得鮮艷。這份經霜仍紅的頑強，讓我們更能體會杜牧對楓葉的喜愛和讚美。'
 },
 {label:'帶走方法',title:'怎樣讓讀者感受到喜愛？',verse:'停車坐愛楓林晚，霜葉紅於二月花。',prompt:'除了直接說「我喜歡」，還可以怎樣寫？',explanation:'直接抒情：「愛」直接說出喜愛。\n間接表達：用「停車」的動作寫出留戀；借「紅於二月花」的比較傳達讚美。'}
];

export function evidenceVerse(index,revealed=false){const step=EVIDENCE_STEPS[index];return revealed?(step.revealedVerse||step.verse):step.verse;}

export function correctEvidenceSelection(level,indices){
 const target=EVIDENCE_STEPS[level]?.target;
 if(!target)return false;
 const chars=Array.from(evidenceVerse(level));
 const selected=[...indices].sort((a,b)=>a-b);
 if(selected.some(i=>!Number.isInteger(i)||i<0||i>=chars.length))return false;
 return selected.map(i=>chars[i]).join('')===target;
}
