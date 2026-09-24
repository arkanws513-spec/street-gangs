import * as Phaser from "https://cdn.jsdelivr.net/npm/phaser@4.2.1/dist/phaser.esm.js";
import {PlayerSystem} from "../systems/PlayerSystem.js";
export class BattleScene extends Phaser.Scene{
 constructor(){super("BattleScene")}
 create(data){
  this.ps=new PlayerSystem(this);this.m=data.mission;this.over=false;
  this.playerHp=100+this.ps.state.stats.defense*3;this.enemyHp=100+this.m.enemyPower*2;
  this.cameras.main.setBackgroundColor("#06090d");
  const bg=this.add.graphics();bg.fillGradientStyle(0x111923,0x111923,0x090d13,0x090d13,1);bg.fillRect(0,0,this.scale.width,this.scale.height);
  bg.lineStyle(1,0x34404b,.35);for(let x=0;x<this.scale.width;x+=80)bg.lineBetween(x,110,x,600);
  this.add.text(this.scale.width/2,30,"ساحة المواجهة",{fontFamily:"system-ui",fontSize:"28px",fontStyle:"bold",color:"#d9a441"}).setOrigin(.5);
  this.add.text(this.scale.width/2,68,"المستوى "+this.m.level+" • "+this.m.difficulty,{fontFamily:"system-ui",fontSize:"13px",color:"#aab1b9"}).setOrigin(.5);
  this.playerF=this.fighter(this.scale.width*.27,160,"مقاتلك",0xd9a441,false);
  this.enemyF=this.fighter(this.scale.width*.73,160,"الخصم",0xc96b61,true);
  this.info=this.add.text(this.scale.width/2,320,"دورك الآن",{fontFamily:"system-ui",fontSize:"20px",fontStyle:"bold",color:"#ece8e1"}).setOrigin(.5);
  this.log=this.add.text(this.scale.width/2,360,"الهجوم بالتبادل — الفوز يمنحك المال وXP.",{fontFamily:"system-ui",fontSize:"13px",color:"#9298a1"}).setOrigin(.5);
  const b=this.add.rectangle(this.scale.width/2,445,190,58,0xd9a441).setInteractive({useHandCursor:true});
  this.add.text(b.x,b.y,"هجوم",{fontFamily:"system-ui",fontSize:"18px",fontStyle:"bold",color:"#17120a"}).setOrigin(.5);
  b.on("pointerup",()=>this.attack());
  this.add.text(this.scale.width/2,525,"انسحاب",{fontFamily:"system-ui",fontSize:"14px",color:"#9298a1"}).setOrigin(.5).setInteractive().on("pointerup",()=>this.scene.start("MissionScene"));
 }
 fighter(x,y,name,color,enemy){
  const c=this.add.container(x,y);
  const shadow=this.add.ellipse(0,62,120,24,0x000000,.42);
  const aura=this.add.circle(0,0,64,color,.10);
  const body=this.add.polygon(0,18,[[-30,-30],[30,-30],[42,28],[18,54],[-18,54],[-42,28]],color,.9).setStrokeStyle(2,0xffffff,.16);
  const head=this.add.circle(0,-48,20,0xc99570);
  const hair=this.add.arc(0,-53,20,190,350,false,0x17191c);
  const armL=this.add.rectangle(-43,7,12,50,color);
  const armR=this.add.rectangle(43,7,12,50,color);
  const legL=this.add.rectangle(-15,65,13,34,0x111820);
  const legR=this.add.rectangle(15,65,13,34,0x111820);
  c.add([shadow,aura,body,head,hair,armL,armR,legL,legR]);
  c.add(this.add.text(0,112,name,{fontFamily:"system-ui",fontSize:"16px",fontStyle:"bold",color:"#ece8e1"}).setOrigin(.5));
  const max=enemy?this.enemyHp:this.playerHp;
  const bar=this.add.rectangle(0,137,160,10,0x343b44);
  const fill=this.add.rectangle(-80,137,160,10,0x4fa8a0).setOrigin(0,.5);
  c.add([bar,fill]);
  if(!enemy&&(this.ps.state.gear.vest||this.ps.state.gear.weapon)){
   const eq=(this.ps.state.gear.vest?"🛡️ ":"")+(this.ps.state.gear.weapon?"🔧":"");
   c.add(this.add.text(0,-88,eq,{fontFamily:"system-ui",fontSize:"22px"}).setOrigin(.5));
  }
  c.setData({fill,max});return c;
 }
 updateBar(c,hp){c.getData("fill").width=Math.max(0,160*hp/c.getData("max"))}
 attack(){
  if(this.over)return;
  const crit=Math.random()<this.ps.state.stats.accuracy/100;
  const dmg=Math.max(5,Math.round(this.ps.state.stats.strength*(.8+Math.random()*.35)*(crit?1.5:1)-this.m.enemyPower*.04));
  this.enemyHp=Math.max(0,this.enemyHp-dmg);this.updateBar(this.enemyF,this.enemyHp);
  this.log.setText((crit?"ضربة دقيقة! ":"")+"هجومك: "+dmg+" ضرر");
  this.tweens.add({targets:this.playerF,x:this.scale.width*.31,duration:90,yoyo:true});
  if(this.enemyHp<=0)return this.end(true);
  this.info.setText("دور الخصم");this.time.delayedCall(600,()=>this.enemyTurn());
 }
 enemyTurn(){
  if(this.over)return;
  const dmg=Math.max(4,Math.round(this.m.enemyPower*(.18+Math.random()*.12)-this.ps.state.stats.defense*.04));
  this.playerHp=Math.max(0,this.playerHp-dmg);this.updateBar(this.playerF,this.playerHp);
  this.log.setText("هجوم الخصم: "+dmg+" ضرر");
  this.tweens.add({targets:this.enemyF,x:this.scale.width*.69,duration:90,yoyo:true});
  if(this.playerHp<=0)return this.end(false);
  this.info.setText("دورك الآن");
 }
 end(win){
  this.over=true;
  if(win){this.ps.state.completed=Math.min(50,this.ps.state.completed+1);this.ps.gain(this.m.xp,this.m.reward);this.info.setText("انتصار!");this.log.setText("+"+this.m.reward+" 💵   +"+this.m.xp+" XP");}
  else{this.ps.state.energy=Math.max(0,this.ps.state.energy-1);this.ps.save();this.info.setText("انتهت المواجهة");this.log.setText("تم خصم نقطة طاقة فقط.");}
  const b=this.add.text(this.scale.width/2,620,"متابعة",{fontFamily:"system-ui",fontSize:"16px",color:"#d9a441"}).setOrigin(.5).setInteractive();
  b.on("pointerup",()=>this.scene.start("MissionScene"));
 }
}