class CityScene extends Phaser.Scene {
  constructor(){super('CityScene');}

  create(){
    var gs=window.gameState;
    this.add.text(this.scale.width/2,90,'وكر الأوغاد',{
      fontFamily:'Cairo, sans-serif',fontSize:'30px',fontStyle:'bold',color:'#d4af37'
    }).setOrigin(.5);

    this.topBar=buildTopBar(this,'CityScene');

    var self=this;
    var keys=['hq','bank','warehouse','barracks'];
    var cardW=172,cardH=190,gap=10;
    var totalW=keys.length*cardW+(keys.length-1)*gap;
    var startX=(this.scale.width-totalW)/2;
    var y=140;

    this.cards={};
    keys.forEach(function(key,i){
      var x=startX+i*(cardW+gap);
      self.cards[key]=self.buildBuildingCard(key,x,y,cardW,cardH);
    });

    this.logPanel=buildLogPanel(this,startX,y+cardH+25,totalW,115);
    this.events.on('update',this.refresh,this);
    this.refresh();
  }

  buildBuildingCard(key,x,y,w,h){
    var cfg=BUILDINGS[key],gs=window.gameState;
    drawPanel(this,x,y,w,h,COLORS.panel,COLORS.border);

    var icon=this.add.graphics();
    icon.fillStyle(cfg.color,1);
    icon.fillRoundedRect(x+w/2-24,y+14,48,48,8);

    this.add.text(x+w/2,y+78,cfg.name,{
      fontFamily:'Cairo, sans-serif',fontSize:'17px',fontStyle:'bold',color:'#fff',
      align:'center'
    }).setOrigin(.5);

    var levelText=this.add.text(x+w/2,y+103,'',{
      fontFamily:'Cairo, sans-serif',fontSize:'13px',color:COLORS.textMuted
    }).setOrigin(.5);

    var infoText=this.add.text(x+w/2,y+125,'',{
      fontFamily:'Cairo, sans-serif',fontSize:'12px',color:COLORS.textMuted,
      align:'center',wordWrap:{width:w-20}
    }).setOrigin(.5);

    var self=this;
    var btn=makeButton(this,x+10,y+h-43,w-20,32,'ترقية',COLORS.gold,function(){
      var res=gs.startUpgrade(key);
      if(!res.ok) self.flashMessage(res.reason);
    });

    return {icon:icon,levelText:levelText,infoText:infoText,btn:btn};
  }

  flashMessage(text){
    if(this._msg)this._msg.destroy();
    this._msg=this.add.text(this.scale.width/2,this.scale.height-18,text,{
      fontFamily:'Cairo, sans-serif',fontSize:'15px',color:'#ff6b6b',
      backgroundColor:'#181c26',padding:{x:10,y:5}
    }).setOrigin(.5);

    var self=this;
    this.time.delayedCall(1800,function(){
      if(self._msg){self._msg.destroy();self._msg=null;}
    });
  }

  refresh(){
    var gs=window.gameState;
    this.topBar.refresh();
    this.logPanel.refresh();

    var self=this;
    Object.keys(this.cards).forEach(function(key){
      var card=self.cards[key],b=gs.buildings[key],maxLevel=gs.getBuildingMaxLevel(key);
      card.levelText.setText('المستوى '+b.level+' / '+maxLevel);

      var extra='';
      if(key==='bank')extra='+'+gs.bankIncomePerSec()+' 💵/ث';
      else if(key==='warehouse')extra='السعة: '+formatNumber(gs.warehouseCapacity());
      else if(key==='barracks')extra='تسريع التدريب '+Math.round((1-gs.trainSpeedMultiplier())*100)+'%';
      else if(key==='hq')extra='يرفع سقف باقي المباني';
      card.infoText.setText(extra);

      var busyTimer=gs.timers.filter(function(t){
        return t.kind==='building'&&t.key===key;
      })[0];

      if(busyTimer){
        var remaining=(busyTimer.completeAt-Date.now())/1000;
        card.btn.setLabel('جارٍ... '+formatTime(remaining));
        card.btn.setEnabled(false);
      }else{
        var check=gs.canUpgradeBuilding(key);
        if(check.ok){
          card.btn.setLabel('ترقية ('+formatNumber(check.cost)+' 💵)');
          card.btn.setEnabled(true);
        }else{
          card.btn.setLabel(check.reason);
          card.btn.setEnabled(false);
        }
      }
    });
  }
}