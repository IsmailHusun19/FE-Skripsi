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
  getDataKuisionerMahasiswa,
  postDataKuisionerMahasiswa,
  getDataProgressMahasiswa,
} from "../config/FetchingData";
import Footer from "../component/Footer";
import { useParams, useNavigate } from "react-router-dom";
import "../style/App.css";
import { Loading } from "notiflix/build/notiflix-loading-aio";

const PenilianDosendanMatkul = () => {
  const { idMatkul } = useParams();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [openChatBot, setOpenChatBot] = useState(false);
  const [deleteMatkul, setDeleteMatkul] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState("");
  const [user, setUser] = useState([]);
  const [saran, setSaran] = useState("");
  const [doneKuisioner, setDoneKuisioner] = useState(false);
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
  const [jawabanKuisioner, setJawabanKuisioner] = useState(
    dataKuisioner.pertanyaan.map(() => "")
  );

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const getDataUser = async () => {
    try {
      const dataUser = await getUserCheck();
      setUser(dataUser);
    } catch (error) {
      console.log(error);
    }
  };

  const getProgress = async () => {
    setLoading(true)
    try {
      const getDataProgress = await getDataProgressMahasiswa(idMatkul);
      if (
        !getDataProgress ||
        !Array.isArray(getDataProgress.data) ||
        getDataProgress.data.length === 0
      ) {
        return setProgress(0);
      }
      setProgress(getDataProgress.data[0].progress);
    } catch (error) {
      console.log(error);
      setProgress(0);
    }finally{
      setLoading(false)
    }
  };

  const getDataKuisioner = async () => {
    try {
      const dataKuisioner = await getDataKuisionerMahasiswa(idMatkul);
      if (dataKuisioner) {
        setJawabanKuisioner(dataKuisioner.jawabanKuisioner);
        setSaran(dataKuisioner.saran);
        setDoneKuisioner(true);      
      } else {
        setDoneKuisioner(false)
        console.log("haha")
      }
    } catch (error) {
      console.log(error);
      setDoneKuisioner(false)
    }
  };
  

  useEffect(() => {
    getDataKuisioner();
    getDataUser();
    getProgress();
  }, [idMatkul]);

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

  const handleJawabanChange = (index, value) => {
    const updatedJawaban = [...jawabanKuisioner];
    updatedJawaban[index] = value;
    setJawabanKuisioner(updatedJawaban);
  };

  const handleSimpan = async () => {
    try {
      const semuaJawabanTerisi = jawabanKuisioner.every(
        (jawaban) => jawaban !== ""
      );
      const saranTerisi = saran.trim() !== "";
      if (!semuaJawabanTerisi || !saranTerisi) {
        Report.failure("Harap lengkapi data", "Anda belum melengkapi data kuisioner dengan benar", {
            backOverlay: false,
            messageFontSize: "16px",
            cssAnimation: true,
            cssAnimationStyle: "zoom",
            position: "center-center",
          });
        return;
      }
      const data = {
        jawabanKuisioner: jawabanKuisioner,
        saran: saran,
      };
      Confirm.show(
        "Mengisi Kuisioner",
        "Yakin sudah mengisi data dengan benar?",
        "Yes",
        "No",
        async () => {
            const postdataKuisioner = await postDataKuisionerMahasiswa(
                idMatkul,
                data
              );
              setDoneKuisioner(true)
          Notify.success("Anda berhasil mengisi kuisioner");
        },
        () => {
          null;
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container-satu overflow-x-hidden">
      {!loading ? (
        progress === 100 ? (
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
                    <h1 className="mb-3 italic">Note: indentitas anda tidak akan ketehui dosen</h1>
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
                                    disabled={doneKuisioner ? true : false}
                                    className="bg-transparent rounded p-1 w-full h-[88.67px] block focus:outline-none cursor-pointer"
                                    value={jawabanKuisioner[index]}
                                    onChange={(e) =>
                                      handleJawabanChange(index, e.target.value)
                                    }
                                  >
                                    <option value="">Pilih jawaban</option>
                                    {dataKuisioner.jawaban.map(
                                      (jawaban, idx) => (
                                        <option key={idx} value={jawaban}>
                                          {jawaban}
                                        </option>
                                      )
                                    )}
                                  </select>
                                </td>
                              </tr>
                            ))}
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
                          onChange={(e) => setSaran(e.target.value)}
                          disabled={doneKuisioner ? true : false}
                          className="resize rounded-md w-full border border-slate-800 min-h-28 p-2"
                        ></textarea>
                      </div>
                      {doneKuisioner ? (
                        <h1>Terima kasih sudah mengisi kuisioner..😊</h1>
                      ) : null}
                      {!doneKuisioner ? (
                        <div className="flex justify-end">
                          <button
                            className="p-3 w-36 rounded-md font-semibold bg-blue-700 text-slate-200 hover:text-slate-100 mt-5"
                            type="button"
                            onClick={handleSimpan}
                          >
                            Simpan
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="ml-16">
              <Footer />
            </div>
          </>
        ) : (
          navigate("/error")
        )
      ) : null}
    </div>
  );
};

export default PenilianDosendanMatkul;
