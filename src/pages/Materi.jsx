import { useState, useEffect } from "react";
import "../style/CKEditor.css";
import "ckeditor5/ckeditor5.css";
import Navbar from "../component/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesRight,
  faAngleDown,
  faLock,
  faAngleUp,
} from "@fortawesome/free-solid-svg-icons";

const Materi = () => {
  const [materi, setMateri] = useState("");

  const fetchMateri = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/materi/133");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      setMateri(result);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    fetchMateri();
  }, []);

  const [ButtonMenuMateri, SetButtionMenuMateri] = useState(false);
  const handelCloseButtonMenuMateri = () => {
    SetButtionMenuMateri(true);
  };

  const handelOpenButtonMenuMateri = () => {
    SetButtionMenuMateri(false);
  };

  const [ButtonListMateri, setButtonListMateri] = useState(false);

  const handleToggleButtonListMateri = () => {
    setButtonListMateri((prev) => !prev);
    console.log(!ButtonListMateri);
  };

  return (
    <div className="container-satu">
      <Navbar />
      <div className="flex relative">
        <div
          className={`relative pt-[75.7px] transition-all duration-300 ease-in-out ${
            ButtonMenuMateri
              ? "w-full"
              : "w-full sm:w-[50%] md:w-[60%] lg:w-[70%]"
          }`}
        >
          <div className="main-container w-full">
            <div className="editor-container editor-container_classic-editor editor-container_include-style">
              <div className="editor-container__editor">
                <div dangerouslySetInnerHTML={{ __html: materi.value }} />
              </div>
            </div>
          </div>
        </div>
        <div
          className={`fixed right-0 h-full border border-slate-400 rounded-md overflow-y-auto pb-[90px] bg-white transition-all duration-300 ease-in-out ${
            ButtonMenuMateri
              ? "w-0 mt-[75.7px] border-none"
              : "w-full sm:w-[50%] md:w-[40%] lg:w-[30%] mt-[75.7px]"
          }`}
        >
          <div className="flex gap-4 items-center text-slate-900 font-semibold text-lg p-6 fixed rounded-md bg-zinc-100 z-10 w-full sm:w-[50%] md:w-[40%] lg:w-[30%]">
            <button
              type="button"
              onClick={handelCloseButtonMenuMateri}
              className="min-w-[32px] min-h-[32px] rounded-full bg-slate-800 text-slate-50 flex justify-center items-center"
            >
              {<FontAwesomeIcon icon={faAnglesRight} />}
            </button>
            <div className="relative group">
              <h1 className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[20ch] transition-all duration-300">
                Pemograman Web II Pemograman Web II dhsdsdjss dshdgshdss dshdsd
                sdbsgdhsn dsbhdgshdn sdshdusj
              </h1>
              <span className="absolute left-0 hidden group-hover:block bg-white border z-20 text-slate-900 p-2 rounded-md mt-1 text-sm w-full font-light ">
                Pemograman Web II dhsdsdjss dshdgshdss dshdsd sdbsgdhsn
                dsbhdgshdn sdshdusj
              </span>
            </div>
          </div>
          <div className="flex flex-col pt-20">
            <div className="w-[100%] p-2 rounded-lg m-auto relative">
              <div
                onClick={handleToggleButtonListMateri}
                className="cursor-pointer flex gap-4 items-center relative"
              >
                <FontAwesomeIcon
                  className="text-slate-400"
                  icon={ButtonListMateri ? faAngleUp : faAngleDown}
                />
                <h1 className="font-medium text-slate-800">Pengenalan HTML</h1>
                <FontAwesomeIcon
                  className="absolute right-0 text-slate-400"
                  icon={faLock}
                />
              </div>
              <div
                className={`pl-[22.5px] ml-[6.8px] border-l-[1.2px] border-slate-400 pr-4 flex flex-col gap-1 py-2 origin-top transition-transform duration-300 ease-in-out top-8 h-max
    ${ButtonListMateri ? "hidden" : "flex h-0"} transform-gpu`}
                style={{ transformOrigin: "top" }}
              >
                <h1>Pertemuan 1</h1>
                <h1>Pertemuan 2</h1>
                <h1>Pertemuan 3</h1>
                <h1>Pertemuan 4</h1>
                <h1>Pertemuan 5</h1>
              </div>
            </div>
            <div className="w-[100%] p-2 rounded-lg m-auto relative">
              <div
                onClick={handleToggleButtonListMateri}
                className="cursor-pointer flex gap-4 items-center relative"
              >
                <FontAwesomeIcon
                  className="text-slate-400"
                  icon={ButtonListMateri ? faAngleUp : faAngleDown}
                />
                <h1 className="font-medium text-slate-800">Pengenalan HTML</h1>
                <FontAwesomeIcon
                  className="absolute right-0 text-slate-400"
                  icon={faLock}
                />
              </div>
              <div
                className={`pl-[22.5px] ml-[6.8px] border-l-[1.2px] border-slate-400 pr-4 flex flex-col gap-1 py-2 origin-top transition-transform duration-0 ease-in-out top-8 h-max
    ${ButtonListMateri ? "scale-y-100" : "scale-y-0 h-0"} transform-gpu`}
                style={{ transformOrigin: "top" }}
              >
                <h1>Pertemuan 1</h1>
                <h1>Pertemuan 2</h1>
                <h1>Pertemuan 3</h1>
                <h1>Pertemuan 4</h1>
                <h1>Pertemuan 5</h1>
              </div>
            </div>
            <div className="w-[100%] p-2 rounded-lg m-auto relative">
              <div
                onClick={handleToggleButtonListMateri}
                className="cursor-pointer flex gap-4 items-center relative"
              >
                <FontAwesomeIcon
                  className="text-slate-400"
                  icon={ButtonListMateri ? faAngleUp : faAngleDown}
                />
                <h1 className="font-medium text-slate-800">Pengenalan HTML</h1>
                <FontAwesomeIcon
                  className="absolute right-0 text-slate-400"
                  icon={faLock}
                />
              </div>
              <div
                className={`pl-[22.5px] ml-[6.8px] border-l-[1.2px] border-slate-400 pr-4 flex flex-col gap-1 py-2 origin-top transition-transform duration-0 ease-in-out top-8 h-max
    ${ButtonListMateri ? "scale-y-100" : "scale-y-0 h-0"} transform-gpu`}
                style={{ transformOrigin: "top" }}
              >
                <h1>Pertemuan 1</h1>
                <h1>Pertemuan 2</h1>
                <h1>Pertemuan 3</h1>
                <h1>Pertemuan 4</h1>
                <h1>Pertemuan 5</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        onClick={handelOpenButtonMenuMateri}
        className={`rounded-tl-full rounded-bl-full bg-slate-800 text-slate-50 flex justify-center items-center fixed top-[101px] right-0
      transition-all duration-300 ease-in-out cursor-pointer ${
        ButtonMenuMateri
          ? "min-w-[50px] min-h-[50px]"
          : "min-w-[0px] min-h-[0px]"
      }`}
      >
        {ButtonMenuMateri && <FontAwesomeIcon icon={faAnglesRight} />}
      </div>
    </div>
  );
};

export default Materi;
