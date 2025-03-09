import { useState, useEffect } from "react";
import "../style/CKEditor.css";
import Navbar from "../component/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesRight,
  faAngleDown,
  faLock,
  faAngleUp,
  faUsers,
  faBook,
  faTrash,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import Gambar from "../assets/images1.jpg";
import {
  HomeModernIcon,
  ChartPieIcon,
  BellAlertIcon,
  ChatBubbleLeftIcon,
  ClipboardDocumentIcon,
  UsersIcon,
  EnvelopeIcon,
  PowerIcon,
  CursorArrowRippleIcon,
  FaceFrownIcon,
  CogIcon,
} from "@heroicons/react/20/solid";

const Materi = () => {
  const menu2 = [
    {
      name: "Materi",
      icon: <FontAwesomeIcon className="text-xl w-6" icon={faBook} />,
      isActive: false,
    },
    {
      name: "Mahasiswa",
      isActive: false,
      icon: <FontAwesomeIcon className="text-xl w-6" icon={faUsers} />,
    },
    {
      name: "Tugas",
      isActive: false,
      icon: <FontAwesomeIcon className="text-xl w-6" icon={faBook} />
    },
    {
      name: "Hapus Materi",
      isActive: false,
      icon: <FontAwesomeIcon className="text-xl w-6" icon={faTrash} />,
    },
  ];

  const [materi, setMateri] = useState("");

  const fetchMateri = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/materi/133");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      setMateri(result);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    fetchMateri();
  }, []);

  const [ButtonMenuMateri, SetButtionMenuMateri] = useState(false);
  const handelCloseButtonMenuMateri = () => {
    SetButtionMenuMateri(true);
  };

  const handelOpenButtonMenuMateri = () => {
    SetButtionMenuMateri(false);
  };

  const [ButtonListMateri, setButtonListMateri] = useState(false);

  const handleToggleButtonListMateri = () => {
    setButtonListMateri((prev) => !prev);
    console.log(!ButtonListMateri);
  };

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return (
    <div className="container-satu w-full">
      <Navbar />
      <div className="flex">
        <div
          className={`relative pt-[75.7px] transition-all duration-300 ease-in-out ${
            ButtonMenuMateri
              ? "w-full"
              : "w-full sm:w-[50%] md:w-[60%] lg:w-[70%]"
          }`}
        >
          <div
            className={`fixed z-10 transition-all duration-300 ease-in-out bg-white h-screen ${
              isSidebarCollapsed ? "w-16" : "sm:w-64"
            }`}
          >
            <div className="border-b p-5 flex justify-between items-center">
              <button onClick={toggleSidebar}>
                <FontAwesomeIcon className="text-2xl" icon={faBars} />
              </button>
            </div>
            <div className="border-b text-sm">
              <Menus
                menu={menu2}
                title={{ sm: "APPLICATION", xs: "APP" }}
                isSidebarCollapsed={isSidebarCollapsed}
              />
            </div>
          </div>

          <div className="main-container ml-20 mr-7 m-auto relative">
            <div className="editor-container editor-container_classic-editor editor-container_include-style">
              <div className="editor-container__editor">
                <div dangerouslySetInnerHTML={{ __html: materi.value }} />
                <h1 className="text-3xl font-extrabold my-5">
                  Pemograman Web III
                </h1>
                <img className="w-full h-[300px]" src={Gambar} alt="" />
                <p className="mt-3">
                  Bahasa Pemrograman Web Dalam semua ilmu tentang pemrograman
                  baik itu desktop, mobile, game maupun software atau aplikasi
                  lainnya pasti selalu ada bahasa-bahasa pemrograman yang
                  digunakan untuk membuat aplikasi tersebut yang berisi
                  statement-statement, perintah, atau pun fungsi agar aplikasi
                  yang dibuat sesuai dengan apa yang telah didesain oleh si
                  programmer. Oleh karena itu pemrograman web pun memiliki
                  banyak bahasa yang digunakan, di antaranya: HyperText Markup
                  Language (HTML) HTML sebenarnya bukan sebuah bahasa
                  pemrograman, melainkan markup language atau bahasa penandaan
                  yang terdiri dari kumpulan tag. Pada dasarnya HTML hanya
                  mendeskripsikan bahwa bagian tertentu dalam sebuah halaman web
                  adalah isi yang harus ditampilkan oleh browser dengan cara
                  tertentu. HTML merupakan standar internet yang didefinisikan
                  dan dikendalikan oleh World Wide Web Consortium (W3C).
                  Cascading Style Sheet (CSS) CSS merupakan bahasa stylesheet
                  yang digunakan untuk mengatur tampilan suatu dokumen yang
                  ditulis dengan HTML. CSS juga memiliki css framework dan
                  digunakan untuk menambah desain-desain tertentu pada halaman
                  web agar desain halaman menarik untuk dilihat. Penggunaan CSS
                  paling umum adalah untuk mengatur halaman web yang ditulis
                  dengan HTML atau XHTML. Hypertext Preprocessor (PHP) Bahasa
                  pemrograman PHP merupakan salah satu bahasa scripting yang
                  wajib dikuasai oleh seorang web developer. Karena sifatnya
                  yang server-side scripting, maka untuk menjalankan bahasa
                  pemrograman PHP tidak bisa hanya memanggil file yang
                  berekstensi PHP saja. Bahasa pemrograman PHP memerlukan sebuah
                  web server untuk menjalankannya. PHP juga dapat diintegrasikan
                  dengan HTML, JavaScript, jQuery, Ajax dan lain sebagainya.
                  Akan tetapi pada umumnya bahasa pemrograman PHP digunakan
                  bersamaan dengan file yang bertipe HTML agar file tersebut
                  dapat menjalankan berbagai fungsi. JavaScript JavaScript
                  adalah bahasa scripting yang berjalan pada sisi client.
                  Maksudnya adalah pemrosesan script dilakukan sendiri pada
                  komputer user. Biasanya JavaScript digunakan untuk membuat
                  animasi-animasi dan bentuk interaktif lain pada halaman web.
                  Terbukti dari banyaknya library-library JavaScript yang dapat
                  digunakan oleh programmer untuk membuat halaman web yang
                  dibuat menjadi lebih interaktif. Untuk menjalankan script yang
                  ditulis dalam JavaScript, kita membutuhkan browser yang
                  mendukung dan mampu menjalankan JavaScript atau sering disebut
                  dengan javascript-enabled browser. Structured Query Language
                  (SQL) SQL merupakan domain-spesific language yang digunakan
                  untuk mengolah data dalam Relational Database Management
                  System (RDBMS). Aplikasi RDBMS yang banyak digunakan oleh para
                  programmer aplikasi web untuk mengolah basis data mereka
                  adalah MySQL. Biasanya digunakan fungsi-fungsi dalam bahasa
                  pemrograman PHP untuk membuat, membaca, mengubah atau pun
                  menghapus data dalam SQL yang kemudian dapat ditampilkan pada
                  halaman web. Selain bahasa di atas, bisa dikatakan hampir
                  semua bahasa pemrograman dapat digunakan dalam pemrograman web
                  selama bahasa tersebut dapat bekerja dalam web server dan
                  dapat menciptakan HTML, XML, dan XHTML. Beberapa bahasa
                  pemrograman web yang populer di antaranya yaitu PHP, ASP.NET,
                  Ruby on Rails, PERL, ASP classic, Python, dan JSP. Berkenalan
                  Dengan Bahasa Pemrograman Web
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`fixed right-0 h-full border border-slate-400 rounded-md overflow-y-auto pb-[90px] bg-white transition-all duration-300 ease-in-out ${
            ButtonMenuMateri
              ? "w-0 mt-[75.7px] border-none"
              : "w-full sm:w-[50%] md:w-[40%] lg:w-[30%] mt-[75.7px]"
          }`}
        >
          <div className="flex flex-col gap-3 text-slate-900 font-semibold text-lg p-6 fixed rounded-md bg-zinc-100 z-10 w-full sm:w-[50%] md:w-[40%] lg:w-[30%]">
            <div className="flex gap-4 items-center">
              <button
                type="button"
                onClick={handelCloseButtonMenuMateri}
                className="min-w-[32px] min-h-[32px] rounded-full bg-slate-800 text-slate-50 flex justify-center items-center"
              >
                {<FontAwesomeIcon icon={faAnglesRight} />}
              </button>
              <div
                className="tooltip tooltip-bottom"
                data-tip="Pemograman Web II Pemograman Web II dhsdsdjss dshdgshdss dshdsd
                sdbsgdhsn dsbhdgshdn sdshdusj"
              >
                <h1 className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[20ch] transition-all duration-300">
                  Pemograman Web II Pemograman Web II dhsdsdjss dshdgshdss
                  dshdsd sdbsgdhsn dsbhdgshdn sdshdusj
                </h1>
              </div>
            </div>
          </div>
          <div className="flex relative flex-col pt-[90px]">
            <div className="w-[100%] p-2 rounded-lg m-auto relative">
              <div
                onClick={handleToggleButtonListMateri}
                className="cursor-pointer flex gap-4 items-center relative"
              >
                <FontAwesomeIcon
                  className="text-slate-400"
                  icon={ButtonListMateri ? faAngleUp : faAngleDown}
                />
                <h1 className="font-medium text-slate-800">Pengenalan HTML</h1>
                <FontAwesomeIcon
                  className="absolute right-0 text-slate-400"
                  icon={faLock}
                />
              </div>
              <div
                className={`pl-[22.5px] ml-[6.8px] border-l-[1.2px] border-slate-400 pr-4 flex flex-col gap-1 py-2 origin-top transition-transform duration-300 ease-in-out top-8 h-max
    ${ButtonListMateri ? "hidden" : "flex h-0"} transform-gpu`}
                style={{ transformOrigin: "top" }}
              >
                <h1>Pertemuan 1</h1>
                <h1>Pertemuan 2</h1>
                <h1>Pertemuan 3</h1>
                <h1>Pertemuan 4</h1>
                <h1>Pertemuan 5</h1>
              </div>
            </div>
            <div className="w-[100%] p-2 rounded-lg m-auto relative">
              <div
                onClick={handleToggleButtonListMateri}
                className="cursor-pointer flex gap-4 items-center relative"
              >
                <FontAwesomeIcon
                  className="text-slate-400"
                  icon={ButtonListMateri ? faAngleUp : faAngleDown}
                />
                <h1 className="font-medium text-slate-800">Pengenalan HTML</h1>
                <FontAwesomeIcon
                  className="absolute right-0 text-slate-400"
                  icon={faLock}
                />
              </div>
              <div
                className={`pl-[22.5px] ml-[6.8px] border-l-[1.2px] border-slate-400 pr-4 flex flex-col gap-1 py-2 origin-top transition-transform duration-0 ease-in-out top-8 h-max
    ${ButtonListMateri ? "scale-y-100" : "scale-y-0 h-0"} transform-gpu`}
                style={{ transformOrigin: "top" }}
              >
                <h1>Pertemuan 1</h1>
                <h1>Pertemuan 2</h1>
                <h1>Pertemuan 3</h1>
                <h1>Pertemuan 4</h1>
                <h1>Pertemuan 5</h1>
              </div>
            </div>
            <div className="w-[100%] p-2 rounded-lg m-auto relative">
              <div
                onClick={handleToggleButtonListMateri}
                className="cursor-pointer flex gap-4 items-center relative"
              >
                <FontAwesomeIcon
                  className="text-slate-400"
                  icon={ButtonListMateri ? faAngleUp : faAngleDown}
                />
                <h1 className="font-medium text-slate-800">Pengenalan HTML</h1>
                <FontAwesomeIcon
                  className="absolute right-0 text-slate-400"
                  icon={faLock}
                />
              </div>
              <div
                className={`pl-[22.5px] ml-[6.8px] border-l-[1.2px] border-slate-400 pr-4 flex flex-col gap-1 py-2 origin-top transition-transform duration-0 ease-in-out top-8 h-max
    ${ButtonListMateri ? "scale-y-100" : "scale-y-0 h-0"} transform-gpu`}
                style={{ transformOrigin: "top" }}
              >
                <h1>Pertemuan 1</h1>
                <h1>Pertemuan 2</h1>
                <h1>Pertemuan 3</h1>
                <h1>Pertemuan 4</h1>
                <h1>Pertemuan 5</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        onClick={handelOpenButtonMenuMateri}
        className={`rounded-tl-full rounded-bl-full bg-slate-800 text-slate-50 flex justify-center items-center fixed top-[101px] right-0
      transition-all duration-300 ease-in-out cursor-pointer ${
        ButtonMenuMateri
          ? "min-w-[50px] min-h-[50px]"
          : "min-w-[0px] min-h-[0px]"
      }`}
      >
        {ButtonMenuMateri && <FontAwesomeIcon icon={faAnglesRight} />}
      </div>
    </div>
  );
};

function Menus({ menu, title, isSidebarCollapsed }) {
  return (
    <div className="py-5">
      <h6
        className="mb-4 text-[10px] sm:text-sm text-center sm:text-left sm:px-5">

        <span className="">{isSidebarCollapsed ? title.xs : title.sm}</span>
      </h6>
      <ul>
        {menu.map((val, index) => {
          const menuActive = val.isActive
            ? `bg-blue-300 bg-opacity-10 px-3 border border-blue-100 py-2 rounded-md text-blue-400 flex items-center`
            : `px-3 py-2 flex items-center ${
                isSidebarCollapsed ? "justify-center" : ""
              }`;
          return (
            <li key={index} className={`${menuActive} cursor-pointer hover:bg-blue-700 hover:text-white my-5`}>
              <div className="flex items-center justify-center">{val.icon}</div>
              {!isSidebarCollapsed && (
                <div className="ml-2">{val.name}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Materi;
