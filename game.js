const KEY = "street-gangs-save-v4";

let state = JSON.parse(localStorage.getItem(KEY) || "null") || {
  cash: 1000,
  energy: 100,
  respect: 10,
  level: 1,
  xp: 0,
  done: 0,
  stamina: 4,
  city: "وسط المدينة",
  stats: { power: 5, defense: 5, speed: 5, accuracy: 5 },
  inv: {}
};

const $ = id => document.getElementById(id);

function save() {
  localStorage.setItem(KEY, JSON.stringify(state));
  render();
}

function render() {
  if ($("cash")) $("cash").textContent = state.cash;
  if ($("energy")) $("energy").textContent = state.energy;
  if ($("respect")) $("respect").textContent = state.respect;
  if ($("level")) $("level").textContent = state.level;
  if ($("done")) $("done").textContent = state.done;
}

function openPanel(title, html) {
  $("content").innerHTML = "<h2>" + title + "</h2>" + html;
  $("screen").style.display = "flex";
}

function closePanel() {
  $("screen").style.display = "none";
}

function missions() {
  const list = [
    ["📦", "توصيل شحنة", "سهلة", 80, 20],
    ["🏁", "سباق الشوارع", "متوسطة", 140, 35],
    ["🏙️", "توسيع النفوذ", "صعبة", 250, 55],
    ["🤝", "اتفاق مع حي جديد", "خبيرة", 400, 80]
  ];

  openPanel("المهمات",
    "<p class='sub'>اختر مهمة ثم نفذها لتحصل على المال والخبرة.</p>" +
    "<div class='card'><div class='badge'>🏆</div><div><b>التقدم</b><small>" +
    state.done + " مهمة مكتملة</small></div><strong>" + state.done + "</strong></div>" +
    list.map((m, i) =>
      "<div class='card'>" +
      "<div class='badge'>" + m[0] + "</div>" +
      "<div><b>" + m[1] + "</b><small>الصعوبة: " + m[2] +
      " • 💵 " + m[3] + " • ⭐ " + m[4] + " XP</small></div>" +
      "<button class='btn' onclick='doMission(" + i + ")'>ابدأ</button></div>"
    ).join("")
  );
}

function doMission(i) {
  const missionsList = [
    ["توصيل شحنة", 80, 20],
    ["سباق الشوارع", 140, 35],
    ["توسيع النفوذ", 250, 55],
    ["اتفاق مع حي جديد", 400, 80]
  ];
  const m = missionsList[i];

  if (state.energy < 15) {
    openPanel("المهمات", "<p class='negative'>⚡ تحتاج إلى 15 طاقة على الأقل.</p><button class='btn' onclick='missions()'>عودة</button>");
    return;
  }

  state.energy -= 15;
  state.cash += m[1];
  state.xp += m[2];
  state.done += 1;
  state.respect += 1;

  while (state.xp >= state.level * 100) {
    state.xp -= state.level * 100;
    state.level += 1;
    state.stamina += 4;
  }

  save();

  openPanel("تم إنجاز المهمة",
    "<div class='card'><div class='badge'>✓</div><div><b>" + m[0] +
    "</b><small>تم الإنجاز بنجاح.</small></div></div>" +
    "<p class='positive'>💵 +" + m[1] + " جنيه</p>" +
    "<p class='positive'>⭐ +" + m[2] + " XP</p>" +
    "<p class='positive'>🏆 +1 مهمة</p>" +
    "<button class='btn' onclick='missions()'>العودة للمهمات</button>"
  );
}

function training() {
  const skills = [
    ["power", "💪 القوة"],
    ["defense", "🛡️ الدفاع"],
    ["speed", "🏃 السرعة"],
    ["accuracy", "🎯 الدقة"]
  ];

  openPanel("الصالة الرياضية",
    "<p class='sub'>نقاط التدريب المتاحة: <b>" + state.stamina +
    "</b></p>" +
    skills.map(s =>
      "<div class='row'><div><b>" + s[1] +
      "</b><small>المستوى الحالي: " + state.stats[s[0]] +
      "</small></div><button class='btn' onclick="train('" + s[0] + "')">+1</button></div>"
    ).join("")
  );
}

function train(key) {
  if (state.stamina < 1) {
    openPanel("الصالة الرياضية", "<p class='negative'>🏋️ لا توجد نقاط تدريب كافية. أكمل المهمات وارفع مستواك.</p><button class='btn' onclick='training()'>عودة</button>");
    return;
  }
  state.stamina--;
  state.stats[key]++;
  save();
  training();
}

