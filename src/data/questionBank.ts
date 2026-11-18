import {
  AffixType,
  Round1Category,
  Round1Question,
  Round2Question,
  Round3QuestionItem,
} from '../types/game';

export const ROUND_1_FORMULAS: Record<
  Round1Category,
  { label: string; formula: string; rule: string }
> = {
  MAJEMUK: {
    label: 'KATA MAJEMUK',
    formula: 'A + B = AB',
    rule: 'Kata majemuk: A + B = AB (makna baru, masih berkaitan dengan kata penyusun)',
  },
  IDIOM: {
    label: 'IDIOM',
    formula: 'A + B = C',
    rule: 'Idiom: A + B = C (makna baru, jauh dari makna komponennya)',
  },
  FRASA: {
    label: 'FRASA',
    formula: 'A + B = A + B',
    rule: 'Frasa: A + B = A + B (tidak ada makna baru)',
  },
};

// Sumber: Bank Soal Game Rebut Kata PPU (Ronde 1: Hakim Kata — hal. 1, 11–12)
export const HAKIM_KATA_BANK: Round1Question[] = [
  // Kelompok 1 (5 soal)
  {
    id: 'r1-k1-1',
    round: 1,
    phrase: 'rumah sakit',
    category: 'MAJEMUK',
    oneLineExplanation:
      'A + B = AB: makna baru ‘tempat merawat orang sakit’, masih berkaitan dengan makna komponennya.',
  },
  {
    id: 'r1-k1-2',
    round: 1,
    phrase: 'udara segar',
    category: 'FRASA',
    oneLineExplanation:
      'A + B = A + B: tidak ada makna baru; maknanya tetap sesuai kata penyusun (udara yang segar).',
  },
  {
    id: 'r1-k1-3',
    round: 1,
    phrase: 'tangan kanan',
    category: 'IDIOM',
    oneLineExplanation:
      'A + B = C: bermakna ‘orang kepercayaan (bukan tangan sebelah kanan)’, jauh dari makna komponennya.',
  },
  {
    id: 'r1-k1-4',
    round: 1,
    phrase: 'aktivis lingkungan',
    category: 'FRASA',
    oneLineExplanation:
      'A + B = A + B: tidak ada makna baru; maknanya tetap sesuai kata penyusun (aktivis yang bergerak di bidang lingkungan).',
  },
  {
    id: 'r1-k1-5',
    round: 1,
    phrase: 'tanggung jawab',
    category: 'MAJEMUK',
    oneLineExplanation:
      'A + B = AB: makna baru ‘keadaan wajib menanggung segala sesuatunya’, masih berkaitan dengan makna komponennya.',
  },

  // Kelompok 2 (5 soal)
  {
    id: 'r1-k2-1',
    round: 1,
    phrase: 'rumah besar',
    category: 'FRASA',
    oneLineExplanation:
      'A + B = A + B: tidak ada makna baru; maknanya tetap sesuai kata penyusun (rumah yang besar).',
  },
  {
    id: 'r1-k2-2',
    round: 1,
    phrase: 'orang tua',
    category: 'MAJEMUK',
    oneLineExplanation:
      'A + B = AB: makna baru ‘ayah dan ibu’, masih berkaitan dengan makna komponennya.',
  },
  {
    id: 'r1-k2-3',
    round: 1,
    phrase: 'bunga tidur',
    category: 'IDIOM',
    oneLineExplanation:
      'A + B = C: bermakna ‘mimpi’, jauh dari makna komponennya.',
  },
  {
    id: 'r1-k2-4',
    round: 1,
    phrase: 'setiap orang',
    category: 'FRASA',
    oneLineExplanation:
      'A + B = A + B: tidak ada makna baru; maknanya tetap sesuai kata penyusun (tiap-tiap orang).',
  },
  {
    id: 'r1-k2-5',
    round: 1,
    phrase: 'tempat tinggal',
    category: 'MAJEMUK',
    oneLineExplanation:
      'A + B = AB: makna baru ‘rumah tempat orang diam (tinggal)’, masih berkaitan dengan makna komponennya.',
  },

  // Kelompok 3 (5 soal)
  {
    id: 'r1-k3-1',
    round: 1,
    phrase: 'kereta api',
    category: 'MAJEMUK',
    oneLineExplanation:
      'A + B = AB: makna baru ‘alat angkutan yang berjalan di atas rel’, masih berkaitan dengan makna komponennya.',
  },
  {
    id: 'r1-k3-2',
    round: 1,
    phrase: 'buku baru',
    category: 'FRASA',
    oneLineExplanation:
      'A + B = A + B: tidak ada makna baru; maknanya tetap sesuai kata penyusun (buku yang baru).',
  },
  {
    id: 'r1-k3-3',
    round: 1,
    phrase: 'meja hijau',
    category: 'IDIOM',
    oneLineExplanation:
      'A + B = C: bermakna ‘pengadilan’, jauh dari makna komponennya.',
  },
  {
    id: 'r1-k3-4',
    round: 1,
    phrase: 'salah satu',
    category: 'MAJEMUK',
    oneLineExplanation:
      'A + B = AB: makna baru ‘satu di antara yang ada’, masih berkaitan dengan makna komponennya.',
  },
  {
    id: 'r1-k3-5',
    round: 1,
    phrase: 'bagian penting',
    category: 'FRASA',
    oneLineExplanation:
      'A + B = A + B: tidak ada makna baru; maknanya tetap sesuai kata penyusun (bagian yang penting).',
  },

  // Kelompok 4 (5 soal)
  {
    id: 'r1-k4-1',
    round: 1,
    phrase: 'kambing hitam',
    category: 'IDIOM',
    oneLineExplanation:
      'A + B = C: bermakna ‘pihak yang dipersalahkan’, jauh dari makna komponennya.',
  },
  {
    id: 'r1-k4-2',
    round: 1,
    phrase: 'rumah tangga',
    category: 'MAJEMUK',
    oneLineExplanation:
      'A + B = AB: makna baru ‘keluarga beserta urusan kehidupannya’, masih berkaitan dengan makna komponennya.',
  },
  {
    id: 'r1-k4-3',
    round: 1,
    phrase: 'pelayanan kesehatan',
    category: 'FRASA',
    oneLineExplanation:
      'A + B = A + B: tidak ada makna baru; maknanya tetap sesuai kata penyusun (pelayanan di bidang kesehatan).',
  },
  {
    id: 'r1-k4-4',
    round: 1,
    phrase: 'gaya hidup',
    category: 'MAJEMUK',
    oneLineExplanation:
      'A + B = AB: makna baru ‘pola hidup seseorang’, masih berkaitan dengan makna komponennya.',
  },
  {
    id: 'r1-k4-5',
    round: 1,
    phrase: 'baju merah',
    category: 'FRASA',
    oneLineExplanation:
      'A + B = A + B: tidak ada makna baru; maknanya tetap sesuai kata penyusun (baju yang berwarna merah).',
  },

  // Kelompok 5 (5 soal)
  {
    id: 'r1-k5-1',
    round: 1,
    phrase: 'buku tulis',
    category: 'MAJEMUK',
    oneLineExplanation:
      'A + B = AB: makna baru ‘buku untuk menulis’, masih berkaitan dengan makna komponennya.',
  },
  {
    id: 'r1-k5-2',
    round: 1,
    phrase: 'air dingin',
    category: 'FRASA',
    oneLineExplanation:
      'A + B = A + B: tidak ada makna baru; maknanya tetap sesuai kata penyusun (air yang dingin).',
  },
  {
    id: 'r1-k5-3',
    round: 1,
    phrase: 'panjang tangan',
    category: 'IDIOM',
    oneLineExplanation:
      'A + B = C: bermakna ‘suka mencuri’, jauh dari makna komponennya.',
  },
  {
    id: 'r1-k5-4',
    round: 1,
    phrase: 'terima kasih',
    category: 'MAJEMUK',
    oneLineExplanation:
      'A + B = AB: makna baru ‘ungkapan syukur atas kebaikan orang lain’, masih berkaitan dengan makna komponennya.',
  },
  {
    id: 'r1-k5-5',
    round: 1,
    phrase: 'guru muda',
    category: 'FRASA',
    oneLineExplanation:
      'A + B = A + B: tidak ada makna baru; maknanya tetap sesuai kata penyusun (guru yang muda).',
  },

  // Soal cadangan dan penentu (5 soal)
  {
    id: 'r1-cad-1',
    round: 1,
    phrase: 'sapu tangan',
    category: 'MAJEMUK',
    oneLineExplanation:
      'A + B = AB: makna baru ‘kain kecil untuk menyeka’, masih berkaitan dengan makna komponennya.',
  },
  {
    id: 'r1-cad-2',
    round: 1,
    phrase: 'buah bibir',
    category: 'IDIOM',
    oneLineExplanation:
      'A + B = C: bermakna ‘bahan pembicaraan orang’, jauh dari makna komponennya.',
  },
  {
    id: 'r1-cad-3',
    round: 1,
    phrase: 'kopi pahit',
    category: 'FRASA',
    oneLineExplanation:
      'A + B = A + B: tidak ada makna baru; maknanya tetap sesuai kata penyusun (kopi yang pahit).',
  },
  {
    id: 'r1-cad-4',
    round: 1,
    phrase: 'lalu lintas',
    category: 'MAJEMUK',
    oneLineExplanation:
      'A + B = AB: makna baru ‘perjalanan kendaraan di jalan’, masih berkaitan dengan makna komponennya.',
  },
  {
    id: 'r1-cad-5',
    round: 1,
    phrase: 'naik daun',
    category: 'IDIOM',
    oneLineExplanation:
      'A + B = C: bermakna ‘menjadi terkenal’, jauh dari makna komponennya.',
  },
];

