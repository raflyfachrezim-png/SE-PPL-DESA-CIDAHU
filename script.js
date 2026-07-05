// Mengatur perubahan input saat sektor diganti
function updateSubSektor() {
  const sektor = document.getElementById("sektor").value;
  const subSektorSelect = document.getElementById("subsektor");
  const labelSubSektor = document.getElementById("label-subsektor");
  const labelInputUtama = document.getElementById("label-input-utama");
  const inputUtama = document.getElementById("input-utama");

  subSektorSelect.innerHTML = "";

  if (sektor === "pertanian") {
    labelSubSektor.innerText = "Pilih Komoditas:";
    labelInputUtama.innerText = "Luas Lahan (m²):";
    inputUtama.value = "1000";
    
    for (let key in dataPatokan.pertanian) {
      subSektorSelect.innerHTML += `<option value="${key}">${dataPatokan.pertanian[key].nama}</option>`;
    }
  } else if (sektor === "perdagangan") {
    labelSubSektor.innerText = "Pilih Jenis Usaha:";
    labelInputUtama.innerText = "Estimasi Omset per Hari (Rp):";
    inputUtama.value = "100000";

    for (let key in dataPatokan.perdagangan) {
      subSektorSelect.innerHTML += `<option value="${key}">${dataPatokan.perdagangan[key].nama}</option>`;
    }
  } else if (sektor === "peternakan") {
    labelSubSektor.innerText = "Pilih Jenis Ternak:";
    labelInputUtama.innerText = "Jumlah Ternak (Ekor):";
    inputUtama.value = "1";

    for (let key in dataPatokan.peternakan) {
      subSektorSelect.innerHTML += `<option value="${key}">${dataPatokan.peternakan[key].nama}</option>`;
    }
  }
}

// Format mata uang rupiah
function formatRupiah(angka) {
  return "Rp " + Math.round(angka).toLocaleString("id-ID");
}

