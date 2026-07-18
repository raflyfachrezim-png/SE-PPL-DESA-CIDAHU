// script.js
document.addEventListener("DOMContentLoaded", () => {
  const SektorSelect = document.getElementById("sektor");
  const KomoditasSelect = document.getElementById("komoditas");
  const InputLabel = document.getElementById("inputLabel");
  const VolumeInput = document.getElementById("volumeInput");
  const BtnHitung = document.getElementById("btnHitung");
  const ResultSection = document.getElementById("resultSection");
  const PertanianDetail = document.getElementById("pertanianDetail");

  // Format Angka ke Rupiah Terformat (Tanpa Sen)
  const formatRupiah = (angka) => {
    const isNegative = angka < 0;
    const absAngka = Math.abs(Math.round(angka));
    const formatted = "Rp " + absAngka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return isNegative ? `-${formatted}` : formatted;
  };

  // Format Angka Biasa Ke Pemisah Ribuan (Untuk Input Mask & Panen)
  const formatRibuan = (angkaStr) => {
    return angkaStr.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Bersihkan Titik agar Aman untuk Operasi Matematika
  const sanitizeInput = (val) => {
    if (!val) return 0;
    const cleanNumber = val.replace(/\./g, "");
    return parseFloat(cleanNumber) || 0;
  };

  // Input Masking saat User mengetik angka di Lapangan
  VolumeInput.addEventListener("input", (e) => {
    const cursorPosition = e.target.selectionStart;
    const originalLength = e.target.value.length;
    
    // Terapkan Masking Ribuan
    e.target.value = formatRibuan(e.target.value);
    
    // Sesuaikan Posisi Kursor HP setelah penambahan titik otomatis
    const newLength = e.target.value.length;
    e.target.setSelectionRange(cursorPosition + (newLength - originalLength), cursorPosition + (newLength - originalLength));
  });

  // Sinkronisasi Dropdown Komoditas & Perubahan Label Berdasarkan Sektor
  const updateFormUI = () => {
    const sektorPilihan = SektorSelect.value;
    KomoditasSelect.innerHTML = ""; // Reset opsi komoditas

    // Ambil daftar komoditas dari database.js
    const listKomoditas = dataPatokan[sektorPilihan];

    for (const key in listKomoditas) {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = listKomoditas[key].nama;
      KomoditasSelect.appendChild(option);
    }

    // Set Label Input & Default Placeholder secara Dinamis
    if (sektorPilihan === "pertanian") {
      InputLabel.textContent = "Luas Lahan (m²)";
      VolumeInput.placeholder = "Contoh: 2.500";
    } else if (sektorPilihan === "perdagangan") {
      InputLabel.textContent = "Volume Usaha (Rupiah / KG)";
      VolumeInput.placeholder = "Contoh: 150.000";
    } else if (sektorPilihan === "peternakan") {
      InputLabel.textContent = "Jumlah Hewan (Ekor)";
      VolumeInput.placeholder = "Contoh: 50";
    }

    // Reset view hasil tiap kali konfigurasi form berganti
    ResultSection.classList.add("hidden");
    VolumeInput.value = "";
  };

  // Event listener saat Sektor diganti
  SektorSelect.addEventListener("change", updateFormUI);

  // Eksekusi Logika Utama Hitung Potensi Ekonomi
  BtnHitung.addEventListener("click", () => {
    const sektor = SektorSelect.value;
    const komoditas = KomoditasSelect.value;
    const userInput = sanitizeInput(VolumeInput.value);

    if (userInput <= 0) {
      alert("Cuy, masukkan nilai volume atau luas yang valid dulu diatas nol!");
      return;
    }

    // Ambil object data patokan terpilih
    const patokanObj = dataPatokan[sektor][komoditas];

    // Rumus Multiplier: Cek pembagi patokan dasar (luas_patokan atau patokan biasa)
    const nilaiPatokanDasar = (sektor === "pertanian") ? patokanObj.luas_patokan : patokanObj.patokan;
    const rasioMultiplier = userInput / nilaiPatokanDasar;

    // Kalkulasi Keuangan Terproyeksi Multiplier
    const proyeksiUpah = patokanObj.upah * rasioMultiplier;
    const proyeksiProduksi = patokanObj.produksi * rasioMultiplier;
    const proyeksiOperasional = patokanObj.operasional * rasioMultiplier;
    const proyeksiNonOp = patokanObj.nonop * rasioMultiplier;
    const proyeksiPendapatan = patokanObj.pendapatan * rasioMultiplier;

    // Hitung Pengeluaran & Hasil Bersih (SHU / Tahun)
    const totalPengeluaran = proyeksiUpah + proyeksiProduksi + proyeksiOperasional + proyeksiNonOp;
    const labaBersih = proyeksiPendapatan - totalPengeluaran;

    // Render Output Finansial ke UI
    document.getElementById("resPendapatan").textContent = formatRupiah(proyeksiPendapatan);
    document.getElementById("resUpah").textContent = formatRupiah(proyeksiUpah ? -proyeksiUpah : 0);
    document.getElementById("resProduksi").textContent = formatRupiah(proyeksiProduksi ? -proyeksiProduksi : 0);
    document.getElementById("resOperasional").textContent = formatRupiah(proyeksiOperasional ? -proyeksiOperasional : 0);
    document.getElementById("resNonOp").textContent = formatRupiah(proyeksiNonOp ? -proyeksiNonOp : 0);
    
    const labaElement = document.getElementById("resLabaBersih");
    labaElement.textContent = formatRupiah(labaBersih);

    // Kustomisasi warna teks SHU jika minus (antisipasi kerugian uji coba)
    if (labaBersih < 0) {
      labaElement.style.color = "#dc2626";
    } else {
      labaElement.style.color = "#15803d";
    }

    // Variabel Teknis Tambahan khusus sektor Pertanian
    if (sektor === "pertanian") {
      const proyeksiPekerja = Math.ceil(patokanObj.pegawai * rasioMultiplier);
      const alokasiHari = Math.round(patokanObj.hari_kerja * rasioMultiplier);
      const proyeksiPanen = Math.round(patokanObj.hasil_panen * rasioMultiplier);

      document.getElementById("resPekerja").textContent = `${proyeksiPekerja.toLocaleString("id-ID")} Orang`;
      document.getElementById("resHariKerja").textContent = `${alokasiHari.toLocaleString("id-ID")} Hari`;
      document.getElementById("resHasilPanen").textContent = `${proyeksiPanen.toLocaleString("id-ID")} Kg / Tahun`;

      PertanianDetail.classList.remove("hidden");
    } else {
      PertanianDetail.classList.add("hidden");
    }

    // Tampilkan penampang hasil analisis
    ResultSection.classList.remove("hidden");
    
    // Auto-scroll halus ke area hasil agar nyaman di layar HP beresolusi pendek
    ResultSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  // Jalankan inisialisasi awal saat aplikasi dibuka pertama kali
  updateFormUI();


  // =======================================================================
  // LOGIKA KELOLA PERSENTASE PROGRES ASESMEN (MANDIRI)
  // =======================================================================
  const TotalInput = document.getElementById("totalAssessment");
  const MonitorSubmit = document.getElementById("monitorSubmit");
  const MonitorReject = document.getElementById("monitorReject");
  const MonitorApprove = document.getElementById("monitorApprove");
  const PersenProgresText = document.getElementById("persenProgres");
  const BelumDiprosesText = document.getElementById("belumDiproses");

  // Fungsi Hitung Persentase Real-time
  const hitungPersentaseOtomatis = () => {
    const total = sanitizeInput(TotalInput.value);
    const submit = sanitizeInput(MonitorSubmit.value);
    const reject = sanitizeInput(MonitorReject.value);
    const approve = sanitizeInput(MonitorApprove.value);

    const totalDiproses = submit + reject + approve;
    let progres = 0;
    let sisa = 0;

    if (total > 0) {
      progres = (totalDiproses / total) * 100;
      sisa = ((total - totalDiproses) / total) * 100;
    }

    PersenProgresText.textContent = progres.toFixed(0) + "%";
    BelumDiprosesText.textContent = sisa.toFixed(0) + "%";
  };

  // Fungsi pembungkus untuk menerapkan Masking Ribuan sekaligus Hitung ulang
  const applyMaskAndCalculate = (e) => {
    const cursorPosition = e.target.selectionStart;
    const originalLength = e.target.value.length;
    
    e.target.value = formatRibuan(e.target.value);
    
    const newLength = e.target.value.length;
    e.target.setSelectionRange(cursorPosition + (newLength - originalLength), cursorPosition + (newLength - originalLength));
    
    hitungPersentaseOtomatis();
  };

  // Pasang Event Listener ke semua input monitoring baru
  TotalInput.addEventListener("input", applyMaskAndCalculate);
  MonitorSubmit.addEventListener("input", applyMaskAndCalculate);
  MonitorReject.addEventListener("input", applyMaskAndCalculate);
  MonitorApprove.addEventListener("input", applyMaskAndCalculate);

  // Jalankan masking pertama kali untuk data default bawaan
  TotalInput.value = formatRibuan(TotalInput.value);
  MonitorSubmit.value = formatRibuan(MonitorSubmit.value);
  MonitorReject.value = formatRibuan(MonitorReject.value);
  MonitorApprove.value = formatRibuan(MonitorApprove.value);
  
  // Hitung perdana saat halaman di-load
  hitungPersentaseOtomatis();
  
});
