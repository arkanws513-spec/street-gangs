(()=>{const C=[['main','المدينة الرئيسية',0,0],['cairo','القاهرة',1300,14],['alex','الإسكندرية',1700,18],['dubai','دبي',3500,45],['istanbul','إسطنبول',5200,70]],K='street_gangs_v5',Q=x=>document.getElementById(x),N=l=>40+(l-1)*20,B=l=>7*2**(l-1),E=l=>8*2**(l-1);let s=JSON.parse(localStorage.getItem(K)||'null')||{cash:12000,level:1,xp:0,energy:20,max:20,last:Date.now(),free:0,city:'main',done:0,stats:{power:0,defense:0,speed:0,accuracy:0},travel:null,hospital:null,gear:{shield:0,boots:0,helmet:0,kit:0}};const city=()=>C.find(x=>x[0]===s.city)||C[0],save=()=>localStorage.setItem(K,JSON.stringify(s)),toast=m=>{let e=Q('toast')||Object.assign(document.body.appendChild(document.createElement('div')),{id:'toast'});e.textContent=m;e.style='position:fixed;bottom:18px;left:50%;transform:translateX(-50%);background:#111a24;color:white;padding:10px 15px;border:1px solid #3d5066;border-radius:99px;z-index:999;font:12px Tahoma'};function open(t,h){let o=Q('screen')||document.querySelector('.sheet-overlay'),a=Q('sheetTitle'),c=Q('content');if(o)o.classList.add('open');if(a)a.textContent=t;if(c)c.innerHTML=h}
function missions(){let h='<p class="sheet-sub">50 مستوى. قوة الخصم في المستوى 1 = 8 وتتضاعف ×2، والقوة الأساسية للمستخدم في المستوى 1 = 7 وتتضاعف ×2.</p><div class="progress-line"><span>المهمات المكتملة</span><b>'+s.done+' / 50</b></div>';for(let l=1;l<=50;l++){let z=s.level<l;h+='<div class="row-card '+(z?'locked':'')+'"><div class="row-icon">⚔️</div><div class="row-info"><b>مهمة المستوى '+l+'</b><small>قوة الخصم: '+E(l).toLocaleString()+' • النوع: قتال • الصعوبة: '+l+' • ⚡ 1</small></div><button class="btn btn-small" data-m="'+l+'" '+(z?'disabled':'')+'>'+(z?'مغلق':'ابدأ')+'</button></div>'}open('المهمات',h)}
function training(){let h='<div class="notice">النقاط الحرة: <b>'+s.free+'</b><br>كل رفع مستوى يمنح 10 نقاط، والتدريب لا يستهلك الطاقة.</div>';[['power','💪','القوة'],['defense','🛡️','الدفاع'],['speed','⚡','السرعة'],['accuracy','🎯','الدقة']].forEach(x=>h+='<div class="skill-row"><div><b>'+x[1]+' '+x[2]+'</b><small> '+s.stats[x[0]]+'</small></div><button class="btn btn-small" data-t="'+x[0]+'" '+(!s.free?'disabled':'')+'>+1</button></div>');open('التدريب',h)}
function market(){let h='<div class="notice">شراء الطاقة بالكامل: 2000 💵. معدات الحماية تختلف حسب المدينة.</div>';let a=s.city==='cairo'?[['shield','🛡️','درع القاهرة',2800],['boots','🥾','حذاء الرمال',2100],['helmet','🪖','خوذة الحارس',2400],['kit','🔫','سلاح تكتيكي',3000]]:[['shield','🛡️','درع تكتيكي',1800],['boots','🥾','حذاء مطارد',1100],['helmet','🪖','خوذة حماية',1400],['kit','🔫','سلاح المدينة',900]];a.forEach(x=>h+='<div class="row-card"><div class="row-icon">'+x[1]+'</div><div class="row-info"><b>'+x[2]+'</b><small>💵 '+x[3]+' • معك: '+(s.gear[x[0]]||0)+'</small></div><button class="btn btn-small" data-buy="'+x[0]+'" data-price="'+x[3]+'">شراء</button></div>');if(s.city==='main')h+='<button class="btn btn-block" data-energy>شراء الطاقة • 2000</button>';if(s.city==='cairo'){let sold=[['shield','🛡️','درع تكتيكي',1800],['boots','🥾','حذاء مطارد',1100],['helmet','🪖','خوذة حماية',1400],['kit','🔫','سلاح المدينة',900]];h+='<div class="card"><b>💰 إعادة بيع مشتريات المدينة الرئيسية</b>';sold.forEach(x=>{let q=s.gear[x[0]]||0;if(q)h+='<div class="row" style="margin-top:8px"><span>'+x[1]+'</span><div class="grow"><b>'+x[2]+'</b><small style="display:block;color:var(--m)">معك: '+q+'</small></div><button class="btn btn-small" data-sell="'+x[0]+'">بيع</button></div>'});h+='</div>'}open('مركز التسوق',h)}
function airport(){let h='<div class="airportHero"></div><p class="sheet-sub">5 مدن في النظام الحالي. الرحلة إلى القاهرة: 1300 و14 دقيقة.</p>';C.slice(1).forEach(c=>h+='<div class="row-card"><div class="row-icon">✈️</div><div class="row-info"><b>المدينة الرئيسية → '+c[1]+'</b><small>💵 '+c[2].toLocaleString()+' • ⏱️ '+c[3]+' دقيقة</small></div><button class="btn btn-small" data-f="'+c[0]+'">حجز</button></div>');open('المطار',h)}
function cabin(c){let h='<div class="cabin"><div class="seats">';for(let i=0;i<16;i++)h+='<div class="seat">👤<small>مقعد '+(i+1)+'</small></div>';h+='</div></div><div class="card"><b>✈️ الرحلة إلى '+c[1]+'</b><small style="display:block;color:var(--muted)">الوصول بعد '+Math.max(1,Math.ceil((s.travel.a-Date.now())/60000))+' دقيقة</small><div class="flightProgress"><i style="width:'+Math.max(0,100-(s.travel.a-Date.now())/(c[3]*60000)*100)+'%"></i></div></div>';open('الطائرة من الداخل',h)}
function cityView(){let h=s.city==='cairo'?'<div class="cityHero"><h2>القاهرة</h2><p>الأهرامات وأبو الهول</p><div class="pyramid"></div><div class="pyramid small"></div><div class="sphinx">🗿</div></div>':'<div class="cityHero" style="background:linear-gradient(#294d67,#111a23)"><h2>المدينة الرئيسية</h2><p>مركز انطلاق العصابة</p><div class="sphinx">🏙️</div></div>';let a=[['🏢','المركز الرئيسي',''],['⚔️','حلبة القتال','data-vopen=missions'],['🛒','مركز التسوق','data-vopen=market'],['🔒','السجن',''],['🏥','المستشفى','data-vopen=hospital']];if(s.city==='main')a=a.slice(0,3).concat([['✈️','المطار','data-vopen=airport']]);h+='<div class="places">'+a.map(x=>'<button class="place" '+x[2]+'><div class="placeArt">'+x[0]+'</div><div class="placeBody"><b>'+x[1]+'</b><small>'+({'🏢':'إدارة ومتابعة العصابة','⚔️':'المهمات والمواجهات','🛒':'معدات وأسعار المدن','🔒':'الأحداث الخاصة بالسجن','🏥':'راحة بعد الخسارة','✈️':'السفر بين المدن'}[x[0]]||'')+'</small></div></button>').join('')+'</div>';open('مدينة '+city()[1],h)}
function hospital(){if(s.city!=='cairo')return open('المستشفى','<div class="notice">المستشفى متاح في القاهرة فقط.</div>');if(!s.hospital)return open('المستشفى','<div class="notice">لا تحتاج إلى راحة الآن. بعد خسارة حلبة القتال قد تحتاج 3 إلى 5 دقائق حسب حالتك.</div>');let r=Math.max(0,s.hospital-Date.now());if(!r){s.hospital=null;save();return hospital()}open('المستشفى','<div class="card"><h3>🏥 الراحة</h3><div class="timer">المتبقي: '+Math.ceil(r/60000)+' دقيقة</div><p class="sub">يمكنك الانتظار حتى انتهاء فترة الراحة ثم العودة إلى الحلبة.</p></div>')}

/* ===== شاشة القتال التفاعلية ===== */
function battle(l){
  if(s.energy<1)return toast('لا توجد طاقة كافية');
  s.energy--;s.last=Date.now();save();

  const ep=E(l),eDef=Math.round(ep*.55),eSpd=Math.round(ep*.4),eAcc=Math.round(ep*.35);
  const pp=B(s.level)+s.stats.power,pDef=10+s.stats.defense,pSpd=s.stats.speed,pAcc=8+s.stats.accuracy;
  let ph=100,eh=100,stamina=100,guardPlayer=false,auto=false,over=false;

  const slots=['kit','shield','boots','helmet'];
  const slotIcon={kit:'🔫',shield:'🛡️',boots:'🥾',helmet:'🪖'};
  const slotLabel={kit:'السلاح',shield:'الدرع',boots:'الحذاء',helmet:'الخوذة'};

  function gearRow(owned){
    return '<div class="battleGear">'+slots.map(k=>
      '<div class="gearSlot'+(owned&&!s.gear[k]?' empty':'')+'"><span>'+slotIcon[k]+'</span><small>'+slotLabel[k]+'</small></div>'
    ).join('')+'</div>';
  }

  function panel(isEnemy){
    const name=isEnemy?'الخصم':'المستخدم',lvl=isEnemy?l:s.level,hp=isEnemy?eh:ph;
    const st=isEnemy?{power:ep,defense:eDef,speed:eSpd,accuracy:eAcc}:{power:Math.round(pp),defense:pDef,speed:pSpd,accuracy:pAcc};
    return '<div class="side'+(isEnemy?' enemy':'')+'">'
      +'<div class="portrait">'+(isEnemy?'🥷':'👤')+'</div>'
      +'<b>'+name+'</b><small>المستوى '+lvl+'</small>'
      +'<div class="hp"><i id="'+(isEnemy?'ehp':'php')+'" style="width:'+hp+'%"></i></div>'
      +'<div class="statsMini">'
        +'<span>💪 القوة: '+st.power+'</span>'
        +'<span>🛡️ الدفاع: '+st.defense+'</span>'
        +'<span>⚡ السرعة: '+st.speed+'</span>'
        +'<span>🎯 الدقة: '+st.accuracy+'</span>'
      +'</div>'
      +gearRow(!isEnemy)
      +'</div>';
  }

  function render(){
    open('مهمة قتال • مستوى المهمة: '+l,
      '<div class="battle">'
        +'<div class="battleHead">'+panel(false)+'<div class="vs">VS</div>'+panel(true)+'</div>'
        +'<div class="turn" id="bt">دورك الآن</div>'
        +'<div class="log" id="bl"></div>'
        +'<div class="battleActions">'
          +'<button class="btn" id="atk">⚔️ هجوم</button>'
          +'<button class="btn" id="def">🛡️ دفاع</button>'
        +'</div>'
        +'<div class="staminaRow"><span>⚡ نقاط التحمل</span><b id="stv">'+stamina+' / 100</b></div>'
        +'<div class="hp"><i id="stf" style="width:'+stamina+'%"></i></div>'
        +'<button class="btn btn-block" id="autoBtn">الهجوم التلقائي</button>'
        +'<div class="battleFooter">'
          +'<button class="btn btn-ghost" id="retreat">🏃 الانسحاب</button>'
          +'<button class="btn btn-ghost" id="exit">🚪 خروج</button>'
        +'</div>'
      +'</div>');
    bind();
  }

  function log(msg){let el=Q('bl');if(!el)return;let p=document.createElement('p');p.innerHTML=msg;el.prepend(p)}

  function updateBars(){
    if(Q('php'))Q('php').style.width=Math.max(0,ph)+'%';
    if(Q('ehp'))Q('ehp').style.width=Math.max(0,eh)+'%';
    if(Q('stv'))Q('stv').textContent=Math.max(0,stamina)+' / 100';
    if(Q('stf'))Q('stf').style.width=Math.max(0,stamina)+'%';
  }

  function end(win){
    over=true;
    if(win){
      let xp=N(l),money=900+l*350;
      s.cash+=money;s.done=Math.min(50,s.done+1);s.xp+=xp;
      let up=0;
      while(s.xp>=N(s.level)&&s.level<50){s.xp-=N(s.level);s.level++;s.free+=10;s.energy=s.max;up++}
      save();
      open('نتيجة المعركة','<div class="result-card"><b>🏆 فزت بالمهمة</b><p>💵 +'+money+' • ✨ XP +'+xp+'</p>'+(up?'<p>🎉 ارتقيت إلى المستوى '+s.level+' وحصلت على 10 نقاط حرة.</p>':'')+'</div>');
    }else{
      s.hospital=s.city==='cairo'?Date.now()+(ph<35?300000:ph<70?240000:180000):null;
      save();
      open('نتيجة المعركة','<div class="result-card"><b>❌ خسرت</b><p>لم تحصل على مكافأة. إذا كنت في القاهرة ستجد فترة الراحة في المستشفى: 3–5 دقائق حسب الحالة.</p></div>');
    }
  }

  function playerTurn(action){
    if(over)return;
    const cost=action==='atk'?15:8;
    if(stamina<cost)return toast('نقاط التحمل غير كافية');
    stamina=Math.max(0,stamina-cost);
    guardPlayer=action==='def';
    if(action==='atk'){
      let dmg=Math.max(1,Math.round(pp*(.7+Math.random()*.3)-eDef*.3));
      eh=Math.max(0,eh-dmg);
      log('⚔️ لقد هاجمت الخصم وسببت '+dmg+' نقطة ضرر.');
    }else{
      log('🛡️ اتخذت وضع الدفاع، سيقل الضرر القادم.');
    }
    updateBars();
    if(eh<=0)return end(true);
    if(stamina<=0){
      log('😮‍💨 نفدت نقاط تحملك.');
      return end(false);
    }
    if(Q('bt'))Q('bt').textContent='دور الخصم';
    setTimeout(enemyTurn,600);
  }

  function enemyTurn(){
    if(over)return;
    if(Math.random()<.18){
      log('🛡️ الخصم اتخذ وضع الدفاع.');
    }else{
      let dmg=Math.max(1,Math.round(ep*(.5+Math.random()*.25)-pDef*(.3+(guardPlayer?.35:0))));
      ph=Math.max(0,ph-dmg);
      log('👊 هاجمك الخصم وسبب لك '+dmg+' نقطة ضرر.');
    }
    guardPlayer=false;
    updateBars();
    if(ph<=0)return end(false);
    if(Q('bt'))Q('bt').textContent='دورك الآن';
    if(auto&&!over&&stamina>=15)setTimeout(()=>playerTurn('atk'),500);
  }

  function bind(){
    let a=Q('atk'),d=Q('def'),ab=Q('autoBtn'),r=Q('retreat'),ex=Q('exit');
    if(a)a.onclick=()=>playerTurn('atk');
    if(d)d.onclick=()=>playerTurn('def');
    if(ab)ab.onclick=()=>{
      auto=!auto;
      ab.textContent=auto?'إيقاف الهجوم التلقائي':'الهجوم التلقائي';
      if(auto&&!over)playerTurn('atk');
    };
    if(r)r.onclick=()=>{if(!over)end(false)};
    if(ex)ex.onclick=()=>{let o=Q('screen')||document.querySelector('.sheet-overlay');if(o)o.classList.remove('open')};
  }

  render();
}

window.SG2={missions,training,market,airport,cabin,cityView,hospital,battle,save,state:s,city};})();
