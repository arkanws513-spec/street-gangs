function GameState(){
  this.resources=Object.assign({},GAME_CONFIG.startingResources);
  this.progress=Object.assign({},GAME_CONFIG.startingProgress);
  this.stats=Object.assign({},GAME_CONFIG.startingStats);
  this.location='main'; this.lastCity='main'; this.currentArenaLevel=1;
  this.completedMissions=[]; this.timers=[]; this.log=[]; this._energyAccumulator=0;
}
GameState.prototype.load=function(){
  try{var raw=localStorage.getItem(GAME_CONFIG.saveKey);if(!raw)return;var d=JSON.parse(raw);
    this.resources=Object.assign({},GAME_CONFIG.startingResources,d.resources||{});
    this.progress=Object.assign({},GAME_CONFIG.startingProgress,d.progress||{});
    this.stats=Object.assign({},GAME_CONFIG.startingStats,d.stats||{});
    this.location=d.location||'main';this.lastCity=d.lastCity||'main';this.currentArenaLevel=d.currentArenaLevel||1;
    this.completedMissions=d.completedMissions||[];this.timers=d.timers||[];this.log=d.log||[];
  }catch(e){console.warn('save load failed',e);}
};
GameState.prototype.save=function(){try{localStorage.setItem(GAME_CONFIG.saveKey,JSON.stringify({
  resources:this.resources,progress:this.progress,stats:this.stats,location:this.location,lastCity:this.lastCity,
  currentArenaLevel:this.currentArenaLevel,completedMissions:this.completedMissions,timers:this.timers,log:this.log.slice(-40)
}));}catch(e){}};
GameState.prototype.addLog=function(t){this.log.push({text:t,at:Date.now()});if(this.log.length>40)this.log.shift();};
GameState.prototype.totalPower=function(){return this.stats.strength+this.stats.speed+this.stats.defense+this.stats.accuracy;};
GameState.prototype.canTrain=function(stat){return this.progress.stamina>0&&this.stats[stat]<100;};
GameState.prototype.upgradeStat=function(stat){
  if(!this.canTrain(stat))return{ok:false,reason:this.progress.stamina<=0?'لا توجد نقاط تحمل':'وصل المؤشر للحد الحالي'};
  this.progress.stamina--;this.stats[stat]++;this.addLog('تم تطوير '+stat+' باستخدام نقطة تحمل');this.save();return{ok:true};
};
GameState.prototype.gainXP=function(amount){
  this.progress.xp+=amount;
  var leveled=0;
  while(this.progress.xp>=this.progress.nextXp){this.progress.xp-=this.progress.nextXp;this.progress.level++;this.progress.stamina+=5;this.progress.nextXp=Math.ceil(this.progress.nextXp*1.35);leveled++;}
  return leveled;
};
GameState.prototype.startMission=function(id){
  var m=MISSIONS.find(function(x){return x.id===id;});
  if(!m)return{ok:false,reason:'المهمة غير موجودة'};
  if(this.resources.energy<m.energy)return{ok:false,reason:'الطاقة غير كافية'};
  this.resources.energy-=m.energy;this.save();return{ok:true,mission:m};
};
GameState.prototype.resolveMissionBattle=function(m,win){
  if(win){
    this.resources.cash+=m.reward;this.resources.reputation+=Math.max(2,m.difficulty==='صعبة جدًا'?8:4);
    var levels=this.gainXP(m.xp);if(this.completedMissions.indexOf(m.id)<0)this.completedMissions.push(m.id);
    this.addLog('نجحت في '+m.name+' وربحت '+m.reward+' 💵 و '+m.xp+' XP');
    this.save();return{levels:levels};
  }
  this.addLog('خسرت معركة المهمة. تم خصم الطاقة عند بدء المهمة فقط.');this.save();return{levels:0};
};
GameState.prototype.startArena=function(){
  var enemyPower=ARENA_BASE+(this.currentArenaLevel-1)*35;
  return{name:'مقاتل المستوى '+this.currentArenaLevel,power:enemyPower};
};
GameState.prototype.resolveArena=function(win){
  if(win){this.resources.cash+=150+this.currentArenaLevel*70;this.resources.reputation+=3;this.currentArenaLevel++;this.gainXP(45);this.addLog('انتصرت في الحلبة وتنتظرك مواجهة أقوى.');}
  else{this.addLog('خسرت في الحلبة وتحتاج إلى العلاج.');}this.save();
};
GameState.prototype.travel=function(city){if(!CITIES[city]||city.indexOf('future')===0)return false;this.lastCity=this.location;this.location=city;this.save();return true;};
GameState.prototype.tick=function(dt){this._energyAccumulator+=dt;while(this._energyAccumulator>=GAME_CONFIG.energyRegenSeconds){this._energyAccumulator-=GAME_CONFIG.energyRegenSeconds;if(this.resources.energy<this.resources.maxEnergy)this.resources.energy++;}this.save();};