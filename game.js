import * as Phaser from "https://cdn.jsdelivr.net/npm/phaser@4.2.1/dist/phaser.esm.js";

const SAVE_KEY="street-gangs-ar-v1";
const WORLD={w:3600,h:2400,pad:80};
const COLORS={gold:0xd9a441,ink:0x080b0f,panel:0x111820,road:0x242d35,road2:0x303a43,wall:0x1a222b,text:"#f2eee6",muted:"#9ba5ae",red:0xc95f5f,teal:0x4fa8a0};
const LOCATIONS=[
 {id:"base",name:"المقر",x:560,y:500,color:COLORS.gold,desc:"مقر العصابة وإدارة النفوذ"},
 {id:"market",name:"السوق الشعبي",x:1320,y:480,color:COLORS.teal,desc:"شراء المعدات والعتاد"},
 {id:"training",name:"النادي",x:560,y:1320,color:0x9b78d0,desc:"تطوير مهارات المقاتل"},
 {id:"arena",name:"ساحة المواجهات",x:1320,y:1320,color:COLORS.red,desc:"المهمات والقتالات"},
 {id:"harbor",name:"الميناء",x:2180,y:520,color:0x5e91c9,desc:"منطقة شحن ونفوذ جديدة"},
 {id:"cafe",name:"المقهى",x:2180,y:1320,color:0xc07b48,desc:"معلومات وأحداث المدينة"},
 {id:"industrial",name:"المنطقة الصناعية",x:3000,y:900,color:0x7b8791,desc:"مهمات متقدمة"},
 {id:"palace",name:"الحي الراقي",x:2920,y:1650,color:0x8c78a8,desc:"منطقة نفوذ عالية الخطورة"}
];
const MISSIONS=Array.from({length:50},(_,i)=>{
 const level=i+1;
 return {level,type:["مطاردة","حماية","اقتحام","استرداد"][i%4],
 difficulty:level<6?"سهل":level<16?"متوسط":level<31?"صعب":"نخبة",
 enemyPower:10+level*7,reward:900+level*420,xp:14+level*5};
});
const DEFAULT={
 level:1,xp:0,cash:2500,energy:10,maxEnergy:10,stamina:10,completed:0,
 stats:{strength:7,defense:8,speed:6,accuracy:8},gear:{vest:false,weapon:false}
};
function state(){
 try{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||"null");return {...DEFAULT,...s,stats:{...DEFAULT.stats,...(s?.stats||{})},gear:{...DEFAULT.gear,...(s?.gear||{})}}}
 catch{return structuredClone(DEFAULT)}
}
function save(s){localStorage.setItem(SAVE_KEY,JSON.stringify(s))}
function xpNeed(s){return 20+s.level*15}
function gain(s,xp,money){
 s.xp+=xp;s.cash+=money;
 while(s.xp>=xpNeed(s)&&s.level<50){s.xp-=xpNeed(s);s.level++;s.stamina+=10;s.maxEnergy=Math.min(30,s.maxEnergy+1);s.energy=s.maxEnergy}
 save(s)
}

class Boot extends Phaser.Scene{constructor(){super("Boot")}create(){this.scene.start("Menu")}}
class Menu extends Phaser.Scene{
 constructor(){super("Menu")}
 create(){
  const w=this.scale.width,h=this.scale.height;
  this.cameras.main.setBackgroundColor("#080b0f");
  const g=this.add.graphics();
  for(let i=0;i<24;i++){g.fillStyle(i%3===0?0x151d25:0x0d1319,.55);g.fillCircle((i*173)%w,(i*97)%h,90+(i%4)*35)}
  this.add.text(w/2,h*.26,"عصابات الشوارع",{fontFamily:"system-ui",fontSize:Math.min(58,w/9)+"px",fontStyle:"bold",color:"#d9a441"}).setOrigin(.5);
  this.add.text(w/2,h*.36,"مدينة عربية • نفوذ • مهمات • مواجهات",{fontSize:"18px",color:COLORS.text}).setOrigin(.5);
  const b=this.button(w/2,h*.56,260,64,"دخول المدينة");
  b.on("pointerup",()=>this.scene.start("City"));
  this.add.text(w/2,h*.72,"تقدمك يُحفظ تلقائيًا على هذا الجهاز",{fontSize:"12px",color:COLORS.muted}).setOrigin(.5);
 }
 button(x,y,w,h,label){
  const b=this.add.rectangle(x,y,w,h,COLORS.gold).setInteractive({useHandCursor:true});
  this.add.text(x,y,label,{fontSize:"20px",fontStyle:"bold",color:"#17120a"}).setOrigin(.5);return b;
 }
}

