class MissionBattleScene extends Phaser.Scene{
 constructor(){super('MissionBattleScene');}
 create(){var s=this,gs=window.gameState,m=window.pendingMission;if(!m){s.scene.start('MissionsScene');return;}this.playerHP=100;this.enemyHP=100;this.turn='player';this.done=false;
  header(s,'معركة المهمة','missions');txt(s,400,126,m.name,20,COLORS.gold);txt(s,400,151,m.difficulty+' • '+m.type,12,COLORS.muted);
  panel(s,50,185,300,190,COLORS.panel2);panel(s,450,185,300,190,COLORS.panel2);
  txt(s,200,220,'أنت',20,COLORS.text);txt(s,600,220,'ممثل المهمة',20,COLORS.text);
  txt(s,200,270,'👤',54);txt(s,600,270,'🥷',54);
  this.pBar=progress(s,90,335,220,12,1,COLORS.green);this.eBar=progress(s,490,335,220,12,1,COLORS.red);
  this.status=txt(s,400,405,'دورك: اختر هجومك',17,COLORS.text);
  this.action=button(s,250,450,300,48,'هجوم',COLORS.red,function(){s.playerAttack();});
  button(s,250,510,300,34,'العودة للمهمات',COLORS.panel2,function(){s.scene.start('MissionsScene');});
 }
 updateBars(){this.pBar.destroy();this.eBar.destroy();this.pBar=progress(this,90,335,220,12,this.playerHP/100,COLORS.green);this.eBar=progress(this,490,335,220,12,this.enemyHP/100,COLORS.red);}
 playerAttack(){if(this.done||this.turn!=='player')return;this.turn='enemy';var damage=Math.max(6,Math.round(window.gameState.stats.strength/2+Math.random()*window.gameState.stats.accuracy/3));this.enemyHP=Math.max(0,this.enemyHP-damage);this.updateBars();if(this.enemyHP<=0){this.finish(true);return;}this.status.setText('أصبت الخصم. دوره الآن...');this.action.setEnabled(false);this.time.delayedCall(700,function(){this.enemyAttack();},[],this);}
 enemyAttack(){if(this.done)return;var gs=window.gameState,damage=Math.max(5,Math.round(4+Math.random()*Math.max(8,m.power/12)-gs.stats.defense/8));damage=Math.max(3,damage);this.playerHP=Math.max(0,this.playerHP-damage);this.updateBars();if(this.playerHP<=0){this.finish(false);return;}this.turn='player';this.status.setText('دورك: اختر هجومك');this.action.setEnabled(true);}
 finish(win){this.done=true;var r=window.gameState.resolveMissionBattle(window.pendingMission,win);if(win){this.status.setText('انتصار! +'+window.pendingMission.reward+' 💵 و +'+window.pendingMission.xp+' XP');}else{this.status.setText('هزيمة — خسرت المعركة فقط، والطاقة خُصمت عند البدء.');}this.action.setEnabled(false);this.time.delayedCall(1400,function(){this.scene.start('MissionsScene');},[],this);}
}