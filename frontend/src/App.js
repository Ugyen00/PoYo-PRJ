import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'


import Home from './pages/Home/Home'
import Yoga from './pages/Yoga/Yoga'
import About from './pages/About/About'
import Yogaclass from './pages/YogaClass/Yogaclass'
import Profile from './pages/Profile/Profile'

import './App.css'
import Signup from './pages/Forms/Signup'
import Login from './pages/Forms/Login'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/yoga' element={<Yoga />} />
        <Route path='/about' element={<About />} />
        <Route path='/yogaclass' element={<Yogaclass />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </Router>
  )
}
