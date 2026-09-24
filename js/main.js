(function(){
'use strict';
var started=false;
function fatal(m){var c=document.getElementById('game-container');if(c)c.innerHTML='<div style="direction:rtl;color:#fff;background:#0b0e14;min-height:100vh;display:flex;align-items:center;justify-content:center;font-family:Cairo;padding:20px;text-align:center"><div><h2 style="color:#d4af37">تعذر تشغيل وكر الأوغاد</h2><p>'+m+'</p></div></div>';}
function boot(){
 if(started)return;
 if(!window.Phaser){fatal('تعذر تحميل محرك اللعبة');return;}
 var miss=[];
 if(typeof GameState==='undefined')miss.push('GameState');
 if(typeof CityScene==='undefined')miss.push('CityScene');
 if(typeof LocationScene==='undefined')miss.push('LocationScene');
 if(typeof MissionsScene==='undefined')miss.push('MissionsScene');
 if(typeof TrainingScene==='undefined')miss.push('TrainingScene');
 if(typeof MissionBattleScene==='undefined')miss.push('MissionBattleScene');
 if(typeof ArenaBattleScene==='undefined')miss.push('ArenaBattleScene');
 if(miss.length){fatal('ملفات اللعبة ناقصة: '+miss.join('، '));return;}
 try{
  window.gameState=new GameState();window.gameState.load();
  window.game=new Phaser.Game({
   type:Phaser.AUTO,parent:'game-container',backgroundColor:'#0b0e14',
   scene:[CityScene,LocationScene,MissionsScene,TrainingScene,MissionBattleScene,ArenaBattleScene],
   scale:{mode:Phaser.Scale.RESIZE,width:800,height:620,autoCenter:Phaser.Scale.CENTER_BOTH},
   render:{antialias:true,roundPixels:true}
  });
  started=true;
  window.setInterval(function(){if(window.gameState)window.gameState.tick(1);},1000);
  window.setInterval(function(){if(window.gameState)window.gameState.save();},5000);
  window.addEventListener('beforeunload',function(){if(window.gameState)window.gameState.save();});
 }catch(e){fatal('حدث خطأ أثناء إنشاء اللعبة');console.error(e);}
}
window.addEventListener('load',function(){
 if(window.Phaser)boot();
 else{var s=document.createElement('script');s.src='https://unpkg.com/phaser@3.70.0/dist/phaser.min.js';s.onload=boot;s.onerror=function(){fatal('تعذر تحميل Phaser من المصدرين.');};document.head.appendChild(s);}
});
})();