class City extends Phaser.Scene{
 constructor(){super("City")}
 create(){
  this.s=state();this.cameras.main.setBackgroundColor("#0a0e13");this.drawWorld();
  this.player=this.makePlayer(WORLD.w*.30,WORLD.h*.48);
  this.cameras.main.setBounds(0,0,WORLD.w,WORLD.h);
  this.cameras.main.startFollow(this.player,true,.12,.12);
  this.makeLocations();this.makeHud();this.makeMiniMap();this.makeJoystick();this.bindCamera();
  this.keys=this.input.keyboard.createCursorKeys();this.wasd=this.input.keyboard.addKeys("W,A,S,D");
 }
 drawWorld(){
  const g=this.add.graphics();g.fillStyle(0x111820);g.fillRect(0,0,WORLD.w,WORLD.h);
  for(let x=0;x<WORLD.w;x+=420){g.fillStyle(COLORS.road);g.fillRect(x,0,100,WORLD.h);g.fillStyle(COLORS.road2);g.fillRect(x+44,0,12,WORLD.h)}
  for(let y=0;y<WORLD.h;y+=420){g.fillStyle(COLORS.road);g.fillRect(0,y,WORLD.w,100);g.fillStyle(COLORS.road2);g.fillRect(0,y+44,WORLD.w,12)}
  for(let bx=0;bx<WORLD.w;bx+=420)for(let by=0;by<WORLD.h;by+=420){
   g.fillStyle(0x18212a);g.fillRoundedRect(bx+18,by+18,360,360,18);
   g.lineStyle(1,0x35414b,.75);g.strokeRoundedRect(bx+18,by+18,360,360,18);
   for(let k=0;k<12;k++){const xx=bx+48+(k%4)*82,yy=by+58+Math.floor(k/4)*92;g.fillStyle(k%3?0x26323c:0x202a33);g.fillRoundedRect(xx,yy,56,62,8)}
  }
  this.add.text(80,120,"المدينة القديمة",{fontSize:"16px",fontStyle:"bold",color:"#65717b"}).setAlpha(.65);
 }
 makePlayer(x,y){
  const c=this.add.container(x,y);
  c.add(this.add.ellipse(0,38,66,20,0x000000,.38));
  c.add(this.add.circle(0,0,42,COLORS.gold,.10));
  c.add(this.add.polygon(0,15,[[-25,-24],[25,-24],[34,23],[18,42],[-18,42],[-34,23]],0x27333e).setStrokeStyle(2,COLORS.gold));
  c.add(this.add.circle(0,-40,17,0xc99570));
  c.add(this.add.arc(0,-45,17,190,350,false,0x17191c));
  c.add(this.add.rectangle(0,17,39,7,0x0d1217));
  c.add(this.add.circle(0,2,6,COLORS.gold));
  c.add(this.add.rectangle(-11,49,10,28,0x10161c));c.add(this.add.rectangle(11,49,10,28,0x10161c));
  c.setDepth(50);return c;
 }
 building(d){
  const c=this.add.container(d.x,d.y).setSize(230,190).setInteractive({useHandCursor:true});
  c.setData("location",true);
  c.add(this.add.ellipse(8,72,235,32,0x000000,.38));
  c.add(this.add.rectangle(0,20,200,120,0x202a33).setStrokeStyle(2,0x56626c));
  c.add(this.add.rectangle(86,8,28,106,0x0d1319));
  c.add(this.add.polygon(-8,-58,[[-102,0],[78,0],[100,16],[-80,16]],d.color));
  c.add(this.add.rectangle(-8,-7,112,29,0x090d12,.92).setStrokeStyle(1,d.color));
  c.add(this.add.circle(-8,-7,12,d.color));
  for(let r=0;r<2;r++)for(let k=0;k<4;k++)c.add(this.add.rectangle(-68+k*35,-8+r*31,18,13,0x9dbfc7,.72));
  c.add(this.add.rectangle(47,34,25,47,0x090d11));
  c.add(this.add.text(-8,72,d.name,{fontSize:"16px",fontStyle:"bold",color:COLORS.text,stroke:"#080b0f",strokeThickness:4}).setOrigin(.5));
  c.add(this.add.text(-8,94,"اضغط للدخول",{fontSize:"10px",color:COLORS.muted}).setOrigin(.5));
  c.on("pointerover",()=>c.setScale(1.035));c.on("pointerout",()=>c.setScale(1));c.on("pointerup",()=>this.open(d));
  c.setDepth(20);return c;
 }
 makeLocations(){LOCATIONS.forEach(d=>this.building(d))}
 open(d){
  if(d.id==="arena")this.scene.start("Missions");
  else if(d.id==="training")this.scene.start("Training");
  else if(d.id==="market")this.scene.start("Market");
  else {this.cameras.main.flash(160,d.color>>16,(d.color>>8)&255,d.color&255)}
 }
 makeHud(){
  const c=this.add.container(16,16).setScrollFactor(0).setDepth(100);
  c.add(this.add.rectangle(0,0,365,112,0x080c11,.94).setOrigin(0).setStrokeStyle(1,0x47515b));
  c.add(this.add.text(14,10,"عصابات الشوارع",{fontSize:"20px",fontStyle:"bold",color:"#d9a441"}));
  this.hud=c.add(this.add.text(14,43,"",{fontSize:"13px",color:COLORS.text}));
  c.add(this.add.rectangle(14,78,335,8,0x28313a).setOrigin(0));this.xpf=c.add(this.add.rectangle(14,78,1,8,COLORS.gold).setOrigin(0));
  c.add(this.add.text(14,92,"اسحب الشاشة لتحريك الكاميرا • عصا الحركة للتنقل",{fontSize:"10px",color:COLORS.muted}));
  this.events.on("update",()=>this.updateHud());
  this.updateHud();
 }
 updateHud(){
  const s=this.s;this.hud.setText("المستوى "+s.level+"   💵 "+s.cash.toLocaleString()+"   ⚡ "+s.energy+"/"+s.maxEnergy+"   •   تحمل "+s.stamina);
  this.xpf.width=Math.max(2,335*s.xp/xpNeed(s));
 }
 makeMiniMap(){
  const w=180,h=120,x=this.scale.width-w-18,y=18;
  this.add.rectangle(x,y,w,h,0x070a0e,.94).setOrigin(0).setScrollFactor(0).setDepth(101).setStrokeStyle(1,0x4b5660);
  const g=this.add.graphics().setScrollFactor(0).setDepth(102);g.fillStyle(0x18212a);g.fillRect(x+8,y+8,w-16,h-16);
  LOCATIONS.forEach(d=>{g.fillStyle(d.color);g.fillCircle(x+8+d.x/WORLD.w*(w-16),y+8+d.y/WORLD.h*(h-16),5)});
  this.dot=this.add.circle(x+8,y+8,4,0xffffff).setScrollFactor(0).setDepth(103);
  this.events.on("update",()=>{this.dot.x=x+8+this.player.x/WORLD.w*(w-16);this.dot.y=y+8+this.player.y/WORLD.h*(h-16)});
 }
 makeJoystick(){
  const base=this.add.circle(78,this.scale.height-80,54,0x0c1116,.9).setScrollFactor(0).setDepth(110).setStrokeStyle(2,0x515c66);
  const knob=this.add.circle(78,this.scale.height-80,23,COLORS.gold,.92).setScrollFactor(0).setDepth(111);
  this.joy={x:0,y:0};
  let active=false;
  this.input.on("pointerdown",p=>{if(Phaser.Math.Distance.Between(p.x,p.y,base.x,base.y)<70)active=true});
  this.input.on("pointermove",p=>{if(!active)return;const a=Phaser.Math.Angle.Between(base.x,base.y,p.x,p.y),d=Math.min(32,Phaser.Math.Distance.Between(base.x,base.y,p.x,p.y));knob.x=base.x+Math.cos(a)*d;knob.y=base.y+Math.sin(a)*d;this.joy.x=Math.cos(a)*d/32;this.joy.y=Math.sin(a)*d/32});
  this.input.on("pointerup",()=>{active=false;this.joy.x=this.joy.y=0;knob.x=base.x;knob.y=base.y});
 }
 bindCamera(){
  let down=false,sx=0,sy=0,cx=0,cy=0,moved=false;
  this.input.on("pointerdown",p=>{if(p.y>this.scale.height-155)return;down=true;moved=false;sx=p.x;sy=p.y;cx=this.cameras.main.scrollX;cy=this.cameras.main.scrollY;this.cameras.main.stopFollow()});
  this.input.on("pointermove",p=>{
   if(!down||!p.isDown)return;const dx=p.x-sx,dy=p.y-sy;if(Math.hypot(dx,dy)>7)moved=true;if(!moved)return;
   const maxX=Math.max(0,WORLD.w-this.cameras.main.width),maxY=Math.max(0,WORLD.h-this.cameras.main.height);
   const tx=Phaser.Math.Clamp(cx-dx,0,maxX),ty=Phaser.Math.Clamp(cy-dy,0,maxY);
   this.cameras.main.scrollX=Phaser.Math.Linear(this.cameras.main.scrollX,tx,.32);
   this.cameras.main.scrollY=Phaser.Math.Linear(this.cameras.main.scrollY,ty,.32);
  });
  this.input.on("pointerup",()=>{down=false});
 }
 update(_t,dt){
  const x=(this.wasd.D.isDown||this.keys.right.isDown?1:0)-(this.wasd.A.isDown||this.keys.left.isDown?1:0)+this.joy.x;
  const y=(this.wasd.S.isDown||this.keys.down.isDown?1:0)-(this.wasd.W.isDown||this.keys.up.isDown?1:0)+this.joy.y;
  if(x||y){const v=new Phaser.Math.Vector2(x,y).normalize().scale(260*dt/1000);this.player.x=Phaser.Math.Clamp(this.player.x+v.x,WORLD.pad,WORLD.w-WORLD.pad);this.player.y=Phaser.Math.Clamp(this.player.y+v.y,WORLD.pad,WORLD.h-WORLD.pad);this.cameras.main.startFollow(this.player,true,.10,.10)}
 }
}

