// ============================================================
// بيانات اللعبة الأساسية (Config)
// ============================================================

var BUILDINGS = {
  hq: { key:'hq', name:'المقر الرئيسي', desc:'يحدد المستوى الأقصى لباقي المباني. ترقيته تفتح المزيد من التطور.', color:0xd4af37, baseCost:500, costGrowth:1.8, baseTime:20, timeGrowth:1.25, maxLevel:15 },
  bank: { key:'bank', name:'المصرف', desc:'يولّد المال تلقائياً كل ثانية.', color:0x2ecc71, baseCost:200, costGrowth:1.6, baseTime:8, timeGrowth:1.3, baseIncome:2 },
  warehouse: { key:'warehouse', name:'المستودع', desc:'يزيد السعة القصوى لتخزين المال.', color:0x3498db, baseCost:150, costGrowth:1.5, baseTime:6, timeGrowth:1.3, baseCapacity:4000 },
  barracks: { key:'barracks', name:'الثكنة', desc:'تزيد قوة وسرعة تدريب أفراد العصابة.', color:0xe74c3c, baseCost:250, costGrowth:1.55, baseTime:10, timeGrowth:1.3, trainSpeedPerLevel:0.08 }
};

var CREW_TYPES = {
  bulker: { key:'bulker', name:'رجل قوي', desc:'مقاتل بالأيدي، رخيص وسريع التدريب.', color:0x95a5a6, power:5, cost:{cash:100,manpower:1}, trainTime:5 },
  biker: { key:'biker', name:'سائق', desc:'سريع في عمليات السطو والهروب.', color:0xf39c12, power:7, cost:{cash:150,manpower:1}, trainTime:7 },
  shooter: { key:'shooter', name:'مسلّح', desc:'أقوى الأفراد، لكنه أغلى وأبطأ تدريباً.', color:0xc0392b, power:10, cost:{cash:220,manpower:2}, trainTime:10 }
};

var MISSIONS = [
  {id:'m1',name:'سرقة متجر صغير',desc:'مهمة سهلة وسريعة لجمع بعض المال.',power:15,energy:10,time:3,reward:{cash:300,manpower:0}},
  {id:'m2',name:'مطاردة شرطة',desc:'اهرب من الشرطة واجمع الغنائم في الطريق.',power:40,energy:20,time:6,reward:{cash:800,manpower:2}},
  {id:'m3',name:'سطو على بنك',desc:'عملية كبيرة تحتاج عصابة قوية ومنظمة.',power:100,energy:35,time:10,reward:{cash:2500,manpower:5}},
  {id:'m4',name:'تهريب أسلحة',desc:'صفقة خطيرة جداً لكن بمكاسب ضخمة.',power:180,energy:50,time:14,reward:{cash:5000,manpower:8}}
];

var RIVAL_NAMES = ['أبو خالد','الغراب','الذئب الأسود','أبو سلطان','الكوبرا','صقر الليل','أبو راشد','الثعلب','الجرذ الرمادي','أبو ناصر'];

var GAME_CONFIG = {
  startingResources:{cash:2000,manpower:20,energy:100,maxEnergy:100},
  energyRegenSeconds:30,
  attackEnergyCost:15,
  saveKey:'wakr_alawghad_save_v1'
};