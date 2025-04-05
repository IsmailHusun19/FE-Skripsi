import { useState, useEffect } from "react";
import "../style/CKEditor.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faBook,
  faTrash,
  faRobot,
  faRightFromBracket,
  faGears,
  faCircleCheck as faCircleCheckSolid,
} from "@fortawesome/free-solid-svg-icons";
import { useParams, Link, useNavigate} from "react-router-dom";
import {
  getUserCheck,
} from "../config/FetchingData";
import { motion } from "framer-motion";
import { TbReportAnalytics } from "react-icons/tb";

const SliderBar = ({
  title,
  isSidebarCollapsed,
  openChatBot,
  deleteMatkul,
}) => {
    const { idMatkul, idMateri, idSubMateri } = useParams();
    const [user, setUser] = useState([]);

    const handleClick = () => {
      openChatBot(true);
    };
  
    const handleDeleteMatkul = () => {
      deleteMatkul(true);
    };
  
    const getData = async () => {
      try {
        const dataUser = await getUserCheck();
        setUser(dataUser.role);
      } catch (error) {
        console.log(error);
      }
    };

  const menuSlideBar = [
    {
      name: "Materi",
      icon: <FontAwesomeIcon className="text-xl w-9" icon={faBook} />,
      isActive: false,
      link: `/materi/${idMatkul}`,
    },
    {
      name: "Mengelola Materi",
      icon: <FontAwesomeIcon className="text-xl w-9" icon={faGears} />,
      isActive: false,
      link: `/mengelolamateri/${idMatkul}`,
    },
    {
      name: "ChatBot",
      icon: (
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <FontAwesomeIcon className="text-2xl mb-[-3px] w-9" icon={faRobot} />
        </motion.div>
      ),
      isActive: false,
    },
    {
      name: "Mahasiswa",
      isActive: false,
      icon: <FontAwesomeIcon className="text-xl w-9" icon={faUsers} />,
    },
    {
      name: "Laporan",
      isActive: false,
      icon: <TbReportAnalytics className="text-[30px] w-9" />,
      link: `/laporan/${idMatkul}`,
    },
    {
      name: "Hapus Mata Kuliah",
      isActive: false,
      icon: <FontAwesomeIcon className="text-xl w-9" icon={faTrash} />,
    },
    {
      name: "Keluar dari Mata Kuliah",
      isActive: false,
      icon: (
        <FontAwesomeIcon
          className="text-[23px] rotate-180 w-9"
          icon={faRightFromBracket}
        />
      ),
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="py-5">
      <h6
        className={`mb-4 text-base text-left ${
          isSidebarCollapsed ? "text-center pl-0" : "text-left pl-3"
        }`}
      >
        <span className="">{isSidebarCollapsed ? title.xs : title.sm}</span>
      </h6>
      <ul>
        {menuSlideBar.map((val, index) => {
          const menuActive = val.isActive
            ? `bg-blue-300 bg-opacity-10 px-3 border border-blue-100 py-2 rounded-md text-blue-400 flex items-center`
            : `px-3 py-2 flex items-center ${
                isSidebarCollapsed ? "justify-center" : ""
              }`;
          return (
            ((user === "Dosen" &&
              val.name !== "Keluar dari Mata Kuliah" &&
              val.name !== "Laporan") ||
              (user !== "Dosen" &&
                val.name !== "Mahasiswa" &&
                val.name !== "Mengelola Materi" &&
                val.name !== "Hapus Mata Kuliah")) && (
              <Link
                key={index}
                onClick={
                  val.name === "ChatBot"
                    ? () => handleClick()
                    : val.name === "Hapus Mata Kuliah" || val.name === "Keluar dari Mata Kuliah"
                    ? () => handleDeleteMatkul()
                    : null
                }
                to={val.link}
                className={`${menuActive} cursor-pointer hover:bg-blue-700 hover:text-white my-5 w-full`}
              >
                <div className="flex items-center justify-center">
                  {val.icon}
                </div>
                {!isSidebarCollapsed && <div className="ml-2 overflow-hidden whitespace-nowrap">{val.name}</div>}
              </Link>
            )
          );
        })}
      </ul>
    </div>
  );
};

export default SliderBar;
