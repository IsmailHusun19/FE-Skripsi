import React, { useEffect, useState } from "react";
import Logo from "../assets/logo.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faX } from "@fortawesome/free-solid-svg-icons";

const menuNavigasi = [
  { name: "Home", link: "/" },
  { name: "About", link: "/about" },
  { name: "Services", link: "/services" },
  { name: "Contact", link: "/contact" },
];

const Navbar = () => {
  const [isResponsive, setIsResponsive] = useState(false);
  const [btnCloseResponsive, setCloseResponsive] = useState(null);

  useEffect(() => {
    // Media query untuk memeriksa apakah lebar layar 880px atau kurang
    const mediaQuery = window.matchMedia("(max-width: 880px)");

    // Function untuk mengatur class berdasarkan hasil media query
    const handleMediaQueryChange = (e) => {
      setIsResponsive(e.matches);
    };

    // Set initial state dan tambahkan event listener
    handleMediaQueryChange(mediaQuery);
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    // Cleanup event listener saat komponen unmount
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

  return (
    <div className="container-navbar">
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
            ) : (
              ""
            )}
            {menuNavigasi.map((item, index) => (
              <li key={index}>
                <a href={item.link}>{item.name}</a>
              </li>
            ))}
            {isResponsive ? (
              <li>
                <a href="/login">Login</a>
              </li>
            ) : (
              ""
            )}
          </ul>
        </div>
        <div className={`${isResponsive ? "loginActiveResponsive" : ""} login`}>
          {isResponsive ? (
            <FontAwesomeIcon onClick={handleOpenBars} icon={faBars} />
          ) : (
            <a href="/login">Login</a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