// Sumber: Bank Soal Game Rebut Kata PPU (Ronde 2: Rebut Makna — hal. 2–6, 13–14)
export const REBUT_MAKNA_BANK: Round2Question[] = [
  // Kelompok 1 (No 1–5)
  {
    id: 'r2-k1-1',
    round: 2,
    affix: 'ber-',
    sentenceBefore: 'Bebek di peternakan itu ',
    targetWord: 'bertelur',
    sentenceAfter: ' setiap hari.',
    options: [
      'Memiliki sesuatu',
      'Memakai atau menggunakan',
      'Menghasilkan atau mengeluarkan',
      'Melakukan pekerjaan tertentu',
    ],
    correctIndex: 2,
    oneLineExplanation:
      'Kata dasar telur (nomina); ber- + nomina = menghasilkan/mengeluarkan.',
  },
  {
    id: 'r2-k1-2',
    round: 2,
    affix: 'meng-kan',
    sentenceBefore: 'Kabar kegagalan itu ',
    targetWord: 'mengecewakan',
    sentenceAfter: ' seluruh pendukung tim.',
    options: [
      'Objek bernyawa mengalami perasaan',
      'Subjek mengalami perasaan',
      'Memberi manfaat bagi objek',
      'Menjadikan objek sebagai alat',
    ],
    correctIndex: 0,
    oneLineExplanation:
      'Kata dasar kecewa (adjektiva); subjek (kabar) membuat objek bernyawa (pendukung) mengalami perasaan.',
  },
  {
    id: 'r2-k1-3',
    round: 2,
    affix: 'ke-an',
    sentenceBefore: 'Sup buatan koki baru itu ',
    targetWord: 'keasinan',
    sentenceAfter: ' sehingga tidak dihabiskan.',
    options: [
      'Perihal atau keadaan',
      'Terlalu',
      'Mengalami kejadian tidak menyenangkan',
      'Dapat di-',
    ],
    correctIndex: 1,
    oneLineExplanation:
      'Kata dasar asin (adjektiva); ke-an yang membentuk adjektiva (predikat) = terlalu.',
  },
  {
    id: 'r2-k1-4',
    round: 2,
    affix: 'per-an',
    sentenceBefore: 'Para siswa bermalam di ',
    targetWord: 'perkemahan',
    sentenceAfter: ' yang terletak di tepi danau.',
    options: [
      'Perbuatan atau peristiwa',
      'Hasil perbuatan',
      'Hal atau keadaan',
      'Tempat',
    ],
    correctIndex: 3,
    oneLineExplanation:
      'Kata dasar kemah (nomina); per-an pada konteks ini = tempat.',
  },
  {
    id: 'r2-k1-5',
    round: 2,
    affix: 'meng-',
    sentenceBefore: 'Adik ',
    targetWord: 'menyanyi',
    sentenceAfter: ' di acara perpisahan sekolah.',
    options: [
      'Menjadi atau bersifat',
      'Melakukan perbuatan (pangkal verba)',
      'Mengeluarkan bunyi',
      'Mencari atau mengumpulkan',
    ],
    correctIndex: 1,
    oneLineExplanation:
      'Kata dasar nyanyi (verba); meng- + verba = pangkal verba.',
  },

  // Kelompok 2 (No 6–10)
  {
    id: 'r2-k2-1',
    round: 2,
    affix: 'meng-kan',
    sentenceBefore: 'Kakek ',
    targetWord: 'membelikan',
    sentenceAfter: ' cucunya sepeda baru saat ulang tahun.',
    options: [
      'Menyebabkan objek menjadi sesuatu',
      'Menjadikan objek sebagai alat',
      'Memasukkan objek ke suatu tempat',
      'Memberi manfaat bagi objek (benefaktif)',
    ],
    correctIndex: 3,
    oneLineExplanation:
      'Kata dasar beli (verba); perbuatan memberi manfaat kepada objek (benefaktif).',
  },
  {
    id: 'r2-k2-2',
    round: 2,
    affix: 'ke-an',
    sentenceBefore: 'Pedagang itu ',
    targetWord: 'kecopetan',
    sentenceAfter: ' saat berbelanja di pasar.',
    options: [
      'Mengalami kejadian tidak menyenangkan',
      'Perihal atau keadaan',
      'Terlalu',
      'Dapat di-',
    ],
    correctIndex: 0,
    oneLineExplanation:
      'Kata dasar copet; ke-an bentuk verba = mengalami kejadian tidak menyenangkan.',
  },
  {
    id: 'r2-k2-3',
    round: 2,
    affix: '-an',
    sentenceBefore: 'Ibu membeli ',
    targetWord: 'timbangan',
    sentenceAfter: ' baru untuk warungnya.',
    options: [
      'Hasil tindakan',
      'Yang dikenai tindakan',
      'Alat',
      'Kumpulan atau gugusan',
    ],
    correctIndex: 2,
    oneLineExplanation:
      'Kata dasar timbang (verba); -an = alat.',
  },
  {
    id: 'r2-k2-4',
    round: 2,
    affix: 'ter-',
    sentenceBefore: 'Adik ',
    targetWord: 'terjatuh',
    sentenceAfter: ' di tangga sekolah.',
    options: [
      'Paling',
      'Sudah (perfektif)',
      'Dapat atau sanggup dilakukan',
      'Mengalami peristiwa tidak sengaja',
    ],
    correctIndex: 3,
    oneLineExplanation:
      'Kata dasar jatuh (verba); ter- = peristiwa tidak sengaja/tiba-tiba.',
  },
  {
    id: 'r2-k2-5',
    round: 2,
    affix: 'meng-kan',
    sentenceBefore: 'Peternak itu ',
    targetWord: 'mengandangkan',
    sentenceAfter: ' sapinya sebelum hujan deras.',
    options: [
      'Memberi manfaat bagi objek',
      'Memasukkan objek ke tempat tertentu',
      'Menjadikan objek sebagai alat',
      'Objek bernyawa mengalami perasaan',
    ],
    correctIndex: 1,
    oneLineExplanation:
      'Kata dasar kandang (nomina); meng-kan = memasukkan/membawa objek ke tempat.',
  },

  // Kelompok 3 (No 11–15)
  {
    id: 'r2-k3-1',
    round: 2,
    affix: 'ke-an',
    sentenceBefore: 'Suara azan ',
    targetWord: 'kedengaran',
    sentenceAfter: ' jelas dari asrama.',
    options: [
      'Perihal atau keadaan',
      'Terlalu',
      'Dapat di- (dapat didengar)',
      'Mengalami kejadian tidak menyenangkan',
    ],
    correctIndex: 2,
    oneLineExplanation:
      'Kata dasar dengar (verba); ke-an bentuk verba = dapat di-.',
  },
  {
    id: 'r2-k3-2',
    round: 2,
    affix: 'peng-an',
    sentenceBefore: '',
    targetWord: 'Pembangunan',
    sentenceAfter: ' jembatan itu memakan waktu dua tahun.',
    options: [
      'Proses atau perbuatan',
      'Tempat',
      'Hasil perbuatan',
      'Hal atau keadaan',
    ],
    correctIndex: 0,
    oneLineExplanation:
      'Kata dasar bangun (verba); peng-an (bentuk pem-an) = proses/perbuatan.',
  },
  {
    id: 'r2-k3-3',
    round: 2,
    affix: 'ber-',
    sentenceBefore: 'Pak Rudi ',
    targetWord: 'bermobil',
    sentenceAfter: ' menuju kantor setiap pagi.',
    options: [
      'Memakai, menggunakan, atau naik',
      'Memiliki sesuatu',
      'Menghasilkan sesuatu',
      'Hubungan timbal balik',
    ],
    correctIndex: 0,
    oneLineExplanation:
      'Kata dasar mobil (nomina); ber- = memakai/menggunakan/naik.',
  },
  {
    id: 'r2-k3-4',
    round: 2,
    affix: 'meng-i',
    sentenceBefore: 'Anak-anak ',
    targetWord: 'memukuli',
    sentenceAfter: ' bedug itu dengan penuh semangat.',
    options: [
      'Subjek bergerak ke arah objek',
      'Memberi manfaat bagi objek',
      'Perbuatan berulang (repetitif)',
      'Menyebabkan keadaan tertentu',
    ],
    correctIndex: 2,
    oneLineExplanation:
      'Kata dasar pukul (verba); meng-i = perbuatan berulang (memukul berkali-kali).',
  },
  {
    id: 'r2-k3-5',
    round: 2,
    affix: 'meng-',
    sentenceBefore: 'Singa di kebun binatang itu ',
    targetWord: 'mengaum',
    sentenceAfter: ' dengan keras.',
    options: [
      'Menjadi atau bersifat',
      'Melakukan perbuatan (pangkal verba)',
      'Menuju atau bergerak ke arah',
      'Mengeluarkan bunyi atau sesuatu',
    ],
    correctIndex: 3,
    oneLineExplanation:
      'Kata dasar aum (nomina); meng- = mengeluarkan bunyi.',
  },

  // Kelompok 4 (No 16–20)
  {
    id: 'r2-k4-1',
    round: 2,
    affix: 'per-an',
    sentenceBefore: 'Ia bekerja di bidang ',
    targetWord: 'perkapalan',
    sentenceAfter: ' sejak lulus kuliah.',
    options: [
      'Tempat',
      'Hal yang berkaitan dengan kata dasar',
      'Hasil perbuatan',
      'Perbuatan atau peristiwa',
    ],
    correctIndex: 1,
    oneLineExplanation:
      'Kata dasar kapal (nomina); per-an = hal yang berkaitan dengan kapal.',
  },
  {
    id: 'r2-k4-2',
    round: 2,
    affix: 'ter-',
    sentenceBefore: 'Gunung itu merupakan puncak ',
    targetWord: 'tertinggi',
    sentenceAfter: ' di pulau ini.',
    options: [
      'Mengalami peristiwa tidak sengaja',
      'Paling',
      'Sudah (perfektif)',
      'Dapat atau sanggup dilakukan',
    ],
    correctIndex: 1,
    oneLineExplanation:
      'Kata dasar tinggi (adjektiva); ter- + adjektiva = paling.',
  },
  {
    id: 'r2-k4-3',
    round: 2,
    affix: 'meng-i',
    sentenceBefore: 'Para peserta ',
    targetWord: 'memasuki',
    sentenceAfter: ' ruang ujian dengan tertib.',
    options: [
      'Subjek bergerak ke arah objek',
      'Perbuatan berulang (repetitif)',
      'Memberi manfaat bagi objek',
      'Menyebabkan keadaan tertentu',
    ],
    correctIndex: 0,
    oneLineExplanation:
      'Kata dasar masuk (verba); meng-i = subjek bergerak ke arah objek.',
  },
  {
    id: 'r2-k4-4',
    round: 2,
    affix: 'peng-an',
    sentenceBefore: 'Wisatawan memesan kamar di ',
    targetWord: 'penginapan',
    sentenceAfter: ' dekat pantai.',
    options: [
      'Proses atau perbuatan',
      'Hasil perbuatan',
      'Tempat',
      'Hal atau keadaan',
    ],
    correctIndex: 2,
    oneLineExplanation:
      'Kata dasar inap (verba); peng-an = tempat.',
  },
  {
    id: 'r2-k4-5',
    round: 2,
    affix: '-an',
    sentenceBefore: '',
    targetWord: 'Sayuran',
    sentenceAfter: ' segar dijual di pasar pagi.',
    options: [
      'Hasil tindakan',
      'Alat',
      'Yang dikenai tindakan',
      'Kumpulan atau gugusan',
    ],
    correctIndex: 3,
    oneLineExplanation:
      'Kata dasar sayur (nomina); -an = kumpulan/gugusan.',
  },

  // Kelompok 5 (No 21–25)
  {
    id: 'r2-k5-1',
    round: 2,
    affix: 'ber-',
    sentenceBefore: 'Penduduk desa itu ',
    targetWord: 'bertani',
    sentenceAfter: ' sejak muda.',
    options: [
      'Pekerjaan atau profesi',
      'Cabang olahraga',
      'Memiliki sesuatu',
      'Menghasilkan sesuatu',
    ],
    correctIndex: 0,
    oneLineExplanation:
      'Kata dasar tani (nomina); ber- = pekerjaan/profesi.',
  },
  {
    id: 'r2-k5-2',
    round: 2,
    affix: 'meng-',
    sentenceBefore: 'Sapi-sapi itu ',
    targetWord: 'merumput',
    sentenceAfter: ' di padang yang luas.',
    options: [
      'Mengeluarkan bunyi atau sesuatu',
      'Menjadi atau seperti kata dasar',
      'Mencari atau mengumpulkan',
      'Menuju atau bergerak ke arah',
    ],
    correctIndex: 2,
    oneLineExplanation:
      'Kata dasar rumput (nomina); meng- = mencari/mengumpulkan.',
  },
  {
    id: 'r2-k5-3',
    round: 2,
    affix: 'ter-',
    sentenceBefore: 'Pintu gerbang sekolah itu sudah ',
    targetWord: 'terbuka',
    sentenceAfter: ' sejak pagi.',
    options: [
      'Paling',
      'Sudah (perfektif)',
      'Mengalami peristiwa tidak sengaja',
      'Dapat atau sanggup dilakukan',
    ],
    correctIndex: 1,
    oneLineExplanation:
      'Kata dasar buka (verba); ter- = makna perfektif ‘sudah’.',
  },
  {
    id: 'r2-k5-4',
    round: 2,
    affix: 'meng-i',
    sentenceBefore: 'Kakak ',
    targetWord: 'meminjami',
    sentenceAfter: ' adik uang saku untuk membeli buku.',
    options: [
      'Subjek bergerak ke arah objek',
      'Perbuatan berulang (repetitif)',
      'Menyebabkan keadaan tertentu',
      'Memberi manfaat bagi objek (benefaktif)',
    ],
    correctIndex: 3,
    oneLineExplanation:
      'Kata dasar pinjam (verba); meng-i = benefaktif.',
  },
  {
    id: 'r2-k5-5',
    round: 2,
    affix: 'peng-an',
    sentenceBefore: '',
    targetWord: 'Penghasilan',
    sentenceAfter: ' orang tuanya tidak tetap setiap bulan.',
    options: [
      'Hasil perbuatan',
      'Proses atau perbuatan',
      'Tempat',
      'Hal atau keadaan',
    ],
    correctIndex: 0,
    oneLineExplanation:
      'Kata dasar hasil; peng-an = hasil perbuatan.',
  },
];

