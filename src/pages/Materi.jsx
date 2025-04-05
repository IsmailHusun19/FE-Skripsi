import { useState, useEffect } from "react";
import "../style/CKEditor.css";
import Navbar from "../component/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesRight,
  faAngleDown,
  faAngleUp,
  faUsers,
  faBook,
  faTrash,
  faBars,
  faRobot,
  faRightFromBracket,
  faCircleCheck as faCircleCheckSolid,
} from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck as faCircleCheckRegular } from "@fortawesome/free-regular-svg-icons";
import { useParams, Link, useNavigate } from "react-router-dom";
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
} from "../config/FetchingData";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import { motion } from "framer-motion";
import Kuis from "./Kuis";
import ChatBot from "../component/ChatBot";
import axios from "axios";
import { Loading } from "notiflix/build/notiflix-loading-aio";
import { Confirm } from "notiflix/build/notiflix-confirm-aio";
import SliderBar from "../component/SliderBar";

const Materi = () => {
  const [user, setUser] = useState([]);
  const [openChatBot, setOpenChatBot] = useState(false);
  const [deleteMatkul, setDeleteMatkul] = useState(false);

  const getDataUser = async () => {
    try {
      const dataUser = await getUserCheck();
      setUser(dataUser);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDataUser();
  }, []);

  const { idMatkul, idMateri, idSubMateri } = useParams();
  const navigate = useNavigate();
  const [materi, setMateri] = useState([]);
  const [mataKuliah, setMataKuliah] = useState([]);
  const [ButtonMenuMateri, SetButtionMenuMateri] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progressBar, setProgressBar] = useState(0);

  const getData = async (IdSubMateri) => {
    setLoading(true);
    try {
      const dataMateri = await fetchMateri(idMatkul);
      const dataSubMateri = await fetchSubMateri(idMatkul);
      const dataMataKuliah = await getMataKuliah(idMatkul);
      const dataUser = await getUserCheck();
      const dataProgress = await getDataDetailProgresMahasiswa(
        idMatkul,
        dataUser.id
      );
      const dataDetailSubMateri = await getDataDetailSubMateri(
        IdSubMateri || idSubMateri || dataProgress.id
      );
      if (idSubMateri === undefined && IdSubMateri === undefined) {
        const dataProgressPost = await postDataProgress(dataProgress.id);
        navigate(
          `/materi/${idMatkul}/${dataProgress.materiId}/${dataProgress.id}`
        );
      } else {
        const dataProgressPost = await postDataProgress(idSubMateri);
        if (dataProgressPost === undefined) {
          navigate(
            `/materi/${idMatkul}/${dataProgress.materiId}/${dataProgress.id}`
          );
        }
      }

      if (dataDetailSubMateri === undefined) {
        navigate(
          `/materi/${idMatkul}/${dataProgress.materiId}/${dataProgress.id}`
        );
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
          judul: item.judul,
          mataKuliahId: item.mataKuliahId,
          subMateri: relatedSubMateri,
          jumlahSelesai,
          sudahSelesaiSemua,
        };
      });

      const dataSubMateriProgress =
        dataDetailSubMateri === undefined
          ? dataProgress
          : user?.role === "Dosen"
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

  useEffect(() => {
    getData();
  }, [idSubMateri]);

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
    if((totalSelesai || totalSubMateri) === 0){
      setProgressBar(0)
    }else{
      const total = (totalSelesai / totalSubMateri) * 100
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
    type
  ) => {
    if (user?.role === "Dosen") {
      navigate(`/materi/${idMatkul}/${idMateri}/${idSubMateri}`);
    } else {
      if (status === "belum_selesai") {
        try {
          const response = await axios.post(
            `http://localhost:3000/sub-materi/selesai/${idSubMateri}`,
            {},
            {
              withCredentials: true,
            }
          );
          return navigate(`/materi/${idMatkul}/${idMateri}/${idSubMateri}`);
        } catch (error) {
          Notify.failure("Selesaikan materi sebelumnya terlebih dahulu");
          console.error(error);
          return undefined;
        }
      } else {
        navigate(`/materi/${idMatkul}/${idMateri}/${idSubMateri}`);
      }
      getData(idSubMateri);
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

  useEffect(() => {
    loading ? Loading.standard() : Loading.remove();
  }, [loading]);

  return (
    <div className="container-satu">
      <Navbar />
      <div className="flex relative">
        <div
          className={`relative pt-[75.7px] min-h-screen transition-all duration-300 ease-in-out ${
            ButtonMenuMateri
              ? "w-full"
              : "w-full sm:w-[50%] md:w-[60%] lg:w-[70%]"
          }`}
        >
          <div
            className={`fixed z-10 transition-all duration-300 ease-in-out bg-white h-screen shadow-2xl ${
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
          <div className="main-container ml-20 mr-7 m-auto relative">
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
                    return <p>Materi tidak ditemukan</p>;
                  }

                  return (
                    <>
                      <h1 className="text-3xl font-extrabold my-5 judul">
                        {subMateri.judul}
                      </h1>
                      {subMateri.type === "materi" ? (
                        <div
                          className="mt-3"
                          dangerouslySetInnerHTML={{ __html: subMateri.isi }}
                        />
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
                            userRole: user?.role
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
          className={`fixed right-0 h-full border border-slate-400 rounded-md overflow-y-auto pb-[90px] bg-white transition-all duration-300 ease-in-out ${
            ButtonMenuMateri
              ? "w-0 mt-[75.7px] border-none"
              : "w-full pl-[64px] sm:w-[50%] sm:pl-0 md:w-[40%] lg:w-[30%] mt-[75.7px]"
          }`}
        >
          <div
            className={`flex flex-col text-slate-900 font-semibold text-lg fixed rounded-md bg-zinc-100 z-10 w-full sm:w-[50%] md:w-[40%] lg:w-[30%] ${
              user?.role === "Mahasiswa" ? "gap-0 p-6" : "gap-1 py-9 px-5"
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
                  onClick={() => handleToggleButtonListMateri(dataMateri.id)}
                  className="cursor-pointer flex gap-4 items-center relative"
                >
                  <FontAwesomeIcon
                    className="text-slate-400"
                    icon={openMateri[dataMateri.id] ? faAngleUp : faAngleDown}
                  />
                  <div className="w-full flex justify-between items-center">
                    <h1 className="font-medium text-slate-800">
                      {dataMateri.judul}
                    </h1>
                    {dataMateri.jumlahSelesai ===
                    dataMateri.subMateri.length ? (
                      <FontAwesomeIcon
                        className="text-green-600 text-xl"
                        icon={faCircleCheckSolid}
                      />
                    ) : (
                      dataMateri.jumlahSelesai +
                      "/" +
                      dataMateri.subMateri.length
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
                              dataSubMateri.type
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
  );
};

export default Materi;
