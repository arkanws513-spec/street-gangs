import {PlayerSystem} from "../systems/PlayerSystem.js";
export class BattleScene extends Phaser.Scene{
 constructor(){super("BattleScene")}
 create(data){
  this.ps=new PlayerSystem(this); this.m=data.mission; this.over=false;
  if(!this.ps.spendEnergy()){this.scene.start("MissionScene");return}
  this.playerHp=100+this.ps.state.stats.defense*3; this.enemyHp=100+this.m.enemyPower*2;
  this.cameras.main.setBackgroundColor("#0b0e12");
  this.add.text(this.scale.width/2,32,"مواجهة — المستوى "+this.m.level,{fontFamily:"system-ui",fontSize:"28px",fontStyle:"bold",color:"#d9a441"}).setOrigin(.5);
  this.add.text(this.scale.width/2,70,"⚡ طاقة متبقية: "+this.ps.state.energy+"/"+this.ps.state.maxEnergy,{fontFamily:"system-ui",fontSize:"13px",color:"#9298a1"}).setOrigin(.5);
  this.playerF=this.fighter(this.scale.width*.27,165,"مقاتلك",0xd9a441,false);
  this.enemyF=this.fighter(this.scale.width*.73,165,"الخصم",0xc96b61,true);
  this.info=this.add.text(this.scale.width/2,315,"دورك الآن",{fontFamily:"system-ui",fontSize:"20px",fontStyle:"bold",color:"#ece8e1"}).setOrigin(.5);
  this.log=this.add.text(this.scale.width/2,365,"المواجهة بدأت.",{fontFamily:"system-ui",fontSize:"14px",color:"#9298a1"}).setOrigin(.5);
  const b=this.add.rectangle(this.scale.width/2,455,190,58,0xd9a441).setInteractive({useHandCursor:true});
  this.add.text(b.x,b.y,"هجوم",{fontFamily:"system-ui",fontSize:"18px",fontStyle:"bold",color:"#17120a"}).setOrigin(.5);
  b.on("pointerup",()=>this.attack());
  const r=this.add.text(this.scale.width/2,535,"انسحاب",{fontFamily:"system-ui",fontSize:"14px",color:"#9298a1"}).setOrigin(.5).setInteractive();
  r.on("pointerup",()=>this.scene.start("MissionScene"));
 }
 fighter(x,y,name,color,enemy){
  const c=this.add.container(x,y); c.add(this.add.circle(0,0,55,color,.2)); c.add(this.add.circle(0,0,38,color));
  c.add(this.add.text(0,72,name,{fontFamily:"system-ui",fontSize:"16px",fontStyle:"bold",color:"#ece8e1"}).setOrigin(.5));
  const hp=enemy?this.enemyHp:this.playerHp, max=hp;
  const bar=this.add.rectangle(0,94,130,8,0x343b44).setOrigin(.5); const fill=this.add.rectangle(-65,94,130,8,0x4fa8a0).setOrigin(0,.5);
  c.add([bar,fill]);
  if(!enemy&&(this.ps.state.gear.vest||this.ps.state.gear.weapon)){
   c.add(this.add.text(0,-72,(this.ps.state.gear.vest?"🛡️":"")+" "+(this.ps.state.gear.weapon?"🔧":"").trim(),{fontFamily:"system-ui",fontSize:"22px"}).setOrigin(.5));
  }
  c.setData("fill",fill); c.setData("max",max); return c;
 }
 updateBar(c,hp){const max=c.getData("max");const fill=c.getData("fill");fill.width=Math.max(0,130*hp/max)}
 attack(){
  if(this.over)return;
  const dmg=Math.max(5,Math.round(this.ps.state.stats.strength*(.8+Math.random()*.35)-this.m.enemyPower*.04));
  this.enemyHp=Math.max(0,this.enemyHp-dmg); this.updateBar(this.enemyF,this.enemyHp);
  this.tweens.add({targets:this.playerF,x:this.scale.width*.30,duration:90,yoyo:true});
  this.log.setText("هجومك: "+dmg+" ضرر");
  if(this.enemyHp<=0)return this.end(true);
  this.info.setText("دور الخصم"); this.time.delayedCall(600,()=>this.enemyTurn());
 }
 enemyTurn(){
  if(this.over)return;
  const dmg=Math.max(4,Math.round(this.m.enemyPower*(.18+Math.random()*.12)-this.ps.state.stats.defense*.04));
  this.playerHp=Math.max(0,this.playerHp-dmg); this.updateBar(this.playerF,this.playerHp);
  this.tweens.add({targets:this.enemyF,x:this.scale.width*.70,duration:90,yoyo:true});
  this.log.setText("هجوم الخصم: "+dmg+" ضرر");
  if(this.playerHp<=0)return this.end(false);
  this.info.setText("دورك الآن");
 }
 end(win){
  this.over=true;
  if(win){this.ps.state.completed=Math.min(50,this.ps.state.completed+1);this.ps.gain(this.m.xp,this.m.reward);this.info.setText("انتصار!");this.log.setText("+"+this.m.reward+" 💵   +"+this.m.xp+" XP")}
  else{this.info.setText("انتهت المواجهة");this.log.setText("تم خصم الطاقة عند بدء المهمة؛ لا توجد خسارة مالية.")}
  const b=this.add.text(this.scale.width/2,620,"متابعة",{fontFamily:"system-ui",fontSize:"16px",color:"#d9a441"}).setOrigin(.5).setInteractive();
  b.on("pointerup",()=>this.scene.start("MissionScene"));
 }
}