// Sumber: Bank Soal Game Rebut Kata PPU (Ronde 3: Duel Final — Set A & Set B, hal. 7–10, 15)
const ROUND3_SET_A: Round3QuestionItem[] = [
  {
    id: 'r3-a1',
    affix: 'ke-an',
    word: 'kekecilan',
    contextSentence: 'Sepatu baru itu kekecilan di kaki adik.',
    baskets: [
      'Perihal atau keadaan',
      'Terlalu',
      'Mengalami kejadian tidak menyenangkan',
    ],
    correctBasketIndex: 1,
    note: 'Kata dasar kecil (adjektiva); ke-an pada predikat adjektiva = terlalu.',
  },
  {
    id: 'r3-a2',
    affix: 'ber-',
    word: 'bersahabat',
    contextSentence: 'Dua tetangga itu bersahabat sejak masa kecil.',
    baskets: [
      'Memiliki sesuatu',
      'Memakai atau menggunakan',
      'Hubungan timbal balik',
    ],
    correctBasketIndex: 2,
    note: 'Kata dasar sahabat (nomina); ber- = hubungan timbal balik.',
  },
  {
    id: 'r3-a3',
    affix: 'meng-',
    word: 'mengudara',
    contextSentence: 'Pesawat itu segera mengudara setelah mendapat izin.',
    baskets: [
      'Menuju atau bergerak ke arah',
      'Mengeluarkan bunyi',
      'Menjadi atau seperti',
    ],
    correctBasketIndex: 0,
    note: 'Kata dasar udara (nomina); meng- = menuju/bergerak ke arah.',
  },
  {
    id: 'r3-a4',
    affix: 'meng-kan',
    word: 'mengikatkan',
    contextSentence: 'Ia mengikatkan pita merah pada rambutnya.',
    baskets: [
      'Memberi manfaat bagi objek',
      'Objek menjadi alat tindakan',
      'Memasukkan objek ke tempat',
    ],
    correctBasketIndex: 1,
    note: 'Kata dasar ikat (verba); objek (pita) menjadi alat untuk mengikat.',
  },
  {
    id: 'r3-a5',
    affix: 'ter-',
    word: 'terbangun',
    contextSentence: 'Ia terbangun ketika mendengar suara petir.',
    baskets: [
      'Paling',
      'Sudah (perfektif)',
      'Mengalami peristiwa tidak terduga',
    ],
    correctBasketIndex: 2,
    note: 'Kata dasar bangun (verba); ter- = peristiwa tiba-tiba/tidak terduga.',
  },
  {
    id: 'r3-a6',
    affix: 'peng-an',
    word: 'Pengerukan',
    contextSentence: 'Pengerukan sungai dilakukan setiap tahun.',
    baskets: ['Proses atau kegiatan', 'Tempat', 'Hasil perbuatan'],
    correctBasketIndex: 0,
    note: 'Kata dasar keruk; peng-an = proses/kegiatan.',
  },
  {
    id: 'r3-a7',
    affix: 'meng-i',
    word: 'mendekati',
    contextSentence: 'Anak itu perlahan mendekati ibunya.',
    baskets: [
      'Perbuatan berulang',
      'Berada di sekitar atau menuju objek',
      'Memberi manfaat bagi objek',
    ],
    correctBasketIndex: 1,
    note: 'Kata dasar dekat; meng-i (lokatif) = berada di sekitar/menuju objek.',
  },
  {
    id: 'r3-a8',
    affix: 'per-an',
    word: 'Persetujuan',
    contextSentence: 'Persetujuan kedua pihak dicapai setelah rapat panjang.',
    baskets: [
      'Hasil perbuatan',
      'Tempat',
      'Hal yang berkaitan dengan kata dasar',
    ],
    correctBasketIndex: 0,
    note: 'Kata dasar setuju; per-an = hasil perbuatan.',
  },
  {
    id: 'r3-a9',
    affix: '-an',
    word: 'Makanan',
    contextSentence: 'Makanan itu sudah disiapkan di meja makan.',
    baskets: ['Alat', 'Kumpulan atau gugusan', 'Yang dikenai tindakan'],
    correctBasketIndex: 2,
    note: 'Kata dasar makan (verba); -an = yang dikenai tindakan.',
  },
  {
    id: 'r3-a10',
    affix: 'ke-an',
    word: 'Kebaikan',
    contextSentence: 'Kebaikan guru itu selalu diingat murid-muridnya.',
    baskets: ['Terlalu', 'Perihal atau keadaan', 'Dapat di-'],
    correctBasketIndex: 1,
    note: 'Kata dasar baik (adjektiva); ke-an pada subjek (nomina) = perihal.',
  },
];

