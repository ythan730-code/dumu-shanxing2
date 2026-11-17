// Optional scaffolds: the first step directs attention; the second explains it.
export const HINTS={
 'road-material':{clues:['石徑'],steps:['看看「石徑」。「徑」是小路，前面哪個字說明小路的材料？','把「石徑」分成「石」和「徑」來讀，再比較選項中的路面。']},
 'road-direction':{clues:['遠','上','斜'],steps:['先看「上」，杜牧往高處走，還是往低處走？','「遠上」寫路向遠處、高處延伸；「斜」寫石徑沿山勢斜斜伸展。哪個選項能把這些線索合起來？']},
 cloud:{clues:['白雲'],steps:['先讀詩句最前面的兩個字，找出山間的景物。','「雲」在山間飄浮。再比較炊煙、雪花，哪個名稱真的寫在詩中？']},
 house:{clues:['白雲生處'],steps:['「有人家」前面的四個字，在說人家的位置。','「生處」是白雲生起、浮現的地方。想像你沿石徑往上望，人家應在甚麼高度？']},
 forest:{clues:['楓林'],steps:['在「愛」字後面找一找，詩人喜愛哪一種樹林？','把「楓林」拆開讀：「林」是樹林，前面哪個字告訴你樹的種類？']},
 cause:{clues:['坐','愛'],steps:['找一找「愛」字。詩人停車和他喜愛的景物有甚麼關係？','把「停車」和「愛楓林晚」連起來，想一想哪個選項能說明停車的原因。']},
 'cause-share':{clues:['坐','愛'],steps:['把三個意思分別放進詩句，讀一讀，哪個最通順？','前半句寫「停車」，後半句寫「愛楓林晚」。「坐」把詩人的行動和原因連起來。']},
 leaf:{clues:['霜葉'],steps:['先找這句正在描寫的景物。開頭是「葉」，還是「花」？','「霜葉」是經霜的葉子；「二月花」用來和葉子比較。想想眼前要找回的是哪一樣。']},
 'red-share':{clues:['霜葉','紅於','二月花'],steps:['先找比較的兩樣景物，再看比較甚麼。','「紅於」就是「比……更紅」。試着說：「詩人覺得＿＿比＿＿更＿＿。」再想想，這樣比較突出了霜葉的甚麼特點。']},
 note:{clues:[],steps:['從第一句開始，依次找出詩中出現的景物，再看看完整的秋山。','留意「停車」「愛」「紅於」。這些字詞怎樣讓你知道詩人最喜歡甚麼？']}
};

// Coordinates use the painting's own 1536 × 1024 space, not screen pixels.
export const REVEALS=[
 {stage:4,id:'flatRoad',halo:false,title:'石頭路出現了',detail:'先看山腳：石頭鋪成的小路。',quote:'石徑',x:280,y:887,rx:225,ry:46,zoom:1.35},
 {stage:5,id:'road',halo:false,title:'石徑向山上延伸了',detail:'沿着小路往上看，它漸漸伸向遠處。',quote:'遠上寒山石徑斜',x:1100,y:460,rx:100,ry:180,zoom:1.35},
 {stage:7,id:'clouds',title:'白雲浮現了',detail:'看山腰與山谷間，白雲正繚繞山間。',quote:'白雲生處',x:580,y:440,rx:225,ry:125,zoom:1.3},
 {stage:9,id:'houses',title:'雲間的人家出現了',detail:'抬頭看山的高處，小小的屋舍就在雲間。',quote:'白雲生處有人家',x:1145,y:170,rx:132,ry:82,zoom:1.7},
 {stage:11,id:'forest',title:'楓林浮現了',detail:'看右側山坡，楓樹的枝葉還帶着淡淡的顏色。',quote:'楓林晚',x:1190,y:590,rx:200,ry:260,zoom:1.35},
 {stage:14,id:'cart',title:'馬車停在楓林旁了',detail:'看石徑旁停下的馬車，再想想它為甚麼停下。',quote:'停車坐愛楓林晚',x:390,y:735,rx:235,ry:125,zoom:1.55},
 {stage:16,id:'pale',title:'霜葉泛起淡紅色',detail:'仔細看看枝葉，模糊的葉色開始恢復了。',quote:'霜葉',x:1190,y:590,rx:200,ry:260,zoom:1.45},
 {stage:17,id:'red',title:'最後一抹紅回來了',detail:'楓葉由淡紅變得鮮明，這就是留住杜牧的秋色。',quote:'霜葉紅於二月花',x:1190,y:590,rx:200,ry:260,zoom:1.45}
];
export function newReveal(previous,next){return next>previous?REVEALS.find(r=>r.stage===next):undefined;}
export function latestReveal(stage){return [...REVEALS].reverse().find(r=>r.stage<=stage);}