function market() {
  const items = [
    ["🦺", "سترة حماية", "دفاع +2", 180, "defense"],
    ["👟", "حذاء رياضي", "سرعة +2", 200, "speed"],
    ["🥊", "معدات تدريب", "قوة +2", 220, "power"],
    ["🎯", "معدات تركيز", "دقة +2", 240, "accuracy"]
  ];

  openPanel("التسوق",
    "<p class='sub'>معدات لتطوير إحصائيات شخصيتك.</p>" +
    items.map((x, i) =>
      "<div class='item'><span style='font-size:26px'>" + x[0] +
      "</span><div><b>" + x[1] + "</b><small>" + x[2] +
      " • " + x[3] + " 💵</small></div><button class='btn' onclick='buyItem(" +
      i + ")'>شراء</button></div>"
    ).join("")
  );
}

function buyItem(i) {
  const items = [
    ["🦺", "سترة حماية", "دفاع +2", 180, "defense"],
    ["👟", "حذاء رياضي", "سرعة +2", 200, "speed"],
    ["🥊", "معدات تدريب", "قوة +2", 220, "power"],
    ["🎯", "معدات تركيز", "دقة +2", 240, "accuracy"]
  ];
  const x = items[i];
  if (state.cash < x[3]) {
    openPanel("التسوق", "<p class='negative'>💵 المال غير كافٍ.</p><button class='btn' onclick='market()'>عودة</button>");
    return;
  }
  state.cash -= x[3];
  state.stats[x[4]] += 2;
  save();
  market();
}

function trade() {
  const goods = [
    ["🪵", "خشب", 60],
    ["🌾", "قمح", 45],
    ["🍎", "فواكه", 70],
    ["🧱", "مواد بناء", 100]
  ];

  openPanel("التجارة",
    "<p class='sub'>المدينة الحالية: <b>" + state.city +
    "</b></p><div class='travel'>" +
    "<button onclick='travelTo("وسط المدينة")'>وسط المدينة</button>" +
    "<button onclick='travelTo("مدينة الميناء")'>الميناء</button>" +
    "<button onclick='travelTo("المدينة الصناعية")'>الصناعة</button></div>" +
    goods.map((g, i) =>
      "<div class='item'><div><b>" + g[0] + " " + g[1] +
      "</b><small>السعر: " + g[2] + " 💵 • الكمية: " +
      (state.inv[g[1]] || 0) +
      "</small></div><button class='btn' onclick='buyGood(" + i +
      ")'>شراء</button><button class='btn' onclick='sellGood(" + i +
      ")'>بيع</button></div>"
    ).join("")
  );
}

function travelTo(city) {
  state.city = city;
  save();
  trade();
}

function buyGood(i) {
  const goods = [["خشب", 60], ["قمح", 45], ["فواكه", 70], ["مواد بناء", 100]];
  const g = goods[i];
  if (state.cash < g[1]) return;
  state.cash -= g[1];
  state.inv[g[0]] = (state.inv[g[0]] || 0) + 1;
  save();
  trade();
}

function sellGood(i) {
  const goods = [["خشب", 60], ["قمح", 45], ["فواكه", 70], ["مواد بناء", 100]];
  const g = goods[i];
  if (!state.inv[g[0]]) return;
  state.inv[g[0]]--;
  state.cash += g[1];
  save();
  trade();
}

function base() {
  openPanel("مقر العصابة",
    "<p class='sub'>هنا تتابع تقدم العصابة.</p>" +
    "<div class='stat'><b>🏢 المستوى " + state.level +
    "</b><small>المدينة: " + state.city + "</small></div>" +
    "<div class='stat'><b>🏆 المهمات</b><small>" + state.done +
    " مهمة مكتملة</small></div>" +
    "<div class='stat'><b>⭐ الاحترام</b><small>" + state.respect +
    "</small></div>"
  );
}

function profile() {
  openPanel("ملفي",
    "<p class='sub'>إحصاءات شخصيتك.</p><div class='statgrid'>" +
    Object.entries({
      "💪 القوة": state.stats.power,
      "🛡️ الدفاع": state.stats.defense,
      "🏃 السرعة": state.stats.speed,
      "🎯 الدقة": state.stats.accuracy
    }).map(x =>
      "<div class='stat'><b>" + x[0] +
      "</b><small>" + x[1] + "</small></div>"
    ).join("") + "</div>"
  );
}

function openSection(name) {
  if (name === "missions") missions();
  if (name === "training") training();
  if (name === "market") market();
  if (name === "trade") trade();
  if (name === "base") base();
  if (name === "profile") profile();
}

document.addEventListener("DOMContentLoaded", function() {
  document.querySelectorAll("[data-a]").forEach(function(button) {
    button.addEventListener("click", function() {
      openSection(button.getAttribute("data-a"));
    });
  });

  $("close").addEventListener("click", closePanel);
  $("screen").addEventListener("click", function(e) {
    if (e.target === $("screen")) closePanel();
  });

  render();
});