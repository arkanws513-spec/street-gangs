import * as Phaser from "https://cdn.jsdelivr.net/npm/phaser@4.2.1/dist/phaser.esm.js";
export class Player extends Phaser.GameObjects.Container{
 constructor(scene,x,y){
  super(scene,x,y);
  const shadow=scene.add.ellipse(0,24,54,18,0x000000,.35);
  const glow=scene.add.circle(0,0,31,0xd9a441,.12);
  const coat=scene.add.polygon(0,0,[[-18,-20],[18,-20],[25,8],[14,25],[-14,25],[-25,8]],0x202a33).setStrokeStyle(2,0xd9a441);
  const head=scene.add.circle(0,-28,13,0xc99570);
  const hair=scene.add.arc(0,-31,13,200,340,false,0x15181c);
  const belt=scene.add.rectangle(0,10,35,6,0x101419);
  const badge=scene.add.circle(0,-2,5,0xd9a441);
  const legL=scene.add.rectangle(-9,29,8,18,0x111820);
  const legR=scene.add.rectangle(9,29,8,18,0x111820);
  this.add([shadow,glow,coat,head,hair,belt,badge,legL,legR]);
  scene.add.existing(this);this.setDepth(30);
  this.setSize(58,76);
 }
}