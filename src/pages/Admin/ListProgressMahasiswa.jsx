import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faTrash,
  faUsersSlash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import {
  getUserCheck,
  getDataProgressMahasiswa,
  getMataKuliah,
  deleteMataKuliahMahasiswa,
  deleteAllMataKuliahMahasiswa,
} from "../../config/FetchingData";
import { useParams, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import "../../style/App.css";
import KopSurat from "../../component/KopSurat";
import { Confirm } from "notiflix/build/notiflix-confirm-aio";
import React, { useEffect, useState, useContext, useRef } from "react";
import MenuSlideBar from "../../component/Admin/MenuSlidebar";
import { SidebarContext } from "../../component/Admin/SidebarContextProvider";

const ListProgressMahasiswa = () => {
  const { idMatkul } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dataDaftarMahasiswa, setDataDaftarMahasiswa] = useState([]);
  const [dataMataKuliah, setDataMataKuliah] = useState([]);
  const [inputSearch, setInputSearch] = useState("");
  const [dataOri, setDataOri] = useState([]);
  const { expanded } = useContext(SidebarContext);

  const getDataUser = async () => {
    try {
      const dataUser = await getUserCheck();
    } catch (error) {
      console.log(error);
    }
  };

  const getDataDaftarMahasiswa = async () => {
    setLoading(true);
    try {
      const dataMahasiswa = await getDataProgressMahasiswa(idMatkul);
      const getDataMataKuliah = await getMataKuliah(idMatkul);
      setDataMataKuliah(getDataMataKuliah);
      setDataDaftarMahasiswa(dataMahasiswa.data);
      setDataOri(dataMahasiswa.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDataUser();
    getDataDaftarMahasiswa();
  }, [idMatkul]);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    documentTitle: "Laporan Daftar Mahasiswa",
    contentRef: componentRef,
  });

  const validasi = (isi) => {
    return new Promise((resolve) => {
      Confirm.show(
        `Hapus ${isi}`,
        `Yakin ingin Hapus ${isi} dalam Mata Kuliah?`,
        "Yes",
        "No",
        () => resolve(true),
        () => resolve(false)
      );
    });
  };

  const handleDeleteMahasiswa = async (idMahasiswa, namaMahasiswa) => {
    const isConfirmed = await validasi(namaMahasiswa);
    if (isConfirmed) {
      try {
        const deleteMhs = await deleteMataKuliahMahasiswa(
          idMatkul,
          idMahasiswa
        );
        return deleteMhs;
      } catch (error) {
        console.error(error);
      } finally {
        getDataDaftarMahasiswa();
      }
    } else {
      return null;
    }
  };

  const handleDeleteAllMahasiswa = async () => {
    const isConfirmed = await validasi("Semua Mahasiswa");
    if (isConfirmed) {
      try {
        const deleteMhs = await deleteAllMataKuliahMahasiswa(idMatkul);
        return deleteMhs;
      } catch (error) {
        console.error(error);
      } finally {
        getDataDaftarMahasiswa();
      }
    } else {
      return null;
    }
  };

  const originalDataMahasiswa = [...dataDaftarMahasiswa];

  const searchMahasiswa = (e) => {
    e.preventDefault();

    const keyword = inputSearch.toLowerCase().trim();

    if (!keyword) {
      setDataDaftarMahasiswa(dataOri);
    } else {
      const filteredData = originalDataMahasiswa.filter(
        (mahasiswa) =>
          mahasiswa.nama.toLowerCase().includes(keyword) ||
          mahasiswa.nomorInduk.toLowerCase().includes(keyword)
      );

      setDataDaftarMahasiswa(filteredData);
    }
  };

  const clearDataSearch = () => {
    setInputSearch("");
    setDataDaftarMahasiswa(dataOri);
  };

  console.log(inputSearch);
  useEffect(() => {
    if (inputSearch === "") {
      clearDataSearch();
    }
  }, [inputSearch]);

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
                  <div className="relative min-h-screen transition-all duration-300 ease-in-out w-full">
                    <div
                      className={`flex-1 transition-all duration-300 ease-in-out min-h-screen flex justify-center`}
                    >
                      <div
                        className="flex flex-col items-center mt-5 transition-all duration-300 w-[95%] print-container"
                        ref={componentRef}
                      >
                        <KopSurat />
                        <h1 className="justify-start w-full mb-3 text-3xl print:text-center print:my-5 print:text-2xl print:font-bold">
                          Laporan Daftar Mahasiswa
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
                            <div className="border-0 sm:border print:border-none rounded-sm p-2 flex print:p-1">
                              <span className="w-28 flex-shrink-0 block print:font-semibold">
                                Jumlah Mhs
                              </span>{" "}
                              <span className="truncate">
                                : {dataMataKuliah.mahasiswa.length} Mahasiswa
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="w-full pb-8 pt-6 border-t-4 border-blue-800 rounded-md shadow-lg mt-10 no-shadow print:border-none print:mt-[-20px]">
                          <h1 className="mb-3 text-xl px-4 pb-4 border-b border-slate-300 print:mb-[-10px] print:pb-2">
                            Progress Mahasiswa
                          </h1>
                          <div className="print:hidden flex-col md:flex-row gap-5 md:gap-3 flex justify-between items-center w-full px-4">
                            <form className="md:w-1/2 w-full relative">
                              <input
                                className="border-2 w-full border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-base focus:outline-none"
                                type="text"
                                name="search"
                                placeholder="Cari mahasiswa"
                                value={inputSearch}
                                onChange={(e) => setInputSearch(e.target.value)}
                              />
                              {inputSearch !== "" ? (
                                <div
                                  onClick={() => clearDataSearch()}
                                  className="text-base cursor-pointer absolute right-10 opacity-75 top-1/2 -translate-y-1/2"
                                >
                                  <FontAwesomeIcon
                                    className="text-base"
                                    icon={faXmark}
                                  />
                                </div>
                              ) : null}
                              <button
                                type="submit"
                                onClick={searchMahasiswa}
                                className="absolute h-[40px] right-3 top-0 flex justify-center items-center "
                              >
                                <svg
                                  className="text-gray-600 h-4 w-4 fill-current"
                                  xmlns="http://www.w3.org/2000/svg"
                                  version="1.1"
                                  viewBox="0 0 56.966 56.966"
                                >
                                  <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17s-17-7.626-17-17S14.61,6,23.984,6z" />
                                </svg>
                              </button>
                            </form>
                            <button
                              onClick={() => handleDeleteAllMahasiswa()}
                              className="px-10 py-3 rounded-md text-base font-semibold bg-red-600 text-slate-100"
                              type="button"
                            >
                              Hapus Semua Mahasiswa
                            </button>
                          </div>
                          <div className="mt-6 mx-0 lg:mx-3">
                            <div
                              className="overflow-x-auto transition-all duration-300 ease-in-out
                    mx-3 lg:mx-0"
                            >
                              <table className="w-full rounded-lg print:text-sm">
                                <thead>
                                  <tr className="bg-slate-800 text-slate-200 ">
                                    <th className="border border-slate-400 p-2 w-[50px] max-w-max-[50px] text-center print:w-[50px] print:min-w-[50px]">
                                      NO
                                    </th>
                                    <th className="border border-slate-400 p-2 w-[300px] min-w-[200px] lebarTable100">
                                      NPM
                                    </th>
                                    <th className="border border-slate-400 p-2 w-[300px] min-w-[200px] lebarTable150">
                                      Nama
                                    </th>
                                    <th className="border border-slate-400 p-2 w-[200px] min-w-[200px] print:max-w-[120px] print:min-w-[120px]">
                                      Tanggal Join
                                    </th>
                                    <th className="border border-slate-400 p-2 w-[90px] min-w-[90px] lebarTable70">
                                      Progress
                                    </th>
                                    <th className="border border-slate-400 p-2 w-[150px] min-w-[100px] print:hidden">
                                      Opsi
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {!loading ? (
                                    dataDaftarMahasiswa.length !== 0 ? (
                                      dataDaftarMahasiswa.map((item, index) => (
                                        <tr key={item.id}>
                                          <td className="border border-slate-400 p-2 text-center">
                                            {index + 1}
                                          </td>
                                          <td className="border border-slate-400 p-2">
                                            {item.nomorInduk}
                                          </td>
                                          <td className="border border-slate-400 p-2">
                                            {item.nama}
                                          </td>
                                          <td className="border border-slate-400 p-2">
                                            {new Date(
                                              item.tanggalGabung
                                            ).toLocaleDateString("id-ID", {
                                              weekday: "long",
                                              day: "2-digit",
                                              month: "long",
                                              year: "numeric",
                                            })}
                                          </td>
                                          <td className="border border-slate-400 p-2 text-center">
                                            {item.progress}%
                                          </td>
                                          <td className="border border-slate-400 p-2 print:hidden">
                                            <div className="flex gap-5 justify-center items-center">
                                              <FontAwesomeIcon
                                                className="text-base bg-green-500 py-2 px-3 rounded-md cursor-pointer hover:text-white"
                                                icon={faEye}
                                                onClick={() =>
                                                  navigate(
                                                    `/admin/progress/mahasiswa/detail-laporan/${idMatkul}/${item.id}`
                                                  )
                                                }
                                              />
                                              <FontAwesomeIcon
                                                className="text-base bg-red-500 py-2 px-3 rounded-md cursor-pointer hover:text-white"
                                                icon={faTrash}
                                                onClick={() =>
                                                  handleDeleteMahasiswa(
                                                    item.id,
                                                    item.nama
                                                  )
                                                }
                                              />
                                            </div>
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
                                    )
                                  ) : null}
                                </tbody>
                              </table>
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
          </div>
        </>
      ) : null}
    </div>
  );
};

export default ListProgressMahasiswa;
