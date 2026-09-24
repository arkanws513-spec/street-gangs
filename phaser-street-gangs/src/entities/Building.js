export class Building extends Phaser.GameObjects.Container{
 constructor(scene,data,onOpen){
  super(scene,data.x,data.y);
  const shadow=scene.add.ellipse(8,54,214,34,0x000000,.30);
  const base=scene.add.rectangle(0,16,198,112,0x111820).setStrokeStyle(2,0x4d5965);
  const side=scene.add.rectangle(84,5,28,98,0x0b1016);
  const front=scene.add.rectangle(-8,0,174,104,0x26313b).setStrokeStyle(1,0x66727c);
  const roof=scene.add.polygon(-8,-58,[[-96,0],[78,0],[96,15],[-78,15]],data.color);
  const roofGlow=scene.add.rectangle(-8,-45,152,4,0xffffff,.16);
  const sign=scene.add.rectangle(-8,-8,104,28,0x0b0f14,.90).setStrokeStyle(1,data.color);
  const icon=scene.add.circle(-8,-8,12,data.color);
  const windows=[];
  for(let r=0;r<2;r++)for(let col=0;col<4;col++){
   const w=scene.add.rectangle(-68+col*34,-8+r*30,17,12,0x9fc6d1,.75);
   windows.push(w);
  }
  const door=scene.add.rectangle(48,30,24,45,0x0a0d11).setStrokeStyle(1,0x65717a);
  const label=scene.add.text(-8,65,data.name,{fontFamily:"system-ui",fontSize:"15px",fontStyle:"bold",color:"#f1eee7",stroke:"#080b10",strokeThickness:4}).setOrigin(.5);
  const sub=scene.add.text(-8,86,"اضغط للدخول",{fontFamily:"system-ui",fontSize:"9px",color:"#9da6af"}).setOrigin(.5);
  this.add([shadow,base,side,front,roof,roofGlow,sign,icon,...windows,door,label,sub]);
  this.setSize(224,154).setInteractive({useHandCursor:true});
  this.on("pointerover",()=>{this.setScale(1.035);this.setDepth(20)});
  this.on("pointerout",()=>{this.setScale(1);this.setDepth(10)});
  this.on("pointerup",()=>onOpen(data));
  scene.add.existing(this);this.setDepth(10);
 }
}