const KEY="mafia-world-save-v1";
let s=JSON.parse(localStorage.getItem(KEY)||"null")||{cash:1000,respect:10,power:5,energy:100,hq:1,members:1,last:Date.now()};
const $=id=>document.getElementById(id);
function save(){localStorage.setItem(KEY,JSON.stringify(s));render()}
function log(t){const e=document.createElement("div");e.className="entry";e.innerHTML=t;$("log").prepend(e);while($("log").children.length>12)$("log").lastChild.remove()}
function render(){$("cash").textContent=s.cash.toLocaleString("ar-EG");$("respect").textContent=s.respect;$("power").textContent=s.power;$("energy").textContent=s.energy;$("hq").textContent=s.hq;$("members").textContent=s.members;const c=Math.floor(500*Math.pow(1.65,s.hq-1));$("upgradeCost").textContent=c.toLocaleString("ar-EG");$("upgrade").disabled=s.cash<c||s.energy<10}
function spendEnergy(n){if(s.energy<n){log("<b>لا توجد طاقة كافية.</b> انتظر حتى تتجدد.");return false}s.energy-=n;return true}
function action(a){
 if(a==="work"){if(!spendEnergy(8))return;let gain=120+s.members*15;s.cash+=gain;s.respect+=2;log("🏪 أنجزت أعمالًا في الحي التجاري وربحت <b>"+gain+" 💰</b>.");}
 if(a==="property"){if(s.cash<350){log("🏢 تحتاج إلى <b>350 💰</b> لشراء أول عقار.");return}if(!spendEnergy(12))return;s.cash-=350;s.power+=4;s.respect+=3;log("🏢 استحوذت على عقار جديد. <b>+4 نفوذ</b> و<b>+3 سمعة</b>.");}
 if(a==="crew"){if(s.cash<250){log("👥 تجنيد عضو جديد يحتاج <b>250 💰</b>.");return}if(!spendEnergy(10))return;s.cash-=250;s.members++;s.power+=3;log("👥 انضم عضو جديد إلى العصابة. عدد الأفراد: <b>"+s.members+"</b>.");}
 if(a==="missions"){if(!spendEnergy(15))return;let gain=180+s.power*12;s.cash+=gain;s.respect+=5;s.power+=2;log("📋 أنجزت عملية خيالية داخل المدينة وحصلت على <b>"+gain+" 💰</b> و<b>+5 سمعة</b>.");}
 if(a==="market"){if(s.cash<200){log("📈 الحد الأدنى للاستثمار <b>200 💰</b>.");return}if(!spendEnergy(5))return;s.cash-=200;let gain=Math.random()<.65?300:80;s.cash+=gain;s.respect+=gain>200?2:0;log("📈 انتهت دورة السوق: <b>"+(gain-200>=0?"+":"")+(gain-200)+" 💰</b>.");}
 if(a==="club"){if(!spendEnergy(6))return;s.cash=Math.max(0,s.cash-50);s.respect+=8;log("🍸 أمضيت وقتًا في النادي وارتفعت السمعة <b>+8</b>.");}
 save();
}
document.querySelectorAll("[data-action]").forEach(b=>b.onclick=()=>action(b.dataset.action));
$("upgrade").onclick=()=>{let c=Math.floor(500*Math.pow(1.65,s.hq-1));if(s.cash<c||!spendEnergy(10))return;s.cash-=c;s.hq++;s.power+=8;s.members+=2;log("🏢 تم تطوير المقر إلى المستوى <b>"+s.hq+"</b>.");save()};
$("reset").onclick=()=>{if(confirm("هل تريد بدء مدينة جديدة؟")){localStorage.removeItem(KEY);location.reload()}};
setInterval(()=>{if(s.energy<100){s.energy=Math.min(100,s.energy+1);save()}},5000);
setInterval(()=>{const now=Date.now();if(now-s.last>60000){s.last=now;save()}},10000);
log("🌃 <b>مرحبًا بك في عالم المافيا.</b> ابدأ من الحي التجاري وابنِ نفوذك داخل المدينة.");
render();