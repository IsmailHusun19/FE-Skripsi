import { useState, useEffect } from "react";
import Navbar from "../component/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesRight,
  faAngleDown,
  faLock,
  faAngleUp,
  faUsers,
  faBook,
  faTrash,
  faCopy,
  faEye,
  faPen,
  faFolderOpen,
} from "@fortawesome/free-solid-svg-icons";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import { failure } from "notiflix/build/notiflix-report-aio";
import Footer from "../component/Footer";
const MengelolaMateri = () => {
  const textToCopy = `Nama dosen      : Ismail 
Code mata kuliah: wetwdshdfshjas`;

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy).then(
      () => {
        Notify.success("Berhasil copy code mata kuliah");
      },
      (err) => {
        Notify.failure("Gagal copy code mata kuliah", err);
      }
    );
  };

  const data = {
    namaMateri: ["Pertemuan 1"],
    subMateri: ["2", "3", "4"],
    link: ["1", "2", "3"],
  };

  return (
    <div className="container-satu">
      <Navbar />
      <div className="pt-[75.7px]">
        <div className="min-h-screen py-10 w-[95%] my-10 m-auto bg-white rounded-lg p-5 shadow-xl">
          <div className="flex justify-between items-center flex-col lg:flex-row">
            <div
              className="tooltip tooltip-bottom cursor-pointer"
              data-tip="Pemograman webghhh"
            >
              <h1 className="text-2xl font-bold">
                {"Pemograman webghhh".length > 14
                  ? "Pemograman webhhh".substring(0, 14) + "..."
                  : "Pemograman webhhh"}
              </h1>
            </div>
            <div
              className="tooltip tooltip-bottom cursor-pointer"
              data-tip="Materi"
            >
              <button
                type="button"
                className="p-3 bg-blue-700 rounded-md flex justify-center gap-2 text-slate-200 font-medium hover:text-white"
              >
                <FontAwesomeIcon className="text-2xl" icon={faBook} /> Tambah
                Materi
              </button>
            </div>
          </div>
          <div className="tooltip tooltip-right cursor-pointer" data-tip="Copy">
            <h1
              onClick={handleCopy}
              className="text-lg font-medium flex gap-2 cursor-pointer items-center"
            >
              Code Mata Kuliah
              <FontAwesomeIcon
                className="text-xl text-blue-700"
                icon={faCopy}
              />
            </h1>
          </div>
          <div className="mt-10">
            <div className="overflow-x-auto">
              <table className="table">
                {/* head */}
                <thead>
                  <tr>
                    <th>No</th>
                    <th className="w-[60%] min-w-[125px]">Nama Materi</th>
                    <th className="w-[20%]">Sub Materi</th>
                    <th className="w-[20%]">Opsi</th>
                  </tr>
                </thead>
                <tbody>
                  {data.namaMateri.length > 0 ? (
                    data.namaMateri.map((materi, index) => (
                      <tr className="hover" key={index}>
                        <th>{index + 1}</th>
                        <td className="min-w-[125px]">{materi}</td>
                        <td>{data.subMateri[index]}</td>
                        <td>
                          <div className="flex gap-5">
                            <FontAwesomeIcon
                              className="text-base bg-green-500 py-2 px-3 rounded-md cursor-pointer hover:text-white"
                              icon={faEye}
                            />
                            <FontAwesomeIcon
                              className="text-base bg-yellow-500 py-2 px-3 rounded-md cursor-pointer hover:text-white"
                              icon={faPen}
                            />
                            <FontAwesomeIcon
                              className="text-base bg-red-500 py-2 px-3 rounded-md cursor-pointer hover:text-white"
                              icon={faTrash}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-2 text-center">
                        <div className="w-full flex flex-col">
                          {" "}
                          <FontAwesomeIcon
                            className="text-5xl py-2 px-3 rounded-md"
                            icon={faFolderOpen}
                          />{" "}
                          <span>Materi Masih Kosong</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MengelolaMateri;
