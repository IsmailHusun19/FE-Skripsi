import { useState } from "react";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Matkul from "./pages/Matkul";
import Materi from "./pages/Materi";
import Profile from "./component/Profile";
import EditorConfig from "./component/EditorConfig";
import MengelolaMateri from "./pages/MengelolaMateri";
import Notiflix from "notiflix";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import { Report } from "notiflix/build/notiflix-report-aio";
import { Confirm } from "notiflix/build/notiflix-confirm-aio";
import { Loading } from "notiflix/build/notiflix-loading-aio";
import { Block } from "notiflix/build/notiflix-block-aio";

import "./style/App.css";
import TambahMateri from "./pages/TambahMateri";
import ProtectedRoute from "./component/ProtectedRoute";
import ErrorPage from "./pages/ErrorPage";
import ScrollToTop from "./component/ScrollTop";
import SoalKuis from "./pages/SoalKuis";
import Laporan from "./pages/LaporanMahasiswa";

function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<ErrorPage />} />
          <Route
            path="/matakuliah"
            element={
              <ProtectedRoute>
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
              <ProtectedRoute>
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
            path="/tambahmateri/:idMataKuliah/:idMateri/:idSubMateri?"
            element={
              <ProtectedRoute>
                <TambahMateri />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
