import React, { useEffect, useState } from "react";
import Logo from "../assets/logo.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faX,
  faArrowRightFromBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import UserCheck from "./UsersCheck";
import axios from "axios";
import { Loading } from 'notiflix/build/notiflix-loading-aio';

const menuNavigasi = [
  { name: "Home", link: "/" },
  { name: "Mata Kuliah", link: "/matakuliah" },
  { name: "Tentang Kami", link: "/services" },
  { name: "Contact", link: "/editor" }, // Perbaiki link
];


const Navbar = () => {
  const [isResponsive, setIsResponsive] = useState(false);
  const [btnCloseResponsive, setCloseResponsive] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("status"));
    if (storedUserData) {
      setUserData(storedUserData);
    }
    setLoading(false);

    const mediaQuery = window.matchMedia("(max-width: 980px)");
    const handleMediaQueryChange = (e) => {
      setIsResponsive(e.matches);
    };
    handleMediaQueryChange(mediaQuery);
    mediaQuery.addEventListener("change", handleMediaQueryChange);
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  const handleCloseBars = () => {
    setCloseResponsive(false);
  };

  const handleOpenBars = () => {
    setCloseResponsive(true);
  };

  const handleSetData = (data) => {
    setUserData(data);
    if (data) {
      localStorage.setItem("status", true);
    } else {
      localStorage.setItem("status", false);
    }
  };

  useEffect(() => {
    loading ? Loading.standard() : Loading.remove();
  },[loading])

  const handleLogout = async () => {
    try {
      // Kirimkan request logout ke backend
      const response = await axios.post(
        "http://localhost:3000/logout",
        {},
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        console.log(response.data.message);
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="container-navbar">
      <UserCheck setData={handleSetData} />
      <div className="navbar">
        <div className="logo">
          <img src={Logo} alt="Logo" />
        </div>
        <div className="list">
          <ul className={btnCloseResponsive ? "ulClose" : ""}>
            {isResponsive ? (
              <div className="barMobile">
                <li>
                  <img src={Logo} alt="Logo" />
                </li>
                <li onClick={handleCloseBars}>
                  <FontAwesomeIcon icon={faX} />
                </li>
              </div>
            ) : null}
            {menuNavigasi.map((item, index) => (
              <li key={index}>
                <Link className="text-xl" to={item.link}>
                  {item.name}
                </Link>
              </li>
            ))}
            {isResponsive &&
              (loading ? (
                <div></div>
              ) : userData ? (
                <li className="flex flex-col gap-[50px]">
                  <Link to="/profile">Profile</Link>
                  <Link onClick={handleLogout}>Logout</Link>
                </li>
              ) : (
                <li className="flex flex-col gap-[50px]">
                <Link to="/login">Login</Link>
              </li>
              ))}
          </ul>
        </div>
        <div className={`${isResponsive ? "loginActiveResponsive" : ""} login`}>
          {isResponsive ? (
            <FontAwesomeIcon onClick={handleOpenBars} icon={faBars} />
          ) : loading ? (
            <div></div>
          ) : userData ? (
            <div>
              <div className="relative font-[sans-serif] w-max mx-auto">
                <button
                  type="button"
                  onClick={toggleDropdown}
                  className="px-4 py-2 flex items-center rounded-full text-[#333] text-sm border border-gray-300 outline-none hover:bg-gray-100"
                >
                  <img
                    src="https://readymadeui.com/profile_6.webp"
                    className="w-7 h-7 mr-3 rounded-full shrink-0"
                    alt="Profile"
                  />
                  <h1 className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[10ch] lg:max-w-max">{userData.nama}</h1>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3 fill-gray-400 inline ml-3"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.99997 18.1669a2.38 2.38 0 0 1-1.68266-.69733l-9.52-9.52a2.38 2.38 0 1 1 3.36532-3.36532l7.83734 7.83734 7.83734-7.83734a2.38 2.38 0 1 1 3.36532 3.36532l-9.52 9.52a2.38 2.38 0 0 1-1.68266.69734z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {isOpen && (
                  <ul className="absolute block shadow-lg bg-white py-2 z-[1000] min-w-full w-max rounded-lg max-h-96 overflow-auto">
                    <Link to="/profile" className="py-2.5 px-5 flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer gap-3">
                      <FontAwesomeIcon
                        className="text-[#333] w-5"
                        icon={faUser}
                      />
                      Profile
                    </Link>
                    <li
                      onClick={handleLogout}
                      className="py-2.5 px-5 flex items-center hover:bg-gray-100 text-[#333] text-sm cursor-pointer gap-3"
                    >
                      <FontAwesomeIcon
                        className="text-[#333] w-5"
                        icon={faArrowRightFromBracket}
                      />
                      Logout
                    </li>
                  </ul>
                )}
              </div>
            </div>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
