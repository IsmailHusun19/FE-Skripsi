import Navbar from "../component/Navbar";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import ChatBot from "../component/ChatBot";
import { Confirm } from "notiflix/build/notiflix-confirm-aio";
import SliderBar from "../component/SliderBar";
import {
  getUserCheck,
  deleteMatkulDosen,
  deleteMatkulMahasiswa,
  getMataKuliah,
  postDataTugas,
  getDetailTugas,
  editTugas,
} from "../config/FetchingData";
import Footer from "../component/Footer";
import { useParams, useNavigate } from "react-router-dom";
import { Report } from "notiflix/build/notiflix-report-aio";
import Datepicker from "react-tailwindcss-datepicker";
import {
  FaFileImage,
  FaFilePdf,
  FaFileVideo,
  FaFileAudio,
  FaFileExcel,
  FaFileAlt,
} from "react-icons/fa";
import { BASE_URL } from "../utils/config";

const MengelolaTugas = () => {
  const { idMatkul, idTugas } = useParams();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [openChatBot, setOpenChatBot] = useState(false);
  const [deleteMatkul, setDeleteMatkul] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState([]);
  const [dataMataKuliah, setDataMataKuliah] = useState([]);
  const [judulTugas, setJudulTugas] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [fileTugas, setFileTugas] = useState("");
  const [value, setValue] = useState({
    startDate: null,
    endDate: null,
  });
  const [cekEdit, setEdit] = useState(false);
  const [getDataTugas, setDataTugas] = useState([]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const getDataUser = async () => {
    setLoading(true);
    try {
      const dataUser = await getUserCheck();
      const getDataMataKuliah = await getMataKuliah(idMatkul);
      setDataMataKuliah(getDataMataKuliah);
      setUser(dataUser);
      if (idTugas) {
        const tugas = await getDetailTugas(idMatkul, idTugas);
        if (tugas?.status == 200) {
          setDataTugas(tugas);
          setEdit(true);
          setJudulTugas(tugas.data.judul);
          setDeskripsi(tugas.data.deskripsi);
          setValue({
            startDate: tugas.data.deadline,
            endDate: tugas.data.deadline,
          });
        } else {
          setEdit(false);
        }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        judul: judulTugas,
        deskripsi: deskripsi,
        file: fileTugas,
        deadline: value.startDate,
      };

      const clear = () => {
        setJudulTugas("");
        setDeskripsi("");
        setFileTugas("");
        setValue({
          startDate: null,
          endDate: null,
        })
      }

      const notif = (note) => {
        const observer = new MutationObserver(() => {
          const confirmButton = document.getElementById("NXReportButton");
          if (confirmButton) {
            confirmButton.addEventListener("click", () => {
              navigate(`/tugas/${idMatkul}`);
              observer.disconnect();
            });
          }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        Report.success("Success", `${note}`, "Okay", {
          backOverlay: false,
          messageFontSize: "16px",
          cssAnimation: true,
          cssAnimationStyle: "zoom",
          position: "center-center",
        });
      }
      if(cekEdit){
        const edit = await editTugas(data, idTugas)
        clear();
        notif("Berhasil mengedit tugas")

      }else{
        const result = await postDataTugas(data, idMatkul);
        clear();
        notif("Berhasil menambahkan tugas")
      }
    } catch (error) {
      console.error("Gagal menambahkan tugas:", error);
      Notify.failure("Gagal menambahkan tugas");
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
                <div className="flex flex-col items-center mt-5 transition-all duration-300 w-full print-container">
                  <form
                    className="w-[95%] shadow-md bg-white rounded-md p-10 m-auto mt-10"
                    onSubmit={handleSubmit}
                  >
                    <h1 className="font-semibold text-xl mb-5">
                      {dataMataKuliah.nama}
                    </h1>
                    <div className="mb-6">
                      <div>
                        <label
                          htmlFor="judulTugas"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Nama
                        </label>
                        <input
                          type="text"
                          id="judulTugas"
                          className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="Judul tugas"
                          required
                          value={judulTugas}
                          onChange={(e) => setJudulTugas(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="mb-6">
                      <div>
                        <label
                          htmlFor="deskripsiTugas"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Deskripsi
                        </label>
                        <textarea
                          id="deskripsiTugas"
                          rows="4"
                          className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="Tuliskan deskripsi tugas di sini..."
                          required
                          value={deskripsi}
                          onChange={(e) => setDeskripsi(e.target.value)}
                        ></textarea>
                      </div>
                    </div>
                    <div className="mb-6">
                      <div>
                        <label
                          htmlFor="fileTugas"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          File
                        </label>
                        <input
                          type="file"
                          id="fileTugas"
                          className="file-input file-input-bordered w-full mb-5"
                          onChange={(e) => setFileTugas(e.target.files[0])}
                        />
                        {cekEdit ? (
                          getDataTugas.data.files.map((file) => {
                            const fileType = getFileTypeFromUrl(file.filePath);

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
                          })
                        ) : (
                          null
                        )}
                      </div>
                    </div>
                    <div className="mb-6 relative">
                      <div>
                        <label
                          htmlFor="deadline"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Deadline
                        </label>
                        <Datepicker
                          value={value}
                          onChange={setValue}
                          primaryColor={"blue"}
                          useRange={false}
                          asSingle={true}
                          required
                          inputClassName="border border-gray-300 rounded px-3 py-2 w-full"
                        />
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

export default MengelolaTugas;
