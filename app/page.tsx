"use client";

import { useEffect, useRef, useState } from "react";

type Tab = "battle" | "missions" | "training" | "shop";
type StatKey = "strength" | "defense" | "speed" | "accuracy";
type Card = {
  name: string;
  icon: string;
  cost: number;
  damage: number;
  text: string;
  type: "attack" | "guard" | "skill";
};

type Mission = {
  id: number;
  name: string;
  level: number;
  reward: number;
  xp: number;
  hp: number;
  power: string;
  enemyName: string;
};

const MAX_ENERGY = 10;
const SAVE_KEY = "street-gangs-save-v1";

const cards: Card[] = [
  { name: "هجوم سريع", icon: "🦋", cost: 1, damage: 9, text: "ضربة سريعة منخفضة التكلفة", type: "attack" },
  { name: "ضربة قوية", icon: "🔪", cost: 3, damage: 24, text: "ضرر كبير مقابل طاقة أعلى", type: "attack" },
  { name: "دفاع", icon: "🛡️", cost: 2, damage: 0, text: "يقلل ضرر الهجوم التالي", type: "guard" },
  { name: "تصويب", icon: "🎯", cost: 2, damage: 14, text: "هجوم دقيق يزيد تقييمه", type: "skill" },
];

const missions: Mission[] = [
  { id: 1, name: "صفقة في الحي القديم", level: 1, reward: 120, xp: 45, hp: 100, power: "ضعيف", enemyName: "زعيم الحي" },
  { id: 2, name: "تحصيل دين", level: 2, reward: 220, xp: 80, hp: 125, power: "متوسط", enemyName: "رجل الخطة" },
  { id: 3, name: "مواجهة العصابة المنافسة", level: 3, reward: 400, xp: 140, hp: 165, power: "قوي", enemyName: "قائد العصابة" },
  { id: 4, name: "الاحتكار الليلي", level: 4, reward: 560, xp: 210, hp: 210, power: "قوي جدا", enemyName: "العميل السري" },
];

const statLabels: Record<StatKey, string> = {
  strength: "القوة",
  defense: "الدفاع",
  speed: "السرعة",
  accuracy: "الدقة",
};

