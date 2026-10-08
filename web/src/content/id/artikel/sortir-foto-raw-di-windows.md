---
key: raw
title: Cara sortir foto RAW di Windows tanpa Lightroom
description: Sortir foto RAW dan pasangan RAW+JPG di Windows dengan cepat tanpa impor ke katalog: pakai preview JPEG bawaan, pilih dulu, edit belakangan.
date: 2026-10-08
---

Cara tercepat menyortir foto RAW di Windows adalah memakai aplikasi yang membaca preview JPEG yang tertanam di dalam file RAW, bukan aplikasi yang harus mengimpor dan merender setiap file. Dengan cara ini foto langsung tampil tanpa menunggu. Anda memilih dan menolak lebih dulu, lalu hanya foto yang lolos yang dibawa ke Lightroom atau editor lain. Pastikan juga pasangan RAW dan JPG dengan nama yang sama selalu dipindah bersama.

## Kenapa sortir foto RAW sering lambat

File RAW berisi data mentah dari sensor kamera. Untuk menampilkannya dengan benar, aplikasi editor harus "mengembangkan" data itu: menerapkan white balance, kurva warna, dan koreksi lensa. Proses ini berat, apalagi untuk ratusan file berukuran puluhan megabyte.

Masalahnya makin terasa kalau Anda memakai editor berbasis katalog untuk memilih foto:

- **Impor memakan waktu.** Semua file harus didaftarkan ke katalog sebelum bisa dilihat.
- **Preview harus dibuat dulu.** Sampai preview selesai dibuat, berpindah foto terasa tersendat.
- **Foto yang akhirnya dibuang ikut diproses.** Padahal sebagian besar hasil pemotretan biasanya tidak dipakai.

Viewer bawaan Windows juga belum tentu membantu. Dukungan RAW-nya bergantung pada codec yang terpasang, dan tidak ada cara praktis untuk memindahkan pasangan RAW+JPG sekaligus.

## Preview JPEG bawaan: kunci sortir cepat

Hampir semua kamera menyimpan gambar JPEG ukuran penuh atau besar di dalam file RAW. Gambar ini dibuat kamera saat memotret, sama dengan yang Anda lihat di layar kamera.

Untuk keperluan memilih, preview ini sudah cukup:

- **Cukup tajam untuk cek fokus** saat diperbesar.
- **Ekspresi, mata terbuka, dan komposisi** terlihat jelas.
- **Tidak perlu diproses ulang,** jadi tampil seketika.

Yang perlu diingat: warna dan kecerahan preview mengikuti pengaturan kamera, bukan hasil editing Anda nanti. Untuk memilih foto, ini tidak jadi masalah.

## Menjaga pasangan RAW dan JPG tetap bersama

Banyak fotografer memotret RAW+JPG. JPG dipakai untuk kirim cepat, RAW untuk editing. Saat menyortir manual di File Explorer, mudah sekali memindahkan JPG-nya saja dan meninggalkan RAW-nya, atau sebaliknya.

Aturan sederhananya: **file dengan nama dasar yang sama adalah satu foto.** `IMG_1234.CR3` dan `IMG_1234.JPG` harus selalu berada di folder yang sama. Aplikasi sortir yang baik memperlakukan keduanya sebagai satu kesatuan.

## Alur kerja sortir RAW sebelum editing

1. **Salin kartu memori ke satu folder per acara.** Jangan langsung impor ke katalog editor.
2. **Tentukan target jumlah foto.** Target membuat penyaringan lebih tegas. Baca juga [cara memilih foto terbaik](/artikel/cara-memilih-foto-terbaik) untuk kriteria dan metodenya.
3. **Sortir memakai preview JPEG bawaan.** Pilih dan tolak dengan keyboard, dalam beberapa putaran sampai jumlahnya pas.
4. **Pindahkan foto terpilih ke subfolder khusus,** lengkap dengan pasangan RAW dan JPG-nya.
5. **Impor hanya subfolder itu ke Lightroom atau editor lain.** Katalog Anda tetap ringan, dan waktu editing hanya dipakai untuk foto yang benar-benar dipakai.

