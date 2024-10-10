import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import UserCheck from "./UsersCheck";
import axios from "axios";
import { Report } from 'notiflix/build/notiflix-report-aio';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [navbarKey, setNavbarKey] = useState(0); // State untuk memicu rerender Navbar
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    role: "mahasiswa",
    newNomorInduk: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  // Fungsi untuk menangani data dari UserCheck
  const handleUserData = (data) => {
    if (data.id !== userData?.id) {
      setUserData(data);
      setFormData({
        nama: data.nama || "",
        email: data.email || "",
        newNomorInduk: data.nomorinduk || "",
        password: "",
      });
    }
  };

  // Handle perubahan input form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    setErrorMessage("");
  };

  // Handle submit form untuk mengupdate data pengguna
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { nama, email, newNomorInduk, password } = formData;
    const updateData = {
      nama,
      email,
      newNomorInduk,
      password: password || undefined,
    };

    try {
      // Lakukan PUT request untuk update data pengguna
      const response = await axios.put(
        `http://localhost:3000/users/${userData.id}`,
        updateData,
        {
          withCredentials: true,
        }
      );

      // Setelah berhasil, perbarui formData dan userData
      setUserData((prevUserData) => ({
        ...prevUserData,
        ...updateData,
      }));

      setFormData((prevFormData) => ({
        ...prevFormData,
        password: "", // Kosongkan password setelah submit
      }));

      setNavbarKey((prevKey) => prevKey + 1); // Update navbarKey untuk memicu rerender Navbar
      Report.success(
        'Akun anda berhasil diperbarui!',
        '',
        'Okay',
        {
          backOverlay: false,
        }
      );
    } catch (error) {
      Report.failure(
        'Edit gagal!',
        '',
        'Okay',
        {
          backOverlay: false,
        }
      );
    }
  };

  return (
    <div className="container-satu">
      <Navbar key={navbarKey} />
      <UserCheck setData={handleUserData} />
      <section className="bg-white dark:bg-gray-900 pt-[75.7px] flex justify-center items-center">
        <div className="w-[70%] bg-gray-50 my-10 px-4 py-10 mx-auto shadow-inner rounded-lg">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            My Profile
          </h2>
          {errorMessage && (
            <p className="text-red-600 mb-4">{errorMessage}</p>
          )}
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
                  className="bg-slate-200 border border-gray-300 font-medium text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  value={formData.nama}
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
                  className="bg-slate-200 border border-gray-300 font-medium text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@gmail.com"
                  required
                  autoComplete="email"
                />
              </div>
              <div>
                <label
                  htmlFor="npm"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  NPM
                </label>
                <input
                  type="number"
                  name="newNomorInduk"
                  id="npm"
                  className="bg-slate-200 border border-gray-300 font-medium text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  value={formData.newNomorInduk}
                  onChange={handleChange}
                  placeholder="Nomor induk mahasiswa"
                  required
                />
              </div>
              <div className="w-full">
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
                  className="bg-slate-200 border border-gray-300 font-medium text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  value={formData.password}
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
      <Footer />
    </div>
  );
};

export default Profile;