const defaultStats: Record<StatKey, number> = {
  strength: 10,
  defense: 10,
  speed: 10,
  accuracy: 10,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getXpRequired(level: number) {
  return Math.max(100, level * 100);
}

function getLevelFromXp(xp: number) {
  let level = 1;
  let remaining = xp;

  while (remaining >= getXpRequired(level)) {
    remaining -= getXpRequired(level);
    level += 1;
  }

  return level;
}

export default function Home() {
  const [tab, setTab] = useState<Tab>("battle");
  const [missionIndex, setMissionIndex] = useState(0);
  const [energy, setEnergy] = useState(MAX_ENERGY);
  const [coins, setCoins] = useState(250);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [stats, setStats] = useState(defaultStats);
  const [playerHp, setPlayerHp] = useState(100);
  const [enemyHp, setEnemyHp] = useState(missions[0].hp);
  const [battle, setBattle] = useState(true);
  const [guard, setGuard] = useState(false);
  const [message, setMessage] = useState("اختر بطاقة لتنفيذ الدور واستكمال المهمة.");
  const [soundOn, setSoundOn] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);

  const selectedMission = missions[missionIndex];
  const maxPlayerHp = 100 + stats.defense * 2;

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SAVE_KEY);
      if (!raw) return;

      const saved = JSON.parse(raw) as {
        energy?: number;
        coins?: number;
        xp?: number;
        level?: number;
        stats?: Record<StatKey, number>;
        missionIndex?: number;
        playerHp?: number;
        enemyHp?: number;
        battle?: boolean;
        guard?: boolean;
        tab?: Tab;
      };

      if (saved.energy !== undefined) setEnergy(saved.energy);
      if (saved.coins !== undefined) setCoins(saved.coins);
      if (saved.xp !== undefined) setXp(saved.xp);
      if (saved.level !== undefined) setLevel(saved.level);
      if (saved.stats) setStats({ ...defaultStats, ...saved.stats });
      if (saved.missionIndex !== undefined) setMissionIndex(saved.missionIndex);
      if (saved.playerHp !== undefined) setPlayerHp(saved.playerHp);
      if (saved.enemyHp !== undefined) setEnemyHp(saved.enemyHp);
      if (saved.battle !== undefined) setBattle(saved.battle);
      if (saved.guard !== undefined) setGuard(saved.guard);
      if (saved.tab) setTab(saved.tab);
    } catch {
      // Ignore invalid saved state gracefully.
    }
  }, []);

  useEffect(() => {
    const save = {
      energy,
      coins,
      xp,
      level,
      stats,
      missionIndex,
      playerHp,
      enemyHp,
      battle,
      guard,
      tab,
    };

    try {
      window.localStorage.setItem(SAVE_KEY, JSON.stringify(save));
    } catch {
      // Ignore storage exceptions gracefully.
    }
  }, [energy, coins, xp, level, stats, missionIndex, playerHp, enemyHp, battle, guard, tab]);

  function ensureAudio() {
    if (!soundOn || typeof window === "undefined") return null;

    if (!audioContextRef.current) {
      const AudioCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtor) return null;
      audioContextRef.current = new AudioCtor();
    }

    if (audioContextRef.current.state === "suspended") {
      void audioContextRef.current.resume();
    }

    return audioContextRef.current;
  }

  function playTone(frequency: number, duration: number, volume: number, type: OscillatorType = "sine") {
    const ctx = ensureAudio();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.value = volume;

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + duration);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  }

  function triggerSound(kind: "attack" | "guard" | "win" | "lose" | "train" | "error") {
    if (!soundOn) return;

    switch (kind) {
      case "attack":
        playTone(220, 0.08, 0.035, "square");
        break;
      case "guard":
        playTone(140, 0.12, 0.025, "triangle");
        break;
      case "win":
        playTone(440, 0.1, 0.045, "triangle");
        setTimeout(() => playTone(660, 0.1, 0.045, "triangle"), 110);
        break;
      case "lose":
        playTone(180, 0.18, 0.04, "sawtooth");
        break;
      case "train":
        playTone(320, 0.08, 0.03, "triangle");
        setTimeout(() => playTone(480, 0.08, 0.03, "triangle"), 80);
        break;
      case "error":
        playTone(90, 0.12, 0.03, "sawtooth");
        break;
      default:
        break;
    }
  }

  function startMission(index: number) {
    const mission = missions[index];
    const baseHp = 100 + stats.defense * 2;

    setMissionIndex(index);
    setBattle(true);
    setGuard(false);
    setEnemyHp(mission.hp);
    setPlayerHp(baseHp);
    setEnergy(MAX_ENERGY);
    setMessage(`تمت تهيئة المهمة: ${mission.name}. اختر بطاقة للبدء.`);
    triggerSound("attack");
  }

  function rest() {
    const recovered = clamp(energy + 3, 0, MAX_ENERGY);
    const healed = clamp(playerHp + 12, 0, maxPlayerHp);

    setEnergy(recovered);
    setPlayerHp(healed);
    setMessage("استراحة قصيرة أعادت الطاقة والحيوية.");
    triggerSound("guard");
  }

  function attackEnemy() {
    if (!battle) {
      setMessage("المعركة انتهت بالفعل، اختر مهمة جديدة.");
      return;
    }

    const nextMission = missions[missionIndex];
    const attackBonus = stats.strength + Math.floor(stats.accuracy / 2) + (stats.speed >= 12 ? 3 : 0);
    const rawDamage = Math.max(5, 8 + attackBonus + Math.floor(Math.random() * 10));

    const targetHp = Math.max(0, enemyHp - rawDamage);
    setEnemyHp(targetHp);
    setMessage(`ضربت ${nextMission.enemyName} بـ ${rawDamage} نقطة ضرر.`);
    triggerSound("attack");

    if (targetHp <= 0) {
      const newCoins = coins + nextMission.reward;
      const newXp = xp + nextMission.xp;
      const nextLevel = getLevelFromXp(newXp);
      const bonus = nextLevel > level ? " مستوى جديد! " : "";

      setCoins(newCoins);
      setXp(newXp);
      setLevel(nextLevel);
      setBattle(false);
      setMessage(`انتصرت! حصلت على ${nextMission.reward} عملة و${nextMission.xp} XP${bonus}`);
      triggerSound("win");
      return;
    }

    const counterDamage = Math.max(4, Math.floor(nextMission.hp / 12) + Math.floor(Math.random() * 7) + (nextMission.level * 2));
    const reducedDamage = guard ? Math.max(1, counterDamage - 5 - Math.floor(stats.defense / 4)) : counterDamage;
    const afterDamage = Math.max(0, playerHp - reducedDamage);

    setGuard(false);
    setPlayerHp(afterDamage);
    setMessage(`الخصم رد عليك بـ ${reducedDamage} نقطة ضرر.`);

    if (afterDamage <= 0) {
      setBattle(false);
      setMessage("تم إيقافك في المعركة. جرّب تكتيكاً مختلفاً.");
      triggerSound("lose");
    }
  }

  function playCard(card: Card) {
    if (!battle) {
      setMessage("المعركة انتهت، اختر مهمة جديدة للعودة إلى المعركة.");
      return;
    }

    if (energy < card.cost) {
      setMessage("طاقة غير كافية. استخدم استراحة أو اختر بطاقة أرخص.");
      triggerSound("error");
      return;
    }

    const nextEnergy = clamp(energy - card.cost, 0, MAX_ENERGY);
    setEnergy(nextEnergy);

    if (card.type === "guard") {
      setGuard(true);
      setMessage("تمت حماية الشخصية. سيقلل الضرر القادم.");
      triggerSound("guard");
      return;
    }

    const attackPower = card.damage + Math.floor(stats.strength / 3) + (card.name.includes("تصويب") ? Math.floor(stats.accuracy / 4) : 0);
    const newEnemyHpValue = Math.max(0, enemyHp - attackPower);
    setEnemyHp(newEnemyHpValue);
    setMessage(`${card.name} تسبب بـ ${attackPower} ضرر.`);
    triggerSound("attack");

    if (newEnemyHpValue <= 0) {
      const currentMission = missions[missionIndex];
      const nextCoinTotal = coins + currentMission.reward;
      const nextXpTotal = xp + currentMission.xp;
      const nextLevelValue = getLevelFromXp(nextXpTotal);

      setCoins(nextCoinTotal);
      setXp(nextXpTotal);
      setLevel(nextLevelValue);
      setBattle(false);
      setMessage(`انتصرت! حصلت على ${currentMission.reward} عملة و${currentMission.xp} XP.`);
      triggerSound("win");
      return;
    }

    const enemyDamage = Math.max(3, Math.floor(selectedMission.hp / 14) + Math.floor(Math.random() * 8) + (selectedMission.level * 2));
    const defenseReduction = guard ? 7 + Math.floor(stats.defense / 4) : Math.floor(stats.defense / 5);
    const actualDamage = Math.max(1, enemyDamage - defenseReduction);
    const nextPlayerHp = Math.max(0, playerHp - actualDamage);

    setGuard(false);
    setPlayerHp(nextPlayerHp);
    setMessage(`الخصم رد عليك بـ ${actualDamage} نقطة ضرر.`);

    if (nextPlayerHp <= 0) {
      setBattle(false);
      setMessage("خسرت الجولة. حاول تحسين الإحصائيات أو استعد بشكل أفضل.");
      triggerSound("lose");
    }
  }

  function trainStat(stat: StatKey) {
    const cost = 50;

    if (coins < cost) {
      setMessage("لا توجد نقود كافية للتدريب الآن.");
      triggerSound("error");
      return;
    }

    setCoins((current) => current - cost);
    setStats((current) => ({
      ...current,
      [stat]: current[stat] + 1,
    }));
    setMessage(`${statLabels[stat]} زادت بمقدار 1.`);
    triggerSound("train");

    if (stat === "defense") {
      setPlayerHp((current) => Math.min(maxPlayerHp, current + 6));
    }
  }

  function resetProgress() {
    setCoins(250);
    setXp(0);
    setLevel(1);
    setStats(defaultStats);
    setEnergy(MAX_ENERGY);
    setPlayerHp(100);
    setEnemyHp(missions[0].hp);
    setBattle(true);
    setGuard(false);
    setMissionIndex(0);
    setTab("battle");
    setMessage("تمت إعادة تعيين التقدم. مستعد للعودة إلى المعركة.");
    triggerSound("guard");
  }

  return (
    <main className="shell">
      <header className="topbar">
        <div>
          <div className="brand">وكر الأوغاد</div>
          <div className="sub">النسخة التجريبية — الحلقة الأساسية</div>
        </div>

        <div className="stats-display">
          <div className="stat-item">
            <span className="stat-value">{level}</span>
            <span className="stat-label">المستوى</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{coins}</span>
            <span className="stat-label">العملات</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{xp}</span>
            <span className="stat-label">XP</span>
          </div>
        </div>
      </header>

      {tab === "battle" && (
        <section className="panel">
          <div className="hero">
            <div>
              <span className="tag">مهمة مستوى {selectedMission.level}</span>
              <h1>{selectedMission.name}</h1>
              <p>واجه الخصم بحكمة واحتفظ بالهجوم في الوقت المناسب.</p>
            </div>
            <button className="btn-small" onClick={() => startMission(missionIndex)}>
              إعادة تهيئة المهمة
            </button>
          </div>

          <div className="battle">
            <div className="fighter">
              <div className="avatar">🥷</div>
              <div className="name">زعيم الحي</div>
              <div className="bar">
                <i style={{ width: `${(playerHp / maxPlayerHp) * 100}%` }} />
                <b>{playerHp}/{maxPlayerHp}</b>
              </div>
            </div>

            <div className="fighter">
              <div className="avatar">💀</div>
              <div className="name">{selectedMission.enemyName}</div>
              <div className="bar enemy-bar">
                <i style={{ width: `${(enemyHp / selectedMission.hp) * 100}%` }} />
                <b>{enemyHp}/{selectedMission.hp}</b>
              </div>
            </div>
          </div>

          <div className="energy">
            <span>الطاقة</span>
            <div className="energybar">
              <i style={{ width: `${(energy / MAX_ENERGY) * 100}%` }} />
            </div>
            <b>{energy}/{MAX_ENERGY}</b>
          </div>

          <div className="cards">
            {cards.map((card) => (
              <button
                key={card.name}
                className="card"
                disabled={!battle || energy < card.cost}
                onClick={() => playCard(card)}
                title={card.text}
              >
                <div className="cardicon">{card.icon}</div>
                <div className="cardbody">
                  <div className="cardname">{card.name}</div>
                  <div className="cardstats">
                    <span className="cardstat cost">⚡ {card.cost}</span>
                    <span className="cardstat damage">💥 {card.damage}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="log">{message}</div>

          <div className="action-row">
            <button className="btn-small" onClick={rest}>استراحة (+3 طاقة)</button>
            <button className="btn-small" onClick={() => setTab("missions")}>قائمة المهام</button>
          </div>
        </section>
      )}

      {tab === "missions" && (
        <section className="panel">
          <h1>المهام</h1>
          <p>اختر المهمة المناسبة لمستوى اللاعب الحالي. كل فوز يمنح عملة وتجربة.</p>
          {missions.map((mission, index) => (
            <button
              key={mission.id}
              className="mission"
              onClick={() => {
                startMission(index);
                setTab("battle");
              }}
            >
              <div className="mission-info">
                <div className="mission-name">{mission.name}</div>
                <div className="mission-difficulty">مستوى {mission.level} • {mission.power}</div>
              </div>
              <div className="mission-rewards">
                <div className="reward-item">
                  <span className="reward-value">{mission.reward}</span>
                  <span className="reward-label">عملة</span>
                </div>
                <div className="reward-item">
                  <span className="reward-value">{mission.xp}</span>
                  <span className="reward-label">XP</span>
                </div>
              </div>
            </button>
          ))}
        </section>
      )}

      {tab === "training" && (
        <section className="panel">
          <h1>مركز التدريب</h1>
          <p>كل تطوير يكلف 50 عملة ويساعدك على تحسين التوازن في المعارك.</p>

          <div className="training-grid">
            {(Object.keys(statLabels) as StatKey[]).map((stat) => (
              <button
                key={stat}
                className="training-card"
                onClick={() => trainStat(stat)}
                disabled={coins < 50}
              >
                <div className="training-icon">{stat === "strength" ? "💪" : stat === "defense" ? "🛡️" : stat === "speed" ? "⚡" : "🎯"}</div>
                <div className="training-label">{statLabels[stat]}</div>
                <div className="training-stat">{stats[stat]}</div>
                <div className="training-cost">50 عملة</div>
              </button>
            ))}
          </div>
        </section>
      )}

      {tab === "shop" && (
        <section className="panel">
          <h1>المتجر</h1>
          <div className="locked">
            🛒 متجر الأسلحة والملابس
            <small>سيتم تفعيل نظام المعدات في النسخة التالية.</small>
          </div>
        </section>
      )}

      <nav className="dock">
        <button onClick={() => setTab("battle")}>🏠<small>الرئيسية</small></button>
        <button onClick={() => setTab("missions")}>🕶️<small>المهام</small></button>
        <button onClick={() => setTab("training")}>🏋️<small>تدريب</small></button>
        <button onClick={() => setTab("shop")}>🛒<small>متجر</small></button>
        <button onClick={() => setSoundOn((current) => !current)}>{soundOn ? "🔊" : "🔇"}<small>{soundOn ? "صوت" : "كتم"}</small></button>
      </nav>

      <div className="floating-reset">
        <button className="reset-button" onClick={resetProgress}>إعادة التهيئة</button>
      </div>
    </main>
  );
}
































































































































































































