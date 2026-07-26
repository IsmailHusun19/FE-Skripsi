import {
  Home,
  Users,
  LogOut,
  User,
  BookOpenText,
  Notebook,
} from "lucide-react";
import Sidebar, { SidebarItem } from "./SlideBar";
import { useLocation } from "react-router-dom";
import axios from "axios";
import UserCheck from "../UsersCheck";
import { useState, useEffect } from "react";
import { BASE_URL } from "../../utils/config";


const MenuSlideBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("status"));
    if (storedUserData) {
      setUserData(storedUserData);
    }
    setLoading(false);
  }, []);

  const handleSetData = (data) => {
    setUserData(data);
    if (data) {
      localStorage.setItem("status", true);
    } else {
      localStorage.setItem("status", false);
    }
  };

  const handleLogout = async () => {
    try {
      // Kirimkan request logout ke backend
      const response = await axios.post(
        `${BASE_URL}/logout`,
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
  const isFeedbackActive = currentPath.startsWith("/admin/pengguna/feedback");

const isPenggunaActive = currentPath.startsWith("/admin/pengguna") && !isFeedbackActive;

  return (
    <div className="flex">
      <UserCheck setData={handleSetData} />
      <Sidebar>
        <SidebarItem
          icon={<Home size={20} />}
          text="Home"
          active={currentPath === "/admin/home"}
          to="/admin/home"
        />
        <SidebarItem
          icon={<Users size={20} />}
          text="Pengguna"
          active={isPenggunaActive}
          to="/admin/pengguna"
        >
          {["Mahasiswa", "Dosen"].map((item) => item)}
        </SidebarItem>

        <SidebarItem
          icon={<BookOpenText size={20} />}
          text="Mata Kuliah"
          active={currentPath.includes("/admin/matakuliah")}
          to="/admin/matakuliah"
        />
        <SidebarItem
          icon={<Notebook size={20} />}
          text="Feeback"
          active={isFeedbackActive}
          to="/admin/pengguna/feedback"
        >
          {["Feedback Mata Kuliah", "Feedback Sistem"].map((item) => item)}
        </SidebarItem>

        <SidebarItem
          icon={<Notebook size={20} />}
          text="Progress Mahasiswa"
          active={currentPath.includes("/admin/progress/mahasiswa")}
          to="/admin/progress/mahasiswa"
        ></SidebarItem>

        <hr className="my-3 mb-5" />
        <SidebarItem
          icon={<User size={20} />}
          text="Profile"
          active={currentPath === "/admin/profile"}
          to="/admin/profile"
        />
        <SidebarItem
          icon={<LogOut size={20} />}
          text="Logout"
          onClick={() => handleLogout()}
        />
      </Sidebar>
      <div className="w-full h-16 shadow-md flex justify-end items-center">
        <div className="relative font-[sans-serif] mx-auto w-[95%] m-auto flex justify-end">
          <div className="px-4 py-2 flex items-center rounded-full text-[#333] text-sm ">
            <img
              src="https://readymadeui.com/profile_6.webp"
              className="w-8 h-8 mr-3 rounded-full shrink-0"
              alt="Profile"
            />
            <h1 className="whitespace-nowrap overflow-hidden font-bold text-gray-600 text-ellipsis max-w-[10ch] lg:max-w-max">
              {userData?.nama}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuSlideBar;
