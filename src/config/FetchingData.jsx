import axios from "axios";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import { Report } from "notiflix/build/notiflix-report-aio";
import { BASE_URL } from "../utils/config";

const fetchMateri = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/materi/${id}`, {
      withCredentials: true,
    });
    if (response.status !== 200) {
      throw new Error("Gagal mengambil data materi");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching materi:", error);
    return null;
  }
};

const fetchSubMateri = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/sub-materi/${id}`, {
      withCredentials: true,
    });

    // Periksa apakah status bukan 2xx
    if (response.status !== 200) {
      throw new Error("Gagal mengambil data materi");
    }

    return response.data; // Data sudah dalam format JSON
  } catch (error) {
    console.error("Error fetching materi:", error);
    return null;
  }
};

const getMataKuliah = async (id) => {
  try{
    const response = await axios.get(`${BASE_URL}/mata-kuliah/${id}`, {
      withCredentials: true,
    })
    return response.data
  }catch(error) {
    console.error(error)
    navigate('/errorpage')
  }
}

const getAllMataKuliah = async () => {
  try{
    const response = await axios.get(`${BASE_URL}/mata-kuliah`, {
      withCredentials: true,
    })
    return response.data
  }catch(error) {
    console.error(error)
    navigate('/errorpage')
  }
}

const getUserCheck = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/`, {
      withCredentials: true,
    });
    const responseId = await axios.get(
      `${BASE_URL}/users/${response.data.userInfo.id}`,
      {
        withCredentials: true,
      }
    );
    return responseId.data
  } catch(error) {
    console.error(error)
  }
}

const getDataDetailSubMateri = async (idSubMateri) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/sub-materi/detail/${idSubMateri}`,
      {
        withCredentials: true,
      }
    );
    return response.data
  } catch (error) {
    Notify.failure("Selesaikan materi sebelumnya terlebih dahulu");
    console.error(error);
    return undefined;
  }
};

const getDataDetailProgresMahasiswa = async (idMatkul, idMahasiswa) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/progress/terakhir/${idMatkul}/${idMahasiswa}`,
      {
        withCredentials: true,
      }
    );
    return response.data
  } catch (error) {
    console.error(error);
  }
}

const postDataProgress = async (idSubMateri) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/sub-materi/selesai/${idSubMateri}`, {},
        {
          withCredentials: true,
        }
      );
      return response.data
    } catch (error) {
      console.error(error);
      return undefined;
    }
}

const getMengerjakanSoalKuis = async (idMahasiswa, idSubMateri, idMengerjakanKuis) => {
  try{
    const response = await axios.get(`${BASE_URL}/kuis/${idMahasiswa}/${idSubMateri}/${idMengerjakanKuis}`, {
      withCredentials: true,
    })
    return response.data
  }catch(error){
    console.error(error)
  }
}

const mulaiKuis = async (idSubMateri) => {
  try{
    const response = await axios.post(`${BASE_URL}/kuis/mulai/${idSubMateri}`, {}, {
      withCredentials : true,
    })
    return response.data
  }catch(error){
    console.log(error)
    return undefined
  }
}

const kirimSoalJawabanKuis = async (idMahasiswa, idSubMateri, jawabanMahasiswa) => {
  try{
    const response = await axios.put(`${BASE_URL}/kuis/selesai/${idSubMateri}`, jawabanMahasiswa, {
      withCredentials: true
    })
    return response.data;
  }catch(error){
    console.error(error)
  }
}

const getDetaiNilaiMahasiswa = async (idSubMateri) => {
  try{
  const response = await axios.get(`${BASE_URL}/jawaban-mahasiswa/kuis/${idSubMateri}`, {
    withCredentials: true
  })
  return response.data
  }catch(error){
    console.error(error)
  }
}

const cekStatusMulaiKuis = async (idSubMateri) => {
  try{
    const response = await axios.get(`${BASE_URL}/kuis/status/${idSubMateri}`, {
      withCredentials: true,
    })
    return response.data
  }catch(error){
    console.error(error)
  }
}

const deleteMatkulDosen = async (idMatkul) => {
  try{
    const response = await axios.delete(`${BASE_URL}/mata-kuliah/${idMatkul}`, {
      withCredentials: true
    })
    return response.data
  }catch(error){
    console.error(error)
  }
}

const deleteMatkulMahasiswa = async (idMatkul) => {
  try{
    const response = await axios.delete(`${BASE_URL}/mata-kuliah/leave/${idMatkul}`, {
      withCredentials: true
    })
    return response.data
  }catch(error){
    console.error(error)
  }
}

