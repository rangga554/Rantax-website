// ==============================================
// RANTAX PROJECT — Skrip Utama
// Navigasi • Halaman • Chat AI • Global Chat
// ==============================================

// === KONDISI AWAL ===
let halamanSaatIni = 'beranda';
let tabChatSaatIni = 'ai';
let chatTerbuka = false;
let riwayatPesan = { ai: [], global: [] };
let namaPengguna = 'Pengguna' + Math.floor(Math.random() * 9000 + 1000);

// === ELEMEN HALAMAN ===
const elemen = {
  navLinks: document.querySelectorAll('.nav-link'),
  halamanSemua: document.querySelectorAll('.halaman'),
  btnChatToggle: document.getElementById('btnChatToggle'),
  kotakChat: document.getElementById('kotakChat'),
  btnTutupChat: document.getElementById('btnTutupChat'),
  tabTombol: document.querySelectorAll('.chat-tab button'),
  areaPesan: document.getElementById('areaPesan'),
  inputPesan: document.getElementById('inputPesan'),
  btnKirimPesan: document.getElementById('btnKirimPesan'),
  formLogin: document.getElementById('formLogin'),
  statusAkun: document.getElementById('status-akun'),
  terakhirAktif: document.getElementById('terakhir-aktif')
};

// ==============================================
// NAVIGASI & GANTI HALAMAN
// ==============================================
function bukaHalaman(namaHalaman) {
  halamanSaatIni = namaHalaman;
  
  // Perbarui tautan navigasi
  elemen.navLinks.forEach(tautan => {
    tautan.classList.toggle('aktif', tautan.dataset.halaman === namaHalaman || namaHalaman === 'beranda' && tautan.dataset.halaman === 'beranda');
  });
  
  // Tampilkan halaman yang benar saja
  elemen.halamanSemua.forEach(hlm => {
    const idHalaman = hlm.id.replace('halaman-', '');
    hlm.classList.toggle('aktif', idHalaman === namaHalaman);
  });
  
  // Tindakan khusus per halaman
  if (namaHalaman === 'dashboard') {
    muatDashboard();
  }
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Tautan navigasi diklik
elemen.navLinks.forEach(tautan => {
  tautan.addEventListener('click', (e) => {
    e.preventDefault();
    const tujuan = tautan.dataset.halaman || 'beranda';
    bukaHalaman(tujuan);
  });
});

// ==============================================
// FUNGSI CHAT — BUKA / TUTUP & TABULASI
// ==============================================
elemen.btnChatToggle.addEventListener('click', () => {
  chatTerbuka = !chatTerbuka;
  elemen.kotakChat.classList.toggle('buka', chatTerbuka);
  if (chatTerbuka) scrollKeBawah();
});

elemen.btnTutupChat.addEventListener('click', () => {
  chatTerbuka = false;
  elemen.kotakChat.classList.remove('buka');
});

// Beralih tab AI ↔ Global Chat
elemen.tabTombol.forEach(tombol => {
  tombol.addEventListener('click', () => {
    elemen.tabTombol.forEach(t => t.classList.remove('aktif'));
    tombol.classList.add('aktif');
    tabChatSaatIni = tombol.dataset.tab;
    muatUlangPesan();
  });
});

// ==============================================
// KIRIM PESAN & TANGGAPAN — AI / GLOBAL
// ==============================================
function tambahPesan(pengirim, teks, jenis = 'ai') {
  const waktuSekarang = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  
  const kotakPesan = document.createElement('div');
  kotakPesan.className = `pesan ${pengirim === 'kamu' ? 'kamu' : jenis}`;
  kotakPesan.innerHTML = `
    <div>${teks}</div>
    <div class="waktu">${waktuSekarang}</div>
  `;
  
  elemen.areaPesan.appendChild(kotakPesan);
  scrollKeBawah();
}

function scrollKeBawah() {
  elemen.areaPesan.scrollTop = elemen.areaPesan.scrollHeight;
}

function tanggapanAI(pertanyaan) {
  const jawaban = [
    "Halo! 👋 Saya adalah asisten AI dari RANTAX PROJECT. Ada yang bisa saya bantu?",
    "Tentu saja! 🤗 Pertanyaan tentang apa? Saya bantu sebisa mungkin ya.",
    "RANTAX APK adalah aplikasi resmi — beli lewat halaman Pembelian Resmi di atas ya! 📱✅",
    "Untuk pembelian & pertanyaan seputar produk, buka saja 🔗 https://AM123266 — di sana lengkap semua info & dukungannya!",
    "Silakan tanyakan apa saja — saya siap bantu! 🤖💬",
    "Produk kami sudah teruji & aman dipakai — jaminan kualitas & dukungan penuh! ✨"
  ];
  
  const teks = pertanyaan.trim().toLowerCase();
  if (teks.includes('beli') || teks.includes('harga') || teks.includes('produk')) {
    return "📱 RANTAX APK tersedia lewat halaman Pembelian Resmi — tekan tombol BELI SEKARANG di atas atau buka 🔗 https://AM123266 untuk info lengkap, harga & cara pembeliannya ya!";
  } else if (teks.includes('siapa') || teks.includes('kamu') || teks.includes('ai')) {
    return "Saya asisten resmi 🤖 dari RANTAX PROJECT — siap bantu jawab pertanyaan & berikan info produk kapan saja!";
  } else if (teks.includes('halo') || teks.includes('hai') || teks.includes('assalamualaikum')) {
    return "Halo! 🙋‍♂️👋 Selamat datang di RANTAX PROJECT — ada yang bisa saya bantu hari ini?";
  }
  
  return jawaban[Math.floor(Math.random() * jawaban.length)];
}

elemen.btnKirimPesan.addEventListener('click', kirimPesan);
elemen.inputPesan.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') kirimPesan();
});

