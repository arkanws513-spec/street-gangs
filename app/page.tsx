'use client';
import { useState } from "react";
type Card={name:string;icon:string;cost:number;damage:number;text:string};
const cards:Card[]=[
{name:"هجوم سريع",icon:"🦋",cost:1,damage:9,text:"ضربة سريعة منخفضة التكلفة"},
{name:"ضربة قوية",icon:"🔪",cost:3,damage:24,text:"ضرر كبير مقابل طاقة أعلى"},
{name:"دفاع",icon:"🛡️",cost:2,damage:0,text:"يقلل ضرر هجمة الخصم التالية"},
{name:"تصويب",icon:"🎯",cost:2,damage:14,text:"هجوم دقيق"}];
const missions=[
{name:"صفقة في الحي القديم",level:1,reward:120,xp:45,hp:100,power:"ضعيف"},
{name:"تحصيل دين",level:2,reward:220,xp:80,hp:125,power:"متوسط"},
{name:"مواجهة العصابة المنافسة",level:3,reward:400,xp:140,hp:165,power:"قوي"}];
export default function Home(){
const [tab,setTab]=useState("battle"),[mission,setMission]=useState(0),[energy,setEnergy]=useState(10),[hp,setHp]=useState(100),[enemyHp,setEnemyHp]=useState(100),[coins,setCoins]=useState(250),[xp,setXp]=useState(0),[battle,setBattle]=useState(true),[guard,setGuard]=useState(false);
const [stats,setStats]=useState({strength:10,defense:10,speed:10,accuracy:10});
const m=missions[mission];
function start(i:number){const x=missions[i];setMission(i);setEnemyHp(x.hp);setHp(100+stats.defense*2);setEnergy(10);setGuard(false);setBattle(true);setTab("battle")}
function play(c:Card){
if(!battle||energy<c.cost)return;
setEnergy(e=>e-c.cost);
if(c.name==="دفاع"){setGuard(true);return;}
const damage=c.damage+(stats.strength>=15?2:0),next=Math.max(0,enemyHp-damage);setEnemyHp(next);
if(next===0){setBattle(false);setCoins(x=>x+m.reward);setXp(x=>x+m.xp);return;}
const dmg=Math.max(3,12-Math.floor(stats.defense/5))-(guard?5:0);setGuard(false);setHp(h=>Math.max(0,h-dmg));
}
function train(k:keyof typeof stats){if(coins<50)return;setCoins(c=>c-50);setStats(s=>({...s,[k]:s[k]+1}))}
return <main className="shell">
<header className="topbar"><div><div className="brand">وَكْر الأوغاد</div><div className="sub">النسخة التجريبية — الحلقة الأساسية</div></div><div className="resources"><span>🪙 {coins}</span><span>⭐ {xp} XP</span></div></header>
{tab==="missions"&&<section className="panel"><h1>المهام</h1><p>اختر مستوى المهمة قبل دخول المعركة.</p>{missions.map((x,i)=><button className="mission" key={x.name} onClick={()=>start(i)}><div><b>مستوى {x.level} — {x.name}</b><small>الصعوبة: {x.power} · صحة الخصم {x.hp}</small></div><strong>🪙 {x.reward}<br/>⭐ {x.xp} XP</strong></button>)}</section>}
{tab==="training"&&<section className="panel"><h1>مركز التدريب</h1><p>كل تطوير يكلف 50 نقود.</p>{([["strength","💪 القوة"],["defense","🛡️ الدفاع"],["speed","⚡ السرعة"],["accuracy","🎯 الدقة"]] as const).map(([k,n])=><div className="stat" key={k}><span>{n}</span><b>{stats[k]}</b><button onClick={()=>train(k)}>+1 · 🪙50</button></div>)}</section>}
{tab==="shop"&&<section className="panel"><h1>مركز التسوق</h1><div className="locked">🛒 متجر الأسلحة والملابس<br/><small>نظام المعدات سيضاف في المرحلة التالية.</small></div></section>}
{tab==="battle"&&<><section className="hero"><div><span className="tag">مهمة مستوى {m.level}</span><h1>{m.name}</h1><p>واجه خصمك واختر بطاقاتك بحساب.</p></div><div className="objective"><b>الهدف</b><span>هزيمة الخصم</span><small>{battle?"المعركة جارية":enemyHp===0?"انتصار":"هزيمة"}</small></div></section>
<section className="battle"><div className="fighter"><div className="avatar">🥷</div><div className="name">زعيم الحي</div><div className="bar"><i style={{width:(enemyHp/m.hp*100)+"%"}}/></div><span>{enemyHp}/{m.hp}</span></div><div className="vs">VS</div><div className="fighter"><div className="avatar">🕶️</div><div className="name">زعيمك</div><div className="bar"><i style={{width:hp+"%"}}/></div><span>{hp}/100</span></div></section>
<div className="energy"><span>الطاقة</span><div className="energybar"><i style={{width:energy*10+"%"}}/></div><b>{energy}/10</b></div>
<section className="cards">{cards.map(c=><button className="card" key={c.name} disabled={!battle||energy<c.cost} onClick={()=>play(c)}><div className="cardicon">{c.icon}</div><div className="cardbody"><b>{c.name}</b><small>{c.text}</small><em>⚡ {c.cost} — {c.damage?c.damage+" ضرر":"حماية"}</em></div></button>)}</section>
<div className="log">{battle?"اختر بطاقة لتنفيذ دورك":enemyHp===0?"انتصرت وحصلت على المكافأة":"خسرت المعركة"}</div>{!battle&&<button className="restart" onClick={()=>start(mission)}>إعادة المهمة</button>}</>}
<nav className="dock"><button onClick={()=>setTab("battle")}>🏠<small>الرئيسية</small></button><button onClick={()=>setTab("missions")}>🕶️<small>المهام</small></button><button onClick={()=>setTab("shop")}>🛒<small>التسوق</small></button><button onClick={()=>setTab("training")}>🏋️<small>التدريب</small></button><button onClick={()=>setTab("training")}>👤<small>شخصيتي</small></button></nav>
</main>}