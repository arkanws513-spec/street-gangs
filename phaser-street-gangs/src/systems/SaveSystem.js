const KEY="street-gangs-phaser-save-v1";
const defaults={level:1,xp:0,cash:2500,energy:10,maxEnergy:10,stamina:10,completed:0,stats:{strength:7,defense:10,speed:5,accuracy:8},gear:{vest:false,weapon:false}};
function cloneDefaults(){return JSON.parse(JSON.stringify(defaults))}
export function loadState(){
  try{
    const raw=JSON.parse(localStorage.getItem(KEY)||"null");
    if(!raw)return cloneDefaults();
    const base=cloneDefaults();
    return {...base,...raw,stats:{...base.stats,...(raw.stats||{})},gear:{...base.gear,...(raw.gear||{})}};
  }catch{return cloneDefaults()}
}
export function saveState(state){localStorage.setItem(KEY,JSON.stringify(state))}