function kirimPesan() {
  const teks = elemen.inputPesan.value.trim();
  if (!teks) return;
  
  // Tambah pesan pengirim
  tambahPesan('kamu', teks, tabChatSaatIni);
  elemen.inputPesan.value = '';
  
  // Tanggapan tergantung tab
  if (tabChatSaatIni === 'ai') {
    setTimeout(() => {
      tambahPesan('ai', tanggapanAI(teks), 'ai');
    }, 600 + Math.random() * 400);
  } else {
    // Global Chat — tampilkan pesan & nama pengirim
    setTimeout(() => {
      tambahPesan('global', `<strong>${namaPengguna}:</strong> ${teks}`, 'global');
    }, 300);
  }
}

// ==============================================
// HALAMAN LAIN — Login & Dashboard
// ==============================================
if (elemen.formLogin) {
  elemen.formLogin.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    namaPengguna = email.split('@')[0] || namaPengguna;
    
    localStorage.setItem('rantax_nama', namaPengguna);
    localStorage.setItem('rantax_login', 'sudah');
    localStorage.setItem('rantax_waktu', new Date().toLocaleString('id-ID'));
    
    alert(`✅ Berhasil Masuk! Selamat datang, ${namaPengguna}! 🎉`);
    bukaHalaman('dashboard');
  });
}

function muatDashboard() {
  const status = localStorage.getItem('rantax_login');
  const waktu = localStorage.getItem('rantax_waktu');
  
  if (elemen.statusAkun) elemen.statusAkun.textContent = status ? '✅ Aktif' : '—';
  if (elemen.terakhirAktif) elemen.terakhirAktif.textContent = waktu || 'Baru Saja';
}

// ==============================================
// SIAP SAAT HALAMAN DIBUKA — PESAN PEMBUKA
// ==============================================
document.addEventListener('DOMContentLoaded', function() {
  // Pesan pembuka dari AI
  setTimeout(() => {
    tambahPesan('ai', '👋 Halo! Selamat datang di RANTAX PROJECT — ada pertanyaan atau butuh bantuan? Tanyakan saja ya! 🤖', 'ai');
  }, 400);
  
  // Cek status login sebelumnya
  if (localStorage.getItem('rantax_login')) {
    namaPengguna = localStorage.getItem('rantax_nama') || namaPengguna;
  }
});
