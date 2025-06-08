import {
  getUserCheck,
  getDataLaporanDataMahasiswa,
} from "../../config/FetchingData";
import { useParams, useNavigate } from "react-router-dom";
import DataMahasiswa from "../../component/laporan/DataMahasiswa";
import DataProgress from "../../component/laporan/DataProgress";
import { useReactToPrint } from "react-to-print";
import "../../style/App.css";
import { Loading } from "notiflix/build/notiflix-loading-aio";
import KopSurat from "../../component/KopSurat";
import React, { useEffect, useState, useContext, useRef } from "react";
import MenuSlideBar from "../../component/Admin/MenuSlidebar";
import { SidebarContext } from "../../component/Admin/SidebarContextProvider";

const DetailProgressMahasiswa = () => {
  const { idMatkul, idMahasiswa } = useParams();
  console.log(idMahasiswa);
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [user, setUser] = useState([]);
  const { expanded } = useContext(SidebarContext);
  const [laporanDataProgressMahasiswa, setLaporanDataProgressMahasiswa] =
    useState({
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
        idMahasiswa
      );
      setLaporanDataProgressMahasiswa(data.data);
      if (data.data?.mataKuliahDiikuti.length === 0) {
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDataUser();
  }, [idMatkul, idMahasiswa]);

  useEffect(() => {
    if (user.role) {
      getLaporanDataMahasiswa();
    }
  }, [idMatkul, idMahasiswa, user]);

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
                  <div className="relative pt-[75.7px] min-h-screen transition-all duration-300 ease-in-out w-full">
                    <div
                      className={`flex-1 flex-col transition-all duration-300 ease-in-out min-h-screen flex justify-center ${
                        isSidebarCollapsed ? "ml-16" : "ml-16 lg:ml-64"
                      }`}
                    >
                      <div
                        className="flex flex-col items-center mt-5 transition-all duration-300 w-[95%] print-container"
                        ref={componentRef}
                      >
                        <KopSurat />
                        <DataMahasiswa
                          laporanDataProgressMahasiswa={
                            laporanDataProgressMahasiswa
                          }
                        />
                        <DataProgress
                          idMatkul={idMatkul}
                          idMahasiswa={idMahasiswa}
                          role={user?.role}
                        />
                      </div>
                      <div className=" mr-11 flex justify-end ml-1">
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
        </>
      ) : null}
    </div>
  );
};

export default DetailProgressMahasiswa;
