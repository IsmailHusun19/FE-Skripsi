import { getAllMataKuliahAdmin } from "../../config/FetchingData"
import React, { useEffect, useState, useContext } from "react";
import MenuSlideBar from "../../component/Admin/MenuSlidebar";
import { SidebarContext } from "../../component/Admin/SidebarContextProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";


const ProgressMahasiswa = () => {
  const [matkul, setMatkul] = useState([]);
  const { expanded } = useContext(SidebarContext);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();


    const getData = async () => {
        setLoading(true);
        try {
          const getDataMatkul = await getAllMataKuliahAdmin();
          setMatkul(getDataMatkul.data.data)
          console.log(getDataMatkul.data.data)
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      };
    
      useEffect(() => {
        getData();
      }, []);

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
                        <h1 className="font-semibold text-xl px-5">Progress Mahasiswa</h1>
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
                                  Dosen
                                </th>
                                <th scope="col" className="px-4 py-3">
                                  Jumlah Mahasiswa
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {matkul
                                .filter((matkul) => {
                                  const lowerSearch = searchTerm.toLowerCase();
                                  return (
                                    matkul.nama
                                      .toLowerCase()
                                      .includes(lowerSearch) ||
                                    matkul.dosen[0].nama
                                      .toLowerCase()
                                      .includes(lowerSearch)
                                  );
                                })
                                .map((matkul, index) => (
                                  <tr
                                  onClick={() => navigate(`/admin/progress/mahasiswa/list-progress/${matkul.id}`)}
                                    key={matkul.id}
                                    className="border-b dark:border-gray-700 hover:bg-gray-600 text-gray-800 hover:text-white cursor-pointer"
                                  >
                                    <td className="px-4 py-3">{index + 1}</td>
                                    <th
                                      scope="row"
                                      className="px-4 py-3 font-medium whitespace-nowrap dark:text-white"
                                    >
                                      {matkul.nama}
                                    </th>
                                    <td className="px-4 py-3">
                                      {matkul.dosen[0].nama}
                                    </td>
                                    <td className="px-4 py-3">{matkul.jumlahMahasiswa}</td>
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
    )
}

export default ProgressMahasiswa;