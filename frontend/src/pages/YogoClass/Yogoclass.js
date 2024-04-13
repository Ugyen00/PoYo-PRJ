import React from 'react'

import './Yogoclass.css'

import { tutorials, fixCamera } from '../../utils/data'

export default function Tutorials() {
    return (
        <div className="yogoclass-container">
            <h1 className="yogoclass-heading">Basic Tutorials</h1>
            <div className="yogoclass-content-container">
                {tutorials.map((tutorial) => (
                    <p className="yogoclass-content">{tutorial}</p>
                ))}
            </div>
            <h1 className="yogoclass-heading">Camera Not Working?</h1>
            <div className="yogoclass-content-container">
                {fixCamera.map((points) => (
                    <p className="yogoclass-content">{points}</p>
                ))}
            </div>

        </div>
    )
}
