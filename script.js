function formatRupiah(angka) {
  return "Rp " + Math.round(angka).toLocaleString('id-ID');
}

// Fungsi membersihkan titik inputmask agar bisa dihitung matematika
function cleanNumber(value) {
  return parseFloat(value.replace(/[^0-9,-]/g, '').replace(',', '.')) || 0;
}

function updateSubSektor() {
  const sektor = document.getElementById("sektor").value;
  const subSektorSelect = document.getElementById("subsektor");
  const labelInputUtama = document.getElementById("label-input-utama");
  const inputUtama = document.getElementById("input-utama");
  
  subSektorSelect.innerHTML = "";
  
  // Ambil list komoditas dari database.js
  const listKomoditas = dataPatokan[sektor];
  
  for (let key in listKomoditas) {
    let option = document.createElement("option");
    option.value = key;
    option.text = listKomoditas[key].nama;
    subSektorSelect.appendChild(option);
  }

  // Atur label input dinamis sesuai sektor
  if (sektor === "pertanian") {
    labelInputUtama.innerText = "Luas Lahan (m²):";
    inputUtama.value = "1.000";
  } else if (sektor === "perdagangan") {
    const firstKey = Object.keys(listKomoditas)[0];
    labelInputUtama.innerText = `Volume Usaha (${listKomoditas[firstKey].satuan}):`;
    inputUtama.value = listKomoditas[firstKey].patokan.toLocaleString('id-ID');
  } else if (sektor === "peternakan") {
    labelInputUtama.innerText = "Jumlah Hewan (Ekor):";
    inputUtama.value = "1";
  }
}

// Event listener buat ganti label dinamis kalau subsektor perdagangan diganti (Rupiah vs KG)
document.getElementById("subsektor").addEventListener("change", function() {
  const sektor = document.getElementById("sektor").value;
  const key = this.value;
  if (sektor === "perdagangan") {
    document.getElementById("label-input-utama").innerText = `Volume Usaha (${dataPatokan[sektor][key].satuan}):`;
    document.getElementById("input-utama").value = dataPatokan[sektor][key].patokan.toLocaleString('id-ID');
  }
});

function hitungEstimasi() {
  const sektor = document.getElementById("sektor").value;
  const subSektorKey = document.getElementById("subsektor").value;
  const inputValue = cleanNumber(document.getElementById("input-utama").value);
  const outputDiv = document.getElementById("output");

  if (!subSektorKey) {
    outputDiv.innerHTML = "Silahkan pilih komoditas terlebih dahulu.";
    return;
  }

  const item = dataPatokan[sektor][subSektorKey];
  
  // Tentukan patokan dasar untuk menghitung rasio pengali
  let patokanDasar = (sektor === "pertanian") ? item.luas_patokan : item.patokan;
  let rasio = inputValue / patokanDasar;

  // Hitung proyeksi keuangan per tahun
  let pendapatan = item.pendapatan * rasio;
  let upah = item.upah * rasio;
  let produksi = item.produksi * rasio;
  let operasional = item.operasional * rasio;
  let nonop = item.nonop * rasio;
  
  let totalPengeluaran = upah + produksi + operasional + nonop;
  let labaBersih = pendapatan - totalPengeluaran;

  // Render teks HTML output ke dalam card hasil analisis bawaan bapee
  let htmlResult = `
    <div style="line-height: 1.6; font-size: 14px;">
      <p><b>Komoditas:</b> ${item.nama} / Tahun</p>
      <hr style="margin: 10px 0; border: 0; border-top: 1px solid #eee;">
      <p>💰 <b>Pendapatan Kotor:</b> ${formatRupiah(pendapatan)}</p>
      <p>🔴 <b>Upah Pekerja:</b> ${formatRupiah(upah)}</p>
      <p>🔴 <b>Biaya Proyeksi / HPP:</b> ${formatRupiah(produksi)}</p>
      <p>🔴 <b>Biaya Operasional:</b> ${formatRupiah(operasional)}</p>
      <p>🔴 <b>Biaya Non-Ops:</b> ${formatRupiah(nonop)}</p>
      <hr style="margin: 10px 0; border: 0; border-top: 1px solid #eee;">
      <p style="font-size: 16px; color: #27ae60;">🟢 <b>Laba Bersih / SHU:</b> ${formatRupiah(labaBersih)}</p>
  `;

  // Tambahan variabel teknis jika sektor pertanian (Keterangan per musim sudah dihilangkan)
  if (sektor === "pertanian") {
    htmlResult += `
      <hr style="margin: 10px 0; border: 0; border-top: 1px solid #eee;">
      <p>👥 <b>Kebutuhan Pekerja:</b> ${item.pegawai} Orang</p>
      <p>📅 <b>Alokasi Hari Kerja:</b> ${item.hari_kerja} Hari</p>
      <p>🌾 <b>Hasil Panen Fisik:</b> ${Math.round(item.hasil_panen * rasio).toLocaleString('id-ID')} Kg / Tahun</p>
    `;
  }

  htmlResult += `</div>`;
  outputDiv.innerHTML = htmlResult;
  outputDiv.className = ""; // Hapus placeholder style
}

// Jalankan otomatis saat web pertama kali dibuka
window.onload = function() {
  updateSubSektor();
};
