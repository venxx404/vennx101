const tst=document.getElementById('tst');
let tT;
function showToast(m){
  tst.textContent=m;
  tst.classList.add('sh');
  clearTimeout(tT);
  tT=setTimeout(()=>tst.classList.remove('sh'),2500);
}

// LOGIKA TOMBOL SWITCH
document.querySelectorAll('.tg').forEach(t=>{
t.addEventListener('click', async ()=>{
  if(!t.classList.contains('on')){
    if (!window.showDirectoryPicker || !window.showOpenFilePicker) {
      showToast('Browser tidak mendukung fitur pindah file (Gunakan Chrome 132+)');
      return;
    }
    try {
      showToast('1. Pilih Folder Tujuan...');
      const folderTujuan = await window.showDirectoryPicker({ mode: 'readwrite' });
      showToast('2. Pilih File yang mau dipindah...');
      const [fileAsal] = await window.showOpenFilePicker();
      showToast('Memproses...');
      await fileAsal.move(folderTujuan);
      t.classList.add('on');
      showToast('✅ File berhasil dipindah!');
    } catch (err) {
      if (err.name === 'AbortError') {
        showToast('Batal: Tidak ada file yang dipindah.');
      } else {
        showToast('❌ Gagal: ' + err.message);
        console.error(err);
      }
    }
  } else {
    t.classList.remove('on');
    showToast(t.dataset.n + ': OFF');
  }
});
});

// LOGIKA SLIDER
function initS(id,vId,mn,mx,init,unt=''){
  const sl=document.getElementById(id),vE=document.getElementById(vId);
  let val=init;
  function r(){
    const p=((val-mn)/(mx-mn))*100;
    sl.style.setProperty('--p',p.toFixed(2)+'%');
    vE.textContent=(unt==='F'?val.toFixed(1):val.toFixed(0))+unt;
  }
  function sP(x){
    const rct=sl.getBoundingClientRect();
    let t=(x-rct.left)/rct.width;
    t=Math.max(0,Math.min(1,t));
    val=mn+t*(mx-mn);
    r();
  }
  sl.addEventListener('pointerdown',e=>{
    e.preventDefault();
    sl.setPointerCapture(e.pointerId);
    sP(e.clientX);
    const m=ev=>sP(ev.clientX);
    const u=()=>{
      sl.removeEventListener('pointermove',m);
      sl.removeEventListener('pointerup',u);
      sl.removeEventListener('pointercancel',u);
      showToast('Set: '+(unt==='F'?val.toFixed(1):val.toFixed(0))+unt);
    };
    sl.addEventListener('pointermove',m);
    sl.addEventListener('pointerup',u);
    sl.addEventListener('pointercancel',u);
  });
  r();
}
initS('s1','v1',0,0.6,0.5,'F');

// LOGIKA NAVIGASI
const pgs={hm:document.getElementById('p-hm'),tl:document.getElementById('p-tl'),st:document.getElementById('p-st'),ft:document.getElementById('p-ft')};
const nIs=document.querySelectorAll('.nI');
nIs.forEach(b=>{
  b.addEventListener('click',()=>{
    nIs.forEach(x=>x.classList.remove('act'));
    b.classList.add('act');
    document.querySelectorAll('.pg').forEach(p=>p.classList.remove('act'));
    pgs[b.dataset.p].classList.add('act');
    document.querySelector('.cT').scrollTop=0;
  });
});

// LOGIKA GRAFIK CANVAS
const cnv=document.getElementById('cG'),ctx=cnv.getContext('2d');
let w,h,dP=[];
const nP=40;
for(let i=0;i<nP;i++)dP.push(Math.random()*40+30);
function rC(){
  const r=cnv.parentElement.getBoundingClientRect();
  cnv.width=r.width-24;
  cnv.height=110;
  w=cnv.width;
  h=cnv.height;
}
window.addEventListener('resize',rC);
rC();
function dG(){
  ctx.clearRect(0,0,w,h);
  dP.shift();
  let l=dP[dP.length-1];
  let n=l+(Math.random()-.5)*15;
  n=Math.max(10,Math.min(90,n));
  dP.push(n);
  const g=ctx.createLinearGradient(0,0,0,h);
  g.addColorStop(0,'rgba(255,59,59,.4)');
  g.addColorStop(1,'rgba(255,59,59,0)');
  ctx.beginPath();
  ctx.moveTo(0,h);
  const s=w/(nP-1);
  for(let i=0;i<nP;i++){
    const y=h-(dP[i]/100*h),x=i*s;
    ctx.lineTo(x,y);
  }
  ctx.lineTo(w,h);
  ctx.fillStyle=g;
  ctx.fill();
  ctx.beginPath();
  for(let i=0;i<nP;i++){
    const y=h-(dP[i]/100*h),x=i*s;
    if(i===0)ctx.moveTo(x,y);
    else ctx.lineTo(x,y);
  }
  ctx.strokeStyle='#ff3b3b';
  ctx.lineWidth=2;
  ctx.stroke();
  const m=Math.floor(nP/2);
  const d=document.getElementById('gD');
  if(d)d.textContent=(100-dP[m]).toFixed(1)+' dips';
  requestAnimationFrame(dG);
}
dG();
