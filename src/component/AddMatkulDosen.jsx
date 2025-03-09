import { useState, useEffect } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import axios from "axios";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import { Report } from "notiflix/build/notiflix-report-aio";

const AddMatkulDosen = ({
  handleButtonClick,
  handleDataUsersCheck,
  editDataMatkul,
  updateDataMatkul,
}) => {
  const [open, setOpen] = useState(true);
  const [name, setName] = useState("");

  const handleName = (event) => {
    setName(event.target.value);
  };

  console.log(editDataMatkul);

  useEffect(() => {
    if (Object.keys(editDataMatkul).length > 0) {
      setName(editDataMatkul.namaMataKuliah);
    } else {
      resetForm();
    }
  }, [editDataMatkul]);

  const resetForm = () => {
    setName("");
  };

  const handleSubmitDosen = async (e) => {
    e.preventDefault();
    const url = editDataMatkul.id
      ? `mata-kuliah/${editDataMatkul.id}`
      : "mata-kuliah";

    try {
      await axios({
        method: editDataMatkul.id ? "put" : "post",
        url: `http://localhost:3000/${url}`,
        data: {
          nama: name,
        },
        withCredentials: true,
      });
      await updateDataMatkul();
      handleButtonClick();
      Notify.success(
        editDataMatkul.id
          ? "Berhasil mengedit mata kuliah"
          : "Berhasil menambah mata kuliah"
      );
    } catch (error) {
      Report.failure("Lengkapi data dengan benar!", "", "Okay", {
        backOverlay: false,
      });
    }
    resetForm();
    editDataMatkul = {};
  };

  const handleSubmitMahasiswa = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/mata-kuliah/join",
        {
          kodeGabung: name,
        },
        {
          withCredentials: true,
        }
      );
      await updateDataMatkul();
      handleButtonClick();
      Notify.success("Berhasil menambah mata kuliah");
    } catch (error) {
      Report.failure("Code gabung mata kuliah salah!", "", "Okay", {
        backOverlay: false,
      });
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(true)} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-[1px]"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-hidden">
        <div className="flex h-screen items-end mt-[40px] justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full mb-14  sm:my-8 sm:w-full sm:max-w-lg "
          >
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <h1 className="font-semibold mb-4">Buat Mata Kuliah</h1>
              {handleDataUsersCheck.role === "Mahasiswa" ? (
                <form className="flex gap-3 items-center w-full" method="POST">
                  <div className="flex gap-4 w-[100%]">
                    <div className="w-full">
                      <input
                        type="text"
                        name="nama"
                        id="name"
                        className="bg-slate-100 border border-gray-300 font-medium text-gray-900 text-sm rounded-lg block w-full p-2.5"
                        placeholder="Masukan code mata kuliah"
                        required
                        value={name}
                        onChange={handleName}
                      />
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={handleSubmitMahasiswa}
                      type="submit"
                      className="block min-w-max rounded-md bg-indigo-600 px-8 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                    >
                      Join
                    </button>
                  </div>
                </form>
              ) : (
                <form className="flex gap-3 items-center w-full" method="POST">
                  <div className="flex gap-4 w-[100%]">
                    <div className="w-full">
                      <input
                        type="text"
                        name="nama"
                        id="name"
                        className="bg-slate-100 border border-gray-300 font-medium text-gray-900 text-sm rounded-lg block w-full p-2.5"
                        placeholder="Tulis nama mata kuliah"
                        required
                        value={name}
                        onChange={handleName}
                      />
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={handleSubmitDosen}
                      type="submit"
                      className="block min-w-max rounded-md bg-indigo-600 px-8 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                    >
                      Simpan
                    </button>
                  </div>
                </form>
              )}
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={handleButtonClick}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Batal
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default AddMatkulDosen;
