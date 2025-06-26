"use client";

import Footer from "#/components/Footer";
import Navbar from "#/components/Navbar";

export default function InfoPage() {
  return (
    <main className="min-h-screen flex flex-col justify-between">
      <Navbar />

      <section className="flex-grow px-6 py-20 max-w-4xl mx-auto text-gray-800">
        <h1 className="text-xl md:text-3xl font-semibold mb-8 text-center">
          FOOTSTOP PRIVACY POLICY
        </h1>

        <article className="space-y-6 leading-relaxed text-justify">

          <p>
            Kebijakan Privasi ini berlaku untuk situs web Footstop di{" "}
            <a href="https://www.footstop.co.id" target="_blank" rel="noreferrer" className="text-blue-600 underline">
              www.footstop.co.id
            </a> ("Situs"), termasuk Toko Online Footstop Indonesia dan, jika disebutkan di situs tersebut, akun media sosial yang dikelola oleh Footstop untuk wilayah Indonesia.<br />
            Situs ini dioperasikan oleh PT FOOTSTOP INDONESIA, berkantor pusat di Gedung Metro Plaza Lt. 8, Jl. Jendral Sudirman No. 10, Jakarta Pusat 10220 (“Footstop”, "kami", atau “kita”).
          </p>

          <section>
            <h2 className="text-lg font-semibold mb-2">1. Pengumpulan Data Pribadi</h2>
            <p>Kami mengumpulkan dan menggunakan data pribadi Anda dalam keadaan dan untuk tujuan berikut:</p>

            <ol className="list-decimal list-inside space-y-3">
              <li>
                <strong>a. Saat Mengunjungi Situs Web:</strong>
                <p>Kami dapat mengumpulkan data berikut:</p>
                <ul className="list-disc list-inside ml-6">
                  <li>Alamat IP</li>
                  <li>Jenis dan versi browser</li>
                  <li>Sistem operasi</li>
                  <li>URL lengkap</li>
                  <li>Informasi pembelian</li>
                  <li>Perilaku penelusuran</li>
                </ul>
                <p>Lihat juga bagian penggunaan Cookies dan alat analitik di bawah.</p>
              </li>

              <li>
                <strong>b. Akun Pelanggan:</strong>
                <p>Anda dapat membuat akun pelanggan yang memuat:</p>
                <ul className="list-disc list-inside ml-6">
                  <li>Nama</li>
                  <li>Alamat email</li>
                  <li>Kata sandi</li>
                  <li>Alamat pengiriman &amp; penagihan (jika diperlukan)</li>
                </ul>
              </li>

              <li>
                <strong>c. Aktivitas di Situs:</strong>
                <p>Jika Anda mengikuti program loyalitas, langganan buletin, promosi, atau memberi ulasan, kami dapat mengumpulkan:</p>
                <ul className="list-disc list-inside ml-6">
                  <li>Nama/Nama panggilan</li>
                  <li>Nomor HP &amp; email</li>
                  <li>Komentar, foto, atau tanggapan</li>
                </ul>
              </li>

              <li>
                <strong>d. Transaksi di Toko Online Footstop:</strong>
                <p>Kami mengumpulkan data untuk memproses pesanan Anda:</p>
                <ul className="list-disc list-inside ml-6">
                  <li>Nama, alamat email, nomor telepon</li>
                  <li>Alamat pengiriman &amp; penagihan</li>
                </ul>
                <p>Pembayaran diproses oleh pihak ketiga. Kami tidak menyimpan detail kartu Anda.</p>
              </li>

              <li>
                <strong>e. Tujuan Lain:</strong>
                <p>Kami menggunakan data anonim untuk analisa, peningkatan layanan, dan pemasaran.</p>
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">2. Pengungkapan Data Pribadi</h2>
            <p>Kami dapat membagikan data Anda kepada:</p>
            <ul className="list-disc list-inside ml-6 space-y-1">
              <li>Afiliasi dan penyedia layanan kami (misalnya platform toko, pengiriman, email marketing, analitik)</li>
              <li>Pihak ketiga pengelola pembayaran dan program loyalitas</li>
            </ul>
            <p>Kami memastikan semua pihak terkait menerapkan perlindungan data yang sesuai.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">3. Cookies &amp; Alat Analitik</h2>
            <p>Kami menggunakan cookies untuk meningkatkan pengalaman Anda. Cookies memungkinkan kami:</p>
            <ul className="list-disc list-inside ml-6 space-y-1">
              <li>Menyimpan keranjang belanja Anda</li>
              <li>Mengenali browser Anda</li>
              <li>Menampilkan rekomendasi produk</li>
            </ul>
            <p>Kami juga menggunakan alat analitik untuk:</p>
            <ul className="list-disc list-inside ml-6 space-y-1">
              <li>Melacak kunjungan</li>
              <li>Mengukur statistik penggunaan situs</li>
              <li>Personalisasi konten</li>
            </ul>
            <p>Lihat Kebijakan Cookie kami untuk detail lebih lanjut.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">4. Keamanan Informasi Pribadi</h2>
            <p>Kami menggunakan langkah-langkah teknis dan organisasi seperti:</p>
            <ul className="list-disc list-inside ml-6">
              <li>Enkripsi (HTTPS)</li>
              <li>Server aman dan firewall</li>
              <li>Akses terbatas oleh personel berwenang</li>
            </ul>
            <p>Namun, tidak ada metode keamanan online yang 100% aman.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">5. Situs Lain</h2>
            <p>
              Situs kami mungkin berisi tautan ke situs lain. Kami tidak bertanggung jawab atas kebijakan privasi situs pihak ketiga tersebut.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">6. Privasi Anak-anak</h2>
            <p>
              Jika Anda berusia di bawah 21 tahun, Anda harus mendapatkan izin dari orang tua atau wali sebelum memberikan data pribadi.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">7. Mengakses atau Mengubah Data Anda</h2>
            <p>
              Anda dapat mengubah informasi Anda melalui akun pelanggan. Untuk akses atau penghapusan data lainnya, hubungi kami melalui detail di bawah ini.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">8. Berhenti dari Komunikasi Pemasaran</h2>
            <p>Untuk berhenti berlangganan email promosi:</p>
            <ul className="list-disc list-inside ml-6 space-y-1">
              <li>Login ke akun Anda dan ubah preferensi, atau</li>
              <li>Klik tautan "unsubscribe" di email kami, atau</li>
              <li>Kirim email ke <a href="mailto:cs@footstop.co.id" className="text-blue-600 underline">cs@footstop.co.id</a></li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">9. Kontak Kami</h2>
            <p>
              Jika Anda memiliki pertanyaan mengenai privasi, silakan hubungi:<br />
              <strong>Data Protection Officer – PT FOOTSTOP INDONESIA</strong><br />
              Gedung Metro Plaza Lt. 8 Jl. Jendral Sudirman No. 10 Jakarta Pusat 10220<br />
              Email: <a href="mailto:privacy@footstop.co.id" className="text-blue-600 underline">privacy@footstop.co.id</a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">10. Perubahan Kebijakan Privasi</h2>
            <p>
              Kebijakan ini dapat berubah sewaktu-waktu. Perubahan akan diumumkan di Situs. Anda bertanggung jawab untuk meninjau ulang kebijakan ini secara berkala.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">11. Bahasa</h2>
            <p>
              Kebijakan ini dibuat dalam Bahasa Indonesia dan Bahasa Inggris. Jika terdapat perbedaan, versi Bahasa Indonesia yang berlaku.
            </p>
          </section>

          <h2 className="text-2xl font-semibold mt-12 mb-6 text-center">
            FOOTSTOP COOKIE POLICY
          </h2>

          <section>
            <h3 className="text-lg font-semibold mb-2">1. Cakupan</h3>
            <p>
              Kebijakan Cookie ini berlaku untuk Situs Footstop di{" "}
              <a href="https://www.footstop.co.id" target="_blank" rel="noreferrer" className="text-blue-600 underline">
                www.footstop.co.id
              </a>.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">2. Apa Itu Cookie?</h3>
            <p>
              Cookies adalah file teks kecil yang disimpan di browser Anda saat mengunjungi situs. Cookies dapat mengenali pengaturan Anda dan menyimpan informasi kunjungan Anda.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">3. Jenis Cookie</h3>
            <ul className="list-disc list-inside ml-6 space-y-1">
              <li>First-party cookies: Ditetapkan oleh situs kami.</li>
              <li>Third-party cookies: Ditetapkan oleh pihak ketiga untuk analitik dan periklanan.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">4. Durasi Cookie</h3>
            <ul className="list-disc list-inside ml-6 space-y-1">
              <li>Session cookies: Hilang setelah Anda keluar dari situs.</li>
              <li>Persistent cookies: Disimpan lebih lama dan dihapus otomatis setelah waktu tertentu.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">5. Tujuan Cookie</h3>
            <ul className="list-disc list-inside ml-6 space-y-1">
              <li>Cookie yang diperlukan: Untuk fungsi dasar toko online.</li>
              <li>Cookie fungsional: Untuk kenyamanan pengguna (mis. menyimpan bahasa, isi keranjang).</li>
              <li>Cookie analitik: Untuk statistik kunjungan &amp; peningkatan layanan.</li>
              <li>Cookie pemasaran: Untuk menampilkan iklan yang relevan di situs lain.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">6. Pengaturan Cookie</h3>
            <p>
              Anda dapat membatasi atau menonaktifkan cookie melalui pengaturan browser Anda. Namun, beberapa fungsi mungkin tidak berjalan dengan optimal.
            </p>
            <p>
              Dengan memberikan data pribadi Anda kepada Footstop, Anda mengakui bahwa Anda telah membaca dan memahami Kebijakan Privasi ini, dan menyetujui penggunaannya sebagaimana dijelaskan di atas.
            </p>
          </section>
        </article>
      </section>

      <Footer />
    </main>
  );
}
