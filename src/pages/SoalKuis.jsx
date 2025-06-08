import {
  getUserCheck,
  getDataDetailSubMateri,
  getMengerjakanSoalKuis,
  kirimSoalJawabanKuis,
  cekStatusMulaiKuis
} from "../config/FetchingData";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";

import axios from "axios";
import { Loading } from "notiflix/build/notiflix-loading-aio";
import { useParams, Link, useNavigate, Navigate } from "react-router-dom";

const SoalKuis = () => {
  const navigate = useNavigate();
  const { idMatkul, idMateri, idSubMateri, idMengerjakanKuis } = useParams();
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [soal, setSoal] = useState([]);
  const [nomorSoal, setNomorSoal] = useState(0);
  const [simpanJawaban, setSimpanJawaban] = useState([]);
  const [cekJawabanKosong, setCekJawabanKosong] = useState();
  const [durasiMengerkan, setDurasiMengerkan] = useState("");
  const [waktuSelesai, setWaktuSelesai] = useState(null);

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

  const getData = async () => {
    setLoading(true);
    try {
      const soalkuisMengerjakan = await getMengerjakanSoalKuis(
        user?.id,
        idSubMateri,
        idMengerjakanKuis
      );
      console.log(soalkuisMengerjakan)
      const dataDetailSubMateri = await getDataDetailSubMateri(idSubMateri);
      const durasiMengerjakan = dataDetailSubMateri.durasiMengerjakan;
      const waktuMulai = new Date(soalkuisMengerjakan.soal.waktuMulai);
      const selesai = new Date(waktuMulai.getTime() + durasiMengerjakan * 60000);
      setWaktuSelesai(selesai);
      if(dataDetailSubMateri === undefined){
        return navigate(`/materi/${idMatkul}`)
      }
      setSoal(soalkuisMengerjakan.soal);
      const jawabanUser = JSON.parse(localStorage.getItem("jawabanUser")) || [];
      if (jawabanUser.length === 0) {
        const indexJawaban = soalkuisMengerjakan.soal.pertanyaan.length;
        console.log(indexJawaban)
        const arrayJawaban = Array.from({ length: indexJawaban }, () => "");
        setSimpanJawaban(arrayJawaban);
        localStorage.setItem("jawabanUser", JSON.stringify(arrayJawaban));
      }
    } catch (error) {
      setSoal([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.id) {
      getData();
    }
  }, [idSubMateri, user]);

  const handleNomorSoal = (idSoal) => {
    setNomorSoal(idSoal);
  };

  const [forceRender, setForceRender] = useState(false);

  const handleJawaban = (jawaban) => {
    setSimpanJawaban((prevJawaban) => {
      const updatedJawaban = [...prevJawaban];
      updatedJawaban[nomorSoal] = jawaban;
      localStorage.setItem("jawabanUser", JSON.stringify(updatedJawaban));
      return updatedJawaban;
    });

    setForceRender((prev) => !prev);
  };

  useEffect(() => {
    setSimpanJawaban([...simpanJawaban]);
  }, [forceRender]);

  useEffect(() => {
    const jawabanUser = JSON.parse(localStorage.getItem("jawabanUser")) || [];

    if (jawabanUser.length === 0) {
      localStorage.setItem("jawabanUser", JSON.stringify(jawabanUser));
    }

    setSimpanJawaban(jawabanUser);
  }, []);

  const handleSebelumnya = () => {
    if (nomorSoal === 0) {
      setNomorSoal(0);
    } else {
      setNomorSoal(nomorSoal - 1);
    }
  };

  const [currentSoal, setCurrentSoal] = useState(0);

  const handleSelanjutnya = () => {
    const jawabanUser = JSON.parse(localStorage.getItem("jawabanUser")) || [];
    if (nomorSoal === jawabanUser.length - 1) {
      return null;
    }

    if (nomorSoal < jawabanUser.length) {
      const newSoal = nomorSoal + 1;
      setNomorSoal(newSoal);
      setCurrentSoal(newSoal);
    }
  };

  useEffect(() => {
    const jawabanUser = JSON.parse(localStorage.getItem("jawabanUser")) || [];
    const cekJawaban = jawabanUser.includes("");
    setCekJawabanKosong(cekJawaban);
  }, [localStorage.getItem("jawabanUser")]);

  useEffect(() => {
  }, [durasiMengerkan]);

  useEffect(() => {
    if (!waktuSelesai) return;
    const interval = setInterval(() => {
      const waktuSekarang = new Date();
      const selisihWaktu = waktuSelesai - waktuSekarang + 2000;
      if (selisihWaktu <= 0) {
        clearInterval(interval);
        setDurasiMengerkan("00:00");
      } else {
        const sisaMenit = Math.floor(selisihWaktu / 60000).toString().padStart(2, '0');
        const sisaDetik = Math.floor((selisihWaktu % 60000) / 1000).toString().padStart(2, '0');
        setDurasiMengerkan(`${sisaMenit} Menit : ${sisaDetik} Detik`);
      }
    }, 1000);
    console.log(durasiMengerkan)
  
    return () => clearInterval(interval);
  }, [waktuSelesai]);

  useEffect(() => {
    if(durasiMengerkan === '00:00'){
      handleKirimjawabanKuis()
      return navigate(`/materi/${idMatkul}/${idMateri}/${idSubMateri}`)
    }
  },[durasiMengerkan])

  useEffect(() => {
    loading ? Loading.standard() : Loading.remove();
  }, [loading]);

  const handleKirimjawabanKuis = async () => {
    try{
      const dataKuis = {
        jawabanMahasiswa: simpanJawaban,
        nilaiBaru: null
      }
      const kirimJawbanKuis = await kirimSoalJawabanKuis(user?.id, idSubMateri, dataKuis )
      localStorage.removeItem("jawabanUser")
      return navigate(`/materi/${idMatkul}/${idMateri}/${idSubMateri}`)
    }catch(error){
      return navigate(`/materi/${idMatkul}/${idMateri}/${idSubMateri}`)
    }
  }

  console.log(user.role)
  return (
    <>
      <div className="min-h-screen flex items-center flex-col m-auto w-[95%]">
        <div className="w-full flex justify-end h-16 items-center border-b border-slate-600">
          <p className="py-2 px-5 border border-red-600 rounded-md">{durasiMengerkan === "" ? 'Loading..' : durasiMengerkan}</p>
        </div>
        <div className="flex flex-grow w-full flex-col md:flex-row">
          <div className="border-b w-full border-slate-600 pr-0 pb-5 pt-5 md:pb-5 md:pr-5 md:w-[250px] md:border-r md:!border-slate-600">
            <h1 className="font-bold text-slate-800 mb-5">Kategori : Judul</h1>
            <div className="flex gap-3">
              {soal?.pertanyaan?.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => handleNomorSoal(item.id)}
                  className={`w-[40px] h-[40px] text-lg font-semibold border flex justify-center items-center cursor-pointer rounded-sm ${
                    nomorSoal === item.id
                      ? "bg-slate-800 border-slate-700 text-slate-200"
                      : "bg-slate-200 text-slate-900 border-slate-300"
                  }`}
                >
                  {index + 1}
                </div>
              ))}
            </div>
          </div>
          <div className="relative ml-0 pt-5 w-[100%] md:ml-5">
            {soal?.pertanyaan?.find((item) => item.id == nomorSoal) ? (
              <>
                <div className={`w-full ${soal?.fileMateri?.find((item) => item.idSoal == nomorSoal) ? 'min-h-56' : 'h-max'} max-h-max flex flex-col md:block`}>
                  {soal?.fileMateri?.find((item) => item.idSoal == nomorSoal)? (<><img
                    className="float-left mr-5 h-80 w-80 md:h-56 md:w-56"
                    src={"http://localhost:3000" + soal?.fileMateri?.find((item) => item.idSoal == nomorSoal).url}
                    alt=""
                  /></>) : (null)}
                  <p>
                    {" "}
                    {soal.pertanyaan.find((item) => item.id == nomorSoal)
                      ?.soal || "Tidak ada deskripsi tersedia."}
                  </p>
                </div>
              </>
            ) : null}
            <div className="mt-5 flex flex-col">
              <div className="mb-5 flex flex-col gap-3">
                {Object.entries(soal?.pilihan?.[nomorSoal] || {}).map(
                  ([key, value]) => {
                    return (
                      <div key={key} className="flex gap-3 items-center">
                        <div
                          onClick={() => handleJawaban(key)}
                          className={`w-[35px] h-[35px] text-lg font-semibold border flex justify-center items-center cursor-pointer rounded-sm ${
                            key === simpanJawaban[nomorSoal]
                              ? "bg-slate-800 border-slate-700 text-slate-200"
                              : "bg-slate-200 text-slate-900 border-slate-300"
                          }`}
                        >
                          {key}
                        </div>
                        <div className="w-full">{value}</div>
                      </div>
                    );
                  }
                )}
              </div>
              <div className="flex w-full h-20 flex-row justify-between border-t border-slate-600 ">
                <button
                  className={`my-8 px-0 sm:px-3 flex items-center justify-center gap-1 py-3 h-max text-slate-800 cursor-pointer hover:text-slate-900 font-bold ${
                    nomorSoal <= 0
                      ? "opacity-50 cursor-not-allowed"
                      : "opacity-100"
                  }`}
                  type="button"
                  onClick={() => handleSebelumnya()}
                >
                  <FontAwesomeIcon
                    className="border w-6 h-6 border-slate-700 rounded-full text-base"
                    icon={faAngleLeft}
                  />{" "}
                  Sebelumnya
                </button>
                {nomorSoal === simpanJawaban.length - 1 &&
                cekJawabanKosong === false ? (
                  <>
                    {" "}
                    <button
                      className="my-8 px-0 sm:px-3 flex items-center justify-center gap-1 py-3 h-max cursor-pointer font-bold bg-slate-800 hover:bg-slate-900 text-slate-100 hover:text-slate-50"
                      type="button"
                      onClick={() => handleKirimjawabanKuis()}
                    >
                      {user.role === "Mahasiswa" ? "Selesaikan" : "Kembali"}
                    </button>
                  </>
                ) : (
                  <>
                    {" "}
                    <button
                      className={`my-8 px-0 sm:px-3 flex items-center justify-center gap-1 py-3 h-max text-slate-800 cursor-pointer hover:text-slate-900 font-bold ${
                        nomorSoal === simpanJawaban.length - 1
                          ? "opacity-50 cursor-not-allowed"
                          : "opacity-100"
                      }`}
                      type="button"
                      onClick={() => handleSelanjutnya()}
                    >
                      Selanjutnya{" "}
                      <FontAwesomeIcon
                        className="border w-6 h-6 border-slate-700 rounded-full text-base"
                        icon={faAngleRight}
                      />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SoalKuis;
