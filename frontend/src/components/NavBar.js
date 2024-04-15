import React from 'react'
import { Link } from 'react-router-dom'

export default function NavBar() {
    return (
        <div>
            <div className='flex items-center justify-between bg-white w-full h-20 fixed top-0 z-50 px-56 shadow-lg'>
                <img
                    src='/images/logo.png'
                    alt='Logo'
                    className='h-10 p-0 m-0 '
                />
                <div className="flex space-x-4">
                    <Link to='/yogaclass'>
                        <button className="py-2 px-1 m-1 text-black text-sm cursor-pointer">Yoga Class</button>
                    </Link>
                    <Link to='/yoga'>
                        <button className="py-2 px-1 m-1 text-black text-sm cursor-pointer">Live Session</button>
                    </Link>
                    <Link to='/about'>
                        <button className="py-2 px-1 m-1 text-black text-sm cursor-pointer">
                            About Us
                        </button>
                    </Link>
                    <Link to='/profile'>
                        <button className="py-2 px-1 m-1 text-black text-sm cursor-pointer">Profile</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