const getDataLaporanMahasiswa = async (idMatkul, idMahasiswa, role) => {
  const url = role === "Dosen" || role === "Admin"  ? `${BASE_URL}/laporan/progress/mahasiswa/${idMatkul}/${idMahasiswa}`: `${BASE_URL}/laporan/progress/mahasiswa/${idMatkul}`
  try{
    const response = await axios.get(url, {
      withCredentials: true
    })
    return response.data
  }catch(error){
    console.error(error)
  }
}

const getDataLaporanDataMahasiswa = async (idMatkul, role, idMahasiswa) => {
  const url = role === "Dosen" || role === "Admin" ? `${BASE_URL}/laporan/data/mahasiswa/${idMatkul}/?idMahasiswa=${idMahasiswa}` : `${BASE_URL}/laporan/data/mahasiswa/${idMatkul}`
  try{
    const response = await axios.get(url, {
      withCredentials: true
    })
    return response.data
  }catch(error){
    console.error(error)
  }
}

const PutDataProgressMahasiswa = async (idMatkul) => {
  try{
    const response = await axios.put(`${BASE_URL}/progress/mahasiswa/${idMatkul}`,{}, {
      withCredentials: true
    })

    return response.data
  }catch(error){
    console.error(error)
  }
}

const getDataProgressMahasiswa = async (idMatkul) => {
  try{
    const response = await axios.get(`${BASE_URL}/progress/matakuliah/${idMatkul}/mahasiswa`, {
      withCredentials: true
    })

    return response.data
  }catch(error){
    console.error(error)
  }
}

const putMataKuliah = async (idMatakuliah, newMataKuliah) => {
  const name = {
    nama : newMataKuliah
  }
  try{
    const response = await axios.put(`${BASE_URL}/mata-kuliah/${idMatakuliah}`, name, {
      withCredentials: true
    })
    return response.data
  }catch(error){
    console.error(error)
  }
}

const perbaruiCodeMataKuliah = async (idMatakuliah) => {
  try{
    const response = await axios.put(`${BASE_URL}/mata-kuliah/${idMatakuliah}/update-kode`, {}, {
      withCredentials: true
    })
    return response.data
  }catch(error){
    console.error(error)
  }
}

const deleteMataKuliahMahasiswa = async (idMatakuliah, idMahasiswa) => {
  try{
    const response = await axios.delete(`${BASE_URL}/mata-kuliah/${idMatakuliah}/mahasiswa/${idMahasiswa}`, {
      withCredentials: true
    })
    return response.data
  }catch(error){
    console.error(error)
  }
}

const deleteAllMataKuliahMahasiswa = async (idMatakuliah) => {
  try{
    const response = await axios.delete(`${BASE_URL}/mata-kuliah/${idMatakuliah}/mahasiswa`, {
      withCredentials: true
    })
    return response.data
  }catch(error){
    console.error(error)
  }
}

const getDataKuisionerMahasiswa = async (idMatkul) => {
  try{
    const response = await axios.get(`${BASE_URL}/kuisioner/${idMatkul}`, {
      withCredentials: true
    })

    return response.data.data
  }catch(error){
    console.error(error)
  }
}

const postDataKuisionerMahasiswa = async (idMatkul, dataKuisioner) => {
  try{
    const response = await axios.post(`${BASE_URL}/kuisioner/${idMatkul}`, dataKuisioner, {
      withCredentials: true
    })

    return response.data
  }catch(error){
    console.error(error)
  }
}

const getDataKuisionerDosen = async (idMatkul) => {
  try{
    const response = await axios.get(`${BASE_URL}/kuisioner-dosen/${idMatkul}`, {
      withCredentials: true
    })

    return response.data.data
  }catch(error){
    console.error(error)
  }
}

const getDetailDataKuisionerDosen = async (idMatkul, idKuisioner) => {
  try{
    const response = await axios.get(`${BASE_URL}/kuisioner-dosen/${idMatkul}/${idKuisioner}`, {
      withCredentials: true
    })

    return response.data.data
  }catch(error){
    console.error(error)
  }
}

const putStatusMateri = async (idMateri, status) => {
  try{
    const response = await axios.put(`${BASE_URL}/materi/${idMateri}/status`, {status}, {
      withCredentials: true
    })
    return response
  }catch(error){
    console.error(error)
  }
}

const putProfileMe = async (data) => {
  try{
    const response = await axios.put(`${BASE_URL}/users/me`, data, {
      withCredentials: true
    })
    return response
  }catch(error){
    Report.failure("Edit gagal!", "NPM atau email sudah terdaftar", "Okay", {
      backOverlay: false,
    });
    console.error(error)
  }
}

