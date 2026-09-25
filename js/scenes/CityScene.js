class CityScene extends Phaser.Scene{
constructor(){super('CityScene');}
init(d){this.city=(d&&d.city)||window.gameState.location||'main';this.chooseCity=d&&d.chooseCity;}
create(){this.render();}
card(dest,x,y,w,h){var s=this,locked=dest.kind==='locked'||dest.kind==='palace';panel(s,x,y,w,h,locked?0x0d121b:COLORS.panel2,locked?0x30394a:COLORS.border);txt(s,x+25,y+25,dest.emoji,27);txt(s,x+25,y+64,dest.name,15,locked?'#aab2c0':COLORS.text,0);txt(s,x+25,y+91,dest.desc,10,COLORS.muted,0);button(s,x+25,y+h-35,w-50,26,locked?(dest.status||'غير متاح'):'دخول',locked?0x394252:COLORS.gold,()=>{s.scene.start('LocationScene',{city:s.city,kind:dest.kind,name:dest.name,status:dest.status});});}
render(){this.children.removeAll(true);var s=this,gs=window.gameState,city=CITIES[this.city]||CITIES.main;header(s,city.name,'home');
if(this.city==='main')this.renderMain();else this.renderCity(city);
}
renderMain(){var s=this,list=CITY_DESTINATIONS.main;panel(s,24,122,752,86,0x0e1520);txt(s,48,145,'مركز القيادة',24,COLORS.gold,0);txt(s,48,178,'كل ما تحتاجه العصابة في مكان واحد',13,COLORS.muted,0);txt(s,720,145,'LV '+window.gameState.progress.level,14,COLORS.text,1);progress(s,500,181,220,7,window.gameState.progress.xp/window.gameState.progress.nextXp,COLORS.gold);
var w=176,h=110,g=10,start=24;list.forEach((d,i)=>{var col=i%4,row=Math.floor(i/4);this.card(d,start+col*(w+g),222+row*(h+g),w,h);});
panel(s,24,464,752,112,COLORS.panel);txt(s,48,487,'حالة العصابة',14,COLORS.muted,0);txt(s,48,520,'💵 '+fmt(window.gameState.resources.cash)+'    🎖️ '+fmt(window.gameState.resources.reputation)+'    ⚡ '+window.gameState.resources.energy+'    🏋️ '+window.gameState.progress.stamina,15,COLORS.text,0);button(s,594,505,150,38,'استكشف المدن',COLORS.gold,()=>s.scene.start('LocationScene',{city:'main',kind:'map',name:'خريطة العالم'}));}
renderCity(city){var s=this;panel(s,24,122,752,78,city.color);txt(s,48,140,city.emoji+'  '+city.name,23,'#fff',0);txt(s,48,171,'مدينة مستقلة • منتجات وحلبة وقصر خاص',12,'#fff',0);
var list=CITY_DESTINATIONS.city,w=238,h=118,g=14,start=24;list.forEach((d,i)=>{var col=i%3,row=Math.floor(i/3);var copy=Object.assign({},d);if(d.id==='palace')copy.name='قصر '+city.name;this.card(copy,start+col*(w+g),214+row*(h+g),w,h);});
panel(s,24,474,752,102,COLORS.panel);txt(s,48,497,'آخر رحلة',13,COLORS.muted,0);txt(s,48,529,'قادماً من: '+(CITIES[window.gameState.lastCity]||CITIES.main).name,15,COLORS.text,0);button(s,580,510,164,36,'المدينة الرئيسية',COLORS.panel2,()=>{window.gameState.travel('main');s.scene.start('CityScene',{city:'main'});});}
}