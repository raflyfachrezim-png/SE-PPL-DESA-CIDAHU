// database.js
// Kalkulator SE Bidang Usaha Desa Cidahu (Murni Per Tahun)
// Hak Cipta: Rafly Fachrezi Desa Cidahu

const dataPatokan = {
  pertanian: {
    padi: { 
      nama: "Padi", 
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
      patokan: 1, 
      upah: 0, 
      produksi: 30000, 
      operasional: 2000, 
      nonop: 0, 
      pendapatan: 35000, 
      satuan: "KG" 
    }
  },
  peternakan: {
    domba_penggemukan: { 
      nama: "Domba Penggemukan", 
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
