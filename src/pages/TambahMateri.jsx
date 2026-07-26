import { useEffect, useState, useRef } from "react";
import Navbar from "../component/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import EditorConfig from "../component/EditorConfig";
import {
  getMataKuliah,
} from "../config/FetchingData";
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
import { Report } from "notiflix/build/notiflix-report-aio";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/config";


const TambahMateri = () => {
  const navigate = useNavigate();
  const [dataSubMateri, setDataSubMateri] = useState();
  const { idMataKuliah, idMateri, idSubMateri } = useParams();
  const [dataEditorView, setDataEditorView] = useState();
  const [idSoal, setIdSoal] = useState([]);
  const inputRef = useRef(null);
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [subMateri, setSubMateri] = useState([
    {
      id: 1,
      type: "materi",
      subMateri: "",
      isiMateri: dataEditorView,
      fileMateri: [],
      syaratKelulusan: "",
      durasiMengerjakan: "",
      durasiUlang: "",
      kuisMateri: [
        {
          id: 1,
          soal: {},
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
  const [dataMataKuliah, setDataMataKuliah] = useState([]);

  const getDataMatkul = async () => {
    setLoading(true);
    try {
      const getDataMataKuliah = await getMataKuliah(idMataKuliah);
      setDataMataKuliah(getDataMataKuliah);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDataMatkul();
  }, [idMataKuliah]);


  const handleMateri = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/materi/${idMataKuliah}`,
        {
          withCredentials: true,
        }
      );
      setDataMateri(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubMateri = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/sub-materi/detail/${idSubMateri}`,
        { withCredentials: true }
      );

      const dataId = parseInt(idSubMateri);
      if (dataId === response.data.id) {
        const oldFiles = response.data.fileMateri.map((file) => ({
          id: file.id,
          name: file.url.split("/").pop(),
          url: file.url,
          idSoal: file.idSoal,
          isUploaded: true,
        }));

        setSubMateri([
          {
            id: response.data.id,
            type: response.data.type,
            subMateri: response.data.judul,
            isiMateri: response.data.isi,
            fileMateri: oldFiles,
            syaratKelulusan: response.data.syaratKelulusan,
            durasiMengerjakan: response.data.durasiMengerjakan,
            durasiUlang: response.data.durasiUlang,
            kuisMateri: response.data.pertanyaan.map((soal, index) => ({
              id: index + 1,
              soal: soal,
              options: response.data.pilihan[index] || {},
              jawabanBenar: response.data.jawabanBenar[index] || "",
              fileKuis: oldFiles[index] || [],
            })),
          },
        ]);

        // Perbarui files di state
        setFiles(oldFiles);
        setDataEditorView(response.data.isi);
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching sub materi:", error);
      return error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleMateri();
    if (idSubMateri) {
      handleSubMateri();
    }
  }, []);

  useEffect(() => {
    const selectedMateri = Object.values(Datamateri).find(
      (dataMateri) => dataMateri.id == idMateri
    );
    if (selectedMateri) {
      setSelectedValue(selectedMateri.id);
    }
  }, [Datamateri, idMateri]);

  const handleTypeChange = (id, newType) => {
    setSubMateri(
      subMateri.map((materi) =>
        materi.id === id
          ? {
              ...materi,
              type: newType,
            }
          : materi
      )
    );
    setFiles({});
  };

  const handleChangePeraturan = (id, typePeraturan, peraturanBaru) => {
    setSubMateri(
      subMateri.map((materi) =>
        materi.id === id
          ? {
              ...materi,
              [typePeraturan]: parseInt(peraturanBaru),
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
              kuisMateri: [
                ...materi.kuisMateri,
                {
                  id: materi.kuisMateri.length + 1,
                  soal: {},
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
      isUploaded: false, // Ini file baru
    }));

    setFiles((prevFiles) => {
      const existingFiles = prevFiles[materiId] || [];

      // Hindari duplikasi berdasarkan nama file
      const updatedFiles = [...existingFiles, ...newFiles].reduce(
        (acc, file) => {
          if (!acc.some((f) => f.name === file.name)) {
            acc.push(file);
          }
          return acc;
        },
        []
      );

      return {
        ...prevFiles,
        [materiId]: updatedFiles,
      };
    });

    setSubMateri((prevSubMateri) =>
      prevSubMateri.map((materi) =>
        materi.id === materiId
          ? {
              ...materi,
              fileMateri: [
                ...(materi.fileMateri || []).filter(
                  (f) => !newFiles.some((nf) => nf.name === f.name) // Hindari duplikasi
                ),
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

    if (fileObj.isUploaded) {
      fetch(`${BASE_URL}/sub-materi/deleteFile/${fileObj.id}`, {
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

  const handleChange = (materiId, field, value, questionId = null, qIndex) => {
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
                            ...(field === "soal"
                              ? { soal: { id: qIndex, soal: value } }
                              : field.startsWith("options.")
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

  const handleGambarKuis = (e, materiId, questionId, qIndex) => {
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
                        {
                          file,
                          name: file.name,
                          url: URL.createObjectURL(file),
                          idSoal: questionId,
                        },
                      ],
                    }
                  : question
              ),
            }
          : materi
      )
    );

    setIdSoal((prevIdSoal) =>
      prevIdSoal.includes(qIndex) ? prevIdSoal : [...prevIdSoal, qIndex]
    );
  };

  const handleHapusGambarKuis = (materiId, questionId, idGambar, qIndex) => {
    setSubMateri((prevSubMateri) =>
      prevSubMateri.map((materi) =>
        materi.id === materiId
          ? {
              ...materi,
              kuisMateri: materi.kuisMateri.map((question) =>
                question.id === questionId
                  ? {
                      ...question,
                      fileKuis: Array.isArray(question.fileKuis)
                        ? question.fileKuis.map((file) =>
                            file && file.id === idGambar ? [] : file
                          )
                        : [],
                    }
                  : question
              ),
            }
          : materi
      )
    );
    setIdSoal((prevIdSoal) => prevIdSoal.filter((id) => id !== qIndex));

    fetch(`${BASE_URL}/sub-materi/deleteFile/${idGambar}`, {
      credentials: "include",
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => console.log("File deleted:", data))
      .catch((error) => console.error("Error deleting file:", error));
  };

  const sendSubMateri = async (formData) => {
    let metode = idSubMateri ? "put" : "post";
    let url = idSubMateri
      ? `${BASE_URL}/sub-materi/${idSubMateri}`
      : `${BASE_URL}/sub-materi`;
    url =
      subMateri[0].type === "kuis" ? `${url}?idSoal=${idSoal.join(",")}` : url;
    try {
      const response = await axios[metode](url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      handleIdSubMateri(response.data.id);
      const observer = new MutationObserver(() => {
        const confirmButton = document.getElementById("NXReportButton");
        if (confirmButton) {
          confirmButton.addEventListener("click", () => {
            navigate(`/mengelolamateri/${idMataKuliah}`);
            observer.disconnect();
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
      console.error(
        "Terjadi kesalahan saat mengirim sub-materi:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  const createSubMateri = async (subMateri) => {
    const formData = new FormData();

    subMateri.forEach((materi) => {
      formData.append("judul", materi.subMateri);
      formData.append("type", materi.type.toLowerCase());
      formData.append("materiId", selectedValue);

      if (materi.type.toLowerCase() === "materi") {
        formData.append("isi", dataEditorView || materi.isiMateri);
        if (materi.fileMateri.length > 0) {
          for (let i = 0; i < materi.fileMateri.length; i++) {
            formData.append("files", materi.fileMateri[i]);
          }
        }
      } else if (materi.type.toLowerCase() === "kuis") {
        formData.append("syaratKelulusan", materi.syaratKelulusan);
        formData.append("durasiMengerjakan", materi.durasiMengerjakan);
        formData.append("durasiUlang", materi.durasiUlang);
        const pertanyaanArray = [];
        const jawabanBenarArray = [];
        const pilihanArray = [];

        materi.kuisMateri.forEach((soal, index) => {
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
    return sendSubMateri(formData);
  };

  const handleKirimMateri = () => {
    const removeHTMLTags = (htmlString) => {
      const doc = new DOMParser().parseFromString(htmlString, "text/html");
      return doc.body.textContent.trim();
    };

    if (selectedValue !== "") {
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
            validasi("Materi tidak boleh kosong");
          }
        } else {
          validasi("nama sub materi tidak boleh kosong");
        }
      } else {
        if (
          typeof subMateri[0].subMateri === "string" &&
          subMateri[0].subMateri.trim() !== ""
        ) {
          let isValid = subMateri.some((materi) =>
            materi.kuisMateri.some((soal, index) => {
              if (
                typeof soal.soal.soal !== "string" ||
                soal.soal.soal.trim() === ""
              ) {
                validasi(`Soal nomor ${index + 1} tidak boleh kosong`);
                return false;
              }
              const allOptionsFilled = Object.entries(soal.options).every(
                ([key, value]) => {
                  if (value === "") {
                    validasi(
                      `Opsi ${key} pada nomor ${index + 1} tidak boleh kosong`
                    );
                    return false;
                  }
                  return true;
                }
              );

              if (!allOptionsFilled) return false;
              if (
                typeof soal.jawabanBenar !== "string" ||
                soal.jawabanBenar.trim() === ""
              ) {
                validasi(`Jawaban Benar nomor ${index + 1} tidak boleh kosong`);
                return false;
              }

              return true;
            })
          );

          if (isValid) {
            createSubMateri(subMateri);
          }
        } else {
          validasi("nama sub materi tidak boleh kosong");
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
      {!loading ? (
        <>
          <Navbar />
          <div className="pt-[75.7px] pb-12">
            {subMateri.map((materi, index) => (
              <div
                key={materi.id}
                className="w-[95%] mt-10 pb-11 m-auto bg-white rounded-lg p-5 shadow-xl"
              >
                <div className="flex justify-between">
                  <h1 className="text-2xl font-bold">{dataMataKuliah.nama}</h1>
                </div>
                <div>
                  <form className="mt-10">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full mt-5">
                      <select
                        className="select select-primary focus:outline-none w-full"
                        value={selectedValue}
                        disabled
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
                    {materi.type == "kuis" ? (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full mt-5">
                        <select
                          className="select select-primary focus:outline-none w-full"
                          value={materi.syaratKelulusan}
                          onChange={(e) =>
                            handleChangePeraturan(
                              materi.id,
                              "syaratKelulusan",
                              e.target.value
                            )
                          }
                        >
                          <option value="">Syarat Kelulusan</option>
                          <option value={70}>Skor 70</option>
                          <option value={80}>Skor 80</option>
                          <option value={90}>Skor 90</option>
                          <option value={100}>Skor 100</option>
                        </select>
                        <select
                          className="select select-primary focus:outline-none w-full"
                          value={materi.durasiMengerjakan}
                          onChange={(e) =>
                            handleChangePeraturan(
                              materi.id,
                              "durasiMengerjakan",
                              e.target.value
                            )
                          }
                        >
                          <option value="">Durasi Mengerjakan</option>
                          <option value={10}>10 Menit</option>
                          <option value={30}>30 Menit</option>
                          <option value={60}>60 Menit</option>
                          <option value={120}>120 Menit</option>
                        </select>
                        <select
                          className="select select-primary focus:outline-none w-full"
                          value={materi.durasiUlang}
                          onChange={(e) =>
                            handleChangePeraturan(
                              materi.id,
                              "durasiUlang",
                              e.target.value
                            )
                          }
                        >
                          <option value="">Durasi Ulang</option>
                          <option value={10}>10 Menit</option>
                          <option value={30}>30 Menit</option>
                          <option value={60}>60 Menit</option>
                        </select>
                      </div>
                    ) : null}
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
                              value={question.soal?.soal || ""}
                              onChange={(e) =>
                                handleChange(
                                  materi.id,
                                  "soal",
                                  e.target.value,
                                  question.id,
                                  qIndex
                                )
                              }
                            ></textarea>
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleGambarKuis(
                                e,
                                materi.id,
                                question.id,
                                qIndex
                              )
                            }
                            className="file-input file-input-bordered w-full mb-5"
                          />
                          {materi.fileMateri
                            .filter((file) => file.idSoal == question.soal.id)
                            .map((file, index) => (
                              <div
                                key={index}
                                className="border p-4 rounded-md mb-5"
                              >
                                <h3 className="font-semibold mb-2">
                                  File yang Dipilih:
                                </h3>
                                <div className="flex items-center justify-between p-2 border rounded-md">
                                  <div className="flex items-center space-x-2">
                                    <img
                                      src={`${BASE_URL}` + file.url}
                                      alt="Preview"
                                      className="w-16 h-16 object-cover rounded-md"
                                    />
                                    <span className="text-gray-700">
                                      {file.name}
                                    </span>
                                    <a
                                      href={`${BASE_URL}` + file.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-500 hover:text-blue-700"
                                    >
                                      <FaEye />
                                    </a>
                                  </div>
                                  <button
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() =>
                                      handleHapusGambarKuis(
                                        materi.id,
                                        file.idSoal,
                                        file.id,
                                        qIndex
                                      )
                                    }
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              </div>
                            ))}
                          <form>
                            <div className="flex w-full gap-5 mb-5 flex-col lg:flex-row">
                              {["A", "B", "C", "D"].map((option) => (
                                <div className="flex w-full" key={option}>
                                  <div className="bg-slate-700 w-8 text-center px-2 py-1 text-slate-100">
                                    {option}
                                  </div>
                                  <input
                                    value={
                                      materi.kuisMateri[qIndex].options[
                                        option
                                      ] || ""
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
                                <select
                                  className="select select-primary focus:outline-none w-full"
                                  value={question.jawabanBenar}
                                  onChange={(e) =>
                                    handleChange(
                                      materi.id,
                                      "jawabanBenar",
                                      e.target.value,
                                      question.id
                                    )
                                  }
                                >
                                  <option value="">Jawaban Benar</option>
                                  <option value={"A"}>A</option>
                                  <option value={"B"}>B</option>
                                  <option value={"C"}>C</option>
                                  <option value={"D"}>D</option>
                                </select>
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
                        {subMateri[0].fileMateri[index] && (
                          <div className="border p-4 rounded-md">
                            <h3 className="font-semibold mb-2">
                              File yang Dipilih:
                            </h3>
                            <ul className="list-disc list-inside space-y-2">
                              {Object.values(subMateri[0].fileMateri)
                                .flat()
                                .map((fileObj, index) => (
                                  <li
                                    key={index}
                                    className="flex items-center justify-between space-x-2 p-2 border rounded-md"
                                  >
                                    <div className="flex items-center space-x-2">
                                      {getFileIcon(fileObj.name)}
                                      <span className="text-gray-700">
                                        {fileObj.name}
                                      </span>
                                      {fileObj.isUploaded ? (
                                        <a
                                          href={`${BASE_URL}${fileObj.url}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-blue-500 hover:text-blue-700"
                                        >
                                          <FaEye />
                                        </a>
                                      ) : (
                                        ""
                                      )}
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
                <FontAwesomeIcon className="text-2xl" icon={faPaperPlane} />{" "}
                Kirim
              </button>
            </div>
          </div>
          <Footer />
        </>
      ) : null}
    </div>
  );
};

export default TambahMateri;
