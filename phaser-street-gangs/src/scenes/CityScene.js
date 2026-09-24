import {WORLD,LOCATIONS} from "../config/world.js";import {PlayerSystem} from "../systems/PlayerSystem.js";import {Player} from "../entities/Player.js";import {Building} from "../entities/Building.js";import {createHud} from "../ui/Hud.js";
export class CityScene extends Phaser.Scene{
 constructor(){super("CityScene")}
 create(){
  this.cameras.main.setBackgroundColor("#080b10");this.ps=new PlayerSystem(this);this.drawCity();
  this.player=new Player(this,WORLD.width*.32,WORLD.height*.48);this.cameras.main.setBounds(0,0,WORLD.width,WORLD.height);
  this.cameras.main.startFollow(this.player,true,.10,.10);this.keys=this.input.keyboard.addKeys("W,A,S,D");this.cursors=this.input.keyboard.createCursorKeys();
  LOCATIONS.forEach(d=>new Building(this,d,loc=>this.openLocation(loc)));
  this.setupCameraDrag();this.createMiniMap();this.createTouchPad();this.refreshHud=createHud(this,this.ps);this.refreshHud();
  this.time.addEvent({delay:500,loop:true,callback:this.refreshHud});
 }
 drawCity(){
  const g=this.add.graphics();g.fillStyle(0x10151b);g.fillRect(0,0,WORLD.width,WORLD.height);
  for(let x=0;x<WORLD.width;x+=360){g.fillStyle(0x252c34);g.fillRect(x,0,92,WORLD.height)}
  for(let y=0;y<WORLD.height;y+=360){g.fillStyle(0x252c34);g.fillRect(0,y,WORLD.width,92)}
  for(let x=30;x<WORLD.width;x+=360)for(let y=30;y<WORLD.height;y+=360){g.fillStyle(0x171d24);g.fillRect(x,y,270,270);g.fillStyle(0x1d252d);g.fillRect(x+18,y+18,234,8);g.fillRect(x+18,y+244,234,8)}
  for(let i=0;i<18;i++){const x=180+(i%6)*520,y=170+Math.floor(i/6)*610;g.fillStyle(0x34404a);g.fillCircle(x,y,10);g.fillStyle(0x65717a);g.fillCircle(x,y,4)}
 }
 openLocation(loc){if(loc.id==="arena")this.scene.start("MissionScene");else if(loc.id==="training")this.scene.start("TrainingScene");else if(loc.id==="market")this.scene.start("EquipmentScene");else{this.cameras.main.flash(180,217,164,65);}}
 setupCameraDrag(){
  let active=false,moved=false,sx=0,sy=0,cx=0,cy=0;
  this.input.on("pointerdown",p=>{active=true;moved=false;sx=p.x;sy=p.y;cx=this.cameras.main.scrollX;cy=this.cameras.main.scrollY});
  this.input.on("pointermove",p=>{if(!active||!p.isDown)return;const dx=p.x-sx,dy=p.y-sy;if(Math.hypot(dx,dy)>10)moved=true;if(moved){this.cameras.main.stopFollow();this.cameras.main.scrollX=Phaser.Math.Clamp(cx-dx,0,Math.max(0,WORLD.width-this.cameras.main.width));this.cameras.main.scrollY=Phaser.Math.Clamp(cy-dy,0,Math.max(0,WORLD.height-this.cameras.main.height))}});
  this.input.on("pointerup",()=>active=false);
 }
 createMiniMap(){
  const w=170,h=116,x=this.scale.width-184,y=16;const box=this.add.rectangle(x,y,w,h,0x0b0f14,.92).setOrigin(0).setScrollFactor(0).setDepth(90).setStrokeStyle(1,0x414852);
  const map=this.add.graphics().setScrollFactor(0).setDepth(91);map.fillStyle(0x1d252d);map.fillRect(x+8,y+8,w-16,h-16);
  LOCATIONS.forEach(l=>{const px=x+8+(l.x/WORLD.width)*(w-16),py=y+8+(l.y/WORLD.height)*(h-16);map.fillStyle(l.color);map.fillCircle(px,py,5)});
  this.minimapPlayer=this.add.circle(x+8+(this.player.x/WORLD.width)*(w-16),y+8+(this.player.y/WORLD.height)*(h-16),4,0xffffff).setScrollFactor(0).setDepth(92);
  this.events.on("update",()=>{if(this.minimapPlayer){this.minimapPlayer.x=x+8+(this.player.x/WORLD.width)*(w-16);this.minimapPlayer.y=y+8+(this.player.y/WORLD.height)*(h-16)}})
 }
 createTouchPad(){
  const base=this.add.circle(78,this.scale.height-82,52,0x11161b,.78).setScrollFactor(0).setDepth(100);
  const knob=this.add.circle(78,this.scale.height-82,22,0xd9a441,.85).setScrollFactor(0).setDepth(101);
  let active=false;this.input.on("pointerdown",p=>{if(Phaser.Math.Distance.Between(p.x,p.y,base.x,base.y)<75)active=true});
  this.input.on("pointermove",p=>{if(!active)return;const a=Phaser.Math.Angle.Between(base.x,base.y,p.x,p.y),d=Math.min(30,Phaser.Math.Distance.Between(base.x,base.y,p.x,p.y));knob.x=base.x+Math.cos(a)*d;knob.y=base.y+Math.sin(a)*d;this.joy={x:Math.cos(a)*(d/30),y:Math.sin(a)*(d/30)}});
  this.input.on("pointerup",()=>{active=false;this.joy={x:0,y:0};knob.x=base.x;knob.y=base.y});this.joy={x:0,y:0};
 }
 update(_t,dt){
  const x=(this.keys.D.isDown||this.cursors.right.isDown?1:0)-(this.keys.A.isDown||this.cursors.left.isDown?1:0)+(this.joy?.x||0);
  const y=(this.keys.S.isDown||this.cursors.down.isDown?1:0)-(this.keys.W.isDown||this.cursors.up.isDown?1:0)+(this.joy?.y||0);
  if(x||y){const v=new Phaser.Math.Vector2(x,y).normalize().scale(280*dt/1000);this.player.x=Phaser.Math.Clamp(this.player.x+v.x,WORLD.padding,WORLD.width-WORLD.padding);this.player.y=Phaser.Math.Clamp(this.player.y+v.y,WORLD.padding,WORLD.height-WORLD.padding);this.cameras.main.startFollow(this.player,true,.10,.10)}
 }
}