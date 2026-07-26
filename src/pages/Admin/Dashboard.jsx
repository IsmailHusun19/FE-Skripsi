import MenuSlideBar from "../../component/Admin/MenuSlidebar";
import { SidebarContext } from "../../component/Admin/SidebarContextProvider";
import { useContext, useState, useEffect, useRef } from "react";
import CountUp from "react-countup";
import { Users, BookOpenText, Notebook, GraduationCap } from "lucide-react";
import {
  getUserCheck,
  getDataJumlahDashboardAdmin,
  getAllMahasiswa,
} from "../../config/FetchingData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Dashboard = () => {
  const { expanded } = useContext(SidebarContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mahasiswa, setMahasiswa] = useState([]);
  const [dataAll, setDataAll] = useState({});
  const [tahun, setTahun] = useState(new Date().getFullYear().toString());
  const [data, setData] = useState([]);
  const chartRef = useRef(null);
  const [form, setForm] = useState({
    jumlahMahasiswa: "",
    jumlahDosen: "",
    JumlahMataKuliah: "",
    jumlahFeedback: "",
  });
  const getDataUser = async () => {
    setLoading(true);
    try {
      const dataUser = await getUserCheck();
      const getJumlah = await getDataJumlahDashboardAdmin();
      const getMahasiswa = await getAllMahasiswa();
      setMahasiswa(getMahasiswa.data);
      setUserData(dataUser);
      setForm({
        jumlahMahasiswa: getJumlah.data.mahasiswa,
        jumlahDosen: getJumlah.data.dosen,
        JumlahMataKuliah: getJumlah.data.mataKuliah,
        jumlahFeedback: getJumlah.data.feedback,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDataUser();
  }, []);

  function dummyData(mahasiswaArray) {
    const hasil = {};

    mahasiswaArray.forEach(({ tanggalDaftar }) => {
      const date = new Date(tanggalDaftar);
      const tahun = date.getFullYear();
      const bulanIndex = date.getMonth();

      if (!hasil[tahun]) {
        hasil[tahun] = Array(12).fill(0);
      }

      hasil[tahun][bulanIndex]++;
    });

    const hasilAkhir = {};

    for (const thn in hasil) {
      hasilAkhir[thn] = hasil[thn].map((jumlah, i) => ({
        bulan: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "Mei",
          "Jun",
          "Jul",
          "Agu",
          "Sep",
          "Okt",
          "Nov",
          "Des",
        ][i],
        mahasiswa: jumlah,
      }));
    }

    return hasilAkhir;
  }
  useEffect(() => {
    if (!loading && mahasiswa.length > 0) {
      const processed = dummyData(mahasiswa);
      setDataAll(processed);
    }
  }, [loading, mahasiswa]);

  useEffect(() => {
    if (dataAll[tahun]) {
      setData(dataAll[tahun]);
    } else {
      setData([]);
    }
  }, [tahun, dataAll]);

  
  const handleExport = async () => {
    if (!chartRef.current) return;
  
    const canvas = await html2canvas(chartRef.current, { backgroundColor: "#fff" });
    const imgData = canvas.toDataURL("image/png");
  
    const pdf = new jsPDF({
      orientation: "landscape", // atau 'portrait'
      unit: "pt",
      format: [canvas.width, canvas.height], // supaya ukuran PDF sesuai canvas
    });
  
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`statistik-mahasiswa-${tahun}.pdf`);
  };
  
  
  
  

  return (
    <>
      {!loading ? (
        <>
          <div className=" relative overflow-x-hidden">
            <MenuSlideBar />
            <div className="h-[calc(100vh-85px)]">
            <div
              className={`grid gap-3 mt-5 px-4 mr-5 transition-all duration-300
    ${expanded ? "sm:ml-72" : "ml-20"}
    grid-cols-1 sm:[grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]
  `}
            >
              <div
                className="w-full h-32 flex flex-col justify-center px-3 gap-1 rounded-lg border-l-8 bg-white border-blue-600"
                style={{ boxShadow: "2px 2px 5px rgba(0,0,1)" }}
              >
                <div className="flex gap-3 justify-between items-center">
                  <CountUp
                    end={form.jumlahMahasiswa}
                    duration={1}
                    separator="."
                    className="text-gray-800 text-5xl font-medium"
                  />
                  <Users
                    size={36}
                    strokeWidth={2.25}
                    className="w-16 text-blue-600 h-16"
                  />
                </div>
                <span className="text-gray-600 text-sm font-medium">
                  Jumlah Mahasiswa
                </span>
              </div>
              <div
                className="w-full h-32 flex flex-col justify-center px-3 gap-1 rounded-lg border-l-8 bg-white border-orange-600"
                style={{ boxShadow: "2px 2px 5px rgba(0,0,1)" }}
              >
                <div className="flex gap-3 justify-between items-center">
                  <CountUp
                    end={form.jumlahDosen}
                    duration={1}
                    separator="."
                    className="text-gray-800 text-5xl font-medium"
                  />
                  <GraduationCap
                    size={36}
                    strokeWidth={2.25}
                    className="w-16 text-orange-600 h-16"
                  />
                </div>
                <span className="text-gray-600 text-sm font-medium">
                  Jumlah Dosen
                </span>
              </div>
              <div
                className="w-full h-32 flex flex-col justify-center px-3 gap-1 rounded-lg border-l-8 bg-white border-purple-600"
                style={{ boxShadow: "2px 2px 5px rgba(0,0,1)" }}
              >
                <div className="flex gap-3 justify-between items-center">
                  <CountUp
                    end={form.JumlahMataKuliah}
                    duration={1}
                    separator="."
                    className="text-gray-800 text-5xl font-medium"
                  />
                  <BookOpenText
                    size={36}
                    strokeWidth={2.25}
                    className="w-16 text-purple-600 h-16"
                  />
                </div>
                <span className="text-gray-600 text-sm font-medium">
                  Jumlah Mata Kuliah
                </span>
              </div>
              <div
                className="w-full h-32 flex flex-col justify-center px-3 gap-1 rounded-lg border-l-8 bg-white border-green-600"
                style={{ boxShadow: "2px 2px 5px rgba(0,0,1)" }}
              >
                <div className="flex gap-3 justify-between items-center">
                  <CountUp
                    end={form.jumlahFeedback}
                    duration={1}
                    separator="."
                    className="text-gray-800 text-5xl font-medium"
                  />
                  <Notebook
                    size={36}
                    strokeWidth={2.25}
                    className="w-16 text-green-600 h-16"
                  />
                </div>
                <span className="text-gray-600 text-sm font-medium">
                  Jumlah Feedback Sistem
                </span>
              </div>
            </div>
            <div
              ref={chartRef}
              className={`grid gap-3 mt-5 px-4 mr-5 pb-5 transition-all duration-300
    ${expanded ? "sm:ml-72" : "ml-20"}
  `}
            >
              <div
                className="p-4 bg-white rounded-xl"
                style={{ boxShadow: "2px 2px 5px rgba(0,0,1)" }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl sm:block hidden font-semibold text-gray-700">
                    Statistik Mahasiswa
                  </h2>
                  <select
                    className="border rounded w-24 h-9 text-gray-600"
                    value={tahun}
                    onChange={(e) => setTahun(e.target.value)}
                  >
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                  </select>
                  <div className="w-24 h-9 flex justify-center items-center text-center">
                    <button
                      onClick={handleExport}
                      className="bg-blue-600 w-full h-full text-white rounded text-sm hover:bg-blue-700"
                    >
                      Export PDF
                    </button>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                <BarChart key={data.length} data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <YAxis domain={[0, 'dataMax + 10']} />
                    <XAxis dataKey="bulan" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="mahasiswa"
                      fill="#8884d8"
                      name="Jumlah Mahasiswa"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default Dashboard;
