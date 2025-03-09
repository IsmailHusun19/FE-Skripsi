import { useEffect, useState, useRef } from "react";
import Navbar from "../component/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
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
  FaPlus,
} from "react-icons/fa";
import { Report } from "notiflix/build/notiflix-report-aio";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import { EditingView } from "ckeditor5";

const TambahMateri = () => {
  const navigate = useNavigate();
  const [dataSubMateri, setDataSubMateri] = useState();
  const { id, idSubMateri } = useParams();
  const [dataEditorView, setDataEditorView] = useState();
  const inputRef = useRef(null);
  const [files, setFiles] = useState({});
  const [subMateri, setSubMateri] = useState([
    {
      id: 1,
      type: "materi",
      subMateri: "",
      isiMateri: dataEditorView,
      fileMateri: [],
      kuisMateri: [
        {
          id: 1,
          soal: "",
          options: {
            A: "",
            B: "",
            C: "",
            D: "",
          },
          jawabanBenar: "",
          fileKuis: [],
        },
      ],
    },
  ]);
  const [Datamateri, setDataMateri] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [dataGambarSubMateri, setDataGambarSubMateri] = useState("");

  const handleMateri = async () => {
    try {
      const response = await axios.get("http://localhost:3000/materi/1", {
        withCredentials: true,
      });
      setDataMateri(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSubMateri = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/sub-materi/detail/${idSubMateri}`,
        { withCredentials: true }
      );
  
      const dataId = parseInt(idSubMateri);
      if (dataId === response.data.id) {
        // Konversi fileMateri dari URL ke Blob
        const oldFiles = await Promise.all(
          response.data.fileMateri.map(async (file) => {
            try {
              const res = await fetch(file.url);
              if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
  
              const blob = await res.blob(); // Ambil blob dari file URL
  
              // Ambil nama file asli dari URL (tanpa mengganti dengan ID)
              const originalFileName = file.url.split("/").pop();
  
              return {
                id: file.id,
                name: originalFileName, // Gunakan nama asli file
                url: URL.createObjectURL(blob), // Buat URL Blob agar bisa diakses
                file: new File([blob], originalFileName, { type: blob.type }), // Simpan dengan nama asli
                isUploaded: true,
              };
            } catch (error) {
              console.error("Error fetching file:", file.url, error);
              return null;
            }
          })
        );
  
        // Hanya ambil file yang berhasil di-fetch
        const validFiles = oldFiles.filter((file) => file !== null);
  
        setSubMateri([
          {
            id: response.data.id,
            type: response.data.type,
            subMateri: response.data.judul,
            isiMateri: response.data.isi,
            fileMateri: validFiles.map((f) => f.file), // Simpan dalam format binary
            kuisMateri: response.data.pertanyaan.map((soal, index) => ({
              id: index + 1,
              soal: soal,
              options: response.data.pilihan[index] || {},
              jawabanBenar: response.data.jawabanBenar[index] || "",
              fileKuis: response.data.fileKuis ? response.data.fileKuis[index] : [],
            })),
          },
        ]);
  
        // Perbarui files di state
        setFiles((prevFiles) => ({
          ...prevFiles,
          [response.data.id]: validFiles,
        }));
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching sub materi:", error);
      return error;
    }
  };
  
  

  useEffect(() => {
    handleMateri();
    if (idSubMateri) {
      handleSubMateri();
    }
  }, []);

  useEffect(() => {
    console.log("Updated subMateri:", subMateri);
  }, [subMateri]);

  useEffect(() => {
    const selectedMateri = Object.values(Datamateri).find(
      (dataMateri) => dataMateri.id == id
    );
    if (selectedMateri) {
      setSelectedValue(selectedMateri.id);
    }
  }, [Datamateri, id]);

  const handleTypeChange = (id, newType) => {
    setSubMateri(
      subMateri.map((materi) =>
        materi.id === id
          ? {
              ...materi,
              type: newType,
              subMateri: "",
              isiMateri: "",
              fileMateri: [],
              kuisMateri: [
                {
                  id: 1,
                  soal: "",
                  options: {
                    A: "",
                    B: "",
                    C: "",
                    D: "",
                  },
                  jawabanBenar: "",
                  fileKuis: [],
                },
              ],
            }
          : materi
      )
    );
    setFiles({});
  };

  const handleTambahSoal = (id) => {
    setSubMateri(
      subMateri.map((materi) =>
        materi.id === id
          ? {
              ...materi,
              kuisMateri: [
                ...materi.kuisMateri,
                {
                  id: materi.kuisMateri.length + 1,
                  soal: "",
                  options: {
                    A: "",
                    B: "",
                    C: "",
                    D: "",
                  },
                  jawabanBenar: "",
                  fileKuis: [],
                },
              ],
            }
          : materi
      )
    );
  };

  const handleHapusSoal = (materiId, questionId) => {
    setSubMateri((prevSubMateri) =>
      prevSubMateri.map((materi) =>
        materi.id === materiId
          ? {
              ...materi,
              kuisMateri: materi.kuisMateri.filter(
                (question) => question.id !== questionId
              ),
            }
          : materi
      )
    );
  };

  const handleFileChange = (event, materiId) => {
    const newFiles = Array.from(event.target.files).map((file) => ({
      file,
      name: file.name,
      url: URL.createObjectURL(file),
      isUploaded: false,
    }));

    setFiles((prevFiles) => ({
      ...prevFiles,
      [materiId]: [...(prevFiles[materiId] || []), ...newFiles],
    }));

    setSubMateri((prevSubMateri) =>
      prevSubMateri.map((materi) =>
        materi.id === materiId
          ? {
              ...materi,
              fileMateri: [
                ...(materi.fileMateri || []),
                ...newFiles.map((f) => f.file),
              ],
            }
          : materi
      )
    );
  };

  const handleDeleteFile = (materiId, fileIndex, inputRef, fileObj) => {
    setFiles((prevFiles) => {
      if (!prevFiles[materiId]) return prevFiles;

      const updatedFiles = prevFiles[materiId].filter(
        (_, index) => index !== fileIndex
      );

      if (inputRef?.current) {
        if (updatedFiles.length === 0) {
          inputRef.current.value = "";
        } else {
          const dataTransfer = new DataTransfer();
          updatedFiles.forEach((file) => {
            if (!file.isUploaded) {
              dataTransfer.items.add(file.file);
            }
          });
          inputRef.current.files = dataTransfer.files;
        }
      }

      return { ...prevFiles, [materiId]: updatedFiles };
    });

    setSubMateri((prevSubMateri) =>
      prevSubMateri.map((materi) =>
        materi.id === materiId
          ? {
              ...materi,
              fileMateri: (materi.fileMateri || []).filter(
                (_, index) => index !== fileIndex
              ),
            }
          : materi
      )
    );

    // Hapus dari database jika file berasal dari backend
    if (fileObj.isUploaded) {
      fetch(`http://localhost:3000/sub-materi/deleteFile/${fileObj.id}`, {
        credentials: "include",
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => console.log("File deleted:", data))
        .catch((error) => console.error("Error deleting file:", error));
    }
  };

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
    Report.failure("Harap lengkapi data", isi, "Okay", {
      backOverlay: false,
      messageFontSize: "16px",
      cssAnimation: true,
      cssAnimationStyle: "zoom",
      position: "center-center",
    });
  };

  const handleChange = (materiId, field, value, questionId = null) => {
    setSubMateri((prevSubMateri) =>
      prevSubMateri.map((materi) =>
        materi.id === materiId
          ? {
              ...materi,
              ...(questionId === null
                ? { [field]: value }
                : {
                    kuisMateri: materi.kuisMateri.map((question) =>
                      question.id === questionId
                        ? {
                            ...question,
                            ...(field.startsWith("options.")
                              ? {
                                  options: {
                                    ...question.options,
                                    [field.split(".")[1]]: value,
                                  },
                                }
                              : { [field]: value }),
                          }
                        : question
                    ),
                  }),
            }
          : materi
      )
    );
  };

  const handleGambarKuis = (e, materiId, questionId) => {
    const file = e.target.files[0];
    if (!file) return;

    setSubMateri((prevSubMateri) =>
    prevSubMateri.map((materi) =>
      materi.id === materiId
        ? {
            ...materi,
            kuisMateri: materi.kuisMateri.map((question) =>
              question.id === questionId
                ? {
                    ...question,
                    fileKuis: [
                      ...(question.fileKuis || []),
                      {
                        file,
                        name: file.name,
                        url: URL.createObjectURL(file),
                      },
                    ],
                  }
                : question
            ),
          }
        : materi
    )
  );
  console.log(subMateri)
  
  
  };

  const handleHapusGambarKuis = (materiId, questionId, idGambar) => {
    setSubMateri((prevSubMateri) =>
      prevSubMateri.map((materi) =>
        materi.id === materiId
          ? {
              ...materi,
              fileMateri: [],
              kuisMateri: materi.kuisMateri.map((question) =>
                question.id === questionId
                  ? {
                      ...question,
                      fileKuis: [],
                    }
                  : question
              ),
            }
          : materi
      )
    );
    fetch(`http://localhost:3000/sub-materi/deleteFile/${idGambar}`, {
      credentials: "include",
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => console.log("File deleted:", data))
      .catch((error) => console.error("Error deleting file:", error));
    console.log(materiId, questionId)
  };
  

  const sendSubMateri = async (formData) => {
    let metode = idSubMateri ? "put" : "post";
    let url = idSubMateri
      ? `http://localhost:3000/sub-materi/${idSubMateri}`
      : "http://localhost:3000/sub-materi";
    try {
      const response = await axios[metode](url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      handleIdSubMateri(response.data.id);
      console.log("Sub-materi berhasil dikirim:", response.data);
      const observer = new MutationObserver(() => {
        const confirmButton = document.getElementById("NXReportButton");
        if (confirmButton) {
          confirmButton.addEventListener("click", () => {
            navigate("/mengelolamateri");
            observer.disconnect(); // Hentikan observer setelah tombol diklik
          });
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });
      Report.success(
        "Success",
        metode === "post"
          ? "Berhasil Menambah Sub Materi"
          : "Berhasil Mengedit Sub Materi",
        "Okay",
        {
          backOverlay: false,
          messageFontSize: "16px",
          cssAnimation: true,
          cssAnimationStyle: "zoom",
          position: "center-center",
        }
      );
      return response.data;
    } catch (error) {
      console.log(response.data);
      console.error(
        "Terjadi kesalahan saat mengirim sub-materi:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  useEffect(() => {}, [dataEditorView]);
  console.log(dataEditorView);

  const createSubMateri = async (subMateri) => {
    const formData = new FormData();

    subMateri.forEach((materi) => {
      formData.append("judul", materi.subMateri);
      formData.append("type", materi.type.toLowerCase());
      formData.append("materiId", selectedValue);

      if (materi.type.toLowerCase() === "materi") {
        formData.append("isi", dataEditorView);
        if (materi.fileMateri.length > 0) {
          for (let i = 0; i < materi.fileMateri.length; i++) {
            formData.append("files", materi.fileMateri[i]);
          }
        }
      } else if (materi.type.toLowerCase() === "kuis") {
        const pertanyaanArray = [];
        const jawabanBenarArray = [];
        const pilihanArray = [];

        materi.kuisMateri.forEach((soal) => {
          pertanyaanArray.push(soal.soal);
          jawabanBenarArray.push(soal.jawabanBenar);
          pilihanArray.push(soal.options);
          if (soal.fileKuis && Array.isArray(soal.fileKuis)) {
            soal.fileKuis.forEach((fileObj) => {
              if (fileObj.file) {
                formData.append("files", fileObj.file);
              }
            });
          }
        });
        formData.append("pertanyaan", JSON.stringify(pertanyaanArray));
        formData.append("jawabanBenar", JSON.stringify(jawabanBenarArray));
        formData.append("pilihan", JSON.stringify(pilihanArray));
      }
    });
    console.log("Isi FormData:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    return sendSubMateri(formData);
  };

  const handleKirimMateri = () => {
    let isValid = false;
    const removeHTMLTags = (htmlString) => {
      const doc = new DOMParser().parseFromString(htmlString, "text/html");
      return doc.body.textContent.trim();
    };

    if (selectedValue !== "") {
      console.log(subMateri[0].type);
      if (subMateri[0].type === "materi") {
        if (
          typeof subMateri[0].subMateri === "string" &&
          subMateri[0].subMateri.trim() !== ""
        ) {
          if (
            typeof removeHTMLTags(dataEditorView) === "string" &&
            removeHTMLTags(dataEditorView).trim() !== ""
          ) {
            createSubMateri(subMateri);
          } else {
            console.log(dataEditorView);
            validasi("Materi tidak boleh kosong");
          }
        } else {
          validasi("nama sub materi tidak boleh kosong");
        }
      } else {
        subMateri.map((materi) => {
          materi.kuisMateri.forEach((soal, index) => {
            if (typeof soal.soal === "string" && soal.soal.trim() !== "") {
              Object.entries(soal.options).forEach(([key, value]) => {
                if (value !== "") {
                  if (
                    typeof soal.jawabanBenar === "string" &&
                    soal.jawabanBenar.trim() !== ""
                  )
                    isValid = true;
                  else {
                    validasi(
                      `Jawaban Benar nomor ${index + 1} tidak boleh kosong`
                    );
                  }
                } else {
                  validasi(
                    `Opsi ${key} pada nomor ${index + 1} tidak boleh kosong`
                  );
                }
              });
            } else {
              validasi(`Soal nomor ${index + 1} tidak boleh kosong`);
            }
          });
        });
        if (isValid) {
          createSubMateri(subMateri);
        }
      }
    } else {
      validasi(`Pilih materi terlebih dahulu`);
    }
  };

  const handleIdSubMateri = async (id) => {
    const dataId = id;
    setDataGambarSubMateri(dataId);
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
            </div>
            <div>
              <form className="mt-10">
                <div className="flex gap-5 w-full flex-col lg:flex-row">
                  <select
                    className="select select-primary focus:outline-none w-full"
                    value={selectedValue}
                    disabled={Object.values(Datamateri).some(
                      (items) => items.id == id
                    )}
                    onChange={(e) => setSelectedValue(e.target.value)}
                  >
                    <option value="" disabled>
                      Pilih Materi
                    </option>
                    {Object.values(Datamateri).map((dataMateri, index) => (
                      <option key={index} value={dataMateri.id}>
                        {dataMateri.judul}
                      </option>
                    ))}
                  </select>

                  <label className="input input-bordered flex items-center gap-2 w-full">
                    <span className="min-w-[100px] flex">Sub Materi</span>
                    <input
                      type="text"
                      className="grow w-full"
                      value={materi.subMateri}
                      onChange={(e) =>
                        handleChange(materi.id, "subMateri", e.target.value)
                      }
                      placeholder={`Nama Sub Materi`}
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
                    <option value="materi">Materi</option>
                    <option value="kuis">Kuis</option>
                  </select>
                </div>
              </form>
            </div>
            <div className="mt-10">
              {materi.type === "kuis" ? (
                <div>
                  {materi.kuisMateri.map((question, qIndex) => (
                    <div key={question.id}>
                      <div className="text-slate-400 text-base font-medium mt-8 flex justify-between items-center m-2">
                        {question.id > 1 ? (
                          <button
                            type="button"
                            onClick={() =>
                              handleHapusSoal(materi.id, question.id)
                            }
                            className="p-2 bg-blue-500 text-white rounded order-2"
                          >
                            <FaTrash />
                          </button>
                        ) : null}
                        <span className="order-1">Nomor {qIndex + 1}</span>
                      </div>
                      <label className="form-control">
                        <textarea
                          className="textarea textarea-bordered border border-primary-500 focus:border-primary-500 focus:outline-none mb-5 h-24"
                          placeholder="Soal"
                          value={question.soal}
                          onChange={(e) =>
                            handleChange(
                              materi.id,
                              "soal",
                              e.target.value,
                              question.id
                            )
                          }
                        ></textarea>
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleGambarKuis(e, materi.id, question.id)
                        }
                        className="file-input file-input-bordered w-full mb-5"
                      />
{question?.fileKuis?.url ? materi.fileMateri && materi.fileMateri.length > 0 && (
  <div className="border p-4 rounded-md mb-5">
    <h3 className="font-semibold mb-2">
      File yang Dipilih:
    </h3>
    <div className="flex items-center justify-between p-2 border rounded-md">
      <div className="flex items-center space-x-2">
        <img
          src={"http://localhost:3000" + question.fileKuis.url}
          alt="Preview"
          className="w-16 h-16 object-cover rounded-md"
        />
        <span className="text-gray-700">
          {question.fileKuis.name}
        </span>
        <a
          href={"http://localhost:3000" + question.fileKuis.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700"
        >
          <FaEye />
        </a>
      </div>
      <button className="text-red-500 hover:text-red-700" onClick={() => handleHapusGambarKuis(materi.id, question.id, question.fileKuis.id)}>
        <FaTrash />
      </button>
    </div>
  </div>
) : null}

                      <form>
                        <div className="flex w-full gap-5 mb-5 flex-col lg:flex-row">
                          {["A", "B", "C", "D"].map((option) => (
                            <div className="flex w-full" key={option}>
                              <div className="bg-slate-700 w-8 text-center px-2 py-1 text-slate-100">
                                {option}
                              </div>
                              <input
                                value={
                                  materi.kuisMateri[qIndex].options[option] ||
                                  ""
                                }
                                onChange={(e) =>
                                  handleChange(
                                    materi.id,
                                    `options.${option}`,
                                    e.target.value,
                                    materi.kuisMateri[qIndex].id
                                  )
                                }
                                placeholder={`Jawaban ${option}`}
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
                              value={question.jawabanBenar}
                              onChange={(e) =>
                                handleChange(
                                  materi.id,
                                  "jawabanBenar",
                                  e.target.value,
                                  question.id
                                )
                              }
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
              {materi.type !== "kuis" && (
                <>
                  <EditorConfig
                    setDataEditorView={setDataEditorView}
                    dataEditor={subMateri[0].isiMateri}
                    dataIdSubMateri={dataGambarSubMateri}
                  />
                  <div className="space-y-4">
                    <input
                      type="file"
                      ref={inputRef}
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
                                {getFileIcon(fileObj.name)}
                                <span className="text-gray-700">
                                  {fileObj.name}
                                </span>
                                <a
                                  href={
                                    fileObj.isUploaded
                                      ? fileObj.url
                                      : fileObj.url
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:text-blue-700"
                                >
                                  <FaEye />
                                </a>
                              </div>
                              <button
                                onClick={() =>
                                  handleDeleteFile(
                                    materi.id,
                                    index,
                                    inputRef,
                                    fileObj
                                  )
                                }
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
