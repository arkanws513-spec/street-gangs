(()=>{let renderer,scene,camera,raycaster,mouse;const targets=[];const focus=new THREE.Vector3(0,0,0);let dragging=false,moved=false,lastX=0,lastY=0,zoom=30,velX=0,velZ=0,lastT=0;
const mat=(c,r=.75,m=0)=>new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:m});
const mesh=(geo,p,c,r=.75,m=0)=>{const o=new THREE.Mesh(geo,mat(c,r,m));o.position.set(...p);o.castShadow=o.receiveShadow=true;return o};
function box(s,p,c,r=.75,m=0){return mesh(new THREE.BoxGeometry(...s),p,c,r,m)}
function cyl(rad,h,p,c,seg=12){return mesh(new THREE.CylinderGeometry(rad,rad,h,seg),p,c)}
function textSprite(txt,sub,color=0x1b8fbd){const cv=document.createElement("canvas");cv.width=700;cv.height=170;const x=cv.getContext("2d");x.clearRect(0,0,700,170);x.fillStyle="rgba(3,13,19,.92)";x.beginPath();x.roundRect(12,18,676,132,18);x.fill();x.strokeStyle="#8bd4e8";x.lineWidth=5;x.stroke();x.fillStyle="#eafcff";x.font="bold 44px Tahoma";x.textAlign="center";x.fillText(txt,350,73);x.fillStyle="#9bd8e7";x.font="bold 22px Tahoma";x.fillText(sub,350,112);const t=new THREE.CanvasTexture(cv);t.colorSpace=THREE.SRGBColorSpace;const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthTest:false}));s.scale.set(5.7,1.38,1);return s}
function building(name,action,x,z,w,h,d,base,accent,sub){const g=new THREE.Group();g.position.set(x,0,z);g.userData={action,name};g.add(box([w+.9,.35,d+.9],[0,.18,0],0x222a2d));g.add(box([w,.35,d],[0,.38,0],accent));g.add(box([w,h,d],[0,h/2+.42,0],base));
for(let y=1.2;y<h;y+=1.15){g.add(box([w+.16,.12,d+.16],[0,y+.42,0],accent));}
for(let xx=-w/2+1;xx<w/2;xx+=1.25){for(let y=1.05;y<h-.25;y+=1.2){g.add(box([.52,.48,.06],[xx,y+.42,d/2+.035],0x8ed4df,.25,.1));}}
const roof=mesh(new THREE.CylinderGeometry(Math.min(w,d)*.72,Math.min(w,d)*.82,.42,4),[0,h+.7,0],accent);roof.rotation.y=Math.PI/4;g.add(roof);
const door=box([1.2,1.9,.12],[0,1.32,d/2+.08],0x16262c,.25,.15);g.add(door);
const sign=textSprite(name,sub);sign.position.set(0,h+3.0,0);g.add(sign);
targets.push(g);scene.add(g);return g}
function palm(x,z){const g=new THREE.Group();g.position.set(x,0,z);g.add(cyl(.16,2.5,[0,1.25,0],0x68462f,8));const crown=new THREE.Group();for(let i=0;i<7;i++){const leaf=box([.12,.12,2.2],[0,0,1.0],0x286b48);leaf.rotation.y=i*Math.PI*2/7;leaf.rotation.x=.55;leaf.position.y=2.5;crown.add(leaf)}g.add(crown);scene.add(g)}
function tree(x,z){const g=new THREE.Group();g.position.set(x,0,z);g.add(cyl(.18,1.5,[0,.75,0],0x5a3b29,8));g.add(mesh(new THREE.IcosahedronGeometry(.9,1),[0,1.9,0],0x2d6a43));scene.add(g)}
function car(x,z,r=0,c=0x3d93b6){const g=new THREE.Group();g.position.set(x,.38,z);g.rotation.y=r;g.add(box([2.2,.45,1.05],[0,0,0],c,.5,.15));g.add(box([1.1,.4,.85],[0,.38,0],0x263b43,.3,.1));for(const a of[-.75,.75])for(const b of[-.45,.45]){const w=cyl(.2,.16,[a,-.24,b],0x11161a,12);w.rotation.z=Math.PI/2;g.add(w)}scene.add(g)}
function road(x,z,w,d,r=0){const s=box([w,.12,d],[x,.03,z],0x292f33,.95);s.rotation.y=r;scene.add(s);const edge=box([w,.04,.09],[x,.11,-d*.38],0xb1b4a3);edge.rotation.y=r;scene.add(edge);const line=box([w*.96,.025,.11],[x,.11,0],0xd4bd55);line.rotation.y=r;scene.add(line)}
function lamp(x,z,r=0){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=r;g.add(box([.12,2.8,.12],[0,1.4,0],0x26383d));g.add(cyl(.23,.1,[0,2.85,0],0xf4df9a,12));scene.add(g)}
function init(){const c=document.getElementById("city3d");scene=new THREE.Scene();scene.background=new THREE.Color(0x789da6);scene.fog=new THREE.Fog(0x789da6,48,105);camera=new THREE.OrthographicCamera(-18,18,11,-11,.1,180);camera.position.set(28,28,28);camera.lookAt(focus);
renderer=new THREE.WebGLRenderer({canvas:c,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.setSize(c.clientWidth,c.clientHeight,false);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
raycaster=new THREE.Raycaster();mouse=new THREE.Vector2();
scene.add(new THREE.HemisphereLight(0xd7f1ff,0x273221,2.0));const sun=new THREE.DirectionalLight(0xffdfaa,3.1);sun.position.set(-25,45,18);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);scene.add(sun);
scene.add(box([100,.3,82],[0,-.22,0],0x687854));
road(0,0,95,8,0);road(0,0,8,82,0);road(0,-18,95,7,0);road(-25,0,7,82,0);road(25,0,7,82,0);
building("مركز المهمات","missions",-14,-10,7,4.6,6,0x394d56,0xd4aa4a,"معارك • عقود");
building("مركز التدريب","training",-2,-10,7,4.1,6,0x355a4c,0x65c79a,"قوة • دفاع • سرعة");
building("مركز التسوق","market",14,-10,8,4.8,7,0x42536a,0x58c5df,"معدات • تطويرات");
building("سوق التجارة","trade",-15,11,8,4.3,7,0x5b4736,0xe0b85d,"شراء • بيع • سفر");
building("مقر العصابة","base",0,11,9,5.4,8,0x473942,0xc96868,"المقر الرئيسي");
building("ملفي","profile",15,11,7,3.8,6,0x48565b,0xb9d3da,"الإحصاءات");
building("مركز المدينة","none",0,27,7,7.5,7,0x394a55,0x78a9b8,"منطقة مركزية");
for(const [x,z] of[[-31,-14],[-30,4],[-30,22],[-23,29],[-10,31],[10,31],[27,25],[31,8],[31,-10],[25,-27],[8,-28],[-10,-29]])palm(x,z);
for(const [x,z] of[[-21,-3],[21,-3],[-22,18],[22,18],[-9,22],[8,-21]])tree(x,z);
for(const [x,z,r] of[[-22,0,0],[10,0,0],[28,0,0],[-8,-18,0],[8,18,Math.PI],[-18,18,Math.PI]])car(x,z,r,0x3b91b4);
for(const [x,z] of[[-20,-4],[-7,-4],[7,-4],[20,-4],[-20,16],[-7,16],[7,16],[20,16]])lamp(x,z);
events(c);resize();applyCamera();animate()}
function resize(){const c=document.getElementById("city3d");const a=c.clientWidth/c.clientHeight;const v=18;camera.left=-v;camera.right=v;camera.top=v/a;camera.bottom=-v/a;camera.updateProjectionMatrix();renderer.setSize(c.clientWidth,c.clientHeight,false)}
function applyCamera(){const a=new THREE.Vector3(28,28,28).normalize().multiplyScalar(zoom);camera.position.copy(focus).add(a);camera.lookAt(focus)}
function clamp(){focus.x=Math.max(-32,Math.min(32,focus.x));focus.z=Math.max(-30,Math.min(30,focus.z))}
function updatePointer(c,e){
 const r=c.getBoundingClientRect();
 mouse.x=(e.clientX-r.left)/r.width*2-1;
 mouse.y=-(e.clientY-r.top)/r.height*2+1;
}
function events(c){
 c.style.touchAction="none";
 let dragStartX=0,dragStartY=0;
 let focusStart=new THREE.Vector3();
 let panScaleX=0,panScaleZ=0;
 c.addEventListener("pointerdown",e=>{
  updatePointer(c,e);
  dragging=true;moved=false;velX=velZ=0;
  dragStartX=e.clientX;dragStartY=e.clientY;
  focusStart.copy(focus);
  const r=c.getBoundingClientRect();
  const viewH=(camera.top-camera.bottom);
  const viewW=(camera.right-camera.left);
  panScaleX=viewW/r.width;
  panScaleZ=viewH/r.height;
  lastX=e.clientX;lastY=e.clientY;lastT=performance.now();
  c.setPointerCapture(e.pointerId);
 });
 c.addEventListener("pointermove",e=>{
  updatePointer(c,e);
  if(dragging){
   const now=performance.now(),dt=Math.max(8,now-lastT);
   const dx=e.clientX-dragStartX,dy=e.clientY-dragStartY;
   if(Math.abs(dx)+Math.abs(dy)>5)moved=true;
   /*
    * Pan is based directly on screen pixels.
    * The camera angle stays fixed, so both axes are mapped
    * through the camera's screen basis instead of world X/Z signs.
    */
   const right=new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,0);
   const up=new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,1);
   right.y=0;up.y=0;
   if(right.lengthSq()>0)right.normalize();
   if(up.lengthSq()>0)up.normalize();
   focus.copy(focusStart)
    .addScaledVector(right,-dx*panScaleX)
    .addScaledVector(up,-dy*panScaleZ);
   clamp();applyCamera();
   velX=(focus.x-focusStart.x)/(Math.max(1,now-lastT)/16.67);
   velZ=(focus.z-focusStart.z)/(Math.max(1,now-lastT)/16.67);
   lastX=e.clientX;lastY=e.clientY;lastT=now;
  }
  raycaster.setFromCamera(mouse,camera);
  const hits=raycaster.intersectObjects(targets,true);
  let g=hits.length?hits[0].object:null;
  while(g&&(!g.userData||!g.userData.name))g=g.parent;
  const h=document.getElementById("buildingHint");
  if(g&&g.userData.action!=="none"){
   h.textContent=g.userData.name+"  •  اضغط للدخول";h.classList.add("show");
  }else h.classList.remove("show");
 });
 c.addEventListener("pointerup",e=>{
  updatePointer(c,e);
  dragging=false;
  if(moved){velX=0;velZ=0;return}
  raycaster.setFromCamera(mouse,camera);
  const hits=raycaster.intersectObjects(targets,true);
  let g=hits.length?hits[0].object:null;
  while(g&&(!g.userData||!g.userData.action))g=g.parent;
  if(g&&g.userData.action!=="none"&&typeof act==="function")act(g.userData.action);
  velX=velZ=0;
 });
 c.addEventListener("pointercancel",()=>{dragging=false;moved=true;velX=velZ=0});
 c.addEventListener("wheel",e=>{
  zoom=Math.max(23,Math.min(43,zoom+e.deltaY*.018));
  applyCamera();e.preventDefault();
 },{passive:false});
 c.addEventListener("contextmenu",e=>e.preventDefault());
 window.addEventListener("resize",resize);
}

function animate(){requestAnimationFrame(animate);if(!dragging&&(Math.abs(velX)+Math.abs(velZ)>.002)){focus.x+=velX;focus.z+=velZ;velX*=.88;velZ*=.88;clamp();applyCamera()}renderer.render(scene,camera)}
window.addEventListener("load",init)})();