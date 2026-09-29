'use client';
import { useState } from "react";
type Card={name:string;icon:string;cost:number;damage:number;text:string};
const cards:Card[]=[
{name:"هجوم سريع",icon:"🦋",cost:1,damage:9,text:"ضربة سريعة منخفضة التكلفة"},
{name:"ضربة قوية",icon:"🔪",cost:3,damage:24,text:"ضرر كبير مقابل طاقة أعلى"},
{name:"دفاع",icon:"🛡️",cost:2,damage:0,text:"يقلل ضرر هجمة الخصم التالية"},
{name:"تصويب",icon:"🎯",cost:2,damage:14,text:"هجوم دقيق"}
];
export default function Home(){
const [energy,setEnergy]=useState(10),[hp,setHp]=useState(100),[enemyHp,setEnemyHp]=useState(100),[coins,setCoins]=useState(250),[xp,setXp]=useState(0),[message,setMessage]=useState("اختر بطاقة لبدء المعركة"),[guard,setGuard]=useState(false),[battle,setBattle]=useState(true);
function play(c:Card){
if(!battle||energy<c.cost)return;
setEnergy(e=>e-c.cost);
let next=Math.max(0,enemyHp-c.damage);
if(c.name==="دفاع"){setGuard(true);setMessage("وضعت نفسك في وضع الدفاع.");return;}
setEnemyHp(next);
if(next===0){setBattle(false);setCoins(x=>x+120);setXp(x=>x+45);setMessage("انتصرت! +120 نقود و +45 XP");return;}
const dmg=guard?6:12;setGuard(false);const newHp=Math.max(0,hp-dmg);setHp(newHp);setMessage("أصبت الخصم بـ "+c.damage+" ضرر. الخصم رد بـ "+dmg+".");
if(newHp===0){setBattle(false);setMessage("خسرت المعركة. أعد المحاولة.");}
}
function reset(){setEnergy(10);setHp(100);setEnemyHp(100);setMessage("اختر بطاقة لبدء المعركة");setGuard(false);setBattle(true);}
return <main className="shell">
<header className="topbar"><div><div className="brand">وَكْر الأوغاد</div><div className="sub">النسخة التجريبية — الحلقة الأساسية</div></div><div className="resources"><span>🪙 {coins}</span><span>⭐ {xp} XP</span></div></header>
<section className="hero"><div><span className="tag">مهمة مستوى 1</span><h1>صفقة في الحي القديم</h1><p>واجه خصمك واختر بطاقاتك بحساب. الفوز يمنحك المال والخبرة.</p></div><div className="objective"><b>الهدف</b><span>هزيمة الخصم</span><small>{battle?"المعركة جارية":enemyHp===0?"انتصار":"هزيمة"}</small></div></section>
<section className="battle"><div className="fighter"><div className="avatar">🥷</div><div className="name">زعيم الحي</div><div className="bar"><i style={{width:enemyHp+"%"}}/></div><span>{enemyHp}/100</span></div><div className="vs">VS</div><div className="fighter"><div className="avatar">🕶️</div><div className="name">زعيمك</div><div className="bar"><i style={{width:hp+"%"}}/></div><span>{hp}/100</span></div></section>
<div className="energy"><span>الطاقة</span><div className="energybar"><i style={{width:(energy*10)+"%"}}/></div><b>{energy}/10</b></div>
<section className="cards">{cards.map(c=><button key={c.name} className="card" disabled={!battle||energy<c.cost} onClick={()=>play(c)}><div className="cardicon">{c.icon}</div><div className="cardbody"><b>{c.name}</b><small>{c.text}</small><em>⚡ {c.cost} — {c.damage?c.damage+" ضرر":"حماية"}</em></div></button>)}</section>
<div className="log">{message}</div>{!battle&&<button className="restart" onClick={reset}>معركة جديدة</button>}
<nav className="dock"><span>🏠<small>الرئيسية</small></span><span>🕶️<small>المهام</small></span><span>🛒<small>التسوق</small></span><span>🏋️<small>التدريب</small></span><span>👤<small>شخصيتي</small></span></nav>
</main>;
}