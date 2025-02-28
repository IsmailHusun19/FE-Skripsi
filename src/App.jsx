import { useState } from 'react';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Matkul from './pages/Matkul';
import Materi from './pages/Materi';
import Profile from './component/Profile';
import EditorConfig from './component/EditorConfig';
import MengelolaMateri from './pages/MengelolaMateri';
import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { Confirm } from 'notiflix/build/notiflix-confirm-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { Block } from 'notiflix/build/notiflix-block-aio';

import './style/App.css'
import TambahMateri from './pages/TambahMateri';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/matakuliah' element={<Matkul/>}/>
          <Route path='/materi' element={<Materi/>}/>
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/mengelolamateri' element={<MengelolaMateri/>}/>
          <Route path='/tambahmateri' element={<TambahMateri/>}/>

        </Routes>
      </Router>
    </>
  )
}

export default App;
