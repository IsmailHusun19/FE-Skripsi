import React, { useEffect, useState, useContext } from "react";
import "../../style/CKEditor.css";
import MenuSlideBar from "../../component/Admin/MenuSlidebar";
import { SidebarContext } from "../../component/Admin/SidebarContextProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesRight,
  faAngleDown,
  faAngleUp,
  faFolderOpen,
  faLock,
  faCircleCheck as faCircleCheckSolid,
} from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck as faCircleCheckRegular } from "@fortawesome/free-regular-svg-icons";
import { useParams, Link, useNavigate, data } from "react-router-dom";
import {
  fetchMateri,
  fetchSubMateri,
  getMataKuliah,
  getUserCheck,
  getDataDetailSubMateri,
  getDataDetailProgresMahasiswa,
  postDataProgress,
  deleteMatkulDosen,
  deleteMatkulMahasiswa,
  PutDataProgressMahasiswa,
  getDataKuisionerMahasiswa,
} from "../../config/FetchingData";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import { motion } from "framer-motion";
import Kuis from "../../pages/Kuis";
import axios from "axios";
import { Loading } from "notiflix/build/notiflix-loading-aio";
import { Confirm } from "notiflix/build/notiflix-confirm-aio";
import {
  FaFileImage,
  FaFilePdf,
  FaFileVideo,
  FaFileAudio,
  FaFileExcel,
  FaFileAlt,
} from "react-icons/fa";

