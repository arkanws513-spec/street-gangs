import Phaser from "https://cdn.jsdelivr.net/npm/phaser@4.2.1/dist/phaser.esm.js";

const WORLD_W=3200, WORLD_H=2200;

class CityScene extends Phaser.Scene{
  constructor(){super("CityScene");}
  create(){
    this.cameras.main.setBackgroundColor("#0b0e12");
    this.drawWorld();
    this.player=this.add.circle(1600,1100,22,0xd9a441);
    this.player.setDepth(10);
    this.cameras.main.startFollow(this.player,true,0.12,0.12);
    this.cameras.main.setBounds(0,0,WORLD_W,WORLD_H);
    this.input.addPointer(2);

    this.keys=this.input.keyboard.addKeys("W,A,S,D");
    this.cursors=this.input.keyboard.createCursorKeys();

    this.add.text(24,24,"عصابات الشوارع — نسخة Phaser",{fontFamily:"system-ui",fontSize:"18px",fontStyle:"bold",color:"#f0c163"})
      .setScrollFactor(0).setDepth(100);
    this.status=this.add.text(24,52,"تحرك لاستكشاف المدينة",{fontFamily:"system-ui",fontSize:"13px",color:"#d5d8dc"})
      .setScrollFactor(0).setDepth(100);

    this.add.text(24,78,"WASD / الأسهم — حركة  •  اسحب الشاشة — استكشاف",{fontFamily:"system-ui",fontSize:"12px",color:"#9298a1"})
      .setScrollFactor(0).setDepth(100);

    this.input.on("pointermove",p=>{
      if(p.isDown && p.prevPosition){
        this.cameras.main.scrollX -= p.x-p.prevPosition.x;
        this.cameras.main.scrollY -= p.y-p.prevPosition.y;
        this.cameras.main.scrollX=Phaser.Math.Clamp(this.cameras.main.scrollX,0,WORLD_W-this.scale.width);
        this.cameras.main.scrollY=Phaser.Math.Clamp(this.cameras.main.scrollY,0,WORLD_H-this.scale.height);
      }
    });
  }
  drawWorld(){
    const g=this.add.graphics();
    g.fillStyle(0x11161b,1).fillRect(0,0,WORLD_W,WORLD_H);
    for(let x=0;x<WORLD_W;x+=160){
      g.fillStyle(x%320===0?0x20262d:0x191e24,1).fillRect(x,0,70,WORLD_H);
    }
    for(let y=0;y<WORLD_H;y+=160){
      g.fillStyle(y%320===0?0x20262d:0x191e24,1).fillRect(0,y,WORLD_W,70);
    }

    const places=[
      [700,500,"المقر",0xd9a441],
      [2500,520,"السوق",0x4fa8a0],
      [700,1700,"التدريب",0x9b78d0],
      [2500,1700,"المطار",0x6c9bd2],
      [1600,1100,"الحلبة",0xc96b61]
    ];
    places.forEach(([x,y,name,color])=>{
      const b=this.add.rectangle(x,y,210,130,0x20262d).setStrokeStyle(2,0x343b44);
      this.add.circle(x,y-10,35,color).setStrokeStyle(3,0x0d1014);
      this.add.text(x,y+42,name,{fontFamily:"system-ui",fontSize:"22px",fontStyle:"bold",color:"#ece8e1"}).setOrigin(.5);
      b.setInteractive({useHandCursor:true});
      b.on("pointerdown",()=>this.status.setText("الموقع المحدد: "+name));
    });
  }
  update(){
    const dx=(this.keys.D.isDown||this.cursors.right.isDown?1:0)-(this.keys.A.isDown||this.cursors.left.isDown?1:0);
    const dy=(this.keys.S.isDown||this.cursors.down.isDown?1:0)-(this.keys.W.isDown||this.cursors.up.isDown?1:0);
    if(dx||dy){
      const v=new Phaser.Math.Vector2(dx,dy).normalize().scale(260*this.game.loop.delta/1000);
      this.player.x=Phaser.Math.Clamp(this.player.x+v.x,30,WORLD_W-30);
      this.player.y=Phaser.Math.Clamp(this.player.y+v.y,30,WORLD_H-30);
    }
  }
}

new Phaser.Game({
  type:Phaser.AUTO,
  parent:"game",
  width:window.innerWidth,
  height:window.innerHeight,
  scale:{mode:Phaser.Scale.RESIZE,autoCenter:Phaser.Scale.CENTER_BOTH},
  scene:[CityScene],
  render:{antialias:true,pixelArt:false}
});