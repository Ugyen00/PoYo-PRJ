import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className='home-container'>
      <div className='home-header flex items-center justify-between bg-white w-full h-20'>

        <img
          src='../../utils/images/logo.png'
          alt='Logo'
          className='home-logo p-0 m-0 ml-20'
        />
        <div className="flex space-x-4 mr-14">
          <Link to='/yogaclass'>
            <button className="btn start-btn py-2 px-1 m-1 text-black text-sm cursor-pointer">Yoga Class</button>
          </Link>
          <Link to='/start'>
            <button className="btn start-btn py-2 px-1 m-1 text-black text-sm cursor-pointer">Live Session</button>
          </Link>
          <Link to='/about'>
            <button className="btn start-btn py-2 px-1 m-1 text-black text-sm cursor-pointer">
              About Us
            </button>
          </Link>
          <Link to='/profile'>
            <button className="btn start-btn py-2 px-1 m-1 text-black text-sm cursor-pointer">Profile</button>
          </Link>
        </div>
      </div>
      <div className="home-main bg-cover bg-no-repeat">
        <div className="btn-section absolute left-1/2 transform -translate-x-1/2 top-2/3">
          <img src='../../utils/images/hero.svg' alt='' className='w-full' />
        </div>
      </div>
    </div>
  )
}