## Kesalahan umum saat sortir foto RAW

Beberapa kebiasaan membuat sortir foto RAW lebih lama atau berisiko kehilangan file:

- **Menghapus foto saat memilih.** Begitu terhapus, foto yang ternyata dibutuhkan klien tidak bisa dikembalikan. Lebih aman memindahkan foto terpilih ke folder lain dan membiarkan sisanya.
- **Mengedit sebelum selesai memilih.** Mengatur warna satu foto memang menggoda, tapi itu memecah fokus. Selesaikan sortir dulu.
- **Menilai warna dari preview.** Preview mengikuti profil kamera. Foto yang tampak terlalu gelap atau kekuningan biasanya masih bisa diperbaiki dari data RAW-nya, jadi nilai fokus dan momennya saja.
- **Memisahkan RAW dan JPG secara manual.** Memindah file satu per satu di File Explorer rawan terlewat. Satu file yang tertinggal berarti Anda harus mencarinya lagi nanti.
- **Memilih dari urutan nama file saat memakai dua kamera.** Nomor file dari dua kamera tidak berurutan menurut waktu. Urutkan menurut tanggal diambil supaya momen yang sama tetap berdekatan.
- **Menyortir langsung dari kartu memori.** Salin dulu ke disk. Kartu lebih lambat dan lebih mudah rusak.

## Sortir foto RAW dengan Pulahpilih

[Pulahpilih](/) mengikuti alur di atas. Aplikasi ini gratis, open source, dan berjalan di Windows 10 dan 11 (64-bit).

- **Format yang didukung:** CR2, CR3, NEF, ARW, DNG, RAF, ORF, RW2, PEF, dan SRW, serta JPG, PNG, dan WebP. HEIC belum didukung.
- **Preview RAW memakai JPEG bawaan,** jadi foto tampil cepat tanpa proses impor.
- **Pasangan RAW+JPG dengan nama sama dipindah bersama.** Kalau ada JPG-nya, JPG itu yang ditampilkan.
- **Tiga foto tampil sekaligus.** Tekan → atau ↑ untuk memilih, ← atau ↓ untuk menolak, Spasi atau Z untuk memperbesar, Backspace untuk mengurungkan.
- **Foto terpilih masuk ke subfolder `selected`.** Putaran berikutnya menyaring isi folder itu sampai jumlahnya pas dengan target. Foto yang ditolak tetap di folder awal, dan tidak ada file yang dihapus.
- **Urutkan menurut tanggal diambil (EXIF)** supaya foto beruntun dari momen yang sama berdekatan.

Setelah selesai, impor folder `selected` ke editor pilihan Anda. Perbedaan dengan editor katalog dibahas lebih rinci di [Pulahpilih vs Lightroom](/bandingkan/pulahpilih-vs-lightroom) dan [Pulahpilih vs FastRawViewer](/bandingkan/pulahpilih-vs-fastrawviewer).

Contoh alur untuk [foto pernikahan](/kegunaan/foto-pernikahan) dan [foto event](/kegunaan/foto-event) juga tersedia.

[Unduh Pulahpilih](/#unduh) dan coba pada satu folder hasil pemotretan Anda.

## FAQ

### Apakah preview JPEG bawaan cukup untuk cek fokus?

Pada sebagian besar kamera modern, ya. Preview bawaan biasanya berukuran penuh atau besar, jadi ketajaman mata dan detail terlihat saat diperbesar.

### Apakah file RAW diubah saat disortir?

Tidak. Pulahpilih hanya membaca preview dan memindahkan file antar folder. Isi file RAW tidak disentuh dan tidak ada file yang dihapus.

### Bagaimana kalau saya hanya memotret RAW tanpa JPG?

Tidak masalah. Pulahpilih mengambil preview JPEG dari dalam file RAW, jadi file RAW saja sudah cukup untuk disortir.

### Apakah format HEIC dari iPhone didukung?

Belum. Saat ini format yang didukung adalah JPG, PNG, WebP, dan format RAW yang disebutkan di atas.
