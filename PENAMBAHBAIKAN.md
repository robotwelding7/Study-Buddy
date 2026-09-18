# Penambahbaikan selepas feedback

## Yang berubah

- Peraturan tambahan dalam `grading-enhanced.js`: pemadanan perkataan lengkap, alternatif khusus item, format wang dan pengiraan setara. Operasi kaedah masih mendapat markah separa apabila hasil tersalah; feedback membezakan kedua-duanya. Pengiraan bercanggah tidak dianggap jawapan betul untuk ganjaran.
- `learning-enhanced.js`: alternatif pemboleh ubah, inferens pemerhatian + sebab, alasan BM bukan kata penghubung sahaja, kumpulan konteks untuk mengelakkan petikan sama dalam satu sesi, bank kata Sains dan bajet masa.
- `app.js`: hint percuma; +3 betul tanpa bantuan, +1 dengan hint/bank kata. Jawapan salah tiada potongan. Ulangan selepas semakan/penyelesaian tidak memberi bintang tambahan.
- Karangan: Isi ialah cadangan automatik. Bahasa, Susunan dan Ejaan menunggu semakan jika ada tulisan. Komponen belum dinilai bukan sifar. Ibu bapa boleh mengisi komponen atau mengesahkan jumlah soalan. Scoreboard tidak memasukkan cubaan belum lengkap sebagai markah terbaik akhir.
- `enhancements.css` dan `index.html`: butang minimum 48px, tulisan besar pilihan, warna hangat, animasi ringkas dengan sokongan reduced-motion, panel sentuhan SVG dan paparan rajah penuh.

Kod asas data dan generator SVG tidak digantikan. Struktur lapan kertas, bank 499 item dan semua 119 gambar asal dikekalkan. Rekod lama tidak digred semula secara senyap. Sesi aktif hanya menerima metadata peraturan baharu; jawapan dan susunan pilihan tersimpan dikekalkan.

## Masa latihan

Masa ini bajet reka bentuk permulaan, bukan purata murid yang telah diukur:

| Tugasan | Bajet awal |
| --- | --- |
| Semua bahagian MCQ | 60 saat |
| Angka / koordinat tanpa langkah bertulis | 120 saat |
| Pengiraan berlangkah | 150–240 saat mengikut bilangan bahagian |
| Konsep pendek | 90 saat; respons berbilang bahagian 150 saat |
| Item dengan inferens | 180 saat |
| Perenggan hingga 50 perkataan | 420 saat |
| Karangan 80–100 perkataan | 900 saat |

Petikan mendapat 90–180 saat membaca sebelum masa menjawab. Masa membaca boleh ditamatkan lebih awal melalui “Dah baca”. Petikan sama dalam sesi tidak mendapat bajet membaca berulang. Pemasa menggunakan tarikh akhir yang disimpan, jadi masa tetap berjalan ketika berpindah halaman atau menutup aplikasi. Apabila masa menjawab tamat, jawapan yang sempat dibuat disimpan dan disemak. Tiada potongan bintang; peluang latihan semula tersedia. Simulasi tetap 75 minit keseluruhan, tanpa pemasa yang mengunci setiap item.

Bank kata hanya untuk latihan Sains, bukan simulasi. Contoh jawapan hanya selepas semakan atau penghantaran; semakan kendiri tidak mengubah markah secara automatik.

## Lima ilustrasi natural baharu

Penjana imej terbina dalam digunakan, bukan API berbayar atau sambungan ketika murid menjawab. Fail disimpan dalam `assets/` untuk penggunaan offline:

- `story-wallet-v1.png` — dompet di perpustakaan.
- `story-reading-v1.png` — membaca dan menyusun buku.
- `story-garden-v1.png` — menanam dan menyiram di sekolah.
- `story-recycle-v1.png` — projek kotak/botol di meja kelas.
- `story-sports-v1.png` — pemanasan badan, berjoging dan berehat.

Ini lima ilustrasi permulaan, bukan penggantian semua gambar dalam bank. Padanan dibuat mengikut tajuk/konteks; gambar berkebun tidak digunakan untuk cerita burung cedera walaupun kedua-duanya dahulu berkongsi kategori “garden”. Gambar rujukan penulisan asal tidak diubah. Rajah saintifik dan Matematik kekal berasaskan data.

### Prompt penjanaan

Arahan bersama: “Use case: illustration-story. Asset type: offline Grade 4 educational app story illustration. Create ONE landscape image. Style: polished naturalistic children's textbook illustration, painterly semi-realistic detail, believable anatomy and perspective, soft daylight, warm inviting colours, suitable for 10-year-olds. Not geometric clip-art, not simplistic circles/triangles/rectangles, not emoji, not a UI mockup. No text, numbers, branding or watermarks. Clear uncluttered composition.”

Adegan khusus:

1. Wallet: “A Malaysian 10-year-old schoolboy in neat primary school uniform discovers a closed brown wallet under a reading table while arranging chairs in the school library. Make the wallet clearly visible. Realistic bookshelves, wooden table, chairs, natural daylight. No other action or text.”
2. Reading: “Malaysian primary pupils share and read colourful books together at a school library reading corner; one pupil neatly arranges books on a shelf. No wallet. Realistic shelving, furniture and natural poses.”
3. Garden: “Malaysian primary pupils garden together beside a school fence: one digs a hole, one carries a small seedling, one waters a young plant. Realistic tools, soil, leafy plants, natural poses.”
4. Recycle: “Malaysian primary pupils at a classroom worktable reuse old cardboard boxes and clean plastic bottles to make a pencil holder and a toy house using paper, glue and paint. Realistic materials and hands. Projects clearly visible.”
5. Sports: “Malaysian primary pupils in appropriate school sports clothing on a school field, one warming up, two jogging, another resting and drinking water. Natural athletic poses, realistic proportions, cheerful teamwork.”

## Had dan perkara tidak ditambah

Tiada suara, rangka kerja, CDN, akaun, import rekod atau penyegerakan tablet/PC. Rekod berasingan mengikut browser/peranti dan alamat laman; eksport sedia ada dikekalkan. Penerbitan aplikasi tidak memindahkan rekod antara pratonton tempatan dengan laman GitHub. Respons bebas yang belum diliputi alternatif terkawal masih perlu semakan ibu bapa. Tiada dakwaan skema item ini pengesahan rasmi peperiksaan.
