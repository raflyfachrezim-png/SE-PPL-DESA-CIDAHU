// database.js
// Kalkulator SE Bidang Usaha Desa Cidahu (Murni Per Tahun)
// Hak Cipta: Rafly Fachrezi Desa Cidahu

const dataPatokan = {
  pertanian: {
    padi: { 
      nama: "Padi", 
      kbli: "01121 - Pertanian Padi Sawah",
      luas_patokan: 1000, 
      upah: 7560000, 
      produksi: 6300000, 
      operasional: 1800000, 
      nonop: 0, 
      pendapatan: 27000000, 
      hasil_panen: 5400, 
      harga: 5000, 
      pegawai: 2, 
      hari_kerja: 7 
    },
    sawi: { 
      nama: "Sawi", 
      kbli: "01131 - Pertanian Sayuran Daun",
      luas_patokan: 1000, 
      upah: 10080000, 
      produksi: 10800000, 
      operasional: 5400000, 
      nonop: 0, 
      pendapatan: 32400000, 
      hasil_panen: 10800, 
      harga: 3000, 
      pegawai: 2, 
      hari_kerja: 7 
    },
    timun: { 
      nama: "Timun", 
      kbli: "01133 - Pertanian Sayuran Buah",
      luas_patokan: 1000, 
      upah: 30000000, 
      produksi: 70600000, 
      operasional: 15000000, 
      nonop: 0, 
      pendapatan: 120000000, 
      hasil_panen: 30000, 
      harga: 4000, 
      pegawai: 5, 
      hari_kerja: 10 
    },
    cabe: { 
      nama: "Cabe", 
      kbli: "01138 - Pertanian Cabe",
      luas_patokan: 1000, 
      upah: 6000000, 
      produksi: 46000000, 
      operasional: 10000000, 
      nonop: 0, 
      pendapatan: 75000000, 
      hasil_panen: 2500, 
      harga: 30000, 
      pegawai: 5, 
      hari_kerja: 10 
    },
    pikok: { 
      nama: "Pikok", 
      kbli: "01193 - Pertanian Bunga Pucuk/Pikok",
      luas_patokan: 1000, 
      upah: 2520000, 
      produksi: 8200000, 
      operasional: 4280000, 
      nonop: 0, 
      pendapatan: 27000000, 
      hasil_panen: 900, 
      harga: 30000, 
      pegawai: 3, 
      hari_kerja: 14 
    }
  },
  perdagangan: {
    warung_eceran: { 
      nama: "Warung Eceran", 
      kbli: "47112 - Perdagangan Eceran Barangan Kelontong",
      patokan: 100000, 
      upah: 0, 
      produksi: 30600000, 
      operasional: 1800000, 
      nonop: 0, 
      pendapatan: 36000000, 
      satuan: "Rupiah" 
    },
    warung_makan: { 
      nama: "Warung Makan/Minum", 
      kbli: "56102 - Warung Makan dan Kedai Makanan",
      patokan: 100000, 
      upah: 0, 
      produksi: 18000000, 
      operasional: 5400000, 
      nonop: 0, 
      pendapatan: 36000000, 
      satuan: "Rupiah" 
    },
    dagang_ikan: { 
      nama: "Perdagangan Ikan", 
      kbli: "47214 - Perdagangan Eceran Hasil Perikanan",
      patokan: 1, 
      upah: 0, 
      produksi: 3000, 
      operasional: 2000, 
      nonop: 0, 
      pendapatan: 35000, 
      satuan: "KG" 
    }
  },
  peternakan: {
    domba_penggemukan: { 
      nama: "Domba Penggemukan", 
      kbli: "01441 - Pembesaran/Penggemukan Domba",
      patokan: 1, 
      upah: 0, 
      produksi: 900000, 
      operasional: 365000, 
      nonop: 0, 
      pendapatan: 2500000, 
      satuan: "Ekor" 
    },
    domba_pembibitan: { 
      nama: "Domba Pembibitan", 
      kbli: "01442 - Pembibitan dan Budidaya Domba",
      patokan: 1, 
      upah: 0, 
      produksi: 365000, 
      operasional: 0, 
      nonop: 0, 
      pendapatan: 2500000, 
      satuan: "Ekor" 
    },
    sapi_penggemukan: { 
      nama: "Sapi Penggemukan", 
      kbli: "01411 - Pembesaran/Penggemukan Sapi Potong",
      patokan: 1, 
      upah: 0, 
      produksi: 15000000, 
      operasional: 4800000, 
      nonop: 0, 
      pendapatan: 25000000, 
      satuan: "Ekor" 
    }
  }
};
