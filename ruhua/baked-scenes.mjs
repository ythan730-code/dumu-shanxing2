const dir='assets/ruhua-stages/baked/';
export const SCENE_FRAMES=Object.freeze(Object.fromEntries(['bare','footpath','path','clouds','houses','forest','cart','pale','red'].map(id=>[id,dir+id+'.webp'])));
export function sceneIdFor(s){
 if(s.forest&&s.leaves==='red')return 'red';
 if(s.cart&&s.leaves==='pale')return 'pale';
 if(s.cart)return 'cart';
 if(s.forest)return 'forest';
 if(s.houses)return 'houses';
 if(s.clouds)return 'clouds';
 if(s.road)return 'path';
 if(s.flatRoad)return 'footpath';
 return 'bare';
}
export const sceneAssetFor=s=>SCENE_FRAMES[sceneIdFor(s)];