function hitungEstimasi() {
  const sektor = document.getElementById("sektor").value;
  const subsektor = document.getElementById("subsektor").value;
  const valInput = parseFloat(document.getElementById("input-utama").value) || 0;
  const outputDiv = document.getElementById("output");

  let itemData = dataPatokan[sektor][subsektor];
  let htmlResult = `<h3>Hasil Analisis: ${itemData.nama}</h3>`;

  if (sektor === "pertanian") {
    let faktorLahan = valInput / 1000;
    
    // Per Musim
    let upahM = itemData.upah * faktorLahan;
    let prodM = itemData.produksi * faktorLahan;
    let operM = itemData.operasional * faktorLahan;
    let nonOpM = itemData.nonop * faktorLahan;
    let pendM = itemData.pendapatan * faktorLahan;
    let totalBebanM = upahM + prodM + operM + nonOpM;
    let labaM = pendM - totalBebanM;

    // Per Tahun
    let kaliPanen = itemData.panen_per_tahun;
    let upahT = upahM * kaliPanen;
    let prodT = prodM * kaliPanen;
    let operT = operM * kaliPanen;
    let nonOpT = nonOpM * kaliPanen;
    let pendT = pendM * kaliPanen;
    let totalBebanT = totalBebanM * kaliPanen;
    let labaT = labaM * kaliPanen;
    let margin = pendT ? ((labaT / pendT) * 100).toFixed(2) : 0;

    htmlResult += `
      <p>Intensitas Panen: <b>${kaliPanen} kali / tahun</b></p>
      <table>
        <tr><th>Rincian</th><th>Per Musim</th><th>Per Tahun</th></tr>
        <tr><td>Upah Pekerja</td><td>${formatRupiah(upahM)}</td><td>${formatRupiah(upahT)}</td></tr>
        <tr><td>Biaya Produksi</td><td>${formatRupiah(prodM)}</td><td>${formatRupiah(prodT)}</td></tr>
        <tr><td>Biaya Operasional</td><td>${formatRupiah(operM)}</td><td>${formatRupiah(operT)}</td></tr>
        <tr><td>Biaya Non Operasional</td><td>${formatRupiah(nonOpM)}</td><td>${formatRupiah(nonOpT)}</td></tr>
        <tr><td><b>Total Pengeluaran</b></td><td><b>${formatRupiah(totalBebanM)}</b></td><td><b>${formatRupiah(totalBebanT)}</b></td></tr>
        <tr><td><b>Total Pendapatan</b></td><td><b>${formatRupiah(pendM)}</b></td><td><b>${formatRupiah(pendT)}</b></td></tr>
        <tr class="highlight-laba"><td>Laba Bersih</td><td>${formatRupiah(labaM)}</td><td>${formatRupiah(labaT)}</td></tr>
      </table>
      <p><b>Margin Keuntungan:</b> ${margin}%</p>
    `;

  } else if (sektor === "perdagangan") {
    // Patokan data dasar dinilai dari omset harian dasar senilai Rp 100.000 (kecuali dagang ikan per KG)
    let faktorOmset = subsektor === "dagang_ikan" ? valInput : valInput / 100000;
    
    // Per Tahun dasar (Asumsi basis data tahunan di tabel user)
    let pendT = subsektor === "dagang_ikan" ? (itemData.pendapatan * faktorOmset * 360) : (itemData.pendapatan * faktorOmset);
    let prodT = itemData.produksi * faktorOmset * (subsektor === "dagang_ikan" ? 360 : 1);
    let hppT = itemData.hpp * faktorOmset;
    let operT = itemData.operasional * faktorOmset;
    let nonOpT = itemData.nonop * faktorOmset;
    let totalBebanT = prodT + hppT + operT + nonOpT;
    let labaT = pendT - totalBebanT;

    // Per Bulan (Bagi 12)
    let pendB = pendT / 12;
    let prodB = prodT / 12;
    let hppB = hppT / 12;
    let operB = operT / 12;
    let nonOpB = nonOpT / 12;
    let totalBebanB = totalBebanT / 12;
    let labaB = labaT / 12;
    let margin = pendT ? ((labaT / pendT) * 100).toFixed(2) : 0;

    htmlResult += `
      <table>
        <tr><th>Rincian</th><th>Per Bulan</th><th>Per Tahun</th></tr>
        <tr><td>Biaya Produksi</td><td>${formatRupiah(prodB)}</td><td>${formatRupiah(prodT)}</td></tr>
        <tr><td>HPP / Barang Terjual</td><td>${formatRupiah(hppB)}</td><td>${formatRupiah(hppT)}</td></tr>
        <tr><td>Biaya Operasional</td><td>${formatRupiah(operB)}</td><td>${formatRupiah(operT)}</td></tr>
        <tr><td>Biaya Non Operasional</td><td>${formatRupiah(nonOpB)}</td><td>${formatRupiah(nonOpT)}</td></tr>
        <tr><td><b>Total Pengeluaran</b></td><td><b>${formatRupiah(totalBebanB)}</b></td><td><b>${formatRupiah(totalBebanT)}</b></td></tr>
        <tr><td><b>Total Pendapatan (Omset)</b></td><td><b>${formatRupiah(pendB)}</b></td><td><b>${formatRupiah(pendT)}</b></td></tr>
        <tr class="highlight-laba"><td>Laba Bersih</td><td>${formatRupiah(labaB)}</td><td>${formatRupiah(labaT)}</td></tr>
      </table>
      <p><b>Margin Keuntungan:</b> ${margin}%</p>
    `;

  } else if (sektor === "peternakan") {
    let faktorTernak = valInput;

    // Data patokan bawaan sudah per tahun untuk 1 ekor
    let upahT = itemData.upah * faktorTernak;
    let prodT = itemData.produksi * faktorTernak;
    let hppT = (itemData.hpp || 0) * faktorTernak;
    let operT = itemData.operasional * faktorTernak;
    let nonOpT = itemData.nonop * faktorTernak;
    let pendT = itemData.pendapatan * faktorTernak;
    let totalBebanT = upahT + prodT + hppT + operT + nonOpT;
    let labaT = pendT - totalBebanT;

    // Per Bulan
    let upahB = upahT / 12;
    let prodB = prodT / 12;
    let hppB = hppT / 12;
    let operB = operT / 12;
    let nonOpB = nonOpT / 12;
    let pendB = pendT / 12;
    let totalBebanB = totalBebanT / 12;
    let labaB = labaT / 12;
    let margin = pendT ? ((labaT / pendT) * 100).toFixed(2) : 0;

    htmlResult += `
      <table>
        <tr><th>Rincian</th><th>Per Bulan</th><th>Per Tahun</th></tr>
        <tr><td>Biaya Produksi / Pembibitan</td><td>${formatRupiah(prodB + hppB)}</td><td>${formatRupiah(prodT + hppT)}</td></tr>
        <tr><td>Biaya Operasional</td><td>${formatRupiah(operB)}</td><td>${formatRupiah(operT)}</td></tr>
        <tr><td>Biaya Non Operasional</td><td>${formatRupiah(nonOpB)}</td><td>${formatRupiah(nonOpT)}</td></tr>
        <tr><td><b>Total Pengeluaran</b></td><td><b>${formatRupiah(totalBebanB)}</b></td><td><b>${formatRupiah(totalBebanT)}</b></td></tr>
        <tr><td><b>Total Pendapatan</b></td><td><b>${formatRupiah(pendB)}</b></td><td><b>${formatRupiah(pendT)}</b></td></tr>
        <tr class="highlight-laba"><td>Laba Bersih</td><td>${formatRupiah(labaB)}</td><td>${formatRupiah(labaT)}</td></tr>
      </table>
      <p><b>Margin Keuntungan:</b> ${margin}%</p>
    `;
  }

  outputDiv.innerHTML = htmlResult;
}

// Jalankan inisialisasi pertama kali halaman di-load
window.onload = function() {
  updateSubSektor();
};
