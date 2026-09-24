class CityScene extends Phaser.Scene{
  constructor(){super('CityScene');}
  init(data){this.city=(data&&data.city)||window.gameState.location||'main';this.chooseCity=data&&data.chooseCity;}
  create(){this.render();}
  render(){this.children.removeAll(true);var s=this,gs=window.gameState,city=CITIES[this.city]||CITIES.main;
    header(this,city.name,'home');
    if(this.city==='main')this.renderMain(city);else this.renderCity(city);
  }
  card(dest,x,y,w,h){var s=this,locked=dest.kind==='locked'||dest.kind==='palace';panel(s,x,y,w,h,locked?0x141923:COLORS.panel2);txt(s,x+w/2,y+34,dest.emoji,30);txt(s,x+w/2,y+75,dest.name,16,locked?'#c1c6d0':COLORS.text);txt(s,x+w/2,y+105,dest.desc,11,COLORS.muted);
    button(s,x+18,y+h-42,w-36,30,locked?(dest.status||'غير متاح'): 'دخول',locked?0x4b5260:COLORS.gold,function(){if(locked)s.scene.start('LocationScene',{city:s.city,kind:dest.kind,name:dest.name,status:dest.status});else s.scene.start('LocationScene',{city:s.city,kind:dest.kind,name:dest.name});});
  }
  renderMain(){var list=CITY_DESTINATIONS.main;txt(this,400,128,'وجهات المدينة',18,COLORS.text);var w=178,h=128,g=12,start=31;list.forEach((d,i)=>{var col=i%4,row=Math.floor(i/4);this.card(d,start+col*(w+g),150+row*(h+g),w,h);});
    panel(this,31,444,738,132,COLORS.panel);txt(this,400,470,'تقدم اللاعب',15,COLORS.muted);txt(this,400,500,'المستوى '+window.gameState.progress.level+'   •   XP '+window.gameState.progress.xp+' / '+window.gameState.progress.nextXp+'   •   نقاط التحمل '+window.gameState.progress.stamina,15,COLORS.text);progress(this,100,538,600,10,window.gameState.progress.xp/window.gameState.progress.nextXp,COLORS.gold);
  }
  renderCity(city){txt(this,400,128,city.emoji+'  '+city.name,20,COLORS.text);var list=CITY_DESTINATIONS.city,w=230,h=130,g=14,start=30;list.forEach((d,i)=>{var col=i%3,row=Math.floor(i/3);this.card(d,start+col*(w+g),150+row*(h+g),w,h);});
    panel(this,30,452,740,112,COLORS.panel);txt(this,400,478,'السفر الحالي',15,COLORS.muted);txt(this,400,508,'وصلت من: '+(CITIES[window.gameState.lastCity]||CITIES.main).name,14,COLORS.text);button(this,550,526,190,30,'العودة للمدينة الرئيسية',COLORS.panel2,function(){window.gameState.travel('main');this.scene.start('CityScene',{city:'main'});}.bind(this));
  }
}