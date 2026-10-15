# Simulasi Gerak Jatuh Bebas

Dibuat oleh Kelompok B

Aplikasi web interaktif untuk mempelajari **Gerak Jatuh Bebas (GJB)**. Pengguna dapat mengubah ketinggian awal dan percepatan gravitasi, menjalankan animasi benda jatuh, melihat nilai besaran fisika secara langsung, serta mengamati grafik dan substitusi rumus.

## Fitur

- Animasi gerak benda dari ketinggian awal menuju permukaan tanah.
- Pengaturan ketinggian awal dan gravitasi.
- Tombol mulai/jeda, langkah waktu 0,1 detik, dan atur ulang.
- Penggeser waktu untuk melihat kondisi benda pada waktu tertentu.
- Tampilan ketinggian, jarak yang ditempuh, kecepatan, percepatan, waktu total jatuh, dan kecepatan akhir.
- Grafik ketinggian–waktu, kecepatan–waktu, atau percepatan–waktu.
- Perhitungan dan substitusi rumus otomatis menggunakan notasi matematika KaTeX.
- Pilihan tema terang dan gelap.
- Informasi anggota kelompok.

## Cara menjalankan

Aplikasi ini berupa situs statis dan tidak memerlukan instalasi package atau server backend.

Cukup klik [link ini](https://4dityuh.github.io/simulasi-fisika-GJB-Kelompok-B/).

Jika rumus tampil sebagai teks biasa, periksa koneksi internet dan muat ulang halaman.

## Petunjuk penggunaan

1. **Atur parameter simulasi** — masukkan ketinggian awal antara 1–500 meter dan gravitasi antara 0,1–30 m/s².
2. **Mulai simulasi** — tekan **Mulai simulasi** untuk menjalankan animasi. Tombol yang sama akan menjadi **Jeda simulasi** saat animasi berjalan.
3. **Langkah waktu** — tekan **Langkah +0,1 s** untuk memajukan simulasi sebesar 0,1 detik.
4. **Pilih waktu** — geser penggeser waktu untuk melihat posisi dan besaran benda pada waktu tertentu.
5. **Lihat grafik** — pilih grafik ketinggian, kecepatan, atau percepatan melalui menu di bagian **Grafik gerak**.
6. **Periksa perhitungan** — bagian **Substitusi persamaan** memperlihatkan rumus beserta nilai yang dihitung dari parameter saat ini.
7. **Ganti tema** — gunakan tombol tema di bagian atas halaman untuk beralih antara mode terang dan gelap.
8. **Atur ulang** — tekan **Atur ulang** untuk mengembalikan parameter dan waktu simulasi ke keadaan awal.

## Rumus yang digunakan

Simulasi menggunakan asumsi benda dijatuhkan dari keadaan diam, percepatan gravitasi konstan, dan hambatan udara diabaikan. Arah ke bawah dianggap positif.

- Jarak yang ditempuh: `s(t) = ½gt²`
- Ketinggian benda: `h(t) = h₀ − ½gt²`
- Kecepatan: `v(t) = gt`
- Waktu total jatuh: `t = √(2h₀/g)`
- Kecepatan akhir: `v = √(2gh₀)`
- Percepatan: `a(t) = g`

Keterangan:

- `h₀` adalah ketinggian awal dalam meter (m).
- `g` adalah percepatan gravitasi dalam meter per sekon kuadrat (m/s²).
- `t` adalah waktu dalam sekon (s).
- `s` adalah jarak yang ditempuh dalam meter (m).
- `h` adalah ketinggian benda dari permukaan tanah dalam meter (m).
- `v` adalah besar kecepatan dalam meter per sekon (m/s).

## Struktur file

```text
project/
├── index.html   # Struktur halaman dan konten
├── style.css    # Tata letak, warna, tema, dan tampilan responsif
├── script.js    # Animasi, perhitungan, grafik, dan interaksi
└── README.md    # Dokumentasi dan petunjuk penggunaan
```

## Teknologi

- HTML5 untuk struktur halaman.
- CSS3 untuk tampilan dan tata letak.
- JavaScript untuk simulasi, animasi, perhitungan, dan grafik pada elemen canvas.
- [KaTeX](https://katex.org/) untuk merender notasi matematika, dimuat melalui jsDelivr CDN.

## Catatan

- Simulasi ini merupakan media pembelajaran sederhana, bukan model yang memperhitungkan hambatan udara.
- Hasil mengikuti parameter yang dimasukkan dan asumsi fisika yang dijelaskan di atas.
- Karena KaTeX dimuat dari CDN, koneksi internet diperlukan untuk menampilkan rumus dalam format matematika yang dirender.

## Video Demo
berikut (link)[https://youtu.be/0Ix_IFydPKU]

## Screenshot
<img width="4320" height="8720" alt="4dityuh github io_simulasi-fisika-GJB-Kelompok-B_(highh)" src="https://github.com/user-attachments/assets/d9d89030-5fef-475e-a4f3-48c327e6bf96" />

