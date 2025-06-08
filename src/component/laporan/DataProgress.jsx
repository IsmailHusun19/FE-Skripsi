import React, { useState, useEffect } from "react";
import { getDataLaporanMahasiswa } from "../../config/FetchingData";
const DataProgress = ({ idMatkul, idMahasiswa, role }) => {
  const [laporan, setLaporan] = useState([]);
  const [progress, setProgress] = useState(0);
  const [totalDurasi, setTotalDurasi] = useState("");

  const getDataLaporan = async () => {
    try {
      const laporanMahasiswa = await getDataLaporanMahasiswa(idMatkul, idMahasiswa, role);
      const groupedLaporan = laporanMahasiswa.laporan.reduce((acc, item) => {
        const materi = acc.find((m) => m.materi === item.materi);

        if (materi) {
          materi.subMateri.push({
            namaSubMateri: item.subMateri,
            nilai: item.nilai,
            type: item.type,
            status: item.status,
            tanggalLulus: item.tanggalLulus,
          });
        } else {
          acc.push({
            materi: item.materi,
            subMateri: [
              {
                namaSubMateri: item.subMateri,
                nilai: item.nilai,
                type: item.type,
                status: item.status,
                tanggalLulus: item.tanggalLulus,
              },
            ],
          });
        }

        return acc;
      }, []);

      const result = Object.values(groupedLaporan);
      setLaporan(result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getDataLaporan();
  }, [idMatkul]);

  useEffect(() => {
    if (!laporan) return;

    let totalSubMateri = 0;
    let totalSelesai = 0;

    laporan.forEach((item) => {
      item?.subMateri?.forEach((dataSubMateri) => {
        totalSubMateri += 1;
        if (dataSubMateri.status === "Lulus") {
          totalSelesai += 1;
        }
      });
    });
    if ((totalSelesai || totalSubMateri) === 0) {
      setProgress(0);
    } else {
      const total = (totalSelesai / totalSubMateri) * 100;
      setProgress(total.toFixed(1));
    }
  }, [laporan]);

  useEffect(() => {
    if (!laporan) return;
    const subMateriLulus = laporan.flatMap((materi) =>
      materi.subMateri.filter((sub) => sub.status === "Lulus")
    );
    const convertToDate = (tanggalString) => {
      if (!tanggalString) return null;

      const bulanMap = {
        Januari: 0,
        Februari: 1,
        Maret: 2,
        April: 3,
        Mei: 4,
        Juni: 5,
        Juli: 6,
        Agustus: 7,
        September: 8,
        Oktober: 9,
        November: 10,
        Desember: 11,
      };

      const regex = /(\d{1,2}) (\w+) (\d{4}) pukul (\d{2})\.(\d{2})\.(\d{2})/;
      const match = tanggalString.match(regex);

      if (!match) {
        return null;
      }

      const [, tgl, bulanStr, tahun, jam, menit, detik] = match;
      const bulan = bulanMap[bulanStr];

      return new Date(
        tahun,
        bulan,
        parseInt(tgl),
        parseInt(jam),
        parseInt(menit),
        parseInt(detik)
      );
    };

    // Ambil tanggal lulus pertama dan terakhir
    const tanggalLulusPertama = subMateriLulus?.[0]?.tanggalLulus || null;
    const tanggalLulusTerakhir =
      subMateriLulus?.[subMateriLulus.length - 1]?.tanggalLulus || null;

    const selesaiSubMateri1 = convertToDate(tanggalLulusPertama);
    const selesaiSubMateriTerakhir = convertToDate(tanggalLulusTerakhir);
    if (selesaiSubMateri1 && selesaiSubMateriTerakhir) {
      const selisihMs = selesaiSubMateriTerakhir - selesaiSubMateri1;

      const totalDetik = Math.floor(selisihMs / 1000);
      const totalMenit = Math.floor(totalDetik / 60);
      const totalJam = Math.floor(totalMenit / 60);
      const totalHari = Math.floor(totalJam / 24);

      setTotalDurasi(
        `Total waktu: ${totalHari} hari, ${totalJam % 24} jam, ${
          totalMenit % 60
        } menit, ${totalDetik % 60} detik`
      );
    }
  });
  
  return (
    <>
      <div className="w-full pb-8 pt-6 border-t-4 border-blue-800 rounded-md shadow-lg mt-10 no-shadow print:border-none print:mt-[-20px]">
        <h1 className="mb-3 text-xl px-4 pb-4 border-b border-slate-300 print:mb-[-10px] print:pb-2">
          Progress Mahasiswa
        </h1>
        <div className="mt-6 mx-0 lg:mx-3">
          <div
            className="overflow-x-auto transition-all duration-300 ease-in-out
                    mx-3 lg:mx-0"
          >
            <table className="w-full rounded-lg print:text-sm">
              <thead>
                <tr className="bg-slate-800 text-slate-200 ">
                  <th className="border border-slate-400 p-2 w-[80px] text-center print:w-[50px] print:min-w-[50px]">
                    NO
                  </th>
                  <th className="border border-slate-400 p-2 w-[300px] min-w-[200px] lebarTable100">
                    Materi
                  </th>
                  <th className="border border-slate-400 p-2 w-[300px] min-w-[200px] lebarTable150">
                    SubMateri
                  </th>
                  <th className="border border-slate-400 p-2 w-[200px] min-w-[150px] lebarTable70">
                    Type
                  </th>
                  <th className="border border-slate-400 p-2 w-[200px] min-w-[150px] lebarTable90">
                    Status
                  </th>
                  <th className="border border-slate-400 p-2 w-[150px] min-w-[100px] lebarTable60">
                    Nilai
                  </th>
                  <th className="border border-slate-400 p-2 w-[300px] min-w-[250px] lebarTable150">
                    Tanggal Selesai
                  </th>
                </tr>
              </thead>
              <tbody>
                {laporan.length > 0 ? (
                  <>
                    {laporan.map((materiItem, index) => (
                      <React.Fragment key={index}>
                        <tr>
                          <td
                            className="border border-slate-400 p-2 text-center "
                            rowSpan={
                              Math.max(materiItem.subMateri.length, 1) + 1
                            }
                          >
                            {index + 1}
                          </td>
                          <td
                            className="border border-slate-400 p-2"
                            rowSpan={
                              Math.max(materiItem.subMateri.length, 1) + 1
                            }
                          >
                            {materiItem.materi}
                          </td>
                        </tr>

                        {materiItem.subMateri.map((sub, subIndex) => (
                          <tr key={subIndex}>
                            <td className="border border-slate-400 p-2">
                              {sub.namaSubMateri}
                            </td>
                            <td className="border border-slate-400 p-2 text-center">
                              {sub.type}
                            </td>
                            <td
                              className={`border border-slate-400 p-2 font-semibold text-center ${
                                sub.status !== "-"
                                  ? "text-green-700"
                                  : "text-red-700"
                              }`}
                            >
                              {sub.status === "-"
                                ? "Belum Selesai"
                                : "Sudah Selesai"}
                            </td>
                            <td className="border border-slate-400 p-2 text-center">
                              {sub.nilai}
                            </td>
                            <td className="border border-slate-400 p-2 text-center">
                              {sub.tanggalLulus}
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}

                    <tr>
                      <td
                        colSpan="6"
                        className="border border-slate-400 p-2 text-center font-bold"
                      >
                        Total Waktu menyelesaikan
                      </td>
                      <td
                        colSpan="1"
                        className="border border-slate-400 p-2 text-center font-bold"
                      >
                        {totalDurasi}
                      </td>
                    </tr>
                    <tr>
                      <td
                        colSpan="6"
                        className="border border-slate-400 p-2 text-center font-bold"
                      >
                        Progress Mata Kuliah
                      </td>
                      <td
                        colSpan="1"
                        className="border border-slate-400 p-2 text-center font-bold"
                      >
                        {progress}%
                      </td>
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="border border-slate-400 p-2 text-center"
                    >
                      Tidak ada data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default DataProgress;
