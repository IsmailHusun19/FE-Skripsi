import Navbar from "../component/Navbar";
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import ChatBot from "../component/ChatBot";
import { Confirm } from "notiflix/build/notiflix-confirm-aio";
import SliderBar from "../component/SliderBar";
import { Report } from "notiflix/build/notiflix-report-aio";
import {
  getUserCheck,
  deleteMatkulDosen,
  deleteMatkulMahasiswa,
  getDetailDataKuisionerDosen,
} from "../config/FetchingData";
import Footer from "../component/Footer";
import { useParams, useNavigate } from "react-router-dom";
import "../style/App.css";
import { Loading } from "notiflix/build/notiflix-loading-aio";

const DetailLaporanEvaluasi = () => {
  const { idMatkul, idKuisioner } = useParams();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [openChatBot, setOpenChatBot] = useState(false);
  const [deleteMatkul, setDeleteMatkul] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState([]);
  const [saran, setSaran] = useState("");
  const [dataKuisionerNew, setDataKuisionerNew] = useState([]);
  const skorMapping = {
    "Sangat Baik": 5,
    Baik: 4,
    Cukup: 3,
    Kurang: 2,
    "Sangat Kurang": 1,
  };
  const dataKuisioner = {
    pertanyaan: [
      "Materi yang diajarkan sesuai dengan silabus dan mudah dipahami.",
      "Dosen menjelaskan materi dengan jelas dan terstruktur.",
      "Dosen bersikap profesional (tepat waktu, sopan, terbuka terhadap pertanyaan)",
      "Metode pengajaran dosen membuat mahasiswa aktif dan tertarik belajar.",
      "Secara keseluruhan, bagaimana penilaian Anda terhadap dosen dan mata kuliah ini?",
    ],
    jawaban: ["Sangat Baik", "Baik", "Cukup", "Kurang", "Sangat Kurang"],
  };
  const [jawabanDataKuisioner, setJawabanKuisioner] = useState(
    dataKuisioner.pertanyaan.map(() => "")
  );

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const hitungData = (jawabanKuisioner) => {
    function interpretasiSkor(rataRata) {
      if (rataRata >= 4.1) return "Sangat Baik";
      if (rataRata >= 3.1) return "Baik";
      if (rataRata >= 2.1) return "Cukup";
      if (rataRata >= 1.1) return "Kurang";
      return "Sangat Kurang";
    }

    const skorJawaban = jawabanKuisioner.map(
      (jawaban) => skorMapping[jawaban] || 0
    );

    console.log(skorJawaban);
    const totalSkor = skorJawaban.reduce((total, skor) => total + skor, 0);
    const rataRata = skorJawaban.length ? totalSkor / skorJawaban.length : 0;
    const interpretasi = interpretasiSkor(rataRata);

    const hasil = {
      totalSkor,
      rataRata: rataRata.toFixed(2),
      interpretasi,
    };

    setDataKuisionerNew([hasil]);
  };

  const getDataUser = async () => {
    try {
      const dataUser = await getUserCheck();
      setUser(dataUser);
    } catch (error) {
      console.log(error);
    }
  };

  const getDataKuisioner = async () => {
    setLoading(true);
    try {
      const dataKuisioner = await getDetailDataKuisionerDosen(
        idMatkul,
        idKuisioner
      );
      setJawabanKuisioner(dataKuisioner.jawabanKuisioner);
      setSaran(dataKuisioner.saran);
      hitungData(dataKuisioner.jawabanKuisioner);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDataKuisioner();
    getDataUser();
  }, [idMatkul, idKuisioner]);

  const handleDeleteMatkul = async () => {
    try {
      if (deleteMatkul) {
        if (user.role === "Mahasiswa") {
          Confirm.show(
            "Meninggalkan Mata Kuliah",
            "Yakin ingin meninggalkan mata kuliah?",
            "Yes",
            "No",
            async () => {
              const deleteMatkulMhs = await deleteMatkulMahasiswa(idMatkul);
              Notify.success("Anda berhasil meninggalkan mata kuliah tersebut");
              navigate("/matakuliah");
            },
            () => {
              setDeleteMatkul(false);
            }
          );
        } else {
          Confirm.show(
            "Menghapus Mata Kuliah",
            "Yakin ingin menghapus mata kuliah?",
            "Yes",
            "No",
            async () => {
              const deleteMatkulDsn = await deleteMatkulDosen(idMatkul);
              navigate("/matakuliah");
              Notify.success("Anda berhasil menghapus mata kuliah tersebut");
            },
            () => {
              setDeleteMatkul(false);
            }
          );
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteMatkul(false);
    }
  };

  useEffect(() => {
    handleDeleteMatkul();
  }, [deleteMatkul]);

  return (
    <div className="container-satu overflow-x-hidden">
      {!loading ? (
        <>
          {" "}
          <Navbar />
          <div className="w-full flex">
            <div className="relative pt-[75.7px] min-h-screen transition-all duration-300 ease-in-out w-full">
              <div
                className={`fixed transition-all duration-300 ease-in-out bg-white h-screen shadow-xl origin-left ${
                  isSidebarCollapsed ? "w-16" : "w-64"
                }`}
              >
                <div className="border-b p-5 flex justify-between items-center">
                  <button onClick={() => toggleSidebar()}>
                    <FontAwesomeIcon className="text-2xl" icon={faBars} />
                  </button>
                </div>
                <div className="border-b text-sm">
                  <SliderBar
                    title={{ sm: "APPLICATION", xs: "APP" }}
                    isSidebarCollapsed={isSidebarCollapsed}
                    openChatBot={setOpenChatBot}
                    deleteMatkul={setDeleteMatkul}
                  />
                </div>
              </div>
              <ChatBot closeBot={openChatBot} openBot={setOpenChatBot} />
              <div
                className={`flex-1 transition-all duration-300 ease-in-out min-h-screen flex justify-center ${
                  isSidebarCollapsed ? "ml-16" : "ml-16 lg:ml-64"
                }`}
              >
                <div className="w-[95%] pb-8 pt-6 border-t-4 border-blue-800 max-h-max rounded-md shadow-lg mt-10 mb-10 no-shadow print:border-none print:mt-[-20px]">
                  <h1 className="mb-3 text-xl px-4 pb-4 border-b border-slate-300">
                    Kuisioner Penilaian
                  </h1>
                  <div className="mt-6 mx-4">
                    <div className="overflow-x-auto transition-all duration-300 ease-in-out">
                      <table className="w-full rounded-lg print:text-sm">
                        <thead>
                          <tr className="bg-slate-800 text-slate-200 ">
                            <th className="border border-slate-400 p-2 w-[20px] max-w-max-[20px] text-center">
                              NO
                            </th>
                            <th className="border border-slate-400 p-2 w-[350px] min-w-[300px]">
                              Pertanyaan
                            </th>
                            <th className="border border-slate-400 p-2 w-[300px] min-w-[200px]">
                              Jawaban
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {dataKuisioner.pertanyaan.map((item, index) => (
                            <tr key={index}>
                              <td className="border border-slate-400 p-2 text-center">
                                {index + 1}
                              </td>
                              <td className="border border-slate-400 p-2">
                                {item}
                              </td>
                              <td className="border border-slate-400 p-2">
                                {" "}
                                <select
                                  disabled={true}
                                  className="bg-transparent rounded p-1 w-full h-[88.67px] block focus:outline-none cursor-pointer"
                                  value={jawabanDataKuisioner[index]}
                                >
                                  <option value="">Pilih jawaban</option>
                                  {dataKuisioner.jawaban.map((jawaban, idx) => (
                                    <option key={idx} value={jawaban}>
                                      {jawaban}
                                    </option>
                                  ))}
                                </select>
                              </td>
                            </tr>
                          ))}
                          <tr>
                            <td
                              colSpan={2}
                              className="border border-slate-400 p-2 text-center font-semibold"
                            >
                              Total Skor
                            </td>
                            <td className="border border-slate-400 p-2 text-center">
                              {dataKuisionerNew[0]?.totalSkor}
                            </td>
                          </tr>
                          <tr>
                            <td
                              colSpan={2}
                              className="border border-slate-400 p-2 text-center font-semibold"
                            >
                              Rata Rata
                            </td>
                            <td className="border border-slate-400 p-2 text-center">
                              {dataKuisionerNew[0]?.rataRata}
                            </td>
                          </tr>
                          <tr>
                            <td
                              colSpan={2}
                              className="border border-slate-400 p-2 text-center font-semibold"
                            >
                              interpretasi
                            </td>
                            <td
                              className={`border border-slate-400 p-2 text-center font-semibold ${
                                dataKuisionerNew[0]?.interpretasi ===
                                "Sangat Baik"
                                  ? "text-green-700"
                                  : dataKuisionerNew[0]?.interpretasi === "Baik"
                                  ? "text-lime-700"
                                  : dataKuisionerNew[0]?.interpretasi ===
                                    "Cukup"
                                  ? "text-yellow-700"
                                  : dataKuisionerNew[0]?.interpretasi ===
                                    "Kurang"
                                  ? "text-orange-700"
                                  : dataKuisionerNew[0]?.interpretasi ===
                                    "Sangat Kurang"
                                  ? "text-red-700"
                                  : ""
                              }`}
                            >
                              {dataKuisionerNew[0]?.interpretasi}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-5 ">
                      <p className="mb-2">
                        Saran atau masukan untuk perbaikan pembelajaran
                        kedepannya <span className="text-red-600">*</span>
                      </p>
                      <textarea
                        value={saran}
                        disabled={true}
                        className="resize rounded-md w-full border border-slate-800 min-h-28 p-2"
                      ></textarea>
                    </div>
                    <div className="flex gap-20">
                      <div className="mt-5">
                      Bobot Skor Kuisioner
                        {Object.entries(skorMapping).map(([key, value]) => (
                          <div className="italic flex gap-2" key={key}>
                            <span className="block w-32">{key}</span> ={" "}
                            <span>{value} Skor</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-5 italic">
                      Rentang Interpretasi Skor Akhir
                        <div>
                          Rata - Rata 4.1 - 5 = Sangat Baik
                        </div>
                        <div>
                          Rata - Rata 3.1 - 4.0 = Baik
                        </div>
                        <div>
                          Rata - Rata 2.1 - 3.0 = Cukup
                        </div>
                        <div>
                          Rata - Rata 1.1 - 2.0 = Kurang
                        </div>
                        <div>
                          Rata - Rata 0 - 1.0 = Sangat Kurang
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="ml-16">
            <Footer />
          </div>
        </>
      ) : null}
    </div>
  );
};

export default DetailLaporanEvaluasi;