class Missions extends Phaser.Scene{
 constructor(){super("Missions")}
 create(){
  this.s=state();this.cameras.main.setBackgroundColor("#080c11");
  this.add.text(28,24,"لوحة المهمات",{fontSize:"30px",fontStyle:"bold",color:"#d9a441"});
  this.add.text(28,66,"المهمة التالية • "+Math.min(50,this.s.completed+1)+" / 50",{fontSize:"15px",color:COLORS.text});
  this.add.rectangle(28,102,this.scale.width-56,10,0x252c34).setOrigin(0);
  this.add.rectangle(28,102,(this.scale.width-56)*this.s.completed/50,10,COLORS.gold).setOrigin(0);
  const m=MISSIONS[this.s.completed];
  if(m)this.card(m,170);else this.add.text(this.scale.width/2,200,"أنهيت سلسلة المهمات الحالية",{fontSize:"22px",color:"#d9a441"}).setOrigin(.5);
  this.back();
 }
 card(m,y){
  const w=Math.min(850,this.scale.width-48),x=this.scale.width/2;
  this.add.rectangle(x,y,w,128,0x151c24).setStrokeStyle(1,0x47515d);
  this.add.text(x-w/2+24,y-42,"المستوى "+m.level+"  •  "+m.type,{fontSize:"18px",fontStyle:"bold",color:COLORS.text});
  this.add.text(x-w/2+24,y-10,"الصعوبة: "+m.difficulty+"    •    المكافأة: "+m.reward.toLocaleString()+" 💵    •    "+m.xp+" XP",{fontSize:"13px",color:COLORS.muted});
  const b=this.add.rectangle(x+w/2-82,y+34,120,44,COLORS.gold).setInteractive({useHandCursor:true});
  this.add.text(b.x,b.y,"قبول المهمة",{fontSize:"14px",fontStyle:"bold",color:"#17120a"}).setOrigin(.5);
  b.on("pointerup",()=>this.scene.start("Battle",{mission:m}));
 }
 back(){const b=this.add.text(28,this.scale.height-28,"← العودة",{fontSize:"15px",color:"#d9a441"}).setInteractive();b.on("pointerup",()=>this.scene.start("City"))}
}

