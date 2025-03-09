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

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/matakuliah"
            element={
              <ProtectedRoute>
                <Matkul />
              </ProtectedRoute>
            }
          />
          <Route
            path="/materi"
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
            path="/mengelolamateri"
            element={
              <ProtectedRoute>
                <MengelolaMateri />
              </ProtectedRoute>
            }
          />
          <Route
            path='/tambahmateri/:id/:idSubMateri?'
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