const ROUND3_SET_B: Round3QuestionItem[] = [
  {
    id: 'r3-b1',
    affix: 'ter-',
    word: 'tercinta',
    contextSentence: 'Ibu tercinta menunggu kami di rumah.',
    baskets: ['Yang di- (yang dicintai)', 'Paling', 'Sudah (perfektif)'],
    correctBasketIndex: 0,
    note: 'Kata dasar cinta; ter- = ‘yang di-’ (yang dicintai), bukan ‘paling’.',
  },
  {
    id: 'r3-b2',
    affix: 'meng-kan',
    word: 'meratukan',
    contextSentence: 'Suami itu sangat meratukan istrinya.',
    baskets: [
      'Memberi manfaat bagi objek',
      'Objek menjadi alat tindakan',
      'Menjadikan atau menempatkan sebagai',
    ],
    correctBasketIndex: 2,
    note: 'Kata dasar ratu (nomina); meng-kan = menjadikan/menempatkan sebagai.',
  },
  {
    id: 'r3-b3',
    affix: 'ber-',
    word: 'berselancar',
    contextSentence: 'Ia berselancar di pantai setiap akhir pekan.',
    baskets: [
      'Pekerjaan atau profesi',
      'Cabang olahraga',
      'Memakai atau menggunakan',
    ],
    correctBasketIndex: 1,
    note: 'Kata dasar selancar (nomina); ber- = cabang olahraga.',
  },
  {
    id: 'r3-b4',
    affix: 'ke-an',
    word: 'kehujanan',
    contextSentence: 'Kami kehujanan saat pulang dari sekolah.',
    baskets: [
      'Mengalami akibat peristiwa alam',
      'Terlalu',
      'Perihal atau keadaan',
    ],
    correctBasketIndex: 0,
    note: 'Kata dasar hujan (nomina); ke-an = mengalami akibat peristiwa alam.',
  },
  {
    id: 'r3-b5',
    affix: 'meng-',
    word: 'menguning',
    contextSentence: 'Daun-daun itu perlahan menguning di musim kemarau.',
    baskets: [
      'Mengeluarkan bunyi',
      'Mencari atau mengumpulkan',
      'Menjadi atau bersifat',
    ],
    correctBasketIndex: 2,
    note: 'Kata dasar kuning (adjektiva); meng- = menjadi/bersifat.',
  },
  {
    id: 'r3-b6',
    affix: 'per-an',
    word: 'Perdamaian',
    contextSentence: 'Perdamaian antarnegara itu akhirnya tercapai.',
    baskets: ['Tempat', 'Hal atau keadaan', 'Hasil perbuatan'],
    correctBasketIndex: 1,
    note: 'Kata dasar damai (adjektiva); per-an = hal/keadaan.',
  },
  {
    id: 'r3-b7',
    affix: '-an',
    word: 'Ribuan',
    contextSentence: 'Ribuan orang memadati lapangan kota.',
    baskets: ['Jumlah banyak (kumpulan)', 'Hasil tindakan', 'Alat'],
    correctBasketIndex: 0,
    note: 'Kata dasar ribu (numeralia); -an = jumlah banyak/kumpulan.',
  },
  {
    id: 'r3-b8',
    affix: 'peng-an',
    word: 'penjagalan',
    contextSentence: 'Bau menyengat tercium dari penjagalan ternak di ujung desa.',
    baskets: ['Proses atau perbuatan', 'Hasil perbuatan', 'Tempat'],
    correctBasketIndex: 2,
    note: 'Kata dasar jagal; peng-an = tempat.',
  },
  {
    id: 'r3-b9',
    affix: 'meng-i',
    word: 'membasahi',
    contextSentence: 'Hujan deras membasahi halaman sekolah.',
    baskets: [
      'Perbuatan berulang',
      'Menyebabkan keadaan tertentu (kausatif)',
      'Subjek bergerak ke arah objek',
    ],
    correctBasketIndex: 1,
    note: 'Kata dasar basah (adjektiva); meng-i = kausatif (menyebabkan objek basah).',
  },
  {
    id: 'r3-b10',
    affix: 'ke-an',
    word: 'ketahuan',
    contextSentence: 'Perbuatannya ketahuan oleh guru.',
    baskets: [
      'Tidak disengaja atau diketahui pihak lain',
      'Terlalu',
      'Perihal atau keadaan',
    ],
    correctBasketIndex: 0,
    note: 'Kata dasar tahu (verba); ke-an = tidak disengaja/yang diketahui.',
  },
];

