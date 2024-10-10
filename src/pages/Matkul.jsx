import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import MatkulImage from "../assets/bg-books.png";
import { Link } from "react-router-dom";
import AddMatkulDosen from "../component/AddMatkulDosen";
import AddMatkul from "../assets/Addbook.png";
import { useState, useEffect } from "react";
import UserCheck from "../component/UsersCheck";
import axios from "axios";
import { Confirm } from "notiflix/build/notiflix-confirm-aio";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencil } from "@fortawesome/free-solid-svg-icons";

const Matkul = () => {
  const [showAddMatkulDosen, setShowAddMatkulDosen] = useState(false);
  const [handleDataUsersCheck, setUHandleDataUsersCheck] = useState({});
  const [handleAddMatkul, setHandleAddMatkul] = useState(false);
  const [getDataMatkul, setDataMatkul] = useState([]);
  const [getDataMatkulEdit, setDataMatkulEdit] = useState({});

  const getData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/matakuliah", {
        withCredentials: true,
      });
      if (response.status === 200) {
        const data = await response.data;
        const mataKuliah =
          (await handleDataUsersCheck.role) === "Dosen"
            ? data.mataKuliahDiajarkan
            : data.mataKuliahDiikuti;
        setDataMatkul(mataKuliah);
      } else {
        console.log("Request tidak berhasil:", response.status);
      }
    } catch (error) {
      console.error(
        "Error saat mengambil data:",
        error.response || error.message
      );
    }
  };

  const deleteDataMatkul = async (id) => {
    Confirm.show(
      "Konformasi",
      "Apakah yakin ingin menghapus mata kuliah?",
      "Yes",
      "No",
      async () => {
        try {
          const response = await axios.delete(
            `http://localhost:3000/mata-kuliah/${id}`,
            {
              withCredentials: true,
            }
          );
          if (response.status === 200) {
            setDataMatkul((prev) => prev.filter((matkul) => matkul.id !== id));
            Notify.success("Berhasil menghapus mata kuliah");
          } else {
            Notify.failure("Gagal menghapus mata kuliah");
          }
        } catch (error) {
          Notify.failure("Gagal menghapus mata kuliah");
        }
      }
    );
  };

  const deleteDataMatkulMahasiswa = async (id) => {
    Confirm.show(
      "Konformasi",
      "Apakah yakin ingin menghapus mata kuliah?",
      "Yes",
      "No",
      async () => {
        try {
          const response = await axios.delete(
            `http://localhost:3000/mata-kuliah/leave/${id}`,
            {
              withCredentials: true,
            }
          );
          if (response.status === 200) {
            setDataMatkul((prev) => prev.filter((matkul) => matkul.id !== id));
            Notify.success("Berhasil menghapus mata kuliah");
          } else {
            Notify.failure("Gagal menghapus mata kuliah");
          }
        } catch (error) {
          Notify.failure("Gagal menghapus mata kuliah");
        }
      }
    );
  };

  const editDataMatkul = async (matkul) => {
    const data = await matkul;
    setDataMatkulEdit(data);
    setShowAddMatkulDosen(true);
  };

  useEffect(() => {}, [getDataMatkulEdit]);

  useEffect(() => {
    if (Object.keys(handleDataUsersCheck).length > 0) {
      getData(); // Mendapatkan data awal saat komponen pertama kali dirender
    }
  }, [handleDataUsersCheck]);

  const toggleAddMatkulDosen = () => {
    setShowAddMatkulDosen((prev) => !prev);
  };

  const closeAddMatkulDosen = () => {
    setShowAddMatkulDosen(false);
  };

  const handleUsersCheck = (data) => {
    setUHandleDataUsersCheck(data || {});
  };

  useEffect(() => {
    setHandleAddMatkul(Object.keys(handleDataUsersCheck).length > 0);
  }, [handleDataUsersCheck]);

  return (
    <div className="container-satu">
      <Navbar />
      <UserCheck setData={handleUsersCheck} />
      <div className="container-matkul">
        {showAddMatkulDosen && (
          <AddMatkulDosen
            handleButtonClick={closeAddMatkulDosen}
            handleDataUsersCheck={handleDataUsersCheck}
            editDataMatkul={getDataMatkulEdit}
            updateDataMatkul={getData}
          />
        )}
        <div className="judul-search-matkul flex flex-col pt-44 text-center gap-2">
          <h1 className="font-bold text-3xl">
            E - Learning Universitas Banten Jaya
          </h1>
          <h3 className="font-semibold text-slate-500">Pilih Mata Kuliah</h3>
          <div className="pt-2 flex justify-center items-center gap-6 relative mx-auto text-gray-600 pb-9 w-[70%] sm:w-[50%] md:w-[45%]">
            <form className="w-full relative">
              <input
                className="border-2 w-full border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-base focus:outline-none"
                type="text"
                name="search"
                placeholder="Cari mata kuliah"
              />
              <button
                type="submit"
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
            <div className={!handleAddMatkul ? "hidden" : "relative group"}>
              <img
                onClick={toggleAddMatkulDosen}
                className="w-12 cursor-pointer"
                src={AddMatkul}
                alt="Tambah Matkul"
              />
              <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-max p-1 text-sm text-slate-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Tambah Mata Kuliah
              </span>
            </div>
          </div>
        </div>
        <div className="content-matkul w-[90%] m-auto md:w-[95%] grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
          {getDataMatkul.map((matkul) => (
            <div key={matkul.id} className="flex flex-col items-center">
              <Link
                to=""
                className="shadow-xl relative cursor-pointer transition-all hover:scale-105 hover:text-sky-500 w-[100%] flex items-center flex-col gap-2 bg-white p-4 rounded-lg"
              >
                <img
                  className="w-[200px]"
                  src={MatkulImage}
                  alt={matkul.nama}
                />
                <h1 className="font-semibold text-sm">{matkul.nama}</h1>
                <div className="absolute top-2 right-3 flex justify-center gap-3">
                  <FontAwesomeIcon
                    className="p-1 text-xl text-sky-500 hover:text-red-400"
                    onClick={async () => {
                      if (handleDataUsersCheck.role === "Mahasiswa") {
                        await deleteDataMatkulMahasiswa(matkul.id);
                      } else {
                        await deleteDataMatkul(matkul.id);
                      }
                    }}
                    icon={faTrash}
                  />
                  <FontAwesomeIcon
                    className={
                      handleDataUsersCheck.role === "Mahasiswa"
                        ? "hidden"
                        : "p-1 text-xl text-sky-500 hover:text-yellow-400"
                    }
                    onClick={async () => {
                      await editDataMatkul(matkul);
                    }}
                    icon={faPencil}
                  />
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Matkul;
