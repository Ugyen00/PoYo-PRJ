import React from 'react';
import { tutorials, fixCamera } from '../../utils/data';
import NavBar from '../../components/NavBar';

export default function Yogoclass() {
    return (
        <div>
            <NavBar />
            <div className="flex flex-col items-center justify-center min-h-screen py-20">
                <h1 className="text-4xl md:text-6xl text-black font-semibold mb-8">Basic Tutorials</h1>
                <div className="w-3/4 md:w-1/2">
                    {tutorials.map((tutorial, index) => (
                        <p key={index} className="text-black text-lg md:text-xl mb-4">{tutorial}</p>
                    ))}
                </div>
                <h1 className="text-4xl md:text-6xl text-black font-semibold mt-12 mb-8">Camera Not Working?</h1>
                <div className="w-3/4 md:w-1/2">
                    {fixCamera.map((points, index) => (
                        <p key={index} className="text-black text-lg md:text-xl mb-4">{points}</p>
                    ))}
                </div>
            </div>
        </div>
    );
}