export const ALL_ROUND3_BANK: Round3QuestionItem[] = [
  ...ROUND3_SET_A,
  ...ROUND3_SET_B,
];

// Sumber: Bank Soal Game Rebut Kata PPU (Soal Penentu — hal. 10, 15)
export const TIE_BREAKER_BANK: Round2Question[] = [
  {
    id: 'penentu-1',
    round: 2,
    affix: 'meng-kan',
    sentenceBefore: 'Ia ',
    targetWord: 'meninggalkan',
    sentenceAfter: ' rumah lama itu sebelum fajar.',
    options: [
      'Objek menjadi sasaran tindakan',
      'Memberi manfaat bagi objek',
      'Objek menjadi alat tindakan',
    ],
    correctIndex: 0,
    oneLineExplanation:
      'Kata dasar tinggal (verba); objek (rumah) menjadi sasaran tindakan.',
  },
  {
    id: 'penentu-2',
    round: 2,
    affix: 'ter-',
    sentenceBefore: 'Barang semahal itu tidak ',
    targetWord: 'terbeli',
    sentenceAfter: ' olehnya.',
    options: [
      'Sudah (perfektif)',
      'Mengalami peristiwa tidak terduga',
      'Dapat atau sanggup dilakukan',
    ],
    correctIndex: 2,
    oneLineExplanation:
      'Didahului kata tidak; ter- = dapat/sanggup dilakukan.',
  },
  {
    id: 'penentu-3',
    round: 2,
    affix: '-an',
    sentenceBefore: 'Ia duduk di ',
    targetWord: 'tepian',
    sentenceAfter: ' sungai.',
    options: ['Alat', 'Tempat', 'Hasil tindakan'],
    correctIndex: 1,
    oneLineExplanation: 'Kata dasar tepi (nomina); -an = tempat.',
  },
];

