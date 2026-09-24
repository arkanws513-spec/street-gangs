const KEY="street-gangs-phaser-save-v1";
const defaults={level:1,xp:0,cash:2500,energy:10,maxEnergy:10,stamina:10,completed:0,stats:{strength:7,defense:10,speed:5,accuracy:8},gear:{vest:false,weapon:false}};
export function loadState(){try{return Object.assign(structuredClone(defaults),JSON.parse(localStorage.getItem(KEY)||"null")||{})}catch{return structuredClone(defaults)}}
export function saveState(state){localStorage.setItem(KEY,JSON.stringify(state))}