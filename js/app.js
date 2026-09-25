const state={level:1,xp:34,next:100,money:2000,energy:86,stamina:5,reputation:12,city:"المدينة الرئيسية"};
const places=[
["🛒","مركز التسوق","منتجات للتجارة والمعارك","shop"],
["🕶️","السوق السوداء","مهمات وطلبات من اللاعبين","black"],
["🏋️","مركز التدريب","قوة • سرعة • دفاع • دقة","training"],
["🕳️","العالم السفلي","منطقة غامضة","soon"],
["🏛️","قصر مركز المدينة","غير متاح الآن","locked"],
["🏥","المستشفى","علاج بعد الهزائم","hospital"],
["⛓️","السجن","نتيجة فشل بعض المهمات","prison"],
["✈️","المطار","السفر بين المدن","airport"],
["👥","ملف العصابة","إدارة شخصيتك وممتلكاتك","profile"],
["🌍","خريطة العالم","المدن والأسواق والرحلات","map"]
];
const products=["سيارة مستعملة","معدات حماية","هاتف نادر","ملابس فاخرة","إلكترونيات","مواد تجارية"];
const missions=[
["توصيل آمن","توصيل","سهل",180,18,35],["استعادة شحنة","استرداد","متوسط",320,24,55],
["حماية تاجر","حماية","صعب",520,32,85],["طلب خاص","خاص","خبير",800,40,120]
];
const $=s=>document.querySelector(s);
function render(){
document.querySelector("#app").innerHTML=`<div class="game">
<header class="top"><div class="profile"><div class="avatar">🧥</div><div><div class="name">زعيم العصابة</div><div class="sub">${state.city} • السمعة ${state.reputation}</div></div><div class="level"><b>المستوى ${state.level}</b><div class="xp"><i style="width:${state.xp/state.next*100}%"></i></div><small>${state.xp}/${state.next} XP</small></div></div>
<div class="resources"><div class="res">💰<small>المال</small><b>${state.money}</b></div><div class="res">⚡<small>الطاقة</small><b>${state.energy}</b></div><div class="res">💪<small>التحمل</small><b>${state.stamina}</b></div><div class="res">⭐<small>السمعة</small><b>${state.reputation}</b></div></div></header>
<section class="hero"><div class="sky"></div><div class="cityline"></div><div class="street"></div><div class="hero-title">${state.city}</div><div class="hero-sub">مركز نفوذك</div><div class="boss"><div class="head"></div><div class="body"></div><div class="tag">أنت الزعيم</div></div></section>
<div class="quick"><button class="q" onclick="openPanel('missions')"><strong>📋</strong>المهمات</button><button class="q" onclick="openPanel('training')"><strong>📈</strong>التطوير</button><button class="q" onclick="openPanel('shop')"><strong>🛍️</strong>المتجر</button><button class="q" onclick="openPanel('travel')"><strong>✈️</strong>السفر</button></div>
<section class="section"><div class="section-head"><h2>مرافق المدينة</h2><span>اضغط للدخول</span></div><div class="grid">${places.map((p,i)=>`<button class="card ${p[3]==='locked'?'locked':''}" onclick="openPlace('${p[3]}','${p[1]}')"><div class="icon">${p[0]}</div><b>${p[1]}</b><small>${p[2]}</small>${p[3]==='soon'||p[3]==='locked'?'<span class="badge">غير متاح</span>':''}</button>`).join("")}</div></section>
<nav class="bottom"><button class="nav active" onclick="render()"><b>🏠</b>الرئيسية</button><button class="nav" onclick="openPanel('missions')"><b>📋</b>المهمات</button><button class="nav" onclick="openPanel('training')"><b>🏋️</b>التدريب</button><button class="nav" onclick="openPanel('shop')"><b>🛒</b>المتجر</button><button class="nav" onclick="openPanel('profile')"><b>👤</b>الملف</button></nav></div>`;
}
function openPlace(type,title){if(type==='shop')return openPanel('shop');if(type==='black')return openPanel('missions');if(type==='training')return openPanel('training');if(type==='airport')return openPanel('travel');if(type==='profile')return openPanel('profile');if(type==='map')return openPanel('travel');show(`${title}`,type==='hospital'?'🏥 العلاج متاح عند انخفاض الطاقة.':type==='prison'?'⛓️ لا توجد عقوبة حالية.':'🔒 هذا القسم غير متاح الآن.');}
function openPanel(type){
let title="",body="";
if(type==='shop'){title="مركز التسوق";body=`<div class="list">${products.map((x,i)=>`<div class="row"><strong>🛍️ ${x}</strong><small>متاح للتجارة أو للاستخدام داخل أنظمة اللعبة</small><button class="action" onclick="buy(${100+i*75})">شراء • ${100+i*75} 💰</button></div>`).join("")}</div>`;}
if(type==='missions'){title="السوق السوداء • المهمات";body=`<div class="list">${missions.map((m,i)=>`<div class="row"><strong>${m[0]}</strong><small>النوع: ${m[1]} • الصعوبة: ${m[2]} • مكافأة: ${m[3]} 💰 • XP: ${m[5]} • طاقة: ${m[4]}</small><button class="action" onclick="startMission(${i})">قبول المهمة</button></div>`).join("")}</div>`;}
if(type==='training'){title="مركز التدريب";body=`<p class="sub">التطوير يستخدم نقاط التحمل المكتسبة عند رفع المستوى.</p>${[['قوة',10],['سرعة',10],['دفاع',10],['دقة',10]].map(x=>`<div class="stat"><b>${x[0]}</b><div class="bar"><i style="width:${x[1]*5}%"></i></div><b>${x[1]}</b></div>`).join("")}<button class="action" onclick="train()">تطوير عشوائي • 1 نقطة تحمل</button>`;}
if(type==='travel'){title="المطار";body=`<div class="list">${["القاهرة","الرياض","دبي","باريس","شنغهاي"].map(c=>`<button class="row" onclick="travel('${c}')"><strong>✈️ ${c}</strong><small>رحلة متاحة من ${state.city}</small></button>`).join("")}</div>`;}
if(type==='profile'){title="ملف العصابة";body=`<div class="row"><strong>زعيم العصابة</strong><small>المستوى ${state.level} • المال ${state.money} • السمعة ${state.reputation}</small></div><div class="row"><strong>المعدات</strong><small>سترة الحماية • تجهيز تجميلي ظاهر في المعارك</small></div>`;}
show(title,body);
}
function show(title,body){const old=document.querySelector(".modal");if(old)old.remove();document.body.insertAdjacentHTML("beforeend",`<div class="modal" onclick="if(event.target===this)this.remove()"><div class="sheet"><div class="sheet-head"><h2>${title}</h2><button class="close" onclick="this.closest('.modal').remove()">✕</button></div>${body}</div></div>`)}
function buy(cost){if(state.money<cost)return toast("المال غير كافٍ");state.money-=cost;toast("تمت الإضافة إلى ممتلكاتك");render();}
function train(){if(state.stamina<1)return toast("لا توجد نقاط تحمل كافية");state.stamina--;toast("تم تطوير إحدى مهاراتك");render();}
function travel(city){state.city=city;document.querySelector(".modal")?.remove();render();toast("وصلت إلى "+city);}
function startMission(i){const m=missions[i];if(state.energy<m[4])return toast("الطاقة غير كافية");state.energy-=m[4];setTimeout(()=>{state.money+=m[3];state.xp+=m[5];state.reputation+=2;if(state.xp>=state.next){state.xp-=state.next;state.level++;state.next+=100;state.stamina+=2;toast("ارتفع مستواك! +2 تحمل")}else toast("نجحت المهمة!");render();},700);toast("بدأت المعركة التلقائية...");}
function toast(t){const x=document.createElement("div");x.className="toast";x.textContent=t;document.body.appendChild(x);setTimeout(()=>x.remove(),1800)}
render();