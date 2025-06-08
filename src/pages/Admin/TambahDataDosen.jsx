import { useParams } from "react-router-dom";
import MenuSlideBar from "../../component/Admin/MenuSlidebar";
import { SidebarContext } from "../../component/Admin/SidebarContextProvider";
import React, { useEffect, useState, useContext } from "react";
import { postDataDosen } from "../../config/FetchingData";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const TambahDataDosen = () => {
  const { expanded } = useContext(SidebarContext);
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [nomorinduk, setNomorinduk] = useState("");
  const [password, setPassword] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        nama,
        email,
        nomorinduk,
        password,
      };
      await postDataDosen(data);
      Notify.success('Berhasil menambahkan dosen');
      setNama("");
      setEmail("");
      setNomorinduk("");
      setPassword("");
    } catch (error) {
      console.error("Gagal menambahkan dosen:", error);
      Notify.failure('Gagal menambahkan dosen');
    }
  };

  return (
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
            <form className="w-[90%] m-auto mt-10" onSubmit={handleSubmit}>
              <h1 className="font-semibold text-xl mb-5">Edit Dosen</h1>
              <div className="mb-6">
                <div>
                  <label
                    htmlFor="first_name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Nama
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="John"
                    required
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                  />
                </div>
              </div>
              <div className="mb-6">
                <div>
                  <label
                    htmlFor="noInduk"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Nomor Induk
                  </label>
                  <input
                    type="text"
                    id="noInduk"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="110121"
                    required
                    value={nomorinduk}
                    onChange={(e) => setNomorinduk(e.target.value)}
                  />
                </div>
              </div>
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="john.doe@company.com"
                  required
                  value={email}
                  autoComplete="username"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="•••••••••"
                  required
                  value={password}
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default TambahDataDosen;
