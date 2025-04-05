import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import {
  getUserCheck,
  getDataLaporanDataMahasiswa
} from "../../config/FetchingData";
import { useParams, useNavigate } from "react-router-dom";
const DataMahasiswa = ({laporanDataProgressMahasiswa}) => {
  const { idMatkul, idMahasiswa } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
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
  }, [idMatkul]);

  console.log(laporanDataProgressMahasiswa)
  return (
    <>
      <h1 className="justify-start w-full mb-3 text-3xl print:text-center print:my-5 print:text-2xl print:font-bold">Laporan</h1>
      <div className="w-full pb-8 pt-6 border-t-4 border-blue-800 rounded-md shadow-lg no-shadow print:border-none">
        <h1 className="mb-3 text-xl px-4 pb-4 border-b border-slate-300 print:mt-[-20px] print:mb-[-10px] print:pb-2">
          Data Mahasiswa
        </h1>
        <div className="grid grid-cols-1 mt-6 md:grid-cols-2 gap-4 px-4 print:grid-cols-2 print:gap-0 print:text-sm">
          <div className="border-0 sm:border print:border-none rounded-sm p-2 flex print:p-1">
            <span className="w-28 flex-shrink-0 block print:font-semibold">NPM</span>{" "}
            <span className="truncate">: {laporanDataProgressMahasiswa.nomorinduk}</span>
          </div>
          <div className="border-0 sm:border print:border-none rounded-sm p-2 flex print:p-1">
            <span className="w-28 flex-shrink-0 block print:font-semibold">Email</span>{" "}
            <span className="truncate">: {laporanDataProgressMahasiswa.email}</span>
          </div>
          <div className="border-0 sm:border print:border-none rounded-sm p-2 flex print:p-1">
            <span className="w-28 flex-shrink-0 block print:font-semibold">Nama</span>{" "}
            <span className="truncate">
              : {laporanDataProgressMahasiswa.nama}
            </span>
          </div>
          <div className="border-0 sm:border print:border-none rounded-sm p-2 flex print:p-1">
            <span className="w-28 flex-shrink-0 block print:font-semibold">Tanggal Join</span>{" "}
            <span className="truncate">: {laporanDataProgressMahasiswa.mataKuliahDiikuti[0].tanggalGabung}</span>
          </div>
          <div className="border-0 sm:border print:border-none rounded-sm p-2 flex print:p-1">
            <span className="w-28 flex-shrink-0 block print:font-semibold">Mata Kuliah</span>{" "}
            <span className="truncate">: {laporanDataProgressMahasiswa.mataKuliahDiikuti[0].namaMataKuliah}</span>
          </div>
          <div className="border-0 sm:border print:border-none rounded-sm p-2 flex print:p-1">
            <span className="w-28 flex-shrink-0 block print:font-semibold">Dosen</span>{" "}
            <span className="truncate">: {laporanDataProgressMahasiswa.mataKuliahDiikuti[0].namaDosen}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default DataMahasiswa;