class Battle extends Phaser.Scene{
 constructor(){super("Battle")}
 create(data){
  this.s=state();this.m=data.mission;this.done=false;
  this.hp=100+this.s.stats.defense*3;this.ehp=100+this.m.enemyPower*2;
  this.cameras.main.setBackgroundColor("#070a0e");
  this.add.text(this.scale.width/2,30,"ساحة المواجهة",{fontSize:"30px",fontStyle:"bold",color:"#d9a441"}).setOrigin(.5);
  this.add.text(this.scale.width/2,70,"المستوى "+this.m.level+" • "+this.m.type+" • "+this.m.difficulty,{fontSize:"13px",color:COLORS.muted}).setOrigin(.5);
  this.me=this.fighter(this.scale.width*.26,180,"أنت",COLORS.gold,false);
  this.enemy=this.fighter(this.scale.width*.74,180,"الخصم",COLORS.red,true);
  this.info=this.add.text(this.scale.width/2,330,"دورك الآن",{fontSize:"21px",fontStyle:"bold",color:COLORS.text}).setOrigin(.5);
  this.log=this.add.text(this.scale.width/2,368,"هجوم بالتبادل — الفوز يمنح المال وXP.",{fontSize:"13px",color:COLORS.muted}).setOrigin(.5);
  const b=this.add.rectangle(this.scale.width/2,455,210,62,COLORS.gold).setInteractive({useHandCursor:true});
  this.add.text(b.x,b.y,"هجوم",{fontSize:"20px",fontStyle:"bold",color:"#17120a"}).setOrigin(.5);b.on("pointerup",()=>this.attack());
 }
 fighter(x,y,name,color,enemy){
  const c=this.add.container(x,y);c.add(this.add.ellipse(0,75,140,25,0x000000,.42));
  c.add(this.add.circle(0,0,65,color,.10));c.add(this.add.polygon(0,20,[[-35,-30],[35,-30],[46,35],[20,60],[-20,60],[-46,35]],color,.92));
  c.add(this.add.circle(0,-52,21,0xc99570));c.add(this.add.arc(0,-58,21,190,350,false,0x17191c));
  c.add(this.add.rectangle(-50,8,14,55,color));c.add(this.add.rectangle(50,8,14,55,color));
  c.add(this.add.rectangle(-16,72,14,38,0x111820));c.add(this.add.rectangle(16,72,14,38,0x111820));
  c.add(this.add.text(0,125,name,{fontSize:"17px",fontStyle:"bold",color:COLORS.text}).setOrigin(.5));
  c.add(this.add.rectangle(0,151,180,10,0x343b44));const fill=this.add.rectangle(-90,151,180,10,enemy?COLORS.red:COLORS.teal).setOrigin(0,.5);c.setData("fill",fill);
  if(!enemy&&(this.s.gear.vest||this.s.gear.weapon))c.add(this.add.text(0,-92,(this.s.gear.vest?"🛡️ ":"")+(this.s.gear.weapon?"⚔️":""),{fontSize:"22px"}).setOrigin(.5));
  return c;
 }
 bar(c,hp,max){c.getData("fill").width=Math.max(0,180*hp/max)}
 attack(){
  if(this.done)return;
  const crit=Math.random()<this.s.stats.accuracy/100;
  const dmg=Math.max(5,Math.round(this.s.stats.strength*(.85+Math.random()*.3)*(crit?1.5:1)));
  this.ehp=Math.max(0,this.ehp-dmg);this.bar(this.enemy,this.ehp,100+this.m.enemyPower*2);
  this.log.setText((crit?"ضربة دقيقة! ":"")+"ضررك: "+dmg);this.tweens.add({targets:this.me,x:this.scale.width*.30,duration:90,yoyo:true});
  if(this.ehp<=0)return this.end(true);this.info.setText("دور الخصم");this.time.delayedCall(550,()=>this.enemyTurn());
 }
 enemyTurn(){
  if(this.done)return;
  const dmg=Math.max(4,Math.round(this.m.enemyPower*(.16+Math.random()*.10)-this.s.stats.defense*.05));
  this.hp=Math.max(0,this.hp-dmg);this.bar(this.me,this.hp,100+this.s.stats.defense*3);this.log.setText("هجوم الخصم: "+dmg+" ضرر");
  this.tweens.add({targets:this.enemy,x:this.scale.width*.70,duration:90,yoyo:true});
  if(this.hp<=0)return this.end(false);this.info.setText("دورك الآن");
 }
 end(win){
  this.done=true;
  if(win){this.s.completed=Math.min(50,this.s.completed+1);gain(this.s,this.m.xp,this.m.reward);this.info.setText("انتصار!");this.log.setText("حصلت على "+this.m.reward.toLocaleString()+" 💵 و "+this.m.xp+" XP")}
  else{this.s.energy=Math.max(0,this.s.energy-1);save(this.s);this.info.setText("خسارة");this.log.setText("تم خصم نقطة طاقة فقط.")}
  const b=this.add.text(this.scale.width/2,600,"متابعة",{fontSize:"17px",color:"#d9a441"}).setOrigin(.5).setInteractive();b.on("pointerup",()=>this.scene.start("Missions"));
 }
}

