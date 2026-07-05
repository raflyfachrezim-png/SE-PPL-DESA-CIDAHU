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
    inputUtama.type = "text"; // Diubah ke text agar bisa pakai format titik
    inputUtama.value = "1.000";
    
    for (let key in dataPatokan.pertanian) {
      subSektorSelect.innerHTML += `<option value="${key}">${dataPatokan.pertanian[key].nama}</option>`;
    }
  } else if (sektor === "perdagangan") {
    labelSubSektor.innerText = "Pilih Jenis Usaha:";
    labelInputUtama.innerText = "Estimasi Omset per Hari (Rp):";
    inputUtama.type = "text";
    inputUtama.value = "100.000";

    for (let key in dataPatokan.perdagangan) {
      subSektorSelect.innerHTML += `<option value="${key}">${dataPatokan.perdagangan[key].nama}</option>`;
    }
  } else if (sektor === "peternakan") {
    labelSubSektor.innerText = "Pilih Jenis Ternak:";
    labelInputUtama.innerText = "Jumlah Ternak (Ekor):";
    inputUtama.type = "text";
    inputUtama.value = "1";

    for (let key in dataPatokan.peternakan) {
      subSektorSelect.innerHTML += `<option value="${key}">${dataPatokan.peternakan[key].nama}</option>`;
    }
  }
}

// Fungsi untuk memformat input secara realtime saat diketik (Auto Thousand Separator)
function formatInputRibuan(e) {
  let value = e.target.value.replace(/\D/g, ""); // Hapus semua karakter non-angka
  if (value === "") {
    e.target.value = "";
    return;
  }
  // Ubah ke format ribuan dengan titik
  e.target.value = parseInt(value, 10).toLocaleString("id-ID");
}

function formatRupiah(angka) {
  return "Rp " + Math.round(angka).toLocaleString("id-ID");
}