export function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Ronde 1: 5 soal per kelompok sesuai pembagian Kelompok 1–5 pada bank soal
export function buildRound1Deck(groupCount: number): Round1Question[] {
  return HAKIM_KATA_BANK.slice(0, groupCount * 5);
}

// Ronde 2: 5 soal utama per kelompok sesuai pembagian Kelompok 1–5 pada bank soal
export function buildRound2Deck(groupCount: number): Round2Question[] {
  return REBUT_MAKNA_BANK.slice(0, groupCount * 5);
}

// Ronde 3: Pilih 5 jenis imbuhan secara acak dari bank soal Ronde 3,
// lalu bagikan pasangan soal berimbuhan sama (berbeda kata) kepada kedua finalis agar variasi & tingkat kesulitan setara
export function buildRound3FinalDecks(): [Round3QuestionItem[], Round3QuestionItem[]] {
  const allAffixes: AffixType[] = [
    'ber-',
    'meng-',
    'ter-',
    'meng-kan',
    'meng-i',
    'ke-an',
    'peng-an',
    'per-an',
    '-an',
  ];

  const chosenAffixes = shuffleArray(allAffixes).slice(0, 5);
  const deckA: Round3QuestionItem[] = [];
  const deckB: Round3QuestionItem[] = [];

  for (const affix of chosenAffixes) {
    const setAPool = shuffleArray(ROUND3_SET_A.filter((item) => item.affix === affix));
    const setBPool = shuffleArray(ROUND3_SET_B.filter((item) => item.affix === affix));

    const pairA = setAPool[0];
    const pairB = setBPool[0];

    if (pairA && pairB) {
      if (Math.random() < 0.5) {
        deckA.push(pairA);
        deckB.push(pairB);
      } else {
        deckA.push(pairB);
        deckB.push(pairA);
      }
    } else {
      const combined = shuffleArray(ALL_ROUND3_BANK.filter((item) => item.affix === affix));
      if (combined[0]) deckA.push(combined[0]);
      if (combined[1]) deckB.push(combined[1]);
    }
  }

  return [shuffleArray(deckA), shuffleArray(deckB)];
}
