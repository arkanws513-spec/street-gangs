class MissionsScene extends Phaser.Scene {
  constructor(){super('MissionsScene');}

  create(){
    var self=this, gs=window.gameState;
    this.add.text(this.scale.width/2,90,'المهام',{
      fontFamily:'Cairo, sans-serif',fontSize:'30px',fontStyle:'bold',color:'#d4af37'
    }).setOrigin(.5);

    this.topBar=buildTopBar(this,'MissionsScene');

    var rowH=78,gap=8,w=720,startX=(this.scale.width-w)/2,y=128;
    this.rows=MISSIONS.map(function(mission,i){
      return self.buildMissionRow(mission,startX,y+i*(rowH+gap),w,rowH);
    });

    // إبقاء سجل الأحداث داخل مساحة اللعبة 800x620.
    var logY=484;
    this.logPanel=buildLogPanel(this,startX,logY,w,112);

    this.refresh();
    // لا نعيد رسم كل عناصر الواجهة في كل إطار؛ ذلك كان يسبب تجمد شاشة المهمات على الهاتف.
    this.refreshTimer=this.time.addEvent({delay:500,loop:true,callback:this.refresh,callbackScope:this});
  }

  buildMissionRow(mission,x,y,w,h){
    var self=this,gs=window.gameState;
    drawPanel(this,x,y,w,h,COLORS.panel,COLORS.border);

    this.add.text(x+18,y+10,mission.name,{
      fontFamily:'Cairo, sans-serif',fontSize:'17px',fontStyle:'bold',color:'#fff'
    });

    this.add.text(x+18,y+38,mission.desc,{
      fontFamily:'Cairo, sans-serif',fontSize:'11px',color:COLORS.textMuted
    });

    this.add.text(x+18,y+59,
      'القوة: '+mission.power+'  |  الطاقة: '+mission.energy+
      '  |  المكافأة: '+mission.reward.cash+' 💵',
      {fontFamily:'Cairo, sans-serif',fontSize:'11px',color:COLORS.textMuted}
    );

    var chanceText=this.add.text(x+w-220,y+10,'',{
      fontFamily:'Cairo, sans-serif',fontSize:'12px',color:COLORS.textLight,
      align:'right'
    }).setOrigin(0,0);

    var btn=makeButton(this,x+w-120,y+h-42,105,32,'تنفيذ',COLORS.gold,function(){
      var res=gs.attemptMission(mission.id);
      if(!res.ok){self.flashMessage(res.reason,'#ff6b6b');return;}
      if(res.success)self.flashMessage('نجاح! +'+res.reward.cash+' 💵','#2ecc71');
      else self.flashMessage('فشل! -'+res.penalty+' 💵','#ff6b6b');
    });

    return {mission:mission,chanceText:chanceText,btn:btn};
  }

  flashMessage(text,color){
    if(this._msg)this._msg.destroy();
    this._msg=this.add.text(this.scale.width/2,this.scale.height-20,text,{
      fontFamily:'Cairo, sans-serif',fontSize:'16px',color:color||'#ff6b6b',
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
    var power=gs.totalCrewPower();

    this.rows.forEach(function(row){
      var ratio=power/row.mission.power;
      var chance=Math.round(Math.max(.05,Math.min(.95,ratio))*100);
      row.chanceText.setText('فرصة النجاح: '+chance+'%');
      var enabled=gs.resources.energy>=row.mission.energy;
      if(row.enabled!==enabled){ row.enabled=enabled; row.btn.setEnabled(enabled); }
    });
  }
}
