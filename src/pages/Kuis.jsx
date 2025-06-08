import { useEffect, useState } from "react";
import {
  getMengerjakanSoalKuis,
  mulaiKuis,
  cekStatusMulaiKuis,
} from "../config/FetchingData";
import { getDetaiNilaiMahasiswa } from "../config/FetchingData.jsx";
import { useParams, Link, useNavigate } from "react-router-dom";

const Kuis = ({
  namaMateriKuis,
  jumlahSoal,
  syaratKelulusan,
  durasiUjian,
  durasiUlang,
  data,
}) => {
  const { idSubMateri } = useParams();
  localStorage.removeItem("jawabanUser");
  const navigate = useNavigate();
  const [dataNilai, setDataNiai] = useState();
  const [waktuSelesai, setWaktuSelesai] = useState(null);
  const [sisaWaktu, setSisaWaktu] = useState("Loading");

  const getNiaiMahasiswa = async () => {
    try {
      const getDetailNilaiMhs = await getDetaiNilaiMahasiswa(idSubMateri);
      setDataNiai(getDetailNilaiMhs);
      setWaktuSelesai(getDetailNilaiMhs.waktuMulai);
    } catch (error) {
      setWaktuSelesai(null);
      setSisaWaktu("00:00");
      console.error(error);
    }
  };
  useEffect(() => {
    getNiaiMahasiswa();
  }, [idSubMateri]);

  const handleMulaiKuis = async () => {
    if (data.userRole === "Mahasiswa") {
      if (sisaWaktu === "00:00") {
        try {
          const cekStatusKuis = await cekStatusMulaiKuis(idSubMateri);
          if (cekStatusKuis.statusOngoing) {
            navigate(
              `/kuis/${data.idMatkul}/${data.idMateri}/${data.idSubMateri}/${cekStatusKuis.id}`
            );
          } else {
            const handleMulaiKuis = await mulaiKuis(data.idSubMateri);
            if (handleMulaiKuis != undefined) {
              navigate(
                `/kuis/${data.idMatkul}/${data.idMateri}/${data.idSubMateri}/${handleMulaiKuis.kuis.id}`
              );
            }
          }
        } catch (error) {
          console.log(error);
          setWaktuSelesai("");
        }
      }
    } else {
      try {
        const handleMulaiKuis = await mulaiKuis(data.idSubMateri);
        console.log(handleMulaiKuis);
        if (handleMulaiKuis != undefined) {
          navigate(
            `/kuis/${data.idMatkul}/${data.idMateri}/${data.idSubMateri}/${handleMulaiKuis.kuis.id}`
          );
        }
      } catch (error) {
        console.log(error);
        setWaktuSelesai("");
      }
    }
  };

  useEffect(() => {
    if (!durasiUlang || !waktuSelesai) return;
    const waktuSelesaiDate = new Date(waktuSelesai);
    const waktuBisaMulai = new Date(
      waktuSelesaiDate.getTime() + durasiUlang * 60000
    );
    const interval = setInterval(() => {
      const waktuSekarang = new Date();
      const selisihWaktu = waktuBisaMulai - waktuSekarang + 2000;
      if (selisihWaktu <= 0) {
        clearInterval(interval);
        setSisaWaktu("00:00");
      } else {
        const sisaMenit = Math.floor(selisihWaktu / 60000)
          .toString()
          .padStart(2, "0");
        const sisaDetik = Math.floor((selisihWaktu % 60000) / 1000)
          .toString()
          .padStart(2, "0");
        if (selisihWaktu < 60000) {
          setSisaWaktu(`${sisaDetik}s`);
        } else {
          setSisaWaktu(`${sisaMenit}m:${sisaDetik}s`);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [durasiUlang, waktuSelesai]);

  return (
    <div>
      {syaratKelulusan !== null ? (
        <div className="flex flex-col gap-3 text-lg justify-center">
          <p>{`Kuis ini bertujuan untuk menguji pengetahuan Anda tentang materi ${namaMateriKuis}.`}</p>
          <p>{`Terdapat ${jumlahSoal} pertanyaan yang harus dikerjakan dalam kuis ini. Beberapa ketentuannya sebagai berikut:`}</p>
          <ul className="list-disc ml-10">
            <li>{`Syarat nilai kelulusan : ${syaratKelulusan}`}</li>
            <li>{`Durasi ujian : ${durasiUjian} menit`}</li>
          </ul>
          <p>{`Apabila tidak memenuhi syarat kelulusan, maka Anda harus menunggu selama ${durasiUlang} menit untuk mengulang pengerjaan kuis kembali. Manfaatkan waktu tunggu tersebut untuk mempelajari kembali materi sebelumnya, ya.`}</p>
          <p>Selamat Mengerjakan!</p>
          <div className="w-full flex justify-end items-end">
            <button
              onClick={() => handleMulaiKuis()}
              className="bg-slate-800 text-slate-200 px-6 py-2 hover:bg-slate-900 hover:text-slate-100"
              type="submit"
            >
              {data.userRole === "Dosen" ||
              data.userRole === "Admin" ||
              sisaWaktu === "00:00"
                ? "Mulai"
                : sisaWaktu !== "00:00"
                ? sisaWaktu
                : "Mulai"}
            </button>
          </div>
          {dataNilai === undefined || dataNilai.nilai.length === 0 ? null : (
            <div className="mt-10 mb-10">
              <div
                className="overflow-x-auto p-5"
                style={{ width: "calc(100vw - 130px)" }}
              >
                <table className="w-full rounded-lg">
                  <thead>
                    <tr className="bg-slate-800 text-slate-200 border border-slate-400">
                      <th className="p-2 w-[50px] text-center min-w-[50px] ">
                        No
                      </th>
                      <th className=" p-2 w-[100px] text-center min-w-[80px]">
                        Nilai
                      </th>
                      <th className=" p-2 w-[150px] text-center min-w-[120px]">
                        Status
                      </th>
                      <th className=" p-2 w-[200px] text-center min-w-[180px]">
                        Tanggal
                      </th>
                      <th className=" p-2 w-[250px] text-center min-w-[200px]">
                        Pertama kali Lulus
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataNilai?.nilai?.map((item, index) => {
                      const nilai = item[0]; // Nilai mahasiswa
                      const tanggal = new Date(item[1]).toLocaleString(
                        "id-ID",
                        {
                          timeZone: "Asia/Jakarta",
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        }
                      );
                      const status =
                        nilai >= syaratKelulusan ? "Lulus" : "Tidak Lulus";
                      const pertamaLulus =
                        dataNilai.nilaiPertamaLulus === index ? "✔" : "-";

                      return (
                        <tr
                          key={index}
                          className={`${index % 2 === 0 ? "bg-gray-300" : ""}`}
                        >
                          <td className="border border-slate-400 p-2 text-center">
                            {index + 1}
                          </td>
                          <td className="border border-slate-400 p-2 text-center">
                            {nilai}
                          </td>
                          <td
                            className={`border border-slate-400 p-2 text-center font-bold ${
                              status === "Lulus"
                                ? "text-green-700"
                                : "text-red-700"
                            }`}
                          >
                            {status}
                          </td>
                          <td className="border border-slate-400 p-2 text-center">
                            {tanggal}
                          </td>
                          <td className="border border-slate-400 p-2 text-center">
                            {pertamaLulus}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default Kuis;