const postDataHubungiKamiLogin = async (data) => {
  try{
    const response = await axios.post(`${BASE_URL}/hubungikamisesudahlogin`, data, {
      withCredentials: true
    })
    return response
  }catch(error){
    Report.failure("Gagal Mengirim!", "Gagal mengirim data", "Okay", {
      backOverlay: false,
    });
    console.error(error)
  }
}

const postDataHubungiKami = async (data) => {
  try{
    const response = await axios.post(`${BASE_URL}/hubungikami`, data, {
      withCredentials: true
    })
    return response
  }catch(error){
    Report.failure("Gagal Mengirim!", "Gagal mengirim data", "Okay", {
      backOverlay: false,
    });
    console.error(error)
  }
}

const postDuplikatMataKuliah = async (idMataKuliah) => {
  try{
    const response = await axios.post(`${BASE_URL}/mata-kuliah/duplikat/${idMataKuliah}`, {}, {
      withCredentials: true
    })
    return response
  }catch(error){
    console.error(error)
  }
}

const getDataJumlahDashboardAdmin = async () => {
  try{
    const response = await axios.get(`${BASE_URL}/dashboard/counts`, {
      withCredentials: true
    })

    return response
  }catch(error){
    console.error(error)
  }
}

const getAllMahasiswa = async () => {
  try{
    const response = await axios.get(`${BASE_URL}/mahasiswa`, {
      withCredentials: true
    })

    return response
  }catch(error){
    console.error(error)
  }
}

const getMahasiswaById = async (id) => {
  try{
    const response = await axios.get(`${BASE_URL}/mahasiswa/${id}`, {
      withCredentials: true
    })

    return response
  }catch(error){
    console.error(error)
  }
}

const getAllDosen = async () => {
  try{
    const response = await axios.get(`${BASE_URL}/dosen`, {
      withCredentials: true
    })

    return response
  }catch(error){
    console.error(error)
  }
}

const getDosenById = async (id) => {
  try{
    const response = await axios.get(`${BASE_URL}/dosen/${id}`, {
      withCredentials: true
    })

    return response
  }catch(error){
    console.error(error)
  }
}

const postDataDosen = async (data) => {
  try{
    const response = await axios.post(`${BASE_URL}/dosen`, data, {
      withCredentials: true
    })

    return response.data
  }catch(error){
    console.error(error)
  }
}

const putDosen = async (data, id) => {
  try{
    const response = await axios.put(`${BASE_URL}/dosen/${id}`, data, {
      withCredentials: true
    })
    return response
  }catch(error){
    Report.failure("Edit gagal!", "Okay", {
      backOverlay: false,
    });
    console.error(error)
  }
}

const putMahasiswa = async (data, id) => {
  try{
    const response = await axios.put(`${BASE_URL}/mahasiswa/${id}`, data, {
      withCredentials: true
    })
    return response
  }catch(error){
    Report.failure("Edit gagal!", "Okay", {
      backOverlay: false,
    });
    console.error(error)
  }
}

const getAllMataKuliahAdmin = async () => {
  try{
    const response = await axios.get(`${BASE_URL}/matakuliah/admin`, {
      withCredentials: true
    })

    return response
  }catch(error){
    console.error(error)
  }
}

const getAllFeedbackSistem = async () => {
  try{
    const response = await axios.get(`${BASE_URL}/hubungi-kami`, {
      withCredentials: true
    })

    return response
  }catch(error){
    console.error(error)
  }
}

const deleteDosen = async (idDosen) => {
  try{
    const response = await axios.delete(`${BASE_URL}/dosen/${idDosen}`, {
      withCredentials: true
    })
    return response.data
  }catch(error){
    console.error(error)
  }
}

const deleteMahasiswa = async (idMahasiswa) => {
  try{
    const response = await axios.delete(`${BASE_URL}/mahasiswa/${idMahasiswa}`, {
      withCredentials: true
    })
    return response.data
  }catch(error){
    console.error(error)
  }
}

const reqOtp = async (data) => {
  try{
    const response = await axios.post(`${BASE_URL}/request-otp`, data, {
      withCredentials: true
    })

    return response.data
  }catch(error){
    console.error(error)
  }
}

const VerifOtp = async (data) => {
  try{
    const response = await axios.post(`${BASE_URL}/verify-otp`, data, {
      withCredentials: true
    })

    return response.data
  }catch(error){
    console.error(error)
  }
}

const cekIdTokenRisetPassword = async (id) => {
  try{
    const response = await axios.get(`${BASE_URL}/otp/${id}`, {
      withCredentials: true
    })

    return response
  }catch(error){
    console.error(error)
  }
}

const risetPassword = async (data) => {
  try{
    const response = await axios.post(`${BASE_URL}/change-password`, data, {
      withCredentials: true
    })

    return response.data
  }catch(error){
    console.error(error)
  }
}

