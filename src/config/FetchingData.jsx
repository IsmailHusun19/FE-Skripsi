import axios from "axios";
const fetchMateri = async (id) => {
  try {
    const response = await axios.get(`http://localhost:3000/materi/${id}`, {
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


export {fetchMateri, fetchSubMateri}