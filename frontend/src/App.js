import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'


import Home from './pages/Home/Home'
import Yoga from './pages/Yoga/Yoga'
import About from './pages/About/About'
import Yogaclass from './pages/YogaClass/Yogaclass'
import Profile from './pages/Profile/Profile'

import './App.css'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/start' element={<Yoga />} />
        <Route path='/about' element={<About />} />
        <Route path='/yogaclass' element={<Yogaclass />} />
      </Routes>
    </Router>
  )
}
