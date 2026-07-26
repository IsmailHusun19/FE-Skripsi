import Navbar from "../component/Navbar";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
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
  getDetailTugas,
  cekDetailPengumpulanStatusTugasMahasiswa,
  mengumpulkanTugas,
  mengumpulkanTugasUlang,
  getTugasDikumpulkanDosen,
  putNilaiTugas,
} from "../config/FetchingData";
import Footer from "../component/Footer";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/id";
dayjs.locale("id");
import {
  FaFileImage,
  FaFilePdf,
  FaFileVideo,
  FaFileAudio,
  FaFileExcel,
  FaFileAlt,
} from "react-icons/fa";
import { Report } from "notiflix/build/notiflix-report-aio";
import { BASE_URL } from "../utils/config";

const DetailTugas = () => {
  const { idMatkul, idTugas } = useParams();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [openChatBot, setOpenChatBot] = useState(false);
  const [deleteMatkul, setDeleteMatkul] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState([]);
  const [dataMataKuliah, setDataMataKuliah] = useState([]);
  const [dataTugas, setDataTugas] = useState([]);
  const [fileTugas, setFileTugas] = useState("");
  const [cekStatusTugas, setCekStatusTugas] = useState([]);
  const [tugasDikumpulkan, setTugasDikumpulkan] = useState([]);
  const [nilai, setNilai] = useState({});

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const getDataUser = async () => {
    setLoading(true);
    try {
      const dataUser = await getUserCheck();
      const tugas = await getDetailTugas(idMatkul, idTugas);
      const getDataMataKuliah = await getMataKuliah(idMatkul);
      const statusTugas = await cekDetailPengumpulanStatusTugasMahasiswa(
        idTugas
      );
      setCekStatusTugas(statusTugas.data);
      setDataTugas(tugas.data);
      setDataMataKuliah(getDataMataKuliah);
      setUser(dataUser);
      if (dataUser.role === "Dosen") {
        const getTugas = await getTugasDikumpulkanDosen(idTugas);
        setTugasDikumpulkan(getTugas.data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDataUser();
  }, [idMatkul]);

  useEffect(() => {
    if (!loading) {
      const initialNilai = {};
      tugasDikumpulkan.forEach((item) => {
        initialNilai[item.id] =
          item.nilai !== null && item.nilai !== undefined
            ? String(item.nilai)
            : "";
      });
      setNilai(initialNilai);
    }
  }, [tugasDikumpulkan, loading]);

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

  const getFileTypeFromUrl = (url) => {
    const extension = url.split(".").pop().toLowerCase();

    const mapping = {
      jpg: "image",
      jpeg: "image",
      png: "image",
      gif: "image",
      pdf: "pdf",
      mp4: "video",
      mp3: "audio",
      zip: "zip",
      rar: "zip",
      xlsx: "excel",
      xls: "excel",
      doc: "document",
      docx: "document",
    };

    return mapping[extension] || "unknown";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        file: fileTugas,
      };
      const reload = () => {
        const observer = new MutationObserver(() => {
          const confirmButton = document.getElementById("NXReportButton");
          if (confirmButton) {
            confirmButton.addEventListener("click", () => {
              location.reload();
              observer.disconnect();
            });
          }
        });

        observer.observe(document.body, { childList: true, subtree: true });
      };
      if (cekStatusTugas.status === true) {
        const mengumpulkan = await mengumpulkanTugasUlang(
          data,
          idTugas,
          idMatkul
        );
        if (mengumpulkan.message === "Tugas berhasil diperbarui") {
          reload();
          Report.success(
            "Success",
            "Berhasil mengumpulkan ulang tugas",
            "Okay",
            {
              backOverlay: false,
              messageFontSize: "16px",
              cssAnimation: true,
              cssAnimationStyle: "zoom",
              position: "center-center",
            }
          );
        }
      } else {
        const mengumpulkan = await mengumpulkanTugas(data, idTugas, idMatkul);
        if (mengumpulkan.message === "Tugas berhasil dikumpulkan") {
          reload();
          Report.success("Success", "Berhasil mengumpulkan tugas", "Okay", {
            backOverlay: false,
            messageFontSize: "16px",
            cssAnimation: true,
            cssAnimationStyle: "zoom",
            position: "center-center",
          });
        }
      }
    } catch (error) {
      console.error("Gagal mengumpulkan tugas:", error);
      Notify.failure("Gagal mengumpulkan tugas");
    }
  };

  const handleSubmitNilai =  async () => {
    try{
      const payload = {
        data: Object.entries(nilai).map(([idPengumpulan, nilaiValue]) => ({
          idPengumpulan: parseInt(idPengumpulan),
          nilai: parseInt(nilaiValue),
        })),
      };
      const ubahNilai = await putNilaiTugas(payload);
      console.log(payload.data)
      Notify.success("Berhasil menilai tugas");
    }catch(error){
      console.error("Gagal menilai tugas:", error);
      Notify.failure("Gagal menilai tugas");
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
                      <h1 className="text-xl">Tugas {dataMataKuliah.nama}</h1>
                    </div>
                    <div>
                      <div className="px-4 py-14 mt-4 flex gap-2 flex-col relative">
                        <h1 className="font-medium text-xl">
                          {dataTugas.judul}
                        </h1>
                        <p>{dataTugas.deskripsi}</p>
                        <div className="mt-4 space-y-4">
                          <div className="flex w-full flex-wrap gap-2">
                            {dataTugas.files?.map((file) => {
                              const fileType = getFileTypeFromUrl(
                                file.filePath
                              );

                              const renderIcon = () => {
                                switch (fileType) {
                                  case "image":
                                    return <FaFileImage size={40} />;
                                  case "pdf":
                                    return <FaFilePdf size={40} />;
                                  case "video":
                                    return <FaFileVideo size={40} />;
                                  case "audio":
                                    return <FaFileAudio size={40} />;
                                  case "excel":
                                    return <FaFileExcel size={40} />;
                                  default:
                                    return <FaFileAlt size={40} />;
                                }
                              };

                              const renderText = () => {
                                switch (fileType) {
                                  case "image":
                                    return (
                                      <>
                                        File Gambar
                                        <br />
                                        Klik untuk melihat
                                      </>
                                    );
                                  case "pdf":
                                    return (
                                      <>
                                        File PDF
                                        <br />
                                        Klik untuk melihat
                                      </>
                                    );
                                  case "video":
                                    return (
                                      <>
                                        File Video
                                        <br />
                                        Klik untuk melihat
                                      </>
                                    );
                                  case "audio":
                                    return (
                                      <>
                                        File Audio
                                        <br />
                                        Klik untuk mendengarkan
                                      </>
                                    );
                                  case "excel":
                                    return (
                                      <>
                                        File Excel
                                        <br />
                                        Klik untuk melihat
                                      </>
                                    );
                                  default:
                                    return (
                                      <>
                                        File Dokumen
                                        <br />
                                        Klik untuk download
                                      </>
                                    );
                                }
                              };

                              return (
                                <a
                                  key={file.id}
                                  href={`${BASE_URL}${file.filePath}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="md:w-max w-full"
                                >
                                  <div className="md:w-max w-full h-20 flex gap-3 border border-slate-600 p-3 box-content rounded-md">
                                    <div className="flex gap-2 justify-center text-base items-center">
                                      {fileType === "image" ? (
                                        <img
                                          src={`${BASE_URL}${file.filePath}`}
                                          alt="file"
                                          loading="lazy"
                                          title={`file-${file.id}`}
                                          className="w-20 h-20 object-cover"
                                        />
                                      ) : (
                                        renderIcon()
                                      )}
                                      <span className="flex justify-center flex-col">
                                        {renderText()}
                                      </span>
                                    </div>
                                  </div>
                                </a>
                              );
                            })}
                          </div>
                        </div>
                        <div className="absolute text-base top-2 left-4">
                          {dayjs(dataTugas.tanggalDibuat).format(
                            "dddd, D MMMM YYYY"
                          )}
                        </div>
                        <div className="absolute text-base bottom-2 left-4">
                          <span className="font-bold">Deadline</span>{" "}
                          {dayjs(dataTugas.deadline).format(
                            "dddd, D MMMM YYYY"
                          )}
                        </div>
                        {user.role === "Mahasiswa" ? (
                          <>
                            <div className="absolute bottom-2 right-4 text-base">
                              {!cekStatusTugas.status
                                ? "0"
                                : cekStatusTugas.data.nilai === null
                                ? "0"
                                : cekStatusTugas.data.nilai}
                              /100
                            </div>
                          </>
                        ) : null}
                        {user.role === "Mahasiswa" ? (
                          <>
                            {" "}
                            <FontAwesomeIcon
                              className={`absolute top-2 right-2 ${
                                cekStatusTugas.status
                                  ? new Date(
                                      cekStatusTugas.data.tanggalKumpul
                                    ) > new Date(dataTugas.deadline)
                                    ? "text-yellow-600"
                                    : "text-green-600"
                                  : "text-gray-600"
                              } text-xl`}
                              icon={faCircleCheckSolid}
                            />
                          </>
                        ) : null}
                      </div>
                      {user.role === "Mahasiswa" ? (
                        <>
                          {" "}
                          <div className="px-4">
                            <form className="mt-4" onSubmit={handleSubmit}>
                              <div className="mb-6">
                                <div>
                                  <input
                                    type="file"
                                    id="fileTugas"
                                    className="file-input file-input-bordered w-full mb-5"
                                    onChange={(e) =>
                                      setFileTugas(e.target.files[0])
                                    }
                                  />
                                </div>
                                <div className="mt-4 space-y-4">
                                  <div className="flex w-full flex-wrap gap-2">
                                    {cekStatusTugas.status ? (
                                      <>
                                        {[cekStatusTugas.data]?.map(
                                          (file, index) => {
                                            const fileType = getFileTypeFromUrl(
                                              file.fileUrl
                                            );
                                            console.log(fileType);

                                            const renderIcon = () => {
                                              switch (fileType) {
                                                case "image":
                                                  return (
                                                    <FaFileImage size={40} />
                                                  );
                                                case "pdf":
                                                  return (
                                                    <FaFilePdf size={40} />
                                                  );
                                                case "video":
                                                  return (
                                                    <FaFileVideo size={40} />
                                                  );
                                                case "audio":
                                                  return (
                                                    <FaFileAudio size={40} />
                                                  );
                                                case "excel":
                                                  return (
                                                    <FaFileExcel size={40} />
                                                  );
                                                default:
                                                  return (
                                                    <FaFileAlt size={40} />
                                                  );
                                              }
                                            };

                                            const renderText = () => {
                                              switch (fileType) {
                                                case "image":
                                                  return (
                                                    <>
                                                      File Gambar
                                                      <br />
                                                      Klik untuk melihat
                                                    </>
                                                  );
                                                case "pdf":
                                                  return (
                                                    <>
                                                      File PDF
                                                      <br />
                                                      Klik untuk melihat
                                                    </>
                                                  );
                                                case "video":
                                                  return (
                                                    <>
                                                      File Video
                                                      <br />
                                                      Klik untuk melihat
                                                    </>
                                                  );
                                                case "audio":
                                                  return (
                                                    <>
                                                      File Audio
                                                      <br />
                                                      Klik untuk mendengarkan
                                                    </>
                                                  );
                                                case "excel":
                                                  return (
                                                    <>
                                                      File Excel
                                                      <br />
                                                      Klik untuk melihat
                                                    </>
                                                  );
                                                default:
                                                  return (
                                                    <>
                                                      File Dokumen
                                                      <br />
                                                      Klik untuk download
                                                    </>
                                                  );
                                              }
                                            };

                                            return (
                                              <a
                                                key={index}
                                                href={`${BASE_URL}${file.fileUrl}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="md:w-max w-full"
                                              >
                                                <div className="md:w-max w-full h-20 flex gap-3 border border-slate-600 p-3 box-content rounded-md">
                                                  <div className="flex gap-2 justify-center text-base items-center">
                                                    {fileType === "image" ? (
                                                      <img
                                                        src={`${BASE_URL}${file.fileUrl}`}
                                                        alt="file"
                                                        loading="lazy"
                                                        title={`file-${file.fileUrl}`}
                                                        className="w-20 h-20 object-cover"
                                                      />
                                                    ) : (
                                                      renderIcon()
                                                    )}
                                                    <span className="flex justify-center flex-col">
                                                      {renderText()}
                                                    </span>
                                                  </div>
                                                </div>
                                              </a>
                                            );
                                          }
                                        )}
                                      </>
                                    ) : null}
                                  </div>
                                </div>
                              </div>

                              <div className="flex justify-end w-full">
                                <button
                                  type="submit"
                                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                >
                                  Submit
                                </button>
                              </div>
                            </form>
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>
                  {user.role === "Dosen" ? (
                    <>
                      <div className="w-full pb-8 pt-6 border-t-4 border-blue-800 rounded-md shadow-lg mt-10 no-shadow print:border-none">
                        <div className="px-4 pb-2 border-b border-slate-300 flex justify-between items-center">
                          <h1 className="text-xl">
                            Daftar Mahasiswa Mengumpulkan Tugas
                          </h1>
                        </div>
                        <div className="flex flex-col">
                          {tugasDikumpulkan.map((item, index) => (
                            <div key={index} className="flex justify-center rounded-md p-4 m-auto mt-5 mx-4 border border-gray-400 shadow-sm relative flex-col h-[300px] lg:flex-row lg:h-[198px]">
                              <div className="w-full flex gap-2 flex-col pb-5">
                                <h1 className="font-medium text-xl">
                                  {item.mahasiswa.nama}
                                </h1>
                                {(() => {
                                  const file = item.fileUrl;
                                  const fileType = getFileTypeFromUrl(file);

                                  const renderIcon = () => {
                                    switch (fileType) {
                                      case "image":
                                        return <FaFileImage size={40} />;
                                      case "pdf":
                                        return <FaFilePdf size={40} />;
                                      case "video":
                                        return <FaFileVideo size={40} />;
                                      case "audio":
                                        return <FaFileAudio size={40} />;
                                      case "excel":
                                        return <FaFileExcel size={40} />;
                                      default:
                                        return <FaFileAlt size={40} />;
                                    }
                                  };

                                  const renderText = () => {
                                    switch (fileType) {
                                      case "image":
                                        return (
                                          <>
                                            File Gambar
                                            <br />
                                            Klik untuk melihat
                                          </>
                                        );
                                      case "pdf":
                                        return (
                                          <>
                                            File PDF
                                            <br />
                                            Klik untuk melihat
                                          </>
                                        );
                                      case "video":
                                        return (
                                          <>
                                            File Video
                                            <br />
                                            Klik untuk melihat
                                          </>
                                        );
                                      case "audio":
                                        return (
                                          <>
                                            File Audio
                                            <br />
                                            Klik untuk mendengarkan
                                          </>
                                        );
                                      case "excel":
                                        return (
                                          <>
                                            File Excel
                                            <br />
                                            Klik untuk melihat
                                          </>
                                        );
                                      default:
                                        return (
                                          <>
                                            File Dokumen
                                            <br />
                                            Klik untuk download
                                          </>
                                        );
                                    }
                                  };

                                  return (
                                    <a
                                      key={file.id}
                                      href={`${BASE_URL}${file}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="md:w-max w-full"
                                    >
                                      <div className="md:w-max h-20 flex gap-3 border border-slate-600 p-3 box-content rounded-md">
                                        <div className="flex gap-2 justify-center text-base items-center">
                                          {fileType === "image" ? (
                                            <img
                                              src={`${BASE_URL}${file}`}
                                              alt="file"
                                              loading="lazy"
                                              title={`file-${file}`}
                                              className="w-20 h-20 object-cover"
                                            />
                                          ) : (
                                            renderIcon()
                                          )}
                                          <span className="flex justify-center flex-col">
                                            {renderText()}
                                          </span>
                                        </div>
                                      </div>
                                    </a>
                                  );
                                })()}
                              </div>
                              <div className="mt-0 w-full lg:mt-4">
                                <div>
                                  <input
                                    type="number"
                                    min={0}
                                    max={100}
                                    id="judulTugas"
                                    className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none"
                                    placeholder="Nilai"
                                    value={nilai[item.id] ?? ""}
                                    onChange={(e) => {
                                      let val = e.target.value;
                                      if (val === "") {
                                        setNilai((prev) => ({
                                          ...prev,
                                          [item.id]: "",
                                        }));
                                        return;
                                      }

                                      let num = parseInt(val, 10);
                                      if (num < 0) num = 0;
                                      if (num > 100) num = 100;

                                      setNilai((prev) => ({
                                        ...prev,
                                        [item.id]: num.toString(),
                                      }));
                                    }}
                                  />
                                </div>
                                <div className="absolute bottom-2 left-4">
                                  <p className="text-sm opacity-80">
                                    <span className="font-semibold">
                                      Tanggal mengumpulkan :
                                    </span>{" "}
                                    {new Date(
                                      item.tanggalKumpul
                                    ).toLocaleDateString("id-ID", {
                                      weekday: "long",
                                      day: "2-digit",
                                      month: "long",
                                      year: "numeric",
                                    })}{" "}
                                    {new Date(item.tanggalKumpul) >
                                    new Date(dataTugas.deadline) ? (
                                      <span className="text-yellow-500 font-semibold">
                                        Terlambat
                                      </span>
                                    ) : (
                                      <span className="text-green-600 font-semibold">
                                        Tepat Waktu
                                      </span>
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-end w-[95%] m-auto mt-4 pr-0 lg:pr-5 lg:w-full">
                          <button
                            type="submit"
                            onClick={() => handleSubmitNilai()}
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </>
                  ) : null}
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

export default DetailTugas;