class Training extends Phaser.Scene{
 constructor(){super("Training")}
 create(){
  this.s=state();this.cameras.main.setBackgroundColor("#0b0f14");
  this.add.text(30,30,"مركز التدريب",{fontSize:"30px",fontStyle:"bold",color:"#d9a441"});
  this.points=this.add.text(30,75,"نقاط التحمل: "+this.s.stamina,{fontSize:"15px",color:COLORS.text});
  [["strength","القوة"],["defense","الدفاع"],["speed","السرعة"],["accuracy","الدقة"]].forEach((a,i)=>this.row(a[0],a[1],145+i*95));
  this.back();
 }
 row(key,label,y){
  this.add.text(40,y,label+"  •  "+this.s.stats[key],{fontSize:"18px",color:COLORS.text});
  const b=this.add.rectangle(this.scale.width-95,y,92,44,COLORS.gold).setInteractive();
  this.add.text(b.x,b.y,"+1",{fontSize:"17px",fontStyle:"bold",color:"#17120a"}).setOrigin(.5);
  b.on("pointerup",()=>{if(this.s.stamina>0){this.s.stamina--;this.s.stats[key]++;save(this.s);this.scene.restart()}});
 }
 back(){const b=this.add.text(28,this.scale.height-28,"← العودة",{fontSize:"15px",color:"#d9a441"}).setInteractive();b.on("pointerup",()=>this.scene.start("City"))}
}

class Market extends Phaser.Scene{
 constructor(){super("Market")}
 create(){
  this.s=state();this.cameras.main.setBackgroundColor("#0b0f14");
  this.add.text(30,30,"السوق الشعبي",{fontSize:"30px",fontStyle:"bold",color:"#d9a441"});
  this.money=this.add.text(30,75,"الرصيد: "+this.s.cash.toLocaleString()+" 💵",{fontSize:"15px",color:COLORS.text});
  this.item("vest","سترة واقية",1800,160);this.item("weapon","سلاح المواجهات",2400,260);this.back();
 }
 item(key,name,price,y){
  this.add.rectangle(this.scale.width/2,y,Math.min(760,this.scale.width-50),78,0x151c24).setStrokeStyle(1,0x414b55);
  this.add.text(40,y,name+"  •  "+price.toLocaleString()+" 💵",{fontSize:"17px",color:COLORS.text}).setOrigin(0,.5);
  const b=this.add.rectangle(this.scale.width-85,y,105,42,this.s.gear[key]?0x35413d:COLORS.gold).setInteractive();
  this.add.text(b.x,b.y,this.s.gear[key]?"مملوك":"شراء",{fontSize:"13px",fontStyle:"bold",color:this.s.gear[key]?COLORS.text:"#17120a"}).setOrigin(.5);
  b.on("pointerup",()=>{if(!this.s.gear[key]&&this.s.cash>=price){this.s.cash-=price;this.s.gear[key]=true;save(this.s);this.scene.restart()}});
 }
 back(){const b=this.add.text(28,this.scale.height-28,"← العودة",{fontSize:"15px",color:"#d9a441"}).setInteractive();b.on("pointerup",()=>this.scene.start("City"))}
}

new Phaser.Game({
 type:Phaser.AUTO,parent:"game",backgroundColor:"#080b0f",width:1280,height:720,
 scale:{mode:Phaser.Scale.RESIZE,autoCenter:Phaser.Scale.CENTER_BOTH},
 render:{antialias:true,pixelArt:false},
 scene:[Boot,Menu,City,Missions,Battle,Training,Market]
});