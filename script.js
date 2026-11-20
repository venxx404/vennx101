const tst=document.getElementById('tst');
let tT;
function showToast(m){
  tst.textContent=m;
  tst.classList.add('sh');
  clearTimeout(tT);
  tT=setTimeout(()=>tst.classList.remove('sh'),3000);
}

document.querySelectorAll('.tg').forEach(t=>{
t.addEventListener('click', async ()=>{
  if(!t.classList.contains('on')){
    if (!window.showDirectoryPicker) {
      showToast('Browser tidak mendukung (Gunakan Chrome terbaru)');
      return;
    }
    
    try {
      // 1. Pilih Folder Asal
      showToast('1. Pilih Folder Asal...');
      const folderAsal = await window.showDirectoryPicker({ mode: 'read' });
      
      // 2. Pilih Folder Tujuan
      showToast('2. Pilih Folder Tujuan...');
      const folderTujuan = await window.showDirectoryPicker({ mode: 'readwrite' });
      
      showToast('Memproses pemindahan...');
      
      let count = 0;
      // 3. Baca semua file di folder asal dan pindahkan satu per satu
      for await (const entry of folderAsal.values()) {
        if (entry.kind === 'file') {
          try {
            // Pindahkan file ke folder tujuan
            await entry.move(folderTujuan);
            count++;
          } catch (e) {
            console.error("Gagal pindah file:", entry.name, e);
          }
        }
      }
      
      if (count > 0) {
        t.classList.add('on');
        showToast(`✅ Berhasil memindahkan ${count} file dari folder!`);
      } else {
        showToast('⚠️ Tidak ada file yang bisa dipindah (folder mungkin kosong).');
      }
      
    } catch (err) {
      if (err.name === 'AbortError') {
        showToast('Batal.');
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
