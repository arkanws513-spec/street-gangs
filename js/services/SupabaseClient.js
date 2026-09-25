(function(){
'use strict';
window.streetGangsBackend={connected:false,client:null};
window.addEventListener('load',async function(){
  if(!window.supabase||!window.supabase.createClient)return;
  try{
    var url='https://tkksjqduygnswlaebnji.supabase.co';
    var key='sb_publishable_XrycbMf6EAz_Jhzw6wKCFw_nhxBT1lM';
    window.streetGangsBackend.client=window.supabase.createClient(url,key);
    var r=await window.streetGangsBackend.client.from('cities').select('id,name_ar,country_ar,sort_order').order('sort_order');
    if(!r.error)window.streetGangsBackend.connected=true;
    console.log('[Street Gangs] Supabase:',window.streetGangsBackend.connected?'connected':'fallback');
  }catch(e){console.warn('[Street Gangs] Supabase unavailable; local save remains active.',e);}
});
})();