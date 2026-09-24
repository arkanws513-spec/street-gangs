import * as Phaser from "https://cdn.jsdelivr.net/npm/phaser@4.2.1/dist/phaser.esm.js";
import {WORLD,LOCATIONS} from "../config/world.js";import {PlayerSystem} from "../systems/PlayerSystem.js";import {Player} from "../entities/Player.js";import {Building} from "../entities/Building.js";import {createHud} from "../ui/Hud.js";
export class CityScene extends Phaser.Scene{
 constructor(){super("CityScene")}
 create(){
  this.cameras.main.setBackgroundColor("#070a0e");this.ps=new PlayerSystem(this);this.drawCity();
  this.player=new Player(this,WORLD.width*.32,WORLD.height*.48);this.cameras.main.setBounds(0,0,WORLD.width,WORLD.height);
  this.cameras.main.startFollow(this.player,true,.08,.08);this.keys=this.input.keyboard.addKeys("W,A,S,D");this.cursors=this.input.keyboard.createCursorKeys();
  LOCATIONS.forEach(d=>new Building(this,d,loc=>this.openLocation(loc)));
  this.setupCameraDrag();this.createMiniMap();this.createTouchPad();this.refreshHud=createHud(this,this.ps);this.refreshHud();
  this.time.addEvent({delay:500,loop:true,callback:this.refreshHud});
 }
 drawCity(){
  const g=this.add.graphics();g.fillGradientStyle(0x0b1118,0x0b1118,0x141b23,0x141b23,1);g.fillRect(0,0,WORLD.width,WORLD.height);
  for(let x=0;x<WORLD.width;x+=360){g.fillStyle(0x202832);g.fillRect(x,0,88,WORLD.height);g.lineStyle(1,0x4a5560,.22);for(let y=0;y<WORLD.height;y+=42)g.lineBetween(x+44,y,x+44,y+18)}
  for(let y=0;y<WORLD.height;y+=360){g.fillStyle(0x202832);g.fillRect(0,y,WORLD.width,88);g.lineStyle(1,0x4a5560,.22);for(let x=0;x<WORLD.width;x+=42)g.lineBetween(x,y+44,x+18,y+44)}
  for(let x=30;x<WORLD.width;x+=360)for(let y=30;y<WORLD.height;y+=360){
   g.fillStyle(0x121922);g.fillRect(x,y,270,270);g.lineStyle(1,0x33404c,.7);g.strokeRect(x+8,y+8,254,254);
   for(let i=0;i<5;i++){g.fillStyle(0x1c2731);g.fillRect(x+24+i*44,y+28,26,7)}
  }
  for(let i=0;i<24;i++){const x=150+(i%8)*410,y=145+Math.floor(i/8)*650;g.fillStyle(0x36434f);g.fillCircle(x,y,9);g.fillStyle(0x8d9aa3);g.fillCircle(x,y,3)}
  const title=this.add.text(50,195,"SECTOR 01",{fontFamily:"system-ui",fontSize:"12px",fontStyle:"bold",color:"#73808c",letterSpacing:3}).setAlpha(.7);
  title.setDepth(1);
 }
 openLocation(loc){if(loc.id==="arena")this.scene.start("MissionScene");else if(loc.id==="training")this.scene.start("TrainingScene");else if(loc.id==="market")this.scene.start("EquipmentScene");else{this.cameras.main.flash(180,217,164,65);}}
 setupCameraDrag(){
  let active=false,moved=false,sx=0,sy=0,cx=0,cy=0;
  this.input.on("pointerdown",p=>{
   if(p.y>this.scale.height-150)return;
   active=true;moved=false;sx=p.x;sy=p.y;cx=this.cameras.main.scrollX;cy=this.cameras.main.scrollY;
   this.cameras.main.stopFollow();
  });
  this.input.on("pointermove",p=>{
   if(!active||!p.isDown)return;
   const dx=p.x-sx,dy=p.y-sy;if(Math.hypot(dx,dy)>8)moved=true;
   if(moved){
    const tx=Phaser.Math.Clamp(cx-dx,0,Math.max(0,WORLD.width-this.cameras.main.width));
    const ty=Phaser.Math.Clamp(cy-dy,0,Math.max(0,WORLD.height-this.cameras.main.height));
    this.cameras.main.scrollX=Phaser.Math.Linear(this.cameras.main.scrollX,tx,.28);
    this.cameras.main.scrollY=Phaser.Math.Linear(this.cameras.main.scrollY,ty,.28);
   }
  });
  this.input.on("pointerup",()=>{active=false;});
 }
 createMiniMap(){
  const w=170,h=116,x=this.scale.width-184,y=16;this.add.rectangle(x,y,w,h,0x080c11,.94).setOrigin(0).setScrollFactor(0).setDepth(90).setStrokeStyle(1,0x56616c);
  const map=this.add.graphics().setScrollFactor(0).setDepth(91);map.fillStyle(0x151d25);map.fillRect(x+8,y+8,w-16,h-16);
  LOCATIONS.forEach(l=>{const px=x+8+(l.x/WORLD.width)*(w-16),py=y+8+(l.y/WORLD.height)*(h-16);map.fillStyle(l.color);map.fillCircle(px,py,5)});
  this.minimapPlayer=this.add.circle(x+8+(this.player.x/WORLD.width)*(w-16),y+8+(this.player.y/WORLD.height)*(h-16),4,0xffffff).setScrollFactor(0).setDepth(92);
  this.events.on("update",()=>{if(this.minimapPlayer){this.minimapPlayer.x=x+8+(this.player.x/WORLD.width)*(w-16);this.minimapPlayer.y=y+8+(this.player.y/WORLD.height)*(h-16)}})
 }
 createTouchPad(){
  const base=this.add.circle(78,this.scale.height-82,52,0x11161b,.86).setScrollFactor(0).setDepth(100).setStrokeStyle(2,0x4c5660);
  const knob=this.add.circle(78,this.scale.height-82,22,0xd9a441,.9).setScrollFactor(0).setDepth(101);
  let active=false;this.input.on("pointerdown",p=>{if(Phaser.Math.Distance.Between(p.x,p.y,base.x,base.y)<75){active=true}});
  this.input.on("pointermove",p=>{if(!active)return;const a=Phaser.Math.Angle.Between(base.x,base.y,p.x,p.y),d=Math.min(30,Phaser.Math.Distance.Between(base.x,base.y,p.x,p.y));knob.x=base.x+Math.cos(a)*d;knob.y=base.y+Math.sin(a)*d;this.joy={x:Math.cos(a)*(d/30),y:Math.sin(a)*(d/30)}});
  this.input.on("pointerup",()=>{active=false;this.joy={x:0,y:0};knob.x=base.x;knob.y=base.y});this.joy={x:0,y:0};
 }
 update(_t,dt){
  const x=(this.keys.D.isDown||this.cursors.right.isDown?1:0)-(this.keys.A.isDown||this.cursors.left.isDown?1:0)+(this.joy?.x||0);
  const y=(this.keys.S.isDown||this.cursors.down.isDown?1:0)-(this.keys.W.isDown||this.cursors.up.isDown?1:0)+(this.joy?.y||0);
  if(x||y){
   const v=new Phaser.Math.Vector2(x,y).normalize().scale(280*dt/1000);
   this.player.x=Phaser.Math.Clamp(this.player.x+v.x,WORLD.padding,WORLD.width-WORLD.padding);
   this.player.y=Phaser.Math.Clamp(this.player.y+v.y,WORLD.padding,WORLD.height-WORLD.padding);
   if(!this.draggingCamera)this.cameras.main.startFollow(this.player,true,.08,.08);
  }
 }
}