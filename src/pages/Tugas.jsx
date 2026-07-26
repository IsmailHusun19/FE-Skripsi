import Navbar from "../component/Navbar";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faPen,
  faTrash,
  faEye,
  faCircleCheck as faCircleCheckSolid,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import ChatBot from "../component/ChatBot";
import { Confirm } from "notiflix/build/notiflix-confirm-aio";
import SliderBar from "../component/SliderBar";
import {
  getUserCheck,
  deleteMatkulDosen,
  deleteMatkulMahasiswa,
  getMataKuliah,
  getTugas,
  deleteTugas
} from "../config/FetchingData";
import Footer from "../component/Footer";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/id";
dayjs.locale("id");

const Tugas = () => {
  const { idMatkul } = useParams();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [openChatBot, setOpenChatBot] = useState(false);
  const [deleteMatkul, setDeleteMatkul] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState([]);
  const [dataMataKuliah, setDataMataKuliah] = useState([]);
  const [dataTugas, setDataTugas] = useState([]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const getDataUser = async () => {
    setLoading(true);
    try {
      const dataUser = await getUserCheck();
      const tugas = await getTugas(idMatkul);
      const getDataMataKuliah = await getMataKuliah(idMatkul);
      setDataTugas(tugas.data);
      setDataMataKuliah(getDataMataKuliah);
      setUser(dataUser);
    } catch (error) {
      console.log(error);
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

  const handleDeleteTugas = async (idTugas) => {
    try{
      Confirm.show(
        "Konfirmasi Hapus Tugas",
        "Yakin ingin menghapus tugas ini?",
        "Ya",
        "Tidak",
        async () => {
          const hapus = await deleteTugas(idTugas);
          if(hapus.message === "Tugas berhasil dihapus"){
            Notify.success("Berhasil menghapus tugas");
            getDataUser();
          }
        },
        () => {
          null
        }
      );
    }catch{
      Notify.failure("Gagal menghapus tugas");
    }
  }

  useEffect(() => {
    handleDeleteMatkul();
  }, [deleteMatkul]);

  return (
    <div className="container-satu overflow-x-hidden">
      {!loading ? (
        <>
          {" "}
          <Navbar />
          <div className="w-full flex mb-10">
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
                <div className="flex flex-col items-center mt-5 transition-all duration-300 w-[95%] print-container">
                  <h1 className="justify-start w-full mb-3 text-3xl print:text-center print:my-5 print:text-2xl print:font-bold">
                    Tugas
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
                    <div className="px-4 pb-2 border-b border-slate-300 flex justify-between items-center">
                      <h1 className="text-xl">Daftar Tugas</h1>
                      {user.role === "Dosen" ? (
                        <>
                          <div
                            className="cursor-pointer"
                            onClick={() =>
                              navigate(`/mengelolatugas/${idMatkul}`)
                            }
                          >
                            <div className="p-3 bg-blue-700 rounded-md flex justify-center gap-2 text-slate-200 font-medium hover:text-white">
                              <FontAwesomeIcon
                                className="text-lg"
                                icon={faPlus}
                              />{" "}
                              Tambah Tugas
                            </div>
                          </div>
                        </>
                      ) : null}
                    </div>
                    <div className="mt-6 mx-0 lg:mx-3 flex flex-col gap-3">
                      {user.role === "Dosen" ? (
                        <>
                          {dataTugas.length === 0 ? (
                            <p className="text-center text-gray-500 mt-6">
                              Belum ada tugas
                            </p>
                          ) : (
                            dataTugas.map((item, index) => (
                              <div key={index}>
                                <div className="relative border border-gray-600 flex items-center min-h-24 rounded-md shadow-md hover:shadow-lg hover:text-black">
                                  <div className="p-3">
                                    <h1 className="text-lg mb-1 mt-4">
                                      {item.judul}
                                    </h1>
                                    <p className="text-sm mb-5">
                                      {item.deskripsi}
                                    </p>
                                  </div>
                                  <div className="absolute text-xs top-2 left-3">
                                    {dayjs(item.tanggalDibuat).format(
                                      "dddd, D MMMM YYYY"
                                    )}
                                  </div>
                                  <div className="absolute text-xs bottom-2 left-3">
                                    <span className="font-bold">Deadline</span>{" "}
                                    {dayjs(item.deadline).format(
                                      "dddd, D MMMM YYYY"
                                    )}
                                  </div>
                                  <div className="absolute bottom-2 right-2 text-sm flex gap-2">
                                    <FontAwesomeIcon
                                      className="text-base bg-green-500 py-2 px-3 rounded-md cursor-pointer hover:text-white"
                                      icon={faEye}
                                      onClick={() =>
                                        navigate(
                                          `/detail-tugas/${idMatkul}/${item.id}`
                                        )
                                      }
                                    />
                                    <FontAwesomeIcon
                                      className="text-base bg-yellow-500 py-2 px-3 rounded-md cursor-pointer hover:text-white"
                                      icon={faPen}
                                      onClick={() =>
                                        navigate(
                                          `/mengelolatugas/${idMatkul}/${item.id}`
                                        )
                                      }
                                    />
                                    <FontAwesomeIcon
                                      className="text-base bg-red-500 py-2 px-3 rounded-md cursor-pointer hover:text-white"
                                      icon={faTrash}
                                      onClick={() => handleDeleteTugas(item.id)}
                                    />
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </>
                      ) : (
                        <>
                          {dataTugas.length === 0 ? (
                            <p className="text-center text-gray-500 mt-6">
                              Belum ada tugas
                            </p>
                          ) : (
                            dataTugas.map((item, index) => (
                              <div
                                key={index}
                                onClick={() =>
                                  navigate(
                                    `/detail-tugas/${idMatkul}/${item.id}`
                                  )
                                }
                              >
                                <div className="relative border cursor-pointer border-gray-600 flex items-center min-h-24 rounded-md shadow-md hover:shadow-lg hover:text-black hover:border-2">
                                  <FontAwesomeIcon
                                    className={`absolute top-2 right-2 ${
                                      item.status
                                        ? new Date(item.waktuDikumpulkan) >
                                          new Date(item.deadline)
                                          ? "text-yellow-600"
                                          : "text-green-600"
                                        : "text-gray-600"
                                    } text-xl`}
                                    icon={faCircleCheckSolid}
                                  />
                                  <div className="p-3">
                                    <h1 className="text-lg mb-1 mt-4">
                                      {item.judul}
                                    </h1>
                                    <p className="text-sm mb-5">
                                      {item.deskripsi}
                                    </p>
                                  </div>
                                  <div className="absolute text-xs top-2 left-3">
                                    {dayjs(item.tanggalDibuat).format(
                                      "dddd, D MMMM YYYY"
                                    )}
                                  </div>
                                  <div className="absolute text-xs bottom-2 left-3">
                                    <span className="font-bold">Deadline</span>{" "}
                                    {dayjs(item.deadline).format(
                                      "dddd, D MMMM YYYY"
                                    )}
                                  </div>
                                  <div className="absolute bottom-2 right-4 text-base">
                                    {!item.status
                                      ? "0"
                                      : item.nilai === null
                                      ? "0"
                                      : item.nilai}
                                    /100
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </>
                      )}
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

export default Tugas;