const DetailMataKuliah = () => {
  const [user, setUser] = useState([]);
  const [openChatBot, setOpenChatBot] = useState(false);
  const [deleteMatkul, setDeleteMatkul] = useState(false);
  const [openMateriTambahan, setOpenMateriTambahan] = useState(false);
  const [scrolledToTop, setScrolledToTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrolledToTop(window.scrollY < 1);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getDataUser = async () => {
    try {
      const dataUser = await getUserCheck();
      console.log(dataUser)
      setUser(dataUser);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDataUser();
  }, []);

  const { idMatkul, idMateri, idSubMateri } = useParams();
  const { expanded } = useContext(SidebarContext);
  const navigate = useNavigate();
  const [materi, setMateri] = useState([]);
  const [mataKuliah, setMataKuliah] = useState([]);
  const [ButtonMenuMateri, SetButtionMenuMateri] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progressBar, setProgressBar] = useState(0);
  const [doneKuisioner, setDoneKuisioner] = useState(false);
  const [lock, setLock] = useState(false);

  const getData = async (IdSubMateri) => {
    setLoading(true);
    try {
      const putProgress = await PutDataProgressMahasiswa(idMatkul);
      const dataMateri = await fetchMateri(idMatkul);
      const dataSubMateri = await fetchSubMateri(idMatkul);
      const dataMataKuliah = await getMataKuliah(idMatkul);
      const dataUser = await getUserCheck();
      const dataProgress = await getDataDetailProgresMahasiswa(
        idMatkul,
        dataUser.id
      );
      const dataDetailSubMateri = await getDataDetailSubMateri(
        IdSubMateri || idSubMateri || dataProgress.progress.id
      );

      const handleNavigate = () => {
        if (dataProgress.materi) {
          navigate(
            `/admin/matakuliah/materi/${idMatkul}/${dataProgress.progress.materiId}/${dataProgress.progress.id}`
          );
        } else {
          setLock(true);
          navigate(`/admin/matakuliah/materi/${idMatkul}/${dataProgress.progress.materiId}/`);
        }
      };
      if (user.role === "Dosen" || user.role === "Admin") {
        if (idSubMateri === undefined && IdSubMateri === undefined) {
          navigate(
            `/admin/matakuliah/materi/${idMatkul}/${dataProgress.progress.materiId}/${dataProgress.progress.id}`
          );
        }
      } else {
        if (idSubMateri === undefined && IdSubMateri === undefined) {
          const dataProgressPost = await postDataProgress(
            dataProgress.progress.id
          );
          handleNavigate();
        } else {
          const dataProgressPost = await postDataProgress(idSubMateri);
          if (dataProgressPost === undefined && IdSubMateri === undefined) {
            handleNavigate();
          }
        }
      }

      if (dataDetailSubMateri === undefined) {
        handleNavigate();
      }

      const safeDataMateri = Array.isArray(dataMateri) ? dataMateri : [];
      const safeDataSubMateri = Array.isArray(dataSubMateri)
        ? dataSubMateri
        : [];

      const formattedMateri = safeDataMateri.map((item) => {
        const relatedSubMateri = safeDataSubMateri.filter(
          (sub) => sub.materiId === item.id
        );
        const jumlahSelesai = relatedSubMateri.filter(
          (sub) => sub.status === "selesai"
        ).length;
        const sudahSelesaiSemua = jumlahSelesai === relatedSubMateri.length;

        return {
          id: item.id,
          status: item.status,
          judul: item.judul,
          mataKuliahId: item.mataKuliahId,
          subMateri: relatedSubMateri,
          jumlahSelesai,
          sudahSelesaiSemua,
        };
      });

      const dataSubMateriProgress =
        dataDetailSubMateri === undefined
          ? dataProgress.progress
          : user?.role === "Dosen" || user?.role === "Admin"
          ? dataDetailSubMateri
          : dataDetailSubMateri;

      const formattedSubMateri = safeDataSubMateri.map((item) => {
        if (item.id == IdSubMateri || item.id == idSubMateri) {
          return {
            ...item,
            pertanyaan: dataSubMateriProgress.pertanyaan,
            isi: dataSubMateriProgress.isi,
            GambarMateri: dataSubMateriProgress.GambarMateri,
            fileMateri: dataSubMateriProgress.fileMateri,
            syaratKelulusan: dataSubMateriProgress.syaratKelulusan,
            durasiMengerjakan: dataSubMateriProgress.durasiMengerjakan,
            durasiUlang: dataSubMateriProgress.durasiUlang,
          };
        }
        return item;
      });

      formattedMateri.forEach((materi) => {
        materi.subMateri = formattedSubMateri.filter(
          (sub) => sub.materiId === materi.id
        );
      });
      setMateri(formattedMateri);
      setMataKuliah(dataMataKuliah);
    } catch (error) {
      setMateri([]);
      setMataKuliah([]);
    } finally {
      setLoading(false);
    }
  };

  const getDataKuisioner = async () => {
    if (user.role === "Mahasiswa") {
      try {
        const dataKuisioner = await getDataKuisionerMahasiswa(idMatkul);
        console.log(dataKuisioner);
        if (dataKuisioner) {
          setDoneKuisioner(true);
        } else {
          setDoneKuisioner(false);
        }
      } catch (error) {
        console.log(error);
        setDoneKuisioner(false);
      }
    } else {
      setDoneKuisioner(false);
    }
  };

  useEffect(() => {
    if (user.role) {
      getData();
      getDataKuisioner();
    }
  }, [idSubMateri, user]);

  useEffect(() => {
    if (!materi) return;

    let totalSubMateri = 0;
    let totalSelesai = 0;

    materi.forEach((item) => {
      item?.subMateri?.forEach((dataSubMateri) => {
        totalSubMateri += 1;
        if (dataSubMateri.status === "selesai") {
          totalSelesai += 1;
        }
      });
    });
    if ((totalSelesai || totalSubMateri) === 0) {
      setProgressBar(0);
    } else {
      const total = (totalSelesai / totalSubMateri) * 100;
      setProgressBar(total.toFixed(1));
    }
  }, [materi]);

  const handelCloseButtonMenuMateri = () => {
    SetButtionMenuMateri(true);
  };

  const handelOpenButtonMenuMateri = () => {
    SetButtionMenuMateri(false);
  };

  const [openMateri, setOpenMateri] = useState({});

  const handleToggleButtonListMateri = (id) => {
    setOpenMateri((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  useEffect(() => {
    if (idMateri) {
      setOpenMateri({ [idMateri]: true });
    }
  }, [idMateri]);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const handleProgressSubMateri = async (
    status,
    idMateri,
    idSubMateri,
    publish
  ) => {
    if (user?.role === "Dosen" || user?.role === "Admin") {
      navigate(`/admin/matakuliah/materi/${idMatkul}/${idMateri}/${idSubMateri}`);
    } else {
      if (publish) {
        if (status === "belum_selesai") {
          try {
            const response = await axios.post(
              `http://localhost:3000/sub-materi/selesai/${idSubMateri}`,
              {},
              {
                withCredentials: true,
              }
            );
            return navigate(`/admin/matakuliah/materi/${idMatkul}/${idMateri}/${idSubMateri}`);
          } catch (error) {
            Notify.failure("Selesaikan materi sebelumnya terlebih dahulu");
            console.error(error);
            return undefined;
          }
        } else {
          navigate(`/admin/matakuliah/materi/${idMatkul}/${idMateri}/${idSubMateri}`);
        }
        getData(idSubMateri);
      } else {
        Notify.failure("Materi masih dikunci oleh dosen");
      }
    }
  };

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
              console.log("hwhwh");
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
    if (!loading && materi.length > 0) {
      const embeds = document.querySelectorAll("oembed[url]");

      embeds.forEach((el) => {
        const url = el.getAttribute("url");

        if (url && (url.includes("youtube.com") || url.includes("youtu.be"))) {
          let videoId = null;

          try {
            const parsedUrl = new URL(url);
            if (parsedUrl.hostname.includes("youtube.com")) {
              videoId = parsedUrl.searchParams.get("v");
            } else if (parsedUrl.hostname.includes("youtu.be")) {
              videoId = parsedUrl.pathname.slice(1);
            }
          } catch (err) {
            console.error("URL parsing error", err);
          }

          if (videoId) {
            // Buat iframe responsif
            const iframe = document.createElement("iframe");
            iframe.setAttribute(
              "src",
              `https://www.youtube.com/embed/${videoId}`
            );
            iframe.setAttribute("frameborder", "0");
            iframe.setAttribute("allowfullscreen", "");
            iframe.setAttribute(
              "allow",
              "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            );
            iframe.setAttribute("title", "YouTube video");

            // Style responsif
            iframe.style.position = "absolute";
            iframe.style.top = "0";
            iframe.style.left = "0";
            iframe.style.width = "100%";
            iframe.style.height = "100%";

            // Bungkus iframe dalam div responsif
            const wrapper = document.createElement("div");
            wrapper.style.position = "relative";
            wrapper.style.paddingBottom = "56.25%"; // aspek rasio 16:9
            wrapper.style.height = "0";
            wrapper.style.overflow = "hidden";
            wrapper.style.marginBottom = "1rem";

            wrapper.appendChild(iframe);

            const parent = el.closest("figure");
            if (parent) {
              parent.replaceWith(wrapper);
            } else {
              el.replaceWith(wrapper);
            }
          }
        }
      });
    }
  }, [loading, materi]);

  useEffect(() => {
    loading ? Loading.standard() : Loading.remove();
  }, [loading]);

  return (
    <>
      <div className="relative overflow-x-hidden">
        <MenuSlideBar />
        <div className="h-[calc(100vh-64x)] pb-5">
          <div
            className={`grid gap-3 transition-all duration-300
  ${expanded ? "sm:ml-64" : "ml-16"}
  grid-cols-1 sm:[grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]
`}
          >
            <div className="container-satu">
              <div className="flex relative">
                {!loading ? (
                  materi.length === 0 ? (
                    <>
                      {" "}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center flex-col gap-5">
                        {" "}
                        <FontAwesomeIcon
                          className="text-[100px]"
                          icon={faFolderOpen}
                        />
                        <h1>Belum ada materi yang diunggah</h1>
                      </div>
                    </>
                  ) : null
                ) : null}
                <div
                  className={`relative min-h-screen transition-all duration-300 ease-in-out ${
                    ButtonMenuMateri
                      ? "w-full"
                      : "w-full sm:w-[50%] mr-96 md:w-[60%] lg:w-[70%]"
                  }`}
                >
                  <div className="ml-5 mr-7 m-auto relative main-container">
                    <div className="editor-container editor-container_classic-editor editor-container_include-style">
                      <div className="editor-container__editor">
                        {(() => {
                          if (!materi || materi.length === 0) {
                            return <p></p>;
                          }
                          const subMateri = materi
                            .find((dataMateri) => dataMateri.id == idMateri)
                            ?.subMateri.find(
                              (dataSubMateri) => dataSubMateri.id == idSubMateri
                            );

                          if (!subMateri) {
                            return (
                              <>
                                <h2 className="font-normal text-xl">
                                  Materi masih dikunci oleh dosen
                                </h2>
                              </>
                            );
                          }

                          return (
                            <>
                              <h1 className="text-3xl font-extrabold my-5 judul">
                                {subMateri.judul}
                              </h1>
                              {subMateri.type === "materi" ? (
                                <>
                                  <div
                                    className="mt-3"
                                    dangerouslySetInnerHTML={{
                                      __html: subMateri.isi,
                                    }}
                                  />
                                  {subMateri.fileMateri &&
                                  subMateri.fileMateri.length !== 0 ? (
                                    <div className="flex w-full flex-wrap gap-2">
                                      {subMateri.fileMateri.map((file) => {
                                        const fileType = getFileTypeFromUrl(
                                          file.url
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
                                            href={`http://localhost:3000${file.url}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="md:w-max w-full"
                                          >
                                            <div className="md:w-max w-full h-20 flex gap-3 border border-slate-600 p-3 box-content rounded-md">
                                              <div className="flex gap-2 justify-center text-base items-center">
                                                {fileType === "image" ? (
                                                  <img
                                                    src={`http://localhost:3000${file.url}`}
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
                                  ) : null}
                                </>
                              ) : (
                                <Kuis
                                  namaMateriKuis={subMateri.judul}
                                  jumlahSoal={subMateri.pertanyaan?.length ?? 0}
                                  syaratKelulusan={subMateri?.syaratKelulusan}
                                  durasiUjian={subMateri?.durasiMengerjakan}
                                  durasiUlang={subMateri?.durasiUlang}
                                  data={{
                                    idSubMateri: subMateri?.id,
                                    idMateri: subMateri?.materiId,
                                    idMatkul: idMatkul,
                                    userId: user?.id,
                                    userRole: user?.role,
                                  }}
                                />
                              )}
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={`fixed right-0 h-full ${scrolledToTop ? "" : "top-0"} border border-slate-400 rounded-md overflow-y-auto pb-[90px] bg-white transition-all duration-300 ease-in-out ${
                    !loading
                      ? materi.length === 0
                        ? "hidden"
                        : "block"
                      : "hidden"
                  } ${
                    ButtonMenuMateri
                      ? "w-0 border-none"
                      : "w-full pl-[64px] sm:w-[50%] sm:pl-0 md:w-[40%] lg:w-[30%]"
                  }`}
                >
                  <div
                    className={`flex flex-col text-slate-900 font-semibold text-lg fixed rounded-md bg-zinc-100 z-10 w-full sm:w-[50%] md:w-[40%] lg:w-[30%] ${
                      user?.role === "Mahasiswa"
                        ? "gap-0 p-6"
                        : "gap-1 py-9 px-5"
                    }`}
                  >
                    <div className="flex gap-4 items-center mb-3">
                      <button
                        type="button"
                        onClick={() => handelCloseButtonMenuMateri()}
                        className="min-w-[32px] min-h-[32px] rounded-full bg-slate-800 text-slate-50 flex justify-center items-center"
                      >
                        {<FontAwesomeIcon icon={faAnglesRight} />}
                      </button>
                      <div
                        className="tooltip tooltip-bottom cursor-pointer"
                        data-tip={mataKuliah.nama}
                      >
                        <h1 className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[20ch] transition-all duration-300">
                          {mataKuliah.nama}
                        </h1>
                      </div>
                    </div>
                    {user?.role === "Mahasiswa" ? (
                      <>
                        {" "}
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 my-2">
                          <div
                            className="bg-green-600 h-2.5 rounded-full"
                            style={{ width: `${progressBar}%` }}
                          ></div>
                        </div>
                        <div className="font-normal text-base text-slate-800 opacity-65">
                          {progressBar}% Selesai
                        </div>
                      </>
                    ) : null}
                  </div>
                  <div
                    className={`flex relative flex-col ${
                      user?.role === "Mahasiswa" ? "pt-[145px]" : "pt-[110px]"
                    }`}
                  >
                    {materi.map((dataMateri) => (
                      <div
                        className="w-[100%] p-2 rounded-lg m-auto relative"
                        key={dataMateri.id}
                      >
                        <div
                          onClick={() =>
                            handleToggleButtonListMateri(dataMateri.id)
                          }
                          className="cursor-pointer flex gap-4 items-center relative"
                        >
                          <FontAwesomeIcon
                            className="text-slate-400"
                            icon={
                              openMateri[dataMateri.id]
                                ? faAngleUp
                                : faAngleDown
                            }
                          />
                          <div className="w-full flex justify-between items-center">
                            <h1 className="font-medium text-slate-800">
                              {dataMateri.judul}
                            </h1>
                            {dataMateri.status === true ? (
                              dataMateri.jumlahSelesai ===
                              dataMateri.subMateri.length ? (
                                <FontAwesomeIcon
                                  className="text-green-600 text-xl"
                                  icon={faCircleCheckSolid}
                                />
                              ) : (
                                dataMateri.jumlahSelesai +
                                "/" +
                                dataMateri.subMateri.length
                              )
                            ) : (
                              <FontAwesomeIcon
                                className="text-slate-800 text-xl"
                                icon={faLock}
                              />
                            )}
                          </div>
                        </div>
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={
                            openMateri[dataMateri.id]
                              ? { height: "auto", opacity: 1 }
                              : { height: 0, opacity: 0 }
                          }
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="pl-[22.5px] ml-[6.8px] border-l-[1.2px] border-slate-400 pr-4 flex flex-col gap-1 py-2">
                            {dataMateri.subMateri.map((dataSubMateri) => (
                              <div
                                key={dataSubMateri.id}
                                className="flex items-center gap-3"
                              >
                                {dataSubMateri.status === "selesai" ? (
                                  <FontAwesomeIcon
                                    className="text-green-600 text-xs"
                                    icon={faCircleCheckRegular}
                                  />
                                ) : (
                                  <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                                )}
                                <h1
                                  className={`cursor-pointer ${
                                    dataSubMateri.id == idSubMateri
                                      ? "font-bold"
                                      : "font-normal"
                                  }`}
                                  onClick={() =>
                                    handleProgressSubMateri(
                                      dataSubMateri.status,
                                      dataMateri.id,
                                      dataSubMateri.id,
                                      dataMateri.status
                                    )
                                  }
                                  key={dataSubMateri.id}
                                >
                                  {dataSubMateri.judul}
                                </h1>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      </div>
                    ))}
                    {user?.role === "Mahasiswa" ? (
                      <div className="w-[100%] p-2 rounded-lg m-auto relative">
                        <div
                          className="cursor-pointer flex gap-4 items-center relative"
                          onClick={() =>
                            setOpenMateriTambahan(!openMateriTambahan)
                          }
                        >
                          <FontAwesomeIcon
                            className="text-slate-400"
                            icon={openMateriTambahan ? faAngleUp : faAngleDown}
                          />
                          <div className="w-full flex justify-between items-center">
                            <h1 className="font-medium text-slate-800">
                              Penilaian Dosen dan Mata Kuliah
                            </h1>
                            {doneKuisioner ? (
                              <FontAwesomeIcon
                                className="text-green-600 text-xl"
                                icon={faCircleCheckSolid}
                              />
                            ) : (
                              <span> 0/1</span>
                            )}
                          </div>
                        </div>
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={
                            openMateriTambahan
                              ? { height: "auto", opacity: 1 }
                              : { height: 0, opacity: 0 }
                          }
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="pl-[22.5px] ml-[6.8px] border-l-[1.2px] border-slate-400 pr-4 flex flex-col gap-1 py-2">
                            <div className="flex items-center gap-3">
                              {doneKuisioner ? (
                                <FontAwesomeIcon
                                  className="text-green-600 text-xs"
                                  icon={faCircleCheckRegular}
                                />
                              ) : (
                                <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                              )}
                              {progressBar == 100.0 ? (
                                <Link
                                  to={`/penilaian/dosen/matakuliah/${idMatkul}`}
                                  className="cursor-pointer font-normal"
                                >
                                  Penilaian
                                </Link>
                              ) : (
                                <div
                                  className="cursor-pointer font-normal"
                                  onClick={() =>
                                    Notify.failure(
                                      "Untuk melakukan penilaian selesaikan semua materi terlebih dahulu"
                                    )
                                  }
                                >
                                  Penilaian
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
              <div
                onClick={() => handelOpenButtonMenuMateri()}
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
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailMataKuliah;
