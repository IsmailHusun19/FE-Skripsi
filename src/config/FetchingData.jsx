import axios from "axios";
import { Notify } from "notiflix/build/notiflix-notify-aio";

const fetchMateri = async (id) => {
  try {
    const response = await axios.get(`http://localhost:3000/materi/${id}`, {
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
    const response = await axios.get(`http://localhost:3000/sub-materi/${id}`, {
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
    const response = await axios.get(`http://localhost:3000/mata-kuliah/${id}`, {
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
    const response = await axios.get("http://localhost:3000/", {
      withCredentials: true,
    });
    const responseId = await axios.get(
      `http://localhost:3000/users/${response.data.userInfo.id}`,
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
      `http://localhost:3000/sub-materi/detail/${idSubMateri}`,
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
      `http://localhost:3000/progress/terakhir/${idMatkul}/${idMahasiswa}`,
      {
        withCredentials: true,
      }
    );
    return response.data.progress
  } catch (error) {
    console.error(error);
  }
}

const postDataProgress = async (idSubMateri) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/sub-materi/selesai/${idSubMateri}`, {},
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
    const response = await axios.get(`http://localhost:3000/kuis/${idMahasiswa}/${idSubMateri}/${idMengerjakanKuis}`, {
      withCredentials: true,
    })
    return response.data
  }catch(error){
    console.error(error)
  }
}

const mulaiKuis = async (idSubMateri) => {
  try{
    const response = await axios.post(`http://localhost:3000/kuis/mulai/${idSubMateri}`, {}, {
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
    const response = await axios.put(`http://localhost:3000/kuis/selesai/${idSubMateri}`, jawabanMahasiswa, {
      withCredentials: true
    })
    return response.data;
  }catch(error){
    console.error(error)
  }
}

const getDetaiNilaiMahasiswa = async (idSubMateri) => {
  try{
  const response = await axios.get(`http://localhost:3000/jawaban-mahasiswa/kuis/${idSubMateri}`, {
    withCredentials: true
  })
  return response.data
  }catch(error){
    console.error(error)
  }
}

const cekStatusMulaiKuis = async (idSubMateri) => {
  try{
    const response = await axios.get(`http://localhost:3000/kuis/status/${idSubMateri}`, {
      withCredentials: true,
    })
    return response.data
  }catch(error){
    console.error(error)
  }
}

const deleteMatkulDosen = async (idMatkul) => {
  try{
    const response = await axios.delete(`http://localhost:3000/mata-kuliah/${idMatkul}`, {
      withCredentials: true
    })
    return response.data
  }catch(error){
    console.error(error)
  }
}

const deleteMatkulMahasiswa = async (idMatkul) => {
  try{
    const response = await axios.delete(`http://localhost:3000/mata-kuliah/leave/${idMatkul}`, {
      withCredentials: true
    })
    return response.data
  }catch(error){
    console.error(error)
  }
}

const getDataLaporanMahasiswa = async (idMatkul) => {
  try{
    const response = await axios.get(`http://localhost:3000/laporan/progress/mahasiswa/${idMatkul}`, {
      withCredentials: true
    })
    return response.data
  }catch(error){
    console.error(error)
  }
}

const getDataLaporanDataMahasiswa = async (idMatkul, role, idMahasiswa) => {
  console.log(role)
  const url = role === "Dosen" ? `http://localhost:3000/laporan/data/mahasiswa/${idMatkul}/?idMahasiswa=${idMahasiswa}` : `http://localhost:3000/laporan/data/mahasiswa/${idMatkul}`
  try{
    const response = await axios.get(url, {
      withCredentials: true
    })
    return response.data
  }catch(error){
    console.error(error)
  }
}


export {fetchMateri, fetchSubMateri, getMataKuliah, getUserCheck, getDataDetailSubMateri, getDataDetailProgresMahasiswa, postDataProgress, getMengerjakanSoalKuis, mulaiKuis, kirimSoalJawabanKuis, getDetaiNilaiMahasiswa, cekStatusMulaiKuis, deleteMatkulDosen, deleteMatkulMahasiswa, getDataLaporanMahasiswa, getDataLaporanDataMahasiswa }