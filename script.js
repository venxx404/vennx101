const tst=document.getElementById('tst');
let tT;
function showToast(m){
  tst.textContent=m;
  tst.classList.add('sh');
  clearTimeout(tT);
  tT=setTimeout(()=>tst.classList.remove('sh'),2500);
}

// LOGIKA TOMBOL SWITCH (PINDAH FOLDER)
document.querySelectorAll('.tg').forEach(t=>{
t.addEventListener('click', async ()=>{
  if(!t.classList.contains('on')){
    if (!window.showDirectoryPicker) {
      showToast('Browser tidak mendukung (Gunakan Chrome 132+)');
      return;
    }
    
    try {
      showToast('1. Pilih FOLDER Asal...');
      // Pilih folder yang mau dipindah
      const folderAsal = await window.showDirectoryPicker({ mode: 'readwrite' });
      
      showToast('2. Pilih FOLDER Tujuan...');
      // Pilih folder tujuan
      const folderTujuan = await window.showDirectoryPicker({ mode: 'readwrite' });
      
      showToast('Memproses pemindahan folder...');
      
      // Pindahkan folder
      await folderAsal.move(folderTujuan);
      
      t.classList.add('on');
      showToast('✅ Folder berhasil dipindah!');
      
    } catch (err) {
      if (err.name === 'AbortError') {
        showToast('Batal: Tidak ada folder yang dipindah.');
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

// ... (Sisa kode slider dan grafik tetap sama seperti sebelumnya) ...