function hitungEstimasi() {
  const sektor = document.getElementById("sektor").value;
  const subsektor = document.getElementById("subsektor").value;
  
  // Ambil nilai input, hapus semua titik agar kembali jadi angka murni sebelum dihitung
  let rawValue = document.getElementById("input-utama").value.replace(/\./g, "");
  const valInput = parseFloat(rawValue) || 0;
  
  const outputDiv = document.getElementById("output");

  let itemData = dataPatokan[sektor][subsektor];
  let htmlResult = `<h3 style="font-size:15px; margin-top:0; color:#1d4ed8;">Hasil Analisis: ${itemData.nama}</h3>`;

  if (sektor === "pertanian") {
    let faktorLahan = valInput / 1000;
    
    let upahM = itemData.upah * faktorLahan;
    let prodM = itemData.produksi * faktorLahan;
    let operM = itemData.operasional * faktorLahan;
    let nonOpM = itemData.nonop * faktorLahan;
    let pendM = itemData.pendapatan * faktorLahan;
    let totalBebanM = upahM + prodM + operM + nonOpM;
    let labaM = pendM - totalBebanM;

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
      <p style="font-size:13px; margin: 5px 0 10px 0;">Intensitas Panen: <b>${kaliPanen} kali / tahun</b></p>
      <div class="table-container">
        <table>
          <tr><th>Rincian</th><th>Per Musim</th><th>Per Tahun</th></tr>
          <tr><td>Upah Pekerja</td><td>${formatRupiah(upahM)}</td><td>${formatRupiah(upahT)}</td></tr>
          <tr><td>Biaya Produksi</td><td>${formatRupiah(prodM)}</td><td>${formatRupiah(prodT)}</td></tr>
          <tr><td>Biaya Operasional</td><td>${formatRupiah(operM)}</td><td>${formatRupiah(operT)}</td></tr>
          <tr><td>Biaya Non Op</td><td>${formatRupiah(nonOpM)}</td><td>${formatRupiah(nonOpT)}</td></tr>
          <tr style="font-weight:600; background:#f8fafc;"><td>Total Beban</td><td>${formatRupiah(totalBebanM)}</td><td>${formatRupiah(totalBebanT)}</td></tr>
          <tr style="font-weight:600;"><td>Pendapatan</td><td>${formatRupiah(pendM)}</td><td>${formatRupiah(pendT)}</td></tr>
          <tr class="highlight-laba"><td>Laba Bersih</td><td>${formatRupiah(labaM)}</td><td>${formatRupiah(labaT)}</td></tr>
        </table>
      </div>
      <div class="margin-info"><b>Margin Keuntungan:</b> ${margin}%</div>
    `;

  } else if (sektor === "perdagangan") {
    let faktorOmset = subsektor === "dagang_ikan" ? valInput : valInput / 100000;
    
    let pendT = subsektor === "dagang_ikan" ? (itemData.pendapatan * faktorOmset * 360) : (itemData.pendapatan * faktorOmset);
    let prodT = itemData.produksi * faktorOmset * (subsektor === "dagang_ikan" ? 360 : 1);
    let hppT = itemData.hpp * faktorOmset;
    let operT = itemData.operasional * faktorOmset;
    let nonOpT = itemData.nonop * faktorOmset;
    let totalBebanT = prodT + hppT + operT + nonOpT;
    let labaT = pendT - totalBebanT;

    let pendB = pendT / 12;
    let prodB = prodT / 12;
    let hppB = hppT / 12;
    let operB = operT / 12;
    let nonOpB = nonOpT / 12;
    let totalBebanB = totalBebanT / 12;
    let labaB = labaT / 12;
    let margin = pendT ? ((labaT / pendT) * 100).toFixed(2) : 0;

    htmlResult += `
      <div class="table-container">
        <table>
          <tr><th>Rincian</th><th>Per Bulan</th><th>Per Tahun</th></tr>
          <tr><td>Biaya Produksi</td><td>${formatRupiah(prodB)}</td><td>${formatRupiah(prodT)}</td></tr>
          <tr><td>HPP / Terjual</td><td>${formatRupiah(hppB)}</td><td>${formatRupiah(hppT)}</td></tr>
          <tr><td>Biaya Operasional</td><td>${formatRupiah(operB)}</td><td>${formatRupiah(operT)}</td></tr>
          <tr><td>Biaya Non Op</td><td>${formatRupiah(nonOpB)}</td><td>${formatRupiah(nonOpT)}</td></tr>
          <tr style="font-weight:600; background:#f8fafc;"><td>Total Beban</td><td>${formatRupiah(totalBebanB)}</td><td>${formatRupiah(totalBebanT)}</td></tr>
          <tr style="font-weight:600;"><td>Pendapatan (Omset)</td><td>${formatRupiah(pendB)}</td><td>${formatRupiah(pendT)}</td></tr>
          <tr class="highlight-laba"><td>Laba Bersih</td><td>${formatRupiah(labaB)}</td><td>${formatRupiah(labaT)}</td></tr>
        </table>
      </div>
      <div class="margin-info"><b>Margin Keuntungan:</b> ${margin}%</div>
    `;

  } else if (sektor === "peternakan") {
    let faktorTernak = valInput;

    let upahT = itemData.upah * faktorTernak;
    let prodT = itemData.produksi * faktorTernak;
    let hppT = (itemData.hpp || 0) * faktorTernak;
    let operT = itemData.operasional * faktorTernak;
    let nonOpT = itemData.nonop * faktorTernak;
    let pendT = itemData.pendapatan * faktorTernak;
    let totalBebanT = upahT + prodT + hppT + operT + nonOpT;
    let labaT = pendT - totalBebanT;

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
      <div class="table-container">
        <table>
          <tr><th>Rincian</th><th>Per Bulan</th><th>Per Tahun</th></tr>
          <tr><td>Biaya Produksi</td><td>${formatRupiah(prodB + hppB)}</td><td>${formatRupiah(prodT + hppT)}</td></tr>
          <tr><td>Biaya Operasional</td><td>${formatRupiah(operB)}</td><td>${formatRupiah(operT)}</td></tr>
          <tr><td>Biaya Non Op</td><td>${formatRupiah(nonOpB)}</td><td>${formatRupiah(nonOpT)}</td></tr>
          <tr style="font-weight:600; background:#f8fafc;"><td>Total Beban</td><td>${formatRupiah(totalBebanB)}</td><td>${formatRupiah(totalBebanT)}</td></tr>
          <tr style="font-weight:600;"><td>Pendapatan</td><td>${formatRupiah(pendB)}</td><td>${formatRupiah(pendT)}</td></tr>
          <tr class="highlight-laba"><td>Laba Bersih</td><td>${formatRupiah(labaB)}</td><td>${formatRupiah(labaT)}</td></tr>
        </table>
      </div>
      <div class="margin-info"><b>Margin Keuntungan:</b> ${margin}%</div>
    `;
  }

  outputDiv.innerHTML = htmlResult;
}

window.onload = function() {
  updateSubSektor();
  
  // Pasang event listener ke input utama agar otomatis ngetik dengan format titik
  document.getElementById("input-utama").addEventListener("input", formatInputRibuan);
};
