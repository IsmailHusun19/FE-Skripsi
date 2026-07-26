import React, { useEffect, useState, useContext, useRef } from "react";
import MenuSlideBar from "../../component/Admin/MenuSlidebar";
import { SidebarContext } from "../../component/Admin/SidebarContextProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUsersSlash } from "@fortawesome/free-solid-svg-icons";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import { Confirm } from "notiflix/build/notiflix-confirm-aio";
import {
  getUserCheck,
  deleteMatkulDosen,
  deleteMatkulMahasiswa,
  getDataKuisionerDosen,
  getMataKuliah,
} from "../../config/FetchingData";
import { useParams, useNavigate } from "react-router-dom";
import "../../style/App.css";
import { useReactToPrint } from "react-to-print";
import KopSurat from "../../component/KopSurat";

const ListFeedbackSistem = () => {
  const { idMatkul } = useParams();
  const { expanded } = useContext(SidebarContext);
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [openChatBot, setOpenChatBot] = useState(false);
  const [deleteMatkul, setDeleteMatkul] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState([]);
  const [dataMataKuliah, setDataMataKuliah] = useState([]);
  const [dataKuisioner, setDataKuisioner] = useState([]);
  const [cekDataKuisioner, setCekDataKuisioner] = useState(false);
  const [dataKuisionerNew, setDataKuisionerNew] = useState([]);
  const [filterWaktu, setFilterWaktu] = useState("all");
  const [tanggalAwal, setTanggalAwal] = useState("");
  const [tanggalAkhir, setTanggalAkhir] = useState("");

  const skorMapping = {
    "Sangat Baik": 5,
    Baik: 4,
    Cukup: 3,
    Kurang: 2,
    "Sangat Kurang": 1,
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const getDataUser = async () => {
    setLoading(true);
    try {
      const dataUser = await getUserCheck();
      const getDataMataKuliah = await getMataKuliah(idMatkul);
      const kuisioner = await getDataKuisionerDosen(idMatkul);
      setDataKuisioner(kuisioner);
      setDataMataKuliah(getDataMataKuliah);
      if (!kuisioner || kuisioner.length === 0) {
        setCekDataKuisioner(false);
        console.log(kuisioner);
        setDataKuisioner([]);
      } else {
        setCekDataKuisioner(true);
        setDataKuisioner(kuisioner);
      }
      setUser(dataUser);
    } catch (error) {
      console.log(error);
      setCekDataKuisioner(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDataUser();
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

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    documentTitle: "Laporan Daftar Mahasiswa",
    contentRef: componentRef,
  });

  const hitungData = () => {
    function interpretasiSkor(rataRata) {
      if (rataRata >= 4.1) return "Sangat Baik";
      if (rataRata >= 3.1) return "Baik";
      if (rataRata >= 2.1) return "Cukup";
      if (rataRata >= 1.1) return "Kurang";
      return "Sangat Kurang";
    }
    const hasil = dataKuisioner.map((kuisioner, index) => {
      const skorJawaban = kuisioner.jawabanKuisioner.map(
        (jawaban) => skorMapping[jawaban] || 0
      );
      const totalSkor = skorJawaban.reduce((total, skor) => total + skor, 0);
      const rataRata = totalSkor / skorJawaban.length;
      const interpretasi = interpretasiSkor(rataRata);
      const id = kuisioner.id;

      return {
        id,
        totalSkor,
        rataRata: rataRata.toFixed(2),
        interpretasi,
        saran: kuisioner.saran,
        tanggal: kuisioner.tanggal,
      };
    });

    setDataKuisionerNew(hasil);
  };

  useEffect(() => {
    if (!loading) {
      cekDataKuisioner ? hitungData() : null;
    }
  }, [loading]);

  const filterDataByTime = (data) => {
    if (!tanggalAwal && !tanggalAkhir) return data;

    const start = tanggalAwal ? new Date(tanggalAwal) : null;
    const end = tanggalAkhir ? new Date(tanggalAkhir) : null;

    return data.filter((item) => {
      const itemDate = new Date(item.tanggal);
      if (start && itemDate < start) return false;
      if (end && itemDate > end) return false;
      return true;
    });
  };

  return (
    <div className="container-satu overflow-x-hidden">
      {!loading ? (
        <>
          {" "}
          <div className="relative overflow-x-hidden">
            <MenuSlideBar />
            <div className="h-[calc(100vh-64x)] pb-5">
              <div
                className={`grid gap-3 mr-5 transition-all duration-300
    ${expanded ? "sm:ml-72" : "ml-20"}
    grid-cols-1 sm:[grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]
  `}
              >
                <div className="w-full flex">
                  <div className="relative pt-[10px] min-h-screen transition-all duration-300 ease-in-out w-full">
                    <div
                      className={`flex-1 transition-all duration-300 ease-in-out min-h-screen flex justify-center`}
                    >
                      <div
                        className="flex flex-col items-center mt-5 transition-all duration-300 w-[95%] print-container"
                        ref={componentRef}
                      >
                        <KopSurat />
                        <h1 className="justify-start w-full mb-3 text-3xl print:text-center print:my-5 print:text-2xl print:font-bold">
                          Laporan Evaluasi Dosen
                        </h1>
                        <div className="w-full pb-8 pt-6 border-t-4 border-blue-800 rounded-md shadow-lg no-shadow print:border-none">
                          <h1 className="mb-3 text-xl px-4 pb-4 border-b border-slate-300 print:mt-[-20px] print:mb-[-10px] print:pb-2">
                            Data Mata Kuliah
                          </h1>
                          <div className="grid grid-cols-1 mt-6 md:grid-cols-2 gap-4 px-4 print:grid-cols-2 print:gap-0 print:text-sm">
                            <div className="border-0 sm:border print:border-none rounded-sm p-2 flex print:p-1">
                              <span className="w-28 flex-shrink-0 block print:font-semibold">
                                NID
                              </span>{" "}
                              <span className="truncate">
                                : {dataMataKuliah.dosen[0].nomorinduk}
                              </span>
                            </div>
                            <div className="border-0 sm:border print:border-none rounded-sm p-2 flex print:p-1">
                              <span className="w-28 flex-shrink-0 block print:font-semibold">
                                Email
                              </span>{" "}
                              <span className="truncate">
                                : {dataMataKuliah.dosen[0].email}
                              </span>
                            </div>
                            <div className="border-0 sm:border print:border-none rounded-sm p-2 flex print:p-1">
                              <span className="w-28 flex-shrink-0 block print:font-semibold">
                                Dosen
                              </span>{" "}
                              <span className="truncate">
                                : {dataMataKuliah.dosen[0].nama}
                              </span>
                            </div>
                            <div className="border-0 sm:border print:border-none rounded-sm p-2 flex print:p-1">
                              <span className="w-28 flex-shrink-0 block print:font-semibold">
                                Mata Kuliah
                              </span>{" "}
                              <span className="truncate">
                                : {dataMataKuliah.nama}
                              </span>
                            </div>
                            <div className="border-0 sm:border print:border-none rounded-sm p-2 flex print:p-1">
                              <span className="w-28 flex-shrink-0 block print:font-semibold">
                                Tanggal Dibuat
                              </span>{" "}
                              <span className="truncate">
                                :{" "}
                                {new Date(
                                  dataMataKuliah.tanggalDibuat
                                ).toLocaleDateString("id-ID", {
                                  weekday: "long",
                                  day: "2-digit",
                                  month: "long",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="w-full pb-8 pt-6 border-t-4 border-blue-800 rounded-md shadow-lg mt-10 no-shadow print:border-none print:mt-[-20px]">
                          <h1 className="mb-3 text-xl px-4 pb-4 border-b border-slate-300 print:mb-[-10px] print:pb-2">
                            Laporan Evaluasi
                          </h1>
                          <div className="mt-6 mx-0 lg:mx-3">
                            <div
                              className="overflow-x-auto transition-all duration-300 ease-in-out
                    mx-3 lg:mx-0"
                            >
                              <div   className={`mb-4 flex flex-wrap items-end gap-4 p-4 rounded-md shadow-sm ${
    !tanggalAwal ? "print:hidden" : ""
  }`}>
                                <div className="flex flex-col">
                                  <label
                                    htmlFor="tanggalAwal"
                                    className="text-sm font-medium text-slate-700 mb-1"
                                  >
                                    Dari Tanggal
                                  </label>
                                  <input
                                    id="tanggalAwal"
                                    type="date"
                                    value={tanggalAwal}
                                    onChange={(e) =>
                                      setTanggalAwal(e.target.value)
                                    }
                                    className="border border-slate-300 px-3 py-2 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:outline-none"
                                  />
                                </div>
                                <div className="flex flex-col">
                                  <label
                                    htmlFor="tanggalAkhir"
                                    className="text-sm font-medium text-slate-700 mb-1"
                                  >
                                    Sampai Tanggal
                                  </label>
                                  <input
                                    id="tanggalAkhir"
                                    type="date"
                                    value={tanggalAkhir}
                                    onChange={(e) =>
                                      setTanggalAkhir(e.target.value)
                                    }
                                    className="border border-slate-300 px-3 py-2 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:outline-none"
                                  />
                                </div>
                                <div className="mt-1 print:hidden">
                                  <button
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md shadow-md transition-colors"
                                    onClick={() => {
                                      setTanggalAwal("");
                                      setTanggalAkhir("");
                                    }}
                                  >
                                    Reset Filter
                                  </button>
                                </div>
                              </div>

                              <table className="w-full rounded-lg print:text-sm">
                                <thead>
                                  <tr className="bg-slate-800 text-slate-200">
                                    <th className="border border-slate-400 p-2 w-[50px] max-w-max-[50px] text-center print:w-[40px] print:min-w-[40px]">
                                      NO
                                    </th>
                                    <th className="border border-slate-400 p-2 w-[80px] min-w-[80px] print:w-[50px] print:min-w-[50px]">
                                      Skor
                                    </th>
                                    <th className="border border-slate-400 p-2 w-[150px] min-w-[150px] print:w-[100px] print:min-w-[100px]">
                                      Skor Rata Rata
                                    </th>
                                    <th className="border border-slate-400 p-2 w-[150px] min-w-[150px] print:max-w-[100px] print:min-w-[100px]">
                                      Interpretasi
                                    </th>
                                    <th className="border border-slate-400 p-2 w-[350px] min-w-[350px] print:min-w-[200px]">
                                      Saran
                                    </th>
                                    <th className="border border-slate-400 p-2 w-[230px] min-w-[230px] lebarTable150">
                                      Tanggal
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {cekDataKuisioner ? (
                                    filterDataByTime(
                                      dataKuisionerNew,
                                      filterWaktu
                                    ).map((item, index) => (
                                      <tr
                                        key={index}
                                        className="hover:bg-slate-800 cursor-pointer hover:text-slate-100"
                                        onClick={() =>
                                          navigate(
                                            `/admin/pengguna/feedback mata kuliah/detail-feedback/${idMatkul}/${item.id}`
                                          )
                                        }
                                      >
                                        <td className="border border-slate-400 p-2 text-center">
                                          {index + 1}
                                        </td>
                                        <td className="border border-slate-400 p-2 text-center">
                                          {item.totalSkor}
                                        </td>
                                        <td className="border border-slate-400 p-2 text-center">
                                          {item.rataRata}
                                        </td>
                                        <td
                                          className={`border border-slate-400 p-2 text-center font-semibold ${
                                            item.interpretasi === "Sangat Baik"
                                              ? "text-green-700"
                                              : item.interpretasi === "Baik"
                                              ? "text-lime-700"
                                              : item.interpretasi === "Cukup"
                                              ? "text-yellow-700"
                                              : item.interpretasi === "Kurang"
                                              ? "text-orange-700"
                                              : item.interpretasi ===
                                                "Sangat Kurang"
                                              ? "text-red-700"
                                              : ""
                                          }`}
                                        >
                                          {item.interpretasi}
                                        </td>
                                        <td className="border border-slate-400 p-2 text-center">
                                          {item.saran}
                                        </td>
                                        <td className="border border-slate-400 p-2 text-center">
                                          {new Date(
                                            item.tanggal
                                          ).toLocaleDateString("id-ID", {
                                            weekday: "long",
                                            day: "2-digit",
                                            month: "long",
                                            year: "numeric",
                                          })}
                                        </td>
                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                      <td
                                        colSpan="7"
                                        className="border border-slate-400 p-2 text-center"
                                      >
                                        <div className="h-[150px] flex items-center justify-center flex-col gap-5">
                                          <FontAwesomeIcon
                                            className="text-[50px]"
                                            icon={faUsersSlash}
                                          />
                                          <h1>Belum ada Mahasiswa</h1>
                                        </div>
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                            <div className="flex justify-end">
                              <button
                                className="p-3 w-36 rounded-md font-semibold bg-blue-700 text-slate-200 hover:text-slate-100 mt-5 mb-20"
                                type="button"
                                onClick={handlePrint}
                              >
                                Cetak Laporan
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default ListFeedbackSistem;
