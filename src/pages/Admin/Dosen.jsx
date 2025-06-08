import MenuSlideBar from "../../component/Admin/MenuSlidebar";
import { SidebarContext } from "../../component/Admin/SidebarContextProvider";
import React, { useEffect, useState, useContext } from "react";
import { getAllDosen, deleteDosen } from "../../config/FetchingData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { Confirm, Notify } from 'notiflix';

const Dosen = () => {
  const { expanded } = useContext(SidebarContext);
  const [mahasiswa, setMahasiswa] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const getDataMahasiswa = async () => {
    setLoading(true);
    try {
      const getData = await getAllDosen();
      setMahasiswa(getData.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDataMahasiswa();
  }, []);

  const handleTambahDataDosen = () => {
    navigate('/admin/pengguna/dosen/tambah')
  }

  const handleDelete = async (id) => {
    Confirm.show(
      'Konfirmasi Hapus',
      'Apakah Anda yakin ingin menghapus dosen ini?',
      'Ya',
      'Batal',
      async () => {
        try {
          await deleteDosen(id);
          Notify.success('Dosen berhasil dihapus');
          getDataMahasiswa();
        } catch (e) {
          console.error(e);
          Notify.failure('Gagal menghapus dosen');
        }
      },
      () => {
      }
    );
  };
  

  return (
    <>
      {!loading ? (
        <>
          <div className="relative overflow-x-hidden">
            <MenuSlideBar />
            <div className="h-[calc(100vh-64x)] pb-5">
              <div
                className={`grid gap-3 mr-5 transition-all duration-300
  ${expanded ? "sm:ml-72" : "ml-20"}
  grid-cols-1 sm:[grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]
`}
              >
                <section className="dark:bg-gray-900 w-full">
                  <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
                    <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden my-10">
                      <h1 className="font-semibold text-xl px-5">Dosen</h1>
                      <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                        <div className="w-full md:w-1/2">
                          <form className="flex items-center">
                            <label htmlFor="simple-search" className="sr-only">
                              Search
                            </label>
                            <div className="relative w-full">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg
                                  aria-hidden="true"
                                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                              <input
                                type="text"
                                id="simple-search"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Search"
                                required=""
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                              />
                            </div>
                          </form>
                        </div>
                        <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                          <button
                          onClick={() => handleTambahDataDosen()}
                            type="button"
                            className="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
                          >
                            <svg
                              className="h-3.5 w-3.5 mr-2"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                            >
                              <path
                                clipRule="evenodd"
                                fillRule="evenodd"
                                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                              />
                            </svg>
                            Tambah Dosen
                          </button>
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                              <th scope="col" className="px-4 py-3">
                                No
                              </th>
                              <th scope="col" className="px-4 py-3">
                                Nama
                              </th>
                              <th scope="col" className="px-4 py-3">
                                NPM
                              </th>
                              <th scope="col" className="px-4 py-3">
                                Email
                              </th>
                              <th scope="col" className="px-4 py-3">
                                Tanggal Daftar
                              </th>
                              <th scope="col" className="px-4 py-3">
                                Aksi
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {mahasiswa
                              .filter((mhs) => {
                                const lowerSearch = searchTerm.toLowerCase();
                                return (
                                  mhs.nama
                                    .toLowerCase()
                                    .includes(lowerSearch) ||
                                  mhs.nomorinduk
                                    .toLowerCase()
                                    .includes(lowerSearch) ||
                                  mhs.email.toLowerCase().includes(lowerSearch)
                                );
                              })
                              .map((mhs, index) => (
                                <tr
                                  key={mhs.id}
                                  className="border-b dark:border-gray-700"
                                >
                                  <td className="px-4 py-3">{index + 1}</td>
                                  <th
                                    scope="row"
                                    className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                  >
                                    {mhs.nama}
                                  </th>
                                  <td className="px-4 py-3">
                                    {mhs.nomorinduk}
                                  </td>
                                  <td className="px-4 py-3">{mhs.email}</td>
                                  <td className="px-4 py-3">
                                    {new Date(
                                      mhs.tanggalDaftar
                                    ).toLocaleDateString("id-ID", {
                                      day: "2-digit",
                                      month: "long",
                                      year: "numeric",
                                    })}
                                  </td>

                                  <td className="px-4 py-3 flex gap-2 items-center justify-end">
                                  <FontAwesomeIcon
                                          className="text-base bg-yellow-500 py-2 px-3 rounded-md cursor-pointer hover:text-white"
                                          icon={faPen}
                                          onClick={() => navigate(`/admin/pengguna/dosen/edit/${mhs.id}`)}
                                        />
                                        <FontAwesomeIcon
                                          className="text-base bg-red-500 py-2 px-3 rounded-md cursor-pointer hover:text-white"
                                          icon={faTrash}
                                          onClick={() => handleDelete(mhs.id)}
                                        />
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default Dosen;
