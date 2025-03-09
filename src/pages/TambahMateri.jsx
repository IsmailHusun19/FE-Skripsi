import { useState } from "react";
import Navbar from "../component/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faTrash,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import EditorConfig from "../component/EditorConfig";
import Footer from "../component/Footer";
import {
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileImage,
  FaFileVideo,
  FaFile,
  FaTrash,
  FaEye,
} from "react-icons/fa";
import { Report } from 'notiflix/build/notiflix-report-aio';
import { v4 as uuidv4 } from 'uuid';

const TambahMateri = () => {
  const [dataEditorView, setDataEditorView] = useState();
  const [subMateri, setSubMateri] = useState([
    { id: 1, type: "Materi", subMateri : '', isiMateri: '', fileMateri: '', kuisMateri : '', 
    questions: [], fileMateri: [] },
  ]);

  const [checkedSubMateri, setCheckedSubMateri] = useState([]);

  const handleTambahSubMateri = () => {
    setSubMateri([
      ...subMateri,
      { id: subMateri.length > 0 ? subMateri[subMateri.length - 1].id + 1 : 1, type: "Materi", subMateri : '', isiMateri: '', fileMateri: '', kuisMateri : '', 
    questions: [], fileMateri: [] }
    ]);
  };

  const handleHapusSubMateri = () => {
    const sisaSubMateri = subMateri.filter(
      (materi) => !checkedSubMateri.includes(materi.id)
    );
  
    setFiles((prevFiles) => {
      const updatedFiles = { ...prevFiles };
      checkedSubMateri.forEach((materiId) => {
        delete updatedFiles[materiId];
      });
      return updatedFiles;
    });
  
    setSubMateri(
      sisaSubMateri.length > 0
        ? sisaSubMateri
        : [{ id: 1, type: "Materi", subMateri : '', isiMateri: '', fileMateri: '', kuisMateri : '', 
        questions: [], fileMateri: [] }]
    );
    setCheckedSubMateri([]);
  };

  const handleCheckboxChange = (id) => {
    setCheckedSubMateri((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleTypeChange = (id, newType) => {
    setSubMateri(
      subMateri.map((materi) =>
        materi.id === id
          ? {
              ...materi,
              type: newType,
              questions: newType === "Kuis" ? [{ id: 1 }] : [],
            }
          : materi
      )
    );
  };

  const handleTambahSoal = (id) => {
    setSubMateri(
      subMateri.map((materi) =>
        materi.id === id
          ? {
              ...materi,
              questions: [
                ...materi.questions,
                { id: materi.questions.length + 1 },
              ],
            }
          : materi
      )
    );
  };

  const [files, setFiles] = useState({})

  // Fungsi menangani perubahan file
  const handleFileChange = (event, materiId) => {
    const newFiles = Array.from(event.target.files).map((file) => ({
      file,
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setFiles((prevFiles) => ({
      ...prevFiles,
      [materiId]: [...(prevFiles[materiId] || []), ...newFiles],
    }));
  };

  // Fungsi untuk menghapus file
  const handleDeleteFile = (materiId, fileIndex) => {
    setFiles((prevFiles) => ({
      ...prevFiles,
      [materiId]: prevFiles[materiId].filter((_, index) => index !== fileIndex),
    }));
  };

  // Fungsi mendapatkan ikon berdasarkan ekstensi file
  const getFileIcon = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();
    switch (ext) {
      case "pdf":
        return <FaFilePdf className="text-red-500 w-6 h-6" />;
      case "doc":
      case "docx":
        return <FaFileWord className="text-blue-500 w-6 h-6" />;
      case "xls":
      case "xlsx":
        return <FaFileExcel className="text-green-500 w-6 h-6" />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <FaFileImage className="text-yellow-500 w-6 h-6" />;
      case "mp4":
      case "avi":
      case "mkv":
        return <FaFileVideo className="text-purple-500 w-6 h-6" />;
      default:
        return <FaFile className="text-gray-500 w-6 h-6" />;
    }
  };

  const validasi = (isi) => {
    Report.failure(
      'Harap lengkapi data',
      isi,
      'Okay',
      {
        backOverlay: false,
        messageFontSize: '16px',
        cssAnimation: true,
        cssAnimationStyle: 'zoom',
        position: 'center-center',
      }
      );
  }

  const handleKirimMateri = () => {
    const removeHTMLTags = (htmlString) => {
      const doc = new DOMParser().parseFromString(htmlString, "text/html");
      return doc.body.textContent.trim();
    };
  
    const updatedSubMateri = subMateri.map((materi) => {
      const namaSubMateri = document.querySelector(
        `input[name="submateri-${materi.id}"]`
      )?.value || "";
  
      // Ambil isi materi jika tipe adalah "Materi"
      const isiMateri = materi.type === "Materi"
      ? removeHTMLTags(materi.isiMateri.length === 0 ? dataEditorView : materi.isiMateri)
      : "";
      console.log(isiMateri)
      const fileMateri = files[materi.id] ? files[materi.id].map((file) => file.name) : [];
  
      // Validasi Sub Materi
      if (!namaSubMateri) {
        validasi(`Nama submateri pada submateri ${materi.id} tidak boleh kosong`);
        return materi;
      }
  
      if (materi.type === "Materi" && !isiMateri) {
        validasi(`Isi materi pada Sub Materi ${materi.id} tidak boleh kosong`);
        return materi;
      }
  
      // Jika tipe materi adalah kuis, proses pertanyaan kuis
      let kuisMateri = [];
      if (materi.type === "Kuis" && Array.isArray(materi.questions)) {
        kuisMateri = materi.questions.map((question, index) => {
          const soal = document.querySelector(
            `textarea[name="soal-${materi.id}-${index}"]`
          )?.value || "";
  
          const file = document.querySelector(
            `input[name="file-${materi.id}-${index}"]`
          )?.files[0]?.name || "";
  
          const opsi = ["A", "B", "C", "D"].map((option) =>
            document.querySelector(
              `input[name="opsi-${materi.id}-${index}-${option}"]`
            )?.value || ""
          );
  
          const jawabanBenar = document.querySelector(
            `input[name="jawaban-${materi.id}-${index}"]`
          )?.value || "";
  
          if (!soal) {
            validasi(`Soal nomor ${index + 1} dalam kuis submateri ${materi.id} tidak boleh kosong`);
            return question;
          }
  
          if (opsi.some((o) => !o)) {
            validasi(`Opsi dalam soal nomor ${index + 1} pada kuis submateri ${materi.id} tidak boleh kosong`);
            return question;
          }
  
          if (!jawabanBenar) {
            validasi(`Jawaban benar pada soal nomor ${index + 1} dalam kuis submateri ${materi.id} tidak boleh kosong`);
            return question;
          }
  
          return { ...question, nomor: index + 1, soal, file, opsi, jawabanBenar };
        });
      }
  
      return {
        ...materi,
        subMateri: namaSubMateri,
        isiMateri,
        fileMateri,
        kuisMateri,
      };
    });
  
    setSubMateri(updatedSubMateri);
    console.log("Data yang telah diperbarui:", updatedSubMateri);
  };
  
  
  

  return (
    <div className="container-satu">
      <Navbar />
      <div className="pt-[75.7px] pb-12">
        {subMateri.map((materi, index) => (
          <div
            key={materi.id}
            className="w-[95%] mt-10 pb-11 m-auto bg-white rounded-lg p-5 shadow-xl"
          >
            <div className="flex justify-between">
              <h1 className="text-2xl font-bold">Pemrograman Web</h1>
              {subMateri.length > 1 && (
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={checkedSubMateri.includes(materi.id)}
                    onChange={() => handleCheckboxChange(materi.id)}
                  />
                  Pilih untuk dihapus
                </label>
              )}
            </div>
            <div>
              <form className="mt-10">
                <div className="flex gap-5 w-full flex-col lg:flex-row">
                  <label className="input input-bordered flex items-center gap-2 w-full">
                    Materi
                    <input
                      type="text"
                      className="grow"
                      placeholder=""
                      disabled
                      value="Pertemuan 1"
                    />
                  </label>
                  <label className="input input-bordered flex items-center gap-2 w-full">
                    <span className="min-w-[100px] flex">
                      Sub Materi {materi.id}
                    </span>
                    <input
                      type="text"
                      className="grow w-full"
                      value={materi.subMateri}
                      onChange={(e) => setSubMateri(subMateri.map(m => m.id === materi.id ? { ...m, subMateri: e.target.value } : m))}
                      name={`submateri-${materi.id}`}
                      placeholder={`Nama Sub Materi ${materi.id}`}
                    />
                  </label>
                </div>
                <div className="w-full mt-5">
                  <select
                    className="select select-primary focus:outline-none w-full"
                    value={materi.type}
                    onChange={(e) =>
                      handleTypeChange(materi.id, e.target.value)
                    }
                  >
                    <option value="Materi">Materi</option>
                    <option value="Kuis">Kuis</option>
                  </select>
                </div>
              </form>
            </div>
            <div className="mt-10">
              {materi.type === "Kuis" ? (
                <div>
                  {materi.questions.map((question, qIndex) => (
                    <div key={question.id}>
                      <div className="text-slate-400 text-base font-medium mt-8">
                        Nomor {qIndex + 1}
                      </div>
                      <label className="form-control">
                        <textarea
                          className="textarea textarea-bordered border border-primary-500 focus:border-primary-500 focus:outline-none mb-5 h-24"
                          placeholder="Soal"
                          name={`soal-${materi.id}-${qIndex}`}
                        ></textarea>
                      </label>
                      <input
                        type="file"
                        multiple
                        name={`file-${materi.id}-${qIndex}`}
                        className="file-input file-input-bordered w-full mb-5"
                      />
                      <form>
                        <div className="flex w-full gap-5 mb-5 flex-col lg:flex-row">
                          {["A", "B", "C", "D"].map((option) => (
                            <div className="flex w-full" key={option}>
                              <div className="bg-slate-700 w-8 text-center px-2 py-1 text-slate-100">
                                {option}
                              </div>
                              <input
                                name={`opsi-${materi.id}-${qIndex}-${option}`}
                                className="border border-primary-600 focus:outline-none px-2 py-1 cursor-pointer w-full text-slate-900"
                              />
                            </div>
                          ))}
                        </div>
                        <div className="flex w-full gap-5">
                          <div className="flex w-full">
                            <div className="bg-slate-700 min-w-[154px] px-2 text-center py-1 text-slate-100">
                              Jawaban Benar
                            </div>
                            <input
                              className="border border-primary-600 focus:outline-none px-2 py-1 cursor-pointer w-full text-slate-900 uppercase"
                              placeholder="A"
                              name={`jawaban-${materi.id}-${qIndex}`}
                            />
                          </div>
                        </div>
                      </form>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleTambahSoal(materi.id)}
                    className="mt-5 p-2 bg-blue-500 text-white rounded"
                  >
                    Tambah Soal
                  </button>
                </div>
              ) : null}
              {materi.type !== "Kuis" && (
                <>
                  <EditorConfig setDataEditorView={setDataEditorView} />
                  <div className="space-y-4">
                    <input
                      type="file"
                      multiple
                      className="file-input file-input-bordered w-full"
                      onChange={(e) => handleFileChange(e, materi.id)}
                    />
                    {files[materi.id] && files[materi.id].length > 0 && (
                      <div className="border p-4 rounded-md">
                        <h3 className="font-semibold mb-2">
                          File yang Dipilih:
                        </h3>
                        <ul className="list-disc list-inside space-y-2">
                          {files[materi.id].map((fileObj, index) => (
                            <li
                              key={index}
                              className="flex items-center justify-between space-x-2 p-2 border rounded-md"
                            >
                              <div className="flex items-center space-x-2">
                                {getFileIcon(fileObj.file.name)}
                                <span className="text-gray-700">
                                  {fileObj.file.name}
                                </span>
                                <a
                                  href={fileObj.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:text-blue-700"
                                >
                                  <FaEye />
                                </a>
                              </div>
                              <button
                            onClick={() => handleDeleteFile(materi.id, index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <FaTrash />
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
        <div className="flex items-end justify-end gap-2 md:gap-5 w-[95%] m-auto py-5">
          {subMateri.length > 1 && (
            <button
              type="button"
              onClick={handleHapusSubMateri}
              disabled={checkedSubMateri.length === 0}
              className="p-3 w-full md:w-52 bg-red-700 rounded-md flex justify-center gap-2 text-slate-200 font-medium hover:text-white disabled:bg-gray-400"
            >
              <FontAwesomeIcon className="text-2xl" icon={faTrash} /> Hapus
            </button>
          )}
          <button
            type="button"
            onClick={handleTambahSubMateri}
            className="p-3 w-full md:w-52 bg-blue-700 rounded-md flex justify-center gap-2 text-slate-200 font-medium hover:text-white"
          >
            <FontAwesomeIcon className="text-2xl" icon={faBook} /> Tambah
          </button>
          <button
            onClick={() => handleKirimMateri()}
            type="button"
            className="p-3 w-full md:w-52 bg-green-800 rounded-md flex justify-center gap-2 text-slate-200 font-medium hover:text-white"
          >
            <FontAwesomeIcon className="text-2xl" icon={faPaperPlane} /> Kirim
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TambahMateri;
