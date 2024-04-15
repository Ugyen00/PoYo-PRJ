import React from 'react'
import Slider2 from './Slider2'

const Yogapose = () => {
    return (
        <div
            className="w-full h-auto bg-cover bg-center relative"
            style={{ backgroundImage: `url('/images/yogapose.svg')` }}
        >
            {/* Title Image */}
            <img
                src="/images/yogapose_title.svg"
                alt="Title Image"
                width={400}
                height={100}
                className="absolute top-10 left-0 right-0 mx-auto"
            />

            {/* Slider Component */}
            <div className="relative py-16">
                <Slider2 />
            </div>

            {/* See More Button */}
            <button
                className="bg-[#3A5A40] hover:bg-[#242F2A] text-white font-bold py-2 px-4 rounded absolute bottom-10 left-1/2 transform -translate-x-1/2"
                onClick={() => console.log("See More clicked")}
            >
                See More
            </button>
        </div>
    );
};

export default Yogapose;



