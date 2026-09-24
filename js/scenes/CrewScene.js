class CrewScene extends Phaser.Scene {
  constructor(){super('CrewScene');}

  create(){
    this.add.text(this.scale.width/2,90,'عصابتك',{
      fontFamily:'Cairo, sans-serif',fontSize:'30px',fontStyle:'bold',color:'#d4af37'
    }).setOrigin(.5);

    this.topBar=buildTopBar(this,'CrewScene');
    this.powerText=this.add.text(this.scale.width/2,118,'',{
      fontFamily:'Cairo, sans-serif',fontSize:'16px',color:COLORS.textLight
    }).setOrigin(.5);

    var self=this,keys=['bulker','biker','shooter'];
    var cardW=225,cardH=225,gap=14;
    var totalW=keys.length*cardW+(keys.length-1)*gap;
    var startX=(this.scale.width-totalW)/2,y=145;

    this.cards={};
    keys.forEach(function(key,i){
      self.cards[key]=self.buildCrewCard(key,startX+i*(cardW+gap),y,cardW,cardH);
    });

    this.logPanel=buildLogPanel(this,startX,y+cardH+22,totalW,100);
    this.events.on('update',this.refresh,this);
    this.refresh();
  }

  buildCrewCard(key,x,y,w,h){
    var cfg=CREW_TYPES[key],gs=window.gameState,self=this;
    drawPanel(this,x,y,w,h,COLORS.panel,COLORS.border);

    var icon=this.add.graphics();
    icon.fillStyle(cfg.color,1);
    icon.fillCircle(x+w/2,y+40,26);

    this.add.text(x+w/2,y+78,cfg.name,{
      fontFamily:'Cairo, sans-serif',fontSize:'18px',fontStyle:'bold',color:'#fff'
    }).setOrigin(.5);

    var countText=this.add.text(x+w/2,y+100,'',{
      fontFamily:'Cairo, sans-serif',fontSize:'14px',color:COLORS.textMuted
    }).setOrigin(.5);

    this.add.text(x+w/2,y+122,'قوة الفرد: '+cfg.power,{
      fontFamily:'Cairo, sans-serif',fontSize:'13px',color:COLORS.textMuted
    }).setOrigin(.5);

    var costText=this.add.text(x+w/2,y+142,'',{
      fontFamily:'Cairo, sans-serif',fontSize:'12px',color:COLORS.textMuted,
      align:'center'
    }).setOrigin(.5);

    var btn1=makeButton(this,x+10,y+h-84,w-20,32,'تدريب 1',cfg.color,function(){
      var res=gs.startTraining(key,1);
      if(!res.ok)self.flashMessage(res.reason);
    });

    var btn5=makeButton(this,x+10,y+h-42,w-20,32,'تدريب 5',cfg.color,function(){
      var res=gs.startTraining(key,5);
      if(!res.ok)self.flashMessage(res.reason);
    });

    return {countText:countText,costText:costText,btn1:btn1,btn5:btn5};
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

    this.powerText.setText(
      'إجمالي القوة: '+gs.totalCrewPower()+'   |   عدد الأفراد: '+gs.totalCrewCount()
    );

    var self=this;
    Object.keys(this.cards).forEach(function(key){
      var card=self.cards[key];
      card.countText.setText('العدد الحالي: '+gs.crew[key]);

      var trainingTimer=gs.timers.filter(function(t){
        return t.kind==='crew'&&t.key===key;
      })[0];

      var cost1=gs.getCrewCost(key,1),cost5=gs.getCrewCost(key,5);
      card.costText.setText(
        '1: '+cost1.cash+'💵/'+cost1.manpower+'👥   |   5: '+cost5.cash+'💵/'+cost5.manpower+'👥'
      );

      if(trainingTimer){
        var remaining=(trainingTimer.completeAt-Date.now())/1000;
        card.btn1.setLabel('تدريب... '+formatTime(remaining));
        card.btn1.setEnabled(false);
        card.btn5.setLabel('تدريب... '+formatTime(remaining));
        card.btn5.setEnabled(false);
      }else{
        card.btn1.setLabel('تدريب 1');
        card.btn1.setEnabled(gs.canTrainCrew(key,1).ok);
        card.btn5.setLabel('تدريب 5');
        card.btn5.setEnabled(gs.canTrainCrew(key,5).ok);
      }
    });
  }
}