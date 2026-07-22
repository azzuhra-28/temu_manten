# Undangan Akad Nikah & Resepsi Zamzami & Silvi

## Menjalankan secara lokal
1. Buka folder ini di VS Code.
2. Pasang ekstensi **Live Server**.
3. Klik kanan `index.html` → **Open with Live Server**.

## Google Sheets
- Nama tab: `Ucapan`
- Kolom: `Waktu | Nama | Kehadiran | Ucapan`
- Salin isi `google-apps-script.gs` ke Extensions → Apps Script.
- Deploy sebagai Web app:
  - Execute as: Me
  - Who has access: Anyone
- Klik **Authorize access** sampai deployment selesai.
- Setelah kode berubah, Deploy → Manage deployments → Edit → New version.

## Musik
Masukkan file musik dengan nama `music.mp3` ke folder `assets`.

## Publikasi Vercel
1. Upload folder ini ke repository GitHub.
2. Di Vercel pilih Add New Project.
3. Import repository dan klik Deploy.

## Nama tamu pada URL
Contoh: `https://domain-undangan.vercel.app/?to=Intan%20Azzuhra`

## Hal yang wajib diganti
Nomor rekening contoh ada di `index.html` pada elemen `accountNumber`.
