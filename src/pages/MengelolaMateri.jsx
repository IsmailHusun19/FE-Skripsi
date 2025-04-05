import React, { useState, useEffect } from "react";
import Navbar from "../component/Navbar";
import AddMatkul from "../assets/Addbook.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faCopy,
  faEye,
  faPen,
  faTrash,
  faFolderOpen,
  faPlus,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import Footer from "../component/Footer";
import { Link } from "react-router-dom";
import { fetchMateri, fetchSubMateri } from "../config/FetchingData";
import AddMateri from "../component/AddMateri";
import axios from "axios";
import { Button } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Confirm } from "notiflix/build/notiflix-confirm-aio";
import SliderBar from "../component/SliderBar";
import ChatBot from "../component/ChatBot";

const MengelolaMateri = () => {
  const { idMatkul } = useParams();
  const navigate = useNavigate();
  const [materi, setMateri] = useState([]);
  const [showAddMatkulDosen, setShowAddMatkulDosen] = useState(false);
  const [getDataMateriEdit, setDataMateriEdit] = useState({});
  const [getDataMataKuliah, setDataMataKuliah] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [openChatBot, setOpenChatBot] = useState(false);
  const [deleteMatkul, setDeleteMatkul] = useState(false);
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    getDataUser();
  }, []);

  useEffect(() => {
    if (isNaN(idMatkul)) {
      navigate("/errorpage");
    }
  }, [idMatkul]);

  const getMataKuliah = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/mata-kuliah/${idMatkul}`,
        {
          withCredentials: true,
        }
      );
      setDataMataKuliah(response.data);
    } catch (error) {
      console.error(error);
      navigate("/errorpage");
    }
  };

  const textToCopy = getDataMataKuliah.kodeGabung;

  const getData = async () => {
    try {
      const dataMateri = await fetchMateri(idMatkul);
      const dataSubMateri = await fetchSubMateri(idMatkul);
      const safeDataMateri = Array.isArray(dataMateri) ? dataMateri : [];
      const safeDataSubMateri = Array.isArray(dataSubMateri)
        ? dataSubMateri
        : [];

      const formattedMateri = safeDataMateri.map((item) => ({
        id: item.id,
        judul: item.judul,
        mataKuliahId: item.mataKuliahId,
        subMateri: [],
      }));

      const formattedSubMateri = safeDataSubMateri.map((item) => ({
        id: item.id,
        judul: item.judul,
        type: item.type,
        materiId: item.materiId,
      }));

      formattedMateri.forEach((materi) => {
        materi.subMateri = formattedSubMateri.filter(
          (sub) => sub.materiId == materi.id
        );
      });

      setMateri(formattedMateri);
    } catch (error) {
      setMateri([]);
    }
  };

  useEffect(() => {
    getData();
    getMataKuliah();
  }, []);

  const toggleAddMatkulDosen = () => {
    setShowAddMatkulDosen((prev) => !prev);
  };

  const closeAddMatkulDosen = () => {
    setShowAddMatkulDosen(false);
    setDataMateriEdit({});
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy).then(
      () => {
        Notify.success("Berhasil copy code mata kuliah");
      },
      (err) => {
        Notify.failure("Gagal copy code mata kuliah", err);
      }
    );
  };

  const handleDeleteMateri = async (id) => {
    try {
      Confirm.show(
        "Menghapus Materi",
        "Yakin ingin menghapus materi?",
        "Yes",
        "No",
        async () => {
          const response = await axios.delete(
            `http://localhost:3000/materi/${id}`,
            {
              withCredentials: true,
            }
          );
          await getData();
          Notify.success("Anda berhasil menghapus materi tersebut");
          return response.data;
        },
        () => {
          null;
        }
      );
    } catch (err) {
      console.error(err);
      navigate("/errorpage");
      return err;
    }
  };

  const handleEditMateri = async (id, judul) => {
    setDataMateriEdit({
      id: id,
      judul: judul,
    });
    setShowAddMatkulDosen(true);
    console.log("jwjwj");
  };

  const editDataMateri = () => {
    setDataMateriEdit({});
  };

  const handleEditDataSubMateri = (mataKuliahId, idMateri, idSubMateri) => {
    navigate(`/tambahmateri/${mataKuliahId}/${idMateri}/${idSubMateri}`);
  };

  const handleDeleteSubMateri = async (idMateri, idSubMateri) => {
    try {
      Confirm.show(
        "Menghapus Sub Materi",
        "Yakin ingin menghapus sub materi?",
        "Yes",
        "No",
        async () => {
          const response = await axios.delete(
            `http://localhost:3000/sub-materi/${idMatkul}/${idMateri}/${idSubMateri}`,
            {
              withCredentials: true,
            }
          );
          await getData();
          Notify.success("Anda berhasil menghapus sub materi tersebut");
          return response.data;
        },
        () => {
          null;
        }
      );
    } catch (error) {
      console.error(error);
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

  return (
    <div className="container-satu">
      <Navbar />
      <div className="pt-[75.7px]">
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
        {showAddMatkulDosen && (
          <AddMateri
            handleButtonClick={closeAddMatkulDosen}
            getData={getData}
            handleClose={setShowAddMatkulDosen}
            handleEditMateri={getDataMateriEdit}
            dataMateri={materi}
            editDataMateri={editDataMateri}
            idMataKuliah={idMatkul}
          />
        )}
        <div className="min-h-screen ml-16 py-10 w-[95%] my-10 m-auto bg-white rounded-lg p-5 shadow-xl">
          <div className="flex justify-between items-center flex-col lg:flex-row">
            <h1 className="text-2xl font-bold">{getDataMataKuliah.nama}</h1>
            <Button
              onClick={toggleAddMatkulDosen}
              className="p-3 bg-blue-700 rounded-md flex justify-center gap-2 text-slate-200 font-medium hover:text-white"
            >
              <FontAwesomeIcon className="text-2xl" icon={faBook} /> Tambah
              Materi
            </Button>
          </div>
          <div className="tooltip tooltip-right cursor-pointer" data-tip="Copy">
            <h1
              onClick={handleCopy}
              className="text-lg font-medium flex gap-2 cursor-pointer items-center"
            >
              Code Mata Kuliah
              <FontAwesomeIcon
                className="text-xl text-blue-700"
                icon={faCopy}
              />
            </h1>
          </div>

          <div className="mt-10">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="">
                    <th className="border p-2 w-[20px] text-center">NO</th>
                    <th className="border p-2 w-[300px] min-w-[150px]">
                      Materi
                    </th>
                    <th className="border p-2 w-[300px] min-w-[150px]">
                      SubMateri
                    </th>
                    <th className="border p-2 w-[150px] min-w-[100px]">Type</th>
                    <th className="border p-2 w-[100px]">Opsi</th>
                    <th className="border p-2 w-[150px] min-w-[100px]">
                      Sub list
                    </th>
                    <th className="border p-2 w-[100px]">Opsi</th>
                  </tr>
                </thead>
                <tbody>
                  {materi.length > 0 ? (
                    materi.map((materiItem, index) => (
                      <React.Fragment key={materiItem.id}>
                        <tr>
                          <td
                            className="border p-2 text-center"
                            rowSpan={
                              Math.max(materiItem.subMateri.length, 1) + 1
                            }
                          >
                            {index + 1}
                          </td>
                          <td
                            className="border p-2"
                            rowSpan={
                              Math.max(materiItem.subMateri.length, 1) + 1
                            }
                          >
                            {materiItem.judul}
                          </td>
                        </tr>

                        {materiItem.subMateri.length > 0 ? (
                          materiItem.subMateri.map((sub, subIndex) => (
                            <tr key={sub.id}>
                              <td className="border p-2">{sub.judul}</td>
                              <td className="border p-2">{sub.type}</td>
                              <td className="border p-2">
                                <div className="flex gap-5 justify-center items-center">
                                  <FontAwesomeIcon
                                    className="text-base bg-green-500 py-2 px-3 rounded-md cursor-pointer hover:text-white"
                                    icon={faEye}
                                    onClick={() => console.log(sub.id)}
                                  />
                                  <FontAwesomeIcon
                                    className="text-base bg-yellow-500 py-2 px-3 rounded-md cursor-pointer hover:text-white"
                                    icon={faPen}
                                    onClick={() =>
                                      handleEditDataSubMateri(
                                        materiItem.mataKuliahId,
                                        materiItem.id,
                                        sub.id
                                      )
                                    }
                                  />
                                  <FontAwesomeIcon
                                    className="text-base bg-red-500 py-2 px-3 rounded-md cursor-pointer hover:text-white"
                                    icon={faTrash}
                                    onClick={() =>
                                      handleDeleteSubMateri(
                                        materiItem.id,
                                        sub.id
                                      )
                                    }
                                  />
                                </div>
                              </td>
                              {subIndex === 0 && (
                                <td
                                  className="border p-2 text-center"
                                  rowSpan={materiItem.subMateri.length}
                                >
                                  {materiItem.subMateri.length}
                                </td>
                              )}
                              {subIndex === 0 && (
                                <td
                                  className="border p-2"
                                  rowSpan={materiItem.subMateri.length}
                                >
                                  <div className="flex gap-5 justify-center items-center">
                                    <FontAwesomeIcon
                                      className="text-base bg-green-500 py-2 px-3 rounded-md cursor-pointer hover:text-white"
                                      icon={faPlus}
                                      onClick={() =>
                                        navigate(
                                          `/tambahmateri/${materiItem.mataKuliahId}/${materiItem.id}`
                                        )
                                      }
                                    />
                                    <FontAwesomeIcon
                                      className="text-base bg-yellow-500 py-2 px-3 rounded-md cursor-pointer hover:text-white"
                                      icon={faPen}
                                      onClick={() =>
                                        handleEditMateri(
                                          materiItem.id,
                                          materiItem.judul
                                        )
                                      }
                                    />

                                    <FontAwesomeIcon
                                      className="text-base bg-red-500 py-2 px-3 rounded-md cursor-pointer hover:text-white"
                                      icon={faTrash}
                                      onClick={() =>
                                        handleDeleteMateri(materiItem.id)
                                      }
                                    />
                                  </div>
                                </td>
                              )}
                            </tr>
                          ))
                        ) : (
                          // Tambahkan baris kosong jika tidak ada subMateri
                          <tr>
                            <td className="border p-2 text-center" colSpan={4}>
                              -
                            </td>
                            <td className="border p-2">
                              <div className="flex gap-5 justify-center items-center">
                                <FontAwesomeIcon
                                  className="text-base bg-green-500 py-2 px-3 rounded-md cursor-pointer hover:text-white"
                                  icon={faPlus}
                                  onClick={() =>
                                    navigate(
                                      `/tambahmateri/${materiItem.mataKuliahId}/${materiItem.id}`
                                    )
                                  }
                                />
                                <FontAwesomeIcon
                                  className="text-base bg-yellow-500 py-2 px-3 rounded-md cursor-pointer hover:text-white"
                                  icon={faPen}
                                  onClick={() =>
                                    handleEditMateri(
                                      materiItem.id,
                                      materiItem.judul
                                    )
                                  }
                                />
                                <FontAwesomeIcon
                                  className="text-base bg-red-500 py-2 px-3 rounded-md cursor-pointer hover:text-white"
                                  icon={faTrash}
                                  onClick={() =>
                                    handleDeleteMateri(materiItem.id)
                                  }
                                />
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="p-2 text-center">
                        <div className="w-full flex flex-col">
                          {" "}
                          <FontAwesomeIcon
                            className="text-5xl py-2 px-3 rounded-md"
                            icon={faFolderOpen}
                          />{" "}
                          <span>Materi Masih Kosong</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="ml-16">
      <Footer />
      </div>
    </div>
  );
};

export default MengelolaMateri;
