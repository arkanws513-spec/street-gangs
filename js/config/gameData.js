var CITIES={
 main:{id:'main',name:'المدينة الرئيسية',emoji:'🏙️',color:0xd4af37,accent:'#d4af37'},
 cairo:{id:'cairo',name:'القاهرة',emoji:'🇪🇬',color:0xe67e22,accent:'#e67e22'},
 riyadh:{id:'riyadh',name:'الرياض',emoji:'🇸🇦',color:0x2ecc71,accent:'#2ecc71'},
 dubai:{id:'dubai',name:'دبي',emoji:'🇦🇪',color:0x3498db,accent:'#3498db'},
 paris:{id:'paris',name:'باريس',emoji:'🇫🇷',color:0x9b59b6,accent:'#9b59b6'},
 shanghai:{id:'shanghai',name:'شنغهاي',emoji:'🇨🇳',color:0xe74c3c,accent:'#e74c3c'}
};
var CITY_DESTINATIONS={
 main:[
  {id:'shop',name:'مركز التسوق',emoji:'🛍️',desc:'تجارة ومستلزمات',kind:'shop'},
  {id:'blackmarket',name:'السوق السوداء',emoji:'🌑',desc:'مهمات وطلبات اللاعبين',kind:'blackmarket'},
  {id:'training',name:'مركز التدريب',emoji:'🏋️',desc:'القوة والسرعة والدفاع والدقة',kind:'training'},
  {id:'underworld',name:'العالم السفلي',emoji:'🌒',desc:'قريبًا',kind:'locked',status:'قريبًا'},
  {id:'palace',name:'قصر مركز المدينة',emoji:'🏛️',desc:'غير متاح الآن',kind:'palace',status:'غير متاح الآن'},
  {id:'hospital',name:'المستشفى',emoji:'🏥',desc:'العلاج بعد الهزيمة',kind:'hospital'},
  {id:'prison',name:'السجن',emoji:'🔒',desc:'نتيجة فشل المهمات',kind:'prison'},
  {id:'airport',name:'المطار',emoji:'✈️',desc:'السفر بين المدن',kind:'airport'},
  {id:'profile',name:'ملف العصابة',emoji:'🪪',desc:'المستوى والسمعة والإحصائيات',kind:'profile'},
  {id:'map',name:'خريطة العالم',emoji:'🗺️',desc:'استكشف المدن والوجهات',kind:'map'}
 ],
 city:[
  {id:'shop',name:'مركز التسوق',emoji:'🛍️',desc:'منتجات خاصة بهذه المدينة',kind:'shop'},
  {id:'arena',name:'الحلبة',emoji:'⚔️',desc:'خصم أقوى بعد كل انتصار',kind:'arena'},
  {id:'hospital',name:'المستشفى',emoji:'🏥',desc:'العلاج بعد الهزيمة',kind:'hospital'},
  {id:'prison',name:'السجن',emoji:'🔒',desc:'نتيجة فشل المهمات',kind:'prison'},
  {id:'airport',name:'المطار',emoji:'✈️',desc:'السفر بين المدن',kind:'airport'},
  {id:'palace',name:'قصر '+ 'المدينة',emoji:'🏰',desc:'غير متاح الآن',kind:'palace',status:'غير متاح الآن'}
 ]
};
var CITY_PRODUCTS={
 main:[{name:'عدة تجارة',price:180,icon:'📦'},{name:'معدات ميدانية',price:320,icon:'🧰'},{name:'ملابس مميزة',price:450,icon:'🧥'},{name:'إكسسوارات',price:260,icon:'⌚'}],
 cairo:[{name:'بضائع القاهرة',price:220,icon:'📦'},{name:'ملابس محلية',price:380,icon:'👕'},{name:'أدوات سباق',price:520,icon:'🏁'},{name:'إكسسوارات نادرة',price:700,icon:'💎'}],
 riyadh:[{name:'بضائع الرياض',price:260,icon:'📦'},{name:'أزياء فاخرة',price:620,icon:'🧥'},{name:'معدات سفر',price:410,icon:'🧳'},{name:'قطعة نادرة',price:900,icon:'💠'}],
 dubai:[{name:'بضائع دبي',price:300,icon:'📦'},{name:'إكسسوارات فاخرة',price:780,icon:'⌚'},{name:'معدات تجارية',price:560,icon:'🧰'},{name:'مقتنى نادر',price:1200,icon:'💎'}],
 paris:[{name:'بضائع باريس',price:340,icon:'📦'},{name:'أزياء باريسية',price:680,icon:'👔'},{name:'قطعة فنية',price:950,icon:'🖼️'},{name:'إكسسوار نادر',price:1100,icon:'💎'}],
 shanghai:[{name:'بضائع شنغهاي',price:280,icon:'📦'},{name:'معدات إلكترونية',price:720,icon:'📱'},{name:'منتج تجاري',price:500,icon:'🧰'},{name:'قطعة محدودة',price:1300,icon:'💠'}]
};
var MISSIONS=[
 {id:'m1',name:'تسليم شحنة',type:'عامة',difficulty:'سهلة',power:20,energy:8,xp:35,reward:280},
 {id:'m2',name:'استرداد غرض',type:'خاصة',difficulty:'متوسطة',power:45,energy:15,xp:70,reward:650},
 {id:'m3',name:'مهمة عالية المخاطر',type:'عامة',difficulty:'صعبة',power:85,energy:25,xp:120,reward:1400},
 {id:'m4',name:'عملية شحنة سرية',type:'خاصة',difficulty:'صعبة جدًا',power:140,energy:38,xp:190,reward:2600}
];
var ARENA_BASE=75;
var GAME_CONFIG={
 startingResources:{cash:2000,energy:100,maxEnergy:100,reputation:0},
 startingProgress:{level:1,xp:0,nextXp:100,stamina:5},
 startingStats:{strength:10,speed:10,defense:10,accuracy:10},
 energyRegenSeconds:30,saveKey:'street_gangs_pro_v3'
};