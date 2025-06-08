import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Report } from "notiflix/build/notiflix-report-aio";
import { getUserCheck, putProfileMe } from "../../config/FetchingData";
import MenuSlideBar from "../../component/Admin/MenuSlidebar";
import { SidebarContext } from "../../component/Admin/SidebarContextProvider";


const ProfileAdmin = () => {
  const [user, setUser] = useState([]);
  const { expanded } = useContext(SidebarContext);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});
  const getDataUser = async () => {
    setLoading(true);
    try {
      const dataUser = await getUserCheck();
      setUser(dataUser);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDataUser();
  }, []);

  const handleUserData = () => {
    setFormData({
      nama: user.nama,
      email: user.email,
      newNomorInduk: user.nomorinduk,
      password: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = formData;
    try {
      const putProfile = await putProfileMe(data);
      console.log(putProfile);
      if (putProfile) {
        Report.success("Akun anda berhasil diperbarui!", "", "Okay", {
          backOverlay: false,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      getDataUser();
    }
  };

  useEffect(() => {
    if (!loading) {
      handleUserData();
    }
  }, [loading]);

  return (
    <div className="">
      {!loading ? (
        <div className="relative overflow-x-hidden">
          <MenuSlideBar />
          <div className="h-[calc(100vh-64x)] pb-5">
            <div
              className={`grid gap-3 px-4 mr-5 transition-all duration-300
    ${expanded ? "sm:ml-72" : "ml-20"}
    grid-cols-1 sm:[grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]
  `}>
          <section className="h-[calc(100vh-85px)] rounded-md shadow-xl flex justify-center items-center">
            <div className="w-[90%] px-4 py-10 mx-auto rounded-lg md:w-[80%] lg:w-[70%]">
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                My Profile
              </h2>
              <form onSubmit={handleSubmit} method="PUT">
                <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      name="nama"
                      id="name"
                      className="bg-slate-100 border border-gray-300 font-medium text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      value={formData.nama || ""}
                      onChange={handleChange}
                      placeholder="Type your name"
                      required
                      autoComplete="username"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="bg-slate-100 border border-gray-300 font-medium text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      value={formData.email || ""}
                      onChange={handleChange}
                      placeholder="example@gmail.com"
                      required
                      autoComplete="email"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Password Baru
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      className="bg-slate-100 border border-gray-300 font-medium text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      value={formData.password || ""}
                      onChange={handleChange}
                      placeholder="New password (optional)"
                      autoComplete="new-password"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    type="submit"
                    className="block w-40 rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </section>
          </div>
          </div>

        </div>
      ) : null}
    </div>
  );
};

export default ProfileAdmin;
