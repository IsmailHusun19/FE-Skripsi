import Navbar from "../component/Navbar";
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import ChatBot from "../component/ChatBot";
import { Confirm } from "notiflix/build/notiflix-confirm-aio";
import SliderBar from "../component/SliderBar";
import {
  getUserCheck,
  deleteMatkulDosen,
  deleteMatkulMahasiswa,
  getDataLaporanDataMahasiswa,
} from "../config/FetchingData";
import Footer from "../component/Footer";
import { useParams, useNavigate } from "react-router-dom";
import DataMahasiswa from "../component/laporan/DataMahasiswa";
import DataProgress from "../component/laporan/DataProgress";
import { useReactToPrint } from "react-to-print";
import "../style/App.css";
import LogoUnbaja from "../assets/unbaja-logo.png";
import { Loading } from "notiflix/build/notiflix-loading-aio";

const Laporan = () => {
  const { idMatkul, idMahasiswa } = useParams();
  const navigate = useNavigate()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [openChatBot, setOpenChatBot] = useState(false);
  const [deleteMatkul, setDeleteMatkul] = useState(false);
  const [user, setUser] = useState([]);
  const [laporanDataProgressMahasiswa, setLaporanDataProgressMahasiswa] = useState({
    mataKuliahDiikuti: [],
  });
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

  const getLaporanDataMahasiswa = async () => {
    setLoading(true);
    try {
      const data = await getDataLaporanDataMahasiswa(
        idMatkul,
        user?.role,
        idMahasiswa,
      );
      setLaporanDataProgressMahasiswa(data.data);
      if(data.data?.mataKuliahDiikuti.length === 0){
        return navigate("/error");
      }
    } catch (error) {
      console.error(error);
      return navigate("/error");
    } finally {
      setLoading(false);
    }
  };

  http://localhost:5173/laporan/1/3

  useEffect(() => {
    getDataUser();
  }, [idMatkul, idMahasiswa]);

  useEffect(() =>{
    if(user.role){
      getLaporanDataMahasiswa();
    } 
  }, [idMatkul, idMahasiswa, user])

  console.log(laporanDataProgressMahasiswa?.mataKuliahDiikuti.length);

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

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    documentTitle: "Laporan Progress Mahasiswa",
    contentRef: componentRef,
  });

  useEffect(() => {
    loading ? Loading.standard() : Loading.remove();
  }, [loading]);

  return (
    <div className="container-satu overflow-x-hidden">
      {laporanDataProgressMahasiswa?.mataKuliahDiikuti.length !== 0 ? (
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
                <div
                  className="flex flex-col items-center mt-5 transition-all duration-300 w-[95%] print-container"
                  ref={componentRef}
                >
                  <div className="hidden print:block w-full">
                    <div className="flex justify-between items-center w-full gap-5">
                      <img className="w-32" src={LogoUnbaja} alt="" />
                      <div className=" text-center w-full">
                        <h2 className="font-bold text-xl">
                          UNIVERSITAS Banten Jaya
                        </h2>
                        <p className="text-sm">
                          Kampus 1 : Jl. Ciwaru Raya No.73, Kota Serang
                        </p>
                        <p className="text-sm">
                          Kampus 2 : Jl. Syekh Moh. Nawawi Albantani, Kp. Boru,
                          Kec. Curug, Kota Serang
                        </p>
                        <p className="text-sm">
                          Website : www.unbaja.ac.id, e-Mail : info@unbaja.ac.id
                        </p>
                      </div>
                    </div>
                    <div className="w-full mt-2">
                      <div className="border-t-4 border-black"></div>
                      <div className="border-t border-black mt-1"></div>
                    </div>
                  </div>
                  <DataMahasiswa
                    laporanDataProgressMahasiswa={laporanDataProgressMahasiswa}
                  />
                  <DataProgress idMatkul={idMatkul} />
                </div>
              </div>
            </div>
          </div>
          <div className=" mr-7 flex justify-end ml-1">
            <button
              className="p-3 w-36 rounded-md font-semibold bg-blue-700 text-slate-200 hover:text-slate-100 mt-5 mb-20"
              type="button"
              onClick={handlePrint}
            >
              Cetak Laporan
            </button>
          </div>
          <div className="ml-16">
            <Footer />
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Laporan;
