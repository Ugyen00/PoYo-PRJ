import React from 'react'
import NavBar from '../../components/NavBar'
import Landing from '../../components/Landing'
import Benifits from '../../components/Benifits'
import Footer from '../../components/Footer'


export default function Home() {
  return (
    <div>
      <NavBar />
      <Landing />
      <div><Benifits /></div>
      <div><Footer /></div>
    </div>
  )
}