const postDataTugas = async (data, idMatkul) => {
  try {
    const formData = new FormData();
    formData.append("judul", data.judul);
    formData.append("deskripsi", data.deskripsi);
    formData.append("file", data.file);
    formData.append("deadline", data.deadline);

    const response = await axios.post(
      `${BASE_URL}/tambah-tugas/${idMatkul}`,
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const getTugas = async (idMatkul) => {
  try{
    const response = await axios.get(`${BASE_URL}/tugas/${idMatkul}`, {
      withCredentials: true
    })

    return response
  }catch(error){
    console.error(error)
  }
}

const getDetailTugas = async (idMatkul, idTugas) => {
  try{
    const response = await axios.get(`${BASE_URL}/tugas/detail/${idMatkul}/${idTugas}`, {
      withCredentials: true
    })

    return response
  }catch(error){
    console.error(error)
  }
}

const cekDetailPengumpulanStatusTugasMahasiswa = async (idTugas) => {
  try{
    const response = await axios.get(`${BASE_URL}/tugas/${idTugas}/status`, {
      withCredentials: true
    })

    return response
  }catch(error){
    console.error(error)
  }
}

const mengumpulkanTugas = async (data, idTugas, idMatkul) => {
  try {
    const formData = new FormData();
    formData.append("file", data.file);

    const response = await axios.post(
      `${BASE_URL}/tugas/kumpul/${idMatkul}/${idTugas}`,
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const mengumpulkanTugasUlang = async (data, idTugas, idMatkul) => {
  try {
    const formData = new FormData();
    formData.append("file", data.file);

    const response = await axios.put(
      `${BASE_URL}/tugas/kumpul/${idMatkul}/${idTugas}`,
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const getCekJumlahTugasBelumSelesai = async (idMatkul) => {
  try{
    const response = await axios.get(`${BASE_URL}/cek/tugas/belum-selesai/matakuliah/${idMatkul}`, {
      withCredentials: true
    })

    return response
  }catch(error){
    console.error(error)
  }
}

const editTugas = async (data, idTugas) => {
  try {
    const formData = new FormData();
    formData.append("judul", data.judul);
    formData.append("deskripsi", data.deskripsi);
    formData.append("file", data.file);
    formData.append("deadline", data.deadline);

    const response = await axios.put(
      `${BASE_URL}/edit-tugas/${idTugas}`,
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const deleteTugas = async (idTugas) => {
  try{
    const response = await axios.delete(`${BASE_URL}/hapus-tugas/${idTugas}`, {
      withCredentials: true
    })
    return response.data
  }catch(error){
    console.error(error)
  }
}

const getTugasDikumpulkanDosen = async (idTugas) => {
  try{
    const response = await axios.get(`${BASE_URL}/get-data-pengumpulan-tugas/${idTugas}`, {
      withCredentials: true
    })

    return response
  }catch(error){
    console.error(error)
  }
}

const putNilaiTugas = async (data) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/update-nilai`,
      data,
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
};




export {putNilaiTugas, getTugasDikumpulkanDosen, deleteTugas, editTugas, getCekJumlahTugasBelumSelesai, mengumpulkanTugasUlang, mengumpulkanTugas, cekDetailPengumpulanStatusTugasMahasiswa, getDetailTugas, getTugas, postDataTugas, fetchMateri, risetPassword, cekIdTokenRisetPassword, VerifOtp, reqOtp, deleteMahasiswa, deleteDosen, postDataDosen, getAllFeedbackSistem, getAllMataKuliahAdmin, getMahasiswaById, putMahasiswa, putDosen, getDosenById, getAllDosen, getAllMahasiswa, getDataJumlahDashboardAdmin, postDuplikatMataKuliah, getAllMataKuliah, fetchSubMateri, getMataKuliah, getUserCheck, getDataDetailSubMateri, getDataDetailProgresMahasiswa, postDataProgress, getMengerjakanSoalKuis, mulaiKuis, kirimSoalJawabanKuis, getDetaiNilaiMahasiswa, cekStatusMulaiKuis, deleteMatkulDosen, deleteMatkulMahasiswa, getDataLaporanMahasiswa, getDataLaporanDataMahasiswa, PutDataProgressMahasiswa, getDataProgressMahasiswa, putMataKuliah, perbaruiCodeMataKuliah, deleteMataKuliahMahasiswa,deleteAllMataKuliahMahasiswa, getDataKuisionerMahasiswa, postDataKuisionerMahasiswa, getDataKuisionerDosen, getDetailDataKuisionerDosen, putStatusMateri, putProfileMe, postDataHubungiKamiLogin, postDataHubungiKami }