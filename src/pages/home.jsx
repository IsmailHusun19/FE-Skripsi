import Navbar from "../component/Navbar";
import HomeSatu from "../assets/HomeSatu.svg";
import HomeDua from "../assets/HomeDua.svg";
import HomeTiga from "../assets/HomeTiga.svg";
import HomeEmpat from "../assets/HomeEmpat.svg";
import Unbaja from "../assets/unbaja.jpg";
import LogoUbaja from "../assets/unbaja-logo.png";
import LogoKampusMerdeka from "../assets/Logo_Kampus_Merdeka.png";
import Logo from "../assets/logo.svg";
import { useState } from "react";

const Home = () => {
  const [agreed, setAgreed] = useState(false);
  return (
    <div className="container-satu">
      <Navbar />
      <div className="box-landingpage-satu">
        <div className="box-landingpage-satu-content">
          <h1>
            Selamat Datang di E - Learning Universitas Banten Jaya - Solusi
            Belajar Online Terdepan
          </h1>
          <p>
            Kami menyediakan pengalaman belajar yang interaktif, dan mudah
            diakses kapan saja dan di mana saja. Learning Universitas Banten
            Jaya hadir untuk mendukung perjalanan pendidikan Anda menuju masa
            depan yang lebih baik.{" "}
          </p>
          <button type="button">Mulai Belajar Sekarang!</button>
        </div>
        <div className="box-landingpage-satu-gambar">
          <img src={HomeSatu} />
        </div>
      </div>
      <div className="box-landingpage-dua">
        <div className="box-landingpage-dua-content">
          <p>
            Platform e-learning ini memungkinkan Anda belajar kapan saja dan di
            mana saja. Anda tidak lagi terbatas oleh lokasi atau waktu, sehingga
            dapat mengatur jadwal belajar sesuai dengan kesibukan dan ritme Anda
            sendiri. Hal ini sangat membantu bagi mahasiswa di kelas non-reguler
            atau kelas malam, karena Anda dapat mengikuti materi dan tugas tanpa
            khawatir tertinggal, meskipun memiliki jadwal yang padat atau
            bekerja di siang hari. Dengan demikian, platform ini memberikan
            solusi yang optimal bagi mereka yang memiliki komitmen lain di luar
            jam belajar tradisional, sehingga pendidikan tetap dapat diakses
            tanpa hambatan waktu.
          </p>
          <img src={HomeDua} />
        </div>
        <div className="box-landingpage-dua-content reverse">
          <p>
            Platform ini dirancang untuk mendukung pembelajaran tatap muka.
            Mahasiswa dapat memanfaatkan materi yang tersedia untuk mengikuti
            atau mempersiapkan diri sebelum kelas, serta untuk memastikan mereka
            tidak ketinggalan jika ada materi yang sulit dipahami saat sesi
            tatap muka. Selain itu, dengan akses yang konsisten ke materi ini,
            mahasiswa dapat lebih aktif berpartisipasi dalam diskusi di kelas
            dan datang dengan pertanyaan yang lebih mendalam, sehingga proses
            belajar mengajar menjadi lebih interaktif dan bermakna. Ini juga
            memungkinkan dosen untuk mengidentifikasi area yang memerlukan
            perhatian lebih dan memberikan penjelasan tambahan sesuai kebutuhan
            mahasiswa.
          </p>
          <img src={HomeTiga} />
        </div>
        <div className="box-landingpage-dua-content nonReverse">
          <p>
            Jika mahasiswa merasa ada materi yang perlu diulang atau diperjelas,
            mereka dapat dengan mudah mengakses kembali materi tersebut di
            platform ini kapan saja, tanpa harus menunggu penjelasan ulang dari
            dosen di kelas. Hal ini tidak hanya membantu mahasiswa yang mungkin
            kesulitan memahami topik tertentu, tetapi juga memberikan
            fleksibilitas bagi mereka untuk belajar sesuai dengan kecepatan
            masing-masing. Dengan akses yang tidak terbatas ini, mahasiswa dapat
            lebih percaya diri dalam memahami seluruh materi, dan lebih siap
            menghadapi ujian atau tugas yang diberikan.{" "}
          </p>
          <img src={HomeEmpat} />
        </div>
      </div>
      <svg
        className="gelombangCss"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
      >
        <path
          fill="#0099ff"
          fillOpacity="0.2"
          d="M0,224L60,224C120,224,240,224,360,208C480,192,600,160,720,165.3C840,171,960,213,1080,213.3C1200,213,1320,171,1380,149.3L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
        ></path>
      </svg>
      <div className="box-landingpage-tiga">
        <div className="box-landingpage-tiga-content">
          <img src={Unbaja} alt="" />
          <div>
            <h1>Riwayat Singkat Universitas Banten Jaya</h1>
            <p>
              Proses pembentukan atau pendirian sebuah Perguruan Tinggi tidaklah
              semudah apa yang diperkirakan, karena pembentukan lembaga seperti
              ini memerlukan perhitungan yang matang serta studi intensif
              mengenai berbagai aspek kemampuan, peluang, tantangan, dan
              kendala-kendala yang mungkin terjadi baik pada saat pendirian
              maupun saat proses penyelenggaraan pendirian berlangsung. Selain
              itu, pendirian perguruan tinggi juga membutuhkan komitmen jangka
              panjang untuk memastikan bahwa visi dan misi institusi tersebut
              dapat tercapai, termasuk kesiapan dalam hal sumber daya manusia,
              infrastruktur, dan tata kelola yang baik.
            </p>
          </div>
        </div>
      </div>
      <div className="contact-me">
        <div className="contact-me-satu">
          <div className="hubungi-kami">
            <div className="isolate pt-24 sm:pt-32">
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
              >
                <div
                  style={{
                    clipPath:
                      "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                  }}
                  className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
                />
              </div>
              <div className="w-full text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Hubungi Kami
                </h2>
              </div>
              <form action="#" method="POST" className=" mt-10 w-full">
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="first-name"
                      className="block text-sm font-semibold leading-6 text-gray-900"
                    >
                      Nama depan
                    </label>
                    <div className="mt-2.5">
                      <input
                        id="first-name"
                        name="first-name"
                        type="text"
                        autoComplete="given-name"
                        className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="last-name"
                      className="block text-sm font-semibold leading-6 text-gray-900"
                    >
                      Nama belakang
                    </label>
                    <div className="mt-2.5">
                      <input
                        id="last-name"
                        name="last-name"
                        type="text"
                        autoComplete="family-name"
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold leading-6 text-gray-900"
                    >
                      Email
                    </label>
                    <div className="mt-2.5">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="phone-number"
                      className="block text-sm font-semibold leading-6 text-gray-900"
                    >
                      Telepon
                    </label>
                    <div className="relative mt-2.5">
                      <input
                        id="phone-number"
                        name="phone-number"
                        type="tel"
                        autoComplete="tel"
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="message"
                      className="block text-sm font-semibold leading-6 text-gray-900"
                    >
                      Pesan
                    </label>
                    <div className="mt-2.5">
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        defaultValue={""}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-10">
                  <button
                    type="submit"
                    className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Kirim
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="alamat">
            <div className="kampus-1">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-gray-800 mb-1">
                  Universitas Banten Jaya Kampus Satu
                </h1>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!3m2!1sid!2sid!4v1727080615642!5m2!1sid!2sid!6m8!1m7!1sTfb-wQVJgUbfU0gk1JO5RA!2m2!1d-6.127624646626183!2d106.1641378193681!3f232.32356!4f0!5f0.7820865974627469"
                  style={{ border: "0" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
            <div className="kampus-2">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-gray-800 mb-1">
                  Universitas Banten Jaya Kampus Dua
                </h1>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!3m2!1sid!2sid!4v1727084130199!5m2!1sid!2sid!6m8!1m7!1svdoX5qwPvUV3WJ7uSMNDsQ!2m2!1d-6.166949098064476!2d106.1765303997079!3f199.57774153008344!4f2.2003434932785098!5f0.7820865974627469"
                  style={{ border: "0" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="footer px-0 bg-slate-900 text-slate-300 pt-10 pb-3">
        <div className="w-[90%] m-auto sm:w-[95%]">
          <div className="w-full">
            <div className="flex w-full justify-between container-menu-footer">
              <div className="flex w-[200px] lg:w-max sm:w-[290px] logo-menu-footer">
                <aside>
                  <img className="w-48 mb-3" src={Logo} alt="" />
                  <p>
                    Universitas Banten Jaya.
                    <br />
                    Menyediakan Platform E-learning yang modern, interaktif, dan inklusif.
                  </p>
                </aside>
              </div>
              <div className="flex gap-8 logo-menu-footer">
                <nav className="flex flex-col">
                  <h6 className="footer-title">Services</h6>
                  <a className="link link-hover">Branding</a>
                  <a className="link link-hover">Design</a>
                  <a className="link link-hover">Marketing</a>
                  <a className="link link-hover">Advertisement</a>
                </nav>
                <nav className="flex flex-col">
                  <h6 className="footer-title">Company</h6>
                  <a className="link link-hover">About us</a>
                  <a className="link link-hover">Contact</a>
                  <a className="link link-hover">Jobs</a>
                  <a className="link link-hover">Press kit</a>
                </nav>
                <nav className="flex flex-col">
                  <h6 className="footer-title">Legal</h6>
                  <a className="link link-hover">Terms of use</a>
                  <a className="link link-hover">Privacy policy</a>
                  <a className="link link-hover">Cookie policy</a>
                </nav>
              </div>
              <div className="sponsor flex gap-5">
                <img src={LogoUbaja} alt="" />
                <img src={LogoKampusMerdeka} alt="" />
              </div>
            </div>
            <div className="sponsor-2 flex gap-5">
                <img src={LogoUbaja} alt="" />
                <img src={LogoKampusMerdeka} alt="" />
              </div>
          </div>
          <div className="w-[90%] sm:w-[95%] m-auto flex justify-center mt-7 mb-0">
            <nav>
              <div className="grid grid-flow-col gap-4 text-center">
                <a>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="fill-current"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                  </svg>
                </a>
                <a>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="fill-current"
                  >
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
                  </svg>
                </a>
                <a>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="fill-current"
                  >
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                  </svg>
                </a>
              </div>
            </nav>
          </div>
          <aside className="w-[90%] sm:w[95%] text-center m-auto">
            <p>
              Copyright © {new Date().getFullYear()} - Universitas Banten Jaya. Semua Hak Cipta Dilindungi.
            </p>
          </aside>
        </div>
      </footer>
    </div>
  );
};

export default Home;
