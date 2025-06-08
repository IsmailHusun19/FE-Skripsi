import { useState } from "react";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Matkul from "./pages/Matkul";
import Materi from "./pages/Materi";
import Profile from "./component/Profile";
import MengelolaMateri from "./pages/MengelolaMateri";
import "./style/App.css";
import TambahMateri from "./pages/TambahMateri";
import ProtectedRoute from "./component/ProtectedRoute";
import ErrorPage from "./pages/ErrorPage";
import ScrollToTop from "./component/ScrollTop";
import SoalKuis from "./pages/SoalKuis";
import Laporan from "./pages/LaporanMahasiswa";
import DaftarMahasiswaMataKuliah from "./pages/DaftarMahasiswaMataKuliah";
import PenilaianDosendanMatkul from "./pages/PenilaianDosendanMatkul";
import LaporanEvaluasiDosen from "./pages/LaporanEvaluasiDosen";
import DetailLaporanEvaluasi from "./pages/DetailLaporanEvaluasi";
import Dashboard from "./pages/Admin/Dashboard";
import SidebarContextProvider from "./component/Admin/SidebarContextProvider";
import RedirectByRole from "./config/RedirectByRole";
import ProfileAdmin from "./pages/Admin/ProfileAdmin";
import Mahasiswa from "./pages/Admin/Mahasiswa";
import Dosen from "./pages/Admin/Dosen";
import EditDosen from "./pages/Admin/EditDosen";
import EditMahasiswa from "./pages/Admin/EditMahasiswa";
import MataKuliah from "./pages/Admin/MataKuliah";
import DetailMataKuliah from "./pages/Admin/DetailMataKuliah";
import FeedBackMataKuliah from "./pages/Admin/FeedbackMataKuliah";
import ListFeedbackSistem from "./pages/Admin/ListFeedbackMataKuliah";
import DetailFeedbackMataKuliah from "./pages/Admin/DetailFeedbackMataKuliah";
import FeedbackSistem from "./pages/Admin/FeedbackSistem";
import ProgressMahasiswa from "./pages/Admin/ProgressMahasiswa";
import ListProgressMahasiswa from "./pages/Admin/ListProgressMahasiswa";
import DetailProgressMahasiswa from "./pages/Admin/DetailProgressMahasiswa";
import TambahDataDosen from "./pages/Admin/TambahDataDosen";
import LupaPassword from "./pages/LupaPassword";
import CodeLupaPassword from "./pages/CodeLupaPassword";
import RisetPassword from "./pages/RisetPassword";

function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<RedirectByRole />} />
          <Route path="/login" element={<Login />} />
          <Route path="/lupa-password" element={<LupaPassword />} />
          <Route path="/lupa-password-code/:id" element={<CodeLupaPassword />} />
          <Route path="/riset-password-code/:id" element={<RisetPassword />} />

          <Route path="/signup" element={<Signup />} />
          <Route
            path="/admin/home"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <SidebarContextProvider>
                  <Dashboard />
                </SidebarContextProvider>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/profile"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <SidebarContextProvider>
                  <ProfileAdmin />
                </SidebarContextProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/pengguna/mahasiswa"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <SidebarContextProvider>
                  <Mahasiswa />
                </SidebarContextProvider>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/pengguna/dosen"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <SidebarContextProvider>
                  <Dosen />
                </SidebarContextProvider>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/pengguna/dosen/edit/:idDosen"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <SidebarContextProvider>
                  <EditDosen />
                </SidebarContextProvider>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/pengguna/dosen/tambah"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <SidebarContextProvider>
                  <TambahDataDosen />
                </SidebarContextProvider>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/pengguna/mahasiswa/edit/:idMahasiswa"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <SidebarContextProvider>
                  <EditMahasiswa />
                </SidebarContextProvider>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/matakuliah"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <SidebarContextProvider>
                  <MataKuliah />
                </SidebarContextProvider>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/matakuliah/materi/:idMatkul/:idMateri?/:idSubMateri?"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <SidebarContextProvider>
                  <DetailMataKuliah />
                </SidebarContextProvider>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/pengguna/feedback mata kuliah"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <SidebarContextProvider>
                  <FeedBackMataKuliah />
                </SidebarContextProvider>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/pengguna/feedback mata kuliah/list-feedback/:idMatkul"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <SidebarContextProvider>
                  <ListFeedbackSistem />
                </SidebarContextProvider>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/pengguna/feedback mata kuliah/detail-feedback/:idMatkul/:idKuisioner"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <SidebarContextProvider>
                  <DetailFeedbackMataKuliah />
                </SidebarContextProvider>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/pengguna/feedback Sistem"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <SidebarContextProvider>
                  <FeedbackSistem />
                </SidebarContextProvider>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/progress/mahasiswa"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <SidebarContextProvider>
                  <ProgressMahasiswa />
                </SidebarContextProvider>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/progress/mahasiswa/list-progress/:idMatkul"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <SidebarContextProvider>
                  <ListProgressMahasiswa />
                </SidebarContextProvider>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/progress/mahasiswa/detail-laporan/:idMatkul/:idMahasiswa?"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <SidebarContextProvider>
                  <DetailProgressMahasiswa />
                </SidebarContextProvider>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<ErrorPage />} />
          <Route
            path="/matakuliah"
            element={
              <ProtectedRoute allowedRoles={["Mahasiswa", "Dosen"]}>
                <Matkul />
              </ProtectedRoute>
            }
          />
          <Route
            path="/materi/:idMatkul/:idMateri?/:idSubMateri?"
            element={
              <ProtectedRoute>
                <Materi />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/kuis/:idMatkul/:idMateri/:idSubMateri/:idMengerjakanKuis"
            element={
              <ProtectedRoute>
                <SoalKuis />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mengelolamateri/:idMatkul"
            element={
              <ProtectedRoute allowedRoles={["Dosen", "Admin"]}>
                <MengelolaMateri />
              </ProtectedRoute>
            }
          />
          <Route
            path="/laporan/:idMatkul/:idMahasiswa?"
            element={
              <ProtectedRoute>
                <Laporan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/daftar/mahasiswa/matakuliah/:idMatkul"
            element={
              <ProtectedRoute allowedRoles={["Dosen", "Admin"]}>
                <DaftarMahasiswaMataKuliah />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tambahmateri/:idMataKuliah/:idMateri/:idSubMateri?"
            element={
              <ProtectedRoute allowedRoles={["Dosen"]}>
                <TambahMateri />
              </ProtectedRoute>
            }
          />
          <Route
            path="/penilaian/dosen/matakuliah/:idMatkul"
            element={
              <ProtectedRoute allowedRoles={["Mahasiswa"]}>
                <PenilaianDosendanMatkul />
              </ProtectedRoute>
            }
          />
          <Route
            path="/laporan/evaluasi/dosen/matakuliah/:idMatkul"
            element={
              <ProtectedRoute allowedRoles={["Dosen", "Admin"]}>
                <LaporanEvaluasiDosen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/detail/laporan/evaluasi/dosen/matakuliah/:idMatkul/:idKuisioner"
            element={
              <ProtectedRoute allowedRoles={["Mahasiswa", "Dosen"]}>
                <DetailLaporanEvaluasi />